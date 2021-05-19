import React, { Component } from 'react';
// import { Table } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import zipcodes from 'zipcodes';
import { Image, Button } from 'react-bootstrap';
import client from '../../feathers';


// const uploadService = client.service('uploads');
// const reader = new FileReader();

const MessageTable = (props) => {
    console.log("item list");
    console.log("props? ", props);

    // console.log("inside props.items list",props.items);
    const handleClick = (item) => {
        console.log("clicked", item.id);
        // props.hist.push('/item/' + item.id, { detail: item });
  
    };

    const handleButton = (e, item) =>{
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
            <tr key={"row" + item.id} onClick={() => handleClick(item)}>
                {/* <td key= {"lendobject"+item.id}> <Link to={"/"+item.id} key={"link_lendobject"+item.id}>{item.lendobject}</Link> </td> */}
                <td key={"image" + item.id} > Temp From </td>
                <td key={"lendobject" + item.id}>Temp Item Name  </td>

                <td key={"lenddesc" + item.id}>  Temp Reciev</td>
                <td key={"lendprice" + item.id}> Temp Content </td>
                <td key={"buttons" + item.id}> <Button id="delete" variant="secondary" size='sm' onClick={(e) => handleButton(e, item)}>Delete</Button> </td>

                {/* <td key={"location" + item.id}> {item.cityStateComb.city}, {item.cityStateComb.state}  </td> */}

            </tr>


        )

    });
    console.log('tab', newTab);

    return (
        <tbody>
            <tr key="t_head">
                <td key="himage" > From: </td>
                <td key="hname">  Item:  </td>
                <td key="hemail"> Recieved on:  </td>
                <td key="hloc"> Content: </td>
                <td key="options">  </td>
            </tr>
            {newTab}
        </tbody>
        // <p>hello</p>

    )


}

export default MessageTable;