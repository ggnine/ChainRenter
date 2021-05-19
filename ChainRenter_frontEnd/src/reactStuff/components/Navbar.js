import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
// import { withRouter } from ‘react-router-dom’
import client from '../../feathers';
import chain from '../../imgs/chain.svg';
import { Row, Col, FormControl, Button, Form, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';

// import 'react-materialize';

const crlistings = client.service('crlistings');
const users = client.service('users');

class NavBar extends Component {
    constructor(props) {
        console.log("Asdf");

        super(props);
        console.log("props", JSON.stringify(this.props));
        this.state = {
            searchTerm: ''

        }
        this.handleChangew = this.handleChangew.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.handleSubmitw = this.handleSubmitw.bind(this);
        console.log("Assdfdf");

    }

    handleLogout() {
        console.log("lgoggin out!!!");
        client.logout();
        console.log("loggged out");
    }

    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmitw(e);
        }
    }
    handleChangew(e) {
        console.log("Asdf333355");
        e.preventDefault();
        // console.log("111",this.props);
        console.log("111", e.target.value)
        this.setState({
            [e.target.id]: e.target.value
        });
        if (e.target.value === '') {
            console.log("trying zero serach", e.target.value);
            this.handleEmptySubmit();
        }
    }
    handleSubmitw(e) {
        console.log("props", this.props);
        console.log("333submiteted", this.state.searchTerm);
        console.log("loc: ", this.props.location.pathname);

        // this.props.history.push('/');

        if (this.state.searchTerm) {
            //already at the main listings/search page
            if (this.props.location.pathname === '/') {
                console.log("emitting");
                client.emit('queried', {
                    type: 'queried',
                    searchTerm: this.state.searchTerm
                });
                //navigate to search page
            } else {
                console.log("pushing with sz");
                this.props.history.push('/', { sz: this.state.searchTerm });

            }

            //clearing state of searchterm might triger empty submit
            this.setState({
                searchTerm: ''
            });

        }


        // this.history.pushState(null, 'login');
        //  console.log("22a",isEmpty);

        e.preventDefault();

        // console.log('aa', this.state.searchTerm);

        // console.log("in text");
        // client.emit('queried', {
        //     type: 'queried',
        //     searchTerm: this.state.searchTerm
        // });



    }
    handleEmptySubmit() {
        console.log("333empty");
        client.emit('queried', {
            type: 'queried',
            searchTerm: ''
        });

    }
    componentDidMount() {
        const crlistings = client.service('crlistings');
        const users = client.service('users');

        // socket.on("doSearch", (data) => {
        //     console.log("1118234231111100088",data);
        // });
        crlistings.on('created', message => {
            console.log("created XX");
            // this.setState();
        });
    }
    render() {
        console.log("As2111df");

        return (
            <Navbar bg="primary" variant="dark" expand="lg">
                <Navbar.Brand as={NavLink} to="/">
                    <Image 
                        
                        src={chain}
                        width="30"
                        height="30"
                        className="d-inline-block align-top logooo"
                    />
                    {'ChainRenter'}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {/* <Nav.Link as={NavLink} to="/" >Home</Nav.Link> */}


                        {/* <Nav.Link as={NavLink} to='/mypage'>My Listings</Nav.Link> */}
                        <NavDropdown title="My ChainRenter" id="basic-nav-dropdown">
                            <NavDropdown.Item as={NavLink} to='/mypage'>My Listings</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to='/transactions'>My Transactions</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to='/messages'>My Messages</NavDropdown.Item>
                            {/* <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
                        </NavDropdown>
                        <Nav.Link as={NavLink} to='/listsomething' >List Item</Nav.Link>    

                        <Nav.Link as={NavLink} to='/about'>How It Works</Nav.Link>
                        <Nav.Link as={NavLink} to='/' onClick={this.handleLogout}>Logout</Nav.Link>
                      
                    </Nav>
                    <Form inline onSubmit={this.handleSubmitw}>
                        {/* <div className="input-field c-notes" > */}
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" id="searchTerm" onKeyDown={this._handleKeyDown} className=" white-text" onChange={this.handleChangew} value={this.state.searchTerm} />
                        <Button variant="primary" onClick={this.handleSubmitw} >Search</Button>
                        {/* </div> */}
                    </Form>
                </Navbar.Collapse>
            </Navbar>

            // <nav >
            //     <div className="nav-wrapper  blue darken-2">
            //     <NavLink to='/' className="brand-logo" id="headz">ChainRenter</NavLink>

            //         <ul id="nav-mobile" className="right hide-on-med-and-down">

            //             <li>
            //                 <div className="center row">
            //                     <div className="col s12 " >
            //                         <div >
            //                             <div className="input-field col s6 s12 red-text" >
            //                                 <i  onClick={this.handleSubmitw} className="white-text material-icons prefix" >search</i>
            //                                 {/* <form onSubmit={this.handleSubmitw}> */}
            //                                 <input style={{backgroundColor: "#4477ff"}} type="text" name="text" placeholder=" Search" id="searchTerm" onKeyDown={this._handleKeyDown} className=" white-text" onChange={this.handleChangew} value={this.state.searchTerm} />

            //                                 {/* </form> */}
            //                             </div>
            //                         </div>
            //                     </div>
            //                 </div>
            //             </li>

            //             {/* <li><NavLink to="/">Home</NavLink></li> */}
            //             <li><NavLink to='/listsomething'>List an Item</NavLink></li>
            //             <li><NavLink to='/mypage'>My Listings</NavLink></li>
            //             <li><NavLink to='/about'>About</NavLink></li>
            //             <li><NavLink to='/login'>Login</NavLink></li>


            //             {/* <li>
            //             <form onSubmit={this.handleSubmitw}>
            //                 <div className="input-field c-notes" >
            //                     <input id="search" type="search" onChange={this.handleChangew} required/>
            //                     <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
            //                     <i className="material-icons">close</i>
            //                 </div>
            //             </form></li> */}
            //         </ul>
            //     </div>
            // </nav>


        )
    }

}

export default withRouter(NavBar);