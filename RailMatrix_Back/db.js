import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();


const dbConnect = async () => {
    try {
        console.log(">>> DB URI being used:", process.env.MONGO_URI) // Debug
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB is Connected Successfully")

    } catch (error) {
        console.log("Failed To Connect MongoDB")
    }
}

export default dbConnect