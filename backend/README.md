# Backend Setup Guide

## 1. Install PHP
You need PHP installed on your system to run the backend.

### Option A: Using Winget (Recommended)
Open your terminal (PowerShell) as Administrator and run:
```powershell
winget install PHP.PHP
```
After installation, restart your terminal.

### Option B: Manual Installation
1. Download **VS16 x64 Thread Safe** zip from [windows.php.net](https://windows.php.net/download/).
2. Extract it to `C:\php`.
3. Add `C:\php` to your System PATH environment variable.

## 2. Configure PHP for PostgreSQL
1. Go to your PHP directory (e.g., `C:\php`).
2. Copy `php.ini-development` and rename it to `php.ini`.
3. Open `php.ini` with a text editor.
4. Uncomment (remove `;`) the following lines:
   ```ini
   extension_dir = "ext"
   extension=curl
   extension=mbstring
   extension=openssl
   extension=pdo_pgsql
   extension=pgsql
   ```
5. Save the file.

## 3. Configure Database Connection
Open `backend/db_connect.php` and update the credentials:
```php
$dbname = 'stockdb'; 
$user = 'postgres'; 
$password = 'YOUR_PASSWORD'; // Update this!
```

## 4. Run the Server
In the project root directory:
```powershell
php -S localhost:8000
```
