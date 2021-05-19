import React, { Component } from 'react';
import client from '../../feathers';
import MessagesTable from './MessagesTable';
import { Button, Dropdown, DropdownButton, Row, Col, Table, Container } from 'react-bootstrap';


const crlistings = client.service('crlistings');
const users = client.service('users');

class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            id: '',
            recievedMess: true,
            sentMess: true

        }
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


        console.log("idididi", client.get('user'));
        let userHere = client.get('user');
        await crlistings.find({
            query: {
                $limit: 200,
                idfromuser: [client.get('user')._id]
                // $sort: {
                //     lendobject: 1
                // }
            }
        })
            .then((res) => {
                console.log("aaa");
                let data = res.data;
                console.log('from await crlistings:', res);


                // this.setState({ crlistings: this.state.crlistings.concat(message) });

                // let tmp3 = data.map((cont) => {
                //     return { lendobject: cont.lendobject, lenddesc: cont.lenddesc, lendprice: cont.lendprice, id: cont.id };
                // });
                let tmp2 = [{ lendobject: data.lendobject, lenddesc: data.lenddesc, lendprice: data.lendprice, data: res.id }];
                // that.setState({
                //     items: []
                // });
                // console.log("object",tmp3);
                that.setState({
                    items: tmp2
                });
            })
            .catch(err => {
                console.log("er3333rere", err)
            })

        //TODO: need to create a new messages table...probably
        crlistings.on('removed', res => {
            console.log("removeeeeed YYYY", res);
            let data = res.data;
            crlistings.find({
                query: {
                    $limit: 200,
                    idfromuser: [client.get('user')._id]
                    // $sort: {
                    //     lendobject: 1
                    // }
                }
            })
                .then((res) => {
                    console.log("aaa");
                    let data = res.data;
                    console.log('from await crlistings:', res);


                    // this.setState({ crlistings: this.state.crlistings.concat(message) });
                    let tmp3 = data.map((cont) => {
                        return { lendobject: cont.lendobject, lenddesc: cont.lenddesc, lendprice: cont.lendprice, id: cont.id };
                    });
                    // let tmp2 = [ {lendobject: data.lendobject, lenddesc: data.lenddesc, lendprice: data.lendprice, data: res.id }];
                    // that.setState({
                    //     items: []
                    // });
                    // console.log("object",tmp3);
                    that.setState({
                        items: tmp3
                    });
                })
                .catch(err => {
                    console.log("er3333rere", err)
                })
            // let tmp2 = [{ lendobject: res.lendobject, lenddesc: res.lenddesc, lendprice: res.lendprice, id: res.id }];

            // that.setState({
            //     items: this.state.items.concat(tmp2)//tmp1
            // });
        });



    }
    render() {
        return (
            <div className="transactions">
                <div className="justify-content-md-center">
                    <Container className="justify-content-md-center">

                        <Row className="justify-content-md-center ">
                            <Col sm={9}>
                                <Row>
                                    <span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span>
                                </Row>

                                <Row className="justify-content-md-center">

                                    <Col> <h2 className="text-center">My Messages</h2></Col>

                                </Row>

                                {/* <Col> Active Transactions As Lister</Col>
                            <Col> Active Transactions As Borrower</Col>
                            <Col> Past Transactions</Col> */}


                                <Row className="justify-content-md-center rowrow">


                                    <Row className="justify-content-md-center makehundred">
                                        <Col></Col>
                                        <Col>
                                            <h4 className="text-center">Recieved</h4>
                                        </Col>
                                        <Col className="colBut">
                                            <Button id="recievedMess" size='sm' onClick={this.handleHideShow}>
                                                {this.state.recievedMess
                                                    ? "Hide"
                                                    : "Show"
                                                }
                                            </Button>

                                        </Col>
                                    </Row>
                                    {this.state.recievedMess
                                        ? <Table striped bordered hover>
                                            <MessagesTable items={this.state.items} hist={this.props.history}  />
                                        </Table>
                                        : null
                                    }


                                </Row>
                                <Row className="justify-content-md-center rowrow">


                                    <Row className="justify-content-md-center makehundred">
                                        <Col xs={3}></Col>
                                        <Col xs={6}>
                                            <h4 className="text-center">Sent</h4>
                                        </Col>
                                        <Col xs={3} className="colBut">
                                            <Button id="sentMess" size='sm' onClick={this.handleHideShow}>
                                                {this.state.sentMess
                                                    ? "Hide"
                                                    : "Show"
                                                }
                                            </Button>

                                        </Col>
                                    </Row>
                                    {this.state.sentMess
                                        ? <Table striped bordered hover>

                                            <MessagesTable items={this.state.items} hist={this.props.history}  />
                                        </Table>
                                        : null
                                    }


                                </Row>
                               
                            </Col>
                        </Row>

                    </Container>

                </div>
            </div>
        )
    }

}

export default Messages;