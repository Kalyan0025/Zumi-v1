# Zumi

Journaling app that opens with a horoscope-style reading. Zumi is the fortune-cookie mascot. Working name.

This repo is the interactive prototype, one chunk at a time. Vanilla HTML, CSS and JS, no dependencies.

## Run
Open `src/index.html` in a browser, or run `python3 build.py` and open `dist/index.html` (single file).

## Structure
- `src/css` base tokens, home, reading sheet, capture, keyboard
- `src/js` icons, mascot, data (sample copy), keyboard (iOS style), feed, sheet, capture, app
- `build.py` inlines everything into `dist/index.html`

## Screens so far (Chunk 1 and 2)
1. Home greeting, Today's reading row
2. Today's reading overlay (Taurus)
3. Chat with Zumi (bottom bar is Zumi only), replies with icon rows
4. Add a moment: photo, voice, text (plain entry on the iOS keyboard), review and tag, drops into the day's thread

5. Streak orbs on Home: each past day shows a key memory image; tap for that day's card (thread, then night feedback)
6. Night check-in: pill appears after two moments, compares the day with the morning reading (fit, partly, missed), one word, summary, saved to the journal

## Mascot
Current shape is locked. Cookie variants (Pinch, Rim, Slip, Crescent, Fold, Soft) live in `src/js/mascot.js` (`Z.mv`) for later.

## Stand-ins
Camera, microphone and dictation are simulated. Replies and tags use simple keyword rules.

## Design tokens
Orange only, plain light page, SF Pro with normal letter spacing. See `src/css/base.css`.

## Moments and the horoscope
- Add a moment accepts several photos at once (library multi-select or repeated shutter). They stack in a tray, swipe in review, and sit as a horizontal strip in the thread.
- `src/js/react.js`: after each moment Zumi replies with the matching morning line and asks if it fit.
- Night check-in: each question and the summary link the day's moments to the line they belong to.

## Calendar
- `src/js/calendar.js`, `src/css/calendar.css`: Aug to Oct as orb grids. Photo orbs hold the day's key memory, pale orbs are logged days without one, bare numbers are unlogged days.
- Patterns are things that come back days or weeks apart (not streaks). Patterns are labelled P1, P2 and so on, shown as a small tag under the date; no colour is used. "Show on calendar" fades the rest and draws a dotted line through them.
- Past days before Oct 12 are seeded (seeded PRNG in `calendar.js`), each a long journal day of text, voice and photos. Photos in `photos.js` are public-domain sample photographs (bundled with open-source Python packages), cropped; swap for real stock photos.

## Run it
Open `index.html` in a browser (a standalone copy of `dist/index.html`). To rebuild after editing `src/`: `python3 build.py`, then re-create `index.html` from `dist/index.html`. For a live link, turn on GitHub Pages from the `main` branch root.
