
import React, { Component } from 'react';
import client from '../../../feathers';
import STATUS from '../utilities/TransStatus';

import { Dropdown, DropdownButton, Popover, Badge, Button, Row, Col, Form, Container, Image, ListGroup, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';
import timer from '../../../imgs/timer.png';
import Web3 from 'web3';
import chainrenterArtifact from "../../../contracts/Chainrenter.json";
const axios = require('axios');
const transacts = client.service('transacts');
const myService = client.service('my-service');
const UpdateStatusWhenBothStarted = client.service('updateStatusWhenBothStarted');



const getEthToUsdApi = async () => {
    try {
        let usdToEth =  await axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/').data[0].price_usd;
        console.log("heres ethusd ",usdToEth);
        return usdToEth;
    } catch (error) {
        console.error("eeeee23or",error);
    }
}

const getEthToUsdConversion = async (amountOfUsd) => {
    try {
        let etherAmt = amountOfUsd/getEthToUsdApi();
        console.log("heres the ether amount",etherAmt);
        return etherAmt;
    } catch (error) {
        console.error("eee44343or",error);
    }
}

export class StageFiveBorrower extends Component {

    constructor(props) {
        super(props);
        console.log("props", this.props);
        console.log("iddd", this.props.id);
        this.state = {
            // finalnotes: ''
  
        };

        this.handleRequest = this.handleRequest.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);

    }

    async handleChangeInput(e) {
        console.log("111 id: ", e.target.id);

        console.log("111 val: ", e.target.value);
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    async handleRequest(e) {


    }

    async componentDidMount() {
       

    }

    render() {
        return (

            <Col className=" lg={2}">
             
                <div className="justify-content-md-center timerr">
                    <Image src={timer} />
                    <h5 className="text-center">CONTRACT STARTED:<br />Waiting for Your Payment to go through and Handoff to Go Live on Blockchain</h5>

                    {/* <p className="text-center">Make sure to give the lister the handoff password you created in the last step. They will need that to start the rental.</p> */}

                </div>

                <Row className="justify-content-md-center ">

                    <div className="justify-content-md-center " style={{ backgroundColor: "#aaccff", padding: ".8rem", margin: ".5rem" }} >
                        <p className="text-center"><strong>Transaction on Blockchain:</strong> </p>
                        <p className="text-center">"0xjkasdfnaiodfiosdfgnsdfg (will be link to blockscout)"</p>
                    </div>

                </Row>


            </Col>
        )
    };
}


export class StageFiveLister extends Component {

    constructor(props) {
        super(props);
        console.log("props", this.props);
        console.log("iddd", this.props.id);
        this.state = {
            // finalnotes: ''
  
        };

        this.handleRequest = this.handleRequest.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);

    }

    async handleChangeInput(e) {
        console.log("111 id: ", e.target.id)

        console.log("111 val: ", e.target.value)
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    async handleRequest(e) {


    }

    async componentDidMount() {
       

    }

    render() {
        return (

            <Col className=" lg={2}">
             
                <div className="justify-content-md-center timerr">
                    <Image src={timer} />
                    <h5 className="text-center">CONTRACT STARTED:<br />Waiting for Borrower's Payment to go through and Handoff to Go Live on Blockchain</h5>

                </div>

                <Row className="justify-content-md-center ">

                    <div className="justify-content-md-center " style={{ backgroundColor: "#aaccff", padding: ".8rem", margin: ".5rem" }} >
                        <p className="text-center"><strong>Transaction on Blockchain:</strong> </p>
                        <p className="text-center">"0xjkasdfnaiodfiosdfgnsdfg (will be link to blockscout)"</p>
                    </div>

                </Row>


            </Col>
        )
    };
}
