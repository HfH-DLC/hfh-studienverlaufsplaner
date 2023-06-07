import { getRules } from "@/Models/Rules/Schedule/RuleFactory";
import { RuleData } from "@/types";
import { describe, expect, it, vi } from "vitest";

describe("RuleFactory", () => {
    it("should get rules", () => {
        const rulesData: Array<RuleData> = [
            {
                name: "ExcludeSemester",
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
