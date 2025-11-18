# Webcare Pickup & Delivery App

Een volledige Shopify-app voor het beheren van **pickup locaties**, **delivery regels**, **tijdslots** en **cart/checkout integratie**.  
Gebouwd als embedded app met React Router en Polaris Web Components.

---

## 🚀 Functionaliteit

Deze app maakt het mogelijk om:

- Pickup-locaties te beheren (CRUD)
- Bezorgregio’s aan te maken met postcodevalidatie (later)
- Openingstijden + sluitingsdagen in te stellen (later)
- Cutoff-tijden te bepalen
- Time slots te genereren per locatie
- Pickup/Delivery-widgets in de cart en checkout te integreren
- Data op te slaan in Prisma-database
- Orders te taggen met pickup/delivery details

---

## 🧱 Stack

| Component | Technologie |
|----------|-------------|
| Framework | React Router (embedded) |
| UI | Shopify Polaris Web Components |
| Database | Prisma ORM (SQLite in dev / PostgreSQL in productie) |
| API | Shopify Admin GraphQL API |
| App Type | Shopify Embedded App |
| Auth | Shopify OAuth (shopify-app-api) |
| Dev CLI | Shopify CLI |

---

## 📦 Belangrijkste modellen (Prisma)

### **Location**
Wordt gebruikt om afhaallocaties op te slaan.

| Field       | Type     |
|-------------|----------|
| id          | Int (PK) |
| shopDomain  | String   |
| name        | String   |
| address     | String   |
| active      | Boolean  |
| createdAt   | DateTime |
| updatedAt   | DateTime |

Later komen hier o.a. bij:
- openingHoursJson
- cutoffTime
- closedDatesJson
- capacity rules

Het volledige schema staat in:  
`prisma/schema.prisma`

---

## 📌 Huidige status (development)

- ✔️ App draait lokaal via Shopify CLI  
- ✔️ Prisma geconfigureerd  
- ✔️ Session opslag werkt  
- ✔️ Database model: `Location`  
- ✔️ Gedeelde Prisma client (`db.server.js`)  
- ✔️ Locations pagina zichtbaar in Shopify  
- ✔️ Locaties opslaan in Prisma  
- ⏳ Locatie bewerken/verwijderen  
- ⏳ Openingstijden & cutoff times  
- ⏳ Time slot generatie  
- ⏳ Pickup/Delivery widget in cart/checkout  
- ⏳ App Proxy JSON endpoints  
- ⏳ Order tagging  

Voor de volledige roadmap zie **TODO.md**.

---

## 🛠️ Local Development

### 1. Install dependencies
```bash
npm install
