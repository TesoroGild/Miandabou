<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\UsersRepository;
use Symfony\Component\HttpFoundation\Request;
use Firebase\JWT\JWT;
use App\Dto\UsersDto;

final class AuthController extends AbstractController
{
    #[Route('/api/auth', name: 'app_auth', methods: ['POST'])]
    public function logIn(Request $request, LoggerInterface $logger,
            UserPasswordHasherInterface $passwordHasher, UsersRepository $usersRepository): JsonResponse
    {
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if (!$email || !$password) {
            return $this->json([
                'msg' => 'Email et mot de passe requis!'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $userToCheck = $usersRepository->findUser($email);
        
        if (!$userToCheck) 
        {
            return $this->json([
                'msg' => 'Email ou mot de passe incorrect!'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $passwordHash = $passwordHasher->isPasswordValid($userToCheck, $password);

        if ($passwordHash) 
        {
            $payload = [
                'user_id' => $userToCheck->getId(),
                'email' => $userToCheck->getEmail(),
                'roles' => $userToCheck->getRoles(),
                'exp' => time() + 7200
            ];
            $jwt = JWT::encode($payload, $this->getParameter('jwt_secret'), 'HS256');

            //TODO
            //update last login with a service
            //$userToConnect->setLastLogin(new \DateTime());

            $userToConnect = new UsersDto (
                $userToCheck->getId(),
                $userToCheck->getusername(),
                $userToCheck->getFirstname(),
                $userToCheck->getLastname(),
                $userToCheck->getEmail(),
                $userToCheck->getPhonenumber(),
                $userToCheck->getRoles(),
                $userToCheck->getPicture(),
                $userToCheck->getContenthash()
           );

            return $this->json([
                'user' => $userToConnect,
                'token' => $jwt,
                'msg' => 'Connection réussie!'
            ], Response::HTTP_OK);
        } else {
            return $this->json([
                'msg' => 'Email ou mot de passe incorrect!'
            ], Response::HTTP_UNAUTHORIZED);
        }
    }
}