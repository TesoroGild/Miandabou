<?php

namespace App\Controller;

use App\Repository\UsersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;
use Psr\Log\LoggerInterface;
use App\Entity\Users;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Service\UploadService;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Firebase\JWT\JWT;
use OpenApi\Attributes as OA;

final class UserController extends AbstractController
{
    #[Route('/api/users', name: 'create_user', methods: ['POST'])]
    #[OA\RequestBody(
        description: 'Informations du client pour créer le profil.',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'email', type: 'string'),
                new OA\Property(property: 'password', type: 'string'),
                new OA\Property(property: 'lastname', type: 'string'),
                new OA\Property(property: 'firstname', type: 'string'),
                new OA\Property(property: 'isActive', type: 'string'),
                new OA\Property(property: 'role', type: 'string'),
                new OA\Property(property: 'dateOfBirth', type: 'string'),
                new OA\Property(property: 'picture', type: 'string')
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Création du compte utilisateur réussie; Retourne les informations de l\'utilisateur et le token.',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'token', type: 'string'),
                new OA\Property(
                    property: 'user', 
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'id', type: 'string'),
                        new OA\Property(property: 'username', type: 'string'),
                        new OA\Property(property: 'firstname', type: 'string'),
                        new OA\Property(property: 'lastname', type: 'string'),
                        new OA\Property(property: 'email', type: 'string'),
                        new OA\Property(property: 'phonenumber', type: 'string'),
                        new OA\Property(
                            property: 'roles',
                            type: 'array',
                            items: new OA\Items(type: 'string')
                        ),
                        new OA\Property(property: 'picture', type: 'string'),
                        new OA\Property(property: 'contenthash', type: 'string')
                    ]
                ),
                new OA\Property(property: 'msg', type: 'string')
            ]
        )
    )]
    #[OA\Tag(name: 'User')]
    public function createUser(Request $request, EntityManagerInterface $entityManager, 
        LoggerInterface $logger, UploadService $uploadService,
        UserPasswordHasherInterface $passwordHasher, UsersRepository $usersRepository): JsonResponse
    {
        $user = new Users();
        $user->setUsername($request->request->get('username'));
        $user->setFirstname($request->request->get('firstname'));
        $user->setLastname($request->request->get('lastname'));
        $email = $request->request->get('email');
        $user->setEmail($email);
        $user->setPhonenumber($request->request->get('number'));
        $user->setRoles($request->request->all('roles'));
        $isActivate = $request->request->get('status');
        if ($isActivate == "true" || $isActivate) {
            $user->setIsActive(true);
        } else {
            $user->setIsActive(false);
        }
        $dateString = $request->request->get('dateOfBirth');
        $date = \DateTime::createFromFormat('Y-m-d', $dateString);
        $user->setDateOfBirth($date);
        $file = $request->files->get('picture');

        if ($file) {
            $uploadInfo = $uploadService->handleImageUpload($file);
            $user->setPicture($uploadInfo['filename']);
            $user->setContenthash($uploadInfo['hash']);
        } else {
            $user->setPicture(null);
            $user->setContenthash(null);
        }

        $user->setPassword(
            $passwordHasher->hashPassword(
                $user,
                $request->request->get('password')
            )
        );
        $timestamp = new \DateTime();
        $user->setTimecreated($timestamp);
        $user->setTimemodified($timestamp);

        try {
            //Ecriture en BDD
            $entityManager->persist($user);
            $entityManager->flush();
        } catch (\Exception $e) {
            $logger->error($e->getMessage());
            return $this->json([
                'user' => null,
                'msg' => 'Erreur serveur! Reessayé plus tard.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        $userAdded = $usersRepository->findUserDto($email);

        if ($userAdded)
        {
            $payload = [
                'user_id' => $userAdded->id,
                'email' => $userAdded->email,
                'roles' => $userAdded->roles,
                'exp' => time() + 7200
            ];
            $jwt = JWT::encode($payload, $this->getParameter('jwt_secret'), 'HS256');

            return $this->json([
                'user' => $userAdded,
                'token' => $jwt,
                'msg' => 'Utilisateur ajouté et connecté!'
            ], Response::HTTP_CREATED);
        } else {
            //404, 204 ou 202?
            return $this->json([
                'user' => null,
                'msg' => 'Utilisateur non ajouté!'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    #[Route('/api/users', name: 'list_users', methods: ['GET'])]
    #[OA\Response(
        response: 200, 
        description: 'Afficher les utilisateurs.',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'users',
                    type: 'array',
                    items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'id', type: 'string'),
                            new OA\Property(property: 'username', type: 'string'),
                            new OA\Property(property: 'firstname', type: 'string'),
                            new OA\Property(property: 'lastname', type: 'string'),
                            new OA\Property(property: 'email', type: 'string'),
                            new OA\Property(property: 'phonenumber', type: 'string'),
                            new OA\Property(
                                property: 'roles', 
                                type: 'array',
                                items: new OA\Items(type: 'string')
                            ),
                            new OA\Property(property: 'picture', type: 'string'),
                            new OA\Property(property: 'contenthash', type: 'string'),
                            new OA\Property(property: 'timecreated', type: 'datetime'),
                            new OA\Property(property: 'timemodified', type: 'datetime'),
                            new OA\Property(property: 'lastlogin', type: 'datetime'),
                            new OA\Property(property: 'dateOfBirth', type: 'datetime'),
                            new OA\Property(property: 'isActive', type: 'boolean'),
                            new OA\Property(property: 'bills', type: 'object'),
                            new OA\Property(property: 'address', type: 'object')
                        ]
                    )
                )
            ]
        )
    )]
    #[OA\Tag(name: 'User')]
    public function getUsers(UsersRepository $usersRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $users = $usersRepository->findAll();
            
            return $this->json([
                'users' => $users,
                'msg' => 'Liste des utilisateurs!'
            ], Response::HTTP_OK);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur getusers: ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
