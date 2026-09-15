# 🏛️ Chronicles of Time: The Amulet of Barcino

**Chronicles of Time: The Amulet of Barcino** is an interactive, educational WebApp designed as a detective adventure game running through the Gothic Quarter (Barri Gòtic) of Barcelona. Built for a group of adults and children (ages 7-13), it combines on-site observation challenges, logical deduction to discard false clues, and a historical-fantasy narrative thread.

---

## 🎯 Game Objective
A mysterious relic thief has stolen the 5 gems of the **Amulet of Barcino**, altering the city's temporal fabric. The detective team must navigate central Barcelona, interrogate visual witnesses, discard impostors using logical deduction, and solve physical field challenges to recover the gems before cornering the thief.

---

## 🗺️ Adventure Route

1. **Palau de la Música Catalana** (Gem 1 - Modernisme)
2. **Iglesia de Santa Ana** (Gem 2 - Templar/Medieval)
3. **Pont del Bisbe** (Gem 3 - Gothic Legends)
4. **Templo de Augusto** (Gem 4 - Roman Barcino)
5. **El Bosc de les Fades** (Midday Rest/Lunch Break)
6. **Plaça del Rei / MUHBA** (Gem 5 + Climax: Capturing the thief and diploma awarding)

---

## 🎮 Core Mechanics

* **Witness Screen:** Each location presents 3 interactive characters:
  * **True Witness:** Provides accurate information about the environment.
  * **Clueless Character:** Adds comic relief or innocent anachronistic data.
  * **Liar / Mercenary:** Presents logical fallacies or spatial/historical contradictions.
* **On-Site Challenges:** Direct visual observation puzzles based on real architectural elements (sculptures, engravings, dates).
* **Dynamic Amulet:** Top visual interface displaying the real-time collection status of the 5 gems.
* **Local Persistence:** Team name storage via `localStorage` to personalize dialogues and the final diploma.

---

## 🛠️ Tech Stack

* **HTML5 & CSS3:** Responsive layout with a retro-steampunk/gothic aesthetic using CSS Grid/Flexbox.
* **Vanilla JavaScript (ES6+):** Lightweight client-side game logic, no external frameworks or dependencies.
* **Web Audio API:** Playback of the orchestral soundtrack and ambient sound effects.
* **JSON Data Storage:** Stages, dialogues, logical traps, and validations structured in JSON files.

---

## 📂 Project Structure

```text
.
├── index.html              # SPA (Single Page Application) main entry point
├── css/
│   └── style.css           # Global styles, amulet interface, and layout
├── js/
│   ├── app.js              # Main WebApp controller and UI rendering
│   ├── gameState.js        # State management (gems, team data, progress)
│   └── audio.js            # Music and sound effects player
├── assets/
│   ├── img/                # Scenarios, characters, and gem interface assets
│   └── audio/              # Soundtrack and SFX
└── data/
    └── stages.json         # Data structure for locations, dialogues, and puzzles
