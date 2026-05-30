"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseRelativeToMs(relativeText) {
    const now = Date.now();
    if (!relativeText)
        return now;
    const cleanText = relativeText.toLowerCase().trim();
    console.log("Parsing:", cleanText);
    const match = cleanText.match(/(\d+(?:\.\d+)?)\s*(second|minute|hour|day|week|month|year)s?\s*ago/);
    if (!match) {
        console.log("NO MATCH");
        return now;
    }
    const value = parseFloat(match[1]);
    const unit = match[2];
    let multiplier = 1000; // seconds
    if (unit.startsWith('minute'))
        multiplier = 60 * 1000;
    else if (unit.startsWith('hour'))
        multiplier = 60 * 60 * 1000;
    else if (unit.startsWith('day'))
        multiplier = 24 * 60 * 60 * 1000;
    else if (unit.startsWith('week'))
        multiplier = 7 * 24 * 60 * 60 * 1000;
    else if (unit.startsWith('month'))
        multiplier = 30 * 24 * 60 * 60 * 1000;
    else if (unit.startsWith('year'))
        multiplier = 365 * 24 * 60 * 60 * 1000;
    console.log("Parsed:", value, unit);
    return now - (value * multiplier);
}
parseRelativeToMs("11 hours ago");
parseRelativeToMs("streamed 2 days ago");
parseRelativeToMs("premiered 1 week ago");
//# sourceMappingURL=debug.js.map