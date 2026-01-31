<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

final class EmailController extends AbstractController
{
    #[Route('/api/email', name: 'add_email')]
    // #[OA\RequestBody(
    //     description: 'L\'email à ajouter',
    //     required: true,
    //     content: new OA\JsonContent(
    //         properties: [
    //             new OA\Property(
    //                 property: 'mailToAlert', 
    //                 type: 'string'
    //             )
    //         ]
    //     )
    // )]
    // #[OA\Response(
    //     response: 200, 
    //     description: 'Ajouter un mail à la newsletter.')]
    // #[OA\Tag(name: 'Mail')]
    public function addEmail(): JsonResponse
    {
        return $this->json([
            'email' => '',
            'msg' => 'Email ajouté!'
        ]);
    }
}
