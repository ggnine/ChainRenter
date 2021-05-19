import React, { Component, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import client from '../../feathers';

import ImageUpload from './utilities/ImageUpload';


import 'react-materialize';
import { Dropdown, DropdownButton, Row, Col, Toast, Button, Modal, Form } from 'react-bootstrap';

const crlistings = client.service('crlistings');
const users = client.service('users');
const uploadService = client.service('uploads');

class ItemEdit extends Component {
    constructor(props) {
        console.log("Asdf");

        super(props);

        console.log("idddd", this.props.match.params.id);
        this.state = {
            idOfItemToEdit: this.props.match.params.id,
            lendobject: '',
            lenddesc: '',
            lendprice: '',
            location: '',
            reqdep: '',
            sho: false,
            image: '',
            showImage: true,
            readerRes: ''
        };
        this.handleChangew = this.handleChangew.bind(this);
        this.handleSubmitw = this.handleSubmitw.bind(this);
        // this.toggleShowA = this.toggleShowA.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.uploadIt = this.uploadIt.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.handlePhoto = this.handlePhoto.bind(this);


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

        console.log(" handleclose: ", e.target.id);
        this.setState({ sho: false });//!this.state.showA
        if (e.target.id === "back") {
            this.props.history.push('/mypage');

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
        console.log("lend obejct forom ItemEdit: ", this.state.lendobject);
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
                        console.log("ididid of thing to edit:",that.state.idOfItemToEdit);
                        let tmp3 = {lendobject, lenddesc, lendprice, location, reqdep, image};
                        crlistings.patch(that.state.idOfItemToEdit,tmp3 ).then(() => {
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
        const crlistings = client.service('crlistings');
        const users = client.service('users');
        console.log("item id in mount:", this.state.idOfItemToEdit);
        var that = this;
        if (this.state.idOfItemToEdit) {
            await crlistings.get(this.state.idOfItemToEdit)
                .then(async (cont) => {
                    console.log("aaa");
                    console.log('from await crlistings:', cont);

                    let tmpImage = await this.handlePhoto(cont);
                    console.log("temp image mm",tmpImage);
                    console.log("iamge: ", cont.image);
                    // let cityTemp = this.getCityState(cont.location);



                    that.setState({
                        lendobject: cont.lendobject,
                        lenddesc: cont.lenddesc,
                        lendprice: cont.lendprice,
                        reqdep: cont.reqdep,
                        location: cont.location,
                        showImage: true,
                        readerRes: tmpImage
                    });


                    // let tmp3 = {
                    // lendobject: cont.lendobject,
                    // lenddesc: cont.lenddesc,
                    // lendprice: cont.lendprice,
                    //     // id: cont.id, 
                    //     readerRes: tmpImage,
                    // reqdep: cont.reqdep,
                    // location: cont.location,
                    //     showImage: true
                    // };

                    // console.log("object", tmp3);
                    // that.setState({
                    //     items: tmp3
                    // });
                })
                .catch(err => {
                    console.log("er3333rere", err)
                })

        }
    }

    // toggleShowA(){ 
    //     setShowA(!showA)
    // };

    render() {
        // console.log("111111", this.state.readerRes);

        // console.log("As2111df", this.state.lendobject);

        return (




            <div className="container center">
                <Row><span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span></Row>

                <Row >
                    <Col style={{ "justify-content": "center" }}>
                        <h2 className="text-center">Edit Your Item</h2>
                    </Col>
                </Row>
                <Row><span>&nbsp;&nbsp;</span></Row>

                <Row className="justify-content-md-center">
                    <Modal show={this.state.sho} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Listing Complete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>You've Edited an Item!</Modal.Body>
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
                            <ImageUpload uploadIt={this.uploadIt} imageAlready={true} existingImage={this.state.readerRes} showImage={this.state.showImage} />
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

export default ItemEdit;


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