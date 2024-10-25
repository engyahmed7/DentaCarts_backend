import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export { connectToDB };

const dbUrl = process.env.DB_URL;
async function connectToDB() {
  console.log(`Connecting to Database`);
  console.log(`Database URL: ${dbUrl}`);
  await mongoose.connect(dbUrl);
  console.log(`Connected to Database`);
}
