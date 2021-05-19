
import React, { Component } from 'react';
// import { Table } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import zipcodes from 'zipcodes';
import { Image } from 'react-bootstrap';
import client from '../../feathers';


const uploadService = client.service('uploads');
const reader = new FileReader();

class Itemlist extends Component {
    // console.log("item list");
    // console.log("props? ", props);
    constructor(props) {
        console.log("Asdf",props);

        super(props);

        this.state = { ite: [] };  //{lendobject: '', lenddesc: '', lendprice: '', location: '', reqdep: ''}
        this.handleClick = this.handleClick.bind(this);
        // this.handleClick = this.handleClick.bind(this);


    }

    // console.log("inside props.items list",props.items);
    handleClick(item) {
        console.log("clicked", item.id);
        this.props.hist.push('/item/' + item.id, { detail: item });

    }


    async componentDidMount() {
        console.log("items list did mount");
        const newItems = this.props.items.map(async (item) => {
            console.log("items", item);

            let location = item.location;
            // console.log("lcoation", location);
            var combinedCityState = { city: 'city', state: 'state' }; //placeholder text for missing entries
            try {
                if (location) {
                    if (location.length === 5 && location.match(/^[0-9]+$/) != null) {
                        let goo = zipcodes.lookup(location);
                        if (goo) {
                            // console.log("goooo", goo.city);
                            combinedCityState.city = goo.city;
                            combinedCityState.state = goo.state;
                        }
                    }
                }
            } catch (error) {
                console.log("erro in zip", error);
                // combinedCityState = { city: 'bad', state: 'bad' };
            }
            // console.log("heres zip", city);

            var image = '';

            // console.log("cms image:", item.image);
            if (item.image) {
                await uploadService.get(item.image)       //"ad418194dae7586f3c33abaeadb9a5076253fdc8bcc279a0aa78590edef342dd.jpeg"
                    .then((res) => {
                        // console.log("aaa from upload service");
                        // console.log("aaa", res);
                        // console.log("immmg", res.uri);
                        image = res.uri;

                    }).catch(err => {
                        console.log("errererere", err);
                        var image = '';
                    });
            }
            console.log("noo image: ");
            // console.log("imagggggg", image);

            return (
                { lendobject: item.lendobject, lenddesc: item.lenddesc, lendprice: item.lendprice, location: item.location, id: item.id, combinedCityState: combinedCityState, image: image }

            );

            // return (
            //     { lendobject: item.lendobject, lenddesc: item.lenddesc, lendprice: item.lendprice, location: item.location, id: item.id, combinedCityState: combinedCityState, image: '' }

            // );


        });
        Promise.all(newItems).then((completed) => {
            this.setState({
                ite: completed
            });
        });

    }
    // console.log('tab', newTab);

    render() {
        console.log('items', this.props.items);

        return (
            <tbody>
                <tr key="t_head">
                    <td key="himage"> Image </td>
                    <td key="hname"> Item for Rent  </td>
                    <td key="hemail"> Item Description  </td>
                    <td key="hitem"> Rental Price </td>
                    <td key="hloc"> Location </td>
                </tr>
                {/* for each code goes here */}


                {this.state.ite.map((item, i) => {
                    return (
                        <tr key={"tmp" + item.id} onClick={() => this.handleClick(item)}>
                            {/* <td key= {"lendobject"+item.id}> <Link to={"/"+item.id} key={"link_lendobject"+item.id}>{item.lendobject}</Link> </td> */}
                            <td key={"image" + item.id}> <Image src={item.image} fluid /></td>

                            <td key={"lendobject" + item.id}> {item.lendobject}</td>

                            <td key={"lenddesc" + item.id}> {item.lenddesc} </td>
                            <td key={"lendprice" + item.id}> {item.lendprice} </td>
                            <td key={"lendprice" + item.location}> {item.combinedCityState.city}, {item.combinedCityState.state}  </td>


                        </tr>

                    );
                })}

                <p>number: {this.props.numberX}</p>

            </tbody>
            // <p>hello</p>

        )

    }
}

export default Itemlist;