document.addEventListener('DOMContentLoaded', () => {
  // Helper function to validate discount percent
  const validateDiscountPercent = (percent) => {
    const num = parseFloat(percent);
    return !isNaN(num) && num >= 0 && num <= 100;
  };

  // Helper function to validate max uses
  const validateMaxUses = (uses) => {
    const num = parseInt(uses);
    return isNaN(num) || num >= 0;
  };

  // Helper function to validate non-empty string
  const validateString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
  };

  // Helper function to convert datetime-local to ISO 8601
  const toISO8601 = (datetime) => {
    if (!datetime) return null;
    return new Date(datetime).toISOString();
  };

  // 1. Add New Discount
  const addDiscountForm = document.getElementById('add-discount-form');
  if (addDiscountForm) {
    addDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addDiscountForm);
      const data = Object.fromEntries(formData);

      if (!data.code || !data.discount_percent) {
        displayResponse('add-discount-response', { error: 'Code and discount percent are required' }, true);
        return;
      }

      if (!validateString(data.code)) {
        displayResponse('add-discount-response', { error: 'Code must be a valid string' }, true);
        return;
      }

      if (!validateDiscountPercent(data.discount_percent)) {
        displayResponse('add-discount-response', { error: 'Discount percent must be between 0 and 100' }, true);
        return;
      }

      if (data.max_uses && !validateMaxUses(data.max_uses)) {
        displayResponse('add-discount-response', { error: 'Max uses must be non-negative' }, true);
        return;
      }

      try {
        const body = {
          code: data.code,
          discount_percent: parseFloat(data.discount_percent),
        };
        if (data.max_uses) body.max_uses = parseInt(data.max_uses);
        if (data.expires_at) body.expires_at = toISO8601(data.expires_at);
        if (data.description) body.description = data.description;

        const response = await fetch(`${BASE_URL}/discounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('add-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error adding discount:', error);
        displayResponse('add-discount-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 2. Get Discount by ID
  const getDiscountByIdForm = document.getElementById('get-discount-by-id-form');
  if (getDiscountByIdForm) {
    getDiscountByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getDiscountByIdForm);
      const discountId = formData.get('discount_id');

      if (!discountId) {
        displayResponse('get-discount-by-id-response', { error: 'Discount ID is required' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discounts/${discountId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-discount-by-id-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching discount:', error);
        displayResponse('get-discount-by-id-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 3. Get Discount by Code
  const getDiscountByCodeForm = document.getElementById('get-discount-by-code-form');
  if (getDiscountByCodeForm) {
    getDiscountByCodeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getDiscountByCodeForm);
      const code = formData.get('code');
      const userId = formData.get('user_id');

      if (!code || !userId) {
        displayResponse('get-discount-by-code-response', { error: 'Discount code and User ID are required' }, true);
        return;
      }

      if (!validateString(code)) {
        displayResponse('get-discount-by-code-response', { error: 'Code must be a valid string' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discounts/code/${encodeURIComponent(code)}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-discount-by-code-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching discount by code:', error);
        displayResponse('get-discount-by-code-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 4. Get Valid Discount by Code
  const getValidDiscountByCodeForm = document.getElementById('get-valid-discount-by-code-form');
  if (getValidDiscountByCodeForm) {
    getValidDiscountByCodeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getValidDiscountByCodeForm);
      const code = formData.get('code');
      const userId = formData.get('user_id');

      if (!code || !userId) {
        displayResponse('get-valid-discount-by-code-response', { error: 'Discount code and User ID are required' }, true);
        return;
      }

      if (!validateString(code)) {
        displayResponse('get-valid-discount-by-code-response', { error: 'Code must be a valid string' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discounts/valid/${encodeURIComponent(code)}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-valid-discount-by-code-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching valid discount:', error);
        displayResponse('get-valid-discount-by-code-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 5. Update Discount
  const updateDiscountForm = document.getElementById('update-discount-form');
  if (updateDiscountForm) {
    updateDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(updateDiscountForm);
      const data = Object.fromEntries(formData);

      if (!data.discount_id) {
        displayResponse('update-discount-response', { error: 'Discount ID is required' }, true);
        return;
      }

      if (data.discount_percent && !validateDiscountPercent(data.discount_percent)) {
        displayResponse('update-discount-response', { error: 'Discount percent must be between 0 and 100' }, true);
        return;
      }

      if (data.max_uses && !validateMaxUses(data.max_uses)) {
        displayResponse('update-discount-response', { error: 'Max uses must be non-negative' }, true);
        return;
      }

      const body = {};
      if (data.code && validateString(data.code)) body.code = data.code;
      if (data.discount_percent) body.discount_percent = parseFloat(data.discount_percent);
      if (data.max_uses) body.max_uses = parseInt(data.max_uses);
      if (data.expires_at) body.expires_at = toISO8601(data.expires_at);
      if (data.description) body.description = data.description;
      if (data.is_active !== '') body.is_active = parseInt(data.is_active);

      if (Object.keys(body).length === 0) {
        displayResponse('update-discount-response', { error: 'At least one field must be provided' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discounts/${data.discount_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('update-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error updating discount:', error);
        displayResponse('update-discount-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 6. Delete Discount
  const deleteDiscountForm = document.getElementById('delete-discount-form');
  if (deleteDiscountForm) {
    deleteDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteDiscountForm);
      const discountId = formData.get('discount_id');

      if (!discountId) {
        displayResponse('delete-discount-response', { error: 'Discount ID is required' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/discounts/${discountId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('delete-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error deleting discount:', error);
        displayResponse('delete-discount-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 7. Get All Discounts
  const getAllDiscountsForm = document.getElementById('get-all-discounts-form');
  if (getAllDiscountsForm) {
    getAllDiscountsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllDiscountsForm);
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;

      try {
        const response = await fetch(`${BASE_URL}/discounts?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-all-discounts-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching all discounts:', error);
        displayResponse('get-all-discounts-response', { error: 'Internal server error' }, true);
      }
    });
  }
});