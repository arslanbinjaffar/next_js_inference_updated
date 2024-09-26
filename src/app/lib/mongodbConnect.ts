import mongoose from "mongoose";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mongodb+srv://Abdulrehman:fg6acCoRW5BtQfHQ@cluster0.kajigux.mongodb.net/Model_Selection?retryWrites=true&w=majority&appName=Cluster0";

if (!DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
    };

    const promise = mongoose.connect(DATABASE_URL!, opts).then((mongoose) => {
      console.log("Database connection successful");
      return mongoose;
    });
    cachedConnection.promise = promise;
    cachedConnection.conn = await cachedConnection.promise;
  }
  return cachedConnection.conn;
}

export default connectDB;
