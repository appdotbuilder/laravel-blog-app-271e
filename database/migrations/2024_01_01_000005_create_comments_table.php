<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->string('author_name');
            $table->string('author_email');
            $table->string('author_website')->nullable();
            $table->enum('status', ['pending', 'approved', 'spam', 'rejected'])->default('pending');
            $table->ipAddress('author_ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('post_id');
            $table->index('status');
            $table->index(['post_id', 'status']);
            $table->index('parent_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};