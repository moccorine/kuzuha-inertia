import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { formatBbsDateTime, humanizeDiff } from '@/utils/datetime';

interface Post {
    id: number;
    username: string;
    tripcode: string | null;
    email: string | null;
    title: string | null;
    body: string;
    created_at: string;
    parent_id: number | null;
}

interface TreeNode {
    post: Post;
    level: number;
    children: TreeNode[];
}

interface Tree {
    thread: Post;
    tree: TreeNode[];
    updated_at: string;
}

interface Props {
    trees: Tree[];
    pagination: {
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    perPage: number;
    appName: string;
    lastSeenId?: number;
}

function renderTreeNode(node: TreeNode, isLast: boolean, prefix: string = '', lastSeenId?: number): JSX.Element[] {
    const elements: JSX.Element[] = [];
    const branch = isLast ? '└' : '├';
    const continuation = isLast ? '　' : '│';
    
    // Remove quoted lines (lines starting with >)
    const cleanBody = node.post.body
        .split('\n')
        .filter(line => !line.trim().startsWith('>'))
        .join('\n')
        .trim();
    
    const displayName = node.post.tripcode 
        ? <>{node.post.username} <span className="muh">◆{node.post.tripcode}</span></>
        : node.post.username;

    const bodyLines = cleanBody.split('\n').map((line, i) => 
        `${prefix}${continuation}${line}`
    ).join('\n');

    // Highlight new posts
    const isNew = lastSeenId && node.post.id > lastSeenId;
    const bodyHtml = isNew 
        ? `<span style="color: #ccffff;">${bodyLines}</span>`
        : bodyLines;

    elements.push(
        <div key={node.post.id} style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '13px' }}>
            {prefix}{branch}
            <Link href={`/posts/${node.post.id}`} style={{ color: 'var(--theme-link)' }}>
                ■
            </Link>
            {displayName && displayName !== 'Anonymous' && <> {displayName}</>}
            {'\n'}
            <span dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            {'\n'}
        </div>
    );

    node.children.forEach((child, index) => {
        const childIsLast = index === node.children.length - 1;
        const childPrefix = prefix + (isLast ? '　' : '│');
        elements.push(...renderTreeNode(child, childIsLast, childPrefix, lastSeenId));
    });

    return elements;
}

export default function TreeIndex({ trees, pagination, perPage, appName, lastSeenId }: Props) {
    return (
        <GuestLayout>
            <Head title={`${appName} - Tree View`} />
            <div style={{ padding: '1rem 0.5rem 0 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold' }}>{appName}</Link>
                    <span style={{ margin: '0 0.5rem' }}>|</span>
                    <span style={{ fontSize: '18px' }}>Tree View</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <Link href="/">
                        <button type="button">Back to Home</button>
                    </Link>{' '}
                    <Link href={`/tree?readnew=1&d=${perPage}`}>
                        <button type="button">Unread</button>
                    </Link>
                </div>

                <hr style={{ marginBottom: '1rem' }} />

                {trees.length === 0 ? (
                    <div style={{ fontSize: '15px', fontStyle: 'italic' }}>
                        No threads yet.
                    </div>
                ) : (
                    <>
                        {trees.map((tree) => (
                            <div key={tree.thread.id} style={{ marginBottom: '2rem' }}>
                                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '13px' }}>
                                    <Link 
                                        href={`/tree/${tree.thread.id}`}
                                        style={{ color: 'var(--theme-link)' }}
                                    >
                                        ◆
                                    </Link>
                                    <span style={{ color: '#999', marginLeft: '0.5rem' }}>
                                        [Updated: {formatBbsDateTime(tree.updated_at)} ({humanizeDiff(tree.updated_at)})]
                                    </span>
                                    {'\n'}
                                    {tree.tree.map((node, index) => 
                                        renderTreeNode(node, index === tree.tree.length - 1, '　', lastSeenId)
                                    )}
                                </pre>
                                <hr />
                            </div>
                        ))}

                        {pagination.links && (
                            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                {pagination.links.map((link, index) => {
                                    if (!link.url) return null;

                                    if (
                                        !link.label.includes('前へ') &&
                                        !link.label.includes('次へ')
                                    ) {
                                        return null;
                                    }

                                    let label = link.label;
                                    if (label.includes('前へ')) {
                                        label = 'Previous';
                                    } else if (label.includes('次へ')) {
                                        label = 'Next';
                                    }

                                    return (
                                        <span key={index}>
                                            <Link href={link.url}>
                                                <button type="button">{label}</button>
                                            </Link>{' '}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </GuestLayout>
    );
}
