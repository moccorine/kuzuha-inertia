export function useAutoLink() {
    const autoLinkUrls = (text: string): string => {
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        return text.replace(
            urlPattern,
            '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>',
        );
    };

    return { autoLinkUrls };
}
