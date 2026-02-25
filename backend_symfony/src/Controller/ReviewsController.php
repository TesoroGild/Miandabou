<?php

namespace App\Controller;

use App\Entity\Reviews;
use App\Repository\ItemsRepository;
use App\Repository\ReviewsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Reviews')]
final class ReviewsController extends AbstractController
{
    //Create
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

    //Read
    #[Route('/api/reviews/{id}', name: 'app_item_reviews', methods:['GET'])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"), description: "ID article")]
    #[OA\Response(
        response: 200, 
        description: 'Récupérer les avis d\'un article.',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'reviews',
                    type: 'object',
                        properties: [
                            new OA\Property(property: 'user', type: 'string'),
                            new OA\Property(property: 'item', type: 'string'),
                            new OA\Property(property: 'tating', type: 'integer'),
                            new OA\Property(property: 'content', type: 'string'),
                            new OA\Property(property: 'updatedtime', type: 'string')
                        ]
                ),
                new OA\Property(property: 'msg', type: 'string'),
            ]
        )
    )]
    public function getItemReviews(int $id, ReviewsRepository $reviewsRepository, LoggerInterface $logger) 
    {
        try {
            $logger->info("LAAAA");
            $reviews = $reviewsRepository->findItemReviews($id);
$logger->info("LBBBB");
            if (!$reviews) {
                return $this->json(['msg' => 'Aucun avis sur cet article.'], 404);
            }

            return $this->json([
                'reviews' => $reviews,
                'msg' => 'Avis d\'un article.'
            ], Response::HTTP_OK);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur getitemreviews: ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/api/reviews', name: 'app_user_reviews', methods:['GET'])]
    public function getUserReviews(ReviewsRepository $reviewsRepository, LoggerInterface $logger) 
    {

    }

    //Update

    //Delete
}
