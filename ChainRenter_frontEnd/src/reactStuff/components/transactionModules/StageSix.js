
import React, { Component } from 'react';
import client from '../../../feathers';
import STATUS from '../utilities/TransStatus';

import { Dropdown, DropdownButton, Popover, Badge, Button, Row, Col, Form, Container, Image, ListGroup, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';
import timer from '../../../imgs/timer.png';
const myService = client.service('my-service');
const transacts = client.service('transacts');

const UpdateStatusWhenBothEnded = client.service('updateStatusWhenBothEnded');

export class StageSixBorrower extends Component {

    constructor(props) {
        super(props);
        console.log("props", this.props);
        console.log("iddd", this.props.id);
        this.state = {
            // finalnotes: ''
            transactDetails: {}
        };

        this.handleRequest = this.handleRequest.bind(this);
    }

    async handleRequest(e) {

        //TODO if succesful - then we need to end contract
        //TODO if failed -- we need a way to escale -- A new resolve dispute page

        let that = this;
        console.log("hdanel req id:", that.props.id);
        // console.log("handling reuqwest", e);
        try {
            if (e.target.id === "accept") {
               

                const { closeRentalByBorrower } = that.props.rentingContract.methods;

                await closeRentalByBorrower(parseInt(that.state.transactDetails.contractid)).send({ gas: 1140000, from: that.props.visitorAccount })
                    .on('transactionHash', function (hash) {
                        console.log('hash', hash);


                        //maybe should only have one of these start the wathcing
                        let hashInfo = { hash: hash, idoftransact: that.props.id, idbkchain: that.state.transactDetails.contractid, nextStatus: 7, contractInfo: that.props.contractInfo };
                        console.log("hashhahaaa2",hashInfo);

                        UpdateStatusWhenBothEnded.get(hashInfo).then((res) => {
                            console.log("response aaa from upload service", res);
                            // this.setState({showPending: true});
                          
                        });

                    }).then(function () {

                        console.log("totally done!!!");

                    });

                console.log("succes fro mblockhcain");


            } else {
                console.log("rejected");

                let tmpDeets = { status: STATUS["911. Rental Failed"] };
                transacts.patch(that.props.id, tmpDeets).then(() => {
                    console.log("hi done");

                });
            }
        } catch (err) {
            console.log("errrrr", err);
            this.props.finishCallback(1);

        }
        this.props.finishCallback(0);

        // alert("complete");


    }


    async componentDidMount() {
        // transacts.on('patched', res => {
        //         console.log("removeeeeed YYYY", res);
        //     });

        await transacts.get(this.props.id)
            .then(async (res) => {
                console.log("item from tranacts found:", res);
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

                let deets = {
                    createdat: new Date(res.createdAt).toLocaleDateString("en-US", options),
                    checkoutdate: moment(res.checkoutdate, "x").format('LLLL'),
                    checkindate: moment(res.checkindate, "x").format('LLLL'),
                    contractid: res.contractid,
                    deposit: res.deposit,
                    finalnotes: res.finalnotes,
                    initialnotes: res.initialnotes,
                    totalprice: res.totalprice,
                    status: res.status
                };
                this.setState({
                    transactDetails: deets
                });
                // await this.getItemDetails(res);
            })
            .catch(err => {
                console.log("eror in checking transacs", err)
            })

    }

    render() {
        return (

            <Col className=" lg={2}">
                {/* <div className="justify-content-md-center timerr">
                <Image src={timer} />
                <h5 className="text-center">Rental Currently Active</h5>
            </div> */}

                <Row className="justify-content-md-center ">
                    <h3 className="text-center">Rental Currently Active</h3>

                </Row>
                <Row className="justify-content-md-center ">
                    <p className="text-center">Confirm item return below (Make sure item is returned before rental end date in contract)</p>

                    <Col className="justify-content-md-center  text-center buttonDiv">
                        <Button variant="primary" onClick={this.handleRequest} id="accept">Item Has Been Returned to Lister</Button>
                        {/* do check to make sure theres text */}
                        <Button variant="secondary" onClick={this.handleRequest} id="reject" >Problem with Item Return</Button>
                    </Col></Row>
                <Row><span>&nbsp;&nbsp;</span></Row>
                {/* status: {STATUS.} */}
            </Col>
        )
    };
}


export class StageSixLister extends Component {

    constructor(props) {
        super(props);
        console.log("props", this.props);
        console.log("iddd", this.props.id);
        this.state = {
            // finalnotes: ''
            transactDetails: {}
        };

        this.handleRequest = this.handleRequest.bind(this);

    }

    async handleRequest(e) {

        //TODO if succesful - then we need to end contract


        let that = this;
        console.log("hdanel req id:", that.props.id);
        // console.log("handling reuqwest", e);
        try {
            if (e.target.id === "accept") {
        
                const { closeRentalByLister } = that.props.rentingContract.methods;

                //send params id and string to hash TODO
                await closeRentalByLister(parseInt(that.state.transactDetails.contractid)).send({ gas: 1140000, from: that.props.visitorAccount })
                    .on('transactionHash', function (hash) {
                        console.log('hash', hash);

                        let hashInfo = { hash: hash, idoftransact: that.props.id, idbkchain: that.state.transactDetails.contractid, nextStatus: 7, contractInfo: that.props.contractInfo };
                        UpdateStatusWhenBothEnded.get(hashInfo).then((res) => {
                            console.log("response aaa from upload service", res);
                            // this.setState({showPending: true});
                          
                        });

                    }).then(function () {

                        console.log("totally done!!!");

                    });

                console.log("succes fro mblockhcain");

            } else {
                console.log("rejected");

                let tmpDeets = { status: STATUS["911. Rental Failed"] };
                transacts.patch(that.props.id, tmpDeets).then(() => {
                    console.log("hi done");
                    // this.props.finishCallback(1);
                    // that.setState({
                    //     finalnotes: ''

                    // });

                });
            }
        } catch (err) {
            console.log("errrrr", err);
            this.props.finishCallback(1);

        }
        this.props.finishCallback(0);

        // alert("complete");


    }

    async componentDidMount() {
        // transacts.on('patched', res => {
        //         console.log("removeeeeed YYYY", res);
        //     });

        await transacts.get(this.props.id)
            .then(async (res) => {
                console.log("item from tranacts found:", res);
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

                let deets = {
                    createdat: new Date(res.createdAt).toLocaleDateString("en-US", options),
                    checkoutdate: moment(res.checkoutdate, "x").format('LLLL'),
                    checkindate: moment(res.checkindate, "x").format('LLLL'),
                    contractid: res.contractid,
                    deposit: res.deposit,
                    finalnotes: res.finalnotes,
                    initialnotes: res.initialnotes,
                    totalprice: res.totalprice,
                    status: res.status
                };
                this.setState({
                    transactDetails: deets
                });
                // await this.getItemDetails(res);
            })
            .catch(err => {
                console.log("eror in checking transacs", err)
            })

    }

    render() {
        return (

            <Col className=" lg={2}">
                {/* <div className="justify-content-md-center timerr">
                    <Image src={timer} />
                    <h5 className="text-center">Rental Currently Active</h5>
                </div> */}

                <Row className="justify-content-md-center ">
                    <h3 className="text-center">Rental Currently Active</h3>

                </Row>
                <Row className="justify-content-md-center ">
                    <p className="text-center">Confirm item return below (Make sure item is returned before rental end date in contract)</p>

                    <Col className="justify-content-md-center  text-center buttonDiv">
                        <Button variant="primary" onClick={this.handleRequest} id="accept">Item Has Been Returned to Me</Button>
                        {/* do check to make sure theres text */}
                        <Button variant="secondary" onClick={this.handleRequest} id="reject" >Problem with Item Return</Button>
                    </Col></Row>
                <Row><span>&nbsp;&nbsp;</span></Row>
                {/* status: {STATUS.} */}
            </Col>
        )
    };
}


// export default StageOneLister;