document.addEventListener('DOMContentLoaded', () => {
  // Set API URL in the page
  const apiUrlElement = document.getElementById('api-url');
  if (apiUrlElement) {
    apiUrlElement.href = BASE_URL;
    apiUrlElement.textContent = BASE_URL;
  }

  // Helper function to validate positive integer
  const validatePositiveInteger = (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 1;
  };

  // Helper function to validate discount percent
  const validateDiscountPercent = (percent) => {
    const num = parseFloat(percent);
    return !isNaN(num) && num >= 0 && num <= 100;
  };

  // Helper function to convert datetime-local to ISO 8601
  const toISO8601 = (datetime) => {
    if (!datetime) return null;
    return new Date(datetime).toISOString();
  };

  // Helper function to validate date range
  const validateDateRange = (start, end) => {
    if (!start || !end) return true;
    return new Date(start) <= new Date(end);
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
    } else if (Array.isArray(data.product_discounts)) {
      pre.textContent = JSON.stringify({ product_discounts: data.product_discounts }, null, 2);
    } else if (data.product_discounts && data.total) {
      pre.textContent = JSON.stringify({
        product_discounts: data.product_discounts,
        total: data.total,
        page: data.page,
        per_page: data.per_page
      }, null, 2);
    } else {
      pre.textContent = JSON.stringify(data, null, 2);
    }
    
    responseElement.appendChild(pre);
  };

  // 1. Add New Product Discount
  const addProductDiscountForm = document.getElementById('add-product-discount-form');
  if (addProductDiscountForm) {
    addProductDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addProductDiscountForm);
      const data = Object.fromEntries(formData);

      if (!data.product_id || !data.discount_percent) {
        displayResponse('add-product-discount-response', { error: 'Product ID and discount percent are required' }, true);
        return;
      }

      if (!validatePositiveInteger(data.product_id)) {
        displayResponse('add-product-discount-response', { error: 'Product ID must be a positive integer' }, true);
        return;
      }

      if (!validateDiscountPercent(data.discount_percent)) {
        displayResponse('add-product-discount-response', { error: 'Discount percent must be between 0 and 100' }, true);
        return;
      }

      if (!validateDateRange(data.starts_at, data.ends_at)) {
        displayResponse('add-product-discount-response', { error: 'starts_at must be before ends_at' }, true);
        return;
      }

      const body = {
        product_id: parseInt(data.product_id),
        discount_percent: parseFloat(data.discount_percent),
      };
      if (data.starts_at) body.starts_at = toISO8601(data.starts_at);
      if (data.ends_at) body.ends_at = toISO8601(data.ends_at);
      if (data.is_active !== undefined) body.is_active = parseInt(data.is_active);

      try {
        const response = await fetch(`${BASE_URL}/product_discounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        if (!response.ok && (response.status === 401 || response.status === 403)) {
          result.error = result.error || 'Admin privileges required. Please log in as an admin.';
        }
        displayResponse('add-product-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error adding product discount:', error);
        displayResponse('add-product-discount-response', { error: 'Failed to add product discount. Network error.' }, true);
      }
    });
  }

  // 2. Get Product Discount by ID
  const getProductDiscountByIdForm = document.getElementById('get-product-discount-by-id-form');
  if (getProductDiscountByIdForm) {
    getProductDiscountByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getProductDiscountByIdForm);
      const discountId = formData.get('discount_id');

      if (!discountId) {
        displayResponse('get-product-discount-response', { error: 'Discount ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(discountId)) {
        displayResponse('get-product-discount-response', { error: 'Discount ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/product_discounts/${discountId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok && (response.status === 401 || response.status === 403)) {
          result.error = result.error || 'Admin privileges required. Please log in as an admin.';
        }
        displayResponse('get-product-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching product discount by ID:', error);
        displayResponse('get-product-discount-response', { error: 'Failed to fetch product discount. Network error.' }, true);
      }
    });
  }

  // 3. Get Product Discounts by Product
  const getProductDiscountsByProductForm = document.getElementById('get-product-discounts-by-product-form');
  if (getProductDiscountsByProductForm) {
    getProductDiscountsByProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getProductDiscountsByProductForm);
      const productId = formData.get('product_id');

      if (!productId) {
        displayResponse('get-product-discounts-by-product-response', { error: 'Product ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(productId)) {
        displayResponse('get-product-discounts-by-product-response', { error: 'Product ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/product_discounts/product/${productId}`, {
          method: 'GET'
        });
        const result = await response.json();
        displayResponse('get-product-discounts-by-product-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching product discounts by product:', error);
        displayResponse('get-product-discounts-by-product-response', { error: 'Failed to fetch product discounts. Network error.' }, true);
      }
    });
  }

  // 4. Get Valid Product Discounts
  const getValidProductDiscountsForm = document.getElementById('get-valid-product-discounts-form');
  if (getValidProductDiscountsForm) {
    getValidProductDiscountsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getValidProductDiscountsForm);
      const productId = formData.get('product_id');

      if (!productId) {
        displayResponse('get-valid-product-discounts-response', { error: 'Product ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(productId)) {
        displayResponse('get-valid-product-discounts-response', { error: 'Product ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/product_discounts/valid/${productId}`, {
          method: 'GET'
        });
        const result = await response.json();
        displayResponse('get-valid-product-discounts-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching valid product discounts:', error);
        displayResponse('get-valid-product-discounts-response', { error: 'Failed to fetch valid product discounts. Network error.' }, true);
      }
    });
  }

  // 5. Update Product Discount
  const updateProductDiscountForm = document.getElementById('update-product-discount-form');
  if (updateProductDiscountForm) {
    updateProductDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(updateProductDiscountForm);
      const data = Object.fromEntries(formData);

      if (!data.discount_id) {
        displayResponse('update-product-discount-response', { error: 'Discount ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(data.discount_id)) {
        displayResponse('update-product-discount-response', { error: 'Discount ID must be a positive integer' }, true);
        return;
      }

      if (data.discount_percent && !validateDiscountPercent(data.discount_percent)) {
        displayResponse('update-product-discount-response', { error: 'Discount percent must be between 0 and 100' }, true);
        return;
      }

      if (!validateDateRange(data.starts_at, data.ends_at)) {
        displayResponse('update-product-discount-response', { error: 'starts_at must be before ends_at' }, true);
        return;
      }

      const body = {};
      if (data.discount_percent) body.discount_percent = parseFloat(data.discount_percent);
      if (data.starts_at) body.starts_at = toISO8601(data.starts_at);
      if (data.ends_at) body.ends_at = toISO8601(data.ends_at);
      if (data.is_active !== '') body.is_active = parseInt(data.is_active);

      if (Object.keys(body).length === 0) {
        displayResponse('update-product-discount-response', { error: 'At least one field must be provided' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/product_discounts/${data.discount_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        if (!response.ok && (response.status === 401 || response.status === 403)) {
          result.error = result.error || 'Admin privileges required. Please log in as an admin.';
        }
        displayResponse('update-product-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error updating product discount:', error);
        displayResponse('update-product-discount-response', { error: 'Failed to update product discount. Network error.' }, true);
      }
    });
  }

  // 6. Delete Product Discount
  const deleteProductDiscountForm = document.getElementById('delete-product-discount-form');
  if (deleteProductDiscountForm) {
    deleteProductDiscountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteProductDiscountForm);
      const discountId = formData.get('discount_id');

      if (!discountId) {
        displayResponse('delete-product-discount-response', { error: 'Discount ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(discountId)) {
        displayResponse('delete-product-discount-response', { error: 'Discount ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/product_discounts/${discountId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok && (response.status === 401 || response.status === 403)) {
          result.error = result.error || 'Admin privileges required. Please log in as an admin.';
        }
        displayResponse('delete-product-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error deleting product discount:', error);
        displayResponse('delete-product-discount-response', { error: 'Failed to delete product discount. Network error.' }, true);
      }
    });
  }

  // 7. Get All Product Discounts
  const getAllProductDiscountsForm = document.getElementById('get-all-product-discounts-form');
  if (getAllProductDiscountsForm) {
    getAllProductDiscountsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllProductDiscountsForm);
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;

      if (!validatePositiveInteger(page)) {
        displayResponse('get-all-product-discounts-response', { error: 'Page must be a positive integer' }, true);
        return;
      }

      if (!validatePositiveInteger(perPage)) {
        displayResponse('get-all-product-discounts-response', { error: 'Per Page must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/product_discounts?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok && (response.status === 401 || response.status === 403)) {
          result.error = result.error || 'Admin privileges required. Please log in as an admin.';
        }
        displayResponse('get-all-product-discounts-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching all product discounts:', error);
        displayResponse('get-all-product-discounts-response', { error: 'Failed to fetch product discounts. Network error.' }, true);
      }
    });
  }
});