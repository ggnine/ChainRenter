import React, { Component, useState } from 'react';
import { Route, BrowserRouter, Redirect, withRouter } from 'react-router-dom';
import TransactionDetailsTry from '../TransactionDetailsTry';
import client from '../../../feathers';
import GetBorrowerAndListerIds from '../utilities/GetBorrowerAndListerIds';
import { StageZero } from './StageZero';
import { StageOneLister, StageOneBorrower } from './StageOne';
import { StageTwoLister, StageTwoBorrower } from './StageTwo';
import { StageThree } from './StageThree';
import { StageFiveBorrower,StageFiveLister } from './StageFive';

import { StageSeven } from './StageSeven';
import { StageFourLister, StageFourBorrower } from './StageFour';
import { StageSixLister, StageSixBorrower } from './StageSix';
import Web3 from 'web3';
import chainrenterArtifact from "../../../contracts/Chainrenter.json";
import STATUS from '../utilities/TransStatus';
import worker_script from '../../../workerfile';
const BigNumber = require('bignumber.js');

const myService = client.service('my-service');
const transacts = client.service('transacts');

const axios = require('axios');


const getEthToUsdApi = async () => {
    try {
        let usdApi = await axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/');
        let usdToEth = usdApi.data[0].price_usd;
        console.log("heres ethusd ", usdToEth);
        return usdToEth;
    } catch (error) {
        console.error("eeeee23or", error);

    }
}

const getEthToUsdConversion = async (amountOfUsd) => {
    try {
        console.log("usd", amountOfUsd);
        if (amountOfUsd) {
            let etherAmt = amountOfUsd / await getEthToUsdApi();
            console.log("heres the ether amount", etherAmt);
            return etherAmt;
        } else {
            console.log("nan ");
            return 0;
        }
    } catch (error) {
        console.error("eee44343or", error);
    }
}



class UserDrivenRoute extends Component {

  constructor(props) {
    super(props);
    console.log("propzzz", props);
    this.state = {

      borroweruserid: null,
      renteruserid: null,
      visitorIsEitherListerorBorrower: false,
      visIsListerTwo: true,
      rentingContract: null,
      visitorAccount: null,
      responseIdFromBlockchain: null,
      webthree: null,
      contractInfo: null
    }

    this.redir = this.redir.bind(this);
    this.finishCallback = this.finishCallback.bind(this);
    this.longOpFirstAddToBlockchain = this.longOpFirstAddToBlockchain.bind(this);
    this.getTransactDetails = this.getTransactDetails.bind(this);


  }
  async componentDidMount() {
    // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545"); //
    let ethereum = window.ethereum;
    let web3 = window.web3;
    if (typeof ethereum !== 'undefined') {
      await ethereum.enable();
      web3 = new Web3(ethereum);
    } else if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER));
    }

    try {
      // get contract instance
      console.log("aa", web3.eth.net.getId());
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = chainrenterArtifact.networks[networkId];
      console.log("deploooo", deployedNetwork);

      let contractAddress = deployedNetwork.address;
      let rentingContract = new web3.eth.Contract(
        chainrenterArtifact.abi,
        deployedNetwork.address,
      );
      console.log("retnign contract", rentingContract);

      // get accounts
      const accounts = await web3.eth.getAccounts();
      // let visitorAccount = accounts[0];
      let visitorAccount = accounts[0];

      console.log("vis account", visitorAccount);



      this.setState({
        webthree: web3,
        rentingContract,
        visitorAccount,
        contractInfo: { abi: chainrenterArtifact.abi, address: deployedNetwork.address }
      });
      //   this.sendToBlockChain();
      // await loadCandidates();

    } catch (error) {
      console.log(error);
      console.error("Could not connect to contract or chain.");
    };

    // const { addRentalToBlockchain } = this.renting.methods;
    // await addRentalToBlockchain("aiiaiHIII", 99939, 99922, 220, 2222320, 38938398398, 222222000, 'iaiia').send({ gas: 1140000, from: this.account });



    // this.setState({ account: accounts[0] });

    console.log("idddduserdriven", this.props.computedMatch.params.id);


    transacts.on('patched', res => {
      console.log("patcheeddeded", res);

      //this should be more modular
      transacts.get(this.props.computedMatch.params.id)
        .then(async (res) => {
          console.log("item from tranacts found:", res);

          this.setState({
            status: res.status
            // transactDetails: {finalnotes: res.finalnotes, status: res.status} 
          });
        })
        .catch(err => {
          console.log("eror in checking transacs", err)
        })
    });


    let { borroweruserid, renteruserid, status } = await GetBorrowerAndListerIds(this.props.computedMatch.params.id);
    console.log("got em", borroweruserid, this.props.visitorId);

    this.setState({
      borroweruserid, renteruserid, status
    }, () => {
      console.log("setttttt");
      let listerOrBorrower = '';
      let visitorIsEitherListerorBorrower = Boolean(borroweruserid === this.props.visitorId || this.props.visitorId === renteruserid)
      if (borroweruserid === this.props.visitorId) {
        listerOrBorrower = "Borrower";
      } else if (this.props.visitorId === renteruserid) {
        listerOrBorrower = "Lister";
      }
      console.log("sammmmme", visitorIsEitherListerorBorrower);
      this.setState({
        visitorIsEitherListerorBorrower: visitorIsEitherListerorBorrower,
        listerOrBorrower: listerOrBorrower
      });

    });
    console.log("are these the same - borow = vis", Boolean(this.state.borroweruserid === this.props.visitorId));

  }


  async longOpFirstAddToBlockchain() {

    let that = this;
    console.log("lpong op");
    let idOfTrans = this.props.computedMatch.params.id;
    let deets = await this.getTransactDetails();
    console.log("gott transact details", deets);
    console.log("wwww333", this.state.rentingContract);
    const { addRentalToBlockchain } = this.state.rentingContract.methods;
    console.log(deets.finalnotes, parseInt(deets.itemidinrentlib), parseInt(deets.idintransacts), parseInt(deets.checkoutdate), parseInt(deets.checkindate), parseInt(deets.totalprice), parseInt(deets.deposit), 'iaiia');

    // await addRentalToBlockchain(deets.finalnotes, parseInt(deets.itemidinrentlib), parseInt(deets.idintransacts), parseInt(deets.checkoutdate), parseInt(deets.checkindate), parseInt(deets.totalprice), parseInt(deets.deposit), 'iaiia').send({ gas: 31140000, from: this.state.visitorAccount });

    // await addRentalToBlockchain(deets.finalnotes, parseInt(deets.itemidinrentlib), parseInt(deets.idintransacts), 34333, 34333333, parseInt(deets.totalprice), parseInt(deets.deposit), 'iaiia').send({ gas: 31140000, from: this.state.visitorAccount });

    //TODO these are dummy
    //web3.utils.toBN(11111111190000000)
    // let num = 11333111111190000000;

    
    //TODO fix fudge +2 to makesure theres enought money in there
    

    let rentPriceInEther = await getEthToUsdConversion(parseInt(deets.totalprice));
    let depositInEther = await getEthToUsdConversion(parseInt(deets.deposit));

    console.log("rent in ether",rentPriceInEther);
    console.log("dpeot in ether",depositInEther);

    await addRentalToBlockchain(deets.finalnotes, BigNumber(deets.itemidinrentlib).toFixed(), BigNumber(deets.idintransacts).toFixed(), BigNumber(deets.checkoutdate).toFixed(), BigNumber(deets.checkindate).toFixed(), BigNumber(this.state.webthree.utils.toWei(BigNumber(rentPriceInEther).toFixed(), 'ether')).toFixed(),  BigNumber(this.state.webthree.utils.toWei(BigNumber(depositInEther).toFixed(), 'ether')).toFixed()).send({ gas: 1140000, from: this.state.visitorAccount })
      .on('transactionHash', function (hash) {
        console.log('hash', hash);

        let tmpDeetsE = { status: STATUS["3. Tentative Handshake"] };
        transacts.patch(idOfTrans, tmpDeetsE).then((res) => {
          console.log("handshake status in",res);
        });

        that.state.rentingContract.events.idFromBlockchainEvent({
          // filter: {transactionHash: hash}, // Using an array means OR: e.g. 20 or 23
          fromBlock: 0
        }, function (error, event) {


          console.log("sssss", event);



          //filtering from events - 
          //checking to see if the transacts DB id entered via addrentaltoblockchain is same as what we expect
          //TODO perhaps this should be in the backend???
          if (parseInt(event.returnValues.info) === parseInt(idOfTrans)) {
            console.log("yes this is id", event.returnValues.info);
            let bkId = event.returnValues.id.toString();
            that.setState({
              responseIdFromBlockchain: bkId
            });

            //TODO c9ould also get transaction address from idfromblockhcainevent and add that to extra1 in db
            let tmpDeets = { contractid: bkId };
            transacts.patch(idOfTrans, tmpDeets).then(() => {
              console.log("hi done adding to db");
            });
          }
        }).on('error', console.error);

        //maybe should be in callback from filter
        //hash part wont work if on localnet NOT ropsten
        let hashInfo = { hash: hash, id: idOfTrans, nextStatus: 4 };
        myService.get(hashInfo).then((res) => {
          console.log("response aaa from upload service", res);
        });
      }).then(function () {
        console.log("totally done!!!");
      });




    //pass hash here
    // let hashInfo = { hash: hash, id: idOfTrans, nextStatus: 4 };
    // myService.get(hashInfo).then((res) => {
    //   console.log("response aaa from upload service", res);
    // });



    // }).then(function () {

    //   console.log("totally done!!!");

    // });

    console.log("succes fro mblockhcain");

    //now in backend
    // let tmpDeets = { status: STATUS["4. Official on Blockchain"] };
    // transacts.patch(that.props.id, tmpDeets).then(() => {
    //   console.log("officla");
    // });

  }

  async getTransactDetails() {
    let iddd = this.props.computedMatch.params.id;
    return new Promise(async function (resolve, reject) {
      await transacts.get(iddd)
        .then(async (res) => {
          console.log("item from tranacts found:", res);
          // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

          let deets = {
            idintransacts: iddd,
            createdat: res.createdAt,
            checkoutdate: res.checkoutdate,
            checkindate: res.checkindate,
            contractid: res.contractid,
            deposit: res.deposit,
            finalnotes: res.finalnotes,
            initialnotes: res.initialnotes,
            totalprice: res.totalprice,
            status: res.status,
            itemidinrentlib: res.itemidinrentlib
          };
          // this.setState({
          //   transactDetails: deets
          // });
          // await this.getItemDetails(res);
          resolve(deets);
        })
        .catch(err => {
          console.log("eror in checking transacs", err)
          resolve(null);
        })
    });
  }

  finishCallback(val) {
    console.log("finish callback", val);
    if (val === 0) {
      console.log("succcces");

    } else {
      console.log("failllll");
    }
    // this.setState({ visIsListerTwo: false });
  }

  //on transacts.pactched -- update status here



  //sends visitor to previous page unless they are authorized - delay necesary to have time for state update
  redir() {
    setTimeout(function () { //Start the timer
      if (!this.state.visitorIsEitherListerorBorrower) {

        this.props.history.push('/transactions');
      }
      // return(<Redirect to='/' />)
    }.bind(this), 2000);
  }

  //I need to do major colymns layout here with stateless component for each module
  //then arrange them based on credentials =- ie <container> row col col row containger
  render() {
    console.log("rest:", this.props.visitorId);
    const { component: Component, ...rest } = this.props;
    console.log("cocmcmoomp3333", this.props);


    //Get status
    //get listerid
    //get borowerserid
    //switch (status)
    //case 0: if renter this, if borrower that (ie rightpanel = <renderlisterZero>
    //csae 1: if renter this if borrower

    let a = true; //curently faked
    console.log("stae stus", this.state.status);

    var rightContent = null;
    if (this.state.status) {
      switch (this.state.status) {
        case 911:
          console.log("aaa22XXXX");
          rightContent = <StageZero />;

          break;
        case 1: //Initiated Pending Owner
          console.log("aaa11");

          if (this.state.borroweruserid === this.props.visitorId) { //
            rightContent = <StageOneBorrower />;
          } else {
            rightContent = <StageOneLister id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} />;
          }
          break;

        case 2:  //Initiated Pending Final Agreement
          console.log("aaa222");
          if (this.state.borroweruserid === this.props.visitorId) { //
            rightContent = <StageTwoBorrower id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} {...this.state} longOpFirstAddToBlockchain={this.longOpFirstAddToBlockchain} />;
          } else {
            rightContent = <StageTwoLister />;
          }
          break;

        case 3: //Handshake
          console.log("aaa222");
          if (this.state.borroweruserid === this.props.visitorId) { //
            rightContent = <StageThree id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} />;
          } else {
            rightContent = <StageThree id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} />;
          }
          break;

        case 4:  //Official on Blockchain
          console.log("aaa222");
          if (this.state.borroweruserid === this.props.visitorId) { //
            rightContent = <StageFourBorrower id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} {...this.state} />;
          } else {
            rightContent = <StageFourLister id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} {...this.state} />;
          }
          break;

        case 5: //Rental Active
          console.log("aaa222");
          if (this.state.borroweruserid === this.props.visitorId) { //
            rightContent = <StageFiveBorrower id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} {...this.state} />;
          } else {
            rightContent = <StageFiveLister id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} {...this.state} />;
          }
          break;
        
        case 6: //Rental Active
          console.log("aaa222");
          if (this.state.borroweruserid === this.props.visitorId) { //
            rightContent = <StageSixBorrower id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} {...this.state} />;
          } else {
            rightContent = <StageSixLister id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} {...this.state} />;
          }
          break;

        case 7: // rental complete
          console.log("aaa222");
          if (this.state.borroweruserid === this.props.visitorId) { //
            rightContent = <StageSeven id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} />;
          } else {
            rightContent = <StageSeven id={this.props.computedMatch.params.id} finishCallback={this.finishCallback} />;
          }
          break;

      }


    } 

    console.log("asxxz", this.state.visitorIsEitherListerorBorrower);
    return (
      <Route {...rest} render={(propX) => (
        this.state.visitorIsEitherListerorBorrower
          ? <TransactionDetailsTry {...propX} borrowerId={"dd"} rightPanel={rightContent} listerOrBorrower={this.state.listerOrBorrower} />
          : <RedirectWithMessage props={this.props} redir={this.redir} />
      )} />
    );
  }
}

//    ? <TransactionDetailsTry {...propX} borrowerId={"dd"} rightPanel={<RenderListerTwo propsX={this.props} visIsListerTwo={this.state.visIsListerTwo} />} />  

class RedirectWithMessage extends Component {
  constructor(props) {
    super(props);
    console.log("sssprox", this.props);
    props.redir();

  }

  render() {
    console.log("isliss", this.props);
    return (
      <div>

        <br />
        <h5 className="text-center">Loading</h5>
      </div>
    )
  }
}

// const RightPanel = (props) => {
//   { props.children }
// }
// const LabelW = props => <span>{props.children}</span>


export default withRouter(UserDrivenRoute);



// var candidates = [];



// const loadCandidates = async (rentingContract) => {

//   const { getRental } = rentingContract.methods;
//   let arr = [];
//   for (let i = 1; i < 6; i++) {
//     let rental = await getRental(i).call();
//     console.log("hiii", rental);

//     //        jsonObject = JSON.parse(rental);

//     let count = 0;
//     for (var key in rental) {
//       if (rental.hasOwnProperty(key)) {
//         console.log(key + " -> " + rental[key]);
//         if (count === 1) {
//           arr.push(rental[key]);
//         }
//       }
//       count++;
//     }
//   }


//   for (let i = 0; i < arr.length; i++) {
//     /* We store the candidate names as bytes32 on the blockchain. We use the
//      * handy toUtf8 method to convert from bytes32 to string
//      */
//     console.log("hiii", arr[i]);
//     candidates[i] = arr[i];
//   }
// }




