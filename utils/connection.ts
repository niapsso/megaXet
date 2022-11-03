import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    "Mongo db URI must be provided in a .env file, with MONGODB_URI as key"
  );
}

export const connection = async () => {
  const conn = await mongoose
    .connect(MONGODB_URI, { ssl: true })
    .catch((err) => console.error("Error during database initialization", err));

  const MessageSchema = new mongoose.Schema({
    author: String,
    message: String,
  });

  const Message =
    mongoose.models.Message || mongoose.model("Message", MessageSchema);

  return { conn, Message };
};
