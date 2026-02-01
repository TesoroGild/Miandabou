<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

final class EmailController extends AbstractController
{
    #[Route('/api/email', name: 'add_email', methods: ['POST'])]
    #[OA\RequestBody(
        description: 'L\'adresse mail à ajouter à la newsletter.',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'mailToAlert', 
                    type: 'string'
                )
            ]
        )
    )]
    #[OA\Response(
        response: 201, 
        description: 'Email ajouté; Retourne un message de succès.',
        content: new OA\JsonContent(properties: [new OA\Property(property: 'msg', type: 'string')])
    )]
    #[OA\Tag(name: 'Mail')]
    public function addEmail(): JsonResponse
    {
        return $this->json([
            'email' => '',
            'msg' => 'Email ajouté!'
        ]);
    }
}
