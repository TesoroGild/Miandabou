<?php

namespace App\Entity;

use App\Repository\CouponsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: CouponsRepository::class)]

class Coupons
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $value = null;

    #[ORM\Column(nullable: true)]
    private ?int $rate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $expirationDate = null;

    #[ORM\Column]
    private ?\DateTime $timecreated = null;

    #[ORM\Column(length: 25)]
    private ?string $code = null;

    /**
     * @var Collection<int, items>
     */
    #[ORM\ManyToMany(targetEntity: Items::class, inversedBy: 'coupons')]
    private Collection $items;

    public function __construct()
    {
        $this->items = new ArrayCollection();
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

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): static
    {
        $this->value = $value;

        return $this;
    }

    public function getRate(): ?int
    {
        return $this->rate;
    }

    public function setRate(?int $rate): static
    {
        $this->rate = $rate;

        return $this;
    }

    public function getExpirationDate(): ?\DateTime
    {
        return $this->expirationDate;
    }

    public function setExpirationDate(\DateTime $expirationDate): static
    {
        $this->expirationDate = $expirationDate;

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

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    /**
     * @return Collection<int, items>
     */
    public function getItems(): Collection
    {
        return $this->items;
    }

    public function addItem(items $item): static
    {
        if (!$this->items->contains($item)) {
            $this->items->add($item);
        }

        return $this;
    }

    public function removeItem(items $item): static
    {
        $this->items->removeElement($item);

        return $this;
    }
}
