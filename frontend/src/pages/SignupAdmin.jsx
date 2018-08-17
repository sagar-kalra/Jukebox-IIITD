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

class CompleteProfile extends Component {
  state = {
    busy: false,
    file: '/static/img/profile.png',
    course_id: '',
    profilePic: null,
    bravecoin_id: '',
    imageError: false,
    password: '',
    repeatPassword: ''
  }
 
  

  handleFileChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      profilePic: event.target.files[0],
      imageError: false,
    })
  }

  openFileDialog(event) {
    this.refs.profilepic.click()
  }
   componentDidMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
    }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.imageError || this.state.courseError || this.state.centreError)
      return
    let formdata = new FormData(event.target);
    this.setState({ busy: true }, () => {
      axios.post(`/api/signupadmin/`, formdata)
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
          Sign up as Admin
        </Typography>
        <ValidatorForm onSubmit={this.handleSubmit.bind(this)} ref="form">
          <center>
            <img
              src={this.state.file}
              className={classes.profilePic}
              alt="error"
              onClick={this.openFileDialog.bind(this)}
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
          </center>
          <input
            type="file"
            className={classes.imageFile}
            onChange={this.handleFileChange.bind(this)}
            ref="profilepic"
            name="image"
          />
          <TextValidator
            label={"First Name"}
            className={classes.textFieldLeftHalf}
            margin="normal"
            name="first_name"
            value={this.state.first_name}
            onChange={this.onChangeErrorHandler}
            validators={['required']}
            errorMessages={['this field is required',]}
          />
          <TextValidator
            label={"Last Name"}
            className={classes.textFieldRightHalf}
            margin="normal"
            name="last_name"
            value={this.state.last_name}
            onChange={this.onChangeErrorHandler}
            validators={['required']}
            errorMessages={['this field is required',]}
          />
          
          <TextValidator
            label={"E-mail Address"}
            className={classes.textField}
            margin="normal"
            name="email"
            value={this.state.email}
            onChange={this.onChangeErrorHandler}
            validators={['required', 'isEmail']}
            errorMessages={['this field is required', 'email is invalid',]}
          />
          <TextValidator
            label={"Contact Number"}
            className={classes.textField}
            margin="normal"
            name="contact_number"
            value={this.state.contact_number}
            onChange={this.onChangeErrorHandler}
            validators={['required']}
            errorMessages={['this field is required',]}
          />
          <TextValidator
            label={"Brave Coin ID"}
            className={classes.textField}
            margin="normal"
            name="bravecoin_id"
            value={this.state.bravecoin_id}
            onChange={this.onChangeErrorHandler}
            validators={['required']}
            errorMessages={['this field is required',]}
          />
          <TextValidator
                    label="Password"
                    onChange={this.onChangeErrorHandler}
                    name="password"
                    type="password"
                    validators={['required']}
                    errorMessages={['this field is required']}
                    value={this.state.password}
                />
                <TextValidator
                    label="Repeat password"
                    onChange={this.onChangeErrorHandler}
                    name="repeatPassword"
                    type="password"
                    validators={['isPasswordMatch', 'required']}
                    errorMessages={['password mismatch', 'this field is required']}
                    value={this.state.repeatPassword}
                />
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

export default withStyles(styles, { withTheme: true })(CompleteProfile);