import { getSessionData } from "@/utils/session";

export default async function GET(
  req,
  res
) {
  const sessionData = await getSessionData(req.headers.cookie);
  res.status(200).json(sessionData);
}
