# CebuFlexi Tours Feature – Comprehensive Test Plan

## Executive Summary

This test plan covers the "Tours" feature at [https://cebuflexi-web.vercel.app/tours](https://cebuflexi-web.vercel.app/tours). The page allows users to browse, filter, and search for Cebu tour packages. Key functionality includes category filtering, duration and price sliders, search, and navigation to tour details. The plan covers happy paths, edge cases, error handling, and UI validation.

---

## Test Scenarios

### 1. Load Tours Page

**Steps:**
1. Navigate to `/tours`
2. Observe page load and main heading

**Expected Results:**
- Page loads with title "Cebu Tours & Packages | CebuFlexi Tours"
- Heading "Discover Cebu Tours" is visible
- "All Tours" section is present

---

### 2. Search for Tours

**Steps:**
1. Enter a valid tour name/location in the search box
2. Press Enter or click search icon

**Expected Results:**
- Tours matching the search term are displayed
- "All Tours" count updates accordingly

---

### 3. Search for Non-Existent Tour

**Steps:**
1. Enter a random string in the search box
2. Press Enter

**Expected Results:**
- No tours are displayed
- "Loading tours..." or "No tours found" message appears

---

### 4. Filter by Category

**Steps:**
1. Select each category radio button (Beach, Adventure, Cultural, Food)
2. Click "Apply Filters"

**Expected Results:**
- Only tours matching the selected category are shown
- "All Tours" count updates

---

### 5. Filter by Duration

**Steps:**
1. Open the "Duration" dropdown
2. Select a duration (e.g., "Half Day", "Full Day")
3. Click "Apply Filters"

**Expected Results:**
- Tours matching the selected duration are displayed

---

### 6. Filter by Price Range

**Steps:**
1. Adjust the price range sliders
2. Click "Apply Filters"

**Expected Results:**
- Tours within the selected price range are displayed

---

### 7. Reset Filters

**Steps:**
1. Apply any filter
2. Click "Reset Filters"

**Expected Results:**
- All filters are cleared
- All tours are displayed

---

### 8. Navigate to Tour Details

**Steps:**
1. Click on any tour card in the list

**Expected Results:**
- User is navigated to the tour details page
- Tour details are displayed correctly

---

### 9. Edge Case: No Tours Available

**Steps:**
1. Apply filters that result in zero tours (e.g., impossible price range)

**Expected Results:**
- "No tours found" or similar message is shown

---

### 10. UI and Accessibility Checks

**Steps:**
1. Tab through all interactive elements
2. Check for visible focus indicators
3. Ensure all images have alt text

**Expected Results:**
- All controls are accessible via keyboard
- Images have descriptive alt text

---

### 11. Error Handling

**Steps:**
1. Simulate network failure (offline mode)
2. Reload the page

**Expected Results:**
- User sees a friendly error message or loading indicator

---

## Success Criteria

- All scenarios pass as described
- No uncaught errors or broken UI elements
- Filters, search, and navigation work as expected

---

## Failure Conditions

- Tours do not load or display incorrectly
- Filters/search do not update results
- Navigation to details fails
- Accessibility issues present

---

## Assumptions

- Starting from a fresh, unauthenticated state
- Test data is available for all categories/durations/prices

---
