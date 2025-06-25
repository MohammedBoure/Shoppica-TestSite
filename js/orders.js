document.addEventListener('DOMContentLoaded', () => {
  // Set API URL in the page
  const apiUrlElement = document.getElementById('api-url');
  if (apiUrlElement) {
    apiUrlElement.textContent = BASE_URL;
    apiUrlElement.href = BASE_URL;
  }

  // Helper function to validate total price
  const validateTotalPrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0;
  };

  // Helper function to validate date
  const validateDate = (date) => {
    return date ? !isNaN(new Date(date).getTime()) : true;
  };

  // Helper function to display response
  const displayResponse = (elementId, data, isError = false) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.innerHTML = '';
    element.className = `mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`;
    
    const pre = document.createElement('pre');
    pre.className = 'bg-gray-100 p-4 rounded-md overflow-auto';
    const code = document.createElement('code');
    code.className = 'language-json';
    code.textContent = JSON.stringify(data, null, 2);
    pre.appendChild(code);
    element.appendChild(pre);
    
    Prism.highlightElement(code);
  };

  // 1. Add New Order
  const addOrderForm = document.getElementById('add-order-form');
  if (addOrderForm) {
    addOrderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addOrderForm);
      const data = Object.fromEntries(formData);

      if (!data.user_id || !data.shipping_address_id || !data.total_price) {
        displayResponse('add-order-response', { error: 'User ID, shipping address ID, and total price are required' }, true);
        return;
      }

      if (!validateTotalPrice(data.total_price)) {
        displayResponse('add-order-response', { error: 'Total price must be a non-negative number' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            user_id: parseInt(data.user_id),
            shipping_address_id: parseInt(data.shipping_address_id),
            total_price: parseFloat(data.total_price),
            status: data.status || 'pending'
          })
        });
        const result = await response.json();
        displayResponse('add-order-response', result, !response.ok);
      } catch (error) {
        console.error('Error adding order:', error);
        displayResponse('add-order-response', { error: 'Failed to add order' }, true);
      }
    });
  }

  // 2. Get Order by ID
  const getOrderByIdForm = document.getElementById('get-order-by-id-form');
  if (getOrderByIdForm) {
    getOrderByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getOrderByIdForm);
      const orderId = formData.get('order_id');

      if (!orderId) {
        displayResponse('get-order-by-id-response', { error: 'Order ID is required' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-order-by-id-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching order:', error);
        displayResponse('get-order-by-id-response', { error: 'Failed to fetch order' }, true);
      }
    });
  }

  // 3. Get Orders by User
  const getOrdersByUserForm = document.getElementById('get-orders-by-user-form');
  if (getOrdersByUserForm) {
    getOrdersByUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getOrdersByUserForm);
      const userId = formData.get('user_id');

      if (!userId) {
        displayResponse('get-orders-by-user-response', { error: 'User ID is required' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/orders/user/${userId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-orders-by-user-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching orders by user:', error);
        displayResponse('get-orders-by-user-response', { error: 'Failed to fetch orders' }, true);
      }
    });
  }

  // 4. Update Order
  const updateOrderForm = document.getElementById('update-order-form');
  if (updateOrderForm) {
    updateOrderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(updateOrderForm);
      const data = Object.fromEntries(formData);

      if (!data.order_id) {
        displayResponse('update-order-response', { error: 'Order ID is required' }, true);
        return;
      }

      if (data.total_price && !validateTotalPrice(data.total_price)) {
        displayResponse('update-order-response', { error: 'Total price must be a non-negative number' }, true);
        return;
      }

      const body = {};
      if (data.status) body.status = data.status;
      if (data.total_price) body.total_price = parseFloat(data.total_price);
      if (data.shipping_address_id) body.shipping_address_id = parseInt(data.shipping_address_id);

      if (Object.keys(body).length === 0) {
        displayResponse('update-order-response', { error: 'At least one field (status, total price, or shipping address ID) must be provided' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/orders/${data.order_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('update-order-response', result, !response.ok);
      } catch (error) {
        console.error('Error updating order:', error);
        displayResponse('update-order-response', { error: 'Failed to update order' }, true);
      }
    });
  }

  // 5. Delete Order
  const deleteOrderForm = document.getElementById('delete-order-form');
  if (deleteOrderForm) {
    deleteOrderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteOrderForm);
      const orderId = formData.get('order_id');

      if (!orderId) {
        displayResponse('delete-order-response', { error: 'Order ID is required' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('delete-order-response', result, !response.ok);
      } catch (error) {
        console.error('Error deleting order:', error);
        displayResponse('delete-order-response', { error: 'Failed to delete order' }, true);
      }
    });
  }

  // 6. Get All Orders
  const getAllOrdersForm = document.getElementById('get-all-orders-form');
  if (getAllOrdersForm) {
    getAllOrdersForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllOrdersForm);
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;

      if (parseInt(perPage) > 100) {
        displayResponse('get-all-orders-response', { error: 'Per page cannot exceed 100' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/orders?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-all-orders-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching all orders:', error);
        displayResponse('get-all-orders-response', { error: 'Failed to fetch orders' }, true);
      }
    });
  }

  // 7. Search Orders
  const searchOrdersForm = document.getElementById('search-orders-form');
  if (searchOrdersForm) {
    searchOrdersForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(searchOrdersForm);
      const data = Object.fromEntries(formData);

      if (data.min_total && !validateTotalPrice(data.min_total)) {
        displayResponse('search-orders-response', { error: 'Minimum total price must be a non-negative number' }, true);
        return;
      }
      if (data.max_total && !validateTotalPrice(data.max_total)) {
        displayResponse('search-orders-response', { error: 'Maximum total price must be a non-negative number' }, true);
        return;
      }
      if (data.min_total && data.max_total && parseFloat(data.min_total) > parseFloat(data.max_total)) {
        displayResponse('search-orders-response', { error: 'Minimum total cannot be greater than maximum total' }, true);
        return;
      }
      if (data.start_date && !validateDate(data.start_date)) {
        displayResponse('search-orders-response', { error: 'Invalid start date format' }, true);
        return;
      }
      if (data.end_date && !validateDate(data.end_date)) {
        displayResponse('search-orders-response', { error: 'Invalid end date format' }, true);
        return;
      }
      if (data.start_date && data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
        displayResponse('search-orders-response', { error: 'Start date cannot be later than end date' }, true);
        return;
      }

      const queryParams = new URLSearchParams();
      if (data.search_term) queryParams.append('search_term', data.search_term);
      if (data.status) queryParams.append('status', data.status);
      if (data.min_total) queryParams.append('min_total', data.min_total);
      if (data.max_total) queryParams.append('max_total', data.max_total);
      if (data.start_date) queryParams.append('start_date', new Date(data.start_date).toISOString());
      if (data.end_date) queryParams.append('end_date', new Date(data.end_date).toISOString());

      try {
        const response = await fetch(`${BASE_URL}/orders/search?${queryParams.toString()}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('search-orders-response', result, !response.ok);
      } catch (error) {
        console.error('Error searching orders:', error);
        displayResponse('search-orders-response', { error: 'Failed to search orders' }, true);
      }
    });
  }

  // 8. Get Order Statistics
  const getStatisticsForm = document.getElementById('get-statistics-form');
  if (getStatisticsForm) {
    getStatisticsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getStatisticsForm);
      const data = Object.fromEntries(formData);

      if (data.start_date && !validateDate(data.start_date)) {
        displayResponse('get-statistics-response', { error: 'Invalid start date format' }, true);
        return;
      }
      if (data.end_date && !validateDate(data.end_date)) {
        displayResponse('get-statistics-response', { error: 'Invalid end date format' }, true);
        return;
      }
      if (data.start_date && data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
        displayResponse('get-statistics-response', { error: 'Start date cannot be later than end date' }, true);
        return;
      }

      const queryParams = new URLSearchParams();
      if (data.start_date) queryParams.append('start_date', new Date(data.start_date).toISOString());
      if (data.end_date) queryParams.append('end_date', new Date(data.end_date).toISOString());

      try {
        const response = await fetch(`${BASE_URL}/orders/statistics?${queryParams.toString()}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-statistics-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        displayResponse('get-statistics-response', { error: 'Failed to fetch statistics' }, true);
      }
    });
  }

  // 9. Get Top Selling Products
  const getTopProductsForm = document.getElementById('get-top-products-form');
  if (getTopProductsForm) {
    getTopProductsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getTopProductsForm);
      const data = Object.fromEntries(formData);

      if (data.start_date && !validateDate(data.start_date)) {
        displayResponse('get-top-products-response', { error: 'Invalid start date format' }, true);
        return;
      }
      if (data.end_date && !validateDate(data.end_date)) {
        displayResponse('get-top-products-response', { error: 'Invalid end date format' }, true);
        return;
      }
      if (data.start_date && data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
        displayResponse('get-top-products-response', { error: 'Start date cannot be later than end date' }, true);
        return;
      }
      if (data.limit && (parseInt(data.limit) < 1 || parseInt(data.limit) > 50)) {
        displayResponse('get-top-products-response', { error: 'Limit must be between 1 and 50' }, true);
        return;
      }

      const queryParams = new URLSearchParams();
      if (data.start_date) queryParams.append('start_date', new Date(data.start_date).toISOString());
      if (data.end_date) queryParams.append('end_date', new Date(data.end_date).toISOString());
      if (data.limit) queryParams.append('limit', data.limit);

      try {
        const response = await fetch(`${BASE_URL}/orders/top-products?${queryParams.toString()}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-top-products-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching top products:', error);
        displayResponse('get-top-products-response', { error: 'Failed to fetch top products' }, true);
      }
    });
  }
});