console.log('categories.js loaded');

function displayResponse(elementId, data, isError = false) {
  const responseDiv = document.getElementById(elementId);
  if (!responseDiv) return;

  responseDiv.innerHTML = '';
  responseDiv.className = `mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`;

  if (isError) {
    responseDiv.textContent = data.error || 'An unexpected error occurred';
  } else {
    const pre = document.createElement('pre');
    pre.className = 'bg-gray-100 p-4 rounded-md overflow-auto';
    pre.textContent = JSON.stringify(data, null, 2);
    responseDiv.appendChild(pre);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  const BASE_URL = getBackendUrl();
  document.getElementById('api-url').textContent = BASE_URL;
  document.getElementById('api-url').href = BASE_URL;

  // Add New Category
  const addCategoryForm = document.getElementById('add-category-form');
  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Add Category form submitted');
      const formData = new FormData(e.target);
      if (!formData.get('name')) {
        displayResponse('add-category-response', { error: 'Category name is required' }, true);
        return;
      }
      if (formData.get('parent_id') === '') {
        formData.delete('parent_id'); // Backend will handle null
      }
      try {
        const response = await fetch(`${BASE_URL}/categories`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw { error: 'Authentication required or insufficient permissions (admin only)' };
          }
          throw result;
        }
        displayResponse('add-category-response', result);
      } catch (error) {
        console.error('Error adding category:', error);
        displayResponse('add-category-response', error, true);
      }
    });
  } else {
    console.error('Add Category form not found');
  }

  // Get Category by ID
  const getCategoryByIdForm = document.getElementById('get-category-by-id-form');
  if (getCategoryByIdForm) {
    getCategoryByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get Category by ID form submitted');
      const formData = new FormData(e.target);
      const categoryId = formData.get('category_id');
      try {
        const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('get-category-by-id-response', result);
      } catch (error) {
        console.error('Error fetching category by ID:', error);
        displayResponse('get-category-by-id-response', error, true);
      }
    });
  }

  // Get Categories by Parent
  const getCategoriesByParentForm = document.getElementById('get-categories-by-parent-form');
  if (getCategoriesByParentForm) {
    getCategoriesByParentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get Categories by Parent form submitted');
      const formData = new FormData(e.target);
      const parentId = formData.get('parent_id');
      const url = parentId ? `${BASE_URL}/categories/parent?parent_id=${parentId}` : `${BASE_URL}/categories/parent`;
      try {
        const response = await fetch(url, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('get-categories-by-parent-response', result);
      } catch (error) {
        console.error('Error fetching categories by parent:', error);
        displayResponse('get-categories-by-parent-response', error, true);
      }
    });
  }

  // Update Category
  const updateCategoryForm = document.getElementById('update-category-form');
  if (updateCategoryForm) {
    updateCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Update Category form submitted');
      const formData = new FormData(e.target);
      const categoryId = formData.get('category_id');
      if (!formData.get('name') && !formData.get('parent_id') && !formData.get('image') && !formData.get('image_url')) {
        displayResponse('update-category-response', { error: 'At least one field must be provided' }, true);
        return;
      }
      if (formData.get('parent_id') === '') {
        formData.delete('parent_id'); // Backend will handle null
      }
      try {
        const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw { error: 'Authentication required or insufficient permissions (admin only)' };
          }
          throw result;
        }
        displayResponse('update-category-response', result);
      } catch (error) {
        console.error('Error updating category:', error);
        displayResponse('update-category-response', error, true);
      }
    });
  }

  // Delete Category
  const deleteCategoryForm = document.getElementById('delete-category-form');
  if (deleteCategoryForm) {
    deleteCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Delete Category form submitted');
      const formData = new FormData(e.target);
      const categoryId = formData.get('category_id');
      try {
        const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw { error: 'Authentication required or insufficient permissions (admin only)' };
          }
          throw result;
        }
        displayResponse('delete-category-response', result);
      } catch (error) {
        console.error('Error deleting category:', error);
        displayResponse('delete-category-response', error, true);
      }
    });
  }

  // Get All Categories
  const getAllCategoriesForm = document.getElementById('get-all-categories-form');
  if (getAllCategoriesForm) {
    getAllCategoriesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Get All Categories form submitted');
      const formData = new FormData(e.target);
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;
      try {
        const response = await fetch(`${BASE_URL}/categories?page=${page}&per_page=${perPage}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('get-all-categories-response', result);
      } catch (error) {
        console.error('Error fetching all categories:', error);
        displayResponse('get-all-categories-response', error, true);
      }
    });
  }

  // Search Categories
  const searchCategoriesForm = document.getElementById('search-categories-form');
  if (searchCategoriesForm) {
    searchCategoriesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Search Categories form submitted');
      const formData = new FormData(e.target);
      const searchTerm = formData.get('search_term');
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;
      if (!searchTerm) {
        displayResponse('search-categories-response', { error: 'Search term is required' }, true);
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/categories/search?search_term=${encodeURIComponent(searchTerm)}&page=${page}&per_page=${perPage}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (!response.ok) throw result;
        displayResponse('search-categories-response', result);
      } catch (error) {
        console.error('Error searching categories:', error);
        displayResponse('search-categories-response', error, true);
      }
    });
  }
});