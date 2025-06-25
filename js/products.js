console.log('products.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');

  // Fallback for getBackendUrl if not defined in config.js
  window.getBackendUrl = window.getBackendUrl || (() => 'http://localhost:5000');

  // Fallback for displayResponse if not defined in config.js
  window.displayResponse = window.displayResponse || ((elementId, response, isError = false) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found`);
      return;
    }
    element.innerHTML = '';
    const message = isError ? (response.error || 'Unknown error') : (response.message || JSON.stringify(response, null, 2));
    const className = isError ? 'text-red-600' : 'text-green-600';
    element.innerHTML = `<pre class="${className}">${message}</pre>`;
  });

  // Add New Product
  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Add Product form submitted');
      const formData = new FormData(e.target);
      if (!formData.get('name') || !formData.get('price') || !formData.get('stock_quantity') || !formData.get('low_stock_threshold')) {
        displayResponse('add-product-response', { error: 'Name, price, stock quantity, and low stock threshold are required' }, true);
        return;
      }
      const price = parseFloat(formData.get('price'));
      const stock_quantity = parseInt(formData.get('stock_quantity'));
      const low_stock_threshold = parseInt(formData.get('low_stock_threshold'));
      const category_id = formData.get('category_id') ? parseInt(formData.get('category_id')) : null;
      const is_active = parseInt(formData.get('is_active'));
      if (isNaN(price) || isNaN(stock_quantity) || isNaN(low_stock_threshold)) {
        displayResponse('add-product-response', { error: 'Price, stock quantity, and low stock threshold must be valid numbers' }, true);
        return;
      }
      if (price < 0 || stock_quantity < 0 || low_stock_threshold < 0) {
        displayResponse('add-product-response', { error: 'Price, stock quantity, and low stock threshold must be non-negative' }, true);
        return;
      }
      if (category_id && (isNaN(category_id) || category_id < 1)) {
        displayResponse('add-product-response', { error: 'Category ID must be a positive integer' }, true);
        return;
      }
      if (![0, 1].includes(is_active)) {
        displayResponse('add-product-response', { error: 'Is active must be 0 or 1' }, true);
        return;
      }
      if (formData.get('image') && formData.get('image').size > 0) {
        const file = formData.get('image');
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          displayResponse('add-product-response', { error: 'Invalid image file. Allowed extensions: jpg, jpeg, png' }, true);
          return;
        }
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('add-product-response', result);
      } catch (error) {
        console.error('Error adding product:', error);
        displayResponse('add-product-response', error, true);
      }
    });
  }

  // Search Products
  const searchProductsForm = document.getElementById('search-products-form');
  if (searchProductsForm) {
    searchProductsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Search Products form submitted');
      const formData = new FormData(e.target);
      const search_term = formData.get('search_term');
      const page = parseInt(formData.get('page')) || 1;
      const per_page = parseInt(formData.get('per_page')) || 20;
      if (!search_term) {
        displayResponse('search-products-response', { error: 'Search term is required' }, true);
        return;
      }
      if (page < 1 || per_page < 1) {
        displayResponse('search-products-response', { error: 'Page and per_page must be positive integers' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/search?search_term=${encodeURIComponent(search_term)}&page=${page}&per_page=${per_page}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('search-products-response', result);
      } catch (error) {
        console.error('Error searching products:', error);
        displayResponse('search-products-response', error, true);
      }
    });
  }

  // Get Product by ID
  const getProductByIdForm = document.getElementById('get-product-by-id-form');
  if (getProductByIdForm) {
    getProductByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get Product by ID form submitted');
      const formData = new FormData(e.target);
      const productId = parseInt(formData.get('product_id'));
      if (isNaN(productId) || productId < 1) {
        displayResponse('get-product-by-id-response', { error: 'Product ID must be a positive integer' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/${productId}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('get-product-by-id-response', result);
      } catch (error) {
        console.error('Error fetching product by ID:', error);
        displayResponse('get-product-by-id-response', error, true);
      }
    });
  }

  // Get Products by Category
  const getProductsByCategoryForm = document.getElementById('get-products-by-category-form');
  if (getProductsByCategoryForm) {
    getProductsByCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get Products by Category form submitted');
      const formData = new FormData(e.target);
      const categoryId = parseInt(formData.get('category_id'));
      if (isNaN(categoryId) || categoryId < 1) {
        displayResponse('get-products-by-category-response', { error: 'Category ID must be a positive integer' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/category/${categoryId}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('get-products-by-category-response', result);
      } catch (error) {
        console.error('Error fetching products by category:', error);
        displayResponse('get-products-by-category-response', error, true);
      }
    });
  }

  // Update Product
  const updateProductForm = document.getElementById('update-product-form');
  if (updateProductForm) {
    updateProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Update Product form submitted');
      const formData = new FormData(e.target);
      const productId = parseInt(formData.get('product_id'));
      const price = formData.get('price') ? parseFloat(formData.get('price')) : null;
      const stock_quantity = formData.get('stock_quantity') ? parseInt(formData.get('stock_quantity')) : null;
      const low_stock_threshold = formData.get('low_stock_threshold') ? parseInt(formData.get('low_stock_threshold')) : null;
      const category_id = formData.get('category_id') ? parseInt(formData.get('category_id')) : null;
      const is_active = formData.get('is_active') ? parseInt(formData.get('is_active')) : null;
      if (!productId || isNaN(productId) || productId < 1) {
        displayResponse('update-product-response', { error: 'Product ID must be a positive integer' }, true);
        return;
      }
      const hasData = formData.get('name') || formData.get('description') || price !== null ||
                      stock_quantity !== null || low_stock_threshold !== null || category_id !== null ||
                      formData.get('image').size > 0 || is_active !== null;
      if (!hasData) {
        displayResponse('update-product-response', { error: 'At least one field must be provided' }, true);
        return;
      }
      if (price !== null && (isNaN(price) || price < 0)) {
        displayResponse('update-product-response', { error: 'Price must be a valid non-negative number' }, true);
        return;
      }
      if (stock_quantity !== null && (isNaN(stock_quantity) || stock_quantity < 0)) {
        displayResponse('update-product-response', { error: 'Stock quantity must be a valid non-negative integer' }, true);
        return;
      }
      if (low_stock_threshold !== null && (isNaN(low_stock_threshold) || low_stock_threshold < 0)) {
        displayResponse('update-product-response', { error: 'Low stock threshold must be a valid non-negative integer' }, true);
        return;
      }
      if (category_id !== null && (isNaN(category_id) || category_id < 1)) {
        displayResponse('update-product-response', { error: 'Category ID must be a positive integer' }, true);
        return;
      }
      if (is_active !== null && ![0, 1].includes(is_active)) {
        displayResponse('update-product-response', { error: 'Is active must be 0 or 1' }, true);
        return;
      }
      if (formData.get('image') && formData.get('image').size > 0) {
        const file = formData.get('image');
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          displayResponse('update-product-response', { error: 'Invalid image file. Allowed extensions: jpg, jpeg, png' }, true);
          return;
        }
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/${productId}`, {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('update-product-response', result);
      } catch (error) {
        console.error('Error updating product:', error);
        displayResponse('update-product-response', error, true);
      }
    });
  }

  // Delete Product
  const deleteProductForm = document.getElementById('delete-product-form');
  if (deleteProductForm) {
    deleteProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Delete Product form submitted');
      const formData = new FormData(e.target);
      const productId = parseInt(formData.get('product_id'));
      if (isNaN(productId) || productId < 1) {
        displayResponse('delete-product-response', { error: 'Product ID must be a positive integer' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('delete-product-response', result);
      } catch (error) {
        console.error('Error deleting product:', error);
        displayResponse('delete-product-response', error, true);
      }
    });
  }

  // Get All Products
  const getAllProductsForm = document.getElementById('get-all-products-form');
  if (getAllProductsForm) {
    getAllProductsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get All Products form submitted');
      const formData = new FormData(e.target);
      const page = parseInt(formData.get('page')) || 1;
      const perPage = parseInt(formData.get('per_page')) || 20;
      if (page < 1 || perPage < 1) {
        displayResponse('get-all-products-response', { error: 'Page and per_page must be positive integers' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products?page=${page}&per_page=${perPage}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('get-all-products-response', result);
      } catch (error) {
        console.error('Error fetching all products:', error);
        displayResponse('get-all-products-response', error, true);
      }
    });
  }

  // Add Product Image
  const addProductImageForm = document.getElementById('add-product-image-form');
  if (addProductImageForm) {
    addProductImageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Add Product Image form submitted');
      const formData = new FormData(e.target);
      const productId = parseInt(formData.get('product_id'));
      const file = formData.get('image');
      if (!productId || isNaN(productId) || productId < 1) {
        displayResponse('add-product-image-response', { error: 'Product ID must be a positive integer' }, true);
        return;
      }
      if (!file || file.size === 0) {
        displayResponse('add-product-image-response', { error: 'Image file is required' }, true);
        return;
      }
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        displayResponse('add-product-image-response', { error: 'Invalid image file. Allowed extensions: jpg, jpeg, png' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/${productId}/images`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('add-product-image-response', result);
      } catch (error) {
        console.error('Error adding product image:', error);
        displayResponse('add-product-image-response', error, true);
      }
    });
  }

  // Get Product Image by ID
  const getProductImageByIdForm = document.getElementById('get-product-image-by-id-form');
  if (getProductImageByIdForm) {
    getProductImageByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get Product Image by ID form submitted');
      const formData = new FormData(e.target);
      const imageId = parseInt(formData.get('image_id'));
      if (isNaN(imageId) || imageId < 1) {
        displayResponse('get-product-image-by-id-response', { error: 'Image ID must be a positive integer' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/images/${imageId}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('get-product-image-by-id-response', result);
      } catch (error) {
        console.error('Error fetching product image by ID:', error);
        displayResponse('get-product-image-by-id-response', error, true);
      }
    });
  }

  // Get Images by Product
  const getImagesByProductForm = document.getElementById('get-images-by-product-form');
  if (getImagesByProductForm) {
    getImagesByProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get Images by Product form submitted');
      const formData = new FormData(e.target);
      const productId = parseInt(formData.get('product_id'));
      if (isNaN(productId) || productId < 1) {
        displayResponse('get-images-by-product-response', { error: 'Product ID must be a positive integer' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/${productId}/images`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('get-images-by-product-response', result);
      } catch (error) {
        console.error('Error fetching images by product:', error);
        displayResponse('get-images-by-product-response', error, true);
      }
    });
  }

  // Update Product Image
  const updateProductImageForm = document.getElementById('update-product-image-form');
  if (updateProductImageForm) {
    updateProductImageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Update Product Image form submitted');
      const formData = new FormData(e.target);
      const imageId = parseInt(formData.get('image_id'));
      const file = formData.get('image');
      if (!imageId || isNaN(imageId) || imageId < 1) {
        displayResponse('update-product-image-response', { error: 'Image ID must be a positive integer' }, true);
        return;
      }
      if (!file || file.size === 0) {
        displayResponse('update-product-image-response', { error: 'Image file is required' }, true);
        return;
      }
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        displayResponse('update-product-image-response', { error: 'Invalid image file. Allowed extensions: jpg, jpeg, png' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/images/${imageId}`, {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('update-product-image-response', result);
      } catch (error) {
        console.error('Error updating product image:', error);
        displayResponse('update-product-image-response', error, true);
      }
    });
  }

  // Delete Product Image
  const deleteProductImageForm = document.getElementById('delete-product-image-form');
  if (deleteProductImageForm) {
    deleteProductImageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Delete Product Image form submitted');
      const formData = new FormData(e.target);
      const imageId = parseInt(formData.get('image_id'));
      if (isNaN(imageId) || imageId < 1) {
        displayResponse('delete-product-image-response', { error: 'Image ID must be a positive integer' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/products/images/${imageId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('delete-product-image-response', result);
      } catch (error) {
        console.error('Error deleting product image:', error);
        displayResponse('delete-product-image-response', error, true);
      }
    });
  }

  // Get Number Products
  const getTotalProductsBtn = document.getElementById('get-total-products-btn');
  if (getTotalProductsBtn) {
    getTotalProductsBtn.addEventListener('click', async () => {
      console.log('Get Total Products button clicked');
      try {
        const response = await fetch(`${getBackendUrl()}/products/number`, {
          method: 'GET',
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('total-products-response', result);
      } catch (error) {
        console.error('Error fetching total products:', error);
        displayResponse('total-products-response', error, true);
      }
    });
  }


  // Get Low Stock Products
  const getLowStockBtn = document.getElementById('get-low-stock-btn');
  if (getLowStockBtn) {
    getLowStockBtn.addEventListener('click', async () => {
      console.log('Get Low Stock Products button clicked');
      try {
        const response = await fetch(`${getBackendUrl()}/products/low_stock`, {
          method: 'GET',
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('low-stock-response', result);
      } catch (error) {
        console.error('Error fetching low stock products:', error);
        displayResponse('low-stock-response', error, true);
      }
    });
  }



  // Get All Product Images
  const getAllProductImagesForm = document.getElementById('get-all-product-images-form');
  if (getAllProductImagesForm) {
    getAllProductImagesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get All Product Images form submitted');
      const formData = new FormData(e.target);
      const page = parseInt(formData.get('page')) || 1;
      const perPage = parseInt(formData.get('per_page')) || 20;
      if (page < 1 || perPage < 1) {
        displayResponse('get-all-product-images-response', { error: 'Page and per_page must be positive integers' }, true);
        return;
      }
      try {
        const response = await fetch(`${getBackendUrl()}/product_images?page=${page}&per_page=${perPage}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('get-all-product-images-response', result);
      } catch (error) {
        console.error('Error fetching all product images:', error);
        displayResponse('get-all-product-images-response', error, true);
      }
    });
  }

  // Set API URL in the UI
  const apiUrlElement = document.getElementById('api-url');
  if (apiUrlElement) {
    apiUrlElement.href = getBackendUrl();
    apiUrlElement.textContent = getBackendUrl();
  }
});