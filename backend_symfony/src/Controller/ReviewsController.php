<?php

namespace App\Controller;

use App\Entity\Reviews;
use App\Repository\ItemsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use OpenApi\Attributes as OA;

final class ReviewsController extends AbstractController
{
    #[Route('/api/reviews', name: 'app_reviews', methods:['POST'])]
    #[OA\RequestBody(
        description: 'Informations pour un avis client.',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'user_id', type: 'integer'),
                new OA\Property(property: 'item_id', type: 'integer'),
                new OA\Property(property: 'rating', type: 'integer'),
                new OA\Property(property: 'content', type: 'text')
            ]
        )
    )]
    #[OA\Response(
        response: 201, 
        description: 'Avis créé; Retourne un message de succès.',
        content: new OA\JsonContent(properties: [new OA\Property(property: 'msg', type: 'string')])
    )]
    #[OA\Tag(name: 'Reviews')]
    public function createReview(Request $request, EntityManagerInterface $entityManager, LoggerInterface $logger,
        ItemsRepository $itemsRepository): Response
    {
        try {
            // $existingReview = $reviewRepository->findOneBy([
            //     'user' => $user,
            //     'product' => $product // (que tu récupères dans ton JSON)
            // ]);

            // if ($existingReview) {
            //     throw new AccessDeniedException("Tu as déjà noté ce produit !");
            // }
            $this->denyAccessUnlessGranted('ROLE_CLIENT');
            $data = json_decode($request->getContent(), true);
            $review = new Reviews();
            $user = $this->getUser();
            $item = $itemsRepository->findItem($data['item_id']);
            
            if (!$user || !$item) {
                return $this->json(['msg' => 'Article ou utilsiateur non trouvé'], 404);
            }

            $review->setRating($data['rating']);
            $review->setContent($data['content']);
            $review->setUsers($user);
            $review->setItems($item);
            $review->setTimecreated(new \DateTime());
            $review->setUpdatedtime(new \DateTime());

            //Ecriture en BDD
            $entityManager->persist($review);
            $entityManager->flush();

            return $this->json([
                'msg' => 'Avis ajouté!'
            ], Response::HTTP_CREATED);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur : ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
