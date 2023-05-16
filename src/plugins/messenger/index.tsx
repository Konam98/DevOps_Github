
import { MessageComponentProps, MessagePluginFactory } from "../../common/interfaces/message-plugin";
import { getMessengerPreview } from "./MessengerPreview/MessengerPreview";
import { registerMessagePlugin } from '../helper';
import { transformMessage } from "./MessengerPreview/lib/transform";
import { IFBMGenericTemplatePayload } from "./MessengerPreview/interfaces/GenericTemplatePayload.interface";
import { IMessage } from "../../common/interfaces/message";
import { IWebchatConfig } from "../../common/interfaces/webchat-config";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { IFBMURLButton } from "./MessengerPreview/interfaces/Button.interface";

const getMessengerPayload = (message: IMessage, config: IWebchatConfig) => {
    const cognigyData = message.data?._cognigy;

    if (!cognigyData)
        return null;

    const { _facebook, _webchat, syncWebchatWithFacebook } = cognigyData;

    if (config.settings.enableStrictMessengerSync) {
        if (syncWebchatWithFacebook) {
            return _facebook;
        }

        return _webchat;
    }

    return _webchat || _facebook;
}

const isMessengerPayload = (message: IMessage, config: IWebchatConfig) => !!getMessengerPayload(message, config);

// return true if a message is a messenger generic template with more than one element
// one element should be rendered like default
const isFullscreenMessengerGenericPayload = (rawMessage: IMessage, config: IWebchatConfig) => {
    const messengerPayload = getMessengerPayload(rawMessage, config);

    if (!messengerPayload)
        return false;

    const { message } = messengerPayload;
    if (!message)
        return false;

    const { attachment } = message;
    if (!attachment)
        return false;

    const { payload } = attachment;
    if (!payload)
        return false;

    if (payload.template_type !== 'generic')
        return false;

    const { elements } = payload as IFBMGenericTemplatePayload;

    return elements.length > 1;
}

const messengerPlugin: MessagePluginFactory = ({ React, styled }) => {

    const MessengerPreview = getMessengerPreview({ React, styled });

    return ({
        name: 'messenger',
        match: isMessengerPayload,
        component: ({ message, onSendMessage, config, onEmitAnalytics }: MessageComponentProps) => (
            <MessengerPreview
                message={transformMessage(getMessengerPayload(message, config).message)}
                onAction={(e, action) => {
                    onEmitAnalytics('action', action);

                    // @ts-ignore
                    if (action.type === 'postback' || action.content_type === 'text') {
                        // @ts-ignore
                        const { payload, title } = action;

                        // Switch focus to input field if the flag is enabled
                        const textMessageInput = document.getElementById("webchatInputMessageInputInTextMode");
                        if(textMessageInput && config.settings.focusInputAfterPostback) textMessageInput.focus();

                        onSendMessage(payload, null, { label: title });
                    }

                    // @ts-ignore
                    if (action.type === 'web_url' && action.url) {
                        const url = (() => {
                            const { url: buttonUrl } = action as IFBMURLButton;
                            if (config.settings.disableUrlButtonSanitization)
                                return buttonUrl;

                            return sanitizeUrl(buttonUrl)
                        })();

                        // prevent no-ops from sending you to a blank page
                        if (url === 'about:blank') 
                            return;

                        const target = (action as IFBMURLButton).target === "_self" ? "_self" : "_blank";

                        // @ts-ignore
                        window.open(url, target);
                    }
                }}
                config={config}
            />
        )
    })
}


const fullscreenMessengerGenericPlugin: MessagePluginFactory = ({ React, styled }) => {

    const MessengerPreview = getMessengerPreview({ React, styled });

    return ({
        name: 'messenger',
        match: isFullscreenMessengerGenericPayload,
        component: ({ message, onSendMessage, config, onEmitAnalytics }: MessageComponentProps) => (
            <MessengerPreview
                message={transformMessage(getMessengerPayload(message, config).message)}
                onAction={(e, action) => {
                    onEmitAnalytics('action', action);

                    // @ts-ignore
                    if (action.type === 'postback' || action.content_type === 'text') {
                        // @ts-ignore
                        const { payload, title } = action;

                        // Switch focus to input field if the flag is enabled
                        const textMessageInput = document.getElementById("webchatInputMessageInputInTextMode");
                        if(textMessageInput && config.settings.focusInputAfterPostback) textMessageInput.focus();

                        onSendMessage(payload, null, { label: title });
                    }

                    // @ts-ignore
                    if (action.type === 'web_url') {
                        // @ts-ignore
                        window.open(action.url, action.target === "_self" ? "_self" : "_blank");
                    }
                }}
                config={config}
            />
        ),
        options: {
            fullwidth: true
        }
    })
}

registerMessagePlugin(fullscreenMessengerGenericPlugin);
registerMessagePlugin(messengerPlugin);

// export default messengerPlugin;
