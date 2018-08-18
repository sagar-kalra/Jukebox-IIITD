import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Redirect } from 'react-router';
import Sound from 'react-sound';
import MusicPlayer from 'react-responsive-music-player';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import "../css/custom2.css";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ListItemIcon from '@material-ui/core/ListItemIcon';


import {
    ValidatorForm,
    TextValidator
  } from 'react-material-ui-form-validator';

  const playlist = [
  {
    url: 'http://37.187.93.104:8180/stream2',
    cover: 'data:image/jpeg;base64,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',
    title: 'Despacito',
    artist: [
      'Unknown',
    ]
  }
]

const styles = theme => ({
    textField: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '10px',
      marginBottom: '10px',
      width: '100%',
    },
    textFieldLeftHalf: {
      width: '47%',
    },
    textFieldRightHalf: {
      width: '47%',
      marginLeft: '6%',
    },
    container: {
      width: '90%',
      maxWidth: '500px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 'calc(2%)',
      height: '600px',
      minWidth: '250px',
    },
    paper: {
      padding: '40px',
    },
    button: {
      width: '100%',
      marginTop: '40px',
      marginBottom: '30px',
    },
    profilePic: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      cursor: 'pointer',
      marginTop: '20px',
      boxShadow: '0px 0px 5px 1px rgba(42, 42, 42, 1)',
    },
    imageFile: {
      display: 'none',
    },
     root: {
    flexGrow: 1,
    maxWidth: 600,
    padding: theme.spacing.unit * 2,
    marginTop : '10%'
  },
  image: {
    width: 64,
    height: 64,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  }
});

class Radio extends Component {
	state = {
		data: []
	}

fetchdata()
{
	axios.get('/api/listmusic/')
	.then(res => {
		this.setState({
			data: res.data
		});
		console.log(this.state.data);
	})
}

componentDidMount(){
	this.fetchdata();
}
  handleSubmit(event) {
    event.preventDefault();
    if (this.state.imageError || this.state.courseError || this.state.centreError)
      return
    let formdata = new FormData(event.target);
    this.setState({ busy: true }, () => {
      axios.post(`/api/music/add/`, formdata, {
        headers: {
          Authorization: `Token ${localStorage.token}`
        }
      })
      .then((res) => {
        this.setState({ busy: false });
        console.log("Successful")
      })
      .catch((err) => {
        this.setState({ busy: false });
      });
    });
  }

 	handleUpVote(id)
 	{
 		console.log(id);
 	}

  validateSelects(event) {
    let imageError = this.state.profilePic === null;
    if( imageError)
      this.setState({
        imageError
      });
    //this.refs.form.submit();
  }

  onChangeErrorHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value, });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
      <MusicPlayer playlist={playlist} />
      {this.state.data.map((obj) =>
      <Paper className={classes.root}>
      <div>
      <Grid container spacing={16}>
        <Grid item>
          <ButtonBase className={classes.image}>
            <img className={classes.img} alt="complex" src="/static/images/grid/complex.jpg" />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={16}>
            <Grid item xs>
              <Typography gutterBottom variant="subheading">
                {obj.title}
              </Typography>
              <Typography gutterBottom>{obj.artist}</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography Button variant="subheading" >< ThumbUpIcon /> </Typography>
          </Grid>
        </Grid>
      </Grid>
      </div>
    </Paper>
    )}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Radio);