<?php

namespace App\Dto;

class ItemsDto
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $category,
        public readonly string $description,
        public readonly string $price,
        public readonly int $quantity,
        public readonly? string $video,
        public readonly? string $picture,
        public readonly? string $contenthash
    ) {}
}