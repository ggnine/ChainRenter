
import React, { Component } from 'react';
import client from '../../../feathers';
import STATUS from '../utilities/TransStatus';
import timer from '../../../imgs/timer.png';

import { Dropdown, DropdownButton, Popover, Badge, Button, Row, Col, Form, Container, Image, ListGroup, OverlayTrigger } from 'react-bootstrap';
const transacts = client.service('transacts');


export class StageOneLister extends Component {

    constructor(props) {
        super(props);
        console.log("props", this.props);
        console.log("iddd", this.props.id);
        this.state = {
            finalnotes: ''

        };

        this.handleRequest = this.handleRequest.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleSubmitRent = this.handleSubmitRent.bind(this);



    }
    handleSubmitRent(e) {
        e.preventDefault();

        console.log("submmited");


    }
    handleRequest(e) {
        let that = this;
        console.log("hdanel req id:", that.props.id);
        // console.log("handling reuqwest", e);
        if (e.target.id === "accept") {
            let tmpDeets = { finalnotes: this.state.finalnotes, status: STATUS["2. Pending"] };

            transacts.patch(that.props.id, tmpDeets).then(() => {
                console.log("hi done");
                that.setState({
                    finalnotes: ''

                });

            });
        } else {
            console.log("rejected");

            let tmpDeets = { finalnotes: this.state.finalnotes, status: STATUS["911. Rental Failed"] };
            transacts.patch(that.props.id, tmpDeets).then(() => {
                console.log("hi done");
                that.setState({
                    finalnotes: ''

                });

            });
        }
        // alert("complete");

        
        this.props.finishCallback();

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

    componentDidMount() {
        // transacts.on('patched', res => {
        //         console.log("removeeeeed YYYY", res);
        //     });
    }

    render() {
        return (

            <Col className=" lg={2}">
                {/* <Row><span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span></Row> */}
                <Row className="justify-content-md-center "><h3 className="text-center">Respond to Request from Borrower</h3></Row>
                <Row></Row>

                {/* check if action is needed -- IF SO do these */}


                <Row className="justify-content-md-center ">
                    <p className="text-center">Review the transaction details (such as dates, price and deposit). </p>
                    <Form>



                        <Form.Group onSubmit={this.handleSubmitRent}>
                            <Form.Label className="text-center">If you approve, list a location and exact time to meet with borrower to handoff item below:</Form.Label>
                            <Form.Control as="textarea" id="finalnotes" rows="3" onChange={this.handleChangeText} value={this.state.finalnotes} />
                        </Form.Group>
                    </Form>
                </Row>

                {/* ALSO include option to change time OR maybe just have user rent by day -- ??*/}

                {/* EVENTually include a map to pinpoint location */}


                <Row className="justify-content-md-center ">
                    <Col className="justify-content-md-center  text-center buttonDiv">
                        <Button variant="primary" onClick={this.handleRequest} id="accept" >Accept Request</Button>

                        <Button variant="secondary" onClick={this.handleRequest} id="reject">Reject Request</Button>
                        {/* do check to make sure theres text */}
                    </Col></Row>
                <Row><span>&nbsp;&nbsp;</span></Row>
                {/* status: {STATUS.} */}
            </Col>
        )
    };
}

export const StageOneBorrower = (props) => {
    let tempVal = 'nothing';
    return (
        <div className="justify-content-md-center timerr">
            <Image src={timer} />
            <h5 className="text-center">Waiting for response from item's lister.</h5>
        </div>
    )
}

// export default StageOneLister;