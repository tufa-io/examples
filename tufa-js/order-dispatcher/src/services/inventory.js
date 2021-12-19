export  class InventoryService {
    constructor(client) {
        this.client = client;
    }

    async get (itemId){
        return this.client.query('select * from items where id=$1',[itemId])
            .then(result => result.rows && result.rows.length > 0 ? result.rows[0]: null);
    }
}