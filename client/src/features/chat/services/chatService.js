export const resolvePeerUser = async (githubUsername, token) => {
  if (!githubUsername || !token) return null;
  
  const res = await fetch(
    `/api/users/lookup?githubUsername=${encodeURIComponent(githubUsername)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  const data = await res.json();
  if (data.success && data.user) {
    return data.user;
  }
  
  // Virtual user if not found on GitMatch
  return {
    uid: `gh_${githubUsername}`,
    displayName: githubUsername,
    isVirtual: true,
  };
};

export const fetchMessageHistory = async (chatId, token) => {
  if (!chatId || !token) return [];
  
  const res = await fetch(`/api/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  const data = await res.json();
  if (data.success) {
    return data.messages;
  }
  return [];
};
