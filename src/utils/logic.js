/**
 * @file logic.js
 * @description Core business logic for crowd management, decoupled for testing.
 */

/**
 * Derives common status string from congestion percentage.
 * @param {number} c - Congestion percentage (0-100).
 * @returns {'Clear'|'Busy'|'Critical'}
 */
export function deriveStatus(c) {
    if (c <= 40) return 'Clear';
    if (c <= 75) return 'Busy';
    return 'Critical';
}

/**
 * Clamps a value between a minimum and maximum.
 * @param {number} v - Value to clamp.
 * @param {number} lo - Lower bound.
 * @param {number} hi - Upper bound.
 * @returns {number}
 */
export function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}

/**
 * Finds the gate with the absolute lowest congestion.
 * @param {Array} gates - Array of gate objects with congestion property.
 * @returns {Object|null}
 */
export function getOptimalGate(gates) {
    if (!gates || gates.length === 0) return null;
    return [...gates].sort((a, b) => a.congestion - b.congestion)[0];
}

/**
 * Generates an incentive reward string based on zone type.
 * @param {string} type - Zone type ('food'|'gate'|'section').
 * @returns {string}
 */
export function getIncentiveReward(type) {
    return type === 'food' ? '🍺 Free Drink Upgrade' : '🎫 Priority Re-Entry';
}
