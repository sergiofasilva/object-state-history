'use strict';
export function isNaturalNumber(value) {
    return Number.isInteger(value) && value >= 0;
}
