document.addEventListener('DOMContentLoaded', () => {
  // Helper function to validate non-empty string
  const validateString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
  };

  // 1. Add New Payment
  const addPaymentForm = document.getElementById('add-payment-form');
  if (addPaymentForm) {
    addPaymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addPaymentForm);
      const data = Object.fromEntries(formData);

      if (!data.order_id || !data.payment_method) {
        displayResponse('add-payment-response', { error: 'Order ID and payment method are required' }, true);
        return;
      }

      const orderId = parseInt(data.order_id);
      if (isNaN(orderId) || orderId <= 0) {
        displayResponse('add-payment-response', { error: 'Order ID must be a positive integer' }, true);
        return;
      }

      if (!validateString(data.payment_method)) {
        displayResponse('add-payment-response', { error: 'Payment method must be a valid string' }, true);
        return;
      }

      try {
        const body = {
          order_id: orderId,
          payment_method: data.payment_method,
        };
        if (data.transaction_id && validateString(data.transaction_id)) body.transaction_id = data.transaction_id;
        if (data.payment_status) body.payment_status = data.payment_status;

        const response = await fetch(`${BASE_URL}/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('add-payment-response', result, !response.ok);
      } catch (error) {
        console.error('Error adding payment:', error);
        displayResponse('add-payment-response', { error: 'Failed to add payment' }, true);
      }
    });
  }

  // 2. Get Payment by ID
  const getPaymentByIdForm = document.getElementById('get-payment-by-id-form');
  if (getPaymentByIdForm) {
    getPaymentByIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getPaymentByIdForm);
      const paymentId = parseInt(formData.get('payment_id'));

      if (isNaN(paymentId) || paymentId <= 0) {
        displayResponse('get-payment-by-id-response', { error: 'Payment ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/payments/${paymentId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-payment-by-id-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching payment:', error);
        displayResponse('get-payment-by-id-response', { error: 'Failed to fetch payment' }, true);
      }
    });
  }

  // 3. Get Payments by Order
  const getPaymentsByOrderForm = document.getElementById('get-payments-by-order-form');
  if (getPaymentsByOrderForm) {
    getPaymentsByOrderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getPaymentsByOrderForm);
      const orderId = parseInt(formData.get('order_id'));

      if (isNaN(orderId) || orderId <= 0) {
        displayResponse('get-payments-by-order-response', { error: 'Order ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/payments/order/${orderId}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-payments-by-order-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching payments by order:', error);
        displayResponse('get-payments-by-order-response', { error: 'Failed to fetch payments' }, true);
      }
    });
  }

  // 4. Update Payment
  const updatePaymentForm = document.getElementById('update-payment-form');
  if (updatePaymentForm) {
    updatePaymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(updatePaymentForm);
      const data = Object.fromEntries(formData);

      const paymentId = parseInt(data.payment_id);
      if (isNaN(paymentId) || paymentId <= 0) {
        displayResponse('update-payment-response', { error: 'Payment ID must be a positive integer' }, true);
        return;
      }

      const body = {};
      if (data.payment_method && validateString(data.payment_method)) body.payment_method = data.payment_method;
      if (data.payment_status && validateString(data.payment_status)) body.payment_status = data.payment_status;
      if (data.transaction_id && validateString(data.transaction_id)) body.transaction_id = data.transaction_id;

      if (Object.keys(body).length === 0) {
        displayResponse('update-payment-response', { error: 'At least one field (payment method, payment status, or transaction ID) must be provided' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/payments/${paymentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const result = await response.json();
        displayResponse('update-payment-response', result, !response.ok);
      } catch (error) {
        console.error('Error updating payment:', error);
        displayResponse('update-payment-response', { error: 'Failed to update payment' }, true);
      }
    });
  }

  // 5. Delete Payment
  const deletePaymentForm = document.getElementById('delete-payment-form');
  if (deletePaymentForm) {
    deletePaymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(deletePaymentForm);
      const paymentId = parseInt(formData.get('payment_id'));

      if (isNaN(paymentId) || paymentId <= 0) {
        displayResponse('delete-payment-response', { error: 'Payment ID must be a positive integer' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/payments/${paymentId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('delete-payment-response', result, !response.ok);
      } catch (error) {
        console.error('Error deleting payment:', error);
        displayResponse('delete-payment-response', { error: 'Failed to delete payment' }, true);
      }
    });
  }

  // 6. Get All Payments
  const getAllPaymentsForm = document.getElementById('get-all-payments-form');
  if (getAllPaymentsForm) {
    getAllPaymentsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(getAllPaymentsForm);
      const page = parseInt(formData.get('page')) || 1;
      const perPage = parseInt(formData.get('per_page')) || 20;

      if (page < 1 || perPage < 1) {
        displayResponse('get-all-payments-response', { error: 'Page and per_page must be positive integers' }, true);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/payments?page=${page}&per_page=${perPage}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        displayResponse('get-all-payments-response', result, !response.ok);
      } catch (error) {
        console.error('Error fetching all payments:', error);
        displayResponse('get-all-payments-response', { error: 'Failed to fetch payments' }, true);
      }
    });
  }
});