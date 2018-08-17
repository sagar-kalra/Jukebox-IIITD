import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AddIcon from '@material-ui/icons/Add';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import HomeIcon from '@material-ui/icons/Home';
import StoreIcon from '@material-ui/icons/Store';
import SchoolIcon from '@material-ui/icons/School';
import BookIcon from '@material-ui/icons/Book';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ListIcon from '@material-ui/icons/List';
import MusicNoteIcon from '@material-ui/icons/MusicNote';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class SuperAdminMenu extends React.Component {
  state = { 
    users: false,
    tests: false,
  };

  handleClick = (item) => {
    this.setState({ [item]: !this.state[item] });
  };

  goTo(path) {
    this.props.history.push(path);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List
          component="nav"
          subheader={<ListSubheader component="div">Super Admin</ListSubheader>}
        >
          <ListItem button onClick={() => this.goTo('/home/')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText inset primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => this.goTo('/music/')}>
            <ListItemIcon>
              <MusicNoteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Music" />
          </ListItem> 
          <ListItem button onClick={this.props.logout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText inset primary="Logout" />
          </ListItem>
        </List>
      </div>
    );
  }
}

SuperAdminMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(SuperAdminMenu));
