<?php

namespace App\Dto;

use DateTime;

class OrdersDto
{
    public function __construct(
        public readonly string $ordercode,
        public readonly string $total,
        public readonly DateTime $expecteddateshipping,
        public readonly string $communicationchannel
    ) {}
}