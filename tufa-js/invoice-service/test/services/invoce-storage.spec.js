import  {Tufa} from 'tufa-js';
import {InvoiceStorage} from '../../src/services/invoice-storage';
import {awsEnvs, setEnvs } from '../utils';
const AWS = require('aws-sdk');

 jest.setTimeout(60000)
describe('testing invoice storage service ',function (){
    const tufa  = new Tufa(
        {
            request: {
                resources: [
                    {
                        "id": "invoiceBucket",
                        "type": "S3BucketFolder"
                    },
                ],
            }
        });
    let tufaRuntime;
    beforeAll(async () => {
        try {
            tufaRuntime = await tufa.connect();
            setEnvs(awsEnvs(tufaRuntime.credentials));
        } catch (err) {
            console.log(err.message);
        }

    });

    afterAll(async () => {
        await tufa.end();
    });

    it('test storage on S3', async function (){
        const service = new InvoiceStorage(tufaRuntime.resources.invoiceBucket.path);
        await service.storeInvoice('david-knows.json', JSON.stringify({'name': 'david knows', total: 100, message: 'your total bill is 100$'}));

        const s3 = new AWS.S3();

        const file = await s3.getObject({
            Bucket: tufaRuntime.resources.invoiceBucket.path,
            Key: 'david-knows.json',
        }).promise();

        expect(JSON.parse(file.Body.toString('utf-8'))).toEqual({'name': 'david knows', total: 100, message: 'your total bill is 100$'})
    })

});