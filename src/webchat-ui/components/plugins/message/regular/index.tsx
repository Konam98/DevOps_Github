import * as React from "react";
import {
  MessagePlugin,
  MessageComponentProps
} from "../../../../../common/interfaces/message-plugin";
import { sanitizeHTML } from "../../../../../webchat/helper/sanitize";
import { MarkdownMessageBubble } from "../../../presentational/MarkdownMessageBubble";
import MessageBubble from "../../../presentational/MessageBubble";

const RegularMessage = ({
  message: { text, source },
  config: { settings: { enableGenericHTMLStyling, disableHtmlContentSanitization: disableMessageTextSanitization }}
}: MessageComponentProps) => {
  const className = (() => {
    switch (source) {
      case "bot":
        return "regular-message bot";

      case "user":
        return "regular-message user";

      case "agent":
        return "regular-message agent";

      case "engagement":
        return "regular-message engagement";

      default:
        return "regular-message";
    }
  })();

  const color = (() => {
    switch (source) {
      case 'user':
        return 'default';

      case 'bot':
      case 'agent':
      case 'engagement':
      default:
        return 'primary';
    }
  })();

  const align = (() => {
    switch (source) {
      case 'user':
        return 'right';

      case 'bot':
      case 'agent':
      case 'engagement':
      default:
        return 'left';
    }
  })();

  const MessageBubbleComponent = enableGenericHTMLStyling ? MarkdownMessageBubble : MessageBubble;

  const actualText = text || "";

  const __html = disableMessageTextSanitization ? actualText : sanitizeHTML(actualText);

  return (
    <MessageBubbleComponent
      color={color}
      align={align}
      dangerouslySetInnerHTML={{ __html }}
      className={className}
    />
  );
};

const regularMessagePlugin: MessagePlugin = {
  match: ({ text, source }, config) => {
    // do not render engagement messages unless configured!
    if (source === 'engagement' && !config.settings.showEngagementMessagesInChat) {
      return false;
    }
    
    const hasText = !!text;

    return hasText;
  },
  component: RegularMessage
};

export default regularMessagePlugin;
