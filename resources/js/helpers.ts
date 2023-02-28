import { EventDate } from "./types";

export const isSameDate = (a: EventDate, b: EventDate) => {
    return (
        a.year === b.year &&
        a.semester === b.semester &&
        a.timeWindow === b.timeWindow &&
        a.day === b.day &&
        a.time === b.time
    );
};

export const isPreviousSemester = (before: EventDate, after: EventDate) => {
    if (before.year > after.year) {
        return false;
    }
    if (before.year === after.year) {
        return before.semester === "HS" && after.semester === "FS";
    }
    return true;
};

const HS = "HS";
const FS = "FS";
const semesters = [HS, FS];
export const orderSemester = (a: string, b: string) => orderBy(semesters, a, b);
export const semesterCount = () => semesters.length;
export const semesterPosition = (semester: string) =>
    semesters.indexOf(semester);

const timeWindows = ["A", "B"];
export const orderTimeWindow = (a: string, b: string) =>
    orderBy(timeWindows, a, b);

const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
export const orderDay = (a: string, b: string) => orderBy(days, a, b);

const times = ["Vormittag", "Nachmittag"];
export const orderTime = (a: string, b: string) => orderBy(times, a, b);

const orderBy = (order: string[], a: string, b: string) =>
    order.indexOf(a) - order.indexOf(b);

export const getCalendarYear = (semester: string, schoolYear: number) => {
    return semester === HS ? schoolYear : schoolYear + 1;
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
