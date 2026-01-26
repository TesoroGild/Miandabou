<?php

namespace App\Entity;

use App\Repository\ItemsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

//Application
use App\Enums\ItemCategory;

#[ORM\Entity(repositoryClass: ItemsRepository::class)]
class Items
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(enumType: ItemCategory::class)]
    private ?ItemCategory $category = null;

    #[ORM\Column(length: 10)]
    private ?string $price = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\Column(length: 200, nullable: true)]
    private ?string $picture = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contenthash = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $video = null;

    #[ORM\Column]
    private ?\DateTime $timecreated = null;

    #[ORM\Column]
    private ?\DateTime $timemodified = null;

    /**
     * @var Collection<int, OrdersItems>
     */
    #[ORM\OneToMany(targetEntity: OrdersItems::class, mappedBy: 'items')]
    private Collection $ordersItems;

    public function __construct()
    {
        $this->ordersItems = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCategory(): ?ItemCategory
    {
        return $this->category;
    }

    public function setCategory(ItemCategory $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): static
    {
        $this->picture = $picture;

        return $this;
    }

    public function getContenthash(): ?string
    {
        return $this->contenthash;
    }

    public function setContenthash(?string $contenthash): static
    {
        $this->contenthash = $contenthash;

        return $this;
    }

    public function getVideo(): ?string
    {
        return $this->video;
    }

    public function setVideo(?string $video): static
    {
        $this->video = $video;

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

    public function getTimemodified(): ?\DateTime
    {
        return $this->timemodified;
    }

    public function setTimemodified(\DateTime $timemodified): static
    {
        $this->timemodified = $timemodified;

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
            $ordersItem->setItems($this);
        }

        return $this;
    }

    public function removeOrdersItem(OrdersItems $ordersItem): static
    {
        if ($this->ordersItems->removeElement($ordersItem)) {
            // set the owning side to null (unless already changed)
            if ($ordersItem->getItems() === $this) {
                $ordersItem->setItems(null);
            }
        }

        return $this;
    }
}
