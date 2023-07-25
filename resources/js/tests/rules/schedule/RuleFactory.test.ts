import { getRules } from "@/Models/Rules/Schedule/RuleFactory";
import { RuleData } from "@/types";
import { describe, expect, it, vi } from "vitest";

import RuleMapping from "@/Models/Rules/Schedule/RuleMapping";

const ruleCases = Object.entries(RuleMapping).map(([name, details]) => {
    const params = details!.paramsRequired ? {} : undefined;
    return { ruleData: { name, params }, Class: details!.Class };
});

describe("RuleFactory", () => {
    it("should get rules", () => {
        const rules = getRules(ruleCases.map((ruleCase) => ruleCase.ruleData));
        expect(rules.length).toBe(ruleCases.length);
        ruleCases.forEach((ruleCase, index) => {
            expect(rules[index]).toBeInstanceOf(ruleCase.Class);
        });
    });

    it("should log an error for unknown rules", () => {
        const rulesData: Array<RuleData> = [
            {
                name: "UknownRule",
                params: {},
            },
        ];
        const consoleErrorMock = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const rules = getRules(rulesData);

        expect(rules.length).toBe(0);
        expect(consoleErrorMock).toHaveBeenCalledOnce();
        consoleErrorMock.mockRestore();
    });
});
