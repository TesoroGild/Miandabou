<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\CouponsRepository;
use Symfony\Component\HttpFoundation\Request;

final class CouponsController extends AbstractController
{
    #[Route('/api/coupons', name: 'list_coupons', methods: ['GET'])]
    public function getCoupons(CouponsRepository $couponsRepository): JsonResponse
    {
        $coupons = $couponsRepository->findAll();
        
        return $this->json([
            'coupons' => $coupons,
            'msg' => 'Liste des coupons!'
        ], Response::HTTP_OK);
    }

    #[Route('/api/coupons', name: 'create_coupon', methods: ['POST'])]
    public function createCoupon(Request $request): JsonResponse
    {
        return $this->json([
            'coupon' => null,
            'msg' => 'Coupon passé avec succès!'
        ], Response::HTTP_OK);
    }
}
