import { Link } from '@inertiajs/react';
import React from 'react';

// ツリー表示用の文字定数
const FULL_WIDTH_SPACE = '\u3000'; // 全角スペース
const VERTICAL_LINE = '│';
const BRANCH = '├';
const LAST_BRANCH = '└';

// エクスポートして他のファイルでも使えるようにする
export { FULL_WIDTH_SPACE };

export interface Post {
    id: number;
    username: string | null;
    email: string | null;
    title: string | null;
    message: string;
    parent_id: number | null;
    thread_id: number | null;
    metadata: {
        url?: string;
        auto_link?: boolean;
        reference?: {
            post_id: number;
            created_at: string;
        };
    } | null;
    created_at: string;
}

export interface TreeNode {
    post: Post;
    children: TreeNode[];
}

export function buildTree(posts: Post[]): TreeNode[] {
    const postMap = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];

    // 全投稿をマップに追加
    posts.forEach((post) => {
        postMap.set(post.id, { post, children: [] });
    });

    // 親子関係を構築
    posts.forEach((post) => {
        const node = postMap.get(post.id)!;
        if (post.parent_id && postMap.has(post.parent_id)) {
            const parent = postMap.get(post.parent_id)!;
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}

interface RenderTreeNodeOptions {
    __: (key: string) => string;
    followUrl: (postId: number) => string;
    lastViewedId: number;
}

export function renderTreeNode(
    node: TreeNode,
    options: RenderTreeNodeOptions,
    depth: number = 0,
    isLast: boolean = false,
    ancestorPrefixForMessage: string = '',
): JSX.Element {
    const { __, followUrl, lastViewedId } = options;

    // ■リンク用のancestorPrefixは、親のancestorPrefixForMessage
    const ancestorPrefixForLink =
        depth > 1 ? ancestorPrefixForMessage.slice(0, -1) : '';
    const isUnread = node.post.id > lastViewedId;

    // メッセージから引用と参考を削除
    let cleanMessage = node.post.message;
    cleanMessage = cleanMessage.replace(/^>.*$/gm, '').trim();

    // ブランチ記号
    const branch = depth > 0 ? (isLast ? LAST_BRANCH : BRANCH) : '';

    // メッセージの各行にインデントを追加
    const hasChildren = node.children.length > 0;

    // 親からの継承：この投稿が最後の子かどうか
    const parentLinePrefix = isLast ? FULL_WIDTH_SPACE : VERTICAL_LINE;

    // この投稿自身の縦線：子供がいるかどうか
    const ownLinePrefix = hasChildren ? VERTICAL_LINE : FULL_WIDTH_SPACE;

    const messageLines = cleanMessage.split('\n');
    const indentedMessage = messageLines
        .map((line, index) => {
            if (index === 0) {
                // 1行目はそのまま
                return line;
            }
            // 2行目以降は基本インデント + 祖先の継承 + 自分の縦線 + 内容
            return (
                FULL_WIDTH_SPACE +
                ancestorPrefixForMessage +
                ownLinePrefix +
                line
            );
        })
        .join('\n');

    return (
        <React.Fragment key={node.post.id}>
            {depth > 0 && FULL_WIDTH_SPACE + ancestorPrefixForLink}
            {branch}
            <Link
                href={followUrl(node.post.id)}
                className="text-blue-600 hover:underline"
            >
                ■
            </Link>
            {__('Author prefix')}
            {node.post.username || ''}
            {'\n'}
            {FULL_WIDTH_SPACE +
                (depth === 0 ? '' : ancestorPrefixForMessage) +
                ownLinePrefix}
            <span className={isUnread ? 'bg-cyan-100' : ''}>
                {indentedMessage}
            </span>
            {'\n'}
            {node.children.map((child, index) =>
                renderTreeNode(
                    child,
                    options,
                    depth + 1,
                    index === node.children.length - 1,
                    ancestorPrefixForMessage +
                        (index === node.children.length - 1
                            ? FULL_WIDTH_SPACE
                            : VERTICAL_LINE),
                ),
            )}
        </React.Fragment>
    );
}
