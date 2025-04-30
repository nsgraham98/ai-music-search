export function cleanForFirestore(obj) {
  const now = Date.now();
  const cleanedObj = {
    ...obj,
    created_at: now,
  };
  return Object.fromEntries(
    Object.entries(cleanedObj).filter(([_, value]) => value !== undefined)
  );
}
