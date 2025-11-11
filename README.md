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

**Implementation:**
- Use `localStorage` for client-side preferences (no server round-trip)
- Settings page at `/settings` for centralized configuration
- Settings include:
  - Display count per page (1-200, default: 40)
  - URL auto-linking (default: enabled)
  - Username/email persistence
  - Theme selection (Legacy, Dark, Custom)
- No need for cookie-based serialization
- Settings are per-browser, not per-user (anonymous BBS nature)

**Implemented:**
- Display count (`d` parameter) with localStorage
- URL auto-linking checkbox with localStorage
- Username/email persistence in PostForm and FollowForm
- Theme selection with custom theme editor

**Future Settings:**
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
    - Spatie/Honeypot
    - anonymouse ID
  - System settings (システム設定)
    - BBS configuration (掲示板設定)
    - Maintenance mode (メンテナンスモード)
    - Custom link management (カスタムリンク管理)
  - Database management (データベース管理)
    - Backup/Export (バックアップ・エクスポート)
    - Statistics (統計情報)
- [ ] Mobile responsive design improvements (モバイル対応改善)
- [x] URL auto-linking (URL自動リンク)
  - Detect URLs in post body and convert to links
  - Support http, https, ftp protocols
  - Optional checkbox "URL自動リンク" (default: checked)
  - Server-side processing with autolink() helper
  - Preference saved in localStorage
- [x] Log read mode (ログ読みモード)
  - Hide post form and menu for read-only mode
  - Access via /?hide=1 parameter
  - Toggle with "Log Read" / "Show Form" link
- [x] Undo/Delete own post (投稿取り消し)
  - Allow users to delete their most recent post
  - Time limit: 5 minutes after posting
  - Encrypted token-based authentication
  - Show delete button only on user's latest post
- [x] Tree View (ツリービュー)
  - Display threads in tree structure with text-based branches (├, │, └)
  - All threads view at /tree
  - Individual thread tree at /tree/{id}
  - Unread mode support with post highlighting
  - Remove quoted lines (>) from display
  - Show username with tripcode in italic

### Real-time Features (リアルタイム機能)
- [x] Online user counter (同時接続数表示)
  - Database-based implementation (DBベース実装)
  - 5分以内のアクセスをカウント
  - IPベースのユニークキー生成（SHA256ハッシュ）
  - 古いエントリの自動削除
  - Display "Online: X (within 5 min)" in BbsMenu
- [ ] Modern Mode with WebSocket (モダンモード)
  - Laravel Reverbを使用したWebSocket統合
  - Real-time post updates (新規投稿のリアルタイム表示)
  - Live online user counter (リアルタイム接続数)
  - Optional: typing indicators (入力中表示)
  - Toggle between legacy mode and modern mode
  - Graceful degradation for non-WebSocket browsers

### optional
- [ ] Optional
  - 位置情報投稿機能
  - [ ] Image upload support (画像アップロード)
  - [ ] RSS feed (RSSフィード)
  - [ ] 問合せform
  - [ ] Tree Viewインライン表示
  - [x] Humanized Datediff
    - Unified datetime format: `2025/11/11(火) 18:17:02`
    - Human-readable diff: `3分前`, `2時間前`, `5日前`
    - Utility functions in `/utils/datetime.ts`
  - [ ] Bookmark / Faves

## License

MIT
