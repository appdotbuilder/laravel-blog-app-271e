<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Post>
     */
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(random_int(4, 8));
        
        // Generate content inline instead of using private method
        $paragraphs = [];
        $numParagraphs = random_int(3, 8);

        for ($i = 0; $i < $numParagraphs; $i++) {
            $paragraphs[] = '<p>' . $this->faker->paragraph(random_int(4, 10)) . '</p>';
            
            // Occasionally add a heading
            if ($i > 0 && random_int(1, 3) === 1) {
                $paragraphs[] = '<h2>' . $this->faker->sentence(3) . '</h2>';
            }
            
            // Occasionally add a list
            if (random_int(1, 4) === 1) {
                $listItems = [];
                for ($j = 0; $j < random_int(3, 5); $j++) {
                    $listItems[] = '<li>' . $this->faker->sentence() . '</li>';
                }
                $paragraphs[] = '<ul>' . implode('', $listItems) . '</ul>';
            }
        }
        
        $content = implode('', $paragraphs);

        return [
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title),
            'excerpt' => $this->faker->paragraph(2),
            'content' => $content,
            'featured_image' => null,
            'type' => $this->faker->randomElement(['article', 'news', 'event', 'lecture']),
            'status' => $this->faker->randomElement(['published', 'draft']),
            'published_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'meta_data' => null,
            'views_count' => $this->faker->numberBetween(0, 5000),
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
        ];
    }

    /**
     * Indicate that the post is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    /**
     * Indicate that the post is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }
}