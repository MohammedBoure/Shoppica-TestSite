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

  // Top Selling Products
  document.getElementById('top-products-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const limit = formData.get('limit');
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    try {
      const response = await fetch(`${BASE_URL}/analytics/products?${params.toString()}`, {
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
    const params = new URLSearchParams();
    if (formData.get('start_date')) params.append('start_date', formData.get('start_date'));
    if (formData.get('end_date')) params.append('end_date', formData.get('end_date'));
    try {
      const response = await fetch(`${BASE_URL}/analytics/sales?${params.toString()}`, {
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
    const params = new URLSearchParams();
    if (formData.get('start_date')) params.append('start_date', formData.get('start_date'));
    if (formData.get('end_date')) params.append('end_date', formData.get('end_date'));
    try {
      const response = await fetch(`${BASE_URL}/analytics/users?${params.toString()}`, {
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

  // Customer Retention Rate
  document.getElementById('customer-retention-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const params = new URLSearchParams();
    if (formData.get('start_date')) params.append('start_date', formData.get('start_date'));
    if (formData.get('end_date')) params.append('end_date', formData.get('end_date'));
    try {
      const response = await fetch(`${BASE_URL}/analytics/customer-retention?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('customer-retention-response', result);
    } catch (error) {
      displayResponse('customer-retention-response', error, true);
    }
  });

  // Product Performance Trend
  document.getElementById('product-performance-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productId = formData.get('product_id');
    if (!productId) {
      displayResponse('product-performance-response', { error: 'Product ID is required' }, true);
      return;
    }
    const params = new URLSearchParams();
    params.append('product_id', productId);
    if (formData.get('start_date')) params.append('start_date', formData.get('start_date'));
    if (formData.get('end_date')) params.append('end_date', formData.get('end_date'));
    params.append('interval', formData.get('interval'));
    try {
      const response = await fetch(`${BASE_URL}/analytics/product-performance?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('product-performance-response', result);
    } catch (error) {
      displayResponse('product-performance-response', error, true);
    }
  });

  // Discount Effectiveness
  document.getElementById('discount-effectiveness-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const params = new URLSearchParams();
    if (formData.get('start_date')) params.append('start_date', formData.get('start_date'));
    if (formData.get('end_date')) params.append('end_date', formData.get('end_date'));
    try {
      const response = await fetch(`${BASE_URL}/analytics/discount-effectiveness?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw result;
      displayResponse('discount-effectiveness-response', result);
    } catch (error) {
      displayResponse('discount-effectiveness-response', error, true);
    }
  });
});