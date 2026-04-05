export const GAME_WIDTH  = 960;
export const GAME_HEIGHT = 540;
export const WORLD_WIDTH = 2000; // scrollable world, wider than the viewport

// The horizontal lane ghosts walk along
export const LANE_Y      = 400;
export const PATH_TOP    = 372;
export const PATH_BOTTOM = 428;

// World zone boundaries (x, in world space)
export const CAVE_END     = 210;  // cave: 0 → 210
export const PLAYPARK_END = 500;  // playpark: 210 → 500
export const FOREST_END   = 1780; // forest: 500 → 1780
// house: 1780 → 2000

// Aliases used elsewhere
export const HOUSE_X      = FOREST_END;
export const FOREST_START = PLAYPARK_END;
export const CAVE_WIDTH   = CAVE_END;

// Ghost travel waypoints (world x)
export const GHOST_SPAWN_X  = 110;  // spawns inside cave
export const GHOST_GOAL_X   = 1845; // reaches house door
export const GHOST_RETURN_X = 80;   // returns to cave (despawn)

// Valid tower placement zone (x range, world space)
export const PLACE_START = CAVE_END + 20;   // playpark + forest
export const PLACE_END   = FOREST_END - 20;

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
