<?php

namespace App\Dto;

class ItemsOrderedDto
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $price,
        public readonly int $quantity,
        public readonly? string $picture,
        public readonly? string $contenthash
    ) {}
}