import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Eye, MessageCircle, Share2, User, Facebook, Twitter, Linkedin } from 'lucide-react';

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
    approved_comments: Array<{
        id: number;
        content: string;
        author_name: string;
        author_email: string;
        author_website: string | null;
        created_at: string;
        replies: Array<{
            id: number;
            content: string;
            author_name: string;
            author_email: string;
            author_website: string | null;
            created_at: string;
        }>;
    }>;
}

interface RelatedPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    published_at: string;
    author: {
        name: string;
    };
    category: {
        name: string;
        color: string;
    };
}

interface Props {
    post: Post;
    relatedPosts: RelatedPost[];
    [key: string]: unknown;
}

export default function BlogShow({ post, relatedPosts }: Props) {
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentData, setCommentData] = useState({
        content: '',
        author_name: '',
        author_email: '',
        author_website: ''
    });

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/post/${post.slug}/comments`, commentData, {
            preserveState: true,
            onSuccess: () => {
                setCommentData({
                    content: '',
                    author_name: '',
                    author_email: '',
                    author_website: ''
                });
                setIsCommenting(false);
            }
        });
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

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post.title;

    const socialShareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    return (
        <>
            <Head title={post.title} />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Blog
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">📚 My Blog</h1>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Post Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <Badge
                                    style={{ backgroundColor: post.category.color }}
                                    className="text-white"
                                >
                                    {post.category.name}
                                </Badge>
                                <span className="text-3xl">{getTypeEmoji(post.type)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 flex items-center">
                                    <Eye className="h-4 w-4 mr-1" />
                                    {post.views_count} views
                                </span>
                                <span className="text-sm text-gray-500 flex items-center">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {post.approved_comments.length} comments
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-6 text-gray-600">
                                <span className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    {post.author.name}
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    {formatDate(post.published_at)}
                                </span>
                            </div>
                            
                            {/* Social Share */}
                            <div className="flex items-center space-x-2">
                                <Share2 className="h-5 w-5 text-gray-400" />
                                <a
                                    href={socialShareLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a
                                    href={socialShareLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-500 hover:text-sky-700"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a
                                    href={socialShareLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:text-blue-900"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="outline"
                                    style={{ borderColor: tag.color, color: tag.color }}
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Post Content */}
                    <Card className="mb-8">
                        <CardContent className="p-8">
                            <div 
                                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MessageCircle className="h-5 w-5 mr-2" />
                                Comments ({post.approved_comments.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Add Comment Form */}
                            <div className="mb-8">
                                {!isCommenting ? (
                                    <Button onClick={() => setIsCommenting(true)}>
                                        💬 Leave a Comment
                                    </Button>
                                ) : (
                                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="author_name">Name *</Label>
                                                <Input
                                                    id="author_name"
                                                    type="text"
                                                    required
                                                    value={commentData.author_name}
                                                    onChange={(e) => setCommentData({
                                                        ...commentData,
                                                        author_name: e.target.value
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="author_email">Email *</Label>
                                                <Input
                                                    id="author_email"
                                                    type="email"
                                                    required
                                                    value={commentData.author_email}
                                                    onChange={(e) => setCommentData({
                                                        ...commentData,
                                                        author_email: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="author_website">Website (optional)</Label>
                                            <Input
                                                id="author_website"
                                                type="url"
                                                value={commentData.author_website}
                                                onChange={(e) => setCommentData({
                                                    ...commentData,
                                                    author_website: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="content">Comment *</Label>
                                            <Textarea
                                                id="content"
                                                required
                                                rows={4}
                                                value={commentData.content}
                                                onChange={(e) => setCommentData({
                                                    ...commentData,
                                                    content: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button type="submit">Submit Comment</Button>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={() => setIsCommenting(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Your comment will be reviewed before being published.
                                        </p>
                                    </form>
                                )}
                            </div>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {post.approved_comments.map((comment) => (
                                    <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-gray-900">
                                                    {comment.author_website ? (
                                                        <a 
                                                            href={comment.author_website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            {comment.author_name}
                                                        </a>
                                                    ) : (
                                                        comment.author_name
                                                    )}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(comment.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">{comment.content}</p>
                                        
                                        {/* Replies */}
                                        {comment.replies.length > 0 && (
                                            <div className="ml-6 space-y-4">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <span className="font-semibold text-gray-900">
                                                                {reply.author_website ? (
                                                                    <a 
                                                                        href={reply.author_website}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        {reply.author_name}
                                                                    </a>
                                                                ) : (
                                                                    reply.author_name
                                                                )}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {formatDate(reply.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700">{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {post.approved_comments.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>No comments yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>🔗 Related Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedPosts.map((relatedPost) => (
                                        <div key={relatedPost.id} className="space-y-2">
                                            <Badge
                                                style={{ backgroundColor: relatedPost.category.color }}
                                                className="text-white text-xs"
                                            >
                                                {relatedPost.category.name}
                                            </Badge>
                                            <h4 className="font-semibold">
                                                <Link 
                                                    href={`/post/${relatedPost.slug}`}
                                                    className="text-blue-600 hover:text-blue-800 line-clamp-2"
                                                >
                                                    {relatedPost.title}
                                                </Link>
                                            </h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {relatedPost.excerpt}
                                            </p>
                                            <div className="text-xs text-gray-500">
                                                By {relatedPost.author.name} • {formatDate(relatedPost.published_at)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}