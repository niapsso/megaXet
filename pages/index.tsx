import type { Socket } from "socket.io-client";

import { io } from "socket.io-client";
import { TextField, Button } from "@mui/material";
import { useState, useEffect, FormEvent } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";

let socket: Socket;

export type message = {
  author: string;
  message: string;
  _id: string;
};

export default function Home() {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<message[]>([]);
  const [fieldErrors, setFieldErrors] = useState({
    author: false,
    message: false,
  });

  const socketInitializer = async () => {
    await fetch("/api/socket", { method: "POST" });

    console.log(process.env.nextEnv);

    socket = io("https://e-o-xet.herokuapp.com");

    socket.on("connect", () => {});

    socket.on("updateMessages", (msgs: message[]) => {
      getMessages();
    });
  };

  const deleteAll = async () =>
    await fetch("/api/socket", { method: "DELETE" }).then(() => getMessages());

  const getMessages = async () =>
    await fetch("/api/socket")
      .then((res) => res.json())
      .then(setMessages);

  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    const listContainer = document.querySelector("ul");

    if (listContainer) {
      listContainer.scrollTop = listContainer.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFieldErrors({ author: !author, message: !message });

    if (author && message) {
      socket.emit("newMessage", { author, message });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>é o xet</title>
        <meta name="description" content="mega xet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <TextField
          placeholder="Type your username here"
          label="username"
          variant="filled"
          fullWidth
          error={fieldErrors.author}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <ul>
          {messages.map(({ _id, author, message }) => (
            <li key={_id}>
              <span>
                <b>{author}: </b>
                {message}
              </span>
            </li>
          ))}
        </ul>

        <form onSubmit={onSubmit}>
          <TextField
            placeholder="Type your message here"
            label="message"
            variant="outlined"
            fullWidth
            error={fieldErrors.message}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" variant="contained" color="secondary">
            send
          </Button>
        </form>
      </main>
      <div className={styles.clearButton}>
        <Button variant="outlined" onClick={() => deleteAll()}>
          clear
        </Button>
      </div>
    </div>
  );
}
