import React, { Component } from 'react';
import client from '../../../feathers';

const crlistings = client.service('crlistings');
const users = client.service('users');
const transacts = client.service('transacts');
const uploadService = client.service('uploads');


const GetVisitorUniqueId = async (props) => {



    return new Promise(async function (resolve, reject) {
        //get the borrower -- current user's credentials - NOT NEEDED
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
                // console.log('Userzzz', client.get('user'));
                // console.log('id', client.get('user')._id);
                resolve(client.get('user')._id);

            })
            .catch(function (error) {
                console.error('Error authenticating!', error);
                resolve(null);
            });
            resolve(null);
    });
}
export default GetVisitorUniqueId;