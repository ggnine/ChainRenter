import React, { Component } from 'react';
import client from './feathers';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateField(name, ev) {
    this.setState({ [name]: ev.target.value });
  }

  login() {
    const { email, password } = this.state;

    return client.authenticate({
      strategy: 'local',
      email, password
    }).catch(error => this.setState({ error }));
  }

  signup() {
    const { email, password } = this.state;

    return client.service('users')
      .create({ email, password })
      .then(() => {
        console.log("successful creation i think");
        this.login();
      });

  }


  render() {
    return <main className="login container">
      <div className="row">
        <div className=" col">

          <Jumbotron style={{ backgroundColor: "#88bbff", padding: "2rem" }} className="helv jumb" >
            <h1 >ChainRenter</h1>

            <h3 >Rent What You Need from Friends and Neighbors</h3>
            <h4 >Secure, Easy and Middle Man Free</h4>
            <p></p>
            <div className="col-12 col-6-tablet push-3-tablet text-center heading">
              <h1 className="font-100">Log in or signup</h1>
              <p>{this.state.error && this.state.error.message}</p>
            </div>

          </Jumbotron>
        </div>
      </div>
  
      <div className="row">
        <div className="col">
          <form className="form">
            <fieldset>
              <input className="block" type="email" name="email" placeholder="email" onChange={ev => this.updateField('email', ev)} />
            </fieldset>

            <fieldset>
              <input className="block" type="password" name="password" placeholder="password" onChange={ev => this.updateField('password', ev)} />
            </fieldset>

            <button type="button" className="button button-primary block signup" onClick={() => this.login()}>
              Log in
            </button>

            <button type="button" className="button button-primary block signup" onClick={() => this.signup()}>
              Signup
            </button>
          </form>
        </div>
      </div>
    </main>;
  }
}
