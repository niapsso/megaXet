import Pusher from "pusher";

const appId = process.env.app_id as string;
const key = process.env.NEXT_PUBLIC_APP_KEY as string;
const secret = process.env.secret as string;
const cluster = process.env.cluster as string;

export const channelName = "mega-xet-brasil";

export const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});
