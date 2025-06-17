document.addEventListener('DOMContentLoaded', () => {
  // Set API URL in the HTML
  const apiUrlElement = document.getElementById('api-url');
  if (apiUrlElement) {
    apiUrlElement.href = BASE_URL;
    apiUrlElement.textContent = BASE_URL;
  }

  // Helper function to display response
  const displayResponse = (elementId, response) => {
    const responseElement = document.getElementById(elementId);
    if (responseElement) {
      responseElement.textContent = JSON.stringify(response, null, 2);
      responseElement.classList.add('bg-gray-100', 'p-4', 'rounded-md', 'font-mono', 'text-sm');
    }
  };

  // Helper function to validate rating
  const validateRating = (rating) => {
    const num = parseInt(rating);
    return !isNaN(num) && num >= 1 && num <= 5;
  };

  // 1. Add New Review
  const addReviewForm = document.getElementById('add-review-form');
  if (addReviewForm) {
    addReviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addReviewForm);
      const data = Object.fromEntries(formData);
      
      if (!data.user_id || !data.product_id || !data.rating) {
        displayResponse('add-review-response', { error: 'User ID, product ID, and rating are required' });
        return;
      }

      if (!validateRating(data.rating)) {
        displayResponse('add-review-response', { error: 'Rating must be between 1 and 5' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            user_id: parseInt(data.user_id),
            product_id: parseInt(data.product_id),
            rating: parseInt(data.rating),
            comment: data.comment || ''
          })
        });
        const result = await response.json();
        displayResponse('add-review-response', result);
      } catch (error) {
        console.error('Error adding review:', error);
        displayResponse('add-review-response', { error: 'Failed to add review' });
      }
    });
  }

  // 2. Get Review by ID
  const getReviewByIdForm = document.getElementById('get-review-by-id-form');
  if (getReviewByIdForm) {
    getReviewByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getReviewByIdForm);
      const reviewId = formData.get('review_id');

      if (!reviewId) {
        displayResponse('get-review-by-id-response', { error: 'Review ID is required' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-review-by-id-response', result);
      } catch (error) {
        console.error('Error fetching review:', error);
        displayResponse('get-review-by-id-response', { error: 'Failed to fetch review' });
      }
    });
  }

  // 3. Get Reviews by Product
  const getReviewsByProductForm = document.getElementById('get-reviews-by-product-form');
  if (getReviewsByProductForm) {
    getReviewsByProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getReviewsByProductForm);
      const productId = formData.get('product_id');

      if (!productId) {
        displayResponse('get-reviews-by-product-response', { error: 'Product ID is required' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews/product/${productId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-reviews-by-product-response', result);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        displayResponse('get-reviews-by-product-response', { error: 'Failed to fetch reviews' });
      }
    });
  }

  // 4. Update Review
  const updateReviewForm = document.getElementById('update-review-form');
  if (updateReviewForm) {
    updateReviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(updateReviewForm);
      const data = Object.fromEntries(formData);

      if (!data.review_id || !data.user_id) {
        displayResponse('update-review-response', { error: 'Review ID and User ID are required' });
        return;
      }

      if (data.rating && !validateRating(data.rating)) {
        displayResponse('update-review-response', { error: 'Rating must be between 1 and 5' });
        return;
      }

      const body = {};
      if (data.rating) body.rating = parseInt(data.rating);
      if (data.comment) body.comment = data.comment;

      try {
        const response = await fetch(`${BASE_URL}/reviews/${data.review_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('update-review-response', result);
      } catch (error) {
        console.error('Error updating review:', error);
        displayResponse('update-review-response', { error: 'Failed to update review' });
      }
    });
  }

  // 5. Delete Review
  const deleteReviewForm = document.getElementById('delete-review-form');
  if (deleteReviewForm) {
    deleteReviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteReviewForm);
      const reviewId = formData.get('review_id');
      const userId = formData.get('user_id');

      if (!reviewId || !userId) {
        displayResponse('delete-review-response', { error: 'Review ID and User ID are required' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('delete-review-response', result);
      } catch (error) {
        console.error('Error deleting review:', error);
        displayResponse('delete-review-response', { error: 'Failed to delete review' });
      }
    });
  }

  // 6. Get All Reviews (Admin Only)
  const getAllReviewsForm = document.getElementById('get-all-reviews-form');
  if (getAllReviewsForm) {
    getAllReviewsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllReviewsForm);
      const page = formData.get('page') || 1;
      const perPage = formData.get('per_page') || 20;

      try {
        const response = await fetch(`${BASE_URL}/reviews?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-all-reviews-response', result);
      } catch (error) {
        console.error('Error fetching all reviews:', error);
        displayResponse('get-all-reviews-response', { error: 'Failed to fetch reviews' });
      }
    });
  }
});