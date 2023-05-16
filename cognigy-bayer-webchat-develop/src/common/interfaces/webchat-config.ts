export interface IPersistentMenuItem {
  title: string;
  payload: string;
}

export interface ILanguageOption {
  code: string;
  title: string;
  ariaLabel: string;
  flagLink:string;
}

export interface ScreenSizeOption {
  smallScreenSize: string;
  mediumScreenSize: string;
  largeScreenSize: string;
}
export interface ScreenColorOption{
  redScreenColor:string;
  blueScreenColor:string;
  greenScreenColor:string;
}
export interface IWebchatSettings {
  agentAvatarUrl: string;
  backgroundImageUrl: string;
  colorScheme: string;
  designTemplate: number;
  disableBranding: boolean;
  disableHtmlInput: boolean;
  disableInputAutofocus: boolean;
  disableHtmlContentSanitization: boolean;
  disableInputAutocomplete: boolean;
  disableInputAutogrow: boolean;
  disableLocalStorage: boolean;
  disablePersistentHistory: boolean;
  disableTextInputSanitization: boolean;
  disableToggleButton: boolean;
  dynamicImageAspectRatio: boolean;
  enableConnectionStatusIndicator: boolean;
  showEngagementMessagesInChat: boolean;
  enableAutoFocus: boolean;
  enableInjectionWithoutEmptyHistory: boolean;
  enableFileUpload: boolean;
  enableGenericHTMLStyling: boolean;
  enableFocusTrap: boolean;
  enablePersistentMenu: boolean;
  enableSTT: boolean;
  enableTTS: boolean;
  enableStrictMessengerSync: boolean;
  disableUrlButtonSanitization: boolean;
  enableTypingIndicator: boolean;
  enableUnreadMessageBadge: boolean;
  enableUnreadMessagePreview: boolean;
  enableUnreadMessageSound: boolean;
  enableUnreadMessageTitleIndicator: boolean;
  engagementMessageDelay: number;
  engagementMessageText: string;
  focusInputAfterPostback: boolean;
  getStartedButtonText: string;
  getStartedPayload: string;
  getStartedText: string;
  headerLogoUrl: string;
  ignoreLineBreaks: boolean;
  inputPlaceholder: string;
  inputAutogrowMaxRows: number;
  messageDelay: number;
  messageLogoUrl: string;
  persistentMenu: {
    title: string;
    menuItems: IPersistentMenuItem[];
  };
  ratingCommentText: string;
  ratingMessageHistoryCommentText: string;
  ratingMessageHistoryRatingText: string;
  ratingTitleText: string;
  startBehavior: "none" | "button" | "injection";
  STTLanguage: string;
  title: string;
  unreadMessageTitleText: string;
  unreadMessageTitleTextPlural: string;
  userAvatarUrl: string;
  useSessionStorage: boolean;
  bayer: {
    showMenu1MenuItem: boolean;
    showMenu1MenuIcon: string;
    showMenu2MenuItem: boolean;
    showMenu2MenuIcon: string;
    showMenu3MenuItem: boolean;
    showMenu3MenuIcon: string;
    showMenu4MenuItem: boolean;
    showMenu4MenuIcon: string;
    showMenu5MenuItem: boolean;
    showMenu5MenuIcon: string;
    showMenu6MenuItem: boolean;
    showMenu6MenuIcon: string;
    //showMenu7MenuItem: boolean;
    defaultLanguage: string;
    defaultScreenSize: string;
    defaultScreenColor:string;
    screenSizeOptions: ScreenSizeOption;
    screenColorOptions:ScreenColorOption;
    sendLanguageAsText: boolean;
    displayLanguageSelectMenu: boolean;
    displayInputField:boolean;
    languageOptions: ILanguageOption[];
  }
}

export interface IWebchatConfig {
  active: boolean;
  URLToken: string;
  settings: IWebchatSettings;
}
