import React, { Component } from 'react';
// import Web3 from 'web3';
// import Web3Provider from 'react-web3-provider';

import Navbar from './components/Navbar';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import MyPage from './components/MyPage';
import Login from './components/Login';
import Messages from './components/Messages';
import MyTransactions from './components/MyTransactions';
import ListSomething from './components/ListSomething';
import ItemDetail from './components/ItemDetail';
import ItemEdit from './components/ItemEdit';
import TransactionDetails from './components/TransactionDetails';
import UserDrivenRoute from './components/transactionModules/UserDrivenRoute';
import GetVisitorUniqueId from './components/utilities/GetVisitorUniqueId';
import GetBorrowerAndListerIds from './components/utilities/GetBorrowerAndListerIds';





import client from '../feathers';

import './app.css';


class App extends Component {

  constructor(props) {
    super(props);
    console.log("constor on app.js");
    this.state = {
      visited: 0,
      firstTimeVisit: true,
      visitorId: null
    }
    this.incrementVisited = this.incrementVisited.bind(this);


  }

  incrementVisited() {
    console.log("incccc+++", this.state.visited);
    let poo = this.state.visited;
    let vs = poo + 1;
    console.log("incccc+++ vall", vs);

    let that = this;
    if (vs > 1) {
      console.log("aready visisted");
      this.setState({
        firstTimeVisit: false
      });
    }

    this.setState({
      visited: vs
    }, () => {
      console.log("visited # times: ", that.state.visited);
    });
  }


  async componentDidMount() {
    // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    // const accounts = await web3.eth.getAccounts();
    // console.log("web3",accounts[0]);
    // // this.setState({ account: accounts[0] });
    const crlistings = client.service('crlistings');
    const users = client.service('users');

    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => this.setState({ login: null }));

    // On successfull login
    client.on('authenticated', login => {
      console.log("authenticated: ", login);
      // Get all users and crlistings
      this.setState({ login });
      // Promise.all([
      //   crlistings.find(),
      //   users.find()
      // ])
      // .then(([messagePage, userPage]) => {
      //   // We want the latest crlistings but in the reversed order
      //   // const crlistings = messagePage.data.reverse();
      //   // const users = userPage.data;

      //   // Once both return, update the state
      //   this.setState({ login });
      //   // this.setState({ login, crlistings, users });

      // });
    });

    // On logout reset all all local state (which will then show the login screen)
    client.on('logout', () => this.setState({
      login: null,
      crlistings: null,
      users: null
    }));

    // Add new crlistings to the message list
    crlistings.on('created', message => {
      console.log("created XX from app.js");
      // this.setState({ crlistings: this.state.crlistings.concat(message) });
    });

    let visId = await GetVisitorUniqueId();
    // console.log("two ids",twoIds);
    console.log("uniqe id", visId);
    this.setState({
      visitorId: visId,
      // twoIds: twoIds
    });
  


  }


  render() {
    if (this.state.login === undefined) {
      return <main className="container text-center">
        <h1>Loading...</h1>
      </main>;
    } else if (this.state.login) {
      // return <Chat crlistings={this.state.crlistings} users={this.state.users} />
      console.log("lgoing info:", this.state.login);
      return (
        <BrowserRouter>
          <div className="App">
            <Navbar />

            {/* <Route exact path='/' render={(props) => <Home {...props}  incrementVisited={this.incrementVisited} firstTimeVisit={this.state.firstTimeVisit} />}  /> */}
            {/* working but no default props */}
            <Switch>
              <Route exact path='/' render={() => <Home goo="aa" incrementVisited={this.incrementVisited} firstTimeVisit={this.state.firstTimeVisit} />} />
              {/* <Route exact path='/' component={Home}/> */}

              {/* <Route path='/transactiondetails/:id' component={TransactionDetails} /> */}
              <UserDrivenRoute path='/transactiondetails/:id' component={TransactionDetails} visitorId={this.state.visitorId} />


              <Route path='/about' component={About} />
              <Route path='/mypage' component={MyPage} />
              <Route path='/listsomething' component={ListSomething} />
              <Route path='/transactions' component={MyTransactions} />
              <Route path='/messages' component={Messages} />
              <Route path='/item/:id' component={ItemDetail} />
              <Route path='/search/:que' render={() => <Home incrementVisited={this.incrementVisited} firstTimeVisit={this.false} />} />
              <Route path='/home' render={() => <Home incrementVisited={this.incrementVisited} firstTimeVisit={this.state.firstTimeVisit} />} />
              <Route path='/itemedit/:id' component={ItemEdit} />

            </Switch>

            {/* <Route path='/login' component={Login} /> */}

          </div>
        </BrowserRouter>

      )
    }

    return <Login />;


  }

}

export default App;