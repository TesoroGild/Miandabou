<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Orders;
use App\Entity\Items;
use App\Entity\Address;
use App\Repository\AddressRepository;
use App\Repository\OrdersRepository;
use App\Repository\UsersRepository;
use App\Repository\ItemsRepository;
use App\Entity\OrdersItems;
use App\Dto\OrdersDto;
use App\Dto\OrdersItemsDto;
use App\Dto\ItemsDto;
use App\Dto\AddressesDto;
use App\Service\MappingService;
use App\Dto\ItemsOrderedDto;

final class CheckoutController extends AbstractController
{
    #[Route('/api/checkout', name: 'app_checkout', methods: ['POST'])]
    public function setuporder(Request $request, LoggerInterface $logger,
        EntityManagerInterface $entityManager, UsersRepository $usersRepository,
        AddressRepository $addressRepository, OrdersRepository $ordersRepository,
        ItemsRepository $itemsRepository, MappingService $mappingService): JsonResponse
    {
        //TODO
        //change name of method
        $cmp = 0;
        $cmpFor = 0;
        
        try {
            //TEST ZONE
            $jsonData = json_decode($request->getContent(), true);

            // ADDRESS
            $address = new Address();
            $fulladdress = $jsonData['address']['fulladdress'];
            $city = $jsonData['address']['city'];
            $zipcode = $jsonData['address']['zipcode'];
            $province = $jsonData['address']['province'];
            $country = $jsonData['address']['country'];
            $appnumber = $jsonData['address']['appnumber'];

            $newAddress = $addressRepository->findAddress($fulladdress, $city, $zipcode, $province, $country, $appnumber);

            if ($newAddress == null) {
                $address->setFulladdress($fulladdress);
                $address->setCity($city);
                $address->setZipcode($zipcode);
                $address->setProvince($province);
                $address->setCountry($country);
                $address->setAppnumber($appnumber);
                
                $entityManager->persist($address);
                $entityManager->flush();
                $existingAddress = $addressRepository->findAddress($fulladdress, $city, $zipcode, $province, $country, $appnumber);
            } else $existingAddress = $newAddress;

            if ($existingAddress != null) {
                // ORDER
                $order = new Orders();
                $userEmail = $jsonData['order']['userEmail'];
                $order->setClient($usersRepository->findUser($userEmail));
                $cmp += 1;
                $total = $jsonData['order']['total'];
                $order->setTotal($total);
                $cmp += 1;
                $timestamp = new \DateTime();
                $order->setTimecreated($timestamp);
                $cmp += 1;
                $expectedDateShipping = \DateTime::createFromFormat('Y-m-d', date('Y-m-d'));
                $expectedDateShipping->modify('+1 week');
                $timestring = $timestamp->format('Y-m-d');
                //todo
                $orderCode = $userEmail . $total . $timestring;
                $order->setOrdercode($orderCode);$cmp += 1;
                $order->setExpecteddateshipping($expectedDateShipping);$cmp += 1;
                $meansofcommunication = $jsonData['additionalInfos']['meansofcommunication'];
                
                if ($meansofcommunication == "emailcommunication") $order->setCommunicationchannel($userEmail);
                else if ($meansofcommunication == "phonecommunication") $order->setCommunicationchannel($jsonData['additionalInfos']['phonenumber']);
                else $order->setCommunicationchannel('Aucune communication');

                $order->addAddress($existingAddress);$cmp += 1;
                
                $entityManager->persist($order);
                $entityManager->flush();$cmp += 1;
                $orderRes = $ordersRepository->findOrder($orderCode);$cmp += 1;

                if ($orderRes != null) {
                    $itemsOrdered = $jsonData['items'];
                    $itemsToSave = [];
                    $ordersItems = new OrdersItems();
                    $itemsDto = [];

                    foreach ($itemsOrdered as $item) {
                        $itm = $itemsRepository->findItem(intval($item['itemId']));
                        $cmpFor += 1;

                        if ($itm != null) {
                            $ordersItems->setItems($itm);
                            $ordersItems->setOrders($orderRes);
                            $ordersItems->setQuantityBuy($item['quantityBuy']);
                            $ordersItems->setItemPrice($item['itemPrice']);

                            $itemsToSave[] = $ordersItems;
                            $itemsDto[] = new ItemsOrderedDto(
                                $itm->getId(),
                                $itm->getName(),
                                $item['itemPrice'],
                                $item['quantityBuy'],
                                $itm->getPicture(),
                                $itm->getContenthash()
                            );
                        } else {
                            return $this->json([
                                'msg' => 'Erreur lors de la création de la commande. Veuillez recommencer dans quelques instants.'
                            ], Response::HTTP_INTERNAL_SERVER_ERROR);
                        }
                    }

                    $entityManager->persist($ordersItems);
                    $entityManager->flush();

                    $ordersDto = $mappingService->mappingOrdersToDto($orderRes);
                    $addressDto = $mappingService->mappingAddressToDto($existingAddress);

                    return $this->json([
                        'order' => $ordersDto,
                        'items' => $itemsDto,
                        'address' => $addressDto,
                        'msg' => 'Commande passée avec succès!'
                    ], Response::HTTP_OK);
                } else {
                    return $this->json([
                        'msg' => 'Erreur lors de la création de la commande. Veuillez recommencer dans quelques instants.'
                    ], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            } else {
                return $this->json([
                    'msg' => 'Erreur lors de la création de la commande. Veuillez recommencer dans quelques instants.'
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } catch (\Throwable $t) {
            $logger->error('Erreur : ' . $t->getMessage() . ' Debug compteur ' . $cmp . ' ' . $cmpFor);
            return $this->json(
                ['msg' => "Erreur inattendue."],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
