import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Info from "@material-ui/icons/info";
import Https from "@material-ui/icons/https";
import AspectRratio from "@material-ui/icons/aspectRatio";
import Palette from "@material-ui/icons/palette";
import Collapse from "@material-ui/core/Collapse";
import MenuDialog from "./MenuDialog";
import { Translate } from "react-localize-redux";
import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const NestedMenu: React.FC = (props) => {
  const classes = useStyles();
  const [openNestedColorMenu, setOpenNestedColorMenu] = React.useState(false);
  const [openNestedSizeMenu, setOpenNestedSizeMenu] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);
  const [openMenu4, setOpenMenu4] = React.useState(false);
  const [openMenu5, setOpenMenu5] = React.useState(false);
  const [openMenu6, setOpenMenu6] = React.useState(false);
  const [openMenu7, setOpenMenu7] = React.useState(false);
  const [sizeValue, setSizeValue] = React.useState(props.defaultScreenSize);
  const [colorValue, setColorValue] = React.useState(props.defaultScreenColor);

  function handleNestedColorMenu() {
    setOpenNestedColorMenu(!openNestedColorMenu);
  }
  function handleNestedSizeMenu() {
    setOpenNestedSizeMenu(!openNestedSizeMenu);
  }

  const handleListItemClick = (index) => {
    setSizeValue(index);
  };
  const handleColorItemClick = (index) => {
    setColorValue(index);
  };

  return (
    <>
      <MenuDialog open={openMenu1} setOpen={setOpenMenu1} name="UI_MENU_1_DIALOG" />
      <MenuDialog open={openMenu2} setOpen={setOpenMenu2} name="UI_MENU_2_DIALOG" />
      <MenuDialog open={openMenu3} setOpen={setOpenMenu3} name="UI_MENU_3_DIALOG" />
      <MenuDialog open={openMenu4} setOpen={setOpenMenu4} name="UI_MENU_4_DIALOG" />
      <MenuDialog open={openMenu5} setOpen={setOpenMenu5} name="UI_MENU_5_DIALOG" />
      <MenuDialog open={openMenu6} setOpen={setOpenMenu6} name="UI_MENU_6_DIALOG" />
      <MenuDialog open={openMenu7} setOpen={setOpenMenu7} name="UI_MENU_7_DIALOG" />

      <List component="nav" className={classes.appMenu} disablePadding>
        {props.showMenu1Item && (
          <ListItem
            button
            className={classes.menuItem}
            onClick={(e) => {
              setOpenMenu1(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <img src={props.showMenu1MenuIcon}></img>
            </ListItemIcon>
            <ListItemText>
              <Translate id="UI_MENU_1_TITLE" />
            </ListItemText>
          </ListItem>
        )}

        {props.showMenu2Item && (
          <ListItem
            button
            className={classes.menuItem}
            onClick={(e) => {
              setOpenMenu2(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <img src={props.showMenu2MenuIcon}></img>
            </ListItemIcon>
            <ListItemText>
              <Translate id="UI_MENU_2_TITLE" />
            </ListItemText>
          </ListItem>
        )}

        {props.showMenu5Item && (
          <ListItem
            button
            className={classes.menuItem}
            onClick={(e) => {
              setOpenMenu5(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <img src={props.showMenu2MenuIcon}></img>
            </ListItemIcon>
            <ListItemText>
              <Translate id="UI_MENU_5_TITLE" />
            </ListItemText>
          </ListItem>
        )}

        {props.showMenu6Item && (
          <ListItem
            button
            className={classes.menuItem}
            onClick={(e) => {
              setOpenMenu6(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <img src={props.showMenu2MenuIcon}></img>
            </ListItemIcon>
            <ListItemText>
              <Translate id="UI_MENU_6_TITLE" />
            </ListItemText>
          </ListItem>
        )}

        {props.showMenu7Item && (
          <ListItem
            button
            className={classes.menuItem}
            onClick={(e) => {
              setOpenMenu7(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <img src={props.showMenu2MenuIcon}></img>
            </ListItemIcon>
            <ListItemText>
              <Translate id="UI_MENU_7_TITLE" />
            </ListItemText>
          </ListItem>
        )}

        {props.showMenu3Item && (
          <>
            <ListItem
              button
              onClick={handleNestedSizeMenu}
              className={classes.menuItem}
            >
              <ListItemIcon>
                <img
                  style={{ height: "17px" }}
                  src={props.showMenu3MenuIcon}
                ></img>
              </ListItemIcon>
              <ListItemText>
                <Translate id="UI_MENU_3_TITLE" />
                {openNestedSizeMenu ? (
                  <IconExpandLess className={classes.IconExpandLess} />
                ) : (
                  <IconExpandMore className={classes.IconExpandMore} />
                )}
              </ListItemText>
            </ListItem>
            <Collapse in={openNestedSizeMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    color="blue"

                  >
                    {props.showMenu3NestedItem1 && (
                      <ListItemText inset>
                        <FormControlLabel
                          label={<Translate id="UI_MENU_3_NESTED_1_TITLE" />}
                          value="webchat-small"
                          control={<Radio size="small" color="black" />}
                          checked={sizeValue === "webchat-small"}
                          onClick={() => {
                            handleListItemClick("webchat-small");
                            props.smallScreenSize();
                          }}
                        />
                      </ListItemText>
                    )}
                    {props.showMenu3NestedItem2 && (
                      <ListItemText inset>
                        <FormControlLabel
                          label={<Translate id="UI_MENU_3_NESTED_2_TITLE" />}
                          value="webchat-medium"
                          control={<Radio size="small" color="black" />}
                          checked={sizeValue === "webchat-medium"}
                          onClick={() => {
                            handleListItemClick("webchat-medium");
                            props.mediumScreenSize();
                          }}
                        />
                      </ListItemText>
                    )}
                    {props.showMenu3NestedItem3 && (
                      <ListItemText inset>
                        <FormControlLabel
                          label={<Translate id="UI_MENU_3_NESTED_3_TITLE" />}
                          value="webchat-large"
                          control={<Radio size="small" color="black" />}
                          checked={sizeValue === "webchat-large"}
                          onClick={() => {
                            handleListItemClick("webchat-large");
                            props.largeScreenSize();
                          }}
                        />
                      </ListItemText>
                    )}
                    {props.showMenu3NestedItem4 && (
                      <ListItemText inset>
                        <FormControlLabel
                          label={<Translate id="UI_MENU_3_NESTED_4_TITLE" />}
                          value="webchat-detach"
                          control={<Radio size="small" color="black" />}
                          checked={sizeValue === "webchat-detach"}
                          onClick={() => {
                            handleListItemClick("webchat-detach");
                            props.detachScreenSize();
                          }}
                        />
                      </ListItemText>
                    )}
                  </RadioGroup>
                </FormControl>
              </List>
            </Collapse>
          </>
        )}

        {props.showMenu4Item && (
          <>
            <ListItem
              button
              onClick={handleNestedColorMenu}
              className={classes.menuItem}
            >
              <ListItemIcon>
                <img src={props.showMenu4MenuIcon}></img>
              </ListItemIcon>
              <ListItemText>
                <Translate id="UI_MENU_4_TITLE" />
                {openNestedColorMenu ? (
                  <IconExpandLess className={classes.IconExpandLess} />
                ) : (
                  <IconExpandMore className={classes.IconExpandMore} />
                )}
              </ListItemText>
            </ListItem>
            <Collapse in={openNestedColorMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                  >
                    {props.showMenu4NestedItem1 && (
                      <ListItemText inset>
                        <FormControlLabel
                          label={<Translate id="UI_MENU_4_NESTED_1_TITLE" />}
                          value="webchat-red"
                          control={<Radio size="small" color="black" />}
                          checked={colorValue === "webchat-red"}

                          onClick={() => {
                            handleColorItemClick("webchat-red");
                            props.redScreenColor();
                          }}
                        />
                      </ListItemText>
                    )}
                    {props.showMenu4NestedItem2 && (
                      <ListItemText inset>
                        <FormControlLabel
                          label={<Translate id="UI_MENU_4_NESTED_2_TITLE" />}
                          value="webchat-blue"
                          control={<Radio size="small" color="black" />}
                          checked={colorValue === "webchat-blue"}

                          onClick={() => {
                            handleColorItemClick("webchat-blue");
                            props.blueScreenColor();
                          }}
                        />
                      </ListItemText>
                    )}
                    {props.showMenu4NestedItem3 && (
                      <ListItemText inset>
                        <FormControlLabel
                          label={<Translate id="UI_MENU_4_NESTED_3_TITLE" />}
                          value="webchat-green"
                          control={<Radio size="small" color="black" />}
                          checked={colorValue === "webchat-green"}
                          onClick={() => {
                            handleColorItemClick("webchat-green");
                            props.greenScreenColor();
                          }}
                        />
                      </ListItemText>
                    )}
                  </RadioGroup>
                </FormControl>
              </List>
            </Collapse>
          </>
        )}

      </List>
    </>
  );
};

const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
  createStyles({
    appMenu: {
      width: "100%",
    },
    navList: {
      width: drawerWidth,
    },
    menuItem: {
      width: drawerWidth,
    },
    menuItemIcon: {
      color: "#97c05c",
    },
    IconExpandMore: {
      verticalAlign: "bottom",
    },
    IconExpandLess: {
      verticalAlign: "bottom",
    },
  })
);

export default NestedMenu;
