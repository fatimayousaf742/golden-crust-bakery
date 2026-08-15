const API_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const { body, ...fetchOptions } = options;
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...fetchOptions,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function submitOrder(data) {
  return request('/orders', { method: 'POST', body: data });
}

export async function submitDelivery(data) {
  return request('/deliveries', { method: 'POST', body: data });
}

export async function submitContact(data) {
  return request('/contact', { method: 'POST', body: data });
}

export async function registerUser(data) {
  return request('/auth/register', { method: 'POST', body: data });
}

export async function loginUser(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export async function logoutUser() {
  return request('/auth/logout', { method: 'POST' });
}

export async function fetchMe() {
  return request('/auth/me');
}
