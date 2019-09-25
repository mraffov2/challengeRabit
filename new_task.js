const { Router } = require('express');
const router = Router();
const timeAgo = require('node-time-ago');

let amqp = require('amqplib/callback_api');
require('./database');
const Json = require('./jsonSchema');


router.get('/service/json/:json', async (req, res) => {

    try {
        const messageParams = req.params.json
        console.log(req.params).json

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

router.post('/service/json', async (req, res) => {
    try {
        if(!req.body.body){
            res.status(404).json({'message': 'The Json is required'})
        }
        body = req.body.body
        BODY = JSON.parse(body)
        let jsonReceive = req.body.body

        // Data is prepared to save DB
         let newJson = new Json({ 'body': BODY })
          await newJson.save();

        amqp.connect('amqp://localhost', async (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel( (error1, channel) => {
                if (error1) {
                    throw error1;
                }
                let queue = 'task_queue';
                let msg = process.argv.slice(2).join(' ') || jsonReceive;
                
                channel.assertQueue(queue, {
                    durable: true
                });
                channel.sendToQueue(queue, Buffer.from(msg), {
                    persistent: true
                });
                console.log(" [x] Sent '%s'", msg);
                
              
            });
        
        });

        limitCollection = 50
        Body = await Json.find().limit(limitCollection)
        
        
        URL = []
        USER = []
        USER.push(BODY.user_id)
        countUri = 1
        Body.forEach(element => {
            if (!URL.includes(element.body.uri)){
                URL.push(element.body.uri)
                countUri = + 1
            }

            if (element.body.user_id !== BODY.user_id) {
                USER.push(element.body.user_id)
            }

        });

        time = timeAgo(BODY.access_time)
        
        lastVisit = URL.length
        lentghtObject = Body.length

     if (Body) {
            res.status(201).json({
                'last URI visited ': URL,
                'curious fact' : `${USER.length} user(s) has visited the last ${lastVisit} Uri, the last ${Body.length} objects received `,
                'how lon time age uri the last object': `${time}`,
                'Object': Body, 
        })

        }else {
            res.status(201).json({'message': 'User no found'})
        }
        
    }catch(e){
        res.json({'error': e.message})
    }
});

module.exports = router;