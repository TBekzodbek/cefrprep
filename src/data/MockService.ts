import mocksData from './mocks_data.json';

export interface MockTest {
    title: string;
    listening: string[];
    reading: string[];
    keys: {
        listening: Record<string, string>;
        reading: Record<string, string>;
    };
}

const typedMocksData = mocksData as Record<string, MockTest>;

// Items < 500 chars from end of reading[] that contain ≥2 number-answer patterns are answer blocks
function isAnswerBlock(item: string): boolean {
    const t = item.trim();
    if (!t || t.length > 500) return false;
    const hits = t.match(/\b\d{1,2}[.\s]+[A-Za-z0-9]/g) || [];
    return hits.length >= 2;
}

// Parse listening and reading answer keys from the answer-block items at the end of reading[]
function parseAnswerKeys(reading: string[]): { listening: Record<string, string>; reading: Record<string, string> } {
    const listening: Record<string, string> = {};
    const readingKeys: Record<string, string> = {};
    const seenNums = new Set<string>();

    // Collect answer items by scanning backwards; stop at first long (passage) item
    const answerItems: string[] = [];
    for (let i = reading.length - 1; i >= 0; i--) {
        if (reading[i].length > 500) break;
        answerItems.unshift(reading[i]);
    }

    for (const item of answerItems) {
        for (const rawLine of item.split('\n')) {
            const line = rawLine.trim();
            if (!line) continue;
            if (/^(ANSWER\s+SHEET|Listening\s+Reading|---PAGE|BAGDAD)/i.test(line)) continue;

            // "Part N" header occupies the LEFT (listening) column → any answer on this line is READING
            const isPartHeader = /^Part\s+\d+\b/i.test(line);

            const cleaned = line
                .replace(/^Part\s+\d+\s*/i, '')
                .replace(/^Section\s+\d+\s*/i, '')
                .trim();
            if (!cleaned) continue;

            // Match: 1-2 digit number, optional dot/space, then an answer token (letter, word, or number)
            // Handles: "1 A", "9 train", "10 10:15", "11 30 / thirty", "1. C"
            const pattern = /\b(\d{1,2})\.?\s+((?:[A-Za-z][A-Za-z0-9]*|\d+(?:[:.]\d+)?)(?:\s*\/\s*(?:[A-Za-z][A-Za-z0-9]*|\d+))?)/g;
            let m: RegExpExecArray | null;
            while ((m = pattern.exec(cleaned)) !== null) {
                const num = parseInt(m[1]);
                if (num < 1 || num > 35) continue;
                const numStr = num.toString();
                const ans = m[2].trim().toLowerCase().replace(/\.$/, '');

                if (isPartHeader) {
                    // Direct to reading (right column of answer sheet)
                    if (!readingKeys[numStr]) readingKeys[numStr] = ans;
                } else {
                    // First occurrence → listening; second → reading
                    if (!seenNums.has(numStr)) {
                        seenNums.add(numStr);
                        listening[numStr] = ans;
                    } else if (!readingKeys[numStr]) {
                        readingKeys[numStr] = ans;
                    }
                }
            }
        }
    }

    return { listening, reading: readingKeys };
}

export const MockService = {
    getMockList: (): string[] =>
        Object.keys(typedMocksData).sort((a, b) => Number(a) - Number(b)),

    getMock: (id: string): MockTest | null => {
        const mock = typedMocksData[id];
        if (!mock) return null;
        return { ...mock, keys: parseAnswerKeys(mock.reading) };
    },

    // Filter out short headers and answer blocks; keep meaningful content
    getDisplayParts: (parts: string[]): string[] =>
        parts.filter(item => item.trim().length >= 100 && !isAnswerBlock(item)),

    calculateScore: (userAnswers: Record<string, string>, correctKeys: Record<string, string>) => {
        let score = 0;
        const total = 35;
        const results: Record<string, boolean> = {};
        for (let i = 1; i <= total; i++) {
            const n = i.toString();
            const user = (userAnswers[n] || '').trim().toLowerCase();
            const raw = (correctKeys[n] || '').trim().toLowerCase();
            // Accept any slash-separated alternative (e.g. "30 / thirty")
            const acceptable = raw.split('/').map(a => a.trim()).filter(Boolean);
            const ok = user.length > 0 && acceptable.includes(user);
            results[n] = ok;
            if (ok) score++;
        }
        return { score, total, results };
    },

    getCEFRLevel: (score: number): string => {
        if (score >= 31) return 'C1';
        if (score >= 23) return 'B2';
        if (score >= 15) return 'B1';
        if (score >= 8) return 'A2';
        return 'A1';
    },
};
