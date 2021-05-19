
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

    const someFunction = (myArray) => {
        const promises = myArray.map(async (myValue) => {
            return {
                id: "my_id",
                myValue: await service.getByValue(myValue)
            }
        });
        return Promise.all(promises);
    }



    // const oo = [{name:'11333aa',email:'111bbb',lendobject:'111ccccc'},{name:'111aaaa22',email:'1111bbb22',lendobject:'ccccc22'}]
    const newTab = props.items.map((item) => {
        // console.log("name",item.id);
        let tmp = "row_" + item.id;
        let location = item.location;
        // console.log("lcoation", location);
        var city = { city: 'city', state: 'state' }; //placeholder text for missing entries
        try {
            if (location) {
                if (location.length === 5 && location.match(/^[0-9]+$/) != null) {
                    let goo = zipcodes.lookup(location);
                    if (goo) {
                        // console.log("goooo", goo.city);
                        city.city = goo.city;
                        city.state = goo.state;
                    }
                }
            }
        } catch (error) {
            console.log("erro in zip", error);
            city = { city: 'bad', state: 'bad' };
        }
        // console.log("heres zip", city);

        var image = '';
        try {
            console.log("cms image:", item.image);
            uploadService.get("ad418194dae7586f3c33abaeadb9a5076253fdc8bcc279a0aa78590edef342dd.jpeg")
                .then((res) => {
                    console.log("aaa from upload service");

                    console.log("aaa", res);

                    console.log("immmg", res.uri);
                    image = res.uri;

                });

            // console.log("whhh image: ", image);
        } catch (error) { console.log("erro in image"); }
        console.log("imagggggg", image);
        return (
            <tr key={tmp} onClick={() => handleClick(item)}>
                {/* <td key= {"lendobject"+item.id}> <Link to={"/"+item.id} key={"link_lendobject"+item.id}>{item.lendobject}</Link> </td> */}
                <td key={"image" + item.id}> <Image src={image} fluid /></td>
                <td key={"lendobject" + item.id}> {item.lendobject}</td>

                <td key={"lenddesc" + item.id}> {item.lenddesc} </td>
                <td key={"lendprice" + item.id}> {item.lendprice} </td>
                <td key={"lendprice" + item.location}> {city.city},{city.state}  </td>

            </tr>


        )

    });
    console.log('tab', newTab);

    return (
        <tbody>
            <tr key="t_head">
                <td key="himage"> Image </td>
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