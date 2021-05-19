
import React, { Component } from 'react';
import client from '../../../feathers';
import STATUS from '../utilities/TransStatus';

import { Dropdown, DropdownButton, Popover, Badge, Button, Row, Col, Form, Container, Image, ListGroup, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';
import blockicon from '../../../imgs/blockchainicon.png';
import Web3 from 'web3';
import chainrenterArtifact from "../../../contracts/Chainrenter.json";
const axios = require('axios');
const BigNumber = require('bignumber.js');
const transacts = client.service('transacts');
const myService = client.service('my-service');
const UpdateStatusWhenBothStarted = client.service('updateStatusWhenBothStarted');


const getEthToUsdApi = async () => {
    try {
        let usdApi = await axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/');
        let usdToEth = usdApi.data[0].price_usd;
        console.log("heres ethusd ", usdToEth);
        return usdToEth;
    } catch (error) {
        console.error("eeeee23or", error);

    }
}

const getEthToUsdConversion = async (amountOfUsd) => {
    try {
        console.log("usd", amountOfUsd);
        if (amountOfUsd) {
            let etherAmt = amountOfUsd / await getEthToUsdApi();
            console.log("heres the ether amount", etherAmt);
            return etherAmt;
        } else {
            console.log("nan ");
            return 0;
        }
    } catch (error) {
        console.error("eee44343or", error);
    }
}


export class StageFourBorrower extends Component {

    constructor(props) {
        super(props);
        console.log("props", this.props);
        console.log("iddd", this.props.id);
        this.state = {
            // finalnotes: ''
            transactDetails: {},
            lilpassword: null,
            rentingContract: null,
            visitorAccount: null,
            showBorrMainButtons: false,
            payAmtInEther: 0,
            isBlue: true
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

        //TODO if succesful - then we need to start contract
        let that = this;
        console.log("hdanel req id:", that.props.id);


        var hashedString = null;
        var unhashedString = null;
        // console.log("handling reuqwest", e);
        try {
            if (e.target.id === "accept") {

                if (this.state.lilpassword) {
                    if (this.state.lilpassword.length > 9) {
                        hashedString = this.props.webthree.utils.keccak256(this.state.lilpassword);
                        unhashedString = this.state.lilpassword.toString();
                        console.log("hashshhed string", hashedString);
                    } else {
                        alert("Please make sure your password has at least 10 characters.");
                        return
                    }
                } else {
                    alert("Please enter a share password");

                    return
                }


                const { startRentalByBorrower } = this.props.rentingContract.methods;
                // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

                // TODO on hash not working
                //TODO should be deposit plus totalprice
                //TODO index currently faked
                console.log("ascontractid",this.state.transactDetails.contractid);
                await startRentalByBorrower(parseInt(this.state.transactDetails.contractid), unhashedString.toString()).send({ value: BigNumber(this.props.webthree.utils.toWei(BigNumber(this.state.payAmtInEther).toFixed(), 'ether')).toFixed(), gas: 1140000, from: this.props.visitorAccount })
                    .on('transactionHash', function (hash) {
                        console.log('hash', hash);

                        console.log('hashed - strated by borrower', hash);
                        console.log("aaac is here?????");

                        //disable buttons so they can't launch again
                        that.setState({
                            showBorrMainButtons: true,
                            isBlue: false
                        });

                        let hashInfo = { hash: hash, idoftransact: that.props.id, idbkchain: that.state.transactDetails.contractid, nextStatus: 6, contractInfo: that.props.contractInfo };
                        console.log("hashhahaaa2",hashInfo);

                        UpdateStatusWhenBothStarted.get(hashInfo).then((res) => {
                            console.log("response aaa from upload service",res);
                            // this.setState({showPending: true});

                            //this is a bad idea because other user might not have gone yet
                            // let tmpDeets = { status: STATUS["5. Contract Started"] };
                            // transacts.patch(that.props.id, tmpDeets).then(() => {
                            //     console.log("hi done");

                            // });
                        });



                    })
                    .then(function () {

                        console.log("totally done!!!");

                    });

                console.log("succes fro mblockhcain");


            } else if (e.target.id === "reject") {
                console.log("rejected");

                let tmpDeets = { status: STATUS["911. Rental Failed"] };
                transacts.patch(that.props.id, tmpDeets).then(() => {
                    console.log("hi done");
                    // this.props.finishCallback(1);
                    // that.setState({
                    //     finalnotes: ''

                    // });

                });
            } else if (e.target.id === "refund") {
                console.log("refund wanted");

                //TODO need to wire this and create a way to allow in contract a refund if lister takes no action within 24 hours 

                // let tmpDeets = { status: STATUS["911. Rental Failed"] };
                // transacts.patch(that.props.id, tmpDeets).then(() => {
                //     console.log("hi done");
                // });
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

                
                //TODO fix fudge +2 to makesure theres enought money in there
                let payAmtUsd = parseInt(res.deposit) + parseInt(res.totalprice)+200;
                console.log("ammmt", payAmtUsd);

                let payAmtInEther = await getEthToUsdConversion(payAmtUsd);
                console.log("pay amount ether", payAmtInEther);
                this.setState({
                    transactDetails: deets,
                    payAmtInEther
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
                <div className="justify-content-md-center timerr">
                    <Image src={blockicon} />
                    <h5 className="text-center">READY ON BLOCKCHAIN:<br />Confirm When the Item Handoff Is Complete</h5>
                </div>
                {/* <Row><span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span></Row> */}

                {/* <Row className="justify-content-md-center ">

                    <div className="justify-content-md-center " style={{ backgroundColor: "#aaccff", padding: ".8rem", margin: ".5rem" }} >
                        <p className="text-center"><strong>Transaction on Blockchain:</strong> </p>
                        <p className="text-center">"0xjkasdfnaiod (link to blockscout)"</p>
                    </div>

                </Row> */}


                <Row className="justify-content-md-center ">    

                    <div className="justify-content-md-center "  style={this.state.isBlue ? { backgroundColor: "#aaccff", padding: ".8rem", margin: ".5rem" }: { backgroundColor: "#bbbbbb", padding: ".8rem", margin: ".5rem" }} >
                        <p className="text-center"><strong>To Start the Rental, You Must Send at least this amount to the Contract: </strong> </p>
                        <p className="redText text-center"><br /><strong>{this.state.payAmtInEther} Ether</strong></p>
                        <p className="text-center">(This amount reflects the contract's rental price of ${this.state.transactDetails.totalprice}) plus the deposit of ${this.state.transactDetails.deposit}, converted to ether) </p>
                    </div>

                </Row>

                <Row className="justify-content-md-center ">
                    {/* style={{ backgroundColor: "#aaccff", padding: ".8rem", margin: ".5rem" }} */}
                    <div className="justify-content-md-center" style={this.state.isBlue ? { backgroundColor: "#aaccff", padding: ".8rem", margin: ".5rem" }: { backgroundColor: "#bbbbbb", padding: ".8rem", margin: ".5rem" }} >

                        <Form className="justify-content-md-center ">
                            <Form.Group controlId="lilpassword" className="justify-content-md-center ">
                                <Form.Label>Please create a password for this transaction to share with lister:</Form.Label>
                                <Form.Control size="sm" type="textzz" placeholder="Choose a password to share" onChange={this.handleChangeInput} value={this.state.lilpassword} disabled={this.state.showBorrMainButtons} />
                                <Form.Text className="text-muted">
                                    It should be at least 10 characters, with no punctuation or spaces. (Make sure to write this down, you will need to give this to the borrower, so they can start the rental on their end.)
                             </Form.Text>
                            </Form.Group>
                        </Form>
                    </div>

                </Row>

                <Row className="justify-content-md-center ">
                    <Col className="justify-content-md-center  text-center buttonDiv">
                        <Button disabled={this.state.showBorrMainButtons} variant="primary" onClick={this.handleRequest} id="accept">Pay and Begin Handoff</Button>
                        {/* do check to make sure theres text */}
                        <Button disabled={this.state.showBorrMainButtons} variant="secondary" onClick={this.handleRequest} id="reject" >Handoff Failed</Button>
                    </Col></Row>
                {this.state.showBorrMainButtons
                    ? <Row className="justify-content-md-center "><Button disabled={!this.state.showBorrMainButtons} variant="secondary" onClick={this.handleRequest} id="refund" >Click for refund if after 24 hours and lister hasn't confirmed </Button> </Row>
                    : null
                }

                <Row><span>&nbsp;&nbsp;</span></Row>
                {/* status: {STATUS.} */}
            </Col>
        )
    };
}


export class StageFourLister extends Component {

    constructor(props) {
        super(props);
        console.log("props", this.props);
        console.log("iddd", this.props.id);
        this.state = {
            // finalnotes: ''
            transactDetails: {},
            lilpassword: null,
            rentingContract: null,
            visitorAccount: null,
            showPending: false
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

        //TODO if succesful - then we need to start contract


        let that = this;
        console.log("hdanel req id:", that.props.id);
        var hashedString = null;
        var unHashedString = null;

        // console.log("handling reuqwest", e);
        try {
            if (e.target.id === "accept") {

                if (this.state.lilpassword) {
                        hashedString = this.props.webthree.utils.keccak256(this.state.lilpassword);
                        unHashedString = this.state.lilpassword;
                        console.log("hashshhed string", hashedString);
                } else { 
                    alert("You must enter the password from the borrower")
                    return }

                const { startRentalByLister } = this.props.rentingContract.methods;


                //TODO - here we need to get idfromblockchain (contractid) from transacts
                console.log("what is this: ", that.props.contractInfo);
                //send params id and string to hash TODO
                await startRentalByLister(parseInt(this.state.transactDetails.contractid), unHashedString.toString()).send({ gas: 1140000, from: this.props.visitorAccount })
                    .on('transactionHash', function (hash) {
                        console.log('hashed - strated by lister', hash);
                        console.log("zzz is here?????");
                        //this needs to be in backend to check for BOTHstarted being emitted

                        // that.props.rentingContract.events.allEvents({
                        //     // filter: {transactionHash: hash}, // Using an array means OR: e.g. 20 or 23
                        //     fromBlock: 0
                        //   }, function (error, event) {


                        //     console.log("sssss", event);
                        //   });


                        //   that.state.rentingContract.events.rentalIsStartedByBoth({
                        //     // filter: {transactionHash: hash}, // Using an array means OR: e.g. 20 or 23
                        //     fromBlock: 0
                        // }, function (error, event) {
                        //     if (error){
                        //         console.log("errro contactth", error);
                        //     }

                        //     console.log("yes started by both", event);

                        // }).on('error', console.error);


                        let hashInfo = { hash: hash, idoftransact: that.props.id, idbkchain: that.state.transactDetails.contractid, nextStatus: 6, contractInfo: that.props.contractInfo };
                        console.log("hashhahaaa2",hashInfo);

                        UpdateStatusWhenBothStarted.get(hashInfo).then((res) => {
                            console.log("response aaa from upload service",res);
                            // this.setState({showPending: true});

                            //this is a bad idea because other user might not have gone yet
                            // let tmpDeets = { status: STATUS["5. Contract Started"] };
                            // transacts.patch(that.props.id, tmpDeets).then(() => {
                            //     console.log("hi done");

                            // });
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



        // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545"); //


        // try {
        //   // get contract instance
        //   console.log("aa", web3.eth.net.getId());
        //   const networkId = await web3.eth.net.getId();
        //   const deployedNetwork = chainrenterArtifact.networks[networkId];
        //   console.log("deploooo", deployedNetwork);

        //   let contractAddress = deployedNetwork.address;
        //   let rentingContract = new web3.eth.Contract(
        //     chainrenterArtifact.abi,
        //     deployedNetwork.address,
        //   );

        //   // get accounts
        //   const accounts = await web3.eth.getAccounts();
        //   let visitorAccount = accounts[0];
        //   console.log("vis account", visitorAccount);



        //   this.setState({
        //     webthree: web3,
        //     rentingContract,
        //     visitorAccount,
        //     contractInfo: { abi: chainrenterArtifact.abi, address: deployedNetwork.address }
        //   });
        //   //   this.sendToBlockChain();
        //   // await loadCandidates();

        // } catch (error) {
        //   console.log(error);
        //   console.error("Could not connect to contract or chain.");
        // };

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
                {/* {this.state.showPending 
                ? <div>hello</div>
                : null
                } */}
                <div className="justify-content-md-center timerr">
                    <Image src={blockicon} />
                    <h5 className="text-center">READY ON BLOCKCHAIN:<br />Confirm When the Item Handoff Is Complete</h5>
                </div>

                {/* <Row className="justify-content-md-center ">

                    <div className="justify-content-md-center " style={{ backgroundColor: "#aaccff", padding: ".8rem", margin: ".5rem" }} >
                        <p className="text-center"><strong>Transaction on Blockchain:</strong> </p>
                        <p className="text-center">"0xjkasdfnaiodfiosdfgnsdfg (will be link to blockscout)"</p>
                    </div>

                </Row> */}


                <Row className="justify-content-md-center ">
                    <div className="justify-content-md-center " style={{ backgroundColor: "#aaccff", padding: ".8rem", margin: ".5rem" }} >

                        <Form className="justify-content-md-center ">
                            <Form.Group controlId="lilpassword" className="justify-content-md-center ">
                                <Form.Label>Enter Password Given to You By Borrower:</Form.Label>
                                <Form.Control size="sm" type="textzz" placeholder="Enter Password from Borrower" onChange={this.handleChangeInput} value={this.state.lilpassword} />
                                <Form.Text className="text-muted">
                                    The borrower will create this password when they activate the rental. When you meet up to transfer the item, you must ask for the password from them and enter it here.
                             </Form.Text>
                            </Form.Group>
                        </Form>
                    </div>

                </Row>



                <Row className="justify-content-md-center ">
                    <Col className="justify-content-md-center  text-center buttonDiv">
                        <Button variant="primary" onClick={this.handleRequest} id="accept">Item Handoff Complete</Button>
                        {/* do check to make sure theres text */}
                        <Button variant="secondary" onClick={this.handleRequest} id="reject" >Handoff Failed</Button>
                    </Col></Row>
                <Row><span>&nbsp;&nbsp;</span></Row>
                {/* status: {STATUS.} */}
            </Col>
        )
    };
}


// export default StageOneLister;