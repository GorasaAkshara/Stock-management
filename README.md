# Stock Management Application

A modern, tablet-first React web application for managing stock inventory items, connected to a PostgreSQL database via a PHP backend.

## Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Native PHP (PDO), REST API
- **Database**: PostgreSQL

## Prerequisites

- **Node.js** (v16+)
- **PHP** (v8.0+) with `pdo_pgsql` extension enabled
- **PostgreSQL** (v13+)

## Setup & Running the Project

You need to run **three separate things** for this project to work.

### 1. Database
Ensure your PostgreSQL service is running and you have created the database.
- Database Name: `stockdb` (or whatever you configured in `backend/db_connect.php`)
- Table Schema:
  ```sql
  CREATE TABLE stock_items (
      id SERIAL PRIMARY KEY,
      stock_number VARCHAR(50) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      quantity INTEGER DEFAULT 0,
      price DECIMAL(10, 2) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

### 2. Backend (PHP)
Open a terminal in the **root** of the project (`stock_management`) and run:
```powershell
php -S localhost:8000
```
This starts the backend API at `http://localhost:8000/backend/api.php`.

### 3. Frontend (React)
Open a **new, separate terminal** in the project root and run:
```powershell
npm run dev
```
This starts the frontend at `http://localhost:5173`.

## Configuration
- **Database Credentials**: Edit `backend/db_connect.php` to set your PostgreSQL user and password.
- **Frontend API URL**: configured in `src/App.tsx` (default: `http://localhost:8000/backend/api.php`).

## Troubleshooting
- **"php is not recognized"**: Install PHP and add it to your System PATH (see `backend/README.md`).
- **"Connection failed"**: Check your password in `backend/db_connect.php`.
- **"Network request failed"**: Ensure the PHP server is running on port 8000.