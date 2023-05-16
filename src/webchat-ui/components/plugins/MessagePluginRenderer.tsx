import * as React from "react";
import { IMessage } from "../../../common/interfaces/message";
import { MessagePlugin } from "../../../common/interfaces/message-plugin";
import { MessageSender } from "../../interfaces";
import { IWebchatConfig } from "@cognigy/webchat-client/lib/interfaces/webchat-config";
import { getPluginsForMessage } from "../../../plugins/helper";
import MessageRow from "../presentational/MessageRow";
import Avatar from "../presentational/Avatar";
import { styled, IWebchatTheme } from "../../style";
import "../../../assets/style.css";

export interface MessageProps extends React.HTMLProps<HTMLDivElement> {
  message: IMessage;
  config: IWebchatConfig;
  onSendMessage: MessageSender;
  onSetFullscreen?: () => void;
  onDismissFullscreen?: () => void;
  onEmitAnalytics: (name: string, payload?: any) => void;
  plugins: MessagePlugin[];
  isFullscreen?: boolean;
  webchatTheme: IWebchatTheme;
}

const FullWidthMessageRow = styled.div(({ theme }) => ({
  flexShrink: 0,
  marginTop: theme.unitSize,
  marginBottom: theme.unitSize,
  paddingTop: theme.unitSize,
  paddingBottom: theme.unitSize,
}));

export default ({
  message,
  config,
  onSendMessage,
  plugins,
  isFullscreen,
  onSetFullscreen,
  onDismissFullscreen,
  webchatTheme,
  onEmitAnalytics,
  ...props
}: MessageProps): JSX.Element => {
  const attributes = Object.keys(props).length > 0 ? props : undefined;

  const matchedPlugins = getPluginsForMessage(plugins, config)(message);
  const source = message.source;

  const className = (() => {
    switch (source) {
      case "user":
        return "webchat-message-row user";

      case "bot":
        return "webchat-message-row bot";

      case "agent":
        return "webchat-message-row agent";

      case "engagement":
        return "webchat-message-row engagement";
      
      default:
        return "webchat-message-row";
    }
  })();

  const avatarClassName = (() => {
    switch (source) {
      case "user":
        return "webchat-avatar user";

      case "bot":
        return "webchat-avatar bot";

      case "agent":
        return "webchat-avatar agent";

      case "engagement":
        return "webchat-avatar engagement";
      
      default:
        return "webchat-avatar";
    }
  })();

  const align = (() => {
    switch (source) {
      case "user":
        return "right";

      case "bot":
      case "agent":
      case "engagement":
      default: 
        return "left"
    }
  })();

  const messageSource = (() => {
    switch (source) {
      case "user":
        return "I say: ";

      case "bot":
        return "Bot says: ";

      case "agent":
        return "Agent says: ";

      case "engagement":
        return "Bot says: ";

      default: 
        return "Message says: "
    }
  })();

  return (
    <>
      {matchedPlugins.map(
        ({ component: Component, options, name = "unknown" }, index) => {
          const emitAnalytics = (event: string, payload?: any) =>
            onEmitAnalytics(`plugin/${name}/${event}`, payload);

          const messageElement = (
            <Component
              key={index}
              config={config}
              message={message}
              onSendMessage={onSendMessage}
              onSetFullscreen={onSetFullscreen}
              onDismissFullscreen={onDismissFullscreen}
              attributes={attributes}
              isFullscreen={isFullscreen}
              theme={webchatTheme}
              onEmitAnalytics={emitAnalytics}
            />
          );

          const key = `${index}:${JSON.stringify(message)}`;

          if (isFullscreen) {
            return messageElement;
          }

          if (options && options.fullwidth) {
            return (
              <FullWidthMessageRow className={className} key={key}>
                {messageElement}
              </FullWidthMessageRow>
            );
          }

          return (
            <MessageRow key={key} align={align} className={className}>		
                <Avatar src={message.avatarUrl as string} className={avatarClassName} aria-label={messageSource}/>
                {messageElement}
            </MessageRow>
          );
        }
      )}
    </>
  );
};
