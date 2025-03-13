import { MongoClient } from 'mongodb';

    function dataService(collectionName) {
        const localUri = "mongodb://localhost:27017/";
        const client = new MongoClient(localUri, { useNewUrlParser: true, useUnifiedTopology: true });
        const projection = { _id: 0, name: 1, breed: 1, legs: 1, eyes: 1, sound: 1, user:1,createTime:1,updateTime:1,
            description: 1, stock: 1, price: 1
        };
        return {
            delete: async (name = null) => {
            },
            add: async (list) => {
            },
            update: async (record) => {
            },        
            query: async (name) => {
            },
            load: async ({ page = 1, perPage = 5 }) => {
                try {
                    await client.connect();
    
                    const database = client.db('inft2202');
                    const collection = database.collection(collectionName);
    
                    const count = await collection.countDocuments();
                    const pages = Math.ceil(count / perPage);
    
                    const pagination = {
                        page: parseInt(page),
                        perPage: parseInt(perPage),
                        count,
                        pages
                    };
                    // Define the query, projection, and options
                    const query = {}; // Example query to find documents where age is greater than 25                
                    const options = { sort: {}, skip: (pagination.page-1) * pagination.perPage, limit: pagination.perPage }; // Options for pagination: skip 0 documents and limit to 5
    
                    // Retrieve the records
                    const cursor = collection.find(query, { projection, ...options });
    
                    return { pagination, records: await cursor.toArray() };
                } finally {
                    await client.close();
                }
            }
        }
    }
    //export default dataService;
    let service = dataService('animal');
    let ret = await service.load({page: 1, perPage: 15});
    console.log(ret);
                