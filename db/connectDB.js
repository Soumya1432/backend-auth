import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Function to connect to the MongoDB database
export const connectDB = async () => {
  try {
    // Await the connection to MongoDB using the connection string from the environment variables
    const conn = await mongoose.connect(process.env.MONGO_URL);
    // Log a success message if the connection is successful
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    // Log an error message and exit the process with failure status
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
