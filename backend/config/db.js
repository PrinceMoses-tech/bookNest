import mongoose from "mongoose";

const createDB = async()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
     console.error(`error: ${error}`);
  }
}

export default createDB;