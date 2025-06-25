document.addEventListener('DOMContentLoaded', () => {
  // Set API URL in the page
  const apiUrlElement = document.getElementById('api-url');
  if (apiUrlElement) {
    apiUrlElement.href = BASE_URL;
    apiUrlElement.textContent = BASE_URL;
  }

  // Helper function to validate positive integer
  const validatePositiveInteger = (num) => {
    const value = parseInt(num);
    return !isNaN(value) && value >= 1;
  };

  // Helper function to display response
  const displayResponse = (elementId, data, isError = false) => {
    const responseElement = document.getElementById(elementId);
    if (!responseElement) return;

    responseElement.innerHTML = '';
    const pre = document.createElement('pre');
    pre.className = `p-4 rounded ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`;
    
    if (data.error) {
      pre.textContent = JSON.stringify({ error: data.error }, null, 2);
      responseElement.appendChild(pre);
      return;
    }

    if (Array.isArray(data.discount_usages)) {
      pre.textContent = JSON.stringify({ discount_usages: data.discount_usages }, null, 2);
    } else if (data.discount_usages && data.total) {
      pre.textContent = JSON.stringify({
        discount_usages: data.discount_usages,
        total: data.total,
        page: data.page,
        per_page: data.per_page
      }, null, 2);
    } else {
      pre.textContent = JSON.stringify(data, null, 2);
    }
    
    responseElement.appendChild(pre);
  };

  // 1. Add New Discount Usage
  const addDiscountUsageForm = document.getElementById('add-discount-usage-form');
  if (addDiscountUsageForm) {
    addDiscountUsageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addDiscountUsageForm);
      const data = Object.fromEntries(formData);

      if (!data.discount_id || !data.user_id) {
        displayResponse('add-discount-usage-response', { error: 'Discount ID and User ID are required' }, true);
        return;
      }

      if (!validatePositiveInteger(data.discount_id)) {
        displayResponse('add-discount-usage-response', { error: 'Discount ID must be a positive integer' }, true);
        return;
      }

      if (!validatePositiveInteger(data.user_id)) {
        displayResponse('add-discount-usage-response', { error: 'User ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discount_usages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            discount_id: parseInt(data.discount_id),
            user_id: parseInt(data.user_id)
          })
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            result.error = result.error || 'Authentication or authorization failed. Please log in or check permissions.';
          }
        }
        displayResponse('add-discount-usage-response', result, !response.ok);
      } catch (error) {
        console.error('Error adding discount usage:', error);
        displayResponse('add-discount-usage-response', { error: 'Failed to add discount usage. Network error.' }, true);
      }
    });
  }

  // 2. Get Discount Usage by ID
  const getDiscountUsageByIdForm = document.getElementById('get-discount-usage-by-id-form');
  if (getDiscountUsageByIdForm) {
    getDiscountUsageByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getDiscountUsageByIdForm);
      const usageId = formData.get('usage_id');

      if (!usageId) {
        displayResponse('get-discount-usage-response', { error: 'Usage ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(usageId)) {
        displayResponse('get-discount-usage-response', { error: 'Usage ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discount_usages/${usageId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            result.error = result.error || 'Admin privileges required. Please log in as an admin.';
          }
        }
        displayResponse('get-discount-usage-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching discount usage:', error);
        displayResponse('get-discount-usage-response', { error: 'Failed to fetch discount usage. Network error.' }, true);
      }
    });
  }

  // 3. Get Discount Usages by Discount
  const getDiscountUsagesByDiscountForm = document.getElementById('get-discount-usages-by-discount-form');
  if (getDiscountUsagesByDiscountForm) {
    getDiscountUsagesByDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getDiscountUsagesByDiscountForm);
      const discountId = formData.get('discount_id');

      if (!discountId) {
        displayResponse('get-discount-usages-by-discount-response', { error: 'Discount ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(discountId)) {
        displayResponse('get-discount-usages-by-discount-response', { error: 'Discount ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discount_usages/discount/${discountId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            result.error = result.error || 'Admin privileges required. Please log in as an admin.';
          }
        }
        displayResponse('get-discount-usages-by-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching discount usages by discount:', error);
        displayResponse('get-discount-usages-by-discount-response', { error: 'Failed to fetch discount usages. Network error.' }, true);
      }
    });
  }

  // 4. Get Discount Usages by User
  const getDiscountUsagesByUserForm = document.getElementById('get-discount-usages-by-user-form');
  if (getDiscountUsagesByUserForm) {
    getDiscountUsagesByUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getDiscountUsagesByUserForm);
      const userId = formData.get('user_id');

      if (!userId) {
        displayResponse('get-discount-usages-by-user-response', { error: 'User ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(userId)) {
        displayResponse('get-discount-usages-by-user-response', { error: 'User ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discount_usages/user/${userId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            result.error = result.error || 'Authentication failed or User ID does not match session.';
          }
        }
        displayResponse('get-discount-usages-by-user-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching discount usages by user:', error);
        displayResponse('get-discount-usages-by-user-response', { error: 'Failed to fetch discount usages. Network error.' }, true);
      }
    });
  }

  // 5. Delete Discount Usage
  const deleteDiscountUsageForm = document.getElementById('delete-discount-usage-form');
  if (deleteDiscountUsageForm) {
    deleteDiscountUsageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteDiscountUsageForm);
      const usageId = formData.get('usage_id');

      if (!usageId) {
        displayResponse('delete-discount-usage-response', { error: 'Usage ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(usageId)) {
        displayResponse('delete-discount-usage-response', { error: 'Usage ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discount_usages/${usageId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            result.error = result.error || 'Admin privileges required. Please log in as an admin.';
          }
        }
        displayResponse('delete-discount-usage-response', result, !response.ok);
      } catch (error) {
        console.error('Error deleting discount usage:', error);
        displayResponse('delete-discount-usage-response', { error: 'Failed to delete discount usage. Network error.' }, true);
      }
    });
  }

  // 6. Get All Discount Usages
  const getAllDiscountUsagesForm = document.getElementById('get-all-discount-usages-form');
  if (getAllDiscountUsagesForm) {
    getAllDiscountUsagesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllDiscountUsagesForm);
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;

      if (!validatePositiveInteger(page)) {
        displayResponse('get-all-discount-usages-response', { error: 'Page must be a positive integer' }, true);
        return;
      }

      if (!validatePositiveInteger(perPage)) {
        displayResponse('get-all-discount-usages-response', { error: 'Per Page must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discount_usages?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            result.error = result.error || 'Admin privileges required. Please log in as an admin.';
          }
        }
        displayResponse('get-all-discount-usages-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching all discount usages:', error);
        displayResponse('get-all-discount-usages-response', { error: 'Failed to fetch discount usages. Network error.' }, true);
      }
    });
  }
});