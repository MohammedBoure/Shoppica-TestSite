document.addEventListener('DOMContentLoaded', () => {
  // Set API URL in the HTML
  const apiUrlElement = document.getElementById('api-url');
  if (apiUrlElement) {
    apiUrlElement.href = BASE_URL;
    apiUrlElement.textContent = BASE_URL;
  }

  // Helper function to display response
  const displayResponse = (elementId, response) => {
    const responseElement = document.getElementById(elementId);
    if (responseElement) {
      const codeElement = responseElement.querySelector('code');
      if (codeElement) {
        codeElement.textContent = JSON.stringify(response, null, 2);
        Prism.highlightAll(); // Re-highlight syntax
      }
    }
  };

  // Helper function to validate quantity
  const validateQuantity = (quantity) => {
    const num = parseInt(quantity);
    return !isNaN(num) && num >= 0;
  };

  // 1. Add New Cart Item
  const addCartItemForm = document.getElementById('add-cart-item-form');
  if (addCartItemForm) {
    addCartItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addCartItemForm);
      const data = Object.fromEntries(formData);

      if (!data.user_id || !data.product_id || !data.quantity) {
        displayResponse('add-cart-item-response', { error: 'User ID, product ID, and quantity are required' });
        return;
      }

      if (!validateQuantity(data.quantity) || parseInt(data.quantity) < 1) {
        displayResponse('add-cart-item-response', { error: 'Quantity must be a positive integer' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            product_id: parseInt(data.product_id),
            quantity: parseInt(data.quantity)
          })
        });
        const result = await response.json();
        displayResponse('add-cart-item-response', result);
      } catch (error) {
        console.error('Error adding cart item:', error);
        displayResponse('add-cart-item-response', { error: 'Failed to add cart item' });
      }
    });
  }

  // 2. Get User's Cart Items
  const getUserCartItemsForm = document.getElementById('get-user-cart-items-form');
  if (getUserCartItemsForm) {
    getUserCartItemsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getUserCartItemsForm);
      const userId = formData.get('user_id');

      if (!userId) {
        displayResponse('get-user-cart-items-response', { error: 'User ID is required' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-user-cart-items-response', result);
      } catch (error) {
        console.error('Error fetching user cart items:', error);
        displayResponse('get-user-cart-items-response', { error: 'Failed to fetch cart items' });
      }
    });
  }

  // 3. Get Cart Item by ID
  const getCartItemByIdForm = document.getElementById('get-cart-item-by-id-form');
  if (getCartItemByIdForm) {
    getCartItemByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getCartItemByIdForm);
      const cartItemId = formData.get('cart_item_id');
      const userId = formData.get('user_id');

      if (!cartItemId || !userId) {
        displayResponse('get-cart-item-by-id-response', { error: 'Cart Item ID and User ID are required' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items/${cartItemId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-cart-item-by-id-response', result);
      } catch (error) {
        console.error('Error fetching cart item:', error);
        displayResponse('get-cart-item-by-id-response', { error: 'Failed to fetch cart item' });
      }
    });
  }

  // 4. Update Cart Item
  const updateCartItemForm = document.getElementById('update-cart-item-form');
  if (updateCartItemForm) {
    updateCartItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(updateCartItemForm);
      const data = Object.fromEntries(formData);

      if (!data.cart_item_id || !data.user_id || !data.quantity) {
        displayResponse('update-cart-item-response', { error: 'Cart Item ID, User ID, and quantity are required' });
        return;
      }

      if (!validateQuantity(data.quantity)) {
        displayResponse('update-cart-item-response', { error: 'Quantity must be a non-negative integer' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items/${data.cart_item_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            quantity: parseInt(data.quantity)
          })
        });
        const result = await response.json();
        displayResponse('update-cart-item-response', result);
      } catch (error) {
        console.error('Error updating cart item:', error);
        displayResponse('update-cart-item-response', { error: 'Failed to update cart item' });
      }
    });
  }

  // 5. Delete Cart Item
  const deleteCartItemForm = document.getElementById('delete-cart-item-form');
  if (deleteCartItemForm) {
    deleteCartItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteCartItemForm);
      const cartItemId = formData.get('cart_item_id');
      const userId = formData.get('user_id');

      if (!cartItemId || !userId) {
        displayResponse('delete-cart-item-response', { error: 'Cart Item ID and User ID are required' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items/${cartItemId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('delete-cart-item-response', result);
      } catch (error) {
        console.error('Error deleting cart item:', error);
        displayResponse('delete-cart-item-response', { error: 'Failed to delete cart item' });
      }
    });
  }

  // 6. Get Cart Items by User (Admin Only)
  const getCartItemsByUserForm = document.getElementById('get-cart-items-by-user-form');
  if (getCartItemsByUserForm) {
    getCartItemsByUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getCartItemsByUserForm);
      const userId = formData.get('user_id');

      if (!userId) {
        displayResponse('get-cart-items-by-user-response', { error: 'User ID is required' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/admin/cart_items/user/${userId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-cart-items-by-user-response', result);
      } catch (error) {
        console.error('Error fetching cart items by user:', error);
        displayResponse('get-cart-items-by-user-response', { error: 'Failed to fetch cart items' });
      }
    });
  }

  // 7. Get All Cart Items (Admin Only)
  const getAllCartItemsForm = document.getElementById('get-all-cart-items-form');
  if (getAllCartItemsForm) {
    getAllCartItemsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllCartItemsForm);
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;

      try {
        const response = await fetch(`${BASE_URL}/admin/cart_items?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-all-cart-items-response', result);
      } catch (error) {
        console.error('Error fetching all cart items:', error);
        displayResponse('get-all-cart-items-response', { error: 'Failed to fetch cart items' });
      }
    });
  }
});