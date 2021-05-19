import React, { Component } from 'react';
import client from '../../feathers';
// import Itemlist from './Itemlist';
import { Dropdown, DropdownButton, Button, Row, Col, Form, Container, Image, ListGroup } from 'react-bootstrap';
// import DayPicker from 'react-day-picker';
import DatePicker from 'react-datepicker';
import DetailModal from './modals_etc/DetailModal';


// import 'react-day-picker/lib/style.css';
import zipcodes from 'zipcodes';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';


const crlistings = client.service('crlistings');
const users = client.service('users');
const transacts = client.service('transacts');
const uploadService = client.service('uploads');
const reader = new FileReader();

class ItemDetail extends Component {

    constructor(props) {
        super(props);
        console.log("idddd", this.props.match.params.id);
        console.log("props", this.props);
        console.log("mom", moment.now());
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 90);

        this.state = {
            id: this.props.match.params.id,
            // id: 49,  //CHANGE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
            ifVisitorIsLister: false,
            itemDeleted: false
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
        this.handleEditDeleteClicks = this.handleEditDeleteClicks.bind(this);






    }
    handleEditDeleteClicks(e) {
        e.preventDefault();
        console.log("click", e);
        if (e.target.id == "edit") {
            console.log("its edit");
            this.props.history.push('/itemedit/' + this.state.items.id);

        } else {

            crlistings.remove(this.state.items.id).then((res) => {
                console.log("removed! ", res);
                this.setState({
                    itemDeleted: true
                });

                setTimeout(function () { //Start the timer
                    this.props.history.push('/');
                }.bind(this), 2000)


                // props.hist.push('/item/' + item.id, { detail: item });

                // that.setState({
                //     lendobject: '',
                // });
            });


        }


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

        let prix = this.figureOutPrice();
        console.log("prix", prix);
        console.log("submittte", this.state.endDate);
        let checkoutdate = Date.parse(this.state.startDate);
        let checkindate = Date.parse(this.state.endDate);
        let initialnotes = this.state.initialnotes;
        let finalnotes = '';
        let im = this.state.items;
        let reqdep = im.reqdep;
        let renterusername = im.listerusername;
        let renteruserid = im.listeruserid;
        let itemidinrentlib = im.id;

        // this is temp -- maybe should be a hook that checks in to figure out status
        //OR it just happens/incremented in each step
        let status = 1; //this is the 1/7 levels of status
        console.log("itemidinrentlib", itemidinrentlib);
        console.log("renter ussr id", renteruserid);
        // let borrowerId = im.borrowerId;
        // let borrowerEmail = im.borrowerEmail;
        let totalprice = prix;
        console.log("totla price", totalprice);

        //send notes and start and end dates
        let that = this;
        if (true) {
            transacts.create({
                checkoutdate, checkindate, totalprice, initialnotes, finalnotes, reqdep, renterusername, renteruserid, itemidinrentlib, status
                // lendobject, lenddesc, lendprice, location, reqdep, image
            }).then((res1) => {
                console.log("what is res", res1.id);
                console.log("hi done -- submitted transaction");
                that.setState({
                    initialnotes: '',
                    priceVisible: false,
                    onSuccessfulTransaction: true
                });

                // e.target.value= '';
            })
                .catch(err => {
                    console.log("error in submit", err.message);
                    alert(err.message);
                    that.setState({
                        initialnotes: '',
                        priceVisible: false,
                        onSuccessfulTransaction: false
                    });
                });
        }
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
        var that = this;
        let templisteruserid = '';
        await crlistings.get(this.state.id)
            .then(async (cont) => {
                console.log("aaa");
                console.log('from await crlistings:', cont);

                let tmpImage = await this.handlePhoto(cont);

                console.log("iamge: ", cont.image);
                let cityTemp = this.getCityState(cont.location);
                templisteruserid = cont.idfromuser;
                let tmp3 = { lendobject: this.toTitleCase(cont.lendobject), lenddesc: cont.lenddesc, lendprice: cont.lendprice, id: cont.id, image: tmpImage, reqdep: cont.reqdep, location: cityTemp, listerusername: cont.username, listeruserid: cont.idfromuser };

                console.log("object", tmp3);
                that.setState({
                    items: tmp3
                });
            })
            .catch(err => {
                console.log("er3333rere", err)
            })

        //getting existing transactions for item
        console.log("getting dates taken");
        await transacts.find({
            query: {
                $limit: 200,
                itemidinrentlib: [this.state.id]
                // renteruserid: [client.get('user')._id]
                // $sort: {
                //     lendobject: 1
                // }
            }
        })
            .then(async (res) => {
                console.log("dates taken", res);
                // console.log("idddddd2",this.state.lendprice);
                let newArr = res.data.map(async (item) => {
                    console.log("inloop", item.checkoutdate);

                    // let checkoutdate = item.checkoutdate;
                    // let checkindate = item.checkindate;

                    let checkoutdate = moment(new Date(parseInt(item.checkoutdate, 10)), "DD-MM-YYYY");
                    let checkindate = moment(new Date(parseInt(item.checkindate, 10)), "DD-MM-YYYY");


                    // let checkoutdate = moment(item.checkoutdate, "x").format("DD MMM YYYY") //parse string
                    // let checkindate = moment(item.checkindate, "x").format("DD MMM YYYY") //parse string
                    // // console.log(checkindate.isSame(checkoutdate, 'date')); // true
                    console.log("mome tru? ", moment('2010-10-20').isSame('2010-10-20'));
                    // console.log("check out",tmp);

                    // let checkindate = item.checkindate;
                    return { checkoutdate, checkindate };

                });
                Promise.all(newArr).then((completed) => {
                    console.log("complllllll", completed);
                    // resolve(completed);
                    console.log("done with loop:", completed);
                    that.setState({
                        datesTaken: completed
                    });

                });


                // if (itemsAsRenter) {
                // that.setState({
                //     itemsAsRenter
                // });
                // }

            })
            .catch(err => {
                console.log("er3333rere", err)
            })


        //get the borrower -- current user's credentials - NOT NEEDED
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
                console.log('Userzzz', client.get('user'));
                console.log('id', client.get('user')._id);
                console.log('listeruserid', templisteruserid);

                if (client.get('user')._id === templisteruserid) {
                    that.setState({
                        ifVisitorIsLister: true
                        // borrowerId: client.get('user')._id,
                        // borrowerEmail: client.get('user').email
                    });
                }
            })
            .catch(function (error) {
                console.error('Error authenticating!', error);
            });

    }
    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    isStartNotBooked(date) {
        // var dateStr = "Mon Jul 14 00:00:00 EDT 2014";
        // var momentDateFormatted = moment(date).format("DD-MM-YYYY");
        // console.log("date: ", moment(date).format("DD-MM-YYYY"));
        // let day = date.getDay();
        // var d = new Date(milliseconds);

        //worked!!
        // console.log("aadatea", moment(date,"DD-MM-YYYY").isSame(moment("28-09-2019","DD-MM-YYYY")));

        // return true;

        var passed = this.state.datesTaken.every((item, index, arr) => {
            // moment(item.checkoutdate, "x").format("DD MMM YYYY") //parse string

            console.log("index: ", index);
            // console.log("miliz alon", item.checkoutdate);
            // console.log("millis as mom: ",new Date(parseInt(item.checkindate,10)));

            // console.log("date we're checking from calenar: ",moment(date,"DD-MM-YYYY"));
            // console.log("date of checkin ",moment(new Date(parseInt(item.checkindate,10)),"DD-MM-YYYY"));
            // console.log("date of checkout ",moment(new Date(parseInt(item.checkoutdate,10)),"DD-MM-YYYY"));


            // console.log("aadatea", moment(date, "DD-MM-YYYY").isSame(moment(new Date(parseInt(item.checkindate, 10)), "DD-MM-YYYY"), 'day'));

            //good but only check the dates no in betweens
            // if (moment(date, "DD-MM-YYYY").isSame(moment(new Date(parseInt(item.checkindate, 10)), "DD-MM-YYYY"), 'day') || moment(date, "DD-MM-YYYY").isSame(moment(new Date(parseInt(item.checkoutdate, 10)), "DD-MM-YYYY"), 'day')) {
            //     return false;
            // } else{
            //     return true;
            // }
            // console.log("dates:",moment(new Date(parseInt(item.checkindate, 10)), "DD-MM-YYYY"), moment(new Date(parseInt(item.checkoutdate, 10)), "DD-MM-YYYY"));
            // console.log("between? ",moment(date, "DD-MM-YYYY").isBetween(moment(new Date(parseInt(item.checkoutdate, 10)), "DD-MM-YYYY"), moment(new Date(parseInt(item.checkindate, 10)), "DD-MM-YYYY")));

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
    render() {
        // let goo = this.props;
        // console.log("succesful?", this.state.onSuccessfulTransaction);
        console.log("endate", this.state.maxDate);
        return (
            <Container className="maincont">
                {this.state.itemDeleted
                    ? <h4 className="text-center linkText">Item Deleted!</h4>
                    : null

                }
                {this.state.onSuccessfulTransaction
                    ? <DetailModal props={this.props} />
                    : null

                }
                <Row><span>&nbsp;&nbsp;</span></Row>
                <Row >
                    <Col>
                        <h1 className="text-center">{this.state.items.lendobject}</h1>
                    </Col>
                </Row>
                {/* <Row className=" justify-content-md-center">
                        <Col className="block-example border border-dark text-center" sm={4}>
                            This is your item: <span id="edit" onClick={this.handleEditDeleteClicks}>Edit</span> / <span id="delete" onClick={this.handleEditDeleteClicks}>Delete</span>


                        </Col>
                    </Row> */}
                {this.state.ifVisitorIsLister
                    ? <Row className=" justify-content-md-center">
                        <Col className="block-example border border-dark text-center" sm={6}>
                            This is your item: <a href="true" id="edit" onClick={this.handleEditDeleteClicks}>Edit</a> / <a href="true" id="delete" onClick={this.handleEditDeleteClicks}>Delete</a>


                            {/* <span ></span> */}

                        </Col>
                    </Row>
                    : null

                }


                <Row className=" justify-content-md-center" id="detailRow">
                    <Col className="lg={2}">
                        <Row className="justify-content-md-center ">
                            {/* <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/John_Deere_lawn_mower.JPG/800px-John_Deere_lawn_mower.JPG" fluid /> */}
                            <Image src={this.state.items.image} fluid />

                        </Row>
                        <Row>
                            <span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span>
                        </Row>
                        <Row className=" justify-content-md-center ">




                            <ListGroup variant="flush" >
                                {/* <ListGroup.Item><h1 className="text-center">{this.state.items.lendobject}</h1></ListGroup.Item> */}

                                <ListGroup.Item><strong>Price per day</strong>: ${this.state.items.lendprice}</ListGroup.Item>
                                <ListGroup.Item><strong>Required Deposit</strong>: ${this.state.items.reqdep}</ListGroup.Item>

                                <ListGroup.Item><strong>Location</strong>: {this.state.items.location}</ListGroup.Item>

                                <ListGroup.Item><strong>Description</strong>: {this.state.items.lenddesc}</ListGroup.Item>
                            </ListGroup>

                        </Row>
                        <Row>
                            <span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span>
                        </Row>
                        <Row className=" justify-content-md-center ">
                            <Col >

                                <ListGroup variant="flush" >

                                    <ListGroup.Item className=" goo"> <strong>Lister Username:</strong> {this.state.items.listerusername}</ListGroup.Item>

                                    {/* <ListGroup.Item className=" goo"><strong>Username</strong>: {this.state.items.username}</ListGroup.Item> */}
                                    <ListGroup.Item className=" goo"><strong>Located</strong>: {this.state.items.location}</ListGroup.Item>
                                    <ListGroup.Item className=" goo"><strong>Reputation</strong>: temp rep</ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </Col>
                    {!this.state.ifVisitorIsLister
                        ? <Col className=" lg={2}">
                            <Row><span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span></Row>
                            <Row className="justify-content-md-center "><h2 >Request It</h2></Row>
                            <Row></Row>

                            <Row className="justify-content-md-center ">
                                <Form>
                                    {/* <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="name@example.com" />
                                </Form.Group> */}
                                    {/* <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Example select</Form.Label>
                            <Form.Control as="select">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Form.Control>
                        </Form.Group> */}

                                    <Form.Group onSubmit={this.handleSubmitRent}>
                                        <Form.Label>Proposed Meeting Time and Location:</Form.Label>
                                        <Form.Control as="textarea" id="initialnotes" rows="3" onChange={this.handleChangeText} value={this.state.initialnotes} />
                                    </Form.Group>
                                </Form>
                            </Row>

                            <Row className=" justify-content-md-center">

                                <div className="prev-wrap">
                                    <Form inline className="dateForms">
                                        <Form.Label className="datez">Rental Starts </Form.Label>

                                        <DatePicker
                                            selected={this.state.startDate}
                                            onChange={date => this.handleChangeStartDate(date)}
                                            selectsStart
                                            // excludeDates={[new Date(), subDays(new Date(), 1)]}
                                            // filterDate={(date) => {
                                            //     return moment() > date;
                                            // }}
                                            filterDate={this.isStartNotBooked}
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            // maxDate={addDays(new Date(), 185)}
                                            maxDate={this.state.twoWeeksFromNow}

                                            showTimeSelect
                                            dateFormat="MMMM d, yyyy h:mmaa"
                                        />
                                    </Form>
                                </div>

                                {/* <span>&nbsp;&nbsp;</span> */}

                                <div className="prev-wrap">
                                    <Form inline>
                                        <Form.Label className="datez">Rental Ends </Form.Label>

                                        <DatePicker
                                            selected={this.state.endDate}
                                            onChange={date => this.handleChangeEndDate(date)}
                                            selectsEnd
                                            endDate={this.state.endDate}
                                            minDate={this.state.startDate}
                                            // maxDate={this.state.maxDate}
                                            maxDate={this.state.maxDate}

                                            showTimeSelect
                                            dateFormat="MMMM d, yyyy h:mmaa"
                                        />
                                    </Form>
                                </div>

                            </Row>
                            {this.state.priceVisible
                                ? <div className=" justify-content-md-center">
                                    <Row><span>&nbsp;&nbsp;</span></Row>

                                    <Form inline className=" justify-content-md-center">
                                        <Form.Label className="datez"><strong>Estimated Price:</strong> ${this.state.totalPrice}</Form.Label>
                                    </Form>
                                </div>
                                : null
                            }

                            <Row><span>&nbsp;&nbsp;</span></Row>

                            <Row className=" justify-content-md-center">
                                <Button variant="primary" onClick={this.handleSubmitRent} >Request Item</Button>

                            </Row>
                        </Col>
                        : null
                    }
                </Row>
            </Container>
        );
    }

}

export default ItemDetail;