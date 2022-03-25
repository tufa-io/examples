import { Consumer } from 'sqs-consumer';
import {LogStorage} from './services/log-storage.js';

const storage = new LogStorage(process.env.S3_BUCKET);
const consumer = Consumer.create({

    queueUrl: process.env.OUT_ITEMS_QUEUE_URL,
    handleMessage: async (message) => {
        try {
            const body = JSON.parse(message.Body);
            await storage.store(body.id,message.Body);

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
    console.log('S3 service end');
    consumer.stop();
    await client.end().catch();
}

consumer.start();
console.log('S3 service started');