import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setError} from "../redux/redux";

const ErrorAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ErrorSnackProps {
  open: boolean
  message: string
}
export default function ErrorSnack(props: ErrorSnackProps) {
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
    dispatch(setError(''));
  };

  return (
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <ErrorAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {props.message}
        </ErrorAlert>
      </Snackbar>
  );
}
