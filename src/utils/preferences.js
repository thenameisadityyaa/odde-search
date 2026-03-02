const getPrefix = (profileId) => `odde_prefs_${profileId || "default"}`;

export function getPrefs(profileId) {
  try {
    const key = getPrefix(profileId);
    let data = localStorage.getItem(key);
    if (!data && (!profileId || profileId === "default")) {
      data = localStorage.getItem("odde_prefs_v1");
    }

    return data ? JSON.parse(data) : {
      region: "in",
      safe: true,
      perPage: 10,
      theme: "dark",
    };
  } catch {
    return {
      region: "in",
      safe: true,
      perPage: 10,
      theme: "dark",
    };
  }
}

export function savePrefs(prefs, profileId) {
  localStorage.setItem(getPrefix(profileId), JSON.stringify(prefs));
}