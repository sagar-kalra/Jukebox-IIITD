import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import axios from 'axios';
import Home from './pages/Home';
import Nav from './components/Nav';
import NavDrawer from './components/NavDrawer';
import LoginScreen from "./pages/LoginScreen";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from './components/PrivateRoute';
import Error404 from './pages/Error404';
import SignupAdmin from './pages/SignupAdmin';
import Music from './pages/Music';
import SignupUser from './pages/SignupUser';


import './App.css';

const drawerWidth = 240;
const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[800],
    },
  },
});

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    marginTop: 62,
    backgroundColor: theme.palette.background.default,
    overflow: 'scroll',
  },
  content2: {
    flexGrow: 1,
    marginTop: 5,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    overflow: 'scroll',
  },
  loader: {

  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      user: null,
      busy: true,
    }
    this.getUser = this.getUser.bind(this);
  }

  drawerToggle() {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  componentWillMount() {
    this.setState({ busy: true }, () => this.getUser());
  }

  getUser(callBack) {
    axios.get('/api-auth/user/',{
      headers: {Authorization: `Token ${localStorage.token}`}
    })
    .then((res) => {
      this.setState({ user: res.data.profile, busy: false },
                    () => { 
                      if (callBack)
                        callBack(res.data.profile) 
                    });
    })
    .catch((err) => {
      delete localStorage.token;
      this.setState({ busy: false });
    });
  }

  logout(callBack) {
    delete localStorage.token;
    this.setState({ user: null }, callBack);
  }

  render() {
    const { classes } = this.props;
    const { user } = this.state;
    const isLoggedIn = this.state.user !== null;
    const showNav = (user !== null && (user.type !== 'student' || user.complete));

    if (this.state.user === null && this.state.busy) {
      return (
        <center><div className="loader"></div></center>
      );
    }

    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <div className={classes.root}>
            {
               showNav ? (
                <div>
                  <Nav
                    handleDrawerToggle={() => this.drawerToggle()}
                    user={this.state.user}
                  />
                  <NavDrawer
                    drawerOpen={this.state.drawerOpen}
                    handleDrawerToggle={() => this.drawerToggle()}
                    user={this.state.user}
                    logout={this.logout.bind(this)}
                  />
                </div>
              ) : ''
            }
            <div className={showNav ? classes.content : classes.content2}>
              <Switch>
                <PrivateRoute
                  authed={isLoggedIn}
                  path='/home'
                  Child={(props) => 
                    <Home {...props} user={this.state.user} />}
                />
                
                <Route path={'/login/'} exact strict render={(props) => {
                    return !isLoggedIn ?
                      <LoginScreen {...props} getUser={this.getUser} /> :
                      <Redirect to={"/home/"} />
                    } 
                  }
                />
                <Route path={'/forgot-password/'} exact strict render={(props) => (
                      <ForgotPassword {...props} />
                    )
                  }
                />
                <Route path={'/signup/admin/'} exact strict render={(props) => (
                      <SignupAdmin {...props} />
                    )
                  }
                />
                <Route path={'/signup/user/'} exact strict render={(props) => (
                      <SignupUser {...props} />
                    )
                  }
                />
                <Route path={'/reset-password/:uid/:token/'} exact strict render={(props) => (
                      <ResetPassword {...props} />
                    )
                  }
                />
                <Route path={'/music/'} exact strict render={(props) => {
                      return <Music {...props} />
                    }
                  }
                />
                
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
