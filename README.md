# 📚 Fable - Ebook Sharing Platform (Frontend)

## 🌍 Live URL
[Add Vercel URL Here]

---

# Project Overview

Fable is a modern Ebook Sharing Platform where readers can discover, purchase, bookmark, and read ebooks while writers can publish and manage their own ebooks after verification.

This frontend application is built with:

- Next.js 15 (App Router)
- Tailwind CSS
- Better Auth
- Stripe Checkout
- MongoDB (via API)
- React Toastify
- Framer Motion
- JWT Authentication
- imgBB Integration
- Recharts

---

# Tech Stack

| Technology | Purpose |
|------------|----------|
| Next.js App Router | Frontend Framework |
| Tailwind CSS | Styling |
| BetterAuth | Authentication |
| React Toastify | Notifications |
| Framer Motion | Animations |
| Stripe | Payment Gateway |
| JWT | Authorization |
| Axios | API Requests |
| React Hook Form | Form Handling |
| Zod | Validation |
| Recharts | Analytics Charts |
| imgBB | Image Upload |

---

# Project Structure

src/

├── app/

├── components/

├── providers/

├── hooks/

├── services/

├── lib/

├── utils/

├── constants/

├── types/

├── context/

├── middleware.js

└── assets/

---

# Public Pages

## Home Page

Route:

```
/
```

### Sections

#### Navbar

- Logo
- Home
- Browse Ebooks
- Dashboard
- Login / Logout
- Mobile Hamburger Menu

#### Hero Banner

Tagline:

```
Discover & Read Original Ebooks
```

CTA:

```
Browse Ebooks
```

Features:

- Slider / Carousel
- Framer Motion animations

#### Featured Ebooks

Display:

- Latest 6 ebooks
- Dynamic API fetch

Card Contains:

- Cover Image
- Title
- Writer Name
- Price
- View Details Button

#### Top Writers

Display top 3 writers

Card:

- Avatar
- Writer Name
- Total Sales

#### Ebook Genres

Grid:

- Fiction
- Romance
- Mystery
- Sci-Fi
- Fantasy
- Horror
- Thriller
- Biography

Clicking genre redirects:

```
/browse?genre=fiction
```

#### Footer

- Copyright
- Privacy Policy
- Contact
- About
- Newsletter Placeholder
- Social Icons

---

# Authentication

## Register

Route

```
/register
```

Fields:

- Full Name
- Email
- Password
- Confirm Password
- Role Selection

Roles:

- User
- Writer

Validation:

- Unique email
- Password match

Success Flow:

Register
→ Login
→ Receive JWT
→ Redirect Home

---

## Login

Route

```
/login
```

Methods:

- Email Password
- Google Login

Success Flow:

Login
→ JWT stored
→ Session Created
→ Redirect

---

# Browse Ebooks

Route

```
/browse
```

Features

### Search

Search by:

- Title
- Writer Name

### Filters

Genre

Price Range

Availability

- Available
- Sold

### Sorting

- Newest
- Price Low → High
- Price High → Low

### Pagination

6-12 ebooks per page

### Ebook Card

- Cover
- Title
- Writer
- Price
- Sold Badge
- View Details

---

# Ebook Details

Route

```
/ebooks/[id]
```

### Display

- Cover
- Title
- Writer
- Description
- Price
- Genre
- Upload Date
- Availability

### Actions

Bookmark

Buy Now

Conditions:

- User must login
- Writer cannot buy own ebook
- Purchased user sees:

```
Already Purchased
```

### After Purchase

- Full Content Visible
- Purchase History Created

---

# Dashboard Layout

Route

```
/dashboard
```

Protected Route

Role Based Access

---

# User Dashboard

Route

```
/dashboard/user
```

### Pages

#### Purchase History

Table:

- Ebook
- Writer
- Price
- Date

#### Purchased Ebooks

Gallery View

#### Bookmarks

Gallery View

#### Profile

- View Profile
- Edit Profile Picture

---

# Writer Dashboard

Route

```
/dashboard/writer
```

### Dashboard Home

Statistics Cards

### Manage Ebooks

Table

Columns:

- Title
- Price
- Status
- Actions

Actions:

- Edit
- Delete
- Publish
- Unpublish

### Add Ebook

Route

```
/dashboard/writer/add-ebook
```

Fields:

- Title
- Genre
- Description
- Full Content
- Price
- Cover Image

Image Upload:

imgBB

### Edit Ebook

Route

```
/dashboard/writer/edit/[id]
```

### Sales History

Columns:

- Ebook
- Buyer
- Date
- Amount

### Bookmarks

Gallery

---

# Admin Dashboard

Route

```
/dashboard/admin
```

## Dashboard Home

Analytics Cards

- Total Users
- Total Writers
- Total Ebooks Sold
- Total Revenue

Charts

### Monthly Sales Chart

Line Chart

### Genre Distribution

Pie Chart

---

## Manage Users

Columns

- Name
- Email
- Role

Actions

- Change Role
- Delete

---

## Manage Ebooks

Columns

- Title
- Writer
- Price
- Status

Actions

- Publish
- Unpublish
- Delete

---

## Transactions

Columns

- Transaction ID
- Type
- Email
- Amount
- Date

---

# Global Components

## Loading Spinner

Used During:

- Route Change
- Payment Redirect
- API Calls

## Skeleton Loader

Used:

- Ebook Cards
- Dashboard Tables

## Error Boundary

Fallback UI:

```
Something went wrong.
Please reload.
```

## Custom 404

```
Page Not Found
```

Button:

```
Back Home
```

---

# Authentication Flow

Guest
↓
Register/Login
↓
JWT Generated
↓
Role Loaded
↓
Dashboard Access

---

# Frontend API Services

/auth
/users
/ebooks
/bookmarks
/purchases
/payments
/admin
/writers
/analytics

---

# Environment Variables

NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_IMGBB_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_APP_URL=

BETTER_AUTH_URL=

---

# Color Palette

Primary:

#6D28D9

Secondary:

#A855F7

Accent:

#F59E0B

Background:

#F8FAFC

Dark:

#0F172A

---

# Future Features

- Wishlist
- Dark Mode
- Reading Progress
- Writer Profiles
- Ebook Reviews
- Ratings
- Reading Statistics
