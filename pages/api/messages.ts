import { NextApiRequest, NextApiResponse } from "next";

import { channelName, pusher } from "../../utils/connection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { author, message } = req.body;

  const response = await pusher.trigger(channelName, "new-message", {
    author,
    message,
  });

  return res.status(201).json(response);
}
