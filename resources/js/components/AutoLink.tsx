import Linkify from 'linkify-react';

interface AutoLinkProps {
    html: string;
}

export default function AutoLink({ html }: AutoLinkProps) {
    // Parse HTML and linkify text nodes only
    return (
        <Linkify
            as="span"
            options={{
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'autolink',
            }}
        >
            <span dangerouslySetInnerHTML={{ __html: html }} />
        </Linkify>
    );
}
