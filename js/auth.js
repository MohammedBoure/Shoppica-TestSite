const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function displayResponse(elementId, data, isError = false) {
  const responseDiv = document.getElementById(elementId);
  responseDiv.innerHTML = '';
  responseDiv.className = `mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`;
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(data, null, 2);
  responseDiv.appendChild(pre);
}

document.addEventListener('DOMContentLoaded', () => {
  // Set API URL in the HTML
  const apiUrlElement = document.getElementById('api-url');
  apiUrlElement.href = BASE_URL;
  apiUrlElement.textContent = BASE_URL;
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (!data.email || !data.password) {
    displayResponse('login-response', { error: 'Email and password are required' }, true);
    return;
  }
  if (!emailRegex.test(data.email)) {
    displayResponse('login-response', { error: 'Invalid email format' }, true);
    return;
  }
  if (data.password.length < 4) {
    displayResponse('login-response', { error: 'Password must be at least 4 characters long' }, true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('login-response', result);
  } catch (error) {
    displayResponse('login-response', error, true);
  }
});

// Get Current User
document.getElementById('get-user-btn').addEventListener('click', async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('get-user-response', result);
  } catch (error) {
    displayResponse('get-user-response', error, true);
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('logout-response', result);
  } catch (error) {
    displayResponse('logout-response', error, true);
  }
});