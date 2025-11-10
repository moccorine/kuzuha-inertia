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

## Changes from Legacy BBS

- **Database**: File-based (.dat) → MySQL/MariaDB
- **Gzip compression**: Removed (modern web servers handle this automatically)
- **i-mode support**: Removed (obsolete mobile phone format)

## Implementation Notes

### Settings (環境設定)

Legacy BBS stored user preferences in cookies (colors, display count, etc.). Modern approach:

**Planned Implementation:**
- Use `localStorage` for client-side preferences (no server round-trip)
- Settings include:
  - Display count per page (already implemented)
  - Username/email persistence (already implemented)
  - Theme/color preferences (future)
  - UI preferences (future)
- No need for cookie-based serialization
- Settings are per-browser, not per-user (anonymous BBS nature)

**Already Implemented:**
- Display count (`d` parameter) with localStorage
- Username/email persistence in PostForm

**Future Settings:**
- Color scheme customization
- Font size adjustment
- Compact/detailed view toggle

## TODO

### Archive & Search (アーカイブ・検索)
- [ ] 年月別投稿数一覧ページ
- [ ] SQLite FTS5による全文検索
- [ ] キーワード検索（タイトル・本文）
- [ ] 日付範囲指定検索
- [ ] 投稿のJSON/HTMLエクスポート機能

### Other Features (その他機能)
- [ ] Settings functionality (設定機能)
- [ ] Info page (情報ページ)
- [ ] Admin panel (管理画面)
- [ ] Image upload support (画像アップロード)
- [ ] RSS feed (RSSフィード)
- [ ] Mobile responsive design improvements (モバイル対応改善)

## License

MIT
