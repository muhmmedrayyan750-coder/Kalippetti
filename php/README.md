# Kalippetti — PHP Login & Registration System

Full-stack authentication with **HTML, CSS, JavaScript, PHP, and MySQL** including role-based dashboards for **Admin**, **Staff**, **Product Manager**, and **Customer** users.

## Features

- User registration and login
- Secure password hashing (`password_hash` / `password_verify`)
- CSRF protection on all forms
- Session-based authentication with role redirect
- Separate dashboards per role
- Admin portal login (blocks regular customers)
- Modern responsive UI matching Kalippetti brand colors

## Folder Structure

```
php/
├── admin/
│   ├── dashboard.php          # Admin full control
│   ├── staff-dashboard.php    # Staff orders & support
│   ├── product-manager.php    # Product & campaign management
│   └── login.php              # Admin/staff/PM login
├── user/
│   └── dashboard.php          # Customer account
├── assets/css/style.css
├── assets/js/main.js
├── config/database.php        # MySQL connection
├── includes/auth.php          # Auth helpers & RBAC
├── database.sql               # MySQL schema
├── install.php                # One-time setup (delete after!)
├── register.php
├── login.php
└── index.php
```

## Setup (XAMPP / WAMP / Laragon)

### 1. Install requirements

- [XAMPP](https://www.apachefriends.org/) (includes Apache, PHP, MySQL)
- Copy this project to `htdocs/kali` or point your web root here

### 2. Create the database

1. Start **Apache** and **MySQL** in XAMPP
2. Open **phpMyAdmin** → http://localhost/phpmyadmin
3. Import `php/database.sql`

### 3. Configure database (if needed)

Edit `php/config/database.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'kalippetti_auth');
define('DB_USER', 'root');
define('DB_PASS', '');  // default XAMPP password is empty
```

### 4. Run install script

Open in browser:

```
http://localhost/kali/php/install.php
```

This creates default admin accounts. **Delete `install.php` after setup.**

### 5. Access the app

| Page | URL |
|------|-----|
| Home | http://localhost/kali/php/ |
| Register | http://localhost/kali/php/register.php |
| Login | http://localhost/kali/php/login.php |
| Admin Login | http://localhost/kali/php/admin/login.php |

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kalippetti.com | Admin@123 |
| Staff | staff@kalippetti.com | Admin@123 |
| Product Manager | pm@kalippetti.com | Admin@123 |

Customers register at `/register.php` — they get the `user` role automatically.

## Role Permissions

| Role | Access |
|------|--------|
| **user** | Customer dashboard, profile, orders |
| **staff** | Staff dashboard — orders, support |
| **product_manager** | Product manager — products, pricing, campaigns |
| **admin** | Full admin dashboard + all other panels |

## How Login Works

1. User submits email + password on `login.php`
2. PHP queries MySQL with a prepared statement
3. `password_verify()` checks the bcrypt hash
4. Session is created; user is redirected by role:
   - `user` → `/user/dashboard.php`
   - `admin` → `/admin/dashboard.php`
   - `staff` → `/admin/staff-dashboard.php`
   - `product_manager` → `/admin/product-manager.php`

## Security Notes

- Passwords are never stored in plain text
- CSRF tokens protect POST forms
- `session_regenerate_id()` prevents session fixation
- Role checks on every protected page via `requireRole()`
- Remove `install.php` in production
- Change default admin passwords immediately

## Connect to React Shop

Your React app (`src/components/AdminPanel.tsx`) uses localStorage. To connect:

1. Build a PHP REST API for products/orders
2. Replace `readStoredData` calls with `fetch()` to PHP endpoints
3. Use the same MySQL database or separate tables

The Product Manager dashboard links to your React admin at `/` for now.
