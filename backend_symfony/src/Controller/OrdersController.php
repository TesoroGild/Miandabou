<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;

final class OrdersController extends AbstractController
{
    #[Route('/api/orders', name: 'create_orders', methods: ['POST'])]
    public function createOrder(): JsonResponse
    {
        return $this->json([
            'msg' => 'Oder post route active!'
        ], Response::HTTP_OK);
        
    }
}
