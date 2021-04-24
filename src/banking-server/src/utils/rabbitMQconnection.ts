import { Transaction } from "../models/transactions";
import {Promise} from 'bluebird';
 
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

export function rabbitMQConnect(transaction: Transaction) {
    const queue = 'transactions'
    return Promise.resolve()
    .then(() => {
        return amqp.connect(rabbitMQSettings);
    })
    .then((result)=> {
       return result.createChannel();
    })
    .tap((result) => {
        
        return result.assertQueue(queue)
    })
    .then((result) => {
        result.sendToQueue(queue, Buffer.from(JSON.stringify(transaction)))
    })
    .catch(err =>{
        console.log(err)
    })
} 