// Add New User
document.getElementById('add-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  data.is_admin = formData.get('is_admin') === 'on';
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
  const data = {};
  if (formData.get('full_name')) data.full_name = formData.get('full_name');
  if (formData.get('phone_number')) data.phone_number = formData.get('phone_number');
  if (formData.get('password')) data.password = formData.get('password');
  data.is_admin = formData.get('is_admin') === 'on';
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

