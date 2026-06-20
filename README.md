# Fable Ebook Sharing Platform

## Live URL
https://fable-umber.vercel.app/

## Project Overview
Fable is a modern web application designed for sharing and purchasing ebooks. Readers can search, browse, bookmark, and read original ebooks. Writers are able to publish and manage their personal catalogs after authorization.

This frontend application is built using Next.js App Router and utilizes several modern web technologies to create a seamless user experience.

## Tech Stack
* Next.js App Router for server side rendering and page routing
* Tailwind CSS for responsive and fluid styles
* Better Auth for security credentials
* Stripe Checkout for digital purchase validation
* Axios for communication with the API
* React Toastify for user feedback notifications
* Framer Motion for micro animations
* Recharts for administrative graphs

## Directory Structure
The application structure is organized as follows:
* src/app for pages and layout routing
* src/components for reusable interface widgets
* src/providers for context wrappers
* src/services for API request handlers
* src/lib for third party client instances
* src/utils for formatting helpers

## Core Pages
The platform serves multiple user pathways:
* Home page featuring popular ebooks, top creators, and genre grids
* Browse page with title search, price sorting, and genre filter options
* Details page for reading descriptions and completing purchases
* Secure dashboards customized for readers, writers, and administrators

## Environment Variables
The following environment configurations are required to run the frontend client:
* NEXT_PUBLIC_API_URL
* NEXT_PUBLIC_IMGBB_KEY
* NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
* NEXT_PUBLIC_APP_URL
* BETTER_AUTH_URL
