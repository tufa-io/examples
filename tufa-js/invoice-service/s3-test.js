const AWS = require('aws-sdk');
const {Client} = require('pg')
const {Tufa} = require('tufa-js')

const tufa  = new Tufa(
    {
        request: {
            resources: [
                {
                    "id": "s3",
                    "type": "S3BucketFolder"
                },
                {
                    "id": "pg1",
                    "type": "PostgreSQL"
                }
            ],
        }
    });

(async function test(){
    try {
        const  response = await tufa.connect();

        //PostgreSql - create table
        const client = new Client(response.resources.pg1);
        await client.connect();
        const res = await client.query('create table xxx (x1 text)')
        await client.end()

        // S3 - save file
        const s3 = new AWS.S3(response.credentials);
        await s3.putObject({
            Body: `Angeliques test`,
            Bucket: response.resources.s3.path,
            Key: 'test-folder/hellowoffffrld.txt',
        }).promise();

        const file = await s3.getObject({
            Bucket: response.resources.s3.path,
            Key: 'test-folder/hellowoffffrld.txt',
        }).promise();

        console.log(file.Body.toString('utf-8'));

        await tufa.end();
    } catch (error) {
        console.log(error.message)
       await tufa.end();
    }
})()








