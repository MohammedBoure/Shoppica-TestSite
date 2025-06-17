document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = getBackendUrl();

  // Add New Address
  document.getElementById('add-address-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.is_default = formData.get('is_default') === 'on';
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
    if (formData.get('address_line1')) data.address_line1 = formData.get('address_line1');
    if (formData.get('address_line2')) data.address_line2 = formData.get('address_line2');
    if (formData.get('city')) data.city = formData.get('city');
    if (formData.get('state')) data.state = formData.get('state');
    if (formData.get('postal_code')) data.postal_code = formData.get('postal_code');
    if (formData.get('country')) data.country = formData.get('country');
    data.is_default = formData.get('is_default') === 'on';
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

  // Get All Addresses (Admin Only)
  document.getElementById('get-all-addresses-form').addEventListener('submit', async (e) => {
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
});