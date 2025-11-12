/**
 * Format datetime in BBS style: 2025/11/11(火) 18:17:02
 */
export function formatBbsDateTime(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];

    return `${year}/${month}/${day}(${weekday}) ${hours}:${minutes}:${seconds}`;
}

/**
 * Get human-readable time difference
 */
export function humanizeDiff(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
        return `${diffSec}秒前`;
    } else if (diffMin < 60) {
        return `${diffMin}分前`;
    } else if (diffHour < 24) {
        return `${diffHour}時間前`;
    } else if (diffDay < 30) {
        return `${diffDay}日前`;
    } else {
        return formatBbsDateTime(dateString);
    }
}
