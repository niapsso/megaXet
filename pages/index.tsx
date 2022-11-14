import Pusher from "pusher-js";
import Head from "next/head";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { useState, useEffect, FormEvent } from "react";

import styles from "../styles/Home.module.scss";
import { channelName } from "../utils/connection";

type message = {
  author: string;
  message: string;
};

export default function Home() {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<message[]>([]);
  const [fieldErrors, setFieldErrors] = useState({
    author: false,
    message: false,
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFieldErrors({ author: !author, message: !message });

    if (author && message) {
      await axios.post("/api/messages/", { author, message });
    }
  };

  useEffect(() => {
    const listContainer = document.querySelector("ul");

    if (listContainer) {
      listContainer.scrollTop = listContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_APP_KEY as string, {
      cluster: "sa1",
    });

    const channel = pusher.subscribe(channelName);

    channel.bind("new-message", (data: message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, []);

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
          {messages.map(({ author, message }, idx) => (
            <li key={idx}>
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
    </div>
  );
}
