console.log('products.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  const BASE_URL = getBackendUrl();
  document.getElementById('api-url').href = BASE_URL;
  document.getElementById('api-url').textContent = BASE_URL;

  // Add New Product
  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Add Product form submitted');
      const formData = new FormData(e.target);
      if (!formData.get('name') || !formData.get('price') || !formData.get('stock_quantity')) {
        displayResponse('add-product-response', { error: 'Name, price, and stock quantity are required' }, true);
        return;
      }
      const price = parseFloat(formData.get('price'));
      const stock_quantity = parseInt(formData.get('stock_quantity'));
      if (isNaN(price) || isNaN(stock_quantity)) {
        displayResponse('add-product-response', { error: 'Price and stock quantity must be valid numbers' }, true);
        return;
      }
      if (price < 0 || stock_quantity < 0) {
        displayResponse('add-product-response', { error: 'Price and stock quantity must be non-negative' }, true);
        return;
      }
      if (formData.get('image') && formData.get('image').size > 0) {
        const file = formData.get('image');
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          displayResponse('add-product-response', { error: 'Invalid image file. Allowed extensions: jpg, jpeg, png, gif' }, true);
          return;
        }
      }
      try {
        const response = await fetch(`${BASE_URL}/products`, {
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

  // Get Product by ID
  const getProductByIdForm = document.getElementById('get-product-by-id-form');
  if (getProductByIdForm) {
    getProductByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get Product by ID form submitted');
      const formData = new FormData(e.target);
      const productId = formData.get('product_id');
      try {
        const response = await fetch(`${BASE_URL}/products/${productId}`, {
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
      const categoryId = formData.get('category_id');
      try {
        const response = await fetch(`${BASE_URL}/products/category/${categoryId}`, {
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
      const productId = formData.get('product_id');
      if (!productId) {
        displayResponse('update-product-response', { error: 'Product ID is required' }, true);
        return;
      }
      const hasData = formData.get('name') || formData.get('price') || formData.get('stock_quantity') ||
                      formData.get('category_id') || formData.get('description') || formData.get('image').size > 0 ||
                      formData.get('is_active');
      if (!hasData) {
        displayResponse('update-product-response', { error: 'At least one field must be provided' }, true);
        return;
      }
      if (formData.get('price')) {
        const price = parseFloat(formData.get('price'));
        if (isNaN(price) || price < 0) {
          displayResponse('update-product-response', { error: 'Price must be a valid non-negative number' }, true);
          return;
        }
      }
      if (formData.get('stock_quantity')) {
        const stock_quantity = parseInt(formData.get('stock_quantity'));
        if (isNaN(stock_quantity) || stock_quantity < 0) {
          displayResponse('update-product-response', { error: 'Stock quantity must be a valid non-negative integer' }, true);
          return;
        }
      }
      if (formData.get('image') && formData.get('image').size > 0) {
        const file = formData.get('image');
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          displayResponse('update-product-response', { error: 'Invalid image file. Allowed extensions: jpg, jpeg, png, gif' }, true);
          return;
        }
      }
      try {
        const response = await fetch(`${BASE_URL}/products/${productId}`, {
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
      const productId = formData.get('product_id');
      try {
        const response = await fetch(`${BASE_URL}/products/${productId}`, {
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
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;
      try {
        const response = await fetch(`${BASE_URL}/products?page=${page}&per_page=${perPage}`, {
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
      const productId = formData.get('product_id');
      const file = formData.get('image');
      if (!productId) {
        displayResponse('add-product-image-response', { error: 'Product ID is required' }, true);
        return;
      }
      if (!file || file.size === 0) {
        displayResponse('add-product-image-response', { error: 'Image file is required' }, true);
        return;
      }
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        displayResponse('add-product-image-response', { error: 'Invalid image file. Allowed extensions: jpg, jpeg, png, gif' }, true);
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/products/${productId}/images`, {
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
      const imageId = formData.get('image_id');
      try {
        const response = await fetch(`${BASE_URL}/products/images/${imageId}`, {
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
      const productId = formData.get('product_id');
      try {
        const response = await fetch(`${BASE_URL}/products/${productId}/images`, {
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
      const imageId = formData.get('image_id');
      const file = formData.get('image');
      if (!imageId) {
        displayResponse('update-product-image-response', { error: 'Image ID is required' }, true);
        return;
      }
      if (!file || file.size === 0) {
        displayResponse('update-product-image-response', { error: 'Image file is required' }, true);
        return;
      }
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        displayResponse('update-product-image-response', { error: 'Invalid image file. Allowed extensions: jpg, jpeg, png, gif' }, true);
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/products/images/${imageId}`, {
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
      const imageId = formData.get('image_id');
      try {
        const response = await fetch(`${BASE_URL}/products/images/${imageId}`, {
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

  // Get All Product Images
  const getAllProductImagesForm = document.getElementById('get-all-product-images-form');
  if (getAllProductImagesForm) {
    getAllProductImagesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get All Product Images form submitted');
      const formData = new FormData(e.target);
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;
      try {
        const response = await fetch(`${BASE_URL}/product_images?page=${page}&per_page=${perPage}`, {
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
});