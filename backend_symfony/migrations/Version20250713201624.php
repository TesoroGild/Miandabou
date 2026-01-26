<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250713201624 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE items (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, description TEXT NOT NULL, category VARCHAR(255) NOT NULL, price VARCHAR(10) NOT NULL, quantity INT NOT NULL, picture VARCHAR(200) DEFAULT NULL, contenthash VARCHAR(50) DEFAULT NULL, video VARCHAR(255) DEFAULT NULL, timecreated TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, timemodified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE orders (id SERIAL NOT NULL, client_id INT NOT NULL, total VARCHAR(10) NOT NULL, timecreated TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_E52FFDEE19EB6921 ON orders (client_id)');
        $this->addSql('CREATE TABLE orders_items (orders_id INT NOT NULL, items_id INT NOT NULL, PRIMARY KEY(orders_id, items_id))');
        $this->addSql('CREATE INDEX IDX_A0B446ECCFFE9AD6 ON orders_items (orders_id)');
        $this->addSql('CREATE INDEX IDX_A0B446EC6BB0AE84 ON orders_items (items_id)');
        $this->addSql('CREATE TABLE users (id SERIAL NOT NULL, username VARCHAR(100) NOT NULL, password VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, number VARCHAR(20) DEFAULT NULL, roles JSON NOT NULL, picture VARCHAR(200) DEFAULT NULL, contenthash VARCHAR(50) DEFAULT NULL, timecreated TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, timemodified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, lastlogin TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, date_of_birth DATE NOT NULL, is_active BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9F85E0677 ON users (username)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)');
        $this->addSql('ALTER TABLE orders ADD CONSTRAINT FK_E52FFDEE19EB6921 FOREIGN KEY (client_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE orders_items ADD CONSTRAINT FK_A0B446ECCFFE9AD6 FOREIGN KEY (orders_id) REFERENCES orders (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE orders_items ADD CONSTRAINT FK_A0B446EC6BB0AE84 FOREIGN KEY (items_id) REFERENCES items (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE orders DROP CONSTRAINT FK_E52FFDEE19EB6921');
        $this->addSql('ALTER TABLE orders_items DROP CONSTRAINT FK_A0B446ECCFFE9AD6');
        $this->addSql('ALTER TABLE orders_items DROP CONSTRAINT FK_A0B446EC6BB0AE84');
        $this->addSql('DROP TABLE items');
        $this->addSql('DROP TABLE orders');
        $this->addSql('DROP TABLE orders_items');
        $this->addSql('DROP TABLE users');
    }
}
