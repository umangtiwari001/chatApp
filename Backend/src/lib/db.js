import mongoose from "mongoose"

export const connectDb=async()=>{
    try{
const conn=await mongoose.connect(process.env["MONGO_URI"]);
console.log(`Mongpdb connected:${conn.connection.host}`);
    }catch(error){
console.log("MongoDB connection error",error)
    };
    
};
