import { Focus } from "./types";

interface FocusData {
    id: string;
    allowedIds: string[];
    requiredNumber: number;
}

interface NodeValue {
    moduleId: string;
    focusId: string;
}

class Node {
    private children: Array<Node>;
    private value: NodeValue | undefined;

    constructor(value?: NodeValue) {
        this.children = [];
        this.value = value;
    }

    insertChild(value: NodeValue) {
        const child = new Node(value);
        this.children.push(child);
        return child;
    }

    getPaths(): Array<Array<NodeValue>> {
        if (this.children.length == 0) {
            if (this.value) {
                return [[this.value]];
            }
            return [];
        }
        const childPaths: Array<Array<NodeValue>> = this.children.reduce(
            (acc: Array<Array<NodeValue>>, cur: Node) => {
                const paths = cur.getPaths();
                acc.push(
                    ...paths.map((path) => {
                        if (this.value) {
                            return [...path, this.value];
                        }
                        return path;
                    })
                );
                return acc;
            },
            []
        );
        return childPaths;
    }

    getLongestPaths() {
        const paths = this.getPaths();
        let maxSize = 0;
        let result: Array<Array<NodeValue>> = [];
        paths.forEach((path) => {
            if (path.length > maxSize) {
                maxSize = path.length;
                result = [path];
            } else if (path.length == maxSize) {
                result.push(path);
            }
        });
        return result;
    }
}

export function bestPath(foci: Array<Focus>, moduleIds: Set<string>) {
    const root = new Node();

    const focusDataset = foci.map((focus) => {
        return {
            id: focus.id,
            allowedIds: focus.optionalModules.map((module) => module.id),
            requiredNumber: focus.requiredNumberOfOptionalModules,
        };
    });

    const placedModules: Record<string, Array<string>> = focusDataset.reduce(
        (acc, cur) => {
            acc[cur.id] = [];
            return acc;
        },
        {} as Record<string, Array<string>>
    );

    for (let i = 0; i < focusDataset.length; i++) {
        const focusData = focusDataset[i];
        fork(root, focusData, focusDataset, [...moduleIds], 0, placedModules);
    }

    let paths = root.getLongestPaths();

    const scoredPaths = paths.map((path) => {
        const pathGroupedByFocus: Record<string, Array<string>> = path.reduce(
            (acc, cur) => {
                if (!acc[cur.focusId]) {
                    acc[cur.focusId] = [];
                }
                acc[cur.focusId].push(cur.moduleId);
                return acc;
            },
            {} as Record<string, Array<string>>
        );
        const score = scorePath(pathGroupedByFocus, focusDataset);
        return { score, pathGroupedByFocus };
    });

    const bestPath: {
        score: number;
        pathGroupedByFocus: Record<string, string[]>;
    } | null = scoredPaths.reduce((acc, cur) => {
        if (!acc) {
            return cur;
        }
        return cur.score > acc.score ? cur : acc;
    }, null as { score: number; pathGroupedByFocus: Record<string, string[]> } | null);

    return bestPath ? bestPath.pathGroupedByFocus : {};
}

function scorePath(
    path: Record<string, string[]>,
    focusDataset: Array<FocusData>
): number {
    let score = 0;
    focusDataset.forEach((focusData) => {
        if (
            path[focusData.id] &&
            path[focusData.id].length == focusData.requiredNumber
        ) {
            score++;
        }
    });
    return score;
}

function fork(
    node: Node,
    focusData: FocusData,
    focusDataset: Array<FocusData>,
    moduleIds: Array<string>,
    level: number,
    placedModules: Record<string, Array<string>>
) {
    if (level == moduleIds.length) {
        return;
    }
    if (placedModules[focusData.id].length == focusData.requiredNumber) {
        return;
    }
    const moduleId = moduleIds[level];

    if (!focusData.allowedIds.includes(moduleId)) {
        return;
    }

    const child = node.insertChild({ moduleId, focusId: focusData.id });

    const newPlacedModules = JSON.parse(JSON.stringify(placedModules));
    newPlacedModules[focusData.id].push(moduleId);

    for (let i = 0; i < focusDataset.length; i++) {
        const nextFocusData = focusDataset[i];
        fork(
            child,
            nextFocusData,
            focusDataset,
            moduleIds,
            level + 1,
            newPlacedModules
        );
    }
    return false;
}
