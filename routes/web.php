<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CommentController as AdminCommentController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Public blog routes
Route::get('/', [BlogController::class, 'index'])->name('home');
Route::get('/post/{post}', [BlogController::class, 'show'])->name('blog.show');
Route::post('/post/{post}/comments', [CommentController::class, 'store'])->name('blog.comments.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Posts management
        Route::resource('posts', AdminPostController::class);
        
        // Categories management
        Route::resource('categories', AdminCategoryController::class);
        
        // Tags management
        Route::resource('tags', AdminTagController::class);
        
        // Comments management
        Route::resource('comments', AdminCommentController::class)->except(['create', 'store', 'edit']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
