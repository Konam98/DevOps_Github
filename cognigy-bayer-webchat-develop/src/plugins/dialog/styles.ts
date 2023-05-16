const button = theme => ({
  backgroundColor: theme.greyColor,
  color: theme.greyContrastColor,

  cursor: "pointer",
  border: "none",

  height: 40,

  padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
  borderRadius: theme.unitSize * 2,
})

const primaryButton = theme => ({
  ...button(theme),
  background: theme.primaryGradient,
  color: theme.primaryContrastColor
})

const outlinedButton = theme => ({
  ...button(theme),
  backgroundColor: 'transparent',
  border: `1px solid ${theme.primaryColor}`,
  color: theme.primaryColor
})

const cancelButton = theme => ({
  ...button(theme),
  flexGrow: 1,
  marginLeft: theme.unitSize,
  marginRight: theme.unitSize
})

const submitButton = theme => ({
  ...cancelButton(theme),
  ...primaryButton(theme)
})

const openDialogButton = theme => ({
  ...outlinedButton(theme),
  '&[disabled]': {
    borderColor: theme.greyColor,
    color: theme.greyColor,
    cursor: 'default'
  }
})

const dialog = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch'
})

const padding = theme => ({
  paddingTop: theme.unitSize,
  paddingBottom: theme.unitSize,
  paddingLeft: theme.unitSize * 2,
  paddingRight: theme.unitSize * 2
})

const header = theme => ({
  ...padding(theme),

  display: 'flex',
  alignItems: 'center',

  minHeight: theme.blockSize,
  boxSizing: 'border-box',

  background: theme.primaryGradient,
  color: theme.primaryContrastColor,
  fontWeight: 'bolder',

  boxShadow: theme.shadow,

  zIndex: 2
})

const content = theme => ({
  ...padding(theme),
  flexGrow: 1
})

const footer = theme => ({
  ...padding(theme),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'white',
  boxShadow: theme.shadow,
})

export const getDialogStyles = theme => {
  const openDialogButtonStyles = openDialogButton(theme);
  const headerStyles = header(theme);
  const contentStyles = content(theme);
  const footerStyles = footer(theme);
  const submitButtonStyles = submitButton(theme);
  const cancelButtonStyles = cancelButton(theme);
  const dialogStyles = dialog(theme);

  return {
    openDialogButtonStyles,
    headerStyles,
    contentStyles,
    footerStyles,
    submitButtonStyles,
    cancelButtonStyles,
    dialogStyles
  }
}