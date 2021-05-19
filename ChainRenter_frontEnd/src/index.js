import React from 'react';
import ReactDOM from 'react-dom';
import Zapp from './reactStuff/app';
// import worker_script from './workerfile';

//obviously changed from app to zapp
ReactDOM.render(
  <Zapp />,
  document.getElementById('app')
);

// import worker_script from './workerfile';

// var myWorker = new Worker(worker_script);

// myWorker.onmessage = (m) => {
//     console.log("msg from worker: ", m.data);
// };
// myWorker.postMessage('im from main');