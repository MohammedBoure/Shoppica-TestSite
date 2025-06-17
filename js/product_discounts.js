document.addEventListener('DOMContentLoaded', () => {
  // Helper function to validate positive integer
  const validatePositiveInteger = (id) => {
    const value = parseInt(id);
    return !isNaN(value) && value >= 1;
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
  const validateDateRange = (start, endDate) => {
    if (!start || !endDate) return true;
    return new Date(start) <= new Date(endDate);
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

      try {
        const body = {
          product_id: parseInt(data.product_id),
          discount_percent: parseFloat(data.discount_percent),
        };
        if (data.starts_at) body.starts_at = toISO8601(data.starts_at);
        if (data.ends_at) body.ends_at = toISO8601(data.ends_at);
        if (data.is_active !== undefined) body.is_active = parseInt(data.is_active);

        const response = await fetch(`${BASE_URL}/product_discounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('add-product-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error adding product discount:', error);
        displayResponse('add-product-discount-response', { error: 'Internal server error' }, true);
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
        displayResponse('get-product-discount-by-id-response', { error: 'Discount ID is required' }, true);
        return;
      }

      if (!validatePositiveInteger(discountId)) {
        displayResponse('get-product-discount-by-id-response', { error: 'Discount ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/product_discounts/${discountId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-product-discount-by-id-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching product discount by ID:', error);
        displayResponse('get-product-discount-by-id-response', { error: 'Internal server error' }, true);
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
          // No credentials needed for public access
        });
        const result = await response.json();
        displayResponse('get-product-discounts-by-product-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching product discounts by product:', error);
        displayResponse('get-product-discounts-by-product-response', { error: 'Internal server error' }, true);
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
          // No credentials needed for public access
        });
        const result = await response.json();
        displayResponse('get-valid-product-discounts-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching valid product discounts:', error);
        displayResponse('get-valid-product-discounts-response', { error: 'Internal server error' }, true);
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
        displayResponse('update-product-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error updating product discount:', error);
        displayResponse('update-product-discount-response', { error: 'Internal server error' }, true);
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
        displayResponse('delete-product-discount-response', result, !response.ok);
      } catch (error) {
        console.error('Error deleting product discount:', error);
        displayResponse('delete-product-discount-response', { error: 'Internal server error' }, true);
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

      try {
        const response = await fetch(`${BASE_URL}/product_discounts?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-all-product-discounts-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching all product discounts:', error);
        displayResponse('get-all-product-discounts-response', { error: 'Internal server error' }, true);
      }
    });
  }
});