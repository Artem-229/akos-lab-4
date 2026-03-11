const API_URL = "http://localhost:8080";

export async function getContacts() {
  const response = await fetch(`${API_URL}/contacts`);
  return response.json();
}

export async function createContact(contact) {
  const response = await fetch(`${API_URL}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return response.json();
}

export async function updateContact(id, contact) {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return response.json();
}

export async function deleteContact(id) {
  await fetch(`${API_URL}/contacts/${id}`, { method: "DELETE" });
}
