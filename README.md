<p align="center"><img src="https://sakowi.cz/img/logo.png" width="400"></p>


## sakowi.cz

My company/photography portfolio website written in Laravel and Vue.js.

###Installation
Copy `.env.example` to `.env` and fill it if needed.

You need to install additional dependencies. Type this in terminal:

```
composer install
npm i
```

Also, you need to set your unique APP_KEY, to do so, enter this in your terminal:

```
php artisan key:generate
```

Create DB schema by typing:

```
php artisan migrate
```

We are using laravel Storage, to store our files. You need to link storage folder to your public folder. To do so, type this:

```
php artisan storage:link
```

Now project is ready for developing. The easiest way to handle that, is to use built-in server and file watcher. 

Run this on separate terminal windows:

Run server:
```
php artisan serve
```

Watch JS and SCSS files:
```
npm run watch
```

Done, you can access page at ```localhost:8000```

#### Seeding

Database is empty by default, you can feel it with example data:

Create admin user with data provided in `.env`

```
DEFAULT_ADMIN_NAME=Admin
DEFAULT_ADMIN_EMAIL=admin@localhost
DEFAULT_ADMIN_PASSWORD=Zaq12wsx
```

```
php artisan db:seed --class=UserSeeder
```

Add example photos by:

```
php artisan db:seed --class=PhotoSeeder
```
