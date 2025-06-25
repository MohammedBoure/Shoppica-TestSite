document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = getBackendUrl();
  document.getElementById('api-url').textContent = BASE_URL;
  document.getElementById('api-url').href = BASE_URL;

  // Helper function to display API responses
  function displayResponse(elementId, data, isError = false) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    const pre = document.createElement('pre');
    pre.className = isError ? 'text-red-600' : 'text-green-600';
    pre.textContent = JSON.stringify(data, null, 2);
    element.appendChild(pre);
  }

  // Add New Address
  document.getElementById('add-address-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      address_line: formData.get('address_line'),
      city: formData.get('city'),
      state: formData.get('state') || null,
      postal_code: formData.get('postal_code') || null,
      is_default: formData.get('is_default') === 'on' ? 1 : 0,
    };
    try {
      const response = await fetch(`${BASE_URL}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('add-address-response', result);
    } catch (error) {
      displayResponse('add-address-response', error, true);
    }
  });

  // Get User's Addresses
  document.getElementById('get-user-addresses-btn').addEventListener('click', async () => {
    try {
      const response = await fetch(`${BASE_URL}/addresses/me`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('get-user-addresses-response', result);
    } catch (error) {
      displayResponse('get-user-addresses-response', error, true);
    }
  });

  // Get Default Address
  document.getElementById('get-default-address-btn').addEventListener('click', async () => {
    try {
      const response = await fetch(`${BASE_URL}/addresses/me/default`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('get-default-address-response', result);
    } catch (error) {
      displayResponse('get-default-address-response', error, true);
    }
  });

  // Get Address by ID
  document.getElementById('get-address-by-id-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressId = formData.get('address_id');
    try {
      const response = await fetch(`${BASE_URL}/addresses/${addressId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('get-address-by-id-response', result);
    } catch (error) {
      displayResponse('get-address-by-id-response', error, true);
    }
  });

  // Update Address
  document.getElementById('update-address-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressId = formData.get('address_id');
    const data = {};
    if (formData.get('address_line')) data.address_line = formData.get('address_line');
    if (formData.get('city')) data.city = formData.get('city');
    if (formData.get('state')) data.state = formData.get('state');
    if (formData.get('postal_code')) data.postal_code = formData.get('postal_code');
    data.is_default = formData.get('is_default') === 'on' ? 1 : 0;
    try {
      const response = await fetch(`${BASE_URL}/addresses/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('update-address-response', result);
    } catch (error) {
      displayResponse('update-address-response', error, true);
    }
  });

  // Delete Address
  document.getElementById('delete-address-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressId = formData.get('address_id');
    try {
      const response = await fetch(`${BASE_URL}/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('delete-address-response', result);
    } catch (error) {
      displayResponse('delete-address-response', error, true);
    }
  });

  // Get User Address Stats
  document.getElementById('get-user-stats-btn').addEventListener('click', async () => {
    try {
      const response = await fetch(`${BASE_URL}/addresses/me/stats`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('get-user-stats-response', result);
    } catch (error) {
      displayResponse('get-user-stats-response', error, true);
    }
  });

  // Get Addresses by User (Admin Only)
  document.getElementById('get-addresses-by-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = formData.get('user_id');
    try {
      const response = await fetch(`${BASE_URL}/admin/addresses/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('get-addresses-by-user-response', result);
    } catch (error) {
      displayResponse('get-addresses-by-user-response', error, true);
    }
  });

  // Delete Addresses by User (Admin Only)
  document.getElementById('delete-addresses-by-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = formData.get('user_id');
    try {
      const response = await fetch(`${BASE_URL}/admin/addresses/user/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('delete-addresses-by-user-response', result);
    } catch (error) {
      displayResponse('delete-addresses-by-user-response', error, true);
    }
  });

  // Search Addresses (Admin Only)
  document.getElementById('search-addresses-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('q');
    if (!query) {
      displayResponse('search-addresses-response', { error: 'Search query is required' }, true);
      return;
    }
    const params = new URLSearchParams();
    params.append('q', query);
    params.append('page', formData.get('page') || 1);
    params.append('per_page', formData.get('per_page') || 20);
    try {
      const response = await fetch(`${BASE_URL}/admin/addresses/search?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('search-addresses-response', result);
    } catch (error) {
      displayResponse('search-addresses-response', error, true);
    }
  });

  // Get All Addresses (Admin Only)
  document.getElementById('get-all-addresses').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const page = formData.get('page') || 1;
    const perPage = formData.get('per_page') || 20;
    try {
      const response = await fetch(`${BASE_URL}/admin/addresses?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('get-all-addresses-response', result);
    } catch (error) {
      displayResponse('get-all-addresses-response', error, true);
    }
  });

  // Get Overall Address Stats (Admin Only)
  document.getElementById('get-overall-stats-btn').addEventListener('click', async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/addresses/stats`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('get-overall-stats-response', result);
    } catch (error) {
      displayResponse('get-overall-stats-response', error, true);
    }
  });

  // Get User Address Stats (Admin Only)
  document.getElementById('get-user-address-stats-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = formData.get('user_id');
    try {
      const response = await fetch(`${BASE_URL}/admin/addresses/user/${userId}/stats`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('get-user-address-stats-response', result);
    } catch (error) {
      displayResponse('get-user-address-stats-response', error, true);
    }
  });
});
