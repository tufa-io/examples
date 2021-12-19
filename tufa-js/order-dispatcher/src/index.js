import { Consumer } from 'sqs-consumer';
import pkg from 'pg';
import {InventoryService} from './services/inventory.js';
import {InventoryMessage} from './services/inventory-message.js';
const {Client} = pkg;
const client = new Client();



const inventoryService =  new InventoryService(client);
const messageService = new InventoryMessage();
const consumer = Consumer.create({
    queueUrl: process.env.IN_ITEMS_QUEUE_URL,
    handleMessage: async (message) => {
        try {
            const msg = JSON.parse(JSON.parse(message.Body).Message);
            const data = await inventoryService.get(msg.id);
            await messageService.send(data, msg.id);
        } catch (err) {
            console.log(`failed to process message:  ${err.message}`);
        }
    }

});


consumer.on('error', (err) => {
    console.error(err.message);
});

consumer.on('processing_error', (err) => {
    console.error(err.message);
});


let running = true;
process.on('SIGTERM', async () => {
    if(running){
        await end();
    }
})

process.on( 'exit', async function() {
    if(running){
        await end();
    }
})

const end = async () => {
    running = false;
    console.log('stopping dispatcher service');
    consumer.stop();
    await client.end().catch();
}

client.connect();
consumer.start();
console.log('dispatcher service started');