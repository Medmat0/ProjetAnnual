# Social Code Network

Le projet Social Code Network est un réseau social où les utilisateurs peuvent proposer et partager de petits programmes destinés à transformer des fichiers d'entrée en fichiers de sortie. Ces programmes peuvent inclure des filtres, des traducteurs, et bien plus encore.

## Table des matières
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Licence](#licence)

## Fonctionnalités

- **Création et partage de programmes** : Chaque utilisateur peut créer et partager des programmes.
- **Éditeur en ligne** : Les programmes peuvent être édités directement en ligne.
- **Pipelines collaboratifs** : Les utilisateurs peuvent collaborer en combinant plusieurs programmes dans des pipelines éditables graphiquement.
- **Visualisation des fichiers intermédiaires** : Les fichiers générés intermédiaires peuvent être visualisés.
- **Compatibilité des programmes** : Le système vérifie la compatibilité des entrées et sorties des programmes dans un pipeline.

## Technologies

- **Backend** : Node.js, Express, Prisma, PostgreSQL
- **Frontend** : React
- **Déploiement** : Azure Web App pour le frontend et le backend, VM Azure pour les services Docker

## Architecture

Le projet est divisé en trois principales parties :

1. **Backend** : Gère la logique métier, les opérations CRUD, l'authentification et la gestion des utilisateurs, et l'orchestration des pipelines de programmes.
2. **Frontend** : Interface utilisateur développée avec React, permettant aux utilisateurs d'interagir avec la plateforme.
3. **Services Docker** : Exécution des programmes utilisateur de manière isolée en utilisant des conteneurs Docker.

## Installation

### Prérequis

- Node.js et npm
- Docker
- PostgreSQL

### Backend

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-repo/social-code-network.git
   cd social-code-network/backend
2. Installez les dépendances :
   ```bash
   npm install
4. Configurez la base de données PostgreSQL et Prisma:
   ```bash
   npx prisma migrate dev --name init
5. Démarrez le serveur :
   ```bash
   npm start

### Front


1. Allez dans le répertoire frontend :
    ```bash
   cd ../frontend

3. Installez les dépendances :
   ```bash
   npm install

5. Démarrez l'application React :
   ```bash
   npm start


### Licence

Free to use


