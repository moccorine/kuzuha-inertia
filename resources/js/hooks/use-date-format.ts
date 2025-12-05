export function useDateFormat() {
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const locale = document.documentElement.lang || 'en';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const weekday = date.toLocaleDateString(locale, { weekday: 'short' });

        return `${year}/${month}/${day}(${weekday}) ${hours}:${minutes}:${seconds}`;
    }

    return { formatDate };
}
