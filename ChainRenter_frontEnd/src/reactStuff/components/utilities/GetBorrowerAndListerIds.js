
import React, { Component } from 'react';
import client from '../../../feathers';

const crlistings = client.service('crlistings');
const users = client.service('users');
const transacts = client.service('transacts');
const uploadService = client.service('uploads');


const GetBorrowerAndListerIds = async (transId) => {
    console.log("transss id:",transId);
    return new Promise(async function (resolve, reject) {
        await transacts.get(transId)
            .then(async (res) => {
                console.log("ccc item from tranacts found:", res);
                // return res.borroweruserid;
                //renteruserid
                // setIdS(res.borroweruserid);
                console.log("bor",res.borroweruserid);
                console.log("rent",res.renteruserid);

                let twoIds = {borroweruserid: res.borroweruserid, renteruserid: res.renteruserid, status: res.status};
                console.log("xnxnxnxn");
                console.log("zz 2 ids", twoIds);
                resolve(twoIds);
            })
            .catch(err => {
                console.log("eror in checking transacs", err);
                // return null;
                resolve('');
            })

        console.log("booorer id");
        resolve('');
    });
}
export default GetBorrowerAndListerIds;