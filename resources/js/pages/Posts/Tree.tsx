import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';

interface Post {
    id: number;
    parent_id: number | null;
    username: string;
    email: string | null;
    title: string | null;
    body: string;
    created_at: string;
    thread_id: number | null;
}

interface TreeNode {
    post: Post;
    level: number;
    children: TreeNode[];
}

interface Props {
    tree: TreeNode[];
    threadId: string;
    appName: string;
}

export default function Tree({ tree, threadId, appName }: Props) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
        const year = jstDate.getUTCFullYear();
        const month = String(jstDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(jstDate.getUTCDate()).padStart(2, '0');
        const weekday = ['日', '月', '火', '水', '木', '金', '土'][jstDate.getUTCDay()];
        const hours = String(jstDate.getUTCHours()).padStart(2, '0');
        const minutes = String(jstDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(jstDate.getUTCSeconds()).padStart(2, '0');
        return `${year}/${month}/${day}(${weekday}) ${hours}:${minutes}:${seconds}`;
    };

    const stripHtml = (html: string) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const renderTree = (nodes: TreeNode[]) => {
        return nodes.map((node) => (
            <div key={node.post.id}>
                <div style={{ 
                    marginLeft: `${node.level * 20}px`,
                    marginBottom: '0.3rem',
                    fontSize: '13px'
                }}>
                    {node.level > 0 && (
                        <span style={{ color: '#009090' }}>
                            {'└─ '.repeat(1)}
                        </span>
                    )}
                    <Link href={`/posts/${node.post.id}`} style={{ color: '#efe' }}>
                        {node.level === 0 
                            ? (node.post.title ? `◆ ${node.post.title}` : '◆')
                            : (node.post.title ? `■ ${node.post.title}` : '■')
                        }
                    </Link>
                    {' - '}
                    <span style={{ color: '#ccc' }}>
                        {node.post.username || 'Anonymous'}
                    </span>
                    {' '}
                    <span style={{ color: '#999', fontSize: '12px' }}>
                        {formatDate(node.post.created_at)}
                    </span>
                </div>
                <div style={{ 
                    marginLeft: `${node.level * 20 + 20}px`,
                    marginBottom: '1rem',
                    fontSize: '13px',
                    color: '#ddd',
                    whiteSpace: 'pre-wrap'
                }}>
                    {stripHtml(node.post.body).substring(0, 100)}{stripHtml(node.post.body).length > 100 ? '...' : ''}
                </div>
                {node.children.length > 0 && renderTree(node.children)}
            </div>
        ));
    };

    return (
        <GuestLayout>
            <Head title={`Tree View - Thread ${threadId} - ${appName}`} />
            <div style={{ padding: '1rem 0.5rem 0 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link href="/">{appName}</Link> - Tree View
                </div>

                <hr style={{ marginBottom: '1rem' }} />

                <div style={{ marginBottom: '1rem' }}>
                    {renderTree(tree)}
                </div>

                <hr style={{ marginTop: '1rem', marginBottom: '1rem' }} />

                <div style={{ marginTop: '1rem' }}>
                    <Link href={`/threads/${threadId}`}>←Back to Thread</Link>
                    {' | '}
                    <Link href="/">Back to Main</Link>
                </div>
            </div>
        </GuestLayout>
    );
}
