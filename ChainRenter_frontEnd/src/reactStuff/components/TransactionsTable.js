import React, { Component } from 'react';
// import { Table } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import zipcodes from 'zipcodes';
import { Image, Button,Popover, OverlayTrigger } from 'react-bootstrap';
import client from '../../feathers';
import StatusPopover from './utilities/StatusPopover';


// const uploadService = client.service('uploads');
// const reader = new FileReader();

const TransactionsTable = (props) => {
    console.log("item list");
    console.log("props? ", props);

    // console.log("inside props.items list",props.items);
    const handleClick = (item) => {
        console.log("clicked", item.id);
        props.hist.push('/transactiondetails/' + item.id);

    };

    const handleButton = (e, item) => {
        console.log("clicked", e);
        console.log("clicked_items id: ", item.id);
        e.stopPropagation();
        e.preventDefault();

        if (item.id) {
            // crlistings.remove(item.id).then((res) => {
            //     console.log("removed! ", res);

            // });
        }
    };


    // const oo = [{name:'11333aa',email:'111bbb',lendobject:'111ccccc'},{name:'111aaaa22',email:'1111bbb22',lendobject:'ccccc22'}]
    const newTab = props.items.map((item) => {
        // console.log("name",item.id);

        return (
            <tr key={"row" + item.id} onClick={() => handleClick(item)} className="transtable">
                {/* <td key= {"lendobject"+item.id}> <Link to={"/"+item.id} key={"link_lendobject"+item.id}>{item.lendobject}</Link> </td> */}
                <td key={"itemname" + item.id}> {item.rl_name} </td>
                <td key={"TransactionId" + item.id}>  {item.id}</td>
                <td key={"Created" + item.id}> {item.createdat} </td>
                <td key={"Notes" + item.id}>  {item.initialnotes} </td>
                <td key={"Price" + item.id}> ${item.totalprice} </td>
                <td key={"Deposit" + item.id}> ${item.deposit} </td>
                <td key={"checkout" + item.id}> {item.checkoutdate} </td>
                <td key={"checkin" + item.id}> {item.checkindate} </td>
                <td key={"status" + item.id}> {item.status}/7 </td>
                {/* <td key={"buttons" + item.id}> <Button id="delete" onClick={(e) => handleButton(e, item)}>Delete</Button> </td> */}

                {/* <td key={"location" + item.id}> {item.cityStateComb.city}, {item.cityStateComb.state}  </td> */}

            </tr>


        )

    });
    console.log('tab', newTab);

    return (
        <tbody>
            <tr key="t_head">
                <td key="Item">  Item  </td>
                <td key="id">  Transaction Id </td>
                <td key="Created" > Created At </td>
                <td key="Notes">  Notes  </td>
                <td key="Price"> Total Price </td>
                <td key="Deposit"> Deposit </td>
                <td key="checkout"> Checkout Date </td>
                <td key="checkin"> Checkin Date </td>

                <td key="status"> Status <StatusPopover /></td>



            </tr>
            {newTab}
        </tbody>
        // <p>hello</p>

    )

    // category of contract is "potential, live or complete"
    //could use contract id to cehck this
    // should probaly add extra column to transactions table

}

export default TransactionsTable;