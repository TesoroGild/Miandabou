<?php

namespace App\Security\Voter;

use App\Entity\Reviews;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class ReviewsVoter extends Voter
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
            && $subject instanceof \App\Entity\Reviews;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        if ($this->security->isGranted('ROLE_CLIENT')) return true;

        switch ($attribute) {
            case self::EDIT:
                return $this->isOwner($subject, $user);
                break;

            case self::DELETE:
                if ($this->security->isGranted('ROLE_ADMIN')) return true;
                return $this->isOwner($subject, $user);
                break;
        }

        return false;
    }

    private function isOwner (Reviews $review, $user) : bool
    {
        return $user === $review->getUsers();
    }
}
