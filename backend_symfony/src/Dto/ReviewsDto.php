<?php

namespace App\Dto;

use DateTime;

class ReviewsDto
{
    public function __construct(
        public readonly int $id,
        public string $user,
        //public readonly int $userId,
        public string $item,
        public readonly int $itemId,
        public readonly int $rating,
        public readonly string $content,
        public readonly DateTime $updatedtime
    ) {}
}