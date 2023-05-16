import React, { FC, useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import { withLocalize } from "react-localize-redux";
import {ILanguageOption,IWebchatConfig,} from "../../../../../common/interfaces/webchat-config";
import { connect } from "react-redux";
import '../text/languageFlag.css'

interface ILanguageSelectProps {
  activeLanguage: { code: string, flagLink:string};
  settings: any;
  setActiveLanguage: (languageCode: string) => void;
  languageOptions: ILanguageOption[];
}

const LanguageSelect: FC<ILanguageSelectProps> = (props) => {
  const { activeLanguage, setActiveLanguage, settings } = props;

  const handleChangeLanguage = (event) => {
    setActiveLanguage(event.target.value);
    window.cognigyWebchat.sendMessage(
      settings.bayer.sendLanguageAsText ? event.target.value : "",
      { language: event.target.value }
    );
  };

  // React.useEffect(() => {  // This will result in sending the current language to the flow when closing the menu (not the language select)
  //   setActiveLanguage(settings.bayer.defaultLanguage);
  //   window.cognigyWebchat.sendMessage("", {
  //     language: settings.bayer.defaultLanguage,
  //   });
  // }, []);
  const renderValue = (value) => {
    return (
      <span className="languageFlag">
      <img
        style={{ width: "25px", height: "15px" }}
        src={value}
      ></img>
    </span>
    )
}
  return (
    <div style={{ display: "flex", alignItems: "flex-end" ,paddingLeft :"8px" }}>
      <Select
        disableUnderline
        value={activeLanguage.code}
        onChange={(e) => handleChangeLanguage(e)}
        renderValue={() => renderValue(activeLanguage.flagLink)}
        
        style={{ padding: "6px 3px", height: "fit-content" }}
      >
        {props.languageOptions.map((language) => (
          
          <MenuItem value={language.code}>
            <span className="languageFlag">
              <img
                style={{ width: "25px", height: "15px" }}
                src={language.flagLink}
              ></img>
            </span>
            <span
             
              style={{ paddingLeft: "10px" }}
            >
              {language.title}
            </span>
          </MenuItem>
        ))}
      </Select>
    </div>
  ); 
};
// this is a hacky way to directly access the configuration without passing it down
const mapStateToProps = (state) => ({
  languageOptions: (state.config as IWebchatConfig).settings.bayer
    .languageOptions,
});

// @ts-ignore
export default withLocalize(connect(mapStateToProps)(LanguageSelect));
