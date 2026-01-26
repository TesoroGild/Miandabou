<?php

namespace App\Repository;

use App\Entity\Address;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @extends ServiceEntityRepository<Address>
 */
class AddressRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Address::class);
    }

    //    /**
    //     * @return Address[] Returns an array of Address objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Address
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function findAddress(string $fulladdress, string $city, string $zipcode, string $province, string $country, string $appnumber):? Address
    {
        return $this->createQueryBuilder('a')
            ->where('LOWER(a.fulladdress) = LOWER(:fulladdress)')
            ->andWhere('LOWER(a.city) = LOWER(:city)')
            ->andWhere('a.zipcode = :zipcode')
            ->andWhere('a.province = :province')
            ->andWhere('LOWER(a.country) = LOWER(:country)')
            ->andWhere('LOWER(a.appnumber) = LOWER(:appnumber)')
            ->setParameter('fulladdress', $fulladdress)
            ->setParameter('city', $city)
            ->setParameter('zipcode', $zipcode)
            ->setParameter('province', $province)
            ->setParameter('country', $country)
            ->setParameter('appnumber', $appnumber)
            ->getQuery()
            ->getOneOrNullResult();
    }
}