import { v4 as uuidv4 } from "uuid";

let messages: { _id: string; author: string; message: string }[] = [];

export const connection = () => {
  const findAll = () => messages;

  const create = (msg: { author: string; message: string }) => {
    messages.push({ ...msg, _id: uuidv4() });
  };

  const deleteMany = () => {
    messages = [];
  };
  return { findAll, create, deleteMany };
};
