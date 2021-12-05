import needle  from 'needle';
const AWS = require('aws-sdk');
import pkg from 'pg';
const {Client} = pkg;

jest.setTimeout(20000)
describe('invoice service e2e ',function (){
    beforeAll(async () =>{
        await createDB();
    })
    it('call service api', async function (){
        await needle(
            'post',
            'http://localhost:8888/process/1',
            {
                total: 500
            },
            { json: true }
        );

        const s3 = new AWS.S3();
        const file = await s3.getObject({
            Bucket: process.env.INVOICE_BUCKET,
            Key: '1-david-knows.json',
        }).promise();

        expect(JSON.parse(file.Body.toString('utf-8'))).toEqual({ message: 'Mr david your total bill is 500$'})
    })
});

const createDB = async () => {
    const client = new Client();
    await client.connect();
    await client.query('CREATE TABLE customers ( id integer,name text, surname text)');
    await client.query('INSERT INTO customers VALUES (1, \'david\', \'knows\')');
    await client.end();
}