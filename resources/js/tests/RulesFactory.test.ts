import { getRules } from "@/Models/Rules/Schedule/RuleFactory";
import { RuleData } from "@/types";
import { describe, expect, it, vi } from "vitest";

describe("RulesFactory", () => {
    it("should get rules", () => {
        const rulesData: Array<RuleData> = [
            {
                name: "ExcludeSemester",
                params: {},
            },
            {
                name: "UnknownRule",
                params: {},
            },
            {
                name: "ExcludeSemester",
                params: {},
            },
        ];

        const rules = getRules(rulesData);

        expect(rules.length).toBe(2);
        expect(rules[0].constructor.name).toBe("ExcludeSemesterRule");
        expect(rules[1].constructor.name).toBe("ExcludeSemesterRule");
    });
});
