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

//Application
use App\Entity\Items;
use App\Enums\ItemCategory;
use App\Repository\ItemsRepository;
use App\Service\UploadService;

final class ItemsController extends AbstractController
{
    //CREATE
    #[Route('/api/items', name: 'create_items', methods: ['POST'])]
    public function createItem(Request $request, EntityManagerInterface $entityManager, 
        LoggerInterface $logger, UploadService $uploadService): JsonResponse
    {
        //try {
            $item = new Items();
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
        // } catch (\Throwable $t) {//\Exception $e
        //     $logger->error('Erreur : ' . $t->getMessage());
        //     return $this->json(
        //         ['msg' => $t->getMessage()],
        //         Response::HTTP_INTERNAL_SERVER_ERROR
        //     );
        // }
    }

    //READ

    #[Route('/api/items', name: 'list_items', methods: ['GET'])]
    public function getItems(ItemsRepository $itemsRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $items = $itemsRepository->findAll();
            
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

    //UPDATE

    //DELETE
}
