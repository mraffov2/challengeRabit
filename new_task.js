const { Router } = require('express');
const router = Router();

let amqp = require('amqplib/callback_api');
require('./database');
const Json = require('./jsonSchema');


router.get('/service/json/:json', async (req, res) => {

    try {
        const messageParams = req.params.json

        amqp.connect('amqp://localhost', async (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel( (error1, channel) => {
                if (error1) {
                    throw error1;
                }
                let queue = 'task_queue';
                let msg = process.argv.slice(2).join(' ') || messageParams;
                
                channel.assertQueue(queue, {
                    durable: true
                });
                channel.sendToQueue(queue, Buffer.from(msg), {
                    persistent: true
                });
                console.log(" [x] Sent '%s'", msg);
                
              
            });
            
            let prueba = JSON.parse(messageParams) 
            datosJson = await Json.find({'body.id': prueba.id})
            

            res.json({datos: datosJson});
            
        });
       
        
    } catch(e){
        res.status(500).json({'message': 'Internal server error'})
    } 
});

module.exports = router;