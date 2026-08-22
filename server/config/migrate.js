const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const DB_NAME = process.env.DB_NAME || 'xenograft';

const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    username      VARCHAR(50)  UNIQUE NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('user','admin') DEFAULT 'user',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login    TIMESTAMP NULL
  ) CHARACTER SET utf8mb4`,

  // Une run = une sauvegarde/partie en cours dans un des 5 slots du compte.
  // "state" reste volontairement un blob JSON libre tant que les systèmes de jeu
  // (Phase 2 : corps/familles/portail/carte) ne sont pas figés — évite de
  // multiplier les migrations de schéma à chaque itération de design.
  `CREATE TABLE IF NOT EXISTS runs (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT NOT NULL,
    slot        TINYINT NOT NULL,
    name        VARCHAR(50) DEFAULT 'Sans nom',
    status      ENUM('active','victory','dead') DEFAULT 'active',
    world       VARCHAR(50) DEFAULT 'foret',
    state       JSON,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_user_slot (user_id, slot)
  ) CHARACTER SET utf8mb4`,

  // Bestiaire / méta-progression : pièces et mutations débloquées au pool,
  // séparé de l'état d'une run précise (persiste même si la run meurt).
  `CREATE TABLE IF NOT EXISTS bestiary_unlocks (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT NOT NULL,
    item_type   ENUM('body_part','mutation') NOT NULL,
    item_id     VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_user_item (user_id, item_type, item_id)
  ) CHARACTER SET utf8mb4`,
];

const MAX_RUN_SLOTS = 5;

async function migrate() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    charset:  'utf8mb4',
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4`);
  await conn.query(`USE \`${DB_NAME}\``);

  for (const sql of TABLES) {
    await conn.query(sql);
  }

  console.log('✅ Migration DB xenograft terminée');
  await conn.end();
}

module.exports = { migrate, MAX_RUN_SLOTS };
