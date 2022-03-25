import AWS from 'aws-sdk';
const sqs = new AWS.SQS();

export class InventoryMessage {
    async send(inventoryItem, requestedId) {
        const params  = {
            QueueUrl: process.env.OUT_ITEMS_QUEUE_URL || '',
            MessageBody: ''
        };
        if(inventoryItem){
            params.MessageBody =  JSON.stringify({id: inventoryItem.id, msg:`item ${inventoryItem.id} is in stock`});
        } else {
            params.MessageBody =  JSON.stringify({id: requestedId, msg:`item ${requestedId} NOT in stock`});
        }
        return sqs.sendMessage(params).promise();
    }
}