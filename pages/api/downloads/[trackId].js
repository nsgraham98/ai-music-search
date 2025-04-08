import path from 'path';
import fs from 'fs';
import tracksData from '@/tracks.json'; // or wherever you store it

export default function handler(req, res) {
  const { trackId } = req.query;

  // Ensure it's an integer (because your track IDs are numbers in JSON)
  const id = parseInt(trackId, 10);

  // Find the track with matching ID
  const track = tracksData.tracks.find(t => t.id === id);

  if (!track) {
    return res.status(404).json({ error: 'Track not found' });
  }

  // Normalize path and serve the file
  const filePath = path.resolve('./public', track.path.replace(/^assets\//, ''));

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Audio file not found on server' });
  }

  const fileStream = fs.createReadStream(filePath);
  res.setHeader('Content-Type', 'audio/mpeg');
  fileStream.pipe(res);
}
