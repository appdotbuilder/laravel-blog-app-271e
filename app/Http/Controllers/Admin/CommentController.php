<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Display a listing of the comments.
     */
    public function index(Request $request)
    {
        $query = Comment::query()
            ->with(['post'])
            ->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('content', 'like', "%{$request->search}%")
                  ->orWhere('author_name', 'like', "%{$request->search}%")
                  ->orWhere('author_email', 'like', "%{$request->search}%");
            });
        }

        $comments = $query->paginate(15)->withQueryString();

        $stats = [
            'pending' => Comment::pending()->count(),
            'approved' => Comment::approved()->count(),
            'spam' => Comment::where('status', 'spam')->count(),
        ];

        return Inertia::render('admin/comments/index', [
            'comments' => $comments,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Display the specified comment.
     */
    public function show(Comment $comment)
    {
        $comment->load(['post', 'parent', 'replies']);

        return Inertia::render('admin/comments/show', [
            'comment' => $comment,
        ]);
    }

    /**
     * Update the comment status.
     */
    public function update(Request $request, Comment $comment)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,spam,rejected',
        ]);

        $comment->update(['status' => $request->status]);

        return back()->with('success', 'Comment status updated successfully.');
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Comment $comment)
    {
        $comment->delete();

        return redirect()->route('admin.comments.index')
            ->with('success', 'Comment deleted successfully.');
    }


}