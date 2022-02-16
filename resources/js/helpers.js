export const isSameDate = (a, b) => {
    return a.year === b.year &&
        a.semester === b.semester &&
        a.week === b.week &&
        a.day === b.day &&
        a.time === b.time
}

export const isPreviousSemester = (before, after) => {
    if (before.year > after.year) {
        return false;
    }
    if (before.year === after.year) {
        return before.semester === 'HS' && after.semester === 'FS'
    }
    return true;
}

const HS = 'HS';
const FS = 'FS';
const semesters = [HS, FS];
export const orderSemester = (a, b) => orderBy(semesters, a, b);
export const semesterCount = () => semesters.length;
export const semesterPosition = (semester) => semesters.indexOf(semester);

const weeks = ['A', 'B'];
export const orderWeek = (a, b) => orderBy(weeks, a, b);

const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
export const orderDay = (a, b) => orderBy(days, a, b);

const times = ['Vormittag', 'Nachmittag']
export const orderTime = (a, b) => orderBy(times, a, b);

const orderBy = (order, a, b) => order.indexOf(a) - order.indexOf(b)

export const getCalendarYear = (semester, schoolYear) => {
    return semester === HS ? schoolYear : schoolYear + 1
}