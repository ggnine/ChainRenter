
import React, { Component } from 'react';
import client from '../../../feathers';
import STATUS from '../utilities/TransStatus';

import { Dropdown, DropdownButton, Popover, Badge, Button, Row, Col, Form, Container, Image, ListGroup, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';
import timer from '../../../imgs/timer.png';
const transacts = client.service('transacts');


export class StageTwoBorrower extends Component {

    constructor(props) {
        super(props);
        console.log("props", this.props);
        console.log("iddd", this.props.id);
        this.state = {
            // finalnotes: ''
            transactDetails: {}
        };

        this.handleRequest = this.handleRequest.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleSubmitRent = this.handleSubmitRent.bind(this);



    }
    handleSubmitRent(e) {
        e.preventDefault();

        console.log("submmited");


    }

    //TODO sloppy having this here -- put in userdrivenroute in its own muodule
    //and pass as a callback prop function to child

    async handleRequest(e) {
        let that = this;
        console.log("hdanel req id:", that.props.id);
        // console.log("handling reuqwest", e);
        try {
            if (e.target.id === "accept") {
                this.props.longOpFirstAddToBlockchain();
                //if patch sucesssful
                // let tmpDeets = { status: STATUS["3. Handshake"] };

                // transacts.patch(that.props.id, tmpDeets).then(() => {
                //     console.log("hi done");


                // });
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

    handleChangeText(e) {
        console.log("Asdf333355");
        e.preventDefault();
        // console.log("111",this.props);
        // console.log("111", e.target.value)
        this.setState({
            [e.target.id]: e.target.value
        });
        if (e.target.value === '') {
        }
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
                {/* <Row><span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span></Row> */}
                <Row className="justify-content-md-center ">
                    <h3 className="text-center">Accept or Reject Rental Conditions</h3>
                    <p className="text-center">(Make sure the meetup location and time work for you)</p>

                </Row>
                <Row className="justify-content-md-center ">

                    <div className="justify-content-md-center " style={{ backgroundColor: "#aaccff", padding: ".8rem", margin: ".5rem" }} >
                        <p className="text-center"><strong>Response from Item's Lister:</strong> </p>
                        <p className="text-center">"{this.state.transactDetails.finalnotes}"</p>
                    </div>

                </Row>

                {/* check if action is needed -- IF SO do these */}


                {/* ALSO include option to change time OR maybe just have user rent by day -- ??*/}

                {/* EVENTually include a map to pinpoint location */}


                <Row className="justify-content-md-center ">
                    <Col className="justify-content-md-center  text-center buttonDiv">
                        <Button variant="primary" onClick={this.handleRequest} id="accept" >Accept Rental Conditions and Post Transaction to Blockchain</Button>

                        <Button variant="secondary" onClick={this.handleRequest} id="reject">Reject Rental Conditions</Button>
                        {/* do check to make sure theres text */}
                    </Col></Row>
                <Row><span>&nbsp;&nbsp;</span></Row>
                {/* status: {STATUS.} */}
            </Col>
        )
    };
}

export const StageTwoLister = (props) => {
    let tempVal = 'nothing';
    return (
        <div className="justify-content-md-center timerr">
            <Image src={timer} />
            <h5 className="text-center">Waiting for final confirmation of rental from borrower.</h5>
        </div>
    )
}

// export default StageOneLister;