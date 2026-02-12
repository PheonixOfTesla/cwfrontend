# Member Subscribe & Auth Workflow

## Overview
This document outlines the ideal user flow for subscribing to creators on Clockwork.fit.

---

## User Journey

### 1. Discovery
User visits a creator's public profile page:
```
https://www.clockwork.fit/creator/itssjoshl
```

The page displays:
- Creator's profile photo
- Creator's name and @handle
- Subscribe button with price (e.g., "Subscribe for $29.99/mo")
- "Cancel anytime - Instant access to exclusive content"
- Preview of content offerings (e.g., "The Keys To Nutrition", "Natures Medicine Cabinet")

---

### 2. Subscribe Click (Not Logged In)

**Trigger:** User clicks "Subscribe for $29.99/mo"

**Flow:**
```
Click Subscribe
    │
    ▼
Check if logged in (valid session)
    │
    ├── NO → Show Auth Modal (popup)
    │           │
    │           ├── Sign Up tab (default)
    │           │     - Email
    │           │     - Password
    │           │     - Confirm Password
    │           │     - "Create Account" button
    │           │
    │           └── Login tab
    │                 - Email
    │                 - Password
    │                 - "Login" button
    │
    └── YES → Proceed to Stripe Checkout
```

---

### 3. Auth Modal Behavior

**Key Points:**
- Modal appears as a **popup overlay** (same styling as index.html auth)
- User stays on the creator page (no redirect)
- After successful auth:
  - Modal closes
  - Subscribe flow continues automatically
  - User is redirected to Stripe Checkout

**Auth Modal States:**
1. **Sign Up** - New users create account
2. **Login** - Existing users sign in
3. **Loading** - Processing auth request
4. **Error** - Display validation/server errors

---

### 4. Stripe Checkout

**After successful authentication:**
```
Auth Success
    │
    ▼
Redirect to Stripe Checkout
    - Creator's subscription price ($29.99/mo)
    - Creator's Stripe Connect account receives payment
    - Platform takes configured fee percentage
    │
    ▼
Payment Success
    │
    ▼
Redirect to success page or back to creator page
    - Subscription is now active
    - User has access to exclusive content
```

---

### 5. Member Dashboard (member.html)

**Purpose:** Central hub for users to manage their subscriptions and referral income.

**URL:** `https://www.clockwork.fit/member.html`

**Sections:**

#### My Subscriptions
- List of all creators the user is subscribed to
- Each subscription shows:
  - Creator profile photo
  - Creator name
  - Subscription price
  - Next billing date
  - "Manage" button (cancel/update payment)
  - "View Profile" link

#### Referral Income (if applicable)
- Total earnings from referrals
- Referral code
- Number of referrals
- Payout history

---

## Technical Implementation

### Auth Check Logic
```javascript
async function handleSubscribe() {
    // Check for valid session (not just localStorage)
    const isLoggedIn = await validateSession();

    if (!isLoggedIn) {
        // Clear any stale localStorage
        localStorage.removeItem('user');
        // Show auth modal
        showAuthModal({
            onSuccess: () => proceedToStripeCheckout()
        });
        return;
    }

    // User is authenticated, proceed to checkout
    proceedToStripeCheckout();
}
```

### 401 Error Handling
```javascript
async function proceedToStripeCheckout() {
    const response = await fetch('/api/subscribe', { ... });

    if (response.status === 401) {
        // Session expired - clear stale auth
        localStorage.removeItem('user');
        // Re-trigger subscribe flow (will show modal)
        handleSubscribe();
        return;
    }

    // Handle success/other errors...
}
```

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CREATOR PROFILE PAGE                         │
│                 /creator/itssjoshl                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    [Profile Photo]                              │
│                        Josh                                     │
│                     @itssjoshl                                  │
│                                                                 │
│              ┌──────────────────────────┐                       │
│              │  Subscribe for $29.99/mo │  ◄── Click            │
│              └──────────────────────────┘                       │
│                           │                                     │
└───────────────────────────│─────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Logged In?    │
                    └───────────────┘
                      │           │
                     NO          YES
                      │           │
                      ▼           │
            ┌─────────────────┐   │
            │   AUTH MODAL    │   │
            │   (Popup)       │   │
            │                 │   │
            │  [Sign Up]      │   │
            │  [Login]        │   │
            └─────────────────┘   │
                      │           │
                      ▼           │
              Auth Success        │
                      │           │
                      └─────┬─────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   STRIPE CHECKOUT     │
                │   $29.99/mo           │
                └───────────────────────┘
                            │
                            ▼
                    Payment Success
                            │
                            ▼
                ┌───────────────────────┐
                │   MEMBER DASHBOARD    │
                │   /member.html        │
                │                       │
                │   - My Subscriptions  │
                │   - Referral Income   │
                └───────────────────────┘
```

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Stale localStorage, expired cookie | Clear localStorage, show auth modal |
| Already subscribed to creator | Show "Already Subscribed" or "Manage Subscription" |
| Stripe checkout cancelled | Return to creator page, no subscription created |
| Payment failed | Show error, allow retry |
| User closes auth modal | Stay on creator page, no action taken |

---

## Files Involved

| File | Purpose |
|------|---------|
| `creator.html` | Creator profile page with subscribe button |
| `member.html` | User dashboard for subscriptions & referrals |
| `auth-modal.js` | Reusable auth modal component |
| `referral-apply.html` | Referral code application page |

---

## Verification Checklist

- [ ] Visit creator page while logged out → Click Subscribe → Auth modal appears
- [ ] Sign up with new account → Redirects to Stripe checkout
- [ ] Complete Stripe payment → Subscription active
- [ ] Visit member.html → See subscription in list
- [ ] Clear cookies (keep localStorage) → Click Subscribe → Auth modal appears (handles stale state)
- [ ] Referral page → Click "Get My Code" → Auth modal appears if not logged in
