<?php

namespace App\Repository;

use App\Entity\Items;
use App\Dto\ItemsDto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Items>
 */
class ItemsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Items::class);
    }

    public function findAll(): array
    {
        $items = $this->findBy([]);
        return array_map(function ($item) {
            return new ItemsDto(
                $item->getId(),
                $item->getName(),
                $item->getCategory()?->value,
                $item->getDescription(),
                $item->getPrice(),
                $item->getQuantity(),
                $item->getVideo(),
                $item->getPicture(),
                $item->getContenthash()
            );
        }, $items);
    }

//    /**
//     * @return Items[] Returns an array of Items objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('i.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

   public function findItem($id): ?Items
   {
       return $this->createQueryBuilder('i')
           ->andWhere('i.id = :id')
           ->setParameter('id', $id)
           ->getQuery()
           ->getOneOrNullResult()
       ;
   }
}
