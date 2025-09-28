PRD: System Admin (E-Commerce Platform)
1. Overview

The System Admin module enables platform administrators to manage sellers (partners) and control product/category submissions. The primary goal is to ensure quality and compliance of marketplace listings and maintain healthy seller operations.

2. User Story

As a System Admin,
I want to review and approve/reject products and categories submitted by sellers,
and I want to manage seller accounts (partners),
so that the marketplace remains secure, compliant, and high-quality.

3. Scope (Small & Simple)

Manage Seller Accounts (add, update, suspend/activate).

Review product submissions from sellers.

Review category submissions from sellers.

Grant permissions to sellers for product/category publishing.

4. Happy Flow
4.1 Seller Management

System Admin logs in.

Navigates to Seller Management.

Views list of registered sellers (status: active, suspended).

Selects a seller → can update profile details or change status.

Changes seller status:

Activate (seller can list products).

Suspend (seller is blocked from listing).

✅ End Result: Seller is managed successfully.

4.2 Product Submission Review

Seller submits a product for listing.

System Admin gets a notification under Product Review.

Opens product submission details (title, description, price, images, etc.).

Reviews and selects:

Approve → product goes live.

Reject → product is returned with feedback.

✅ End Result: Only approved products are visible in marketplace.

4.3 Category Submission Review

Seller requests a new category (e.g., “Handmade Decor”).

System Admin receives request under Category Review.

Opens request details and verifies.

Chooses:

Approve → category is added to system.

Reject → request is denied with feedback.

✅ End Result: Controlled growth of category taxonomy.