import Category from "./Models/Category";
import Module from "./Models/Module";
import TimeSlot from "./Models/TimeSlot";
import DateRule from "./Models/Rules/DateRule";
import PrerequisitesRule from "./Models/Rules/PrerequisitesRule";
import OnePerSemesterRule from "./Models/Rules/OnePerSemesterRule";

export default class DataAdapter {

    getData() {
        const categories = [
            new Category(0, "Pflichtbereich HFE"),
            new Category(1, "Berufspraxis HFE"),
            new Category(2, "Wahlpflichtbereich HFE", 3),
            new Category(3, "Masterarbeit HFE"),
        ];

        const modules = [
            new Module("P1_01", "Grundfragen der Heilpädagogik", 0, 5, [
                { semester: "HS", day: "Montag", time: "Nachmittag" },
                { semester: "HS", day: "Donnerstag", time: "Nachmittag" },
                { semester: "FS", day: "Montag", time: "Nachmittag" },
                { semester: "FS", day: "Donnerstag", time: "Nachmittag" },
            ]),
            new Module("P1_03", "Heilpädagogik im Vorschulbereich", 0, 5, [
                { semester: "FS", day: "Montag", time: "Vormittag" },
            ]),
            new Module(
                "P4_02",
                "Grundlagen der Heilpädagogischen Früherziehung",
                0, 5, [{ semester: "HS", day: "Montag", time: "Vormittag" }]
            ),
            new Module(
                "P4_06",
                "Diagnostik und Früherfassung in der Heilpädagogischen Früherziehung",
                0, 5, [{ semester: "FS", day: "Montag", time: "Nachmittag" }]
            ),
            new Module(
                "P4_07",
                "Entwicklungsorientierte Intervention in der Heilpädagogischen Früherziehung",
                0, 5, [{ semester: "HS", day: "Donnerstag", time: "Nachmittag" }], ["P4_02"]
            ),
            new Module(
                "P4_08",
                "Beratung und Begleitung von Eltern und weiteren Bezugs- und Fachpersonen in der Heilpädagogischen Früherziehung",
                0, 5, [{ semester: "HS", day: "Donnerstag", time: "Vormittag" }], ["P4_02"]
            ),
            new Module(
                "P4_09",
                "Interdisziplinarität und Kooperation im Kontext der Heilpädagogischen Früherziehung",
                0, 5, [{ semester: "FS", day: "Donnerstag", time: "Vormittag" }]
            ),
            new Module("BP5_01.1.HFE", "Berufspraxis I & Portfolio", 1, 5, [
                { semester: "HS", day: "Montag", time: "Vormittag" },
                { semester: "FS", day: "Montag", time: "Vormittag" },
            ]),
            new Module("BP5_01.2.HFE", "Berufspraxis II & Portfolio", 1, 5, [
                { semester: "HS", day: "Donnerstag", time: "Vormittag" },
                { semester: "FS", day: "Donnerstag", time: "Vormittag" },
            ], ["BP5_01.1.HFE"]),
            new Module("BP5_01.3.HFE", "Berufspraxis III & Portfolio", 1, 10, [
                { semester: "HS", day: "Donnerstag", time: "Nachmittag" },
                { semester: "FS", day: "Donnerstag", time: "Vormittag" },
                { semester: "FS", day: "Donnerstag", time: "Nachmittag" },
            ], ["BP5_01.1.HFE", "BP5_01.2.HFE"]),
            new Module("WP2_04.1", "Heilpädagogik im Bereich Hören I", 2, 5, [
                { semester: "HS", day: "Donnerstag", time: "Nachmittag" },
            ]),
            new Module("WP2_04.2", "Heilpädagogik im Bereich Hören II", 2, 5, [
                { semester: "FS", day: "Donnerstag", time: "Nachmittag" },
            ], ["WP2_04.1"]),
            new Module("WP2_05.1", "Heilpädagogik im Bereich Sehen I", 2, 5, [
                { semester: "HS", day: "Donnerstag", time: "Nachmittag" },
            ]),
            new Module(
                "WP2_06.1",
                "Heilpädagogik im Bereich körperlich-motorische Entwicklung. Motorische Beeinträchtigungen",
                2, 5, [{ semester: "HS", day: "Montag", time: "Nachmittag" }]
            ),
            new Module(
                "WP2_06.2",
                "Heilpädagogik im Bereich körperlich-motorische Entwicklung. Chronische Erkrankungen",
                2, 5, [{ semester: "FS", day: "Montag", time: "Nachmittag" }]
            ),
            new Module("WP2_07", "Schwere mehrfache Beeinträchtigungen", 2, 5, [
                { semester: "HS", day: "Montag", time: "Vormittag" },
            ]),
            new Module(
                "WP2_11",
                "Autismus im Kontext der Heilpädagogischen Früherziehung",
                2, 5, [{ semester: "FS", day: "Donnerstag", time: "Nachmittag" }]
            ),
            new Module("M5_03", "Masterarbeit", 3, 20, [
                { semester: "HS", day: "Montag", time: "Vormittag" },
                { semester: "HS", day: "Donnerstag", time: "Vormittag" },
                { semester: "FS", day: "Montag", time: "Vormittag" },
                { semester: "FS", day: "Donnerstag", time: "Vormittag" },
            ]),
        ]

        const timeSlots = [
            new TimeSlot(
                0,
                "HS21",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Montag",
                "Vormittag"
            ),
            new TimeSlot(
                1,
                "HS21",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Montag",
                "Nachmittag"
            ),
            new TimeSlot(
                2,
                "HS21",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Donnerstag",
                "Vormittag"
            ),
            new TimeSlot(
                3,
                "HS21",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Donnerstag",
                "Nachmittag"
            ),
            new TimeSlot(4, "HS21", "Wo 1, 6, 10, 14", "Montag", "Vormittag"),
            new TimeSlot(5, "HS21", "Wo 1, 6, 10, 14", "Montag", "Nachmittag"),
            new TimeSlot(
                6,
                "HS21",
                "Wo 1, 6, 10, 14",
                "Donnerstag",
                "Vormittag"
            ),
            new TimeSlot(
                7,
                "HS21",
                "Wo 1, 6, 10, 14",
                "Donnerstag",
                "Nachmittag"
            ),

            new TimeSlot(
                8,
                "FS22",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Montag",
                "Vormittag"
            ),
            new TimeSlot(
                9,
                "FS22",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Montag",
                "Nachmittag"
            ),
            new TimeSlot(
                10,
                "FS22",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Donnerstag",
                "Vormittag"
            ),
            new TimeSlot(
                11,
                "FS22",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Donnerstag",
                "Nachmittag"
            ),
            new TimeSlot(12, "FS22", "Wo 1, 6, 10, 14", "Montag", "Vormittag"),
            new TimeSlot(13, "FS22", "Wo 1, 6, 10, 14", "Montag", "Nachmittag"),
            new TimeSlot(
                14,
                "FS22",
                "Wo 1, 6, 10, 14",
                "Donnerstag",
                "Vormittag"
            ),
            new TimeSlot(
                15,
                "FS22",
                "Wo 1, 6, 10, 14",
                "Donnerstag",
                "Nachmittag"
            ),

            new TimeSlot(
                16,
                "HS22",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Montag",
                "Vormittag"
            ),
            new TimeSlot(
                17,
                "HS22",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Montag",
                "Nachmittag"
            ),
            new TimeSlot(
                18,
                "HS22",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Donnerstag",
                "Vormittag"
            ),
            new TimeSlot(
                19,
                "HS22",
                "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
                "Donnerstag",
                "Nachmittag"
            ),
            new TimeSlot(20, "HS22", "Wo 1, 6, 10, 14", "Montag", "Vormittag"),
            new TimeSlot(21, "HS22", "Wo 1, 6, 10, 14", "Montag", "Nachmittag"),
            new TimeSlot(
                22,
                "HS22",
                "Wo 1, 6, 10, 14",
                "Donnerstag",
                "Vormittag"
            ),
            new TimeSlot(
                23,
                "HS22",
                "Wo 1, 6, 10, 14",
                "Donnerstag",
                "Nachmittag"
            ),
        ];

        const rules = [
            new DateRule(),
            new PrerequisitesRule(),
            new OnePerSemesterRule(["BP5_01.1.HFE", "BP5_01.2.HFE", "BP5_01.3.HFE"]),
        ];

        return { timeSlots, modules, categories, rules };
    }
}