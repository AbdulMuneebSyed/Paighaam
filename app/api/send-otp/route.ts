import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { phoneNumber } = req.body;

  try {
    const verification = await client.verify.services.create({
      friendlyName: "My Verify Service",
    });
    const serviceSid = verification.sid;

    await client.verify.services(serviceSid).verifications.create({
      to: phoneNumber,
      channel: "sms",
    });

    Response.json({ serviceSid });
  } catch (error) {
   Response.json({ error: (error as any).message });
  }
}
