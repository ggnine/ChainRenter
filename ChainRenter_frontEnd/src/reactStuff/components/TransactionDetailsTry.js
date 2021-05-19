import React, { Component } from 'react';
import client from '../../feathers';
// import Itemlist from './Itemlist';
import { Dropdown, DropdownButton, Popover, Badge, Button, Row, Col, Form, Container, Image, ListGroup, OverlayTrigger } from 'react-bootstrap';
// import DayPicker from 'react-day-picker';
import DatePicker from 'react-datepicker';
import DetailModal from './modals_etc/DetailModal';
import OverlayMe from './modals_etc/OverlayMe';

import StatusPopover from './utilities/StatusPopover';



// import 'react-day-picker/lib/style.css';
import zipcodes from 'zipcodes';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';



const crlistings = client.service('crlistings');
const users = client.service('users');
const transacts = client.service('transacts');
const uploadService = client.service('uploads');
const reader = new FileReader();

class TransactionDetails extends Component {

    constructor(props) {
        super(props);
        console.log("idddd", this.props.match.params.id);
        console.log("props", props);
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 90);

        this.state = {
            id: this.props.match.params.id,
            // id: 49,  //CHANGE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            transactDetails: {},
            items: { lendprice: 0, reqdep: '', listerusername: '', listeruserid: '' },
            initialnotes: '',
            totalPrice: '1',
            borrowerId: '',
            borrowerEmail: '',
            priceVisible: false,
            startDate: new Date(),
            endDate: new Date(),
            onSuccessfulTransaction: false,
            datesTaken: [],
            twoWeeksFromNow: twoWeeksFromNow,
            maxDate: twoWeeksFromNow,
            showSwitch: true,
            listerOrBorrower: this.props.listerOrBorrower
        };
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.getCityState = this.getCityState.bind(this);
        this.handleSubmitRent = this.handleSubmitRent.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.figureOutPrice = this.figureOutPrice.bind(this);
        this.handlePhoto = this.handlePhoto.bind(this);
        this.toTitleCase = this.toTitleCase.bind(this);
        this.isStartNotBooked = this.isStartNotBooked.bind(this);
        this.getEndDates = this.getEndDates.bind(this);
        this.getItemDetails = this.getItemDetails.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        // this.renderSwitch = this.renderSwitch.bind(this);
        // this.finishCallback = this.finishCallback.bind(this);
        this.resetStatus = this.resetStatus.bind(this);
        this.setStatusTo = this.setStatusTo.bind(this);

        





    }
    handleRequest() {
        console.log("handling reuqwest");
    }

    resetStatus() {

        let tmpDeets = {  status: 1 };

        transacts.patch(this.state.id, tmpDeets).then(() => {
            console.log("hi done reset status");
           

        });
    }
    setStatusTo() {

        let tmpDeets = {  status: 6 };

        transacts.patch(this.state.id, tmpDeets).then(() => {
            console.log("hi done reset status to 6");
           

        });
    }

    handleChangeStartDate(date) {
        // const date = new Date(date);
        // console.log("dataa",Date.parse(date));
        // let dMilli = Date.parse(date);
        // console.log("datxxx",new Date(dMilli));


        let mom = moment(date);
        let endX = mom.add(1, 'days');
        console.log("endx", endX);




        this.setState({
            startDate: date,
            endDate: endX.toDate()
        }, () => {
            this.figureOutPrice();
        });
        this.getEndDates(date);

    }
    handleChangeEndDate(date) {
        // let dMilli = Date.parse(date);
        this.setState({
            endDate: date
        }, () => {
            this.figureOutPrice();
        });

    }
    figureOutPrice() {
        // this.setSat
        var diff = Math.ceil((Date.parse(this.state.endDate) - Date.parse(this.state.startDate)) / 86400000);
        console.log("diff:", diff);
        console.log("price", this.state.items.lendprice);
        if (this.state.items.lendprice) {
            let total = diff * this.state.items.lendprice;
            console.log("total price:", total);
            if (total > 0) {
                this.setState({
                    priceVisible: true,
                    totalPrice: total
                });
            } else {
                this.setState({
                    priceVisible: false,
                    totalPrice: "-"
                });

            }
            return total;
        }
        return "-"


    }

    handleSubmitRent(e) {
        e.preventDefault();

        console.log("submmited");


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
    async handlePhoto(item) {
        var image = '';

        return new Promise(async function (resolve, reject) {
            if (item.image) {
                await uploadService.get(item.image)      //"ad418194dae7586f3c33abaeadb9a5076253fdc8bcc279a0aa78590edef342dd.jpeg"
                    .then((res) => {
                        console.log("aaa from upload service");
                        console.log("aaa", res);
                        // console.log("immmg", res.uri);
                        image = res.uri;
                        resolve(image);

                    }).catch(err => {
                        console.log("errererere getting image probly too long wrong uri");
                        var image = '';
                        resolve(image);
                    });
            }
            resolve("");
            console.log("hi handle photo");
        });

    }
    async componentDidMount() {
        transacts.on('patched', res => {
            console.log("removeeeeed YYYsdsdY", res);

            //this should be more modular
            transacts.get(this.state.id)
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
                    await this.getItemDetails(res);
                })
                .catch(err => {
                    console.log("eror in checking transacs", err)
                })
        });
        var that = this;


        //getting existing transactions for item
        console.log("getting dates taken");
        await transacts.get(this.state.id)
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
                await this.getItemDetails(res);
            })
            .catch(err => {
                console.log("eror in checking transacs", err)
            })





    }

    async getItemDetails(item) {
        let that = this;
        return new Promise(async function (resolve, reject) {
            await crlistings.get(item.itemidinrentlib)
                .then(async (cont) => {
                    console.log("aaa");
                    console.log('from await crlistings:', cont);


                    console.log("iamge: ", cont.image);
                    let cityTemp = that.getCityState(cont.location);

                    let tmp3 = { lendobject: that.toTitleCase(cont.lendobject), location: cityTemp, lenddesc: cont.lenddesc, lendprice: cont.lendprice, id: cont.id, reqdep: cont.reqdep, listerusername: cont.username, listeruserid: cont.idfromuser };

                    console.log("object", tmp3);
                    that.setState({
                        items: tmp3
                    });
                })
                .catch(err => {
                    console.log("er3333rere", err)
                })
        });
    }
    toTitleCase(str) {
        console.log(str);
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    isStartNotBooked(date) {


        var passed = this.state.datesTaken.every((item, index, arr) => {
            // moment(item.checkoutdate, "x").format("DD MMM YYYY") //parse string

            console.log("index: ", index);

            if (moment(date, "DD-MM-YYYY").isBetween(item.checkoutdate, item.checkindate)) {
                console.log("fffffas");
                return false;
            } else {
                console.log("truuuuu");
                return true;
            }



        });
        return passed;

        // const day = date.getDay();
        // return day !== 0 && day !== 6;
    }

    getEndDates(date) {
        let mom = moment(date);
        var endX = mom.add(292, 'days'); // kind of a hack start really far away in time

        let earliestCheckout = endX;
        console.log("earliest chekcou", earliestCheckout);
        this.state.datesTaken.forEach((item, index, arr) => {
            console.log("index: ", index);

            // console.log("millis as mom: ",new Date(parseInt(item.checkindate,10)));
            // console.log("date we're checking from calenar: ",moment(date,"DD-MM-YYYY"));
            // console.log("date of checkin ",moment(new Date(parseInt(item.checkindate,10)),"DD-MM-YYYY"));
            // console.log("date of checkout ",moment(new Date(parseInt(item.checkoutdate,10)),"DD-MM-YYYY"));
            // console.log("aadatea", moment(date, "DD-MM-YYYY").isSame(moment(new Date(parseInt(item.checkindate, 10)), "DD-MM-YYYY"), 'day'));
            console.log("dddd", moment(date));
            console.log("check out datae ind", index, item.checkoutdate);
            if (moment(date, "DD-MM-YYYY").isBefore(item.checkoutdate, 'day')) {
                console.log("hiii if");
                if (item.checkoutdate.isBefore(earliestCheckout)) {
                    earliestCheckout = item.checkoutdate;
                    console.log("afger true", earliestCheckout);
                }
            } else {
                console.log("elsese in end date");
                // return true;
            }
        });


        // let mom = moment(date);
        // var endX = mom.add(2, 'days'); //.endOf('day');
        console.log("endx", earliestCheckout);

        this.setState({
            maxDate: ''
        });
        this.setState({
            // maxDate: endX.toDate()
            maxDate: earliestCheckout.toDate()
        });
    }

    getCityState(location) {

        console.log("lcoation", location);
        var cityState = { city: 'city', state: 'state' }; //placeholder text for missing entries
        try {
            if (location) {
                if (location.length === 5 && location.match(/^[0-9]+$/) != null) {
                    let goo = zipcodes.lookup(location);
                    if (goo) {
                        console.log("goooo", goo.city);
                        cityState.city = goo.city;
                        cityState.state = goo.state;
                    }
                }
            }
        } catch (error) {
            console.log("erro in zip", error);
            cityState = { city: 'bad', state: 'bad' };
        }
        console.log("heres zip", cityState);
        let cityStateString = cityState.city + ", " + cityState.state;
        return cityStateString;
    }

    //      (Key: 1. Initiated, awaiting owner's response  2. Pending, awaiting borrower's final signature  3. Handshake, awaiting contract in blockchain  4. Official on Blockchain, ready for handoff of item  5. Rental Active, rental item has been picked up  6. Rental Completed, rental has been returned )

    // renderSwitch() {
    //     let tempVal = 'nothing';
    //     return (
    //         <React.Fragment>
    //             {this.state.showSwitch
    //                 ? <StageOneLister id={this.state.id} finishCallback={this.finishCallback} />
    //                 : null
    //             }
    //         </React.Fragment>
    //     )
    // }
    // finishCallback() {
    //     console.log("ahahahah");
    //     this.setState({ showSwitch: false });
    // }
    

    render() {
        // let goo = this.props;
        // console.log("succesful?", this.state.onSuccessfulTransaction);
        // console.log("endate", this.state.maxDate);
        const ref = React.createRef();
        return (
            <Container className="maincont">
                {this.state.onSuccessfulTransaction
                    ? <DetailModal props={this.props} />
                    : null

                }
                <Row><span>&nbsp;&nbsp;</span></Row>
                <Row >
                    <Col>
                        <h1 className="text-center">Details for {this.state.items.lendobject} Rental</h1>

                        <h5 className="text-center">You are the {this.state.listerOrBorrower}</h5>
                    </Col>
                </Row>
                <Row className=" justify-content-md-center" id="detailRow">
                    <Col className="lg={2}">
                        {/*                     
                        <Row>
                            <span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span>
                        </Row> */}
                        <Row className=" justify-content-md-center ">




                            <ListGroup variant="flush" >
                                {/* <ListGroup.Item><h1 className="text-center">{this.state.items.lendobject}</h1></ListGroup.Item> */}

                                <ListGroup.Item className="text-center"><strong>Transaction Status</strong>:<br /> {this.state.transactDetails.status}/7
                                <StatusPopover />
                               
                                </ListGroup.Item>

                                <ListGroup.Item className="text-center"><strong>Deposit for Rental</strong>:  <br />${this.state.transactDetails.deposit}</ListGroup.Item>

                                <ListGroup.Item className="text-center"><strong>Total Price for Rental</strong>: <br /> ${this.state.transactDetails.totalprice}</ListGroup.Item>

                                <ListGroup.Item className="text-center"><strong>Notes from Borrower</strong>:  <br />{this.state.transactDetails.initialnotes}</ListGroup.Item>

                                <ListGroup.Item className="text-center"><strong>Response from Owner</strong>: <br /> {this.state.transactDetails.finalnotes}</ListGroup.Item>
                                <ListGroup.Item className="text-center"><strong>Rental Start Date</strong>: <br /> {this.state.transactDetails.checkoutdate}</ListGroup.Item>
                                <ListGroup.Item className="text-center"><strong>Rental End Date</strong>: <br /> {this.state.transactDetails.checkindate}</ListGroup.Item>
                                <ListGroup.Item className="text-center"><strong>Link to Contract on Blockchain</strong>:  <br />(link)</ListGroup.Item>
                                <ListGroup.Item className="text-center"><strong>Transaction Initiated at</strong>: <br /> {this.state.transactDetails.createdat}</ListGroup.Item>





                            </ListGroup>

                        </Row>
                        <Row>
                            <span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span>
                        </Row>
                        <Row className=" justify-content-md-center ">
                            <Col >

                                <ListGroup variant="flush" >
                                <ListGroup.Item className=" goo"><strong>ITEM DETAILS</strong></ListGroup.Item>

                                    <ListGroup.Item className=" goo"><strong>Item Name:</strong> {this.state.items.lendobject}</ListGroup.Item>
                                    <ListGroup.Item className=" goo"><strong>Item Description</strong>: {this.state.items.lenddesc}</ListGroup.Item>

                                    <ListGroup.Item className=" goo"><strong>Price per day</strong>: ${this.state.items.lendprice}</ListGroup.Item>
                                    <ListGroup.Item className=" goo"><strong>Required Deposit</strong>: ${this.state.items.reqdep}</ListGroup.Item>
                                    <ListGroup.Item className=" goo"> <strong>Lister Username:</strong> {this.state.items.listerusername}</ListGroup.Item>

                                    <ListGroup.Item className=" goo"><strong>Lister's Location</strong>: {this.state.items.location}</ListGroup.Item>


                                </ListGroup>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                    {this.props.rightPanel}
                    </Col>
                    {/* here we check if its owner and what stage */}
                    {/* {this.renderSwitch()} */}


                </Row>
                <Button onClick={this.resetStatus}>temp--RESEt to STATUS 1</Button>
                <Button onClick={this.setStatusTo}>temp--RESEt to STATUS 6</Button>

            </Container>
        );
    }

}


export default TransactionDetails;