import { deleteSessionData } from "@/utils/session";

export default async function handler(req, res) {
  try {
    if (req.method !== "DELETE") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    await deleteSessionData(req.headers.cookie);
    res.status(200).json({ message: "Signed out!" });
  } catch (e) {
    res.status(422).json({ error: e.message });
  }
}
