<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260219043103 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE coupons_items (coupons_id INT NOT NULL, items_id INT NOT NULL, PRIMARY KEY(coupons_id, items_id))');
        $this->addSql('CREATE INDEX IDX_DE68EA7A6D72B15C ON coupons_items (coupons_id)');
        $this->addSql('CREATE INDEX IDX_DE68EA7A6BB0AE84 ON coupons_items (items_id)');
        $this->addSql('ALTER TABLE coupons_items ADD CONSTRAINT FK_DE68EA7A6D72B15C FOREIGN KEY (coupons_id) REFERENCES coupons (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE coupons_items ADD CONSTRAINT FK_DE68EA7A6BB0AE84 FOREIGN KEY (items_id) REFERENCES items (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE coupons ADD code VARCHAR(25) DEFAULT NULL');
        $this->addSql('ALTER TABLE items ADD is_active BOOLEAN DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE coupons_items DROP CONSTRAINT FK_DE68EA7A6D72B15C');
        $this->addSql('ALTER TABLE coupons_items DROP CONSTRAINT FK_DE68EA7A6BB0AE84');
        $this->addSql('DROP TABLE coupons_items');
        $this->addSql('ALTER TABLE items DROP is_active');
        $this->addSql('ALTER TABLE coupons DROP code');
    }
}
