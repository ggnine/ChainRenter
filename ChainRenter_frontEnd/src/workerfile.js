// import Web3 from 'web3';

// const workercode = () => {

//     self.onmessage = function (e) {
//         var args = e.data.args;
//         console.log('arrgs',args);
//         const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

//         console.log("worker data e", e);

//         console.log("worker data e.data", e.data);
//         var receipt = web3.eth.getTransactionReceipt('0x3da6fa1351d0420b17aee05bbacdda06846f75979790bcde8ec85387d68df394')
//             .then(console.log);
//         // getTransactionReceiptMined('0x3da6fa1351d0420b17aee05bbacdda06846f75979790bcde8ec85387d68df394',1000);
//         var counter = 0;
//         var val = false;
//         while (val !== true) {
//             console.log("anotehr time out");
//             counter++;
//             setTimeout(function () { //Start the timer
//                 var receipt = web3.eth.getTransactionReceipt('0x3da6fa1351d0420b17aee05bbacdda06846f75979790bcde8ec85387d68df394')
//                     .then(console.log)

//             }.bind(this), 5000);
//             if (counter > 10) {
//                 val = true;
//             }
//         }

//         //do a loop to check every 5 seconds for completeion of has
//         console.log('Message received from main script');
//         var workerResult = 'Received from main: ' + (e.data);
//         console.log('Posting message back to main script');
//         self.postMessage(workerResult);
//     }
// };

// let code = workercode.toString();
// code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

// const blob = new Blob([code], { type: "application/javascript" });
// const worker_script = URL.createObjectURL(blob);

// module.exports = worker_script;



// // function getTransactionReceiptMined(txHash, interval) {
// //     const self = this;
// //     const transactionReceiptAsync = function(resolve, reject) {
// //         self.getTransactionReceipt(txHash, (error, receipt) => {
// //             if (error) {
// //                 reject(error);
// //             } else if (receipt == null) {
// //                 console.log("anotehr time out");
// //                 setTimeout(
// //                     () => transactionReceiptAsync(resolve, reject),
// //                     interval ? interval : 500);
// //             } else {
// //                 resolve(receipt);
// //             }
// //         });
// //     };

// //     if (Array.isArray(txHash)) {
// //         return Promise.all(txHash.map(
// //             oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
// //     } else if (typeof txHash === "string") {
// //         return new Promise(transactionReceiptAsync);
// //     } else {
// //         throw new Error("Invalid Type: " + txHash);
// //     }
// // };