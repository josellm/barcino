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

* **Witness interrogation:** Each investigation stage presents three interactive
  witnesses: one truthful witness, one clueless character, and one liar. The
  team must identify the reliable account before continuing.
* **On-site observation puzzles:** Multiple-choice challenges use real details
  of the surrounding architecture, sculptures, and monuments.
* **Location verification:** Each destination includes a Google Maps link and a
  geolocation check. The check uses a stage-specific radius when GPS is
  available, and allows progress when location services are unavailable.
* **Dynamic amulet:** The header shows the real-time status of all five gems.
* **Rest stop:** El Bosc de les Fades provides a short recovery stage between
  the fourth and fifth gem investigations.
* **Final diploma:** Completing the Plaça del Rei challenge unlocks the final
  diploma screen for the team.
* **Local persistence:** Team name, current stage, stage status, and collected
  gems are saved in `localStorage` under `barcino_game_state`.

---

## 🛠️ Tech Stack

* **HTML5 & CSS3:** Responsive layout with a retro-steampunk/gothic aesthetic using CSS Grid/Flexbox.
* **Vanilla JavaScript (ES6+):** Client-side screen rendering and game flow with no application framework.
* **Web Audio API:** Playback of the orchestral soundtrack and ambient sound effects.
* **JSON data:** Stage locations, dispatches, witnesses, dialogues, and puzzles are defined in `data/stages.json`.
* **Progressive Web App:** `manifest.webmanifest` and `sw.js` provide install metadata and service-worker support.

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
│   ├── audio.js            # Music and sound effects player
│   └── components/
│       ├── IntroScreen.js             # Adventure welcome screen
│       ├── OnboardingFlow.js          # Intro and team registration flow
│       ├── TeamRegistrationScreen.js  # Team name registration and validation
│       ├── Mission0Screen.js           # First mission briefing and location link
│       ├── StageScreen.js              # Location, witnesses, puzzles, and rewards
│       ├── AmuletBar.js                # Gem progress display
│       └── DiplomaScreen.js            # Completion diploma
├── assets/
│   ├── img/                # Scenarios, characters, and gem interface assets
│   └── audio/              # Soundtrack and SFX
└── data/
    └── stages.json         # Data structure for locations, dialogues, and puzzles
```

## 🧭 Stage Flow

1. **Palau de la Música Catalana:** Recover the Gema Modernista.
2. **Iglesia de Santa Ana:** Recover the Gema Templaria.
3. **Pont del Bisbe:** Recover the Gema de las Leyendas.
4. **Templo de Augusto:** Recover the Gema Romana.
5. **El Bosc de les Fades:** Rest and follow the trail to the final location.
6. **Plaça del Rei / MUHBA:** Recover the Gema Gótica and complete the adventure.

Each data-driven stage follows the same sequence: arrive at the location,
interrogate witnesses, solve the observation puzzle, unlock the gem when the
answer is correct, and advance to the next stage.

## ▶️ Running Locally

Install the dependencies and start the smoke-test server with:

```bash
npm install
npm run test:smoke
```

The test script serves the project on `http://localhost:8080`, runs the
Playwright test suite, and shuts the server down afterward. For a development
server without tests, use any static file server from the project root, for
example `npx serve . -p 8080`.


## 🖥️ Screen Components

The screen components are small vanilla JavaScript render functions. Each one
creates and returns a `<main>` element, while `app.js` controls which screen is
shown according to the current game stage.

* **`renderIntroScreen(onStartCallback)`**: Displays the adventure introduction
  and invokes the callback when the player starts.
* **`renderTeamRegistrationScreen(onSubmitCallback)`**: Collects and validates
  the team name before passing it to the game-state controller.
* **`renderMission0Screen(teamName, onArrivedCallback)`**: Shows the personalised
  Palau de la Música Catalana briefing, provides a map link, and advances when
  the team arrives.
* **`renderStageScreen(stageNumber, stageData, onStageComplete)`**: Renders the
  location briefing, geolocation check, witness interrogation, observation
  puzzle, and gem unlock transition for each stage.
