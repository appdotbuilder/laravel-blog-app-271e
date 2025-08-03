<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // Create regular user
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);

        // Create categories
        $categories = Category::factory(8)->create();

        // Create tags
        $tags = Tag::factory(15)->create();

        // Create posts
        $posts = Post::factory(25)
            ->published()
            ->recycle([$admin, $user])
            ->recycle($categories)
            ->create();

        // Attach random tags to posts
        $posts->each(function ($post) use ($tags) {
            $post->tags()->attach(
                $tags->random(random_int(1, 4))->pluck('id')->toArray()
            );
        });

        // Create comments for posts
        $posts->each(function ($post) {
            Comment::factory(random_int(2, 8))
                ->approved()
                ->create(['post_id' => $post->id]);
                
            // Create some pending comments too
            Comment::factory(random_int(0, 3))
                ->pending()
                ->create(['post_id' => $post->id]);
        });

        // Create some draft posts
        Post::factory(5)
            ->draft()
            ->recycle([$admin, $user])
            ->recycle($categories)
            ->create();
    }
}
