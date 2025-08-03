import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, FolderOpen, Tags, MessageCircle, TrendingUp, Eye } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    stats?: {
        total_posts: number;
        published_posts: number;
        draft_posts: number;
        total_categories: number;
        total_tags: number;
        total_comments: number;
        pending_comments: number;
        total_views: number;
    };
    [key: string]: unknown;
}

export default function Dashboard({ stats }: Props) {
    // Default stats if not provided
    const defaultStats = {
        total_posts: 0,
        published_posts: 0,
        draft_posts: 0,
        total_categories: 0,
        total_tags: 0,
        total_comments: 0,
        pending_comments: 0,
        total_views: 0,
    };

    const blogStats = stats || defaultStats;

    const quickActions = [
        {
            title: 'Create New Post',
            description: 'Write a new blog post, article, or news',
            href: '/admin/posts/create',
            icon: FileText,
            color: 'bg-blue-500',
        },
        {
            title: 'Manage Posts',
            description: 'View and edit all your posts',
            href: '/admin/posts',
            icon: FileText,
            color: 'bg-green-500',
        },
        {
            title: 'Categories',
            description: 'Organize your content with categories',
            href: '/admin/categories',
            icon: FolderOpen,
            color: 'bg-purple-500',
        },
        {
            title: 'Tags',
            description: 'Manage post tags and labels',
            href: '/admin/tags',
            icon: Tags,
            color: 'bg-orange-500',
        },
        {
            title: 'Comments',
            description: 'Moderate and manage comments',
            href: '/admin/comments',
            icon: MessageCircle,
            color: 'bg-pink-500',
        },
        {
            title: 'View Blog',
            description: 'See your blog as visitors do',
            href: '/',
            icon: Eye,
            color: 'bg-indigo-500',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-8 p-6">
                {/* Welcome Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        📊 Blog Admin Dashboard
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Welcome to your blog management center! Here you can create, edit, and manage all your content.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{blogStats.total_posts}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">{blogStats.published_posts} published</span>
                                {blogStats.draft_posts > 0 && (
                                    <span className="text-orange-600 ml-2">{blogStats.draft_posts} drafts</span>
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{blogStats.total_categories}</div>
                            <p className="text-xs text-muted-foreground">Content categories</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tags</CardTitle>
                            <Tags className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{blogStats.total_tags}</div>
                            <p className="text-xs text-muted-foreground">Post tags</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Comments</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{blogStats.total_comments}</div>
                            <p className="text-xs text-muted-foreground">
                                {blogStats.pending_comments > 0 ? (
                                    <span className="text-orange-600">{blogStats.pending_comments} pending approval</span>
                                ) : (
                                    'All moderated'
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quickActions.map((action) => (
                            <Card key={action.href} className="hover:shadow-lg transition-shadow cursor-pointer">
                                <Link href={action.href}>
                                    <CardHeader>
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg ${action.color} text-white`}>
                                                <action.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{action.title}</CardTitle>
                                                <CardDescription>{action.description}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Content Types Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2" />
                            Content Types
                        </CardTitle>
                        <CardDescription>
                            Different types of content you can create and manage
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-3xl mb-2">📝</div>
                                <h3 className="font-semibold text-gray-900">Articles</h3>
                                <p className="text-sm text-gray-600">In-depth content and tutorials</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-3xl mb-2">📰</div>
                                <h3 className="font-semibold text-gray-900">News</h3>
                                <p className="text-sm text-gray-600">Latest updates and announcements</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-3xl mb-2">📅</div>
                                <h3 className="font-semibold text-gray-900">Events</h3>
                                <p className="text-sm text-gray-600">Upcoming events and activities</p>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-3xl mb-2">🎓</div>
                                <h3 className="font-semibold text-gray-900">Lectures</h3>
                                <p className="text-sm text-gray-600">Educational content and courses</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Getting Started */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2" />
                            Getting Started
                        </CardTitle>
                        <CardDescription>
                            Tips to get your blog up and running
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div>
                                    <h4 className="font-medium">Create your first category</h4>
                                    <p className="text-sm text-gray-600">Organize your content with meaningful categories</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div>
                                    <h4 className="font-medium">Add some tags</h4>
                                    <p className="text-sm text-gray-600">Help readers discover related content</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <div>
                                    <h4 className="font-medium">Write your first post</h4>
                                    <p className="text-sm text-gray-600">Share your thoughts with the world</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}