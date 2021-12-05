export  class CustomerData {
    constructor(client) {
        this.client = client;
    }

    async get (customerId){
        return this.client.query('select * from customers where id=$1',[customerId])
            .then(result => result.rows && result.rows.length > 0 ? result.rows[0]: null);
    }
}