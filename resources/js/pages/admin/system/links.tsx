import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface CustomLink {
    id: number;
    title: string;
    url: string;
    order: number;
    is_active: boolean;
}

interface Props {
    links: CustomLink[];
}

function SortableItem({ 
    link, 
    onToggleActive, 
    onDelete 
}: { 
    link: CustomLink; 
    onToggleActive: (link: CustomLink) => void;
    onDelete: (id: number) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-4 p-4 border rounded-lg"
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <div className={`font-medium ${!link.is_active ? 'line-through opacity-50' : ''}`}>
                    {link.title}
                </div>
                <div className={`text-sm text-muted-foreground ${!link.is_active ? 'line-through opacity-50' : ''}`}>
                    <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        {link.url}
                    </a>
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant={link.is_active ? 'outline' : 'default'}
                    onClick={() => onToggleActive(link)}
                >
                    {link.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(link.id)}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}

export default function Links({ links: initialLinks }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [links, setLinks] = useState(initialLinks);
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = links.findIndex((link) => link.id === active.id);
            const newIndex = links.findIndex((link) => link.id === over.id);

            const newLinks = arrayMove(links, oldIndex, newIndex);
            setLinks(newLinks);

            // Update order in database
            newLinks.forEach((link, index) => {
                router.patch(`/admin/system/links/${link.id}`, {
                    title: link.title,
                    url: link.url,
                    order: index + 1,
                    is_active: link.is_active,
                }, {
                    preserveScroll: true,
                });
            });
        }
    };
    
    const { data, setData, post, processing, reset } = useForm({
        title: '',
        url: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/system/links', {
            onSuccess: () => reset(),
        });
    };

    const handleToggleActive = (link: CustomLink) => {
        console.log('Toggling active for link:', link.id, 'current:', link.is_active);
        
        router.patch(`/admin/system/links/${link.id}`, {
            title: link.title,
            url: link.url,
            order: link.order,
            is_active: !link.is_active,
        }, {
            onSuccess: () => {
                console.log('Toggle success');
                setLinks(links.map(l => 
                    l.id === link.id ? { ...l, is_active: !l.is_active } : l
                ));
            },
            onError: (errors) => {
                console.error('Toggle error:', errors);
            },
        });
    };

    const handleDelete = (linkId: number) => {
        if (confirm('このリンクを削除しますか？')) {
            router.delete(`/admin/system/links/${linkId}`, {
                onSuccess: () => {
                    setLinks(links.filter(l => l.id !== linkId));
                },
            });
        }
    };

    const handleUpdate = (link: CustomLink) => {
        const form = useForm({
            title: link.title,
            url: link.url,
            order: link.order,
            is_active: link.is_active,
        });

        form.patch(`/admin/system/links/${link.id}`, {
            onSuccess: () => setEditingId(null),
        });
    };

    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Link Management</h1>

                <div className="mb-8 p-4 border rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Add New Link</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Title
                            </label>
                            <Input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="bg-background"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                URL
                            </label>
                            <Input
                                type="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                className="bg-background"
                                required
                            />
                        </div>
                        <Button type="submit" disabled={processing}>
                            Add Link
                        </Button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Custom Links</h2>
                    
                    {links.length > 0 && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                            <div className="text-sm font-medium mb-2">Preview:</div>
                            <div className="text-sm">
                                {links.filter(l => l.is_active).map((link, index) => (
                                    <span key={link.id}>
                                        {index > 0 && ' | '}
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {link.title}
                                        </a>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {links.length === 0 ? (
                        <p className="text-muted-foreground">No links yet.</p>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={links.map(l => l.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {links.map((link) => (
                                        <SortableItem
                                            key={link.id}
                                            link={link}
                                            onToggleActive={handleToggleActive}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
