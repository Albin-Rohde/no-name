import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import LogTable from "./components/LogTable";

import {
  BrowserRouter as Router,
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
    history.push(newValue)
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
          <Switch>
            <Route path="/">
              <Combined />
            </Route>
            <Route path="/error">
              <Error />
            </Route>
            <Route path="/request">
              <Requests />
            </Route>
          </Switch>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default withRouter(App);
