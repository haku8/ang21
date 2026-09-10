# 📦 Angular 21 + GraphQL + MariaDB App

Vollständige CRUD-Anwendung mit:
- **Frontend**: Angular 21 + Angular Material (Standalone API)
- **Backend**: Node.js + Express + Apollo GraphQL
- **Datenbank**: MariaDB

---

## 🗂 Projektstruktur

```
app/
├── backend/         # Node.js + Apollo GraphQL Server
│   ├── src/
│   │   ├── index.js      # Server-Einstiegspunkt
│   │   ├── db.js         # MariaDB-Verbindung + Tabellen-Init
│   │   ├── schema.js     # GraphQL Type Definitions
│   │   └── resolvers.js  # GraphQL Resolver (CRUD)
│   ├── .env.example
│   └── package.json
│
└── frontend/        # Angular 21 App
    ├── src/app/
    │   ├── components/
    │   │   ├── item-list/        # Hauptansicht (Tabelle + Filter)
    │   │   ├── item-form/        # Formular-Dialog (Erstellen/Bearbeiten)
    │   │   └── confirm-dialog/   # Lösch-Bestätigung
    │   ├── graphql/
    │   │   └── item.graphql.ts   # GQL Queries & Mutations
    │   ├── models/
    │   │   └── item.model.ts     # TypeScript Interface
    │   ├── services/
    │   │   └── item.service.ts   # Apollo-Service (CRUD)
    │   ├── app.config.ts         # Apollo Provider Setup
    │   └── app.routes.ts
    └── package.json
```

---

## ⚡ Schnellstart

### 1. Voraussetzungen

- Node.js 20+
- MariaDB (läuft lokal oder auf Server)
- Angular CLI 21: `npm install -g @angular/cli@21`

---

### 2. Backend starten

```bash
cd backend

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env anpassen: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

# Entwicklungsserver starten
npm run dev
```

➡ GraphQL Endpoint: **http://localhost:4000/graphql**  
➡ Apollo Sandbox verfügbar unter derselben URL im Browser

Die Tabelle `items` wird **automatisch** angelegt beim ersten Start.

---

### 3. Frontend starten

```bash
cd frontend

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm start
```

➡ Angular App: **http://localhost:4200**

---

## 🗄 Datenbankschema

```sql
CREATE TABLE items (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  text1     TEXT,
  text2     TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔌 GraphQL API

### Queries

```graphql
# Alle Einträge abrufen
query {
  items {
    id name text1 text2 createdAt updatedAt
  }
}

# Einzelnen Eintrag abrufen
query {
  item(id: "1") {
    id name text1 text2
  }
}
```

### Mutations

```graphql
# Erstellen
mutation {
  createItem(name: "Test", text1: "Inhalt 1", text2: "Inhalt 2") {
    id name createdAt
  }
}

# Aktualisieren
mutation {
  updateItem(id: "1", name: "Geändert", text1: "Neu") {
    id name updatedAt
  }
}

# Löschen
mutation {
  deleteItem(id: "1")
}
```

---

### Backend API URL ändern (frontend)

In `src/app/app.config.ts`:

```typescript
link: httpLink.create({ uri: 'http://IHR-SERVER:4000/graphql' }),
```
