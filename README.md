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
git clone https://github.com/moccorine/kuzuha-inertia.git
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
- Username-based authentication (admin only)
- Theme system (default, dark, custom themes)
- Admin panel (UI framework implemented)

## Admin Panel

Access: `/admin` (requires authentication)

**Implemented:**
- Dashboard
- Settings
  - Profile management
  - Password change
  - Two-factor authentication
  - Theme selection
- Navigation structure for:
  - Posts management (TODO)
  - User restrictions (TODO)
  - System settings (TODO)

**Authentication:**
- Username-based login (not email)
- User registration disabled
- Initial admin user created via installer

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
- [x] Information page (情報ページ)
  - Markdown-based content (Markdownで記述)
  - Store in database (information_page table)
  - Render with react-markdown
  - Admin can edit via CodeMirror editor at /admin/system/information
  - Public display at /{url} or /information
- [x] Tripcode support (トリップ機能)
  - Username format: `Name#password` → `Name ◆tripcode`
  - Generate tripcode using HMAC-SHA256 with APP_KEY
  - 10-character hash displayed in italic after username
  - Stored in database (posts.tripcode column)
  - Same password always generates same tripcode
- [x] Admin panel UI framework (管理画面UIフレームワーク)
  - Navigation menu (Dashboard, Posts, Restrictions, System)
  - Settings pages (Profile, Password, Two-factor, Theme)
  - AppLayout with breadcrumbs
- [ ] Admin panel functionality (管理画面機能)
  - Post management (投稿管理)
    - List all posts with filters (投稿一覧・フィルター)
    - Delete posts (投稿削除)
    - View post details (IP, user agent, etc.)
  - User restrictions (ユーザー制限)
    - Ban IP addresses (IP禁止)
    - View access logs (アクセスログ)
  - System settings (システム設定)
    - BBS configuration (掲示板設定)
    - Maintenance mode (メンテナンスモード)
    - Custom link management (カスタムリンク管理)
  - Database management (データベース管理)
    - Backup/Export (バックアップ・エクスポート)
    - Statistics (統計情報)
- [ ] Image upload support (画像アップロード)
- [ ] RSS feed (RSSフィード)
- [ ] Mobile responsive design improvements (モバイル対応改善)
- [ ] URL auto-linking (URL自動リンク)
  - Detect URLs in post body and convert to links
  - Support http, https, ftp protocols
- [ ] Log read mode (ログ読みモード)
  - Toggle between newest-first and oldest-first display
  - Store preference in localStorage
  - Auto-enable for unread mode
- [x] Undo/Delete own post (投稿取り消し)
  - Allow users to delete their most recent post
  - Time limit: 5 minutes after posting
  - Encrypted token-based authentication
  - Show delete button only on user's latest post

### Real-time Features (リアルタイム機能)
- [ ] Online user counter (同時接続数表示)
  - Redis/Memcachedでの実装を推奨
  - 5分以内のアクセスをカウント
  - IPベースの一意キー生成
- [ ] Modern Mode with WebSocket (モダンモード)
  - Laravel Reverbを使用したWebSocket統合
  - Real-time post updates (新規投稿のリアルタイム表示)
  - Live online user counter (リアルタイム接続数)
  - Optional: typing indicators (入力中表示)
  - Toggle between legacy mode and modern mode
  - Graceful degradation for non-WebSocket browsers

## License

MIT
