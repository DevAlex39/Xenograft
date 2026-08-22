# XENOGRAFT

Roguelike solo où le joueur greffe des parties de créatures (têtes, torses, bras, jambes, dos, queues) sur un monstre unique qui s'assemble visuellement au fil de la run. Collection façon gacha via un portail interdimensionnel. Combat automatique. Structure de run à embranchements façon Slay the Spire.

Voir [TODO.md](./TODO.md) pour l'avancement du projet.

## Structure du dépôt

- `Prompt/` — prompts de génération d'animation 3D du portail d'invocation, un par rareté (Commun/Rare/Épique/Légendaire)
- `xenograft-main-menu.html` — prototype du menu principal
- `Portails-standalone.html` — prototype d'animation du portail (4 raretés)
- `server/` — backend Node/Express/MySQL (auth JWT, runs multi-slots). Voir `.env.example` à la racine pour la config.
- `client/` — frontend Vue 3 + Vite + Pinia (auth, liste des runs). Le menu principal stylisé (`xenograft-main-menu.html`) n'est pas encore intégré ici — c'est un prototype à part pour l'instant.

## Démarrage local

```bash
cp .env.example .env   # puis renseigner DB_PASSWORD et JWT_SECRET

cd server && npm install && npm run dev    # API sur :3002
cd client && npm install && npm run dev    # front sur :5174, proxy /api vers :3002
```

Nécessite une instance MySQL locale (ou pointer `.env` vers le VPS). La migration (création DB + tables) se fait automatiquement au démarrage du serveur.
