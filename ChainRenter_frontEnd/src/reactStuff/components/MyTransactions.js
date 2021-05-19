import React, { Component } from 'react';
import client from '../../feathers';
import MyItemList from './MyItemList';
import moment from 'moment';

import TransactionsTable from './TransactionsTable';

import { Button, Dropdown, DropdownButton, Row, Col, Table, Container } from 'react-bootstrap';

const transacts = client.service('transacts');
const crlistings = client.service('crlistings');
const users = client.service('users');

class MyTransactions extends Component {

    constructor(props) {
        super(props);
        console.log("idddd", this.props.match.params.id);

        this.state = {
            idOfItemToEdit: this.props.match.params.id,
            itemsAsRenter: [], //{ lendobject: '1111aaaa', lenddesc: '111bbb', lendprice: '111ccccc', id: '999' }, { lendobject: '111aaaa22', lenddesc: '1111bbb22', lendprice: 'ccccc22', id: '2312' }
            // sortTerm:''
            itemsAsBorrower: [],
            id: '',
            activeLister: true,
            activeBorrower: true,
            pastList: false

        }
        this.createItemsFromDb = this.createItemsFromDb.bind(this);
        this.handleHideShow = this.handleHideShow.bind(this);




    }
    handleHideShow(e) {
        console.log("hanndler", e);
        e.preventDefault();

        // console.log("111",this.props);
        console.log("111zz", this.state[e.target.id]);
        this.setState({
            [e.target.id]: !this.state[e.target.id]
        });
        // if (e.target.value === '') {
        //     console.log("trying zero serach", e.target.value);
        //     // if (e.target.id === '')
        //     // this.handleEmptySubmit();
        // }

    }

    async createItemsFromDb(res) {
        return new Promise(async function (resolve, reject) {
            console.log("aaa");
            let data = res.data;
            console.log('from await crlistings:', res);


            // this.setState({ crlistings: this.state.crlistings.concat(message) });
            let tmp3 = data.map(async (cont) => {
                if (cont.contractid) {
                    var tmpStatus = "Active"
                } else {
                    var tmpStatus = "Pending"

                }
                let itemFromcrlistings = await crlistings.get(cont.itemidinrentlib)
                    .catch(err => {
                        console.log("eeerrroro");
                    });

                console.log("created att", moment(cont.createdAt).format('MMM Do YY')); // → "Sep 2nd 07");
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                console.log("date: ", moment(cont.checkoutdate, "x").format('LLLL'));

                console.log("date: ", new Date(cont.checkoutdate));
                let t1 = cont.checkoutdate;

                return {
                    rl_name: itemFromcrlistings.lendobject,
                    itemidinrentlib: cont.itemidinrentlib,
                    id: cont.id,
                    createdat: new Date(cont.createdAt).toLocaleDateString("en-US", options),
                    initialnotes: cont.initialnotes,
                    finalnotes: cont.finalnotes,
                    totalprice: cont.totalprice,
                    deposit: cont.deposit,
                    checkoutdate: moment(cont.checkoutdate, "x").format('LLLL'),
                    checkindate: moment(cont.checkindate, "x").format('LLLL'),
                    // checkoutdate: new Date(cont.checkoutdate).toLocaleDateString("en-US", options),
                    // checkindate: new Date(cont.checkindate).toLocaleDateString("en-US", options),
                    status: cont.status

                };
            });

            Promise.all(tmp3).then((completed) => {
                console.log("complllllll", completed);
                resolve(completed);

            });

        });

    }
    async componentDidMount() {

        let accessTokenMe = '';
        console.log("332223");
        var that = this;
        await client.authenticate().then((res) => {
            console.log("thesss", res.accessToken);
            accessTokenMe = res.accessToken;
            return client.passport.verifyJWT(accessTokenMe);
        })
            .then(payload => {
                console.log('JWT Payload', payload);
                return client.service('users').get(payload.userId);
            })
            .then(user => {
                client.set('user', user);
                console.log('User', client.get('user'));
            })
            .catch(function (error) {
                console.error('Error authenticating!', error);
            });


        //getting transactions where user is the rentre
        console.log("getting as renter", client.get('user'));
        let userHere = client.get('user');
        await transacts.find({
            query: {
                $limit: 200,
                renteruserid: [client.get('user')._id]
                // $sort: {
                //     lendobject: 1
                // }
            }
        })
            .then(async (res) => {
                let itemsAsRenter = await this.createItemsFromDb(res);
                console.log("from as broow11", res);
                if (itemsAsRenter) {
                    that.setState({
                        itemsAsRenter
                    });
                }

            })
            .catch(err => {
                console.log("er3333rere", err)
            })


        //TODO: getting transactions where user is the borrower
        console.log("getting as brrower", client.get('user'));
        await transacts.find({
            query: {
                $limit: 200,
                borroweruserid: [client.get('user')._id]
                // $sort: {
                //     lendobject: 1
                // }
            }
        })
            .then(async (res) => {
                let itemsAsBorrower = await this.createItemsFromDb(res);
                console.log("from as broow11", res);
                if (itemsAsBorrower) {
                    that.setState({
                        itemsAsBorrower
                    });
                }

            })
            .catch(err => {
                console.log("er3333rere", err)
            })

        console.log("itemzzz: ", this.state.itemsAsBorrower);


    }
    render() {
        return (
            <div className="transactions">
                <Container className="justify-content-md-center">
                    <Row className="justify-content-md-center ">
                        <Col sm={10}>
                            <Row>
                                <span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span>
                            </Row>

                            <Row className="justify-content-md-center">

                                <Col> <h2 className="text-center">My Transactions</h2></Col>

                            </Row>

                            {/* <Col> Active Transactions As Lister</Col>
                            <Col> Active Transactions As Borrower</Col>
                            <Col> Past Transactions</Col> */}


                            <Row className="justify-content-md-center">


                                <Row className="justify-content-md-center makehundred">
                                    <Col></Col>
                                    <Col>
                                        <h4 className="text-center">Active Transactions As Lister</h4>
                                    </Col>
                                    <Col className="colBut">
                                        <Button id="activeLister" size='sm' onClick={this.handleHideShow}>
                                            {this.state.activeLister
                                                ? "Hide"
                                                : "Show"
                                            }
                                        </Button>

                                    </Col>
                                </Row>
                                {this.state.activeLister
                                    ? <Table striped bordered hover>
                                        <TransactionsTable items={this.state.itemsAsRenter} hist={this.props.history} />
                                    </Table>
                                    : null
                                }


                            </Row>
                            <Row className="justify-content-md-center">


                                <Row className="justify-content-md-center makehundred">
                                    <Col xs={3}></Col>
                                    <Col xs={6}>
                                        <h4 className="text-center">Active Transactions As Borrower</h4>
                                    </Col>
                                    <Col xs={3} className="colBut">
                                        <Button id="activeBorrower" size='sm' onClick={this.handleHideShow}>
                                            {this.state.activeBorrower
                                                ? "Hide"
                                                : "Show"
                                            }
                                        </Button>

                                    </Col>
                                </Row>
                                {this.state.activeBorrower
                                    ? <Table striped bordered hover>

                                        <TransactionsTable items={this.state.itemsAsBorrower} hist={this.props.history} />
                                    </Table>
                                    : null
                                }


                            </Row>
                            <Row className="justify-content-md-center">

                                <Row className="justify-content-md-center makehundred">
                                    <Col xs={3}></Col>
                                    <Col xs={6}>
                                        <h4 className="text-center">Past Transactions</h4>
                                    </Col>
                                    <Col xs={3} className="colBut">
                                        <Button id="pastList" size='sm' onClick={this.handleHideShow}>
                                            {this.state.pastList
                                                ? "Hide"
                                                : "Show"
                                            }
                                        </Button>

                                    </Col>
                                </Row>
                                {this.state.pastList
                                    ? <Table striped bordered hover>

                                        {/* this needs to be only completed items -- DO this logic here not in child */}
                                        <TransactionsTable items={this.state.itemsAsRenter} hist={this.props.history} />
                                    </Table>
                                    : null
                                }

                            </Row>
                        </Col>
                    </Row>
                </Container>

            </div>
        )
    }

}

export default MyTransactions;