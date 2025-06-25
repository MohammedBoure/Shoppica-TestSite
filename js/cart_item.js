document.addEventListener('DOMContentLoaded', () => {
  // Set API URL in the HTML
  const apiUrlElement = document.getElementById('api-url');
  if (apiUrlElement) {
    apiUrlElement.href = BASE_URL;
    apiUrlElement.textContent = BASE_URL;
  }

  // Session storage for mock session
  let sessionData = {
    user_id: null,
    is_admin: false
  };

  // Helper function to display response
  const displayResponse = (elementId, response) => {
    const responseElement = document.getElementById(elementId);
    if (responseElement) {
      const codeElement = responseElement.querySelector('code');
      if (codeElement) {
        codeElement.textContent = JSON.stringify(response, null, 2);
        Prism.highlightAll();
      }
    }
  };

  // Helper function to validate positive integer
  const validatePositiveInt = (value, fieldName) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      return { valid: false, error: `${fieldName} must be a positive integer` };
    }
    return { valid: true, value: num };
  };

  // Helper function to check if session is set
  const checkSession = () => {
    if (!sessionData.user_id) {
      return { valid: false, error: 'Please set session (User ID) first' };
    }
    return { valid: true };
  };

  // Helper function to check admin privileges
  const checkAdmin = () => {
    if (!sessionData.is_admin) {
      return { valid: false, error: 'Admin privileges required' };
    }
    return { valid: true };
  };

  // 0. Mock Session Login
  const sessionLoginForm = document.getElementById('session-login-form');
  if (sessionLoginForm) {
    sessionLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(sessionLoginForm);
      const userId = formData.get('user_id');
      const isAdmin = formData.get('is_admin') === 'on';

      const userIdValidation = validatePositiveInt(userId, 'User ID');
      if (!userIdValidation.valid) {
        displayResponse('session-login-response', { error: userIdValidation.error });
        return;
      }

      sessionData.user_id = userIdValidation.value;
      sessionData.is_admin = isAdmin;
      displayResponse('session-login-response', {
        message: `Session set for User ID: ${sessionData.user_id}, Is Admin: ${sessionData.is_admin}`
      });
    });
  }

  // 1. Add New Cart Item
  const addCartItemForm = document.getElementById('add-cart-item-form');
  if (addCartItemForm) {
    addCartItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('add-cart-item-response', { error: sessionCheck.error });
        return;
      }

      const formData = new FormData(addCartItemForm);
      const productId = formData.get('product_id');
      const quantity = formData.get('quantity');

      const productIdValidation = validatePositiveInt(productId, 'Product ID');
      const quantityValidation = validatePositiveInt(quantity, 'Quantity');
      if (!productIdValidation.valid) {
        displayResponse('add-cart-item-response', { error: productIdValidation.error });
        return;
      }
      if (!quantityValidation.valid) {
        displayResponse('add-cart-item-response', { error: quantityValidation.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
          credentials: 'include',
          body: JSON.stringify({
            product_id: productIdValidation.value,
            quantity: quantityValidation.value
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
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('get-user-cart-items-response', { error: sessionCheck.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items`, {
          method: 'GET',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
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
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('get-cart-item-by-id-response', { error: sessionCheck.error });
        return;
      }

      const formData = new FormData(getCartItemByIdForm);
      const cartItemId = formData.get('cart_item_id');

      const cartItemIdValidation = validatePositiveInt(cartItemId, 'Cart Item ID');
      if (!cartItemIdValidation.valid) {
        displayResponse('get-cart-item-by-id-response', { error: cartItemIdValidation.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items/${cartItemIdValidation.value}`, {
          method: 'GET',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
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
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('update-cart-item-response', { error: sessionCheck.error });
        return;
      }

      const formData = new FormData(updateCartItemForm);
      const cartItemId = formData.get('cart_item_id');
      const quantity = formData.get('quantity');

      const cartItemIdValidation = validatePositiveInt(cartItemId, 'Cart Item ID');
      const quantityValidation = validatePositiveInt(quantity, 'Quantity');
      if (!cartItemIdValidation.valid) {
        displayResponse('update-cart-item-response', { error: cartItemIdValidation.error });
        return;
      }
      if (!quantityValidation.valid) {
        displayResponse('update-cart-item-response', { error: quantityValidation.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items/${cartItemIdValidation.value}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
          credentials: 'include',
          body: JSON.stringify({
            quantity: quantityValidation.value
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
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('delete-cart-item-response', { error: sessionCheck.error });
        return;
      }

      const formData = new FormData(deleteCartItemForm);
      const cartItemId = formData.get('cart_item_id');

      const cartItemIdValidation = validatePositiveInt(cartItemId, 'Cart Item ID');
      if (!cartItemIdValidation.valid) {
        displayResponse('delete-cart-item-response', { error: cartItemIdValidation.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/items/${cartItemIdValidation.value}`, {
          method: 'DELETE',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
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

  // 6. Clear User's Cart
  const clearCartForm = document.getElementById('clear-cart-form');
  if (clearCartForm) {
    clearCartForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('clear-cart-response', { error: sessionCheck.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/clear`, {
          method: 'DELETE',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('clear-cart-response', result);
      } catch (error) {
        console.error('Error clearing cart:', error);
        displayResponse('clear-cart-response', { error: 'Failed to clear cart' });
      }
    });
  }

  // 7. Get User's Cart Stats
  const getCartStatsForm = document.getElementById('get-cart-stats-form');
  if (getCartStatsForm) {
    getCartStatsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('get-cart-stats-response', { error: sessionCheck.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart/stats`, {
          method: 'GET',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-cart-stats-response', result);
      } catch (error) {
        console.error('Error fetching cart stats:', error);
        displayResponse('get-cart-stats-response', { error: 'Failed to fetch cart stats' });
      }
    });
  }

  // 8. Admin: Get Cart Items by User
  const getCartItemsByUserForm = document.getElementById('get-cart-items-by-user-form');
  if (getCartItemsByUserForm) {
    getCartItemsByUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('get-cart-items-by-user-response', { error: sessionCheck.error });
        return;
      }
      const adminCheck = checkAdmin();
      if (!adminCheck.valid) {
        displayResponse('get-cart-items-by-user-response', { error: adminCheck.error });
        return;
      }

      const formData = new FormData(getCartItemsByUserForm);
      const userId = formData.get('user_id');

      const userIdValidation = validatePositiveInt(userId, 'User ID');
      if (!userIdValidation.valid) {
        displayResponse('get-cart-items-by-user-response', { error: userIdValidation.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/admin/cart_items/user/${userIdValidation.value}`, {
          method: 'GET',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
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

  // 9. Admin: Get All Cart Items
  const getAllCartItemsForm = document.getElementById('get-all-cart-items-form');
  if (getAllCartItemsForm) {
    getAllCartItemsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('get-all-cart-items-response', { error: sessionCheck.error });
        return;
      }
      const adminCheck = checkAdmin();
      if (!adminCheck.valid) {
        displayResponse('get-all-cart-items-response', { error: adminCheck.error });
        return;
      }

      const formData = new FormData(getAllCartItemsForm);
      const page = parseInt(formData.get('page')) || 1;
      const perPage = parseInt(formData.get('per_page')) || 20;

      const pageValidation = validatePositiveInt(page, 'Page');
      const perPageValidation = validatePositiveInt(perPage, 'Per Page');
      if (!pageValidation.valid) {
        displayResponse('get-all-cart-items-response', { error: pageValidation.error });
        return;
      }
      if (!perPageValidation.valid) {
        displayResponse('get-all-cart-items-response', { error: perPageValidation.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/admin/cart_items?page=${pageValidation.value}&per_page=${perPageValidation.value}`, {
          method: 'GET',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
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

  // 10. Admin: Search Cart Items
  const searchCartItemsForm = document.getElementById('search-cart-items-form');
  if (searchCartItemsForm) {
    searchCartItemsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('search-cart-items-response', { error: sessionCheck.error });
        return;
      }
      const adminCheck = checkAdmin();
      if (!adminCheck.valid) {
        displayResponse('search-cart-items-response', { error: adminCheck.error });
        return;
      }

      const formData = new FormData(searchCartItemsForm);
      const userId = formData.get('user_id');
      const productId = formData.get('product_id');
      const page = parseInt(formData.get('page')) || 1;
      const perPage = parseInt(formData.get('per_page')) || 20;

      if (!userId && !productId) {
        displayResponse('search-cart-items-response', { error: 'At least one of User ID or Product ID is required' });
        return;
      }

      const pageValidation = validatePositiveInt(page, 'Page');
      const perPageValidation = validatePositiveInt(perPage, 'Per Page');
      if (!pageValidation.valid) {
        displayResponse('search-cart-items-response', { error: pageValidation.error });
        return;
      }
      if (!perPageValidation.valid) {
        displayResponse('search-cart-items-response', { error: perPageValidation.error });
        return;
      }

      const queryParams = new URLSearchParams();
      if (userId) {
        const userIdValidation = validatePositiveInt(userId, 'User ID');
        if (!userIdValidation.valid) {
          displayResponse('search-cart-items-response', { error: userIdValidation.error });
          return;
        }
        queryParams.append('user_id', userIdValidation.value);
      }
      if (productId) {
        const productIdValidation = validatePositiveInt(productId, 'Product ID');
        if (!productIdValidation.valid) {
          displayResponse('search-cart-items-response', { error: productIdValidation.error });
          return;
        }
        queryParams.append('product_id', productIdValidation.value);
      }
      queryParams.append('page', pageValidation.value);
      queryParams.append('per_page', perPageValidation.value);

      try {
        const response = await fetch(`${BASE_URL}/admin/cart_items/search?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('search-cart-items-response', result);
      } catch (error) {
        console.error('Error searching cart items:', error);
        displayResponse('search-cart-items-response', { error: 'Failed to search cart items' });
      }
    });
  }

  // 11. Admin: Clear Cart by User
  const clearUserCartForm = document.getElementById('clear-user-cart-form');
  if (clearUserCartForm) {
    clearUserCartForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('clear-user-cart-response', { error: sessionCheck.error });
        return;
      }
      const adminCheck = checkAdmin();
      if (!adminCheck.valid) {
        displayResponse('clear-user-cart-response', { error: adminCheck.error });
        return;
      }

      const formData = new FormData(clearUserCartForm);
      const userId = formData.get('user_id');

      const userIdValidation = validatePositiveInt(userId, 'User ID');
      if (!userIdValidation.valid) {
        displayResponse('clear-user-cart-response', { error: userIdValidation.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/admin/cart_items/user/${userIdValidation.value}`, {
          method: 'DELETE',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('clear-user-cart-response', result);
      } catch (error) {
        console.error('Error clearing user cart:', error);
        displayResponse('clear-user-cart-response', { error: 'Failed to clear user cart' });
      }
    });
  }

  // 12. Admin: Delete Cart Items by Product
  const deleteCartItemsByProductForm = document.getElementById('delete-cart-items-by-product-form');
  if (deleteCartItemsByProductForm) {
    deleteCartItemsByProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('delete-cart-items-by-product-response', { error: sessionCheck.error });
        return;
      }
      const adminCheck = checkAdmin();
      if (!adminCheck.valid) {
        displayResponse('delete-cart-items-by-product-response', { error: adminCheck.error });
        return;
      }

      const formData = new FormData(deleteCartItemsByProductForm);
      const productId = formData.get('product_id');

      const productIdValidation = validatePositiveInt(productId, 'Product ID');
      if (!productIdValidation.valid) {
        displayResponse('delete-cart-items-by-product-response', { error: productIdValidation.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/admin/cart_items/product/${productIdValidation.value}`, {
          method: 'DELETE',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('delete-cart-items-by-product-response', result);
      } catch (error) {
        console.error('Error deleting cart items by product:', error);
        displayResponse('delete-cart-items-by-product-response', { error: 'Failed to delete cart items' });
      }
    });
  }

  // 13. Admin: Get Overall Cart Stats
  const getOverallCartStatsForm = document.getElementById('get-overall-cart-stats-form');
  if (getOverallCartStatsForm) {
    getOverallCartStatsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('get-overall-cart-stats-response', { error: sessionCheck.error });
        return;
      }
      const adminCheck = checkAdmin();
      if (!adminCheck.valid) {
        displayResponse('get-overall-cart-stats-response', { error: adminCheck.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/admin/cart/stats`, {
          method: 'GET',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-overall-cart-stats-response', result);
      } catch (error) {
        console.error('Error fetching overall cart stats:', error);
        displayResponse('get-overall-cart-stats-response', { error: 'Failed to fetch cart stats' });
      }
    });
  }

  // 14. Admin: Get User Cart Stats
  const getUserCartStatsForm = document.getElementById('get-user-cart-stats-form');
  if (getUserCartStatsForm) {
    getUserCartStatsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sessionCheck = checkSession();
      if (!sessionCheck.valid) {
        displayResponse('get-user-cart-stats-response', { error: sessionCheck.error });
        return;
      }
      const adminCheck = checkAdmin();
      if (!adminCheck.valid) {
        displayResponse('get-user-cart-stats-response', { error: adminCheck.error });
        return;
      }

      const formData = new FormData(getUserCartStatsForm);
      const userId = formData.get('user_id');

      const userIdValidation = validatePositiveInt(userId, 'User ID');
      if (!userIdValidation.valid) {
        displayResponse('get-user-cart-stats-response', { error: userIdValidation.error });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/admin/cart_items/user/${userIdValidation.value}/stats`, {
          method: 'GET',
          headers: {
            'X-User-ID': sessionData.user_id,
            'X-Is-Admin': sessionData.is_admin
          },
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-user-cart-stats-response', result);
      } catch (error) {
        console.error('Error fetching user cart stats:', error);
        displayResponse('get-user-cart-stats-response', { error: 'Failed to fetch user cart stats' });
      }
    });
  }
});