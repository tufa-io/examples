import AWS from 'aws-sdk'
export class InvoiceStorage {
    constructor( Bucket) {
        this.S3 = new AWS.S3();
        this.Bucket = Bucket;
    }

    async storeInvoice(name, invoice){
       return this.S3.putObject({
            Body: invoice,
            Bucket: this.Bucket,
            Key: name,
        }).promise();
    }
}