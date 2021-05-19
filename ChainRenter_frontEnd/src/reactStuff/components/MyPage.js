import React, { Component } from 'react';
import client from '../../feathers';
import MyItemList from './MyItemList';
import { Dropdown, DropdownButton, Row, Col, Table } from 'react-bootstrap';


const crlistings = client.service('crlistings');
const users = client.service('users');

class MyPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [], //{ lendobject: '1111aaaa', lenddesc: '111bbb', lendprice: '111ccccc', id: '999'}, { lendobject: '111aaaa22', lenddesc: '1111bbb22', lendprice: 'ccccc22', id: '2312' }
            // sortTerm:''
            id: ''
        }



    }
    async componentDidMount() {

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
                console.log('User', client.get('user'));
            })
            .catch(function (error) {
                console.error('Error authenticating!', error);
            });


        // await users.find()
        //     .then((res) => {
        //         console.log("aaa");

        //         console.log('from await users:', res);
        //         let id = res.data;
        //         console.log("id",id);
        //         that.setState({
        //             id: 'a'
        //         });
        //     })
        //     .catch(err => {
        //         console.log("er3333rere", err)
        //     })

        // await crlistings.find({
        //     query: {
        //         $limit: 1,
        //         lendobject: 'aaaa'
        //         // $sort: {
        //         //     lendobject: 1
        //         // }
        //     }
        // }).then((res) => {
        //     console.log("aaa3333333",res.data.user);
        //         that.setState({
        //             id: 'a'
        //         });
        //     });
        console.log("idididi", client.get('user'));
        let userHere = client.get('user');
        await crlistings.find({
            query: {
                $limit: 200,
                idfromuser: [client.get('user')._id]
                // $sort: {
                //     lendobject: 1
                // }
            }
        })
            .then((res) => {
                console.log("aaa");
                let data = res.data;
                console.log('from await crlistings:', res);


                // this.setState({ crlistings: this.state.crlistings.concat(message) });
                let tmp3 = data.map((cont) => {
                    return { lendobject: cont.lendobject, lenddesc: cont.lenddesc, lendprice: cont.lendprice, id: cont.id };
                });
                // let tmp2 = [ {lendobject: data.lendobject, lenddesc: data.lenddesc, lendprice: data.lendprice, data: res.id }];
                // that.setState({
                //     items: []
                // });
                // console.log("object",tmp3);
                that.setState({
                    items: tmp3
                });
            })
            .catch(err => {
                console.log("er3333rere", err)
            })

        crlistings.on('removed', res => {
            console.log("removeeeeed YYYY", res);
            let data = res.data;
            crlistings.find({
                query: {
                    $limit: 200,
                    idfromuser: [client.get('user')._id]
                    // $sort: {
                    //     lendobject: 1
                    // }
                }
            })
                .then((res) => {
                    console.log("aaa");
                    let data = res.data;
                    console.log('from await crlistings:', res);


                    // this.setState({ crlistings: this.state.crlistings.concat(message) });
                    let tmp3 = data.map((cont) => {
                        return { lendobject: cont.lendobject, lenddesc: cont.lenddesc, lendprice: cont.lendprice, id: cont.id };
                    });
                    // let tmp2 = [ {lendobject: data.lendobject, lenddesc: data.lenddesc, lendprice: data.lendprice, data: res.id }];
                    // that.setState({
                    //     items: []
                    // });
                    // console.log("object",tmp3);
                    that.setState({
                        items: tmp3
                    });
                })
                .catch(err => {
                    console.log("er3333rere", err)
                })
            // let tmp2 = [{ lendobject: res.lendobject, lenddesc: res.lenddesc, lendprice: res.lendprice, id: res.id }];

            // that.setState({
            //     items: this.state.items.concat(tmp2)//tmp1
            // });
        });



    }
    render() {
        return (
            <div>
                <div className="container center">
                <Row>
                        <span>&nbsp;&nbsp;</span><span>&nbsp;&nbsp;</span>
                        </Row>
                    <Row className="justify-content-md-center">
                        <Col> </Col>
                        <Col> <h2 className="center text-center">My Listings</h2></Col>
                        <Col></Col>


                    </Row>
                    
                    <Row className="justify-content-md-center">
                    <Col sm={8} >
                        <Table striped bordered hover>


                            <MyItemList items={this.state.items} hist={this.props.history} id={this.props.id} />

                        </Table>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

}

export default MyPage;