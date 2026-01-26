<?php

namespace App\Entity;

use App\Repository\OrdersRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrdersRepository::class)]
class Orders
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 10)]
    private ?string $total = null;

    #[ORM\Column]
    private ?\DateTime $timecreated = null;

    #[ORM\ManyToOne(inversedBy: 'items')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Users $client = null;

    #[ORM\Column(length: 255)]
    private ?string $ordercode = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $expecteddateshipping = null;

    /**
     * @var Collection<int, Address>
     */
    #[ORM\ManyToMany(targetEntity: Address::class, inversedBy: 'orders')]
    private Collection $address;

    #[ORM\Column(length: 255)]
    private ?string $communicationchannel = null;

    /**
     * @var Collection<int, OrdersItems>
     */
    #[ORM\OneToMany(targetEntity: OrdersItems::class, mappedBy: 'orders')]
    private Collection $ordersItems;

    public function __construct()
    {
        $this->address = new ArrayCollection();
        $this->ordersItems = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTotal(): ?string
    {
        return $this->total;
    }

    public function setTotal(string $total): static
    {
        $this->total = $total;

        return $this;
    }

    public function getTimecreated(): ?\DateTime
    {
        return $this->timecreated;
    }

    public function setTimecreated(\DateTime $timecreated): static
    {
        $this->timecreated = $timecreated;

        return $this;
    }

    public function getClient(): ?Users
    {
        return $this->client;
    }

    public function setClient(?Users $client): static
    {
        $this->client = $client;

        return $this;
    }

    public function getOrdercode(): ?string
    {
        return $this->ordercode;
    }

    public function setOrdercode(string $ordercode): static
    {
        $this->ordercode = $ordercode;

        return $this;
    }

    public function getExpecteddateshipping(): ?\DateTime
    {
        return $this->expecteddateshipping;
    }

    public function setExpecteddateshipping(?\DateTime $expecteddateshipping): static
    {
        $this->expecteddateshipping = $expecteddateshipping;

        return $this;
    }

    /**
     * @return Collection<int, Address>
     */
    public function getAddress(): Collection
    {
        return $this->address;
    }

    public function addAddress(Address $address): static
    {
        if (!$this->address->contains($address)) {
            $this->address->add($address);
        }

        return $this;
    }

    public function removeAddress(Address $address): static
    {
        $this->address->removeElement($address);

        return $this;
    }

    public function getCommunicationchannel(): ?string
    {
        return $this->communicationchannel;
    }

    public function setCommunicationchannel(string $communicationchannel): static
    {
        $this->communicationchannel = $communicationchannel;

        return $this;
    }

    /**
     * @return Collection<int, OrdersItems>
     */
    public function getOrdersItems(): Collection
    {
        return $this->ordersItems;
    }

    public function addOrdersItem(OrdersItems $ordersItem): static
    {
        if (!$this->ordersItems->contains($ordersItem)) {
            $this->ordersItems->add($ordersItem);
            $ordersItem->setOrders($this);
        }

        return $this;
    }

    public function removeOrdersItem(OrdersItems $ordersItem): static
    {
        if ($this->ordersItems->removeElement($ordersItem)) {
            // set the owning side to null (unless already changed)
            if ($ordersItem->getOrders() === $this) {
                $ordersItem->setOrders(null);
            }
        }

        return $this;
    }
}
