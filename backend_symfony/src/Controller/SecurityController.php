<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\JsonResponse;

class SecurityController extends AbstractController
{
    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function login(AuthenticationUtils $authenticationUtils): null
    {
        // if ($this->getUser()) {
        //     return $this->redirectToRoute('target_path');
        // }

        // get the login error if there is one
        // $error = $authenticationUtils->getLastAuthenticationError();
        // // last username entered by the user
        // $lastUsername = $authenticationUtils->getLastUsername();

        // return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
        return null;
    }

    #[Route('/api/logout', name: 'app_logout', methods: ['POST'])]
    public function logout(): null
    {
        // return $this->json([
        //     'user' => null,
        //     'msg' => 'Utilisateur déconnecté!'
        // ], Response::HTTP_OK);
        //throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
        return null;
    }
}
