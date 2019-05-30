import React, { Component } from 'react';
import './Header.css';
import axios from 'axios';

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      isAdmin: false,
    };
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleUsernameInput(value) {
    this.setState({ username: value });
  }

  handlePasswordInput(value) {
    this.setState({ password: value });
  }

  toggleAdmin() {
    const { isAdmin } = this.state;
    this.setState({ isAdmin: !isAdmin });
  }

  login() {
    // axios POST to /auth/login here
    const { username, password } = this.state;
    axios
    .post("/auth/login", {username, password})
    .then(user => {
      this.setState({
        username: "",
        password: ""
      })
      this.props.updateUser(user.data)
    })
    .catch(err => {
      //this chain of data leads to the string response from our server endpoint if there is an error.
      alert(err.response.request.response)
    })
  }

  register() {
    // axios POST to /auth/register here
    const { username, password, isAdmin } = this.state;
    //sending an object with username, password, and isAdmin properties with the values from state as the body of the request.
    axios
    .post("/auth/register", {username, password, isAdmin})
    //then set the username and password on state to empty strings
    .then(user => {
      this.setState({ 
        username: "", 
        password: ""
      })
      //invoke this.props.updateUser passing in the response data from our request so we can update the user object on App.js
      this.props.updateUser(user.data);
    })
    .catch(err => {
      this.setState({ username: '', password: ''});
      alert(err.response.request.response);
    }); 
  }

  logout() {
    // axios GET to /auth/logout here
    axios.get("/auth/logout")
    //we don't need to use response, since it is the string 'OK' because we used the sendStatus method on the backend. 
    .then(() => {
      //modify the user object stored on state in App.js by calling the updateUser method passed through props from
      //the app component with an empty object so that it clears all user data off of state. 
      this.props.updateUser({})
    })
    .catch(err => console.log(err))
  }

  render() {
    const { username, password } = this.state;
    const { user } = this.props;
    return (
      <div className="Header">
        <div className="title">Dragon's Lair</div>
        {user.username ? (
          <div className="welcomeMessage">
            <h4>{user.username}, welcome to the dragon's lair</h4>
            <button type="submit" onClick={this.logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="loginContainer">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => this.handleUsernameInput(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => this.handlePasswordInput(e.target.value)}
            />
            <div className="adminCheck">
              <input type="checkbox" id="adminCheckbox" onChange={() => this.toggleAdmin()} /> <span> Admin </span>
            </div>
            <button onClick={this.login}>Log In</button>
            <button onClick={this.register} id="reg">
              Register
            </button>
          </div>
        )}
      </div>
    );
  }
}

