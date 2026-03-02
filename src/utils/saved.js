const getPrefix = (profileId) => `odde_saved_${profileId || "default"}`;

export function getSaved(profileId) {
  try {
    const key = getPrefix(profileId);
    // Migration: if default and nothing found, try old key
    let data = localStorage.getItem(key);
    if (!data && (!profileId || profileId === "default")) {
      data = localStorage.getItem("odde_saved_v1");
    }
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

export function saveItem(item, profileId) {
  const current = getSaved(profileId);
  const exists = current.some((x) => x.link === item.link);
  if (exists) return current;

  const updated = [{ ...item, savedAt: Date.now() }, ...current];
  localStorage.setItem(getPrefix(profileId), JSON.stringify(updated));
  return updated;
}

export function removeSaved(link, profileId) {
  const updated = getSaved(profileId).filter((x) => x.link !== link);
  localStorage.setItem(getPrefix(profileId), JSON.stringify(updated));
  return updated;
}

export function isSaved(link, profileId) {
  return getSaved(profileId).some((x) => x.link === link);
}
