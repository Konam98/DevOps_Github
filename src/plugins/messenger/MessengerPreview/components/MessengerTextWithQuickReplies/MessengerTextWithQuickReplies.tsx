import { useEffect } from 'react';
import { IFBMRegularMessage } from '../../interfaces/Message.interface';
import {
    IFBMTextQuickReply,
    IFBMQuickReply
} from '../../interfaces/QuickReply.interface';
import { getMessengerQuickReply } from '../MessengerQuickReply';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { IWebchatConfig } from '../../../../../common/interfaces/webchat-config';
import { getMessengerBubble } from '../MessengerBubble';
import { useRandomId } from '../../../../../common/utils/randomId';
import { sanitizeHTML } from '../../../../../webchat/helper/sanitize';

interface Props extends IWithFBMActionEventHandler {
    message: IFBMRegularMessage;
    config: IWebchatConfig;
}

export const getMessengerTextWithQuickReplies = ({
    React,
    styled
}: MessagePluginFactoryProps) => {
    const MessengerQuickReply = getMessengerQuickReply({ React, styled });
    const MessengerBubble = getMessengerBubble({ React, styled });

    const BorderBubble = styled(MessengerBubble)(({ theme }) => ({
        border: `1px solid ${theme.greyColor}`
    }));

    const QuickReplies = styled.div({
        textAlign: "center",

        margin: -5,
        marginTop: 3,
        flexWrap: "wrap",

        "&>*": {
            margin: 5
        }
    });

    const QuickReplyImage = styled.img(({ theme }) => ({
        width: theme.unitSize * 3,
        height: theme.unitSize * 3,
        marginRight: theme.unitSize
    }));

    const MessengerTextWithQuickReplies = ({
        message,
        onAction,
        config,
        ...divProps
    }: Props & React.HTMLProps<HTMLDivElement>) => {
        const { text, quick_replies } = message;

        const hasQuickReplies = quick_replies && quick_replies.length > 0;
        const hasMoreThanOneQuickReply = quick_replies && quick_replies.length > 1;
        const webchatQuickReplyTemplateButtonId = useRandomId("webchatQuickReplyTemplateButton");
        const webchatQuickReplyTemplateHeaderId = useRandomId("webchatQuickReplyTemplateHeader");
        const buttonGroupAriaLabelledby = text ? webchatQuickReplyTemplateHeaderId : undefined;
        const a11yProps = hasMoreThanOneQuickReply ? 
            {role: "group", "aria-labelledby": buttonGroupAriaLabelledby } : {};

        // TODO add click behaviour

        useEffect(() => {
            const chatHistory = document.getElementById("webchatChatHistoryWrapperLiveLogPanel");
            const quickReplyButton = document.getElementById(`${webchatQuickReplyTemplateButtonId}-0`);

            if(!config?.settings.enableAutoFocus) return;

            if(!chatHistory?.contains(document.activeElement)) return;

            setTimeout(() => {quickReplyButton?.focus()}, 200);
        }, []);

        const __html = config.settings.disableHtmlContentSanitization ? text : sanitizeHTML(text);

        return (
            <div {...divProps} className="webchat-quick-reply-template-root">
                <BorderBubble
                    className="webchat-quick-reply-template-header-message"
                    dangerouslySetInnerHTML={{ __html }}
                    id={webchatQuickReplyTemplateHeaderId}
                ></BorderBubble>

                {hasQuickReplies && (
                    <QuickReplies className="webchat-quick-reply-template-replies-container" {...a11yProps}>
                        {(quick_replies as IFBMQuickReply[]).map((quickReply, index) => {
                            const { content_type } = quickReply;
                            let label: string = "";
                            let image: React.ReactNode;

                            switch (content_type) {
                                case "location": {
                                    label = "Send Location";
                                    break;
                                }

                                case "text": {
                                    const { title, image_url, image_alt_text } = quickReply as IFBMTextQuickReply;
                                    label = title;
                                    if (image_url) image = <QuickReplyImage src={image_url} alt={image_alt_text || ""}/>;
                                    break;
                                }

                                case "user_email": {
                                    label = "Send Email-Address";
                                    break;
                                }

                                case "user_phone_number": {
                                    label = "Send Phone Number";
                                    break;
                                }
                            }

                            const __html = config.settings.disableHtmlContentSanitization ? label : sanitizeHTML(label);

                            return (
                                <MessengerQuickReply
                                    key={index}
                                    onClick={e => onAction(e, quickReply)}
                                    className="webchat-quick-reply-template-reply"
                                    id={`${webchatQuickReplyTemplateButtonId}-${index}`}
                                >
                                    {image}
                                    <span dangerouslySetInnerHTML={{ __html }} />
                                </MessengerQuickReply>
                            );
                        })}
                    </QuickReplies>
                )}
            </div>
        );
    };

    return MessengerTextWithQuickReplies;
};
