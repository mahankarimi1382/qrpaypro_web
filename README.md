<<<<<<<< Update Guide >>>>>>>>>>>

Immediate Older Version: 1.4.1
Current Version: 1.5.0

Feature Update:

1. Updated Assets Architecture & Base URL
2. Security Update
3. Rate Limiter Added

Please Use Those Command On Your Terminal To Update v1.4.1 to v1.5.0

1. Update Composer To Add New Package (Make Sure Your Targeted Location Is Project Root)
   composer update && composer dumpautoload

2. To Added New Migration File
   php artisan migrate

3. To Update Version Related Feature Please Run This Command On Your Terminal (Make Sure Your Targeted Location Is Project Root)
   php artisan db:seed --class=Database\\Seeders\\Update\\VersionUpdateSeeder

4. To link with Storage
   php artisan storage:link

5. To clear all compiled caches (Make Sure Your Targeted Location Is Project Root)
   php artisan optimize:clear

Fresh Installation Guide

1. Update Composer To Update All PHP/Laravel Packages
   composer update

2. Seed Database With Necessary Data
   php artisan migrate:fresh --seed

3. Create Token For API Authentication By Run The Command Below
   php artisan passport:install
