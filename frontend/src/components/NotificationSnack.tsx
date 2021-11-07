import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setNotification} from "../redux/redux";

const NotificationAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface NotificationProps {
  open: boolean
  message: string
}
export default function NotificationSnack(props: NotificationProps) {
  const [open, setOpen] = React.useState(props.open);
  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    dispatch(setNotification(null));
  };

  return (
    <Snackbar open={open} autoHideDuration={4500} onClose={handleClose}>
      <NotificationAlert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
        {props.message}
      </NotificationAlert>
    </Snackbar>
  );
}
