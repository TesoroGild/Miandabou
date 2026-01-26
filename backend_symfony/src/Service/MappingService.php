<?php

namespace App\Service;  

use App\Entity\Orders;
use App\Dto\OrdersDto;
use App\Entity\Address;
use App\Dto\AddressesDto;

class MappingService
{
    public function mappingOrdersToDto(Orders $orders): OrdersDto
    {
        return new OrdersDto(
            $orders->getOrdercode(),
            $orders->getTotal(),
            $orders->getExpecteddateshipping(),
            $orders->getCommunicationchannel()
        );
    }

    public function mappingAddressToDto(Address $address): AddressesDto
    {
        return new AddressesDto(
            $address->getCity(),
            $address->getProvince(),
            $address->getZipcode(),
            $address->getCountry(),
            $address->getFulladdress(),
            $address->getAppnumber()
        );
    }
}