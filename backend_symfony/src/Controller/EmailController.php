<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class EmailController extends AbstractController
{
    #[Route('/api/email', name: 'add_email')]
    public function addEmail(): JsonResponse
    {
        return $this->json([
            'email' => '',
            'msg' => 'Email ajouté!'
        ]);
    }
}
