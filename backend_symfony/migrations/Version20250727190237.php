<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250727190237 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE orders_address (orders_id INT NOT NULL, address_id INT NOT NULL, PRIMARY KEY(orders_id, address_id))');
        $this->addSql('CREATE INDEX IDX_FC3B1DFACFFE9AD6 ON orders_address (orders_id)');
        $this->addSql('CREATE INDEX IDX_FC3B1DFAF5B7AF75 ON orders_address (address_id)');
        $this->addSql('CREATE TABLE users_address (users_id INT NOT NULL, address_id INT NOT NULL, PRIMARY KEY(users_id, address_id))');
        $this->addSql('CREATE INDEX IDX_FD4E1B4B67B3B43D ON users_address (users_id)');
        $this->addSql('CREATE INDEX IDX_FD4E1B4BF5B7AF75 ON users_address (address_id)');
        $this->addSql('ALTER TABLE orders_address ADD CONSTRAINT FK_FC3B1DFACFFE9AD6 FOREIGN KEY (orders_id) REFERENCES orders (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE orders_address ADD CONSTRAINT FK_FC3B1DFAF5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE users_address ADD CONSTRAINT FK_FD4E1B4B67B3B43D FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE users_address ADD CONSTRAINT FK_FD4E1B4BF5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE orders_address DROP CONSTRAINT FK_FC3B1DFACFFE9AD6');
        $this->addSql('ALTER TABLE orders_address DROP CONSTRAINT FK_FC3B1DFAF5B7AF75');
        $this->addSql('ALTER TABLE users_address DROP CONSTRAINT FK_FD4E1B4B67B3B43D');
        $this->addSql('ALTER TABLE users_address DROP CONSTRAINT FK_FD4E1B4BF5B7AF75');
        $this->addSql('DROP TABLE orders_address');
        $this->addSql('DROP TABLE users_address');
    }
}
