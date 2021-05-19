import React, { Component, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import client from '../../feathers';

import ImageUpload from './utilities/ImageUpload';


import 'react-materialize';
import { Dropdown, DropdownButton, Row, Col, Toast, Button, Modal, Form } from 'react-bootstrap';

const crlistings = client.service('crlistings');
const users = client.service('users');
const uploadService = client.service('uploads');

class Listsomething extends Component {
    constructor(props) {
        console.log("Asdf");

        super(props);

        this.state = { lendobject: '', lenddesc: '', lendprice: '', location: '', reqdep: '', sho: false, image: '', showImage: true, readerRes: '' };
        this.handleChangew = this.handleChangew.bind(this);
        this.handleSubmitw = this.handleSubmitw.bind(this);
        // this.toggleShowA = this.toggleShowA.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.uploadIt = this.uploadIt.bind(this);
        this.getBase64 = this.getBase64.bind(this);

        console.log("Assdfdf");

    }

    async uploadIt(file, readerRes) {
        console.log("obj upppp");
        console.log("uplooad", file);

        console.log("readerres11", readerRes);
        let that = this;
        //this is sending unchecnged file to server for size fixing and base 64 in hook
        that.setState({
            image: file,
            showImage: true,
            readerRes: readerRes
        });



        //this converts to base 64
        // this.getBase64(file, function (base64Data) {
        //     console.log("aaaaaa callalal");

        //     console.log("base 64 of file is", base64Data);//here you can have your code which uses base64 for its operation,//file to base64 by oneshubh
        //     that.setState({
        //         image: base64Data,
        //         showImage: true
        //     });
        // });


        return "good";
    }
    getBase64(file, callback) {

        const reader = new FileReader();

        reader.addEventListener('load', () => callback(reader.result));

        reader.readAsDataURL(file);
    }

    handleShow(e) {
        console.log(" handleshow");
        this.setState({ sho: true });//!this.state.showA
    }
    handleClose(e) {
        console.log(" hand clo: ");
        try {
            console.log(" handleclose: ", e.target.id);
            this.setState({ sho: false });//!this.state.showA
            if (e.target.id === "back") {
                this.props.history.push('/mypage');

            }
        }catch(err){
            console.log("err");
        }
    }

    handleChangew(e) {
        console.log("Asdf333355");

        // console.log("111",this.props);
        console.log("111 id: ", e.target.id)

        console.log("111 val: ", e.target.value)
        this.setState({
            [e.target.id]: e.target.value
        });
        // if (e.target.value === '') {
        //     console.log("trying", e.target.value);
        //     this.handleEmptySubmit();
        // }
    }
    handleSubmitw(e) {
        console.log("lend obejct forom listSomething: ", this.state.lendobject);
        //  console.log("22a",isEmpty);

        e.preventDefault();




        const lendobject = this.state.lendobject.trim();
        const lenddesc = this.state.lenddesc.trim();
        const lendprice = this.state.lendprice.trim();
        const location = this.state.location.trim();
        const reqdep = this.state.reqdep.trim();
        // const image = this.state.image;
        // const image = 'temp';

        // console.log('aa', lendobject);
        // console.log('image from handsum', image);
        let that = this;
        console.log("readerres22", this.state.readerRes);

        //do a acheck on state.readerResult
        if (this.state.readerRes) {
            var upload = uploadService
                .create({ uri: this.state.readerRes })
                .then(function (response) {
                    // success
                    // alert('UPLOADED!! ');
                    console.log('Server responded with: ', response);

                    const image = response.id;
                    //TODO get response from abvoe and grab the link
                    if (lendobject && image) {
                        crlistings.create({
                            lendobject, lenddesc, lendprice, location, reqdep, image
                        }).then(() => {
                            console.log("hi done");
                            that.setState({
                                lendobject: '',
                                lenddesc: '',
                                lendprice: '',
                                location: '',
                                reqdep: '',
                                image: '',
                                showImage: false,
                                sho: true
                            });


                            // e.target.value= '';
                        });
                    } else {
                        alert('Error creating your listing! ');

                    }
                });
        }

    }


    componentDidMount() {
        const crlistings = client.service('crlistings');
        const users = client.service('users');


    }

    // toggleShowA(){ 
    //     setShowA(!showA)
    // };

    render() {
        console.log("111111", this.state.lenddesc);

        console.log("As2111df", this.state.lendobject);

        return (




            <div className="container center">
                <Row><span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span></Row>

                <Row >
                    <Col className="text-center">
                        <h2 className="text-center">List an Item for Rent</h2>
                    </Col>
                </Row>
                <Row><span>&nbsp;&nbsp;</span></Row>

                <Row className="justify-content-md-center">
                    <Modal show={this.state.sho} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Listing Complete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>You've Listed an Item!</Modal.Body>
                        <Modal.Footer>
                            <Button className="left" variant="secondary" id="back" onClick={this.handleClose}>
                                Back To My Listings
                    </Button>
                            <Button className="right" variant="primary" id="another" onClick={this.handleClose}>
                                List Another Item
                    </Button>
                        </Modal.Footer>
                    </Modal>
                </Row>
                <Row className="justify-content-md-center">
                    <Col sm={7}>


                        <Form>
                            <Form.Group controlId="lendobject" >
                                <Form.Label>Listing Title for Item:</Form.Label>
                                <Form.Control size="sm" type="textzz" placeholder="Enter Title" onChange={this.handleChangew} value={this.state.lendobject} />
                                <Form.Text className="text-muted">
                                    Choose a title that is short but descriptive (ie. Hardtail Trek Mountain Bike).
                             </Form.Text>
                            </Form.Group>


                            <Form.Group controlId="lendprice"  >
                                <Form.Label>Price to Rent per Day:</Form.Label>
                                <Form.Control size="sm" type="textc" placeholder="Enter Price" onChange={this.handleChangew} value={this.state.lendprice} />
                                {/* <Form.Text className="text-muted">
                                This is how much .
                             </Form.Text> */}
                            </Form.Group>
                            <Form.Group controlId="reqdep" >
                                <Form.Label>Amount of Deposit Desired:</Form.Label>
                                <Form.Control size="sm" type="textz" placeholder="Desired Deposit from Renter" onChange={this.handleChangew} value={this.state.reqdep} />

                            </Form.Group>

                            <Form.Group controlId="location">
                                <Form.Label>Enter Your Zip Code:</Form.Label>
                                <Form.Control type="texta" placeholder="Enter Zip Code" onChange={this.handleChangew} value={this.state.location} />

                            </Form.Group>

                            <Form.Group controlId="lenddesc"  >
                                <Form.Label>Item Description </Form.Label>
                                <Form.Control as="textarea" rows="3" onChange={this.handleChangew} value={this.state.lenddesc} />
                            </Form.Group>
                            {/* <Form.Group controlId="formBasicChecbox">
                            <Form.Check type="checkbox" label="Agree to Terms" />
                        </Form.Group> */}
                            <ImageUpload uploadIt={this.uploadIt} showImage={this.state.showImage} />
                            <Button variant="primary" type="submit" onClick={this.handleSubmitw}>
                                Submit
                        </Button>
                        </Form>
                    </Col>
                </Row>

                {/* <Row className="justify-content-md-center">
                   
                    </Row> */}

            </div>

        )
    }

}

export default Listsomething;


//backup from materialize

{/* <form className="col s12 centered" onSubmit={this.handleSubmitw}>
                        <div className="row centered">
                            <div className="input-field col s6">
                                <input id="lendobject" type="text" className="" onChange={this.handleChangew} value={this.state.lendobject} ></input>
                                <label htmlFor="lendobject">Title of Item Listing: </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s4">
                                <input id="lendprice" type="text" className="" onChange={this.handleChangew} value={this.state.lendprice} ></input>
                                <label htmlFor="lendprice">Price per day: </label>
                            </div>

                        </div>
                        <div className="row ">
                            <div className="input-field col s6">
                                <input id="location" type="text" className=" " onChange={this.handleChangew} value={this.state.location} ></input>
                                <label htmlFor="location">Location of Item: </label>
                            </div>

                        </div>
                        <div className="row">
                            <div className="input-field col s10">
                                <input id="lenddesc" type="text" className=" materialize-textarea" onChange={this.handleChangew} value={this.state.lenddesc} ></input>
                                <label htmlFor="lenddesc">Description of Item: </label>
                            </div>

                        </div>

                        <div className="row">
                            <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.handleShow}>Submit
                            <i className="material-icons right">cloud</i>
                            </button>
                        </div>
                    </form> */}