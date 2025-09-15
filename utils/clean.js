// Utility function to clean/format an object before saving to Firestore

export function cleanForFirestore(obj) {
  const now = Date.now();
  const cleanedObj = {
    ...obj,
    created_at: now,
  };
  // one-liner for removing undefined values from an object
  return Object.fromEntries(
    Object.entries(cleanedObj).filter(([_, value]) => value !== undefined)
  );
}
