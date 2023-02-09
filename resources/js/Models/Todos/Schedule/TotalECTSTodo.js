export default class TotalECTSTodo {
    getEntries({ requiredECTS, ects }) {
        return [
            {
                label: `Belegen Sie genau ${requiredECTS} ECTS Kreditpunkte.`,
                checked: ects == requiredECTS,
                progressLabel: `${ects} / ${requiredECTS}`,
            },
        ];
    }
}
