import AWS from 'aws-sdk'
export class LogStorage {
    constructor( Bucket) {
        this.S3 = new AWS.S3();
        this.Bucket = Bucket;
    }

    async store(name, log){
       return this.S3.putObject({
            Body: log,
            Bucket: this.Bucket,
            Key: `${name}.json`,
        }).promise();
    }
}