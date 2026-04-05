// Each entry: { type, delay }
// delay = ms since wave start (absolute, not relative to previous spawn)
//
// Ghost types:  'ghost-regular' | 'ghost-fast' | 'ghost-tank'
// Monster types: 'monster-zombie' | 'monster-bat' | 'monster-ogre'

export const WAVES = [
  // Wave 1 — ghosts only, gentle intro
  [
    { type: 'ghost-regular', delay:  500 },
    { type: 'ghost-regular', delay: 2500 },
    { type: 'ghost-regular', delay: 4500 },
    { type: 'ghost-regular', delay: 6000 },
    { type: 'ghost-regular', delay: 7500 },
  ],

  // Wave 2 — introduce fast ghosts
  [
    { type: 'ghost-regular', delay:  500 },
    { type: 'ghost-fast',    delay: 1800 },
    { type: 'ghost-regular', delay: 3000 },
    { type: 'ghost-fast',    delay: 3800 },
    { type: 'ghost-regular', delay: 5000 },
    { type: 'ghost-fast',    delay: 5600 },
    { type: 'ghost-regular', delay: 7000 },
  ],

  // Wave 3 — tank ghosts + first monsters (zombies)
  [
    { type: 'ghost-regular',  delay:  500 },
    { type: 'monster-zombie', delay: 1400 },
    { type: 'ghost-fast',     delay: 2200 },
    { type: 'ghost-tank',     delay: 3000 },
    { type: 'monster-zombie', delay: 4000 },
    { type: 'ghost-fast',     delay: 4700 },
    { type: 'ghost-regular',  delay: 5500 },
    { type: 'monster-zombie', delay: 6200 },
    { type: 'ghost-tank',     delay: 7000 },
  ],

  // Wave 4 — bats join the mix
  [
    { type: 'monster-bat',    delay:  300 },
    { type: 'monster-bat',    delay:  800 },
    { type: 'ghost-tank',     delay: 1400 },
    { type: 'monster-zombie', delay: 2000 },
    { type: 'ghost-fast',     delay: 2500 },
    { type: 'monster-bat',    delay: 3000 },
    { type: 'ghost-regular',  delay: 3600 },
    { type: 'monster-zombie', delay: 4200 },
    { type: 'ghost-tank',     delay: 4900 },
    { type: 'monster-bat',    delay: 5400 },
    { type: 'ghost-fast',     delay: 5900 },
    { type: 'monster-bat',    delay: 6300 },
  ],

  // Wave 5 — the final push, ogres appear
  [
    { type: 'monster-ogre',   delay:  300 },
    { type: 'monster-bat',    delay:  700 },
    { type: 'monster-bat',    delay: 1100 },
    { type: 'ghost-regular',  delay: 1600 },
    { type: 'monster-zombie', delay: 2100 },
    { type: 'monster-ogre',   delay: 2700 },
    { type: 'ghost-fast',     delay: 3200 },
    { type: 'monster-bat',    delay: 3600 },
    { type: 'ghost-tank',     delay: 4100 },
    { type: 'monster-zombie', delay: 4700 },
    { type: 'monster-bat',    delay: 5100 },
    { type: 'monster-bat',    delay: 5400 },
    { type: 'monster-ogre',   delay: 5900 },
    { type: 'ghost-regular',  delay: 6400 },
    { type: 'monster-ogre',   delay: 7000 },
  ],
];
