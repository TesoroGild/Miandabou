<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250728050932 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE orders_items DROP CONSTRAINT FK_A0B446EC6BB0AE84');
        $this->addSql('ALTER TABLE orders_items DROP CONSTRAINT FK_A0B446ECCFFE9AD6');
        $this->addSql('ALTER TABLE orders_items DROP CONSTRAINT orders_items_pkey');
        $this->addSql('ALTER TABLE orders_items ADD id SERIAL NOT NULL');
        $this->addSql('ALTER TABLE orders_items ADD quantity_buy INT NOT NULL');
        $this->addSql('ALTER TABLE orders_items ADD item_price VARCHAR(20) NOT NULL');
        $this->addSql('ALTER TABLE orders_items ADD CONSTRAINT FK_A0B446EC6BB0AE84 FOREIGN KEY (items_id) REFERENCES items (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE orders_items ADD CONSTRAINT FK_A0B446ECCFFE9AD6 FOREIGN KEY (orders_id) REFERENCES orders (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE orders_items ADD PRIMARY KEY (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE orders_items DROP CONSTRAINT fk_a0b446eccffe9ad6');
        $this->addSql('ALTER TABLE orders_items DROP CONSTRAINT fk_a0b446ec6bb0ae84');
        $this->addSql('DROP INDEX orders_items_pkey');
        $this->addSql('ALTER TABLE orders_items DROP id');
        $this->addSql('ALTER TABLE orders_items DROP quantity_buy');
        $this->addSql('ALTER TABLE orders_items DROP item_price');
        $this->addSql('ALTER TABLE orders_items ADD CONSTRAINT fk_a0b446eccffe9ad6 FOREIGN KEY (orders_id) REFERENCES orders (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE orders_items ADD CONSTRAINT fk_a0b446ec6bb0ae84 FOREIGN KEY (items_id) REFERENCES items (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE orders_items ADD PRIMARY KEY (orders_id, items_id)');
    }
}
