document.addEventListener('DOMContentLoaded', () => {
  // Helper function to validate positive integer
  const validatePositiveInteger = (num) => {
    const value = parseInt(num);
    return !isNaN(value) && value >= 1;
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
        displayResponse('add-discount-usage-response', result, !response.ok);
      } catch (error) {
        console.error('Error adding discount usage:', error);
        displayResponse('add-discount-usage-response', { error: 'Failed to add discount usage' }, true);
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
        displayResponse('get-discount-usage-by-id-response', { error: 'Usage ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(usageId)) {
        displayResponse('get-discount-usage-by-id-response', { error: 'Usage ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discount_usages/${usageId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-discount-usage-by-id-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching discount usage:', error);
        displayResponse('get-discount-usage-by-id-response', { error: 'Internal server error' }, true);
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
        displayResponse('get-discount-usages-by-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching discount usages by discount:', error);
        displayResponse('get-discount-usages-by-discount-response', { error: 'Internal server error' }, true);
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
        displayResponse('get-discount-usages-by-user-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching discount usages by user:', error);
        displayResponse('get-discount-usages-by-user-response', { error: 'Internal server error' }, true);
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
        displayResponse('delete-discount-usage-response', result, !response.ok);
      } catch (error) {
        console.error('Error deleting discount usage:', error);
        displayResponse('delete-discount-usage-response', { error: 'Internal server error' }, true);
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

      try {
        const response = await fetch(`${BASE_URL}/discount_usages?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-all-discount-usages-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching all discount usages:', error);
        displayResponse('get-all-discount-usages-response', { error: 'Internal server error' }, true);
      }
    });
  }
});