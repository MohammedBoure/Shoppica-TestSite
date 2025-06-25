const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

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

// Top Selling Products
document.getElementById('top-products-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Client-side validation
  const limit = parseInt(data.limit);
  if (isNaN(limit) || limit < 1 || limit > 100) {
    displayResponse('top-products-response', { error: 'Limit must be between 1 and 100' }, true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/analytics/products?limit=${limit}`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('top-products-response', result);
  } catch (error) {
    displayResponse('top-products-response', error, true);
  }
});

// Sales Statistics
document.getElementById('sales-stats-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (data.start_date && !dateRegex.test(data.start_date)) {
    displayResponse('sales-stats-response', { error: 'Invalid start date format. Use YYYY-MM-DD' }, true);
    return;
  }
  if (data.end_date && !dateRegex.test(data.end_date)) {
    displayResponse('sales-stats-response', { error: 'Invalid end date format. Use YYYY-MM-DD' }, true);
    return;
  }
  if (data.start_date && data.end_date && data.start_date > data.end_date) {
    displayResponse('sales-stats-response', { error: 'Start date cannot be later than end date' }, true);
    return;
  }

  try {
    const params = new URLSearchParams();
    if (data.start_date) params.append('start_date', data.start_date);
    if (data.end_date) params.append('end_date', data.end_date);
    const url = `${BASE_URL}/analytics/sales${params.toString() ? '?' + params.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('sales-stats-response', result);
  } catch (error) {
    displayResponse('sales-stats-response', error, true);
  }
});

// User Statistics
document.getElementById('user-stats-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (data.start_date && !dateRegex.test(data.start_date)) {
    displayResponse('user-stats-response', { error: 'Invalid start date format. Use YYYY-MM-DD' }, true);
    return;
  }
  if (data.end_date && !dateRegex.test(data.end_date)) {
    displayResponse('user-stats-response', { error: 'Invalid end date format. Use YYYY-MM-DD' }, true);
    return;
  }
  if (data.start_date && data.end_date && data.start_date > data.end_date) {
    displayResponse('user-stats-response', { error: 'Start date cannot be later than end date' }, true);
    return;
  }

  try {
    const params = new URLSearchParams();
    if (data.start_date) params.append('start_date', data.start_date);
    if (data.end_date) params.append('end_date', data.end_date);
    const url = `${BASE_URL}/analytics/users${params.toString() ? '?' + params.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw result;
    displayResponse('user-stats-response', result);
  } catch (error) {
    displayResponse('user-stats-response', error, true);
  }
});