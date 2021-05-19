import React, { Component } from 'react';
import { Dropdown, DropdownButton, Row, Col, Form, Container, Image } from 'react-bootstrap';
import client from '../../feathers';


const uploadService = client.service('uploads');
const reader = new FileReader();
// import { withWeb3 } from 'react-web3-provider';
// import Web3 from 'web3';
// import chainrenterArtifact from "../../../build/contracts/Chainrenter.json";
// import contract from 'truffle-contract';

// var ChainrenterContract = contract(chainrenterArtifact);

class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: ''
        }


        console.log('aac', props);
        // setTimeout(()=>{
        //     props.history.push('/mypage')
        // },2000)
    }

    async componentDidMount() {
        // const { web3 } = this.props;
        
        // // console.log("sdsd",web3.eth.getAccounts()[0]);

        // const accounts = await web3.eth.getAccounts();
        // console.log("web3",accounts[0]);

        document.title = "How It Works";

        console.log("hiiia");
        let that = this;

        console.log("hiiii from about client");
        client.on('welcome', function (data) {
            // addMessage(data.message);
            console.log("message from socket: ", data.message);

            // Respond with a message including this clients' id sent from the server
            client.emit('i am client', { data: 'foo!', id: data.id });
        });
        client.on('time', function (data) {
            // addMessage(data.time);
            console.log("timmemememem");
            console.log("message from socket timeX: ", data.time);

        });
        client.on('error', console.error.bind(console));
        client.on('message', console.log.bind(console));

        // 9097f07c4a02c457f1564d3722c5e524021f3303379d2afefa2314f4974af222.jpeg
        // uploadService.get("ad418194dae7586f3c33abaeadb9a5076253fdc8bcc279a0aa78590edef342dd.jpeg")
        //     .then((res) => {
        //         console.log("immmg",res.uri);
        //         that.setState({
        //             image: res.uri
        //         });
        //         console.log("aaa",res);
        //     });
    }


    render() {
        return (
            <div>
                <div className="container ">
                    <Row><span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span></Row>
                    <Row className="justify-content-md-center "><Col sm={10}>
                        <h2 className="text-center">How ChainRenter Works</h2>
                        <p>ChainRenter is a blockchain based app that lets you rent and borrow from people in your community with security and without a middle man.
                         You can list spare items you have laying around (like an extra bike) for whatever amount you like and with a
                         deposit amount of your choosing.
    
    
                   will result in "Smart Contracts" being created </p>
                        <Row><span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span></Row>
                        <h4 className="text-center">The Process in Detail:</h4>
                        <ul>
                            <li>First, you list an item you're not really using anymore (like an old fishing rod).</li>
                            <li>Next a QR code wil be generated for you , which you will need to print and affix to the item somewhere.</li>
                            <li>When you list, you will choose the price to rent per day as well as set a required deposit from the renter. You will also be asked to provide a photo and description.</li>
                            <li>Then if a renter wants your item on the app, they will request it and suggest a time and place to get it. </li>
                            <li>You can then approve or deny the rental (and decide the meeting terms).</li>
                            <li>An irreversible contract will automactically be created for your transaction on the blockchain.</li>
                            <li>At a meeting spot of your choice, the renter and rentee will each scan the QR code. This initiates the transaction.</li>
                            <li>You will be entitled to the rental fee and a security deposit from the renter will be held in escrow on the blockchain.</li>
                            <li>When the rental period is over, the renter will return the item. </li>
                            <li>And assuming both parties are happy, you will both scan the QR code, which will automatically complete the contract and transaction </li>
                            <li>At this point the security deposit will be automatically returned to the renter.</li>

                        </ul>
                        {/* <Image src={this.state.image} fluid /> */}
                        {/* <h1>Let's upload some files!</h1>
                    <input type='file' id='file' onChange={(e) => this._handleImageChange(e)} /> */}

                        {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae repudiandae repellat illo magni eligendi cupiditate voluptates eius nam voluptate. Incidunt nihil ullam quae quia officia quaerat, deserunt eligendi explicabo totam?</p> */}
                    </Col></Row>
                </div>
            </div>
        )
    }

}

export default About;

