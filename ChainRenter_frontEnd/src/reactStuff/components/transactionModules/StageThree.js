
import React, { Component } from 'react';
import client from '../../../feathers';
import STATUS from '../utilities/TransStatus';

import { Dropdown, DropdownButton, Popover, Badge, Button, Row, Col, Form, Container, Image, ListGroup, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';
import timer from '../../../imgs/timer.png';
const transacts = client.service('transacts');


export class StageThree extends Component {

    constructor(props) {
        super(props);
        console.log("props", this.props);
        console.log("iddd", this.props.id);
        this.state = {

        };

    }



    async componentDidMount() {
        //TODO we need to send out to blockhain -- IS that here or in bafckend hook?
        //TODO we need to get a callback from blockchain here when live
        //TODO update the blockchain contract id in transacts

        // transacts.on('patched', res => {
        //         console.log("removeeeeed YYYY", res);
        //     });

        // await transacts.get(this.props.id)
        //     .then(async (res) => {
        //         console.log("item from tranacts found:", res);
        //         var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        //         let deets = {
        //             createdat: new Date(res.createdAt).toLocaleDateString("en-US", options),
        //             checkoutdate: moment(res.checkoutdate, "x").format('LLLL'),
        //             checkindate: moment(res.checkindate, "x").format('LLLL'),
        //             contractid: res.contractid,
        //             deposit: res.deposit,
        //             finalnotes: res.finalnotes,
        //             initialnotes: res.initialnotes,
        //             totalprice: res.totalprice,
        //             status: res.status
        //         };
        //         this.setState({
        //             transactDetails: deets
        //         });
        //         // await this.getItemDetails(res);
        //     })
        //     .catch(err => {
        //         console.log("eror in checking transacs", err)
        //     })

    }

    render() {
        return (
            <div className="justify-content-md-center timerr">
                <Image src={timer} />
                <h5 className="text-center">Waiting for tentative agreement to go live on blockchain.</h5>
            </div>
        )
    };
}





