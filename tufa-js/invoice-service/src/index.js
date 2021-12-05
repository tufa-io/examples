import {CustomerData} from "./services/customer-data.js";
import {InvoiceStorage} from "./services/invoice-storage.js";
import express from 'express';
import pkg from 'pg';
const {Client} = pkg;
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json())

const client = new Client();
client.connect();
const customersService = new CustomerData(client);
const invoiceStorage = new InvoiceStorage( process.env.INVOICE_BUCKET);

app.post('/process/:id', async function (req, res) {
    try {
        const customer = await customersService.get(req.params.id);
        if(customer){
            const name = `${customer.id}-${customer.name}-${customer.surname}.json`;
            const invoice = JSON.stringify({message: `Mr ${customer.name} your total bill is ${req.body.total}$`});
            await invoiceStorage.storeInvoice(name,invoice);
        }
        res.send('{status:\'success\'}');
    } catch (err) {
        console.log('error',err.message);
        res.send('{status:\'error\'}');
    }
});

const server = app.listen(8888,()=> {
    console.log('starting invoice service');
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
    console.log('stopping invoice service');
    server.close(() => {
    })
    await client.end().catch();
}