<?php

namespace App\Repository;

use App\Dto\ReviewsDto;
use App\Entity\Reviews;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Reviews>
 */
class ReviewsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reviews::class);
    }

    public function findItemReviews($id): array
    {
        return $this->createQueryBuilder('r')
            ->select('new App\Dto\ReviewsDto(r.id, u.username, i.name, r.rating, r.content, r.updatedtime)')
            ->join('r.users', 'u')
            ->join('r.items', 'i')
            ->andWhere('r.items = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

    public function findUserReviews($user): array
    {
        return $this->createQueryBuilder('r')
            ->select('new App\Dto\ReviewsDto(r.id, u.username, i.name, r.rating, r.content, r.updatedtime)')
            ->join('r.users', 'u')
            ->join('r.items', 'i')
            ->andWhere('r.users = :userObj')
            ->setParameter('userObj', $user)
            ->getQuery()
            ->getResult();
    }
}
