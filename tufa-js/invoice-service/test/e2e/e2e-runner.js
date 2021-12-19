import  {Tufa} from 'tufa-js';
import concurrently from 'concurrently';
import {awsEnvs, pgEnvs } from '../utils.js';
const tufa  = new Tufa(
    {
        request: {
            resources: [
                {
                    "id": "customersDb",
                    "type": "PostgreSQL"
                },
                {
                    "id": "invoiceBucket",
                    "type": "S3BucketFolder"
                }
            ],
        }
    });

(async function(){
    const  response = await tufa.connect();
    concurrently([
        { command: 'node src/index.js ', name: 'run', env: { ...awsEnvs(response),
                ...pgEnvs(response.resources.customersDb),
                INVOICE_BUCKET: response.resources.invoiceBucket.path   } },
        { command: 'jest --config=jest.e2e.config.json --detectOpenHandles', name: 'tests', env: { ...awsEnvs(response),
                ...pgEnvs(response.resources.customersDb),
                INVOICE_BUCKET: response.resources.invoiceBucket.path  } },
    ], {
        prefix: '',
        killOthers: ['failure', 'success']
    }).then(() => {
        tufa.end();
    } , () => {
        tufa.end();
    });
})()





