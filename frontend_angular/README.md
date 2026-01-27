# MiandabouAccessoires
Application de e-commerce.

# Architecture

# Build
Les artefacts de compilation seront stockés dans le répertoire dist/. Pour compiler le projet
```bash
ng build
```

# Tests
```bash
ng test
```

# Troubbleshouting
## Déploiement Vercel
* Deux versions de i18n étaient utilisées lançant l'erreur : An unhandled exception occurred: Requested locale 'fr' is not defined for the projet.
* Les fichiers d'environements étaient mal ocnfigurés donnant l'erreur : Could not resolve "../../../environments/filename".
* Le budget alloué au build de l'application a été atteidn en raison des nombreux warnings donnant l'erreur : bundle initial exceeded maximum budget. Budget 1.00 MB was not met by 323.62 kB with a total of 1.32 MB.

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
* Email
* Stepper pour l'achat
* Navbar pour la page actuelle.