<?php

namespace App\Controller;

use App\Entity\Coupons;
use App\Repository\CouponsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;
use OpenApi\Attributes as OA;

final class CouponsController extends AbstractController
{
    #[Route('/api/coupons', name: 'app_coupons', methods:['GET'])]
    #[OA\Tag(name: 'Coupons')]
    public function getCoupons(CouponsRepository $couponsRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $coupons = $couponsRepository->findAll();
            
            return $this->json([
                'coupons' => $coupons,
                'msg' => 'Liste des coupons!'
            ], Response::HTTP_OK);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur getcoupons: ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/api/coupons/{id}/items', name: 'app_coupons', methods:['GET'])]
    #[OA\Tag(name: 'Coupons')]
    public function getItemsCoupons(Coupons $coupons, LoggerInterface $logger): JsonResponse
    {
        try {
            $items = $coupons->getItems();
            
            return $this->json([
                'items' => $items,
                'msg' => 'Liste des articles!'
            ], Response::HTTP_OK, [], ['groups' => 'item:read']);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur getcoupons: ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
