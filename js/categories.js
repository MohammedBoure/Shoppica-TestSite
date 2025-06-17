console.log('categories.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  const BASE_URL = getBackendUrl();

  // Add New Category
  const addCategoryForm = document.getElementById('add-category-form');
  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Add Category form submitted');
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      if (!data.name) {
        displayResponse('add-category-response', { error: 'Category name is required' }, true);
        return;
      }
      if (data.parent_id === '') {
        data.parent_id = null;
      } else if (data.parent_id) {
        data.parent_id = parseInt(data.parent_id);
      }
      try {
        const response = await fetch(`${BASE_URL}/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
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
      const data = {};
      if (formData.get('name')) data.name = formData.get('name');
      if (formData.get('parent_id') === '') {
        data.parent_id = null;
      } else if (formData.get('parent_id')) {
        data.parent_id = parseInt(formData.get('parent_id'));
      }
      if (Object.keys(data).length === 0) {
        displayResponse('update-category-response', { error: 'At least one field must be provided' }, true);
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw result;
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
        if (!response.ok) throw result;
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
});