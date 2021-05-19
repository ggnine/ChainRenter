
import React, { Component } from 'react';
// import { Table } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import zipcodes from 'zipcodes';
import { Image } from 'react-bootstrap';
import client from '../../feathers';


const uploadService = client.service('uploads');
const reader = new FileReader();

const Itemlist = (props) => {
    console.log("item list");
    console.log("props? ", props);

    // console.log("inside props.items list",props.items);
    const handleClick = (item) => {
        console.log("clicked", item.id);
        props.hist.push('/item/' + item.id, { detail: item });
        // props.his.push({
        //     pathname: '/'+id,
        //     // search: '?query=abc',
        //     state: { detail: "qauck auck"}
        //   })
    };

    const toTitleCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }



    // const oo = [{name:'11333aa',email:'111bbb',lendobject:'111ccccc'},{name:'111aaaa22',email:'1111bbb22',lendobject:'ccccc22'}]
    const newTab = props.items.map((item) => {
        // console.log("name",item.id);

        return (
            <tr key={"row" + item.id} onClick={() => handleClick(item)}>
                {/* <td key= {"lendobject"+item.id}> <Link to={"/"+item.id} key={"link_lendobject"+item.id}>{item.lendobject}</Link> </td> */}
                <td key={"image" + item.id} className="aCol"> <Image src={item.image} fluid /></td>
                <td key={"lendobject" + item.id}> {toTitleCase(item.lendobject)}</td>

                <td key={"lenddesc" + item.id}> {toTitleCase(item.lenddesc)} </td>
                <td key={"lendprice" + item.id}> ${item.lendprice} per Day</td>
                <td key={"location" + item.id}> {item.cityStateComb.city}, {item.cityStateComb.state}  </td>

            </tr>


        )

    });
    console.log('tab', newTab);

    return (
        <tbody>
            <tr key="t_head">
                <td key="himage" className="aCol"> Image </td>
                <td key="hname"> Item for Rent  </td>
                <td key="hemail"> Item Description  </td>
                <td key="hitem"> Rental Price </td>
                <td key="hloc"> Location </td>
            </tr>
            {newTab}
        </tbody>
        // <p>hello</p>

    )


}

export default Itemlist;