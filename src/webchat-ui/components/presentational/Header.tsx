import * as React from 'react';
import Toolbar from './Toolbar';
import Logo from './Logo';
import { styled } from '../../style';
import IconButton from './IconButton';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';;
import MenuIcon from "../../assets/Hamburger_icon.svg"; // Source: de.wikipedia.org/wiki/Datei:Hamburger_icon.svg
import { MenuItem, Menu, useTheme, useMediaQuery, Badge } from "@material-ui/core";
import { Translate } from "react-localize-redux";
import Switch from '@material-ui/core/Switch';
import { sizing } from '@mui/system';
import NotificationsNoneSharpIcon from '@material-ui/icons/NotificationsNoneSharp';
import MenuDialog from "./MenuDialog";
import MoreVert from '@material-ui/icons/MoreVert';
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import NestedMenu from './NestedMenu'
import { green } from '@material-ui/core/colors';

const HeaderBar = styled(Toolbar)(({ theme }) => ({
  boxShadow: '0 5px 18px 0 rgba(0, 0, 0, 0.08), 0 5px 32px 0 rgba(0, 0, 0, 0.08), 0 8px 58px 0 rgba(0, 0, 0, 0.08)',
  zIndex: 2,
  minHeight: 'auto',
  height: theme.unitSize * 7,
  flexBasis: theme.unitSize * 7,
  flexShrink: 0,
  fontSize: 16,
  fontWeight: 700,
}))

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    // marginTop: theme.spacing(1),
    minWidth: 180,
    // color:
    //   theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        // color: theme.palette.text.secondary,
        // marginRight: theme.spacing(1.5),
      },
      // '&:active': {
      //   backgroundColor: alpha(
      //     theme.palette.primary.main,
      //     theme.palette.action.selectedOpacity,
      //   ),
      // },
    },
  },
}));

const HeaderIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.primaryContrastColor,
  fill: theme.primaryContrastColor,
  borderRadius: "50%",
  // stroke: theme.primaryContrastColor
  // "&:focus, &:hover": {                               (to remove the background effect on the icons)
  //   backgroundColor: theme.primaryStrongColor,
  //   fill: `${theme.primaryContrastColor} !important`,
  //   opacity: 0.85,
  // }
}));

interface HeaderProps {
  title: string;
  connected: boolean;
  showRatingButton: boolean;
  displayNotificationMessage: boolean;
  onRatingButtonClick: () => void;
  logoUrl?: string;
  showMenu1Item?: boolean;
  showMenu1MenuIcon?: string;
  showMenu2Item?: boolean;
  showMenu2MenuIcon?: string;
  showMenu3Item?: boolean;
  showMenu3MenuIcon?: string;
  showMenu3NestedItem1?: boolean;
  showMenu3NestedItem2?: boolean;
  showMenu3NestedItem3?: boolean;
  showMenu4Item?: boolean;
  showMenu4MenuIcon?: string;
  showMenu4NestedItem1?: boolean;
  showMenu4NestedItem2?: boolean;
  showMenu4NestedItem3?: boolean;
  showMenu5Item?: boolean;
  showMenu5MenuIcon?: string;
  showMenu6Item?: boolean;
  showMenu6MenuIcon?: string;
  //showMenu7Item?: boolean;
  show;
  onClose: () => void;
  parentMethod: () => void;
  smallScreenSize: () => void;
  mediumScreenSize: () => void;
  largeScreenSize: () => void;
  detachScreenSize: () => void;
  redScreenColor: () => void;
  blueScreenColor: () => void;
  greenScreenColor: () => void;
  closeButtonRef?: React.RefObject<HTMLButtonElement>;
  ratingButtonRef?: React.RefObject<HTMLButtonElement>;
}

export default ({ logoUrl, connected, title, showRatingButton, displayNotificationMessage, onRatingButtonClick, onClose, closeButtonRef, ratingButtonRef, ...props }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  let showNotificationDot;

  if (localStorage.getItem("notificationIconClicked") == null) {
    showNotificationDot = "dot"
  } else {
    showNotificationDot = ""
  }

  function handleClickMenu(event) {
    if (anchorEl === null) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  }

  const handleOpenLink = (url: string) => {
    window.open(url, "_blank");
    // handleClickMenu(event);
  };

  const handleSendMessage = (text: string) => {
    window.cognigyWebchat.sendMessage(text, null);
  };

  const drawerWidth = 240

  const useStyles = makeStyles(theme => ({
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      background: '#535454',
      color: '#fff',
    },
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    // container: {
    //   paddingTop: theme.spacing(4),          
    //   paddingBottom: theme.spacing(4),
    // },
  }))

  const classes = useStyles()

  return (
    <div >
      <MenuDialog open={openMenu1} setOpen={setOpenMenu1} name="UI_NOTIFICATION_MESSAGE" />
      <HeaderBar color='primary' {...props} className="webchat-header-bar" >
        {logoUrl && <Logo src={logoUrl} className="webchat-header-logo" aria-hidden="true" />}
        <span
          style={{ flexGrow: 1 }}
          className="webchat-header-title"
          role="heading"
          aria-level={1}
          id="webchatHeaderTitle"
        >
          <Translate id="UI_HEADER_TITLE" />
        </span>
        {
          displayNotificationMessage &&
          <HeaderIconButton>
            <Badge color="primary"
              overlap="circular"
              variant={showNotificationDot}
              onClick={() => {
                setOpenMenu1(true);
                setAnchorEl(null);
                localStorage.setItem("notificationIconClicked", "iconClicked");
              }}>
              <NotificationsNoneSharpIcon />
            </Badge>
          </HeaderIconButton>
        }
        {/* {
          showRatingButton && */}
        {/* <HeaderIconButton
          onClick={onRatingButtonClick}
          aria-label="Rate your chat"
          id="webchatHeaderOpenRatingDialogButton"
          ref={ratingButtonRef}
        >
          <ThumbsUpDownIcon />
        </HeaderIconButton> */}
        {/* // } */}
        <HeaderIconButton
          data-header-close-button
          onClick={handleClickMenu}
          className="webchat-header-close-button"
          aria-label="Close Chat"
          ref={closeButtonRef}
        >
          <MoreVert />
        </HeaderIconButton>
        <StyledMenu
          id="demo-customized-menu"
          // MenuListProps={{
          //   'aria-labelledby': 'demo-customized-button',
          // }}

          anchorEl={anchorEl}
          // open={open}
          // onClose={handleClose}
          disableAutoFocusItem={true}
          // id="long-menu"
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClickMenu}
        >
          <div className={clsx('App', classes.root)}>
            <CssBaseline />
            <NestedMenu {...props} />
          </div>
        </StyledMenu>
      </HeaderBar>
    </div>
  );


};