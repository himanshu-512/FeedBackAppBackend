const BASE_URL = "http://10.193.138.156:3000";

export async function getChannels() {
  const res = await fetch(`${BASE_URL}/channels/all`);
  return res.json();
}

export async function getMessages(channelId) {
  const res = await fetch(`${BASE_URL}/messages/${channelId}`);
  return res.json();
}

export async function sendMessage(data) {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getAnonymousUser() {
  const res = await fetch(`${BASE_URL}/anonymous`);
  return res.json();
}
