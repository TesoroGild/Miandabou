# MiandabouAccessoires
Application de e-commerce.

Projet généré avec [Angular CLI](https://github.com/angular/angular-cli) version 20.1.0.


## Installation et mises à jour
Angular : https://angular.dev/update-guide
Docker : https://docs.docker.com/desktop/setup/install/windows-install/
Node : https://nodejs.org/en/download.
Npm : 
```bash
npm install -g npm
```


## Lancement du programme
Cloner le projet avec 
```bash
git clone [lien_du_repo]
```

Entrer dans le repertoire Miandabou
```bash
cd Miandabou
```

Télécharger les dépendances
```bash
npm install
```

## Lancer le serveur
Exécuter `ng serve`. L'application est accessible à cette adresse `http://localhost:4200/`. L'application se relance automatiquement lorsqu'un changement dans le code est effectué.

## Variables d'environements
Créer /environments/dev.environment.ts au même niveau que /app.
votre fichier doit ressembler à ceci
```typescript
export const environment = {
  production: false,
  backendUrl: 'http://localhost:8000'
};
```

# TODO
* CRUD items, user, coupons, address
* Register design sous forme de carte d'identité
* Coupons
    * Ne pas permettre de tous les mettre.
    * Ne pas afficher ceux expirés
    * Changer la logique (certains coupons seulement pour certains items)
* Auth
    * Guard
    * Session
    * Security
    * Double validation
    * Token expiration
* Internalisation
* Email
* Stepper pour l'achat
* Navbar pour la page actuelle.