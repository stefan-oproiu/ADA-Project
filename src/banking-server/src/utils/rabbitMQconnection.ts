import { Transaction } from "../models/transactions";
import {Promise} from 'bluebird';
import { User } from "../models/users";
import UserTable from "../database/users";
 
const amqp = require('amqplib')
const config = require('../config');
const rabbitMQSettings = {
    process: 'amqp',
    hostname: config.RABBITMQ_HOST,
    port: config.RABBITMQ_PORT,
    username: config.RABBITMQ_USERNAME,
    password: config.RABBITMQ_PASSWORD,
    vhost:'/',
    authMecanism: ['PLAIN','AMQPLAIN','EXTERNAL']
}

export function rabbitMQConnectAndPublishTransactions(transaction: Transaction) {
    const queue = 'transactions'
    return Promise.resolve()
    .then(() => {
        return amqp.connect(rabbitMQSettings);
    })
    .then((result:any)=> {
       return result.createChannel();
    })
    .tap((result:any) => {
        
        return result.assertQueue(queue)
    })
    .then((result:any) => {
        result.sendToQueue(queue, Buffer.from(JSON.stringify(transaction)))
        setTimeout(()=> {
            result.close()
        }, 1000)
    })
    .catch((err:any) =>{
        console.log(err)
    })
} 

export function rabbitMQConnectAndConsumeUsers() {
    const queue = 'users'
    return Promise.resolve()
    .then(() => {
        return amqp.connect(rabbitMQSettings);
    })
    .then((result:any)=> {
       return result.createChannel();
    })
    .tap((result:any) => {
        
        return result.assertQueue(queue)
    })
    .then((result:any) => {
        result.consume(queue,(users:User) =>
        {
            let userTable = new UserTable(users)
            userTable.save((err:any) =>{
                if(err) {{
                    console.log("Error by saving RabbitMqUser")
                }}
                else {
                    console.log("Succeded by savint RabbitMqUser")
                }
            })
        })
    })
    .catch((err:any) =>{
        console.log(err)
    })
} 