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

// Add New User
document.getElementById('add-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Client-side validation
  if (!emailRegex.test(data.email)) {
    displayResponse('add-user-response', { error: 'Invalid email format' }, true);
    return;
  }
  if (data.password.length < 6) {
    displayResponse('add-user-response', { error: 'Password must be at least 6 characters long' }, true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('add-user-response', result);
  } catch (error) {
    displayResponse('add-user-response', error, true);
  }
});

// Get User by ID
document.getElementById('get-user-by-id-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const userId = formData.get('user_id');
  if (!userId || userId <= 0) {
    displayResponse('get-user-by-id-response', { error: 'Valid User ID is required' }, true);
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('get-user-by-id-response', result);
  } catch (error) {
    displayResponse('get-user-by-id-response', error, true);
  }
});

// Get User by Email
document.getElementById('get-user-by-email-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = encodeURIComponent(formData.get('email'));
  if (!emailRegex.test(formData.get('email'))) {
    displayResponse('get-user-by-email-response', { error: 'Invalid email format' }, true);
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/users/email/${email}`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('get-user-by-email-response', result);
  } catch (error) {
    displayResponse('get-user-by-email-response', error, true);
  }
});

// Get User by Username
document.getElementById('get-user-by-username-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const username = encodeURIComponent(formData.get('username'));
  if (!username) {
    displayResponse('get-user-by-username-response', { error: 'Username is required' }, true);
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/users/username/${username}`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('get-user-by-username-response', result);
  } catch (error) {
    displayResponse('get-user-by-username-response', error, true);
  }
});

// Update User
document.getElementById('update-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const userId = formData.get('user_id');
  if (!userId || userId <= 0) {
    displayResponse('update-user-response', { error: 'Valid User ID is required' }, true);
    return;
  }
  const data = {};
  if (formData.get('full_name')) data.full_name = formData.get('full_name');
  if (formData.get('phone_number')) data.phone_number = formData.get('phone_number');
  if (formData.get('password')) {
    if (formData.get('password').length < 6) {
      displayResponse('update-user-response', { error: 'Password must be at least 6 characters long' }, true);
      return;
    }
    data.password = formData.get('password');
  }
  if (formData.get('is_admin') === 'on') data.is_admin = true;
  
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('update-user-response', result);
  } catch (error) {
    displayResponse('update-user-response', error, true);
  }
});

// Delete User
document.getElementById('delete-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const userId = formData.get('user_id');
  if (!userId || userId <= 0) {
    displayResponse('delete-user-response', { error: 'Valid User ID is required' }, true);
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('delete-user-response', result);
  } catch (error) {
    displayResponse('delete-user-response', error, true);
  }
});

// Get All Users
document.getElementById('get-all-users-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const page = formData.get('page') || 1;
  const perPage = formData.get('per_page') || 20;
  if (page < 1 || perPage < 1) {
    displayResponse('get-all-users-response', { error: 'Page and per_page must be positive integers' }, true);
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/users?page=${page}&per_page=${perPage}`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('get-all-users-response', result);
  } catch (error) {
    displayResponse('get-all-users-response', error, true);
  }
});

// Validate User Password
document.getElementById('validate-password-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const userId = formData.get('user_id');
  const data = { password: formData.get('password') };
  if (!userId || userId <= 0) {
    displayResponse('validate-password-response', { error: 'Valid User ID is required' }, true);
    return;
  }
  if (!data.password) {
    displayResponse('validate-password-response', { error: 'Password is required' }, true);
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/validate-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('validate-password-response', result);
  } catch (error) {
    displayResponse('validate-password-response', error, true);
  }
});

// Search Users
document.getElementById('search-users-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const query = encodeURIComponent(formData.get('q'));
  const page = formData.get('page') || 1;
  const perPage = formData.get('per_page') || 20;
  if (!query) {
    displayResponse('search-users-response', { error: 'Search query is required' }, true);
    return;
  }
  if (page < 1 || perPage < 1) {
    displayResponse('search-users-response', { error: 'Page and per_page must be positive integers' }, true);
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/users/search?q=${query}&page=${page}&per_page=${perPage}`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('search-users-response', result);
  } catch (error) {
    displayResponse('search-users-response', error, true);
  }
});

// Clear All Users
document.getElementById('clear-all-users-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!confirm('Are you sure you want to delete all users? This action cannot be undone.')) {
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/users/clear-all`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('clear-all-users-response', result);
  } catch (error) {
    displayResponse('clear-all-users-response', error, true);
  }
});

// Get Total Users
document.getElementById('get-total-users-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${BASE_URL}/users/number`, {
      method: 'GET',
      credentials: 'include', // Send session cookies
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('get-total-users-response', result);
  } catch (error) {
    displayResponse('get-total-users-response', error, true);
  }
});