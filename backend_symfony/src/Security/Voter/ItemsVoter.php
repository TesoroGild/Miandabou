<?php

namespace App\Security\Voter;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class ItemsVoter extends Voter
{
    public const EDIT = 'POST_EDIT';
    public const DELETE = 'POST_DELETE';
    public const CREATE = 'POST_CREATE';

    public function __construct(private readonly Security $security)
    {
        
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::EDIT, self::DELETE, self::CREATE])
            && $subject instanceof \App\Entity\Items;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {
            return false;
        }

        if ($this->security->isGranted('ROLE_ADMIN')) return true;

        //Tous employe peut modifier et creer; seul l'admin peut delete;
        // Pour les review d'articles
        // switch ($attribute) {
        //     case self::EDIT:
        //         return $this->isOwner($subject, $user);
        //         break;

        //     case self::DELETE:
        //         return $this->isOwner($subject, $user);
        //         break;
        // }

        return false;
    }

    // Pour les review d'articles
    // private function isOwner (Review $review, $user) : bool
    // {
    //     return $user === $review->getUsers();
    // }
}
