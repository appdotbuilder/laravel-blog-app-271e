import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2, Plus, Search, Calendar, User } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    type: 'article' | 'news' | 'event' | 'lecture';
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    views_count: number;
    author: {
        name: string;
    };
    category: {
        name: string;
        color: string;
    };
    tags: Array<{
        name: string;
        color: string;
    }>;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    last_page: number;
}

interface Props {
    posts: {
        data: Post[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    filters: {
        status?: string;
        type?: string;
        search?: string;
    };
    [key: string]: unknown;
}

export default function PostsIndex({ posts, filters }: Props) {
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const params = Object.fromEntries(formData.entries());
        router.get('/admin/posts', params, { preserveState: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeEmoji = (type: string) => {
        switch (type) {
            case 'article': return '📝';
            case 'news': return '📰';
            case 'event': return '📅';
            case 'lecture': return '🎓';
            default: return '📝';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AppShell>
            <Head title="Posts Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📝 Posts Management</h1>
                        <p className="text-gray-600 mt-1">Manage your blog posts, articles, news, events, and lectures</p>
                    </div>
                    <Link href="/admin/posts/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Post
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        name="search"
                                        placeholder="Search posts..."
                                        defaultValue={filters.search}
                                        className="pl-10"
                                    />
                                </div>
                                
                                <Select name="status" defaultValue={filters.status || ''}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Statuses</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <Select name="type" defaultValue={filters.type || ''}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Types</SelectItem>
                                        <SelectItem value="article">📝 Articles</SelectItem>
                                        <SelectItem value="news">📰 News</SelectItem>
                                        <SelectItem value="event">📅 Events</SelectItem>
                                        <SelectItem value="lecture">🎓 Lectures</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <Button type="submit">Filter</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Posts List */}
                <div className="space-y-4">
                    {posts.data.map((post) => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="text-2xl">{getTypeEmoji(post.type)}</span>
                                            <Badge
                                                style={{ backgroundColor: post.category.color }}
                                                className="text-white"
                                            >
                                                {post.category.name}
                                            </Badge>
                                            <Badge className={getStatusColor(post.status)}>
                                                {post.status}
                                            </Badge>
                                        </div>
                                        
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            <Link href={`/admin/posts/${post.id}`} className="hover:text-blue-600">
                                                {post.title}
                                            </Link>
                                        </h3>
                                        
                                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    style={{ borderColor: tag.color, color: tag.color }}
                                                    className="text-xs"
                                                >
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <User className="h-4 w-4 mr-1" />
                                                {post.author.name}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                                            </span>
                                            <span className="flex items-center">
                                                <Eye className="h-4 w-4 mr-1" />
                                                {post.views_count} views
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 ml-4">
                                        <Link href={`/post/${post.slug}`} target="_blank">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/posts/${post.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this post?')) {
                                                    router.delete(`/admin/posts/${post.id}`);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {posts.data.length === 0 && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                                <p className="text-gray-600 mb-6">
                                    {filters.search || filters.status || filters.type
                                        ? 'Try adjusting your search criteria or filters.'
                                        : 'Get started by creating your first post.'}
                                </p>
                                <Link href="/admin/posts/create">
                                    <Button>Create Your First Post</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {posts.meta.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex space-x-2">
                            {posts.links.map((link, index: number) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}