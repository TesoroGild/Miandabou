<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

final class EmailController extends AbstractController
{
    #[Route('/api/email', name: 'add_email')]
    #[OA\Response(response: 200, description: 'Envoyer un mail.')]
    #[OA\Tag(name: 'Mail')]
    public function addEmail(): JsonResponse
    {
        return $this->json([
            'email' => '',
            'msg' => 'Email ajouté!'
        ]);
    }
}
