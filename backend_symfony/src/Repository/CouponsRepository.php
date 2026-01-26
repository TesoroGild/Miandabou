<?php

namespace App\Repository;

use App\Entity\Coupons;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Coupons>
 */
class CouponsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Coupons::class);
    }

    public function findAll(): array
    {
        $coupons = $this->findBy([]);
        return array_map(function ($coupons) {
            return [
                'id' => $coupons->getId(),
                'name' => $coupons->getName(),
                'value' => $coupons->getValue(),
                'rate' => $coupons->getRate(),
                'expirationDate' => $coupons->getExpirationDate()
            ];
        }, $coupons);
    }

    //    /**
    //     * @return Coupons[] Returns an array of Coupons objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Coupons
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
