<?php

namespace App\Entity;

use App\Repository\OrdersItemsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrdersItemsRepository::class)]
class OrdersItems
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'ordersItems')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Orders $orders = null;

    #[ORM\ManyToOne(inversedBy: 'ordersItems')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Items $items = null;

    #[ORM\Column]
    private ?int $quantityBuy = null;

    #[ORM\Column(length: 20)]
    private ?string $itemPrice = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrders(): ?Orders
    {
        return $this->orders;
    }

    public function setOrders(?Orders $orders): static
    {
        $this->orders = $orders;

        return $this;
    }

    public function getItems(): ?Items
    {
        return $this->items;
    }

    public function setItems(?Items $items): static
    {
        $this->items = $items;

        return $this;
    }

    public function getQuantityBuy(): ?int
    {
        return $this->quantityBuy;
    }

    public function setQuantityBuy(int $quantityBuy): static
    {
        $this->quantityBuy = $quantityBuy;

        return $this;
    }

    public function getItemPrice(): ?string
    {
        return $this->itemPrice;
    }

    public function setItemPrice(string $itemPrice): static
    {
        $this->itemPrice = $itemPrice;

        return $this;
    }
}
