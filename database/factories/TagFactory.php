<?php

namespace Database\Factories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Tag>
     */
    protected $model = Tag::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->randomElement([
            'Laravel', 'PHP', 'JavaScript', 'React', 'Vue', 'Web Development',
            'Mobile Apps', 'AI', 'Machine Learning', 'DevOps', 'Cloud',
            'Database', 'API', 'Frontend', 'Backend', 'Tips', 'Tutorial',
            'News', 'Review', 'Guide', 'Best Practices'
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'color' => $this->faker->hexColor(),
        ];
    }
}