import  {Tufa} from 'tufa-js';
import  {Client} from 'pg';
import {CustomerData} from '../../src/services/customer-data';

 jest.setTimeout(60000)
describe('testing client service ',function (){
    let client;
    const tufa  = new Tufa(
        {
            request: {
                resources: [
                    {
                        "id": "customersDb",
                        "type": "PostgreSQL"
                    },
                ],
            }
        });
    beforeAll(async () => {
        try {
            const  response = await tufa.connect();
            client = new Client(response.resources.customersDb);
            await client.connect();
            await client.query('CREATE TABLE customers ( id integer,name text, surname text)');
            await client.query('INSERT INTO customers VALUES (1, \'david\', \'knows\')');

        } catch (err) {
            console.log(err.message);
        }

    });

    afterAll(async () => {
        await client.end();
        await tufa.end();
    });

    it('test customer exists', async function (){
        const service = new CustomerData(client);
        const customer = await service.get(1);
        expect(customer.name).toEqual('david')
    })

});