const KEY = "odde_saved_v1";

export function getSaved() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveItem(item) {
  const current = getSaved();
  const exists = current.some((x) => x.link === item.link);
  if (exists) return current;

  const updated = [{ ...item, savedAt: Date.now() }, ...current];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function removeSaved(link) {
  const updated = getSaved().filter((x) => x.link !== link);
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function isSaved(link) {
  return getSaved().some((x) => x.link === link);
}
