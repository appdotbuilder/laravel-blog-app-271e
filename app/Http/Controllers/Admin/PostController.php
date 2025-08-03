<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index(Request $request)
    {
        $query = Post::query()
            ->with(['author', 'category', 'tags'])
            ->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Search functionality
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $posts = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'filters' => $request->only(['status', 'type', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        $categories = Category::all();
        $tags = Tag::all();

        return Inertia::render('admin/posts/create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request)
    {
        $post = new Post($request->validated());
        $post->user_id = auth()->id();
        
        if ($post->status === 'published' && !$post->published_at) {
            $post->published_at = now();
        }
        
        $post->save();

        // Attach tags
        if ($request->has('tag_ids')) {
            $post->tags()->sync($request->tag_ids);
        }

        return redirect()->route('admin.posts.show', $post)
            ->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post)
    {
        $post->load(['author', 'category', 'tags', 'comments' => function ($query) {
            $query->with('author')->latest();
        }]);

        return Inertia::render('admin/posts/show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        $post->load(['category', 'tags']);
        $categories = Category::all();
        $tags = Tag::all();

        return Inertia::render('admin/posts/edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified post.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $data = $request->validated();
        
        // Set published_at if status is changed to published
        if ($data['status'] === 'published' && $post->status !== 'published') {
            $data['published_at'] = now();
        }
        
        $post->update($data);

        // Sync tags
        if ($request->has('tag_ids')) {
            $post->tags()->sync($request->tag_ids);
        }

        return redirect()->route('admin.posts.show', $post)
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post deleted successfully.');
    }
}