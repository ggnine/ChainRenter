import React, {
    Component
} from 'react';
import Itemlist from './Itemlist';
import client from '../../feathers';

import { Dropdown, DropdownButton, Row, Col, Jumbotron, Container, Button, Table, Form, FormControl } from 'react-bootstrap';
import zipcodes from 'zipcodes';
import { Link, NavLink, withRouter } from 'react-router-dom';

const crlistings = client.service('crlistings');
const users = client.service('users');
const uploadService = client.service('uploads');
const reader = new FileReader();

class Home extends Component {

    constructor(props) {
        super(props);
        console.log("restarting home");
        console.log("idddd", this.props.match.params.que);

        // id: this.props.match.params.id,

        console.log("restarting home props", props);
        var search = '';
        if (this.props.match.params.que) {
            console.log("yes search param", this.props.match.params.que);
            search = this.props.match.params.que;


        }
        try {
            if (this.props.location.state.sz) {
                if (this.props.location.state.sz.trim()) {
                    search = this.props.location.state.sz.trim();

                    // clear history state so doesn't retain on refresh
                    this.props.history.replace({
                        pathname: '/',
                        state: {}
                    });
                }
            }
        } catch (error) {
            console.log("err no props.loc no sz err", error);
        }
        this.props.incrementVisited();

        this.state = {
            items: [], //{ lendobject: '1111aaaa', lenddesc: '111bbb', lendprice: '111ccccc', id: '999'}, { lendobject: '111aaaa22', lenddesc: '1111bbb22', lendprice: 'ccccc22', id: '2312' }
            sortTerm: 'lendobject',
            searchTerm: search,
            isHidden: true,
            zip: ''
        }
        this.handleSubmitSort = this.handleSubmitSort.bind(this);
        this.refreshListSort = this.refreshListSort.bind(this);
        this.toggleHidden = this.toggleHidden.bind(this);

        this.handleZipChange = this.handleZipChange.bind(this);
        this.handleSubmitZip = this.handleSubmitZip.bind(this);

        this.checkDbForZip = this.checkDbForZip.bind(this);
        this.updateItems = this.updateItems.bind(this);
        this.handleCityState = this.handleCityState.bind(this);
        this.handlePhoto = this.handlePhoto.bind(this);
        this.handleSubmitAll = this.handleSubmitAll.bind(this);





    }
    async handleSubmitAll(e) {
        console.log("ALL submit: ", e);
        let that = this;
        await crlistings.find({
            query: {
                $limit: 200,
                $sort: {
                    [this.state.sortTerm]: 1
                }
            }
        }).then((res) => {
            this.updateItems(that, res);
        }).then(() => {
            console.log('from close zip db  update:');
            that.setState({
                isHidden: false
            });
        }).catch(err => {
            console.log("error in zip close retieval", err)
        })
        

    }

    handleZipChange(e) {
        console.log("Asdf333355");
        e.preventDefault();

        // console.log("111",this.props);
        console.log("111", e.target.value)
        this.setState({
            [e.target.id]: e.target.value
        });
        if (e.target.value === '') {
            console.log("trying zero serach", e.target.value);
            // if (e.target.id === '')
            // this.handleEmptySubmit();
        }
    }


    handleSubmitZip(e) {
        console.log("zip submit: ", e);

        if (this.state.zip.length === 5 && this.state.zip.match(/^[0-9]+$/) != null) {
            console.log("heres zip", this.state.zip);
            let newArray = zipcodes.radius(this.state.zip, 25).slice();
            console.log("zipppps", newArray);
            this.checkDbForZip(newArray);
            this.setState({
                zip: ''
            });
        }
    }

    async checkDbForZip(radArray) {
        var that = this;
        console.log("checkdbzip", JSON.stringify(radArray));
        let goo = radArray;
        radArray.splice(-2, 2);
        await crlistings.find({
            query: {
                location: {
                    $in: radArray
                },
                $limit: 200,
                $sort: {
                    [this.state.sortTerm]: 1
                }
            }
        }).then((res) => {
            this.updateItems(that, res);
        }).then(() => {
            console.log('from close zip db  update:');
            that.setState({
                isHidden: false
            });
        }).catch(err => {
            console.log("error in zip close retieval", err)
        })
    }

    toggleHidden() {
        console.log("toggeled", this.state.isHidden);
        this.setState({
            isHidden: !this.state.isHidden
        });
        // console.log("toggeled psot",this.state.isHidden);

    }
    async refreshListSearch(searchTermTmp) {
        console.log("search: ", searchTermTmp);
        var that = this;
        console.log("sort from search", this.state.sortTerm);

        await crlistings.find({
            query: {
                // lendobject: searchTermTmp,
                $or: [
                    { lendobject: searchTermTmp },
                    { lenddesc: searchTermTmp }
                ],
                $limit: 200,
                $sort: {
                    [this.state.sortTerm]: 1
                }


            }
        }).then((res) => {
            this.updateItems(that, res);
        }).then(() => {
            console.log('from search update:');
            that.setState({
                isHidden: false
            });
        }).catch(err => {
            console.log("error in searhc retieval", err)
        })




    }
    async refreshListSort(sortTermTmp) {
        var that = this;
        let sortTerma = this.state.sortTerm;
        console.log("sort term unfucekd: ", sortTerma);
        if (sortTermTmp.trim()) {
            console.log("yes sort term", sortTermTmp.trim().length);
            sortTerma = sortTermTmp;
            this.setState({
                sortTerm: sortTerma
            }, () => { console.log("ssort cllabck", this.state.sortTerm) });
        }

        console.log("sprt term", sortTerma);
        await crlistings.find({
            query: {
                $limit: 200,
                $sort: {
                    [sortTerma]: 1
                }
            }
        }).then((res) => {
            this.updateItems(that, res);

        }).catch(err => {
            console.log("error in refresh list sort", err)
        })

    }

    async updateItems(that, res) {

        let data = res.data;
        console.log('from await crlistings:', res);
        let tmp3 = data.map(async (cont) => {
            // console.log('susername',cont.username);
            let tmpImage = '';
            tmpImage = await this.handlePhoto(cont);
            // .then(res => {
            //     console.log("imgggr", res);
            //     tmpImage = res;

            // });
            // console.log("imgggr",);

            // if (cont.image) {
            //     await uploadService.get("ad418194dae7586f3c33abaeadb9a5076253fdc8bcc279a0aa78590edef342dd.jpeg") //(item.image)      //"ad418194dae7586f3c33abaeadb9a5076253fdc8bcc279a0aa78590edef342dd.jpeg"
            //         .then((res) => {
            //             // console.log("aaa from upload service");
            //             // console.log("aaa", res);
            //             // console.log("immmg", res.uri);
            //             tmpImage = res.uri;


            //         }).catch(err => {
            //             console.log("errererere", err);
            //             var image = '';

            //         });
            // }


            var tmpCityState = this.handleCityState(cont);
            // console.log("tmpcitystate", tmpCityState);
            // .then(res=>{
            //     console.log("locccc",res);
            //     return "moo";
            // });
            // console.log("loccca", tmpCityState);

            return { lendobject: cont.lendobject, lenddesc: cont.lenddesc, lendprice: cont.lendprice, id: cont.id, image: tmpImage, location: cont.location, reqdep: cont.reqdep, listerusername: cont.username, listerid: cont.idfromuser, cityStateComb: tmpCityState };
        });
        Promise.all(tmp3).then((completed) => {
            console.log("complllllll", completed);
            that.setState({
                items: []
            });
            that.setState({
                items: this.state.items.concat(completed)
            });
        });


    }
    handleSubmitSort(e) {
        console.log("333submiteted", e.target.id);

        e.preventDefault();
        let sortTerm = e.target.id;
        // this.refreshListSort("lendobject");
        sortTerm ? this.refreshListSort(sortTerm) : console.log("nope");;



    }
    handleCityState(item) {
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
            combinedCityState = { city: 'bad', state: 'bad' };
        }
        return combinedCityState;
    }
    async handlePhoto(item) {
        var image = '';

        return new Promise(async function (resolve, reject) {
            if (item.image) {
                await uploadService.get(item.image)      //"ad418194dae7586f3c33abaeadb9a5076253fdc8bcc279a0aa78590edef342dd.jpeg"
                    .then((res) => {
                        console.log("aaa from upload service");
                        // console.log("aaa", res);
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
        // console.log("cms image:", item.image);




    }
    componentWillUnmount(){

    }

    async componentDidMount() {
        console.log("i mounted", this.state);



        var that = this;

        if (this.state.searchTerm.trim()) {
            console.log("something in searhc", this.state.searchTerm);

            this.refreshListSearch(this.state.searchTerm);
        } else {
            console.log("nopthing in searhc");
            this.refreshListSort('');
        }


        //reciever for new items created in crlistings databse
        crlistings.on('created', res => {
            console.log("created YYYY");
            let data = res.data;
            console.log('from await crlistings:', res.lendobject);
            console.log("aaa res:", res);

            let tmp2 = [{ lendobject: res.lendobject, lenddesc: res.lenddesc, lendprice: res.lendprice, id: res.id }];

            that.setState({
                items: this.state.items.concat(tmp2)//tmp1
            });
        });

        // reciever for query call from navbar serach
        client.on("queried", (data) => {
            let tmpSearch = data.searchTerm;
            console.log("got wueried", tmpSearch);
            if (tmpSearch.trim()) {
                console.log("something in searhc");

                this.refreshListSearch(data.searchTerm);
            } else {
                console.log("nopthing in searhc");
                this.refreshListSort('');
            }
        });

    }
    render() {
        console.log("first time: ", this.props.firstTimeVisit);

        return (
            <div>
                <div className="container center">

                    <Row>

                    </Row>
                    <div>
                        <Jumbotron style={{ backgroundColor: "#88bbff", padding: "2rem" }} className="helv jumb" >
                            <h1 >ChainRenter</h1>

                            <h3 >Rent What You Need from Friends and Neighbors</h3>
                            <h4 >Secure, Easy and Middle Man Free</h4>
                            <p></p>
                            <div>
                                <Form inline onSubmit={this.handleSubmitZip} className="formJumbo">
                                    <FormControl type="text" placeholder="Enter Your Zip" className="mr-md-1" id="zip" className=" white-text " onChange={this.handleZipChange} value={this.state.zip} />
                                    {/* <Button variant="outline-success" onClick={this.handleSubmitSort} >Search</Button> */}
                                    <Button variant="primary" onClick={this.handleSubmitZip}>See Nearby Listings</Button>
                                    <Button variant="secondary" onClick={this.handleSubmitAll}>See All Listings</Button>

                                </Form>
                            </div>

                        </Jumbotron>
                    </div>

                    {/* <Row className="justify-content-md-center">
                     
                    </Row> */}
                    {/* <Container id="mainCont" > */}

                    {/* check if listings should be hidden based on toggle and first time visitng */}
                    {(!this.state.isHidden || !this.props.firstTimeVisit) && <Listings items={this.state.items} hist={this.props.history} handleSubmitSort={this.handleSubmitSort} />}
                    {/* </Container> */}

                </div>
            </div>

        )
    }

}
// const Example = props => <div className={props.shouldHide}/>Hello</div>

class Listings extends Component {

    constructor(props) {
        super(props);
        console.log("whatshshis", props);
    }
    render() {
        return (

            <div >
                <Row className="justify-content-md-center">
                    <Col> </Col>
                    <Col><h2> Listings</h2></Col>
                    <Col>    <DropdownButton id="dropdown-basic-button" title="Sort">

                        <Dropdown.Item id="createdat" onClick={this.props.handleSubmitSort}>Time</Dropdown.Item>
                        <Dropdown.Item id="lendobject" onClick={this.props.handleSubmitSort}>Name</Dropdown.Item>
                        <Dropdown.Item id="lendprice" onClick={this.props.handleSubmitSort}>Price</Dropdown.Item>
                    </DropdownButton></Col>
                </Row>


                <div>
                    {/* <table className="highlight centered"> */}
                    <Table striped bordered hover >


                        <Itemlist items={this.props.items} hist={this.props.hist} />

                    </Table>
                </div>
            </div>
        )
    }
}
// const Listings = (props) => (
//     <div className='modal'>
//     <p>asdklfjlaksjdfl</p>
//         {/* <Row className="justify-content-md-center">
//             <Col> </Col>
//             <Col><h2> Listings</h2></Col>
//             <Col>    <DropdownButton id="dropdown-basic-button" title="Sort">

//                 <Dropdown.Item id="createdat" onClick={props.handleSubmitSort}>Time</Dropdown.Item>
//                 <Dropdown.Item id="lendobject" onClick={props.handleSubmitSort}>Name</Dropdown.Item>
//                 <Dropdown.Item id="lendprice" onClick={props.handleSubmitSort}>Price</Dropdown.Item>
//             </DropdownButton></Col>
//         </Row>


//         <div>
//             <table className="highlight centered">


//                 <Itemlist items={props.items} hist={props.history} />

//             </table>
//         </div> */}
//     </div>
// )

export default withRouter(Home);
// export default Home;
