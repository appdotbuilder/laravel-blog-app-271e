<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    /**
     * Display a listing of the tags.
     */
    public function index(Request $request)
    {
        $query = Tag::query()
            ->withCount('posts')
            ->latest();

        // Search functionality
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $tags = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/tags/index', [
            'tags' => $tags,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new tag.
     */
    public function create()
    {
        return Inertia::render('admin/tags/create');
    }

    /**
     * Store a newly created tag.
     */
    public function store(StoreTagRequest $request)
    {
        $tag = Tag::create($request->validated());

        return redirect()->route('admin.tags.show', $tag)
            ->with('success', 'Tag created successfully.');
    }

    /**
     * Display the specified tag.
     */
    public function show(Tag $tag)
    {
        $tag->load(['posts' => function ($query) {
            $query->with('author')->latest()->limit(10);
        }]);

        return Inertia::render('admin/tags/show', [
            'tag' => $tag,
        ]);
    }

    /**
     * Show the form for editing the specified tag.
     */
    public function edit(Tag $tag)
    {
        return Inertia::render('admin/tags/edit', [
            'tag' => $tag,
        ]);
    }

    /**
     * Update the specified tag.
     */
    public function update(UpdateTagRequest $request, Tag $tag)
    {
        $tag->update($request->validated());

        return redirect()->route('admin.tags.show', $tag)
            ->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified tag.
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag deleted successfully.');
    }
}