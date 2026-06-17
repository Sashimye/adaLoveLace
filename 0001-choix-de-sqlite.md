# ADR-0001 — Choisir SQLite comme base de données

- **Statut :** Accepté
- **Date :** 2026-06-17
- **Décideur(s) :** Équipe AdaLoveLace
- **Concerne :** Stockage des données de l'application (utilisateurs, projets, tâches)

> **C'est quoi un ADR ?**
> Un *Architecture Decision Record* est une note courte qui fige une décision technique importante : **ce qu'on a choisi, pourquoi, et ce que ça implique.** On l'écrit au moment de la décision, pas après. Six mois plus tard, quand tu te demanderas « mais pourquoi j'ai pris SQLite déjà ? », ce fichier te répondra. C'est aussi ce qui montre à un recruteur ou à un coéquipier que tu réfléchis avant de coder.

---

## Contexte

AdaLoveLace est une application de gestion de projet (projets, tâches, membres) construite avec React au frontend et Express au backend. 

Les contraintes au moment de la décision sont les suivantes :

- Les données sont clairement **relationnelles** : un utilisateur possède des projets, un projet contient des tâches, une tâche est assignée à un utilisateur. Il y a des liens entre les tables.
- Le volume attendu est **faible** : une seule personne ou une petite équipe, pas de trafic massif ni d'écritures simultanées intensives.
- L'environnement de développement doit rester **simple à installer et à relancer** sur n'importe quelle machine.

Il faut donc choisir un système de stockage qui permette d'apprendre le SQL « pour de vrai » sans ajouter une lourde couche d'installation et de configuration.

---

## Décision

**Nous utilisons SQLite** comme base de données, via les paquets `sqlite` et `sqlite3` déjà présents dans le projet. La base est un simple fichier (par exemple `backend/db/adalovelace.db`) lu et écrit directement par le serveur Express.

---

## Alternatives considérées

### PostgreSQL
Base de données relationnelle robuste, standard de l'industrie, excellente gestion des écritures simultanées.
**Écartée pour l'instant :** nécessite d'installer et de faire tourner un serveur séparé, de gérer un utilisateur, un mot de passe et une connexion réseau. C'est beaucoup de configuration et de friction pour un projet d'apprentissage à faible volume. La bonne nouvelle : le SQL appris sur SQLite se transpose presque tel quel vers PostgreSQL le jour où on migrera.

### MySQL / MariaDB
Très proche de PostgreSQL en termes d'avantages et de contraintes.
**Écartée pour les mêmes raisons :** serveur séparé à installer et administrer, surdimensionné pour le besoin actuel.

### MongoDB (base NoSQL, orientée documents)
Stockage souple sous forme de documents JSON.
**Écartée :** nos données sont fortement relationnelles (liens entre utilisateurs, projets et tâches). Une base SQL exprime ces relations naturellement, là où MongoDB obligerait à dupliquer ou à recoller les données à la main. De plus, apprendre le SQL est un objectif pédagogique en soi, bien plus transférable pour un débutant.

### Un simple fichier JSON maison
Stocker les données dans un fichier `.json` lu et réécrit par le serveur.
**Écartée :** aucune requête possible (il faudrait tout charger en mémoire et filtrer à la main), aucune garantie d'intégrité, gros risques de corruption dès qu'il y a deux écritures en même temps. Ça ne tient pas la route et n'apprend rien de réutilisable.

---

## Conséquences

### Positives
- **Zéro serveur à installer.** La base est un fichier ; il suffit de lancer le serveur Express et tout fonctionne. Idéal pour se concentrer sur le code.
- **On apprend du vrai SQL.** Les requêtes `SELECT`, `INSERT`, `JOIN`, les clés étrangères, les contraintes `UNIQUE` : tout ce qui est appris ici reste valable sur PostgreSQL ou MySQL.
- **Portable et facile à sauvegarder.** Toute la base tient dans un seul fichier qu'on peut copier, sauvegarder ou déplacer.
- **Rapide en lecture** pour les volumes d'un projet personnel.

### Négatives (à connaître)
- **Une seule écriture à la fois.** SQLite verrouille la base pendant une écriture. Pour un usage perso c'est invisible, mais ça ne conviendrait pas à une application avec beaucoup d'utilisateurs écrivant simultanément.
- **Pas adapté au passage à l'échelle multi-serveurs.** Si l'app était un jour déployée sur plusieurs serveurs en parallèle, le modèle « un fichier partagé » ne tiendrait pas.
- **Typage souple.** SQLite est plus permissif sur les types de colonnes que PostgreSQL ; il faut donc rester rigoureux soi-même sur les données qu'on insère.

### Neutres / à surveiller
- Le fichier `.db` ne doit **pas** être versionné dans Git (à ajouter au `.gitignore`), car il contient des données et change à chaque utilisation.

---

## Quand reconsidérer cette décision

Il faudra rouvrir ce choix (et probablement migrer vers PostgreSQL) si l'un de ces signaux apparaît :

- l'application doit gérer **de nombreux utilisateurs écrivant en même temps** ;
- on souhaite **déployer en production** sur une infrastructure sérieuse, avec plusieurs instances du serveur ;
- on a besoin de fonctionnalités avancées absentes de SQLite (types riches, recherche plein-texte poussée, accès concurrent intensif).

Comme le SQL utilisé reste standard, cette migration future sera progressive et non un redémarrage de zéro.

---

*ADR rédigé dans le cadre du projet d'apprentissage AdaLoveLace. Prochaines décisions à documenter : ADR-0002 (choix de JWT pour l'authentification), ADR-0003 (React Router pour la navigation).*
