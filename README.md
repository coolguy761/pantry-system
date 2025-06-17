# Pantry Inventory Management

A simple web app to track your pantry items, generate shopping lists, and manage users with admin controls. Built with Supabase (PostgreSQL + GoTrue Auth) and vanilla HTML/JS/CSS.

---

## Features

- **User Authentication**: Sign up, log in, password reset via Supabase Auth  
- **Pantry Management**: Add, edit, delete items with quantities and expiration dates  
- **Shopping Lists**: Auto-generate (low-stock or expiring items) and custom lists  
- **Admin Panel**:  
  - View & manage all users  
  - View user activity logs (signup, login, item/list operations)  
- **Email Notifications** (planned): Users can opt in for alerts on expiring items  

---

## Tech Stack

- **Frontend**: Plain HTML, CSS, JavaScript  
- **Backend**: Supabase (PostgreSQL + Row-Level Security + GoTrue Auth + Edge Functions)  
- **Hosting**: Netlify /  any static-site host  

---

## Prerequisites

- A [Supabase](https://supabase.com/) project  
- Node.js & npm (for any local dev tooling, optional)  
- Static-site host (e.g. Netlify, Vercel, GitHub Pages)

---

## Setup

1. **Clone the repo**  
   ```bash
   git clone <your-repo-url>
   cd pantry-inventory
