/**
 * @file logic.test.js
 * @description Unit tests for FlowState Arena core logic.
 */

import { describe, it, expect } from 'vitest';
import { deriveStatus, getOptimalGate, getIncentiveReward } from '../utils/logic';

describe('FlowState Arena Core Logic', () => {

    it('validates that congestionScore correctly triggers a "Critical" status', () => {
        expect(deriveStatus(30)).toBe('Clear');
        expect(deriveStatus(55)).toBe('Busy');
        expect(deriveStatus(85)).toBe('Critical');
        expect(deriveStatus(76)).toBe('Critical');
    });

    it('ensures the Pathfinder logic returns the gate with the absolute lowest congestion', () => {
        const mockGates = [
            { id: 1, name: 'North Gate', congestion: 45 },
            { id: 2, name: 'South Gate', congestion: 20 },
            { id: 3, name: 'East Gate', congestion: 80 }
        ];
        const optimal = getOptimalGate(mockGates);
        expect(optimal.name).toBe('South Gate');
        expect(optimal.congestion).toBe(20);
    });

    it('tests that the "Incentive Reward" string is generated correctly when a reroute occurs', () => {
        expect(getIncentiveReward('food')).toBe('🍺 Free Drink Upgrade');
        expect(getIncentiveReward('gate')).toBe('🎫 Priority Re-Entry');
        expect(getIncentiveReward('section')).toBe('🎫 Priority Re-Entry');
    });
});
