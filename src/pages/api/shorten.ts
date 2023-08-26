import { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";

import { env } from "@/env.mjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.body;
  const baseUrl = env.BASE_URL;

  const shortUrl = baseUrl + "/" + nanoid(7);
  console.log(shortUrl);

  res.status(200).json({ url, shortUrl });
};
