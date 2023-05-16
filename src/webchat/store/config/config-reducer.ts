import { Reducer } from "redux";
import {
  IWebchatConfig,
  IWebchatSettings,
} from "../../../common/interfaces/webchat-config";

export type ConfigState = IWebchatConfig;

const getInitialState = (): ConfigState => ({
  URLToken: "",
  active: false,
  settings: {
    agentAvatarUrl: "",
    backgroundImageUrl: "",
    colorScheme: "",
    designTemplate: 1,
    disableBranding: false,
    disableHtmlInput: false,
    disableInputAutofocus: false,
    disableHtmlContentSanitization: false,
    disableInputAutocomplete: false,
    disableInputAutogrow: false,
    disableLocalStorage: false,
    disablePersistentHistory: false,
    disableTextInputSanitization: false,
    disableToggleButton: false,
    dynamicImageAspectRatio: false,
    enableConnectionStatusIndicator: true,
    showEngagementMessagesInChat: false,
    enableAutoFocus: false,
    enableInjectionWithoutEmptyHistory: false,
    enableFileUpload: false,
    enableFocusTrap: false,
    enableGenericHTMLStyling: false,
    enablePersistentMenu: false,
    enableSTT: false,
    enableStrictMessengerSync: false,
    disableUrlButtonSanitization: false,
    enableTTS: false,
    enableTypingIndicator: false,
    enableUnreadMessageBadge: false,
    enableUnreadMessagePreview: false,
    enableUnreadMessageSound: false,
    enableUnreadMessageTitleIndicator: false,
    engagementMessageText: "",
    engagementMessageDelay: 5000,
    focusInputAfterPostback: false,
    getStartedButtonText: "",
    getStartedPayload: "",
    getStartedText: "",
    headerLogoUrl: "",
    ignoreLineBreaks: false,
    inputPlaceholder: "",
    inputAutogrowMaxRows: 5,
    messageDelay: 1000,
    messageLogoUrl: "",
    persistentMenu: {
      title: "",
      menuItems: [],
    },
    ratingCommentText: "Feel free to leave a comment.",
    ratingMessageHistoryCommentText: "You commented:",
    ratingMessageHistoryRatingText: "You gave the following rating:",
    ratingTitleText: "Please rate your chat experience",
    startBehavior: "none",
    STTLanguage: "",
    title: "",
    unreadMessageTitleText: "New Message",
    unreadMessageTitleTextPlural: "New Messages",
    userAvatarUrl: "",
    useSessionStorage: false,
    bayer: {
      showMenu1MenuItem: true,
      showMenu1MenuIcon: '',
      showMenu2MenuItem: true,
      showMenu2MenuIcon: '',
      showMenu3MenuItem: true,
      showMenu3MenuIcon: '',
      showMenu4MenuItem: true,
      showMenu4MenuIcon: '',
      showMenu5MenuItem: true,
      showMenu5MenuIcon: '',
      showMenu6MenuItem: true,
      showMenu6MenuIcon: '',
      //showMenu7MenuItem: true,
      displayLanguageSelectMenu:true,
      sendLanguageAsText: false,
      defaultLanguage: '',
      languageOptions: [
          {
              code: 'en',
              ariaLabel: 'english',
              title: 'English',
              flagLink:'./images/flags/England.png'

          }
      ]
   }
  },
});

export const SET_CONFIG = "SET_CONFIG";
export const setConfig = (config: ConfigState) => ({
  type: SET_CONFIG as "SET_CONFIG",
  config,
});
export type SetConfigAction = ReturnType<typeof setConfig>;

export const UPDATE_SETTINGS = "UPDATE_SETTINGS";
export const updateSettings = (payload: Partial<IWebchatSettings>) => ({
  type: UPDATE_SETTINGS as "UPDATE_SETTINGS",
  payload,
});
export type UpdateSettingsAction = ReturnType<typeof updateSettings>;

export const config: Reducer<
  ConfigState,
  SetConfigAction | UpdateSettingsAction
> = (state = getInitialState(), action) => {
  switch (action.type) {
    case "SET_CONFIG": {
      return {
        ...state,
        ...action.config,
        settings: {
          ...state.settings,
          ...action.config.settings,
          bayer: {
            ...state.settings.bayer,
            ...(action.config.settings.bayer || {})
        }
        },
      };
    }
    case "UPDATE_SETTINGS": {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    }
  }

  return state;
};
