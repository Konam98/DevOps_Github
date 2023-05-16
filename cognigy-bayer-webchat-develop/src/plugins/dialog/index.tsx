import * as React from 'react';
import memoize from 'memoize-one';
import { registerMessagePlugin } from "../helper";
import { getDialogStyles } from './styles';

const dialogStylesMemoized = memoize(getDialogStyles); // only re-calculate if theme changed

const Dialog = (props) => {
  const {
    isFullscreen,
    onSetFullscreen,
    theme
  } = props;

  if (!isFullscreen) {
    const { openDialogButtonStyles } = dialogStylesMemoized(theme);

    return (
      <button
        type='button'
        onClick={onSetFullscreen}
        style={openDialogButtonStyles}
      >
        {props.message.text}
      </button>
    )
  }

  const {
    dialogStyles,
    headerStyles,
    contentStyles,
    footerStyles,
    submitButtonStyles,
    cancelButtonStyles
  } = dialogStylesMemoized(theme);

  const {
    attributes,
    onDismissFullscreen,
    onSendMessage,
    message
  } = props;

  const buttonsDefault = [
    { "buttonText": "OK", "message": { "text": "OK" } },
    { "buttonText": "Close Dialog" }
  ];

  const buttons = message.data._plugin.buttons ?? buttonsDefault;

  return (
    <div
      {...attributes}
      style={{
        ...attributes.styles,
        ...dialogStyles
      }}
    >
      <header
        style={headerStyles}
        dangerouslySetInnerHTML={{ __html: message.data._plugin.header }}
      />
      <main
        style={contentStyles}
        dangerouslySetInnerHTML={{ __html: message.data._plugin.body }}
      />
      <footer style={footerStyles}>
        {
          buttons.map((button, index) => {
            const onClick = button.message ?
              () => onSendMessage(button.message.text, button.message.data, {label: button.message.label ?? button.message.text}) :
              onDismissFullscreen;

            return (
              <button
                type='button'
                key={`btn${index}`}
                style={button.message ? submitButtonStyles : cancelButtonStyles}
                onClick={onClick}

              >{button.button}</button>
            )
          })
        }
      </footer>
    </div>
  )
}

registerMessagePlugin({ match: 'dialog', component: Dialog });