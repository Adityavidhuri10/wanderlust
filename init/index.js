const mongoose = require('mongoose');
const initData = require("./data.js");//meaning of one dot is current directory
const Listing = require('../models/listing.js');//meaning of two dots is parent directory
const { init } = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj)=>({...obj , owner : "68824a4dbec652e5a96484b6" }));
        await Listing.insertMany(initData.data);
       console.log('Database initialized with sample data');
}

initDB();