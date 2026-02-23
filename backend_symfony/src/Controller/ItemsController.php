<?php

namespace App\Controller;

//Packages
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Attributes as OA;

//Application
use App\Entity\Items;
use App\Enums\ItemCategory;
use App\Repository\ItemsRepository;
use App\Service\UploadService;

final class ItemsController extends AbstractController
{
    //CREATE
    #[Route('/api/items', name: 'create_items', methods: ['POST'])]
    #[OA\RequestBody(
        description: 'Informations pour créer l\'article.',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string'),
                new OA\Property(property: 'description', type: 'string'),
                new OA\Property(
                    property: 'category', 
                    type: 'string',
                    enum: ['dress', 'pant', 'necklaces', 'shoes', 'hat', 'bag', 'earrings', 'watch']
                ),
                new OA\Property(property: 'price', type: 'string'),
                new OA\Property(property: 'quantity', type: 'string'),
                new OA\Property(property: 'picture', type: 'string')
            ]
        )
    )]
    #[OA\Response(
        response: 201, 
        description: 'Article créé; Retourne un message de succès.',
        content: new OA\JsonContent(properties: [new OA\Property(property: 'msg', type: 'string')])
    )]
    #[OA\Tag(name: 'Items')]
    public function createItem(Request $request, EntityManagerInterface $entityManager, 
        LoggerInterface $logger, UploadService $uploadService): JsonResponse
    {
        try {
            $item = new Items();
            $this->denyAccessUnlessGranted('POST_CREATE', $item);
            $category = ItemCategory::from($request->request->get('category'));
            $item->setName($request->request->get('name'));
            $item->setCategory($category);
            $item->setDescription($request->request->get('description'));
            $item->setPrice($request->request->get('price'));
            $item->setQuantity($request->request->get('qte'));
            $item->setVideo($request->request->get('video'));
            $file = $request->files->get('picture');

            if ($file) {
                $uploadInfo = $uploadService->handleImageUpload($file);
                $item->setPicture($uploadInfo['filename']);
                $item->setContenthash($uploadInfo['hash']);
            } else {
                $item->setPicture(null);
                $item->setContenthash(null);
            }

            $item->setTimecreated(new \DateTime());
            $item->setTimemodified(new \DateTime());

            //Ecriture en BDD
            $entityManager->persist($item);
            $entityManager->flush();

            return $this->json([
                'msg' => 'Article ajouté!'
            ], Response::HTTP_CREATED);
            
            // $itemCreated = new ItemCreatedDto(
            //     $item->getName(),
            //     $item->getCategory()?->value,
            //     $item->getDescription(),
            //     $item->getPrice(),
            //     $item->getQuantity(),
            //     $item->getVideo(),
            //     $item->getPicture(),
            //     $item->getContenthash()
            // );

            // return $this->json([
            //     'msg' => 'Article ajouté!', 
            //     'item' => $itemCreated
            // ], Response::HTTP_CREATED);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur : ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    //READ
    #[Route('/api/items', name: 'list_items', methods: ['GET'])]
    #[OA\Response(
        response: 200, 
        description: 'Récupérer les articles.',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'items',
                    type: 'array',
                    items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'id', type: 'string'),
                            new OA\Property(property: 'name', type: 'string'),
                            new OA\Property(property: 'description', type: 'string'),
                            new OA\Property(
                                property: 'category', 
                                type: 'string',
                                enum: ['dress', 'pant', 'necklaces', 'shoes', 'hat', 'bag', 'earrings', 'watch']
                            ),
                            new OA\Property(property: 'price', type: 'string'),
                            new OA\Property(property: 'quantity', type: 'string'),
                            new OA\Property(property: 'picture', type: 'string'),
                            new OA\Property(property: 'contenthash', type: 'string'),
                            new OA\Property(property: 'video', type: 'string'),
                            new OA\Property(property: 'timecreated', type: 'datetime'),
                            new OA\Property(property: 'timemodified', type: 'datetime'),
                            new OA\Property(property: 'ordersItems', type: 'object')
                        ]
                    )
                ),
                new OA\Property(property: 'msg', type: 'string'),
            ]
        )
    )]
    #[OA\Tag(name: 'Items')]
    public function getItems(ItemsRepository $itemsRepository, LoggerInterface $logger, Request $request): JsonResponse
    {
        try {
            $isActive= $request->query->getBoolean('active', false);

            if ($isActive) {
                $items = $itemsRepository->findActiveItems();
            } else { 
                $items = $itemsRepository->findItems();
            }
            return $this->json([
                'items' => $items,
                'msg' => 'Liste des articles!'
            ], Response::HTTP_OK);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur getitems: ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/api/items/{id}', name: 'item_details', methods: ['GET'])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"), description: "ID article")]
    #[OA\Response(
        response: 200, 
        description: 'Récupérer un article.',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'item',
                    type: 'object',
                        properties: [
                            new OA\Property(property: 'id', type: 'string'),
                            new OA\Property(property: 'name', type: 'string'),
                            new OA\Property(property: 'description', type: 'string'),
                            new OA\Property(
                                property: 'category', 
                                type: 'string',
                                enum: ['dress', 'pant', 'necklaces', 'shoes', 'hat', 'bag', 'earrings', 'watch']
                            ),
                            new OA\Property(property: 'price', type: 'string'),
                            new OA\Property(property: 'quantity', type: 'string'),
                            new OA\Property(property: 'picture', type: 'string'),
                            new OA\Property(property: 'contenthash', type: 'string'),
                            new OA\Property(property: 'video', type: 'string'),
                            new OA\Property(property: 'timecreated', type: 'datetime'),
                            new OA\Property(property: 'timemodified', type: 'datetime'),
                            new OA\Property(property: 'ordersItems', type: 'object')
                        ]
                ),
                new OA\Property(property: 'msg', type: 'string'),
            ]
        )
    )]
    #[OA\Tag(name: 'Items')]
    public function getItem(int $id, ItemsRepository $itemsRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $itemDetails = $itemsRepository->findItem($id);

            if (!$itemDetails) {
                return $this->json(['msg' => 'Article introuvable'], 404);
            }

            return $this->json([
                'items' => $itemDetails,
                'msg' => 'Détails!'
            ], Response::HTTP_OK);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur getitem: ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    //UPDATE
    #[Route('/api/items/{id}/edit', name: 'item_update', methods: ['POST'])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"), description: "ID article")]
    #[OA\RequestBody(
        description: 'Informations de l\'article à modifier.',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string'),
                new OA\Property(property: 'description', type: 'string'),
                new OA\Property(
                    property: 'category', 
                    type: 'string',
                    enum: ['dress', 'pant', 'necklaces', 'shoes', 'hat', 'bag', 'earrings', 'watch']
                ),
                new OA\Property(property: 'price', type: 'string'),
                new OA\Property(property: 'picture', type: 'string')
            ]
        )
    )]
    #[OA\Response(
        response: 200, 
        description: 'Article modifié; Retourne un message de succès.',
        content: new OA\JsonContent(properties: [new OA\Property(property: 'msg', type: 'string')])
    )]
    #[OA\Tag(name: 'Items')]
    public function updateItem(int $id, ItemsRepository $itemsRepository, LoggerInterface $logger, 
        EntityManagerInterface $entityManager, Request $request, UploadService $uploadService): JsonResponse
    {
        try {
            $item = $itemsRepository->findItem($id);

            if (!$item) {
                return $this->json(['msg' => 'Article introuvable'], 404);
            }

            $this->denyAccessUnlessGranted('POST_EDIT', $item);

            if ($request->request->get('category')) {
                $category = ItemCategory::from($request->request->get('category'));
                $item->setCategory($category);
            }
            if ($request->request->get('name'))
                $item->setName($request->request->get('name'));
            if ($request->request->get('description'))
                $item->setDescription($request->request->get('description'));
            if ($request->request->get('price'))
                $item->setPrice($request->request->get('price'));
            if ($request->request->get('video'))
                $item->setVideo($request->request->get('video'));
            $file = $request->files->get('picture');

            if ($file) {
                $uploadInfo = $uploadService->handleImageUpload($file);
                $item->setPicture($uploadInfo['filename']);
                $item->setContenthash($uploadInfo['hash']);
            }

            $item->setTimemodified(new \DateTime());
            $entityManager->flush();

            return $this->json([
                'msg' => 'Article modifié avec succès.'
            ], Response::HTTP_OK);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur updateitem: ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/api/items/{id}/qty', name: 'item_update_quantity', methods: ['PATCH'])]
    #[OA\Tag(name: 'Items')]
    public function updateQuantity(int $id, ItemsRepository $itemsRepository, LoggerInterface $logger, 
        EntityManagerInterface $entityManager, Request $request, UploadService $uploadService): JsonResponse
    {
        try {
            return $this->json([
                'msg' => 'Quantité modifiée avec succès.'
            ], Response::HTTP_OK);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur updatequantity: ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    //DELETE
    #[Route('/api/items/{id}/delete', name: 'item_deletion', methods: ['PATCH'])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"), description: "ID article")]
    #[OA\Response(
        response: 201, 
        description: 'Article suppprimé; Retourne un message de succès.',
        content: new OA\JsonContent(properties: [new OA\Property(property: 'msg', type: 'string')])
    )]
    #[OA\Tag(name: 'Items')]
    public function deleteItem(int $id, ItemsRepository $itemsRepository, LoggerInterface $logger, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $itemToDelete = $itemsRepository->findItem($id);

            if (!$itemToDelete) {
                return $this->json(['msg' => 'Article introuvable'], 404);
            }

            $this->denyAccessUnlessGranted('POST_DELETE', $itemToDelete);
            $itemToDelete->setIsActive(false);
            $itemToDelete->setTimemodified(new \DateTime());
            $entityManager->flush();

            return $this->json([
                'msg' => 'Article supprimé avec succès.'
            ], Response::HTTP_OK);
        } catch (\Throwable $t) {//\Exception $e
            $logger->error('Erreur getitems: ' . $t->getMessage());
            return $this->json(
                ['msg' => $t->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
