import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { phoneNumber } = req.body;

   Response.json({ error:"ho" });
}
