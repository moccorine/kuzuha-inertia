import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/useLang';
import AppLayout from '@/layouts/app-layout';
import {
    index as linkManagementRoute,
    store as linkStoreRoute,
    update as linkUpdateRoute,
    destroy as linkDestroyRoute,
    reorder as linkReorderRoute,
} from '@/routes/admin/links';
import { type BreadcrumbItem, type CustomLink } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
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
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { type FormEvent, useState, useEffect } from 'react';
import InputError from '@/components/input-error';

type LinkManagementProps = {
    links: CustomLink[];
};

function SortableItem({
    link,
    onEdit,
    onDelete,
}: {
    link: CustomLink;
    onEdit: (link: CustomLink) => void;
    onDelete: (id: number) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 rounded-lg border bg-card p-3"
        >
            <button
                className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-5 w-5" />
            </button>
            <div className="flex-1">
                <div className="font-medium">{link.name}</div>
                <div className="text-xs text-muted-foreground">{link.url}</div>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit(link)}
            >
                <Pencil className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(link.id)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

export default function LinkManagementPage({ links }: LinkManagementProps) {
    const { __ } = useLang();
    const [sortedLinks, setSortedLinks] = useState<CustomLink[]>(links);
    const [editingLink, setEditingLink] = useState<CustomLink | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('Link Management'),
            href: linkManagementRoute().url,
        },
    ];

    const form = useForm({
        name: '',
        url: '',
    });

    // Sync sortedLinks with props when they change
    useEffect(() => {
        setSortedLinks(links);
    }, [links]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSortedLinks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order on server
                const reorderedLinks = newItems.map((item, index) => ({
                    id: item.id,
                    order: index,
                }));

                router.post(
                    linkReorderRoute().url,
                    { links: reorderedLinks },
                    { preserveScroll: true },
                );

                return newItems;
            });
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (editingLink) {
            form.put(linkUpdateRoute({ link: editingLink.id }).url, {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    setEditingLink(null);
                },
            });
        } else {
            form.post(linkStoreRoute().url, {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                },
            });
        }
    };

    const handleEdit = (link: CustomLink) => {
        setEditingLink(link);
        form.setData({
            name: link.name,
            url: link.url,
        });
    };

    const handleCancelEdit = () => {
        setEditingLink(null);
        form.reset();
    };

    const handleDelete = (id: number) => {
        if (confirm(__('Are you sure you want to delete this link?'))) {
            router.delete(linkDestroyRoute({ link: id }).url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Link Management')} />
            <div className="grid gap-6 lg:grid-cols-2 px-6 md:px-4">
                <Card>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    {__('Link Name')}
                                </Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    placeholder={__('Enter link name...')}
                                />
                                <InputError
                                    message={form.errors.name}
                                    className="text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">{__('URL')}</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={form.data.url}
                                    onChange={(e) =>
                                        form.setData('url', e.target.value)
                                    }
                                    placeholder={__('https://example.com')}
                                />
                                <InputError
                                    message={form.errors.url}
                                    className="text-sm"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {editingLink && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                    >
                                        {__('Cancel')}
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                >
                                    {editingLink ? __('Update') : __('Add Link')}
                                </Button>
                                {form.recentlySuccessful && (
                                    <span className="text-sm text-emerald-600">
                                        {__('Saved')}
                                    </span>
                                )}
                            </div>
                        </form>

                        <div className="mt-6 space-y-2">
                            <h3 className="text-sm font-semibold">
                                {__('Manage Links')}
                            </h3>
                            {sortedLinks.length > 0 ? (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={sortedLinks.map((link) => link.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-2">
                                            {sortedLinks.map((link) => (
                                                <SortableItem
                                                    key={link.id}
                                                    link={link}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {__('No links yet. Add your first link above.')}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{__('Preview')}</CardTitle>
                        <CardDescription>
                            {__('This is how links will appear on the site.')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-dashed border-sidebar-border/60 p-4">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span>|</span>
                                <a href="#" className="hover:text-foreground">
                                    {__('Info Page')}
                                </a>
                                <span>|</span>
                                <a href="#" className="hover:text-foreground">
                                    {__('Archive')}
                                </a>
                                <span>|</span>
                                {sortedLinks.map((link) => (
                                    <span
                                        key={link.id}
                                        className="flex items-center gap-2"
                                    >
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-foreground"
                                        >
                                            {link.name}
                                        </a>
                                        <span>|</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
