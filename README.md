# MiandabouAccessoires
## Présentation
Site de e-commerce permettant l'authentification, l'ajout et le retrait d'article dans un panier, la vérification des articles et la réception d'une confirmation des achats.

La stack technologique utilisée est :
* Angular 20.1.0
* NodeJs
* ExpressJs
* Docker
* Symfony
* Composer

## Prérequis
Pour rouler le programme localement, vous aurez besoin des ressources suivantes : 
* [Angular] (https://angular.dev/update-guide)
* [Node] (https://nodejs.org/en/download)
* Npm : `npm install -g npm`
* [Php] (https://www.php.net/downloads.php)
* [Composer] (https://getcomposer.org/download/)
* [Symfony] (https://symfony.com/download)
* [Docker postgressql] (https://youtu.be/Hs9Fh1fr5s8?si=XVC_kOeVtB-s379w)

## Lancement du programme
Cloner le projet 
```bash
git clone https://github.com/TesoroGild/Miandabou.git
```

### Backend
**Etape 1** : Télecharger les dépendances.
```bash
cd backend_symfony
composer install
```

**Etape 2** : Lancer le serveur.
```bash
symfony server:start
```

### Frontend
**Etape 3** : Télecharger les dépendances.
```bash
cd frontend_angular
npm install
```

**Etape 4** : Variables d'environements
Créer /environments/dev.environment.ts au même niveau que /src/app. votre fichier doit ressembler à ceci
```typescript
export const environment = {
  production: false,
  backendUrl: [url]
};
```

**Etape 5** : Lancer le serveur.
```bash
ng serve
```

## Principaux uses cases
### Connection à un compte
### Parcourir les produits
### Voir les détails d'un produit
### Ajouter/Retirer du panier
### Modifier le panier
### Passer une commande
### Recevoir une notification