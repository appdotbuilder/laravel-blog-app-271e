<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display the blog homepage with posts listing.
     */
    public function index(Request $request)
    {
        $query = Post::query()
            ->with(['author', 'category', 'tags'])
            ->published()
            ->latest('published_at');

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by tag
        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->ofType($request->type);
        }

        // Search functionality
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $posts = $query->paginate(12)->withQueryString();

        $categories = Category::withCount('posts')->get();
        $tags = Tag::withCount('posts')->get();

        $stats = [
            'total_posts' => Post::published()->count(),
            'total_categories' => $categories->count(),
            'total_tags' => $tags->count(),
        ];

        return Inertia::render('welcome', [
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $tags,
            'stats' => $stats,
            'filters' => $request->only(['category', 'tag', 'type', 'search']),
        ]);
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post)
    {
        // Only show published posts to public
        if ($post->status !== 'published') {
            abort(404);
        }

        // Increment views
        $post->incrementViews();

        // Load relationships
        $post->load([
            'author',
            'category',
            'tags',
            'approvedComments' => function ($query) {
                $query->whereNull('parent_id')
                    ->with(['replies' => function ($q) {
                        $q->approved();
                    }])
                    ->latest();
            }
        ]);

        // Get related posts
        $relatedPosts = Post::published()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->with(['author', 'category'])
            ->limit(3)
            ->get();

        return Inertia::render('blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }


}