export const GAME_WIDTH  = 960;
export const GAME_HEIGHT = 540;

// The horizontal lane ghosts walk along
export const LANE_Y      = 400;
export const PATH_TOP    = 372;
export const PATH_BOTTOM = 428;

// Zone boundaries (x, in screen/world space — no scrolling)
export const CAVE_END     = 110;  // cave:     0 → 110
export const PLAYPARK_END = 340;  // playpark: 110 → 340
export const FOREST_END   = 830;  // forest:   340 → 830
// house: 830 → 960

// Aliases used elsewhere
export const HOUSE_X      = FOREST_END;
export const FOREST_START = PLAYPARK_END;
export const CAVE_WIDTH   = CAVE_END;

// Ghost travel waypoints (x)
export const GHOST_SPAWN_X  = 55;  // spawns inside cave
export const GHOST_GOAL_X   = 875; // reaches house door
export const GHOST_RETURN_X = 40;  // returns to cave (despawn)

// Valid tower placement zone (x range)
export const PLACE_START = CAVE_END + 15;   // playpark + forest
export const PLACE_END   = FOREST_END - 15;

// Economy
export const STARTING_SWEETS   = 10;
export const STARTING_CRYSTALS = 50;
export const TOWER_COST        = 20;

// Tower behaviour
export const TOWER_RANGE     = 220; // px radius
export const TOWER_FIRE_RATE = 1500; // ms between shots
export const TOWER_DAMAGE    = 1;

// Ghost penalty when carrying a sweet
export const CARRY_SPEED_MULT = 0.5;
