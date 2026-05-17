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

export const MockService = {
    getMockList: () => {
        return Object.keys(typedMocksData).sort((a, b) => Number(a) - Number(b));
    },

    getMock: (id: string): MockTest | null => {
        return typedMocksData[id] || null;
    },

    calculateScore: (userAnswers: Record<string, string>, correctKeys: Record<string, string>) => {
        let score = 0;
        const total = 35;
        const results: Record<string, boolean> = {};

        for (let i = 1; i <= total; i++) {
            const num = i.toString();
            const userAns = (userAnswers[num] || "").trim().toLowerCase();
            const correctAns = (correctKeys[num] || "").trim().toLowerCase();

            // Simple match logic (can be expanded for multiple correct options)
            if (userAns && userAns === correctAns) {
                score++;
                results[num] = true;
            } else {
                results[num] = false;
            }
        }

        return { score, total, results };
    },

    getCEFRLevel: (score: number) => {
        if (score >= 31) return "C1";
        if (score >= 23) return "B2";
        if (score >= 15) return "B1";
        if (score >= 8) return "A2";
        return "A1";
    }
};
