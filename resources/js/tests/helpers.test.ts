import {
    getCalendarYear,
    getNestedDates,
    isPreviousSemester,
    isSameDate,
    semesterCount,
    pluralize,
    joinStrings,
} from "@/helpers";
import { EventDate, EventDateWithOptionalTimeWindow } from "@/types";
import { describe } from "vitest";
import { dayTimeFactory } from "./factories/DayTimeFactory";

describe("helpers", () => {
    describe("isSameDate", () => {
        it("returns true for same date", () => {
            const a: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "HS",
                dayTime: dayTimeFactory.build(),
            };
            const result = isSameDate(a, a);

            expect(result).toBe(true);
        });

        it("returns false for different year", () => {
            const a: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "HS",
                dayTime: dayTimeFactory.build(),
            };
            const b: EventDateWithOptionalTimeWindow = { ...a, year: 1991 };
            const result = isSameDate(a, b);

            expect(result).toBe(false);
        });

        it("returns false for different semester", () => {
            const a: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "HS",
                dayTime: dayTimeFactory.build(),
            };
            const b: EventDateWithOptionalTimeWindow = { ...a, semester: "FS" };
            const result = isSameDate(a, b);

            expect(result).toBe(false);
        });

        it("returns false for different dayTime", () => {
            const a: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "HS",
                dayTime: dayTimeFactory.build({ id: "a" }),
            };
            const b: EventDateWithOptionalTimeWindow = {
                ...a,
                dayTime: dayTimeFactory.build({ id: "b" }),
            };
            const result = isSameDate(a, b);

            expect(result).toBe(false);
        });

        it("returns false for different timeWindow if both dates have a timeWindow value", () => {
            const a: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "HS",
                dayTime: dayTimeFactory.build(),
                timeWindow: "TimeWindowA",
            };
            const b: EventDateWithOptionalTimeWindow = {
                ...a,
                timeWindow: "TimeWindowB",
            };
            const result = isSameDate(a, b);

            expect(result).toBe(false);
        });

        it("ignores different timeWindow values if only one date has a timeWindow value", () => {
            const a: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "HS",
                dayTime: dayTimeFactory.build(),
            };
            const b: EventDateWithOptionalTimeWindow = {
                ...a,
                timeWindow: "TimeWindowB",
            };
            const result = isSameDate(a, b);

            expect(result).toBe(true);
        });
    });

    describe("isPreviousSemester", () => {
        it("returns true if before.year is less than after.year", () => {
            const before: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "HS",
                dayTime: dayTimeFactory.build(),
            };
            const after = { ...before, year: 1991 };

            expect(isPreviousSemester(before, after)).toBe(true);
            expect(isPreviousSemester(after, before)).toBe(false);
        });

        it("returns false if before.year is not less than after.year", () => {
            const before: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "HS",
                dayTime: dayTimeFactory.build(),
            };
            const after = { ...before, year: 1989 };

            expect(isPreviousSemester(before, before)).toBe(false);
            expect(isPreviousSemester(before, after)).toBe(false);
            expect(isPreviousSemester(after, before)).toBe(true);
        });

        it("returns true if before.semester is HS and after.semester is FS if both have the same year", () => {
            const before: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "HS",
                dayTime: dayTimeFactory.build(),
            };
            const after: EventDateWithOptionalTimeWindow = {
                ...before,
                semester: "FS",
            };

            expect(isPreviousSemester(before, after)).toBe(true);
            expect(isPreviousSemester(after, before)).toBe(false);
        });

        it("returns false if before.semester is FS and after.semester is HS if both have the same year", () => {
            const before: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "FS",
                dayTime: dayTimeFactory.build(),
            };
            const after: EventDateWithOptionalTimeWindow = {
                ...before,
                semester: "HS",
            };

            expect(isPreviousSemester(before, after)).toBe(false);
            expect(isPreviousSemester(after, before)).toBe(true);
        });

        it("ignores semester values if the years are different", () => {
            const before: EventDateWithOptionalTimeWindow = {
                year: 1990,
                semester: "FS",
                dayTime: dayTimeFactory.build(),
            };
            const after: EventDateWithOptionalTimeWindow = {
                ...before,
                year: 1991,
                semester: "HS",
            };

            expect(isPreviousSemester(before, after)).toBe(true);
            expect(isPreviousSemester(after, before)).toBe(false);
        });
    });

    describe("getCalendarYear", () => {
        it("should return school year if the semester is HS", () => {
            expect(getCalendarYear("HS", 1990)).toBe(1990);
        });

        it("should return school year + 1 if the semester is FS", () => {
            expect(getCalendarYear("FS", 1990)).toBe(1991);
        });
    });

    describe("getNestedDates", () => {
        it("should correctly group dates by years and semesters", () => {});

        it("should return an object with empty years array for no dates", () => {
            const dates: Array<EventDate> = [];

            const expectedResult = {
                years: [],
            };

            const result = getNestedDates(dates);
            expect(result).toEqual(expectedResult);
        });
    });

    describe("pluralize", () => {
        it("returns singular if count is 1", () => {
            const singular = "singular";
            const plural = "plural";

            expect(pluralize(1, singular, plural)).toBe(singular);
        });

        it("returns plural if count is greater than 1", () => {
            const singular = "singular";
            const plural = "plural";

            expect(pluralize(2, singular, plural)).toBe(plural);
        });
    });

    describe("joinStrings function", () => {
        test("joins multiple strings with a connector", () => {
            const result = joinStrings(
                ["Hello", "world", "how", "are", "you?"],
                "and"
            );
            expect(result).toBe("Hello, world, how, are and you?");
        });

        test("returns single string as it is", () => {
            const result = joinStrings(["Hello"], "and");
            expect(result).toBe("Hello");
        });

        test("works with an empty array", () => {
            const result = joinStrings([], "and");
            expect(result).toBe("");
        });

        test("works with different connectors", () => {
            const result = joinStrings(["Hello", "world"], "or");
            expect(result).toBe("Hello or world");
        });
    });
});
