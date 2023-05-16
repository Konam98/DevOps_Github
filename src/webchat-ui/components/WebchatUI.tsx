import * as React from 'react';
import { IMessage } from '../../common/interfaces/message';
import Header from './presentational/Header';
import { ThemeProvider } from 'emotion-theming';
import { CacheProvider } from '@emotion/core';
import { IWebchatTheme, createWebchatTheme, styled } from '../style';
import WebchatRoot from './presentational/WebchatRoot';
import { History } from './history/History';
import createCache from '@emotion/cache';
import { isolate } from '../utils/css';
import { MessagePlugin } from '../../common/interfaces/message-plugin';
import FullScreenMessage from './history/FullScreenMessage';
import Input from './plugins/InputPluginRenderer';
import textInputPlugin from './plugins/input/text';
import MessageRow from './presentational/MessageRow';
import MessagePluginRenderer from './plugins/MessagePluginRenderer';
import regularMessagePlugin from './plugins/message/regular';
import { InputPlugin } from '../../common/interfaces/input-plugin';
import stylisRTL from 'stylis-rtl';
import TypingIndicatorBubble from './presentational/TypingIndicatorBubble';
import '../utils/normalize.css';
import { MessageSender } from '../interfaces';
import { ChatScroller } from './history/ChatScroller';
import FAB from './presentational/FAB';
import WebchatWrapper from './presentational/WebchatWrapper';
import ChatIcon from '../assets/baseline-chat-24px.svg';
import CloseIcon from '../assets/baseline-close-24px.svg';
import DisconnectOverlay from './presentational/DisconnectOverlay';
import { IWebchatConfig } from '../../common/interfaces/webchat-config';
import { TTyping } from '../../common/interfaces/typing';
import UnreadMessagePreview from './presentational/UnreadMessagePreview';
import Badge from './presentational/Badge';
import getTextFromMessage from '../../webchat/helper/message';
import notificationSound from '../utils/notification-sound';
import { findReverse } from '../utils/find-reverse';
import "../../assets/style.css";
import TypingIndicator from './history/TypingIndicator';
import RatingDialog from './presentational/RatingDialog';

interface WebchatUIProps {
  messages: IMessage[];
  unseenMessages: IMessage[];
  fullscreenMessage?: IMessage;
  onSetFullscreenMessage: (message: IMessage) => void;
  onDismissFullscreenMessage: () => void;
  onSetUILanguage: () => void;
  onSendMessage: MessageSender;
  config: IWebchatConfig;
  typingIndicator: TTyping;
  open: boolean;
  messagePlugins?: MessagePlugin[];
  inputPlugins: InputPlugin[];
  inputMode: string;
  onSetInputMode: (inputMode: string) => void;
  onClose: () => void;
  onConnect: () => void;
  onToggle: () => void;
  onEmitAnalytics: (event: string, payload?: any) => void;
  onTriggerEngagementMessage: () => void;
  webchatRootProps?: React.ComponentProps<typeof WebchatRoot>;
  webchatToggleProps?: React.ComponentProps<typeof FAB>;
  connected: boolean;
  reconnectionLimit: boolean;
  hasGivenRating: boolean;
  showRatingDialog: boolean;
  onShowRatingDialog: (show: boolean) => void;
  onSetHasGivenRating: () => void;
  customRatingTitle: string;
  screenSize: string;
  screenColor: string;
  detachScreen: boolean;
  customRatingCommentText: string;
}

interface WebchatUIState {
  theme: IWebchatTheme;
  messagePlugins: MessagePlugin[];
  inputPlugins: InputPlugin[];
  /* Initially false, true from the point of first connection */
  hadConnection: boolean;
  lastUnseenMessageText: string;
  wasOpen: boolean;
  screenSize: string;
  detachScreen: boolean;
  screenColor: string;
}

const stylisPlugins = [
  isolate('[data-cognigy-webchat-root]')
];

/**
 * for RTL-layout websites, use the stylis-rtl plugin to convert CSS,
 * e.g. padding-left becomes padding-right etc.
 */
(() => {
  const dir = document.getElementsByTagName('html')[0].attributes['dir'];
  if (dir && dir.value === 'rtl') {
    stylisPlugins.push(stylisRTL);
  }
})();

const styleCache = createCache({
  key: 'cognigy-webchat',
  stylisPlugins
});

const HistoryWrapper = styled(History)(({ theme }) => ({
  overflowY: 'auto',
  flexGrow: 1,
  minHeight: 0,
  height: theme.blockSize
}));

class WebchatUI extends React.PureComponent<React.HTMLProps<HTMLDivElement> & WebchatUIProps, WebchatUIState> {
  state = {
    theme: createWebchatTheme(),
    messagePlugins: [],
    inputPlugins: [],
    hadConnection: false,
    detachScreen: false,
    lastUnseenMessageText: "",
    wasOpen: false,
    screenSize: "",
    screenColor: "",
  };


  history: React.RefObject<ChatScroller>;
  chatToggleButtonRef: React.RefObject<HTMLButtonElement>;
  closeButtonInHeaderRef: React.RefObject<HTMLButtonElement>;
  ratingButtonInHeaderRef: React.RefObject<HTMLButtonElement>;

  private unreadTitleIndicatorInterval: ReturnType<typeof setInterval> | null = null;
  private originalTitle: string = window.document.title;
  private titleType: 'original' | 'unread' = 'original';

  private engagementMessageTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(props) {
    super(props);

    this.history = React.createRef();
    this.chatToggleButtonRef = React.createRef();
    this.closeButtonInHeaderRef = React.createRef();
    this.ratingButtonInHeaderRef = React.createRef();
  }

  static getDerivedStateFromProps(props: WebchatUIProps, state: WebchatUIState): WebchatUIState | null {
    const color = props.config && props.config.settings && props.config.settings.colorScheme;

    if (!!color && color !== state.theme.primaryColor) {
      return {
        ...state,
        theme: createWebchatTheme({ primaryColor: color })
      }
    }

    return null;
  }

  componentDidMount() {
    this.setState({
      inputPlugins: [...this.props.inputPlugins || [], textInputPlugin],
      messagePlugins: [...this.props.messagePlugins || [], regularMessagePlugin]
    });

    if (this.props.config.settings.enableUnreadMessageTitleIndicator) {
      this.initializeTitleIndicator();
    }

    // initialize the engagement message if configured
    this.initializeEngagementMessage();

    if (this.props.open) {
      this.setState({
        wasOpen: true
      });
    }
  }

  componentDidUpdate(prevProps: WebchatUIProps, prevState: WebchatUIState) {
    if (this.props.config.settings.colorScheme !== prevProps.config.settings.colorScheme) {
      this.setState({
        theme: createWebchatTheme({ primaryColor: this.props.config.settings.colorScheme })
      })
    }

    if (!prevState.hadConnection && this.props.connected) {
      this.setState({
        hadConnection: true
      })
    }

    if (prevProps.unseenMessages !== this.props.unseenMessages
      || !prevProps.config.settings.enableUnreadMessagePreview && this.props.config.settings.enableUnreadMessagePreview) {
      const { unseenMessages } = this.props;

      // update the "unseen message preview" text
      if (this.props.config.settings.enableUnreadMessagePreview) {
        let lastUnseenMessageText = '';

        // find the last readable message and remember its text
        const lastReadableUnseenMessage = findReverse(
          this.props.unseenMessages,
          message => !!getTextFromMessage(message)
        );
        if (lastReadableUnseenMessage) {
          lastUnseenMessageText = getTextFromMessage(lastReadableUnseenMessage);
        }

        this.setState({
          lastUnseenMessageText
        });
      }

      // play a notification for unread messages
      if (unseenMessages.length > 0 && this.props.config.settings.enableUnreadMessageSound) {
        notificationSound.play();
      }
    }

    if (prevProps.config.settings.enableUnreadMessagePreview && !this.props.config.settings.enableUnreadMessagePreview) {
      this.setState({ lastUnseenMessageText: "" })
    }

    // initialize the title indicator if configured
    if (
      this.props.config.settings.enableUnreadMessageTitleIndicator
      && this.props.config.settings.enableUnreadMessageTitleIndicator !== prevProps.config.settings.enableUnreadMessageTitleIndicator
    ) {
      this.initializeTitleIndicator();
    }

    // initialize the engagement message if configured
    this.initializeEngagementMessage();

    if (this.props.open && !this.state.wasOpen) {
      this.setState({
        wasOpen: true
      });
    }
  }

  componentWillUnmount() {
    /**
     * this tears down the "unread messages" title indicator
     */
    if (this.unreadTitleIndicatorInterval) {
      clearInterval(this.unreadTitleIndicatorInterval);
      this.unreadTitleIndicatorInterval = null;
    }

    /**
     * this tears down the timeout for an "engagement message"
     */
    if (this.engagementMessageTimeout) {
      clearTimeout(this.engagementMessageTimeout);
      this.engagementMessageTimeout = null;
    }
  }

  /**
   * This triggers the engagement message in case the webchat
   * was not yet open and the history is empty
   */
  triggerEngagementMessage = () => {
    if (this.state.wasOpen || this.props.messages.length > 0)
      return;

    this.props.onTriggerEngagementMessage();
  }

  /**
   * This sets up the "engagement message" timeout.
   * It should only be registered once
   */
  initializeEngagementMessage = () => {
    if (this.engagementMessageTimeout)
      return;

    if (
      this.props.config.settings.engagementMessageText
      && typeof this.props.config.settings.engagementMessageDelay === 'number'
      && this.props.config.settings.engagementMessageDelay >= 0
    ) {
      this.engagementMessageTimeout = setTimeout(this.triggerEngagementMessage, this.props.config.settings.engagementMessageDelay);
    }
  }

  /**
   * This sets up the "unread messages" title indicator interval.
   * It should only be registered once!
   */
  initializeTitleIndicator = () => {
    if (this.unreadTitleIndicatorInterval)
      return;

    this.unreadTitleIndicatorInterval = setInterval(this.toggleTitleIndicator, 1000);
  }

  toggleTitleIndicator = () => {
    if (this.titleType === 'unread') {
      document.title = this.originalTitle;
      this.titleType = 'original';
    } else {
      if (this.props.unseenMessages.length > 0) {
        document.title = `(${this.props.unseenMessages.length}) ${(this.props.unseenMessages.length === 1) ? this.props.config.settings.unreadMessageTitleText : this.props.config.settings.unreadMessageTitleTextPlural}`;
        this.titleType = 'unread';
      }
    }
  }

  sendMessage: MessageSender = (...args) => {
    if (this.history.current) {
      this.history.current.scrollToBottom();
    }

    this.props.onSendMessage(...args);
  }

  renderInput = () => {
    const { inputPlugins } = this.state;

    return (
      <Input
        plugins={inputPlugins}
        messages={this.props.messages}
        onSendMessage={this.sendMessage}
        config={this.props.config}
        onSetInputMode={this.props.onSetInputMode}
        inputMode={this.props.inputMode}
        webchatTheme={this.state.theme}
        onEmitAnalytics={this.props.onEmitAnalytics}
        theme={this.state.theme}
        displayLanguageSelectMenu={this.props.config.settings.bayer.displayLanguageSelectMenu}
        displayInputField={this.props.config.settings.bayer.displayInputField}
      />
    );
  }

  handleReverseTabNavigation = () => {
    const webchatHistoryPanel = document.getElementById("webchatChatHistoryWrapperLiveLogPanel");
    const textMessageInput = document.getElementById("webchatInputMessageInputInTextMode");
    const getStartedButton = document.getElementById("webchatGetStartedButton");
    const webchatInputButtonMenu = document.getElementById("webchatInputButtonMenu");
    if (textMessageInput) {
      textMessageInput.focus();
    } else if (getStartedButton) {
      getStartedButton.focus();
    } else if (webchatInputButtonMenu) {
      webchatInputButtonMenu.focus();
    } else {
      webchatHistoryPanel?.focus();
    }
  }

  handleKeydown = (event) => {
    const { enableFocusTrap, enableRating } = this.props.config.settings;
    const { open } = this.props;

    if (enableFocusTrap && open) {
      /**
       * If the current focused element is the close button(if rating not enabled) or 
       * rating thumbs up/down button (if rating enabled) in chat header, the focus moves
       * to some element outside chat window on 'Shift + Tab' navigation.
       * 
       * In order to trap focus, move focus back to the first element (from the bottom) within chat window 
       * on Shift + Tab navigation.
       * 
       */
      const isCloseButtonAsTarget = event.target === this.closeButtonInHeaderRef?.current;
      const isRatingButtonAsTarget = event.target === this.ratingButtonInHeaderRef?.current;
      if ((!enableRating && isCloseButtonAsTarget) || (enableRating && isRatingButtonAsTarget)) {
        if (event.shiftKey && event.key === "Tab") {
          event.preventDefault();
          this.handleReverseTabNavigation();
        }
      }
      /**
       * If the current focused element is the chat toggle button, the focus moves to some element 
       * outside chat window on 'Tab' navigation.
       * 
       * In order to trap focus, move the focus back to the chat history panel(if rating not enabled) or
       * thumbs up/down rating button (if rating enabled) on Tab navigation.
       * 
       * On Shift + Tab navigation, the focus should move to the first element (from the bottom) within chat window.
       * 
       */
      if (event.target === this.chatToggleButtonRef?.current) {
        if (event.shiftKey && event.key === "Tab") {
          event.preventDefault();
          this.handleReverseTabNavigation();
        } else if (event.key === "Tab") {
          const hasRatingButton = enableRating && (enableRating === "always" || (enableRating === "once" && this.props.hasGivenRating === false));
          if (hasRatingButton) {
            event.preventDefault();
            const webchatHeaderRatingButton = document.getElementById("webchatHeaderOpenRatingDialogButton");
            webchatHeaderRatingButton?.focus();
          } else {
            event.preventDefault();
            const webchatHistoryPanel = document.getElementById("webchatChatHistoryWrapperLiveLogPanel");
            webchatHistoryPanel?.focus();
          }
        }
      }
    }
  }

  handleSendRating = ({ rating, comment }) => {
    if (this.history.current) {
      this.history.current.scrollToBottom();
    }

    this.props.onSendMessage(
      undefined,
      {
        _cognigy: {
          controlCommands: [
            {
              type: "setRating",
              parameters: {
                rating,
                comment,
              }
            }
          ]
        }
      },
      undefined,
    );

    this.props.onSetHasGivenRating();
    this.props.onShowRatingDialog(false);
  };

  smallScreenSize = () => {
    const size = this.props.config.settings.bayer.screenSizeOptions;
    this.setState({
      screenSize: size[0].smallScreenSize
    });
  };

  mediumScreenSize = () => {
    const size = this.props.config.settings.bayer.screenSizeOptions;
    this.setState({
      screenSize: size[1].mediumScreenSize
    });
  };

  largeScreenSize = () => {
    const size = this.props.config.settings.bayer.screenSizeOptions;
    this.setState({
      screenSize: size[2].largeScreenSize
    });
  };

  detachScreenSize = () => {
    this.setState({
      detachScreen: true
    });
  };

  redScreenColor = () => {
    const color = this.props.config.settings.bayer.screenColorOptions;
    this.setState({
      screenColor: color[0].redScreenColor
    });
  };

  blueScreenColor = () => {
    const color = this.props.config.settings.bayer.screenColorOptions;
    this.setState({
      screenColor: color[1].blueScreenColor
    });
  };
  greenScreenColor = () => {
    const color = this.props.config.settings.bayer.screenColorOptions;
    this.setState({
      screenColor: color[2].greenScreenColor
    });
  };

  renderNormalView = () => {
    const { props, state } = this;
    const {
      messages,
      unseenMessages,
      onSendMessage,
      onConnect,
      config,
      open,
      fullscreenMessage,
      typingIndicator,
      onEmitAnalytics,
      onSetInputMode,
      onSetFullscreenMessage,
      onDismissFullscreenMessage,
      onClose,
      onToggle,
      onTriggerEngagementMessage,
      webchatRootProps,
      webchatToggleProps,
      connected,
      reconnectionLimit,
      hasGivenRating,
      showRatingDialog,
      onShowRatingDialog,
      onSetHasGivenRating,
      customRatingTitle,
      customRatingCommentText,
      ...restProps
    } = props;
    const { theme, hadConnection, lastUnseenMessageText } = state;

    const { disableToggleButton, enableConnectionStatusIndicator, ratingTitleText, ratingCommentText, bayer } = config.settings;

    if (!this.props.config.active)
      return null;

    const showDisconnectOverlay = enableConnectionStatusIndicator && !connected && hadConnection;

    const openChatAriaLabel = () => {
      switch (unseenMessages.length) {
        case 0:
          return "Open chat";
        case 1:
          return "One unread message in chat. Open chat";
        default:
          return `${unseenMessages.length} unread messages in chat. Open chat`;
      }
    }

    return (
      <>
        <ThemeProvider theme={theme}>
          {/* <Global styles={cssReset} /> */}
          <WebchatWrapper
            data-cognigy-webchat-root
            {...restProps}
            className="webchat-root"
            aria-labelledby="webchatHeaderTitle"
            role="region"
            onKeyDown={this.handleKeydown}
          >
            <CacheProvider value={styleCache}>
              {open && (
                <WebchatRoot
                  data-cognigy-webchat
                  {...webchatRootProps}
                  id={this.state.screenColor ? this.state.screenColor : bayer.defaultScreenColor}
                  className={this.state.screenSize ? this.state.screenSize : bayer.defaultScreenSize}
                >
                  {!fullscreenMessage
                    ? this.renderRegularLayout()
                    : this.renderFullscreenMessageLayout()
                  }
                  {
                    showRatingDialog &&
                    <RatingDialog
                      onCloseRatingDialog={() => onShowRatingDialog(false)}
                      onSendRating={this.handleSendRating}
                      ratingTitleText={customRatingTitle || ratingTitleText}
                      ratingCommentText={customRatingCommentText || ratingCommentText}
                    />
                  }
                  {showDisconnectOverlay && <DisconnectOverlay onConnect={onConnect} isPermanent={!!reconnectionLimit} onClose={onClose} />}

                </WebchatRoot>

              )}
              {!disableToggleButton && (
                <div>
                  {
                    // Show the message teaser if there is a last bot message and the webchat is closed
                    lastUnseenMessageText && (
                      <UnreadMessagePreview
                        className="webchat-unread-message-preview"
                        onClick={onToggle}
                        aria-live="polite"
                      >
                        <span className="sr-only">New message preview</span>
                        {lastUnseenMessageText}
                      </UnreadMessagePreview>
                    )
                  }

                  <FAB
                    data-cognigy-webchat-toggle
                    onClick={onToggle}
                    {...webchatToggleProps}
                    type='button'
                    className="webchat-toggle-button"
                    aria-label={open ? "Close chat" : openChatAriaLabel()}
                    ref={this.chatToggleButtonRef}
                  >
                    {open ? (
                      <CloseIcon />
                    ) : (
                      <ChatIcon />
                    )}
                    {
                      config.settings.enableUnreadMessageBadge ?
                        <Badge
                          content={unseenMessages.length}
                          className='webchat-unread-message-badge'
                          aria-label={`${unseenMessages.length} unread messages`}
                        />
                        :
                        null
                    }
                  </FAB>
                </div>
              )}
            </CacheProvider>
          </WebchatWrapper>
        </ThemeProvider>
      </>
    )
  }

  renderDetachedWindowView = () => {
    // This console is needed to check location for verification 
    console.log(window.location.href);
    return (
      window.open(window.location.href,"", "width=600, height=600")
      );
  }


  render() {
    if (this.state.detachScreen) {
      return this.renderDetachedWindowView();
    } else {
      return this.renderNormalView();
    }

  }

  renderRegularLayout() {
    const {
      config,
      messages,
      typingIndicator,
      hasGivenRating,
      onShowRatingDialog,
    } = this.props;

    const { enableRating } = config.settings;

    const showRatingButton = enableRating && (enableRating === "always" || (enableRating === "once" && hasGivenRating === false));

    return (
      <>
        <Header
          onClose={this.props.onClose}
          connected={config.active}
          logoUrl={config.settings.headerLogoUrl}
          title={config.settings.title || 'Cognigy Webchat'}
          ratingButtonRef={this.ratingButtonInHeaderRef}
          closeButtonRef={this.closeButtonInHeaderRef}
          showRatingButton={showRatingButton}
          displayNotificationMessage={config.settings.bayer.displayNotificationMessage}
          onRatingButtonClick={() => onShowRatingDialog(true)}
          showMenu1Item={config.settings.bayer.showMenu1MenuItem}
          showMenu1MenuIcon={config.settings.bayer.showMenu1MenuIcon}
          showMenu2Item={config.settings.bayer.showMenu2MenuItem}
          showMenu2MenuIcon={config.settings.bayer.showMenu2MenuIcon}
          showMenu3Item={config.settings.bayer.showMenu3MenuItem}
          showMenu3MenuIcon={config.settings.bayer.showMenu3MenuIcon}
          showMenu3NestedItem1={config.settings.bayer.showMenu3NestedMenu1Item}
          showMenu3NestedItem2={config.settings.bayer.showMenu3NestedMenu2Item}
          showMenu3NestedItem3={config.settings.bayer.showMenu3NestedMenu3Item}
          showMenu3NestedItem4={config.settings.bayer.showMenu3NestedMenu4Item}
          showMenu4Item={config.settings.bayer.showMenu4MenuItem}
          showMenu4MenuIcon={config.settings.bayer.showMenu4MenuIcon}
          showMenu4NestedItem1={config.settings.bayer.showMenu4NestedMenu1Item}
          showMenu4NestedItem2={config.settings.bayer.showMenu4NestedMenu2Item}
          showMenu4NestedItem3={config.settings.bayer.showMenu4NestedMenu3Item}
          showMenu5Item={config.settings.bayer.showMenu5MenuItem}
          showMenu5MenuIcon={config.settings.bayer.showMenu5MenuIcon}
          showMenu6Item={config.settings.bayer.showMenu6MenuItem}
          showMenu6MenuIcon={config.settings.bayer.showMenu6MenuIcon}
          //showMenu7Item={config.settings.bayer.showMenu7MenuItem}
          smallScreenSize={this.smallScreenSize}
          mediumScreenSize={this.mediumScreenSize}
          largeScreenSize={this.largeScreenSize}
          detachScreenSize={this.detachScreenSize}
          redScreenColor={this.redScreenColor}
          blueScreenColor={this.blueScreenColor}
          greenScreenColor={this.greenScreenColor}
          defaultScreenSize={config.settings.bayer.defaultScreenSize}
          defaultScreenColor={config.settings.bayer.defaultScreenColor}
        />
        <HistoryWrapper
          disableBranding={config.settings.disableBranding}
          ref={this.history as any}
          className="webchat-chat-history"
          tabIndex={0}
          role="log"
          aria-live="polite"
          id="webchatChatHistoryWrapperLiveLogPanel"
        >
          <h2 className="sr-only" id="webchatChatHistoryHeading">Chat History</h2>
          {this.renderHistory()}
        </HistoryWrapper>
        {this.renderInput()}
      </>
    )
  }

  renderFullscreenMessageLayout() {
    const {
      config,
      fullscreenMessage,
      onDismissFullscreenMessage,
      onEmitAnalytics
    } = this.props;

    const { messagePlugins } = this.state;

    return (
      <FullScreenMessage
        onSendMessage={this.sendMessage}
        config={config}
        plugins={messagePlugins}
        onSetFullscreen={() => { }}
        onDismissFullscreen={onDismissFullscreenMessage}
        message={fullscreenMessage as IMessage}
        webchatTheme={this.state.theme}
        onEmitAnalytics={onEmitAnalytics}
      />
    )
  }

  renderHistory() {
    const { messages, typingIndicator, config, onEmitAnalytics } = this.props;
    const { messagePlugins = [] } = this.state;

    const { enableTypingIndicator } = config.settings;
    const isTyping = typingIndicator !== 'remove' && typingIndicator !== 'hide';

    return (
      <>
        {messages.map((message, index) => (
          <MessagePluginRenderer
            key={index}
            message={message}
            onSendMessage={this.sendMessage}
            onSetFullscreen={() => this.props.onSetFullscreenMessage(message)}
            onDismissFullscreen={() => { }}
            config={config} plugins={messagePlugins}
            webchatTheme={this.state.theme}
            onEmitAnalytics={onEmitAnalytics}
          />
        ))}
        {enableTypingIndicator && (
          <TypingIndicator active={isTyping} />
        )}
      </>
    )
  }

}

export { WebchatUI, WebchatUIProps };