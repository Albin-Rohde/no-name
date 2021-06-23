import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import {
  Switch,
  Route,
  useHistory,
  withRouter
} from "react-router-dom";
import {createMuiTheme, Paper, Tab, Tabs, ThemeProvider} from "@material-ui/core";
import Combined from "./views/Combined";
import Error from "./views/Error";
import Requests from "./views/Requests";

function App() {
  const [value, setValue] = React.useState('');
  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: 'dark',
        },
      }),
    [],
  );
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Paper square>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
            <Tab label="Combined" value={'/'} />
            <Tab label="Error" value={'/error'} />
            <Tab label="Requests" value={'/requests'} />
            </Tabs>
          </Paper>
          {value === '/' && <Combined />}
          {value === '/error' && <Error />}
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default withRouter(App);
