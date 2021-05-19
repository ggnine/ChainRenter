import io from 'socket.io-client';
import feathers from '@feathersjs/client';

const socket = io();  //use this for building and AWS
// const socket = io('http://localhost:3030'); //use this for local dev

//ALSO other dev changes:

const client = feathers();

const transacts = client.service('transacts');


client.configure(feathers.socketio(socket));
client.configure(feathers.authentication({
  storage: window.localStorage
}));


// transacts.on('patched', res => {
//   console.log("removeeeeed YYYY");
// }).catch(err => {
//   console.log("er3333rere", err)
// });

// console.log("hiiii from feathers");
// socket.on('welcome', function (data) {
//   // addMessage(data.message);
//   console.log("message asdffrom socket: ",data.message);

//   // Respond with a message including this clients' id sent from the server
//   socket.emit('i am client', { data: 'foo!', id: data.id });
// });
// socket.on('time', function (data) {
//   // addMessage(data.time);
//   console.log("message asfrom socket timeX: ",data.time);

// });
// socket.on('error', console.error.bind(console));
// socket.on('message', console.log.bind(console));



export default client;
