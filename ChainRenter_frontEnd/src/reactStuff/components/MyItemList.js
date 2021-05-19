
import React, { Component, useState } from 'react';
// import { Table } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { Dropdown, DropdownButton, Row, Col, Button } from 'react-bootstrap';

import client from '../../feathers';

const crlistings = client.service('crlistings');
const users = client.service('users');

class MyItemList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            id: ''
        }
        console.log("inside props.items list", this.props.items);
        console.log("props? ", this.props);
        this.handleClick = this.handleClick.bind(this);
        this.handleButtonDelete = this.handleButtonDelete.bind(this);
        this.handleButtonEdit = this.handleButtonEdit.bind(this);

        this.newTab = this.newTab.bind(this);


    }

    handleClick(item) {
        console.log("clicked", item.id);
        this.props.hist.push('/item/' + item.id, { detail: item });
        // e.preventDefault();

    };
    handleButtonEdit(e, item) {
        console.log("clicked edittt", e);
        console.log("clicked_items id: ", item.id);
        e.stopPropagation();
        e.preventDefault();
        this.props.hist.push('/itemedit/' + item.id, { detail: item });

        // if (item.id) {
        //     crlistings.remove(item.id).then((res) => {
        //         console.log("removed! ", res);
        //         // props.hist.push('/item/' + item.id, { detail: item });

        //         // that.setState({
        //         //     lendobject: '',
        //         // });
        //     });
        // }
    };

    handleButtonDelete(e, item) {
        console.log("clicked delete", e);
        console.log("clicked_items id: ", item.id);
        e.stopPropagation();
        e.preventDefault();

        if (item.id) {
            crlistings.remove(item.id).then((res) => {
                console.log("removed! ", res);
                // props.hist.push('/item/' + item.id, { detail: item });

                // that.setState({
                //     lendobject: '',
                // });
            });
        }
    };

    newTab() {
 
    };

    // TODO: 1 create  this in its own col <Image src={this.state.items.image} fluid />
    // 2. make sure image tag is accessed in home and added to state.item
    // 3. eventually solve image as byte/text/blob storage issue
    //      OR for now make sure there is a resize to 200x200 when listing
    render() {
        const newTab = this.props.items.map((item) => {
            // console.log("name",item.id);
            // let tmp = "row_" + item.id;
            return (
                <tr key={"row_" + item.id} >
                    {/* <td key= {"lendobject"+item.id}> <Link to={"/"+item.id} key={"link_lendobject"+item.id}>{item.lendobject}</Link> </td> */}
                    <td key={"lendobject" + item.id} onClick={() => this.handleClick(item)}> {item.lendobject}</td>

                    <td key={"lenddesc" + item.id} onClick={() => this.handleClick(item)}> {item.lenddesc} </td>
                    <td key={"lendprice" + item.id} onClick={() => this.handleClick(item)}> {item.lendprice} </td>
                    <td key={"buttons" + item.id}> 
                       <DropdownButton id="dropdown-basic-button" title="Delete/Edit">

                        <Dropdown.Item id="edit" onClick={(e) => this.handleButtonEdit(e, item)}>Edit</Dropdown.Item>
                        <Dropdown.Item id="delete" onClick={(e) => this.handleButtonDelete(e, item)}>Delete</Dropdown.Item>
                    </DropdownButton>
                    </td>
                </tr>


            );

        });
        console.log('tab', this.newTab);

        return (
            <tbody>
                <tr key="t_head">
                    <td key="hname"> Item for Rent  </td>
                    <td key="hemail"> Item Description  </td>
                    <td key="hitem"> Rental Price </td>
                    <td key="hchange"></td>
                </tr>
                {newTab}
            </tbody>
            // <p>hello</p>

        );
    }


}

export default MyItemList;