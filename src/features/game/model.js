/**
 * Enum describing the possible game actions.
 */
export const GameSelection = Object.freeze({
  TIME_ATTACK: 'timeAttack',
  FLIP_HIT: 'flipHit',
});

const VALID_GAME_SELECTIONS = Object.values(GameSelection);

const gameSelectionsDescriptions = {
  [GameSelection.TIME_ATTACK]: 'Keep current action',
  [GameSelection.FLIP_HIT]: 'Flip Hit',
};

/**
 * Returns a human-readable description of the given a game selection.
 */
export function describeGameSelection(game) {
  return gameSelectionsDescriptions[game] || `unknown game: ${game}`;
}

/**
 * Returns whether the given object represents a valid game selection.
 */
export function isValidGameSelection(game) {
  return VALID_GAME_SELECTIONS.includes(game);
}
