<?php

namespace App\Dto;

class AddressesDto
{
    public function __construct(
        public readonly string $city,
        public readonly string $province,
        public readonly string $zipcode,
        public readonly string $country,
        public readonly string $fulladdress,
        public readonly? string $appnumber
    ) {}
}