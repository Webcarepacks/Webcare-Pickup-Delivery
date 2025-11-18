# Shopify Pickup & Delivery App – TODO & Roadmap

Framework: React Router  
UI: Shopify Polaris Web Components  
Database: Prisma  
App Type: Embedded Shopify App  
Features: Pickup, Delivery, Time Slots, Cart/Checkout integrations

---

## 📌 MVP MILESTONES

### ✅ 1. Project basis
- [x] Shopify React Router template draaien
- [x] Prisma installeren en initialiseren
- [ ] Database model: `Location`
- [ ] Prisma client helper (`db.server.js`)
- [ ] Locations route (create + list)

---

## 🚧 2. Locations – CRUD (Pickup Locaties)

### Required
- [x] Nieuwe locatie toevoegen (name + address)
- [x] Locaties ophalen per shop via Prisma + shopDomain
- [ ] Locatie bewerken (edit route)
- [ ] Locatie verwijderen (delete action)
- [ ] Active / inactive toggle (locatie aan- of uitzetten)

### Later uitbreiden
- [ ] Openingstijden per locatie (JSON schema)
- [ ] Closed dates / holiday exceptions
- [ ] Cutoff time per locatie
- [ ] Max pickups per dag

---

## 📅 3. Openingstijden & Beschikbaarheid

### Models & Data
- [ ] Prisma model uitbreiden met:
  - `openingHoursJson` (string)
  - `cutoffTime` (string, optional)
  - `closedDatesJson` (string)
- [ ] Admin UI form voor openingstijden (ma–zo)

### Logic
- [ ] Functie: `getAvailableDates(location)`
- [ ] Functie: `isDateAvailable(date, location)`
- [ ] Cutoff time verwerken (bijv. 16:00 → morgen earliest pickup)

---

## ⏰ 4. Time Slots systeem

### Data & Models
- [ ] Prisma model: `Timeslot`  
  - date  
  - slot (bijv. "10:00 – 12:00")  
  - locationId  
  - capacity  
  - usedCount  

### Functions
- [ ] Generate slots per dag obv openingstijden
- [ ] Validate slot availability
- [ ] Capacity verminderen bij nieuwe order

### UI
- [ ] Time slot selector in admin (toy)
- [ ] Frontend widget: datum + slot selector

---

## 🚚 5. Delivery Regels

### Basic delivery logic
- [ ] Admin UI: delivery on/off toggle
- [ ] Postcode restricties:
  - lijst (1234AB, 1234AA)
  - wildcard (1234*)
- [ ] Minimum order amount
- [ ] Delivery pricing schema:
  - vast bedrag
  - gratis boven X
  - per kilometer (Google Maps API) — optioneel

### Prisma additions
- [ ] `DeliveryRule` model toevoegen

---

## 🛒 6. Cart & Checkout Integratie

### Data flow
- [ ] Theme App Extension maken met cart widget
- [ ] Fetch locations + timeslots via App Proxy route
- [ ] Cart attributes opslaan:
  - `pickup_location`
  - `pickup_date`
  - `pickup_timeslot`  
  - of:
  - `delivery_postcode`
  - `delivery_date`

### Checkout
- [ ] Checkout UI Extension (Shopify Functions)
- [ ] Validate:
  - locatie verplicht
  - date verplicht
  - slot beschikbaar
  - shop open / niet gesloten
  - cutoff time
  - postcode regel OK

---

## 📦 7. Orders – verwerking

### Admin View
- [ ] Overzicht van pickup orders
- [ ] Overzicht van delivery orders
- [ ] Filters: datum, locatie, status

### Order tagging
- [ ] Tag op order:
  - `pickup`
  - `pickup-[location-id]`
  - `pickup-[date-slot]`
  - `delivery-[postcode]`

### Webhooks
- [ ] `orders/create`
- [ ] `orders/updated`
- [ ] Bij binnenkomst → opslaan in Prisma `OrderMeta`

---

## 🧱 8. App Proxy API Routes (JSON endpoints)

### Required
- [ ] `/apps/pickup-delivery/locations`
- [ ] `/apps/pickup-delivery/timeslots`
- [ ] `/apps/pickup-delivery/validate`

### JSON responses
- [ ] Locations
- [ ] Openingstijden
- [ ] Beschikbare datum + slot combinaties

---

## 🧩 9. Frontend Widget

### Cart Page Widget
- [ ] Pickup/Delivery keuze
- [ ] Locatie dropdown
- [ ] Datum picker
- [ ] Timeslot selector
- [ ] Validatie + feedback

### Optional front-end tech
- [ ] React micro-app in Theme App Extension
- [ ] Standaard JS widget fallback (no build)

---

## ✨ 10. UX / Quality-of-Life features

### UI Enhancements
- [ ] Loading states
- [ ] Success messages
- [ ] Error boundaries
- [ ] Better Polaris styling

### Dev Tools
- [ ] Add `.env.example`
- [ ] Add logs in development mode
- [ ] Add code comments

---

## 🧨 11. Premium Features (na MVP)

### Extra
- [ ] Map preview per locatie (Google Maps iframe)
- [ ] Geo-radius delivery (5km, 10km etc.)
- [ ] Staff notifications (mail/SMS)
- [ ] POS integratie:
  - Mark order as picked up
- [ ] Analytics dashboard:
  - meest gekozen tijdslot
  - drukste locaties
  - week vs weekend load

---

## 🏁 MVP Definition of Done

- [ ] Pickup locaties CRUD volledig werkend
- [ ] Openingstijden + cutoff time per locatie
- [ ] Time slots generatie en validatie
- [ ] Theme App Extension toont widget
- [ ] Cart attributes opslaan + zichtbaar in order
- [ ] App Proxy endpoints voor locatie + timeslot data
- [ ] Orders getagd met pickup/delivery info
- [ ] Basis handleiding in README.md

---

## 📌 FINAL NOTE

Deze lijst is opgesteld als **backlog voor jou + Codex**, in logische volgorde:  
1. CRUD  
2. Timeslots  
3. Delivery  
4. Cart widget  
5. Checkout  
6. Orders  
7. Premium uitbreidingen  

Volg de lijst item voor item en geef Codex directe opdrachten zoals:

> “Implementeer edit/delete in `app.locations.jsx` volgens TODO.md sectie 2.”

Je krijgt zo een superoverzichtelijk, schaalbaar project.