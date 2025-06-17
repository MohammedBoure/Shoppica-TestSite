const DEFAULT_BACKEND_URL = 'https://shoppica-backend.onrender.com/api';

function getBackendUrl() {
  return localStorage.getItem('backend_url') || DEFAULT_BACKEND_URL;
}

const BASE_URL = getBackendUrl();

function displayResponse(elementId, response, isError = false) {
  const element = document.getElementById(elementId);
  let message = isError
    ? (response.error || 'An error occurred')
    : (response.message || JSON.stringify(response, null, 2));
  element.innerHTML = `<pre class="p-4 rounded ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">${message}</pre>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const apiLink = document.getElementById('api-url');
  if (apiLink) {
    apiLink.href = BASE_URL;
    apiLink.textContent = BASE_URL;
  }
});
