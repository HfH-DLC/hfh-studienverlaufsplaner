import { EventDate, EventDateWithOptionalTimeWindow, Semester } from "./types";

export const isSameDate = (
    a: EventDateWithOptionalTimeWindow,
    b: EventDateWithOptionalTimeWindow
) => {
    let result =
        a.year === b.year &&
        a.semester === b.semester &&
        a.dayTime.id === b.dayTime.id;
    if (a.timeWindow && b.timeWindow) {
        result = result && a.timeWindow === b.timeWindow;
    }
    return result;
};

export const isPreviousSemester = (
    before: EventDateWithOptionalTimeWindow,
    after: EventDateWithOptionalTimeWindow
) => {
    if (before.year > after.year) {
        return false;
    }
    if (before.year === after.year) {
        return before.semester === "HS" && after.semester === "FS";
    }
    return true;
};

const HS: Semester = "HS";
const FS: Semester = "FS";
const semesters: Array<Semester> = [HS, FS];
export const orderSemester = (a: string, b: string) => orderBy(semesters, a, b);
export const semesterCount = () => semesters.length;
export const semesterPosition = (semester: Semester) =>
    semesters.indexOf(semester);

const timeWindows = ["A", "B"];
export const orderTimeWindow = (a: string, b: string) =>
    orderBy(timeWindows, a, b);

const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
export const orderDay = (a: string, b: string) => orderBy(days, a, b);

const times = ["Vormittag", "Nachmittag", "Abend"];
export const orderTime = (a: string, b: string) => orderBy(times, a, b);

const orderBy = (order: string[], a: string, b: string) =>
    order.indexOf(a) - order.indexOf(b);

export const getCalendarYear = (semester: Semester, schoolYear: number) => {
    return semester === HS ? schoolYear : schoolYear + 1;
};

export const getNestedDates = (dates: Array<EventDate>) => {
    const years = [...new Set(dates.map((date) => date.year))].sort();
    return {
        years: years
            .sort((a, b) => a - b)
            .map((year) => {
                const yearDates = dates.filter((date) => date.year === year);
                const semesters = [
                    ...new Set(yearDates.map((date) => date.semester)),
                ]
                    .sort(orderSemester)
                    .map((semester) => {
                        const semesterDates = yearDates.filter(
                            (date) => date.semester === semester
                        );
                        return {
                            value: semester,
                            calendarYear: getCalendarYear(semester, year),
                            timeWindows: [
                                ...new Set(
                                    semesterDates.map((date) => date.timeWindow)
                                ),
                            ].sort(orderTimeWindow),
                            dayTimes: semesterDates
                                .map((date) => date.dayTime)
                                .filter(
                                    (a, index, self) =>
                                        index ===
                                        self.findIndex((b) => a.id === b.id)
                                )
                                .sort((a, b) => a.sortIndex - b.sortIndex),
                        };
                    });
                return {
                    value: year,
                    semesters,
                };
            }),
    };
};

export const pluralize = (count: number, singular: string, plural: string) => {
    return count == 1 ? singular : plural;
};

export const joinStrings = (strings: string[], connector: string) => {
    if (strings.length == 1) {
        return strings[0];
    }
    return (
        strings.slice(0, strings.length - 1).join(", ") +
        ` ${connector} ` +
        strings[strings.length - 1]
    );
};
