# Project Overview

## 1. Install PHP dependencies & Front End
composer install

npm install

## 2. Database Schemas
The application relies on the following table structures:

Users: id

Products: id

Cart: user_id, product_id, status

## 3. Database Setup
To migrate the tables and populate the database with dummy information in one step, use the following command:

php artisan migrate --seed

## 4. Dummy User Credentials
For testing and initial login, the following administrative account is created during the seeding process:

Email: admin@admin.com

Password: @123456789@

## 5. Custom Commands
The project includes a custom Artisan command to force the execution of the scheduled daily sales reporting task:


php artisan report:daily-sales