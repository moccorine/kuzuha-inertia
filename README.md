# Kuzuha/Inertia

Legacy BBS reimplemented with Laravel + Inertia.js + React

## Requirements

- PHP 8.2+
- Node.js 20+
- MySQL 8.0+ or MariaDB 10.3+
- Composer
- Docker & Docker Compose (for Laravel Sail)

## Installation

```bash
# Clone repository
git clone <repository-url>
cd kuzuha-inertia

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Start Docker containers
./vendor/bin/sail up -d

# Run migrations
./vendor/bin/sail artisan migrate

# Build assets
./vendor/bin/sail npm run build
./vendor/bin/sail npm run build -- --ssr
```

## SSR Deployment

### Build for Production

```bash
# Build client assets
npm run build

# Build SSR bundle
npm run build -- --ssr
```

### Start SSR Server

```bash
# Start SSR server (foreground)
php artisan inertia:start-ssr

# Or use process manager (recommended for production)
# supervisord, pm2, etc.
```

### Supervisor Configuration Example

```ini
[program:inertia-ssr]
command=php /path/to/project/artisan inertia:start-ssr
directory=/path/to/project
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/path/to/project/storage/logs/ssr.log
```

### PM2 Configuration Example

```bash
pm2 start "php artisan inertia:start-ssr" --name inertia-ssr
pm2 save
pm2 startup
```

## Development

```bash
# Start dev server
./vendor/bin/sail npm run dev

# Watch for changes
./vendor/bin/sail npm run dev
```

## Features

- Legacy BBS style UI (#004040 background)
- Anonymous posting
- Server-Side Rendering (SSR)
- Git-based versioning
- Admin password protection

## License

MIT
