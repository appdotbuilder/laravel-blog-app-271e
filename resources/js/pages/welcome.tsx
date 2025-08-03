import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Eye, MessageCircle, Search, Tag, User } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string | null;
    type: 'article' | 'news' | 'event' | 'lecture';
    status: string;
    published_at: string;
    views_count: number;
    author: {
        id: number;
        name: string;
        email: string;
    };
    category: {
        id: number;
        name: string;
        slug: string;
        color: string;
    };
    tags: Array<{
        id: number;
        name: string;
        slug: string;
        color: string;
    }>;
    approved_comments_count?: number;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    posts_count: number;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    color: string;
    posts_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    last_page: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    posts: {
        data: Post[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    categories: Category[];
    tags: Tag[];
    stats: {
        total_posts: number;
        total_categories: number;
        total_tags: number;
    };
    filters: {
        category?: string;
        tag?: string;
        type?: string;
        search?: string;
    };
    auth?: {
        user: User;
    };
    [key: string]: unknown;
}

export default function Welcome({ posts, categories, tags, stats, filters, auth }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedTag, setSelectedTag] = useState(filters.tag || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', {
            search: searchTerm,
            category: selectedCategory,
            tag: selectedTag,
            type: selectedType,
        }, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedTag('');
        setSelectedType('');
        router.get('/', {}, { preserveState: true });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    return (
        <>
            <Head title="Blog" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    📚 My Blog
                                </h1>
                                <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        📝 {stats.total_posts} Posts
                                    </span>
                                    <span className="flex items-center">
                                        🏷️ {stats.total_categories} Categories
                                    </span>
                                    <span className="flex items-center">
                                        🔖 {stats.total_tags} Tags
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <div className="flex items-center space-x-3">
                                        <Link href="/dashboard">
                                            <Button variant="outline">Dashboard</Button>
                                        </Link>
                                        <Link href="/admin/posts">
                                            <Button>Admin Panel</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link href="/login">
                                            <Button variant="outline">Log in</Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button>Sign up</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">
                            Welcome to Our Blog! 🚀
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Discover amazing articles, latest news, upcoming events, and insightful lectures. 
                            Stay updated with our diverse content covering technology, insights, and more.
                        </p>
                        
                        {/* Search and Filters */}
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    type="text"
                                                    placeholder="Search posts..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                        
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="md:w-48">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All Categories</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.slug}>
                                                        {category.name} ({category.posts_count})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        
                                        <Select value={selectedType} onValueChange={setSelectedType}>
                                            <SelectTrigger className="md:w-48">
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All Types</SelectItem>
                                                <SelectItem value="article">📝 Articles</SelectItem>
                                                <SelectItem value="news">📰 News</SelectItem>
                                                <SelectItem value="event">📅 Events</SelectItem>
                                                <SelectItem value="lecture">🎓 Lectures</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="flex justify-center gap-2">
                                        <Button type="submit">Search</Button>
                                        {(searchTerm || selectedCategory || selectedTag || selectedType) && (
                                            <Button type="button" variant="outline" onClick={clearFilters}>
                                                Clear Filters
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Posts Grid */}
                <section className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {posts.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {posts.data.map((post) => (
                                        <Card key={post.id} className="hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge
                                                        style={{ backgroundColor: post.category.color }}
                                                        className="text-white"
                                                    >
                                                        {post.category.name}
                                                    </Badge>
                                                    <span className="text-2xl">
                                                        {getTypeEmoji(post.type)}
                                                    </span>
                                                </div>
                                                <CardTitle className="line-clamp-2">
                                                    <Link href={`/post/${post.slug}`} className="hover:text-blue-600">
                                                        {post.title}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription className="line-clamp-3">
                                                    {post.excerpt}
                                                </CardDescription>
                                            </CardHeader>
                                            
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.tags.map((tag) => (
                                                        <Badge
                                                            key={tag.id}
                                                            variant="outline"
                                                            style={{ borderColor: tag.color, color: tag.color }}
                                                            className="text-xs"
                                                        >
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                
                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                    <div className="flex items-center space-x-4">
                                                        <span className="flex items-center">
                                                            <User className="h-4 w-4 mr-1" />
                                                            {post.author.name}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {formatDate(post.published_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <span className="flex items-center">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            {post.views_count}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <MessageCircle className="h-4 w-4 mr-1" />
                                                            {post.approved_comments_count || 0}
                                                        </span>
                                                    </div>
                                                    
                                                    <Link href={`/post/${post.slug}`}>
                                                        <Button size="sm">Read More</Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {posts.meta.last_page > 1 && (
                                    <div className="mt-12 flex justify-center">
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
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No posts found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || selectedCategory || selectedTag || selectedType
                                        ? 'Try adjusting your search criteria or filters.'
                                        : 'Check back later for new content!'}
                                </p>
                                {(searchTerm || selectedCategory || selectedTag || selectedType) && (
                                    <Button onClick={clearFilters}>Clear Filters</Button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Tags Cloud */}
                {tags.length > 0 && (
                    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                        <div className="max-w-4xl mx-auto text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">🔖 Popular Tags</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {tags.slice(0, 20).map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant="outline"
                                        style={{ borderColor: tag.color, color: tag.color }}
                                        className="cursor-pointer hover:bg-gray-50 px-3 py-1"
                                        onClick={() => {
                                            setSelectedTag(tag.slug);
                                            router.get('/', { tag: tag.slug }, { preserveState: true });
                                        }}
                                    >
                                        {tag.name} ({tag.posts_count})
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold mb-4">Stay Updated!</h3>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join our community and never miss out on the latest articles, news, events, and lectures. 
                            Subscribe to get notifications about new content.
                        </p>
                        {!auth?.user && (
                            <div className="flex justify-center space-x-4">
                                <Link href="/register">
                                    <Button size="lg">Join Now</Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="outline">Sign In</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        </>
    );
}