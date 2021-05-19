import React, { Component } from 'react';
import client from '../../feathers';
import { Dropdown, DropdownButton, Row, Col, Jumbotron, Container, Button, Table, Form, FormControl } from 'react-bootstrap';


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showUsername: false,
            timesClicked: 0,
            signupButtonText: "or, Sign Up",
            showLoginButton: true
        };
    }

    updateField(name, ev) {
        this.setState({ [name]: ev.target.value });
    }

    login() {
        const { email, password } = this.state;
        console.log("lgin", email);
        return client.authenticate({
            strategy: 'local',
            email, password
        }).catch(error => {
            console.log("errr2200");
            this.setState({ error });
        });
    }

    signup() {
        if (this.state.timesClicked > 0) {
            const { email, password, username } = this.state;
            console.log("signup", email);

            console.log("sjsjjs");
            client.service('users')
                .create({ email, password, username })
                .then(() => {
                    console.log("hiii");
                    this.login();
                }).catch(err => {
                    console.log("err in signup", err);
                    // alert(err.message);
                    let error = {message: "This email address has already been used to sign up. Please login."};
                    this.setState({ error});

                });
        } else {
            this.setState({
                showUsername: true,
                signupButtonText: "Sign Up",
                timesClicked: 1,
                showLoginButton: false
            });



        }
    }


    async componentDidMount() {
        const crlistings = client.service('crlistings');
        const users = client.service('users');

    }

    render() {
        return (<main className="login container">

            <div className="row">
                <div className=" col">

                    <Jumbotron style={{ backgroundColor: "#88bbff", padding: "2rem" }} className="helv jumb" >
                        <h1 >ChainRenter</h1>

                        <h3 >Rent What You Need from Friends and Neighbors</h3>
                        <h4 >Secure, Easy and Middle Man Free</h4>

                        <div> <span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span></div>
                        <div className="heading">
                            <h4 className="font-100">Log in or signup</h4>
                            <p className="redText">{this.state.error && this.state.error.message}</p>
                        </div>
                        <Row>
                            <Col xs={8} lg={3}>
                                <Form className="loginForm" >

                                    <FormControl type="email" placeholder="Email" name="email" className=" white-text" onChange={ev => this.updateField('email', ev)} />
                                    {this.state.showUsername

                                        ? <FormControl placeholder="Choose a Username" name="username" className=" white-text" onChange={ev => this.updateField('username', ev)} />
                                        : null
                                    }
                                    <FormControl type="password" placeholder="Password" name="password" className=" white-text" onChange={ev => this.updateField('password', ev)} />
                                    {this.state.showLoginButton
                                        ? <Button variant="primary" onClick={() => this.login()}>Login</Button>
                                        : null
                                    }
                                    {/* <p className="">Or, if you're new:</p> */}<span>&nbsp;</span>
                                    <Button variant="secondary" onClick={() => this.signup()}>{this.state.signupButtonText}</Button>


                                </Form>
                            </Col>
                        </Row>

                    </Jumbotron>
                </div>
            </div>



            {/* 
            <div className="row">
                <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
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
            </div> */}
        </main>);
        // return(

        //     <div className="left"> 

        //       <form className="" onSubmit={this.handleSubmitw}>
        //             <label htmlFor="username"></label>
        //             <input  type="text" id="username" onChange={this.handleChangew}/>
        //             <label htmlFor="password"></label>
        //             <input  type="text" id="password" onChange={this.handleChangew}/>
        //             <button >Login</button>
        //      </form>
        //      <form className="" onSubmit={this.handleSubmitz}>

        //             <button >new</button>
        //      </form>
        //     </div>

        // )
    }

}

export default Login;