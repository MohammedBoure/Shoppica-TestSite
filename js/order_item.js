document.addEventListener('DOMContentLoaded', () => {
  // Set API URL in the page
  const apiUrlElement = document.getElementById('api-url');
  apiUrlElement.textContent = BASE_URL;
  apiUrlElement.href = BASE_URL;

  // Helper function to display response
  const displayResponse = (elementId, data, isError) => {
    const responseElement = document.getElementById(elementId);
    responseElement.innerHTML = `<pre class="language-json"><code>${JSON.stringify(data, null, 2)}</code></pre>`;
    responseElement.className = `mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`;
    Prism.highlightAll();
  };

  // Helper function to validate quantity
  const validateQuantity = (quantity) => {
    const num = parseInt(quantity);
    return !isNaN(num) && num >= 1;
  };

  // Helper function to validate price
  const validatePrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0;
  };

  // 1. Add New Order Item
  const addOrderItemForm = document.getElementById('add-order-item-form');
  if (addOrderItemForm) {
    addOrderItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addOrderItemForm);
      const data = Object.fromEntries(formData);

      if (!data.order_id || !data.product_id || !data.quantity || !data.price) {
        displayResponse('add-order-item-response', { error: 'Order ID, product ID, quantity, and price are required' }, true);
        return;
      }

      if (!validateQuantity(data.quantity)) {
        displayResponse('add-order-item-response', { error: 'Quantity must be a positive integer' }, true);
        return;
      }

      if (!validatePrice(data.price)) {
        displayResponse('add-order-item-response', { error: 'Price must be a non-negative number' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/order_items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            order_id: parseInt(data.order_id),
            product_id: parseInt(data.product_id),
            quantity: parseInt(data.quantity),
            price: parseFloat(data.price)
          })
        });
        const result = await response.json();
        displayResponse('add-order-item-response', result, !response.ok);
      } catch (error) {
        console.error('Error adding order item:', error);
        displayResponse('add-order-item-response', { error: 'Failed to add order item. Ensure you are logged in as an admin.' }, true);
      }
    });
  }

  // 2. Get Order Item by ID
  const getOrderItemByIdForm = document.getElementById('get-order-item-by-id-form');
  if (getOrderItemByIdForm) {
    getOrderItemByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getOrderItemByIdForm);
      const orderItemId = formData.get('order_item_id');

      if (!orderItemId) {
        displayResponse('get-order-item-by-id-response', { error: 'Order Item ID is required' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/order_items/${orderItemId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-order-item-by-id-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching order item:', error);
        displayResponse('get-order-item-by-id-response', { error: 'Failed to fetch order item. Ensure you are logged in.' }, true);
      }
    });
  }

  // 3. Get Order Items by Order
  const getOrderItemsByOrderForm = document.getElementById('get-order-items-by-order-form');
  if (getOrderItemsByOrderForm) {
    getOrderItemsByOrderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getOrderItemsByOrderForm);
      const orderId = formData.get('order_id');

      if (!orderId) {
        displayResponse('get-order-items-by-order-response', { error: 'Order ID is required' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/order_items/order/${orderId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-order-items-by-order-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching order items by order:', error);
        displayResponse('get-order-items-by-order-response', { error: 'Failed to fetch order items. Ensure you are logged in.' }, true);
      }
    });
  }

  // 4. Update Order Item
  const updateOrderItemForm = document.getElementById('update-order-item-form');
  if (updateOrderItemForm) {
    updateOrderItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(updateOrderItemForm);
      const data = Object.fromEntries(formData);

      if (!data.order_item_id) {
        displayResponse('update-order-item-response', { error: 'Order Item ID is required' }, true);
        return;
      }

      if (data.quantity && !validateQuantity(data.quantity)) {
        displayResponse('update-order-item-response', { error: 'Quantity must be a positive integer' }, true);
        return;
      }

      if (data.price && !validatePrice(data.price)) {
        displayResponse('update-order-item-response', { error: 'Price must be a non-negative number' }, true);
        return;
      }

      const body = {};
      if (data.quantity) body.quantity = parseInt(data.quantity);
      if (data.price) body.price = parseFloat(data.price);

      if (Object.keys(body).length === 0) {
        displayResponse('update-order-item-response', { error: 'At least one field (quantity or price) must be provided' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/order_items/${data.order_item_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('update-order-item-response', result, !response.ok);
      } catch (error) {
        console.error('Error updating order item:', error);
        displayResponse('update-order-item-response', { error: 'Failed to update order item. Ensure you are logged in as an admin.' }, true);
      }
    });
  }

  // 5. Delete Order Item
  const deleteOrderItemForm = document.getElementById('delete-order-item-form');
  if (deleteOrderItemForm) {
    deleteOrderItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteOrderItemForm);
      const orderItemId = formData.get('order_item_id');

      if (!orderItemId) {
        displayResponse('delete-order-item-response', { error: 'Order Item ID is required' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/order_items/${orderItemId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('delete-order-item-response', result, !response.ok);
      } catch (error) {
        console.error('Error deleting order item:', error);
        displayResponse('delete-order-item-response', { error: 'Failed to delete order item. Ensure you are logged in as an admin.' }, true);
      }
    });
  }

  // 6. Get All Order Items
  const getAllOrderItemsForm = document.getElementById('get-all-order-items-form');
  if (getAllOrderItemsForm) {
    getAllOrderItemsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllOrderItemsForm);
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;

      try {
        const response = await fetch(`${BASE_URL}/order_items?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-all-order-items-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching all order items:', error);
        displayResponse('get-all-order-items-response', { error: 'Failed to fetch order items. Ensure you are logged in as an admin.' }, true);
      }
    });
  }
});