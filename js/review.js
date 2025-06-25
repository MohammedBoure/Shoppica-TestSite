document.addEventListener('DOMContentLoaded', () => {
  // Set API URL in the HTML
  const apiUrlElement = document.getElementById('api-url');
  if (apiUrlElement) {
    apiUrlElement.href = BASE_URL;
    apiUrlElement.textContent = BASE_URL;
  }

  // Helper function to display response
  const displayResponse = (elementId, response, status) => {
    const responseElement = document.getElementById(elementId);
    if (responseElement) {
      const codeElement = responseElement.querySelector('code');
      if (codeElement) {
        try {
          codeElement.textContent = JSON.stringify(response, null, 2);
          Prism.highlightAll(); // Re-highlight syntax
        } catch (error) {
          codeElement.textContent = `Error: ${response || 'Invalid response format'}`;
        }
      }
    }
  };

  // Helper function to validate positive integer
  const validatePositiveInteger = (value, fieldName) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      return { valid: false, error: `${fieldName} must be a positive integer` };
    }
    return { valid: true, value: num };
  };

  // Helper function to validate rating
  const validateRating = (rating, fieldName = 'Rating') => {
    const num = parseInt(rating);
    if (rating && (isNaN(num) || num < 1 || num > 5)) {
      return { valid: false, error: `${fieldName} must be between 1 and 5` };
    }
    return { valid: true, value: num };
  };

  // Helper function to handle fetch errors
  const handleFetchError = async (response) => {
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        return { error: 'Unauthorized: Please log in' };
      } else if (response.status === 403) {
        return { error: 'Forbidden: Insufficient permissions' };
      } else if (response.status === 404) {
        return { error: result.error || 'Resource not found' };
      } else if (response.status === 400) {
        return { error: result.error || 'Bad request' };
      } else {
        return { error: result.error || 'Server error' };
      }
    }
    return result;
  };

  // 1. Add New Review
  const addReviewForm = document.getElementById('add-review-form');
  if (addReviewForm) {
    addReviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addReviewForm);
      const data = Object.fromEntries(formData);

      // Validate inputs
      const userIdValidation = validatePositiveInteger(data.user_id, 'User ID');
      if (!userIdValidation.valid) {
        displayResponse('add-review-response', { error: userIdValidation.error }, 400);
        return;
      }
      const productIdValidation = validatePositiveInteger(data.product_id, 'Product ID');
      if (!productIdValidation.valid) {
        displayResponse('add-review-response', { error: productIdValidation.error }, 400);
        return;
      }
      const ratingValidation = validateRating(data.rating);
      if (!ratingValidation.valid) {
        displayResponse('add-review-response', { error: ratingValidation.error }, 400);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            user_id: userIdValidation.value,
            product_id: productIdValidation.value,
            rating: ratingValidation.value,
            comment: data.comment || null
          })
        });
        const result = await handleFetchError(response);
        displayResponse('add-review-response', result, response.status);
      } catch (error) {
        console.error('Error adding review:', error);
        displayResponse('add-review-response', { error: 'Failed to add review' }, 500);
      }
    });
  }

  // 2. Get Review by ID
  const getReviewByIdForm = document.getElementById('get-review-by-id-form');
  if (getReviewByIdForm) {
    getReviewByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getReviewByIdForm);
      const reviewIdValidation = validatePositiveInteger(formData.get('review_id'), 'Review ID');
      if (!reviewIdValidation.valid) {
        displayResponse('get-review-by-id-response', { error: reviewIdValidation.error }, 400);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews/${reviewIdValidation.value}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await handleFetchError(response);
        displayResponse('get-review-by-id-response', result, response.status);
      } catch (error) {
        console.error('Error fetching review:', error);
        displayResponse('get-review-by-id-response', { error: 'Failed to fetch review' }, 500);
      }
    });
  }

  // 3. Get Reviews by Product
  const getReviewsByProductForm = document.getElementById('get-reviews-by-product-form');
  if (getReviewsByProductForm) {
    getReviewsByProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getReviewsByProductForm);
      const productIdValidation = validatePositiveInteger(formData.get('product_id'), 'Product ID');
      if (!productIdValidation.valid) {
        displayResponse('get-reviews-by-product-response', { error: productIdValidation.error }, 400);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews/product/${productIdValidation.value}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await handleFetchError(response);
        displayResponse('get-reviews-by-product-response', result, response.status);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        displayResponse('get-reviews-by-product-response', { error: 'Failed to fetch reviews' }, 500);
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

      const reviewIdValidation = validatePositiveInteger(data.review_id, 'Review ID');
      if (!reviewIdValidation.valid) {
        displayResponse('update-review-response', { error: reviewIdValidation.error }, 400);
        return;
      }

      if (data.rating && !validateRating(data.rating).valid) {
        displayResponse('update-review-response', { error: 'Rating must be between 1 and 5' }, 400);
        return;
      }

      const body = {};
      if (data.rating) body.rating = parseInt(data.rating);
      if (data.comment) body.comment = data.comment;

      try {
        const response = await fetch(`${BASE_URL}/reviews/${reviewIdValidation.value}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await handleFetchError(response);
        displayResponse('update-review-response', result, response.status);
      } catch (error) {
        console.error('Error updating review:', error);
        displayResponse('update-review-response', { error: 'Failed to update review' }, 500);
      }
    });
  }

  // 5. Delete Review
  const deleteReviewForm = document.getElementById('delete-review-form');
  if (deleteReviewForm) {
    deleteReviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteReviewForm);
      const reviewIdValidation = validatePositiveInteger(formData.get('review_id'), 'Review ID');
      if (!reviewIdValidation.valid) {
        displayResponse('delete-review-response', { error: reviewIdValidation.error }, 400);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews/${reviewIdValidation.value}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await handletrasound

System: FetchError(response);
        displayResponse('delete-review-response', result, response.status);
      } catch (error) {
        console.error('Error deleting review:', error);
        displayResponse('delete-review-response', { error: 'Failed to delete review' }, 500);
      }
    });
  }

  // 6. Get All Reviews (Admin Only)
  const getAllReviewsForm = document.getElementById('get-all-reviews-form');
  if (getAllReviewsForm) {
    getAllReviewsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllReviewsForm);
      const pageValidation = validatePositiveInteger(formData.get('page') || 1, 'Page');
      const perPageValidation = validatePositiveInteger(formData.get('per_page') || 20, 'Per Page');
      if (!pageValidation.valid) {
        displayResponse('get-all-reviews-response', { error: pageValidation.error }, 400);
        return;
      }
      if (!perPageValidation.valid) {
        displayResponse('get-all-reviews-response', { error: perPageValidation.error }, 400);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews?page=${pageValidation.value}&per_page=${perPageValidation.value}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await handleFetchError(response);
        displayResponse('get-all-reviews-response', result, response.status);
      } catch (error) {
        console.error('Error fetching all reviews:', error);
        displayResponse('get-all-reviews-response', { error: 'Failed to fetch reviews' }, 500);
      }
    });
  }

 
  // 7. Search Reviews
  const searchReviewsForm = document.getElementById('search-reviews-form');
  if (searchReviewsForm) {
    searchReviewsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(searchReviewsForm);
      const data = Object.fromEntries(formData);

      const params = new URLSearchParams();

      // Validate and append product_id
      if (data.product_id) {
        const productIdValidation = validatePositiveInteger(data.product_id, 'Product ID');
        if (!productIdValidation.valid) {
          displayResponse('search-reviews-response', { error: productIdValidation.error }, 400);
          return;
        }
        params.append('product_id', productIdValidation.value);
      }

      // Validate and append user_id
      if (data.user_id) {
        const userIdValidation = validatePositiveInteger(data.user_id, 'User ID');
        if (!userIdValidation.valid) {
          displayResponse('search-reviews-response', { error: userIdValidation.error }, 400);
          return;
        }
        params.append('user_id', userIdValidation.value);
      }

      // Validate and append min_rating
      if (data.min_rating) {
        const minRatingValidation = validateRating(data.min_rating, 'Min Rating');
        if (!minRatingValidation.valid) {
          displayResponse('search-reviews-response', { error: minRatingValidation.error }, 400);
          return;
        }
        params.append('min_rating', minRatingValidation.value);
      }

      // Validate and append max_rating
      if (data.max_rating) {
        const maxRatingValidation = validateRating(data.max_rating, 'Max Rating');
        if (!maxRatingValidation.valid) {
          displayResponse('search-reviews-response', { error: maxRatingValidation.error }, 400);
          return;
        }
        params.append('max_rating', maxRatingValidation.value);
      }

      // Append comment (no validation needed)
      if (data.comment && data.comment.trim() !== '') {
        params.append('comment', data.comment.trim());
      }

      // Validate and append page
      const pageValidation = validatePositiveInteger(data.page || 1, 'Page');
      if (!pageValidation.valid) {
        displayResponse('search-reviews-response', { error: pageValidation.error }, 400);
        return;
      }
      params.append('page', pageValidation.value);

      // Validate and append per_page
      const perPageValidation = validatePositiveInteger(data.per_page || 20, 'Per Page');
      if (!perPageValidation.valid) {
        displayResponse('search-reviews-response', { error: perPageValidation.error }, 400);
        return;
      }
      params.append('per_page', perPageValidation.value);

      // Require at least one filter parameter
      if (
        !data.product_id &&
        !data.user_id &&
        !data.min_rating &&
        !data.max_rating &&
        !data.comment
      ) {
        displayResponse('search-reviews-response', {
          error: 'At least one search parameter is required (product_id, user_id, min_rating, max_rating, comment)'
        }, 400);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews/search?${params.toString()}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await handleFetchError(response);
        displayResponse('search-reviews-response', result, response.status);
      } catch (error) {
        console.error('Error searching reviews:', error);
        displayResponse('search-reviews-response', { error: 'Failed to search reviews' }, 500);
      }
    });
  }


  // 8. Delete Reviews by Product
  const deleteReviewsByProductForm = document.getElementById('delete-reviews-by-product-form');
  if (deleteReviewsByProductForm) {
    deleteReviewsByProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deleteReviewsByProductForm);
      const productIdValidation = validatePositiveInteger(formData.get('product_id'), 'Product ID');
      if (!productIdValidation.valid) {
        displayResponse('delete-reviews-by-product-response', { error: productIdValidation.error }, 400);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews/by-product/${productIdValidation.value}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await handleFetchError(response);
        displayResponse('delete-reviews-by-product-response', result, response.status);
      } catch (error) {
        console.error('Error deleting reviews by product:', error);
        displayResponse('delete-reviews-by-product-response', { error: 'Failed to delete reviews' }, 500);
      }
    });
  }

  // 9. Delete Reviews by User
const deleteReviewsByUserForm = document.getElementById('delete-reviews-by-user-form');

if (deleteReviewsByUserForm) {
  deleteReviewsByUserForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting in the default way

    const formData = new FormData(deleteReviewsByUserForm);
    const userIdValidation = validatePositiveInteger(formData.get('user_id'), 'User ID');

    if (!userIdValidation.valid) {
      displayResponse('delete-reviews-by-user-response', { error: userIdValidation.error }, 400);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/reviews/by-user/${userIdValidation.value}`, {
        method: 'DELETE',
        credentials: 'include' // include cookies (like auth tokens)
      });

      const result = await handleFetchError(response);
      displayResponse('delete-reviews-by-user-response', result, response.status);
    } catch (error) {
      console.error('Error deleting reviews by user:', error);
      displayResponse('delete-reviews-by-user-response', { error: 'Failed to delete reviews' }, 500);
    }
  });
}

  // 10. Get Product Review Stats
  const getProductReviewStatsForm = document.getElementById('get-product-review-stats-form');
  if (getProductReviewStatsForm) {
    getProductReviewStatsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getProductReviewStatsForm);
      const productIdValidation = validatePositiveInteger(formData.get('product_id'), 'Product ID');
      if (!productIdValidation.valid) {
        displayResponse('get-product-review-stats-response', { error: productIdValidation.error }, 400);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/reviews/stats/product/${productIdValidation.value}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await handleFetchError(response);
        displayResponse('get-product-review-stats-response', result, response.status);
      } catch (error) {
        console.error('Error fetching product review stats:', error);
        displayResponse('get-product-review-stats-response', { error: 'Failed to fetch stats' }, 500);
      }
    });
  }

  // 11. Get Overall Review Stats
  const getOverallReviewStatsForm = document.getElementById('get-overall-review-stats-form');
  if (getOverallReviewStatsForm) {
    getOverallReviewStatsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${BASE_URL}/reviews/stats/overall`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await handleFetchError(response);
        displayResponse('get-overall-review-stats-response', result, response.status);
      } catch (error) {
        console.error('Error fetching overall review stats:', error);
        displayResponse('get-overall-review-stats-response', { error: 'Failed to fetch stats' }, 500);
      }
    });
  }
});