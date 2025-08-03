<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Store a newly created comment.
     */
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'author_name' => 'required|string|max:255',
            'author_email' => 'required|email|max:255',
            'author_website' => 'nullable|url|max:255',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = new Comment($validated);
        $comment->post_id = $post->id;
        $comment->author_ip = $request->ip();
        $comment->user_agent = $request->userAgent();
        $comment->status = 'pending'; // Comments require approval
        $comment->save();

        return back()->with('success', 'Your comment has been submitted and is awaiting approval.');
    }
}