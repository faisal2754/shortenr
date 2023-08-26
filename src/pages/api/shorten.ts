import { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.body;

  const shortUrl = await shortenUrl(url);

  res.status(200).json({ url, shortUrl });
};

const shortenUrl = async (url: string) => {
  const baseUrl = env.BASE_URL;
  const alias = nanoid(6);

  const urlExists = await prisma.link.findFirst({
    where: {
      OR: [{ url }, { alias }],
    },
  });

  if (urlExists) return baseUrl + "/" + urlExists.alias;

  const shortUrl = baseUrl + "/" + alias;
  await prisma.link.create({
    data: {
      url,
      alias,
    },
  });

  return shortUrl;
};
