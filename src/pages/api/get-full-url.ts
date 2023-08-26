import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { alias } = JSON.parse(req.body);

  const fullUrl = await prisma.link.findUnique({
    where: { alias },
  });

  res.status(200).json({ fullUrl });
};
