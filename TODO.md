# XENOGRAFT — Plan / TODO

Roguelike solo où le joueur greffe des parties de créatures sur un monstre unique qui s'assemble visuellement au fil de la run. Collection façon gacha via un portail interdimensionnel. Combat automatique. Structure de run façon Slay the Spire (carte à embranchements).

> Design complet (mécaniques, portail, familles, mutations, etc.) tenu à jour dans la mémoire Claude du projet — ce fichier ne suit que l'avancement.

## 🎨 Phase 0 — Finitions du menu (en cours)
- [ ] Valider le rendu final du portail (4 raretés testées)
- [ ] Récupérer `flag_fr.png`/`flag_en.png` depuis l'autre PC, intégrer en base64 (bloqué, en attente accès autre PC)
- [x] Renommer le fichier physique du menu → `xenograft-main-menu.html`
- [ ] Générer les SFX prévus (prompts déjà écrits : hover/clic, feu, fanfare mute)
- [ ] Finaliser le sélecteur de langue

## 🏗️ Phase 1 — Architecture technique du site
- [x] Créer un vrai dépôt Git pour XENOGRAFT
- [x] Poser la structure serveur (Node/Express/MySQL, patterns arcade-zone : `server/`, auth JWT, migration auto)
- [x] Auth obligatoire (connexion) — routes `/api/auth/register|login|me`, pas de mode invité (contrairement à arcade-zone)
- [x] Système de runs multiples par compte (5 slots) — routes `/api/runs`, table `runs` (slot 1-5 unique par user), table `bestiary_unlocks` pour la méta-progression
- [x] Décider l'hébergement → VPS existant (alpastudio.fr), nouveau sous-domaine à créer (`xenograft.alpastudio.fr` ?)
- [x] Scaffolder le client (Vue 3 + Vite + Pinia + Vue Router, mêmes fondations qu'arcade-zone) — login/register/liste des runs fonctionnels, reste à intégrer le prototype de menu (`xenograft-main-menu.html`) et le jeu lui-même
- [ ] Installer les dépendances et tester serveur + client (bloqué : Node/npm absents de ce PC, à faire sur le VPS ou un autre PC avec Node)
- [ ] Premier déploiement sur le VPS (nouveau sous-domaine, PM2, Nginx, certificat HTTPS)

## ⚙️ Phase 2 — Systèmes cœur de jeu
- [ ] Corps : 6 emplacements, stats, raretés
- [ ] Familles thématiques + bonus de synergie
- [ ] Portail d'invocation fonctionnel (niveaux, odds, pool, draft de départ)
- [ ] Mutations : standards + spécifiques par famille
- [ ] Carte de run à embranchements + les 6 types de nœuds
- [ ] Combat automatique
- [ ] Bestiaire / méta-progression (déblocage de pool)

## 🌲 Phase 3 — Contenu V1 (monde Forêt, scope resserré)
- [ ] Designer les pièces de corps du monde 1
- [ ] 2 mini-boss + 1 boss pour le prototype initial (valider que la boucle est fun)
- [ ] Étendre vers 6 mini-boss + 3 boss une fois validé
