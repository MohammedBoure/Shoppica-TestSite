document.addEventListener('DOMContentLoaded', () => {
  // Set API URL display
  const apiLink = document.getElementById('api-url');
  if (apiLink) {
    apiLink.href = BASE_URL;
    apiLink.textContent = BASE_URL;
  }

  // Helper function to validate positive integer
  const validatePositiveInteger = (id) => {
    const value = parseInt(id);
    return !isNaN(value) && value >= 1;
  };

  // Helper function to validate discount percent
  const validateDiscountPercent = (percent) => {
    const num = parseFloat(percent);
    return !isNaN(num) && num > 0;
  };

  // Helper function to convert datetime-local to ISO 8601
  const toISO8601 = (datetime) => {
    if (!datetime) return null;
    const date = new Date(datetime);
    return date.toISOString().replace('.000Z', 'Z');
  };

  // Helper function to validate date range
  const validateDateRange = (start, end) => {
    if (!start || !end) return true;
    return new Date(start) <= new Date(end);
  };

  // 1. Add New Category Discount
  const addCategoryDiscountForm = document.getElementById('add-category-discount-form');
  if (addCategoryDiscountForm) {
    addCategoryDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addCategoryDiscountForm);
      const data = Object.fromEntries(formData);

      if (!data.category_id || !data.discount_percent) {
        displayResponse('add-category-discount-response', { error: 'Category ID and discount percent are required' }, true);
        return;
      }

      if (!validatePositiveInteger(data.category_id)) {
        displayResponse('add-category-discount-response', { error: 'Category ID must be a positive integer' }, true);
        return;
      }

      if (!validateDiscountPercent(data.discount_percent)) {
        displayResponse('add-category-discount-response', { error: 'Discount percent must be a positive number' }, true);
        return;
      }

      if (!validateDateRange(data.starts_at, data.ends_at)) {
        displayResponse('add-category-discount-response', { error: 'Start date must be before end date' }, true);
        return;
      }

      try {
        const body = {
          category_id: parseInt(data.category_id),
          discount_percent: parseFloat(data.discount_percent),
          is_active: parseInt(data.is_active)
        };
        if (data.starts_at) body.starts_at = toISO8601(data.starts_at);
        if (data.ends_at) body.ends_at = toISO8601(data.ends_at);

        const response = await fetch(`${BASE_URL}/category_discounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('add-category-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error adding category discount:', error);
        displayResponse('add-category-discount-response', { error: 'An internal server error occurred' }, true);
      }
    });
  }

  // 2. Update Category Discount
  const updateCategoryDiscountForm = document.getElementById('update-category-discount-form');
  if (updateCategoryDiscountForm) {
    updateCategoryDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(updateCategoryDiscountForm);
      const data = Object.fromEntries(formData);

      if (!data.discount_id) {
        displayResponse('update-category-discount-response', { error: 'Discount ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(data.discount_id)) {
        displayResponse('update-category-discount-response', { error: 'Discount ID must be a positive integer' }, true);
        return;
      }

      if (data.discount_percent && !validateDiscountPercent(data.discount_percent)) {
        displayResponse('update-category-discount-response', { error: 'Discount percent must be a positive number' }, true);
        return;
      }

      if (!validateDateRange(data.starts_at, data.ends_at)) {
        displayResponse('update-category-discount-response', { error: 'Start date must be before end date' }, true);
        return;
      }

      const body = {};
      if (data.discount_percent) body.discount_percent = parseFloat(data.discount_percent);
      if (data.starts_at) body.starts_at = toISO8601(data.starts_at);
      if (data.ends_at) body.ends_at = toISO8601(data.ends_at);
      if (data.is_active !== '') body.is_active = parseInt(data.is_active);

      if (Object.keys(body).length === 0) {
        displayResponse('update-category-discount-response', { error: 'At least one field must be provided' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/category_discounts/${data.discount_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('update-category-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error updating category discount:', error);
        displayResponse('update-category-discount-response', { error: 'An internal server error occurred' }, true);
      }
    });
  }

  // 3. Get Category Discount by ID
  const getCategoryDiscountByIdForm = document.getElementById('get-category-discount-by-id-form');
  if (getCategoryDiscountByIdForm) {
    getCategoryDiscountByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getCategoryDiscountByIdForm);
      const discountId = formData.get('discount_id');

      if (!discountId) {
        displayResponse('get-category-discount-by-id-response', { error: 'Discount ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(discountId)) {
        displayResponse('get-category-discount-by-id-response', { error: 'Discount ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/category_discounts/${discountId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-category-discount-by-id-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching category discount by ID:', error);
        displayResponse('get-category-discount-by-id-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 4. Get Discounts by Category
  const getDiscountsByCategoryForm = document.getElementById('get-discounts-by-category-form');
  if (getDiscountsByCategoryForm) {
    getDiscountsByCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getDiscountsByCategoryForm);
      const categoryId = formData.get('category_id');

      if (!categoryId) {
        displayResponse('get-discounts-by-category-response', { error: 'Category ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(categoryId)) {
        displayResponse('get-discounts-by-category-response', { error: 'Category ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/category_discounts/category/${categoryId}`, {
          method: 'GET'
        });
        const result = await response.json();
        displayResponse('get-discounts-by-category-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching discounts by category:', error);
        displayResponse('get-discounts-by-category-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 5. Get Valid Category Discounts
  const getValidCategoryDiscountsForm = document.getElementById('get-valid-category-discounts-form');
  if (getValidCategoryDiscountsForm) {
    getValidCategoryDiscountsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getValidCategoryDiscountsForm);
      const categoryId = formData.get('category_id');

      if (!categoryId) {
        displayResponse('get-valid-category-discounts-response', { error: 'Category ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(categoryId)) {
        displayResponse('get-valid-category-discounts-response', { error: 'Category ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/category_discounts/valid/${categoryId}`, {
          method: 'GET'
        });
        const result = await response.json();
        displayResponse('get-valid-category-discounts-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching valid category discounts:', error);
        displayResponse('get-valid-category-discounts-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 6. Delete Category Discount
  const deleteCategoryDiscountForm = document.getElementById('delete-category-discount-form');
  if (deleteCategoryDiscountForm) {
    deleteCategoryDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteCategoryDiscountForm);
      const discountId = formData.get('discount_id');

      if (!discountId) {
        displayResponse('delete-category-discount-response', { error: 'Discount ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(discountId)) {
        displayResponse('delete-category-discount-response', { error: 'Discount ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/category_discounts/${discountId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('delete-category-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error deleting category discount:', error);
        displayResponse('delete-category-discount-response', { error: 'Internal server error' }, true);
      }
    });
  }

  // 7. Get All Category Discounts
  const getAllCategoryDiscountsForm = document.getElementById('get-all-category-discounts-form');
  if (getAllCategoryDiscountsForm) {
    getAllCategoryDiscountsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllCategoryDiscountsForm);
      const page = parseInt(formData.get('page')) || 1;
      const perPage = parseInt(formData.get('per_page')) || 20;

      if (!validatePositiveInteger(page) || !validatePositiveInteger(perPage)) {
        displayResponse('get-all-category-discounts-response', { error: 'Page and per_page must be positive integers' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/category_discounts?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-all-category-discounts-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching all category discounts:', error);
        displayResponse('get-all-category-discounts-response', { error: 'Internal server error' }, true);
      }
    });
  }
});

