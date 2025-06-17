document.addEventListener('DOMContentLoaded', () => {
  // Helper function to validate total price
  const validateTotalPrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0;
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
      const userId = formData.get('user_id');

      if (!orderId || !userId) {
        displayResponse('get-order-by-id-response', { error: 'Order ID and User ID are required' }, true);
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
});