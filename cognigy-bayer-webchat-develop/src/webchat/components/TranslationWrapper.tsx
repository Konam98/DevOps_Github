import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { withLocalize } from "react-localize-redux";
import { connect } from "react-redux";

const onMissingTranslation = ({ defaultTranslation }) => defaultTranslation;

export interface TranslationProps {
  initialize: ({ languages, options }) => {};
  addTranslationForLanguage: (translations, languageCode: string) => {};
  setActiveLanguage: (languageCode: string | null) => {};
  setUILanguage: (languageCode: string | null) => {};
  settings: any;
  activeLanguage: any;
}

class TranslationWrapper extends React.Component<TranslationProps> {
  constructor(props: TranslationProps) {
    super(props);

    const { settings, initialize, setActiveLanguage, setUILanguage } = props;
  
    const localStorageLanguage = localStorage.getItem("languageCode");
    const languages = settings.bayer.languageOptions;
    const settingBayerDefaultLanguage = settings.bayer.defaultLanguage;

    const validateLanguage = (languageCode: string | null): boolean => {
      let langCodeIsValid = false;
      languages.forEach((lang) => {
        if (lang.code === languageCode) langCodeIsValid = true;
      });
      return langCodeIsValid;
    };

    let defaultLanguage: string = "";

    if (props.settings.bayer.displayLanguageSelectMenu) {
      defaultLanguage = validateLanguage(localStorageLanguage)
        ? localStorageLanguage
        : settingBayerDefaultLanguage
          ? settingBayerDefaultLanguage
          : languages[0].code;
    } else {
      defaultLanguage = settingBayerDefaultLanguage;
    }

    initialize({
      languages,
      options: {
        renderToStaticMarkup,
        ignoreTranslateChildren: true,
        onMissingTranslation: onMissingTranslation,
      },
    });

    setActiveLanguage(defaultLanguage);
    setUILanguage(defaultLanguage);
  }
  componentDidUpdate(prevProps: TranslationProps) {
    // @ts-ignore
    const { setUILanguage } = this.props;
    const languages = this.props.settings.bayer.languageOptions;
    const previousLanguageCode = prevProps.activeLanguage && prevProps.activeLanguage.code;

    // @ts-ignore
    const languageCode = this.props.activeLanguage?.code;
    const hasLanguageChanged = previousLanguageCode !== languageCode;
    const isLanguageCodeValid = languages.some(language => language.code === languageCode);

    if (hasLanguageChanged && isLanguageCodeValid) {
      localStorage.setItem("languageCode", languageCode);
      setUILanguage(languageCode);
    }

    if (hasLanguageChanged) {
      const translation = this.props.settings.translations[languageCode];
      this.props.addTranslationForLanguage(translation, languageCode);
    }
  }

  render() {
    return this.props.children;
  }
}

/**
 * Redux store to props mapping.
 * @param {object} state the current redux store.
 * @returns {object} returns the props containing the redux state.
 */
const mapStateToProps = (state) => {
  return {
    uiLanguage: state.uiLanguage,
  };
};

/**
 * Maps redux signIn action to props.
 * @param {object} dispatch the current redux store.
 * @returns {any} redux action to props mapping.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setUILanguage: (language: string | null) =>
      dispatch({ type: "SET_UI_LANGUAGE", language }),
  };
};

// @ts-ignore
export default withLocalize(
  connect(mapStateToProps, mapDispatchToProps)(TranslationWrapper)
);
