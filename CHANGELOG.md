# 📦 Changelog

## [1.0.0] - 2025-06-26

### 🚀 Features

- **Analytics Dashboard**
  - Added analytics dashboard for:
    - `/analytics/discount-effectiveness`
    - `/analytics/product-performance`
    - `/analytics/customer-retention`

- **Dashboard Enhancements**
  - Added UI for:
    - `/products/low_stock` (critical stock alerts)
    - `/orders/number` (total orders and sales)
    - `/users/number` (total users)
    - `/products/number` (product count)
  - Improved layout and styling for dashboard cards

- **New Frontend Modules**
  - Added full HTML/JS interfaces for:
    - `discount.html`, `discount.js`
    - `product_discounts.html`, `product_discounts.js`
    - `category_discounts.html`, `category_discounts.js`
    - `order_item.html`, `js/order_item.js`
    - `payment.html`, `js/payment.js`
    - `review.html`, `review.js`
    - `products.js`
    - `categories.html`, `categories.js`
    - `addresses.js`

- **Form Handling and CRUD Support**
  - Implemented full CRUD operations for:
    - Orders
    - Order items
    - Payments
    - Addresses
    - Categories
    - Products
    - Reviews

### 🛠 Fixes

- Refactored order endpoints to return Python dicts for proper JSON serialization.
- Improved SQLite integration with consistent row_factory usage.
- Enabled pagination in admin order listings.
- Enhanced logging for API debugging.

### 🧪 Tests

- Added HTML-based test UI for user and auth endpoints.

### 💅 UI Improvements

- Unified response display layout across interfaces.
- Improved validation, dynamic feedback, and user experience.

### 📝 Documentation

- Updated README to reflect current API coverage and testing guidance.
