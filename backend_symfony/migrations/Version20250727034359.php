<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250727034359 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE address (id SERIAL NOT NULL, city VARCHAR(255) NOT NULL, state VARCHAR(255) NOT NULL, zipcode VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, fulladdress VARCHAR(255) NOT NULL, appnumber VARCHAR(5) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE orders ADD ordercode VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE orders ADD expecteddateshipping DATE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP TABLE address');
        $this->addSql('ALTER TABLE orders DROP ordercode');
        $this->addSql('ALTER TABLE orders DROP expecteddateshipping');
    }
}
