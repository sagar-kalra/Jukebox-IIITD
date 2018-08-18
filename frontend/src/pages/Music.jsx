import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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

import {
    ValidatorForm,
    TextValidator
  } from 'react-material-ui-form-validator';

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
});

class Music extends Component {
  state = {
    busy: false,
    music: null,
    imageError: false,
    file: '/static/img/music.svg',
    soundStatus: Sound.status.STOP,
    musicURL: null,
    title: '',
    cover: '',
    artist : ''
  }
 
  

  handleFileChange(event) {
    console.log("Hola")
    this.setState({
      file: '/static/img/play.png',
      music : event.target.files[0],
      imageError: false,
    });
  }

  handleCoverChange(event) {
    console.log("Lola");
    this.setState({
      cover: event.target.files[0],
    });
  }

  handleImageClick(event) {
    if(!this.state.music)
    {
    this.refs.profilepic.click();
  }
  else if(this.state.soundStatus == Sound.status.STOP){
    this.setState({
      musicURL: URL.createObjectURL(this.state.music),
      soundStatus: Sound.status.PLAYING,
      file: '/static/img/pause.jpeg'
    });
  }
  else
  {
    this.setState({
      soundStatus: Sound.status.PAUSE,
      file: '/static/img/play.png'
    })
  }
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
      <LinearProgress
          style={
            this.state.busy ? 
              {visibility: 'visible'} :
              {visibility: 'hidden'}
            }
          color="primary"
        />
      <Paper className={classes.paper}>
        <Typography align="center">
          Upload Music
        </Typography>
        <ValidatorForm onSubmit={this.handleSubmit.bind(this)} ref="form">
          <center>
          <img
              src={this.state.file}
              className={classes.profilePic}
              alt="error"
              onClick={this.handleImageClick.bind(this)}
            />
            {
              this.state.imageError
              ? (
                  <FormHelperText
                    style={{ color: 'red', textAlign: 'center' }}
                  >
                    image is required
                  </FormHelperText>
                ) : ''
            }
           <input
            type="file"
            className = {classes.imageFile}
            onChange={this.handleFileChange.bind(this)}
            ref="profilepic"
            name="music"
          />
          <Sound
        url={this.state.musicURL}
        playStatus={this.state.soundStatus}
        playFromPosition={0 /* in milliseconds */}
        onLoading={this.handleSongLoading}
        onPlaying={this.handleSongPlaying}
        onFinishedPlaying={this.handleSongFinishedPlaying}
    />
          <TextValidator
            label={"Song Title"}
            className={classes.textField}
            margin="normal"
            name="title"
            value={this.state.title}
            onChange={this.onChangeErrorHandler}
            validators={['required']}
            errorMessages={['this field is required']}
          />
          <TextValidator
            label={"Artist"}
            className={classes.textField}
            margin="normal"
            name="artist"
            value={this.state.artist}
            onChange={this.onChangeErrorHandler}
            validators={['required']}
            errorMessages={['this field is required']}
          />
          <input
          label = {"Song Cover"}
            type="file"
            onChange={this.handleCoverChange.bind(this)}
            ref="songcover"
            name="cover"
          />
          </center>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={this.state.busy}
            onClick={this.validateSelects.bind(this)}
          >
            Submit
          </Button>
        </ValidatorForm>
      </Paper>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Music);