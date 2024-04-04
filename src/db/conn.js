const mongoose = require("mongoose");
const DB = process.env.DATABASE;

const connectDB = async () => {
try {
  mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  Date;
  console.log(`✅ Connected to database`);
} catch (error) {
  console.log(`❌ Error connecting to database: ${DB}`, error);
}
}

module.exports = connectDB;