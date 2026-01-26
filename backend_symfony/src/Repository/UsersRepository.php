<?php

namespace App\Repository;

use App\Entity\Users;
use App\Dto\UsersDto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Users>
 */
class UsersRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Users::class);
    }

    public function findAll(): array
    {
        $pwd = "";
        $users = $this->findBy([]);
        return array_map(function ($user) {
            return new UsersDto(
                $user->getId(),
                $user->getusername(),
                $user->getFirstname(),
                $user->getLastname(),
                $user->getEmail(),
                $user->getPhonenumber(),
                $user->getRoles(),
                $user->getPicture(),
                $user->getContenthash()
            );
        }, $users);
    }

//    /**
//     * @return Users[] Returns an array of Users objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

   public function findUserDto($email): UsersDto | null
   {
       $user = $this->createQueryBuilder('u')
           ->andWhere('u.email = :email')
           ->setParameter('email', $email)
           ->getQuery()
           ->getOneOrNullResult()
       ;

       if ($user) {
           return new UsersDto(
                $user->getId(),
                $user->getusername(),
                $user->getFirstname(),
                $user->getLastname(),
                $user->getEmail(),
                $user->getPhonenumber(),
                $user->getRoles(),
                $user->getPicture(),
                $user->getContenthash()
           );
       }
       return null;
   }

   public function findUser($email): Users | null
   {
       return $this->createQueryBuilder('u')
           ->andWhere('u.email = :email')
           ->setParameter('email', $email)
           ->getQuery()
           ->getOneOrNullResult()
       ;
   }
}
