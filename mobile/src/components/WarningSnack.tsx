import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setError, setWarning} from "../redux/redux";

const WarningAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface WarningSnackProps {
  open: boolean
  message: string
}
export default function WarningSnack(props: WarningSnackProps) {
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
    dispatch(setWarning(null));
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <WarningAlert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
        {props.message}
      </WarningAlert>
    </Snackbar>
  );
}
