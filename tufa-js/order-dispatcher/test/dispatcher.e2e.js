const AWS = require('aws-sdk');
import pkg from 'pg';
const {Client} = pkg;
const sns = new AWS.SNS();
jest.setTimeout(60000);
const sqs = new AWS.SQS();
describe('order dispatcher service e2e ',function (){
    beforeAll(async () =>{
        await createDB();
        await subscribeSns();
    })
    it('test item in stock', async function (){
        await sns.publish({
            TopicArn: process.env.DISPATCHER_TOPIC,
            Message: JSON.stringify({id:1}),
        }).promise();
        await wait(2);
        const result = await receiveMessages();
        expect(result[0].Body).toEqual('item 1 is in stock');
    })

    it('test item not in stock', async function (){
        await sns.publish({
            TopicArn: process.env.DISPATCHER_TOPIC,
            Message: JSON.stringify({id: 5})
        }).promise();
        await wait(3);
        const result = await receiveMessages();
        expect(result[0].Body).toEqual('item 5 NOT in stock');
    })
});

const receiveMessages = async ()=> {
    const params = {
        QueueUrl: process.env.OUT_ITEMS_QUEUE_URL
    };
    return sqs.receiveMessage(params).promise().then(result => result?.Messages);
}



const createDB = async () => {
    const client = new Client();
    await client.connect();
    await client.query('CREATE TABLE items (id integer,name text, total integer)');
    await client.query('INSERT INTO items VALUES (1, \'CPU\', 10)');
    await client.query('INSERT INTO items VALUES (2, \'RAM\', 30)');
    await client.end();
}

const subscribeSns = async () => {
    const params = {
        TopicArn: process.env.DISPATCHER_TOPIC,
        Protocol: 'SQS',
        Endpoint: process.env.IN_ITEMS_QUEUE_ARN
    };
    await sns.subscribe(params).promise();
    await wait(3);
}

const wait = async (sec) => {
    return new Promise((resolve) => {
        setTimeout( () => resolve(), 1000*sec);
    })
}