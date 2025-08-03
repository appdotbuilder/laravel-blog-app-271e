<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Media>
 */
class MediaFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Media>
     */
    protected $model = Media::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fileName = $this->faker->uuid() . '.jpg';
        
        return [
            'name' => $this->faker->words(3, true) . '.jpg',
            'file_name' => $fileName,
            'mime_type' => 'image/jpeg',
            'path' => 'uploads/' . $fileName,
            'disk' => 'public',
            'size' => $this->faker->numberBetween(50000, 2000000),
            'metadata' => [
                'width' => $this->faker->numberBetween(800, 1920),
                'height' => $this->faker->numberBetween(600, 1080),
            ],
            'user_id' => User::factory(),
        ];
    }
}