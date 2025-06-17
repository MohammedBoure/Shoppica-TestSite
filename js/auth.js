
// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  if (!data.email || !data.password) {
    displayResponse('login-response', { error: 'Email and password are required' }, true);
    localStorage.setItem('user_id', result.user.id);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/login`, {
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
    const response = await fetch(`${BASE_URL}/me`, {
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
    const response = await fetch(`${BASE_URL}/logout`, {
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