# Navigation Bar Link Test Plan

## Executive Summary

This test plan covers navigation bar link functionality for https://cebuflexi-web.vercel.app/. It verifies that each navigation link routes to the correct page after login. The login flow uses `auth.ts` and `browser-utils.ts` utilities. Each scenario assumes a fresh, logged-in state.

## Test Scenarios

### 1. Login and Initial State

**Steps:**
1. Launch browser and navigate to https://cebuflexi-web.vercel.app/
2. Perform login using helper from `auth.ts` and `browser-utils.ts`
3. Verify successful login (user icon or dashboard visible)

**Expected Results:**
- User is logged in and navigation bar is visible

---

### 2. Navigate to Home

**Steps:**
1. Click the "Home" link in the navigation bar
2. Verify URL changes to `/home`
3. Confirm Home page content is visible

**Expected Results:**
- URL is https://cebuflexi-web.vercel.app/home
- Home page loads successfully

---

### 3. Navigate to Tours

**Steps:**
1. Click the "Tours" link in the navigation bar
2. Verify URL changes to `/tours`
3. Confirm Tours page content is visible

**Expected Results:**
- URL is https://cebuflexi-web.vercel.app/tours
- Tours page loads successfully

---

### 4. Navigate to Car Rentals

**Steps:**
1. Click the "Car Rentals" link in the navigation bar
2. Verify URL changes to `/car-rentals`
3. Confirm Car Rentals page content is visible

**Expected Results:**
- URL is https://cebuflexi-web.vercel.app/car-rentals
- Car Rentals page loads successfully

---

### 5. Navigate to About

**Steps:**
1. Click the "About" link in the navigation bar
2. Verify URL changes to `/about`
3. Confirm About page content is visible

**Expected Results:**
- URL is https://cebuflexi-web.vercel.app/about
- About page loads successfully

---

### 6. Navigate to Blog

**Steps:**
1. Click the "Blog" link in the navigation bar
2. Verify URL changes to `/blog`
3. Confirm Blog page content is visible

**Expected Results:**
- URL is https://cebuflexi-web.vercel.app/blog
- Blog page loads successfully

---

### 7. Navigate to Contact

**Steps:**
1. Click the "Contact" link in the navigation bar
2. Verify URL changes to `/contact`
3. Confirm Contact page content is visible

**Expected Results:**
- URL is https://cebuflexi-web.vercel.app/contact
- Contact page loads successfully

---

## Assumptions
- User credentials are valid and available in `.env`
- Navigation bar is present after login
- Each page loads without error

## Success Criteria
- Each navigation link routes to the correct URL and loads the expected content
- No errors or unexpected redirects occur

## Failure Conditions
- Login fails
- Navigation bar is missing
- Clicking a link does not route to the correct page
- Page content does not load or errors are displayed
