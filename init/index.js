const mongoose = require("mongoose"); 
const initdata = require("./data.js");
const Listing = require("../Model/listing.js")


main().then(() => {
   console.log("DBS is Connected"); 
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/DreamPlace')
}


const initDb = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner:"683549a78dcb3574c03065cf"}));
    await Listing.insertMany(initdata.data)
    console.log("Data was Intialized");
    
}

initDb();
