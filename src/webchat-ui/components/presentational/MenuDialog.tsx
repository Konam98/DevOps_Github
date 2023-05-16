import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Translate } from "react-localize-redux";

export default function MenuDialog(props) {
  const { open, setOpen, name } = props;
  const [data] = React.useState({});
  const theme = useTheme();
  const fullscreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    setOpen(false);
  };

  if (!data) {
    return <div></div>;
  }

  return (
 
    <Dialog
      style={{ zIndex: 99999999 }}
      fullScreen={fullscreen}
      open={open}
      onClose={handleClose}
    >
      <Translate>
        {({ translate }) => (
          <>
            <DialogTitle>
            <Translate id={`${name}_TITLE`} />
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                dangerouslySetInnerHTML={{
                  __html: translate(`${name}_TEXT`) as string,
                }}
              ></DialogContentText>
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={handleOpenURl} color="primary">
                <Translate id="UI_NOTIFICATIONS_READ_MORE_BUTTON" />
              </Button> */}
              <Button autoFocus onClick={handleClose} color="primary">
                <Translate id="UI_NOTIFICATIONS_OK_BUTTON" />
              </Button>
            </DialogActions>
          </>
        )}
      </Translate>
    </Dialog>
  );
}
