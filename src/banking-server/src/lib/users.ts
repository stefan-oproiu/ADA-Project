import { Request, Response } from 'express';
import TransactionTable from '../database/transactions';
import UserTable from "../database/users";
import { Transaction } from '../models/transactions';
import { User } from '../models/users';
import jwt_decode from 'jwt-decode'
import * as sendToRabbitMQ from '../utils/sendToRabbitMQ'
var _ = require('lodash');
const randomIdTransaction = require('../utils/generateRandomIdTransaction');

//- GET - //api/banking/users/full # return all users with all transactions
export let allUsersFull = (req: Request, res: Response) => {
    let users = UserTable.find({}, '-_id -__v', null, function (err: any, users: any) {
        if (err) {
            res.send(err);
        } else {
            res.send(users);
        }
    })
}

//- GET - /api/banking/users # return partial informations about the users
export let allUsers = (req: Request, res: Response) => {
    let users = UserTable.find({}, '-_id -balance -__v -transactions', null, function (err: any, users: any) {
        if (err) {
            res.send(err);
        } else {
            res.send(users);
        }
    })
}

//- POST /api/banking/users/send # create an endpoint for sending money from one user to another

export function sendMoneyFromPayloadUser(req: any, res: any, next: any) {
    let user = UserTable.find({ id: req.body.targetId }, function (err: any, requestUser: any) {
        if (err) {
              res.status(404).json({ mesage: "Invalid targetFormat", err:err })
        }
        else {
            if (requestUser == false) {
                res.status(404).json({ mesage: "User from request doesn't exist" })
            }
            else {
                let payloadData: any = jwt_decode(req.headers['authorization'].split(' ')[1])
                    if (payloadData == null) {
                        res.status(404).json({message: "Invalid payload secret", err:err })
                    }
                    else {
                        let UserFind = UserTable.find({
                            id: "" + payloadData.sub,
                            fullName: payloadData.name
                        }, function (err: any, sender: any) {
                            if (err) {
                                res.status(404).json({message: "Problem with loading the payload user", err:err })
                            }
                            else {
                                if (sender == false) {
                                    const newUser: User = {
                                        id: "" + payloadData.sub,
                                        fullName: payloadData.name,
                                        balance: 1000,
                                        transactions: []
                                    }
                                    let userTable = new UserTable(newUser)
                                    userTable.save((err: any) => {
                                        if (err) {
                                            res.status(404).json({message: "User from payload couldn't be saved", err:err});
                                        } else {
                                            if (req.body.amount < newUser.balance) {
                                                const transaction: Transaction = {
                                                    id: "" + randomIdTransaction.getRandomInt(1,10000),
                                                    sourceId:  "" + payloadData.sub,
                                                    targetId: ""+requestUser[0].id,
                                                    date: new Date(),
                                                    amount: req.body.amount,
                                                    sourceFullName: newUser.fullName,
                                                    targetFullName: requestUser[0].fullName
                                                }
                                                 let transactionTable = new TransactionTable(transaction)
                                                 transactionTable.save((err:any)=> {
                                                    if (err) {
                                                        res.status(404).json({message: "Transaction couldn't be saved", err:err});
                                                    } else {
                                                        sendToRabbitMQ.sendData(transaction)
                                                        let newRecieverBalance =  requestUser[0].balance + transaction.amount;
                                                        let receiverTable = UserTable.findOneAndUpdate({id: req.body.targetId}, {$set: { balance:newRecieverBalance }, $push:{ transactions: transactionTable.id }}, {new: true}, (err, doc) => {
                                                            if (err) {
                                                                res.status(400).json({message:"Receiver couldn't be updated", err:err});
                                                            }
                                                            else {   
                                                                let newSenderBalance =  newUser.balance - transaction.amount;
                                                                let senderTable = UserTable.findOneAndUpdate({id: newUser.id}, {$set: { balance:newSenderBalance }, $push:{ transactions: transactionTable.id }}, {new: true}, (err, doc) => {
                                                                    if (err) {
                                                                        res.status(300).json({message:"Sender couldn't be updated", err:err});
                                                                    }
                                                                    else {                                                    
                                                                        res.status(200).json({message: "Transaction succed"})
                                                                    }
                                                                })
                                                            }
                                                        }) 
                                                    }
                                                 })
                                            }
                                            else {
                                                res.status(300).json({message: "Not enough money in the bank account"})
                                            }
                                        }
                                    })
                                }
                                else {                                    
                                    if(req.body.amount < sender[0].balance) {
                                        const transaction: Transaction = {
                                            id: "" + randomIdTransaction.getRandomInt(1,10000),
                                            sourceId:  "" + payloadData.sub,
                                            targetId: ""+ requestUser[0].id,
                                            date: new Date(),
                                            amount: req.body.amount,
                                            sourceFullName: sender[0].fullName,
                                            targetFullName: requestUser[0].fullName                                           
                                        }
                                        sendToRabbitMQ.sendData(transaction)
                                        let transactionTable = new TransactionTable(transaction)
                                        transactionTable.save((err:any) => {
                                            if(err) {
                                                res.status(404).json({message:"Transaction couldn't be saved", err:err});
                                            }
                                            else {
                                                let newRecieverBalance =  requestUser[0].balance + transaction.amount
                                                let receiver = UserTable.findOneAndUpdate({id: req.body.targetId},  {$set: { balance:newRecieverBalance }, $push:{ transactions: transactionTable.id }}, {new: true}, (err, doc) => {
                                                    if (err) {
                                                       res.status(300).json({message: "error on receiver", err:err})
                                                    }
                                                    else {
                                                        let newSenderBalance =  sender[0].balance - transaction.amount;
                                                        let senderTable = UserTable.findOneAndUpdate({id: sender[0].id}, {$set: { balance:newSenderBalance }, $push:{ transactions: transactionTable.id }}, {new: true}, (err, doc) => {
                                                            if (err) {
                                                                res.status(300).json({message: "error on sender", err:err})
                                                            }
                                                            else {
                                                                res.status(200).json({message: "Transaction succed"})
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        })
                                    }
                                    else {
                                        res.status(300).json({message: "Not enough money in the bank account"})
                                    }
                                }
                            }
                        })
                    }               
                }
            }
        })
    }    

 
//- POST /api/banking/users/fill # create an endpoint for sending money from SYSTEM to any user

export function sendMoneyFromSystem(req: any, res: any, next: any) {
    let user = UserTable.find({ id: req.body.targetId }, function (err: any, requestUser: any) {
        if (err) {
              res.status(404).json({ mesage: "Invalid targetFormat", err:err })
        }
        else {
            const systemUser: User = {
                id: "SYSTEM",
                fullName: "SYSTEM",
                balance: 1000,
                transactions: []
            }
            const transaction: Transaction = {
                id: "" + randomIdTransaction.getRandomInt(1,10000),
                sourceId:  "" + systemUser.id,
                targetId: ""+requestUser[0].id,
                date: new Date(),
                amount: req.body.amount,
                sourceFullName: systemUser.fullName,
                targetFullName: requestUser[0].fullName
            }
            sendToRabbitMQ.sendData(transaction)
            let transactionTable = new TransactionTable(transaction)
            transactionTable.save((err:any) => {
            if(err) {
                res.status(404).json({message:"Transaction couldn't be saved", err:err});
            }
            else {
                let newRecieverBalance =  requestUser[0].balance + transaction.amount
                let receiver = UserTable.findOneAndUpdate({id: req.body.targetId},  {$set: { balance:newRecieverBalance }, $push:{ transactions: transactionTable.id }}, {new: true}, (err, doc) => {
                    if (err) {
                        res.status(300).json({message: "error on receiver", err:err})
                        }
                        else {
                        res.status(200).json({message: "Transaction succed"})
                        }
                })      
            }
        })
    }
})
}
 