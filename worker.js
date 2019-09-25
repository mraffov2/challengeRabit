#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

require('./database');
const Json = require('./jsonSchema');

amqp.connect('amqp://localhost', function(error, connection) {
    connection.createChannel(function(error, channel) {
        var queue = 'task_queue';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for Json in %s. To exit press CTRL+C", queue);
        channel.consume(queue, async (msg) => {

            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());

            // Data is prepared to save DB
            message = msg.content.toString()
            body = JSON.parse(message)
            newJson = new Json({'body': body})
            await newJson.save();

            setTimeout(function() {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        });
    });
});