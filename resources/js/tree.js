class Node {
    constructor(value) {
        this.children = [];
        this.value = value;
    }

    insertChild(value) {
        const child = new Node(value);
        this.children.push(child);
        return child;
    }

    getPaths() {
        if (this.children.length == 0) {
            if (this.value) {
                return [[this.value]];
            }
            return [];
        }
        const childPaths = this.children.reduce((acc, cur) => {
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
        }, []);
        return childPaths;
    }

    getLongestPaths() {
        const paths = this.getPaths();
        let maxSize = 0;
        let result = [];
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

export function bestPath(foci, moduleIds) {
    const root = new Node();

    const focusDataset = foci.map((focus) => {
        return {
            id: focus.id,
            allowedIds: focus.optionalModules.map((module) => module.id),
            requiredNumber: focus.requiredNumberOfOptionalModules,
        };
    });

    const placedModules = focusDataset.reduce((acc, cur) => {
        acc[cur.id] = [];
        return acc;
    }, {});

    for (let i = 0; i < focusDataset.length; i++) {
        const focusData = focusDataset[i];
        fork(
            root,
            focusData,
            focusDataset,
            [...moduleIds],
            0,
            placedModules,
            i
        );
    }

    let paths = root.getLongestPaths();

    const scoredPaths = paths.map((path) => {
        const pathGroupedByFocus = path.reduce((acc, cur) => {
            if (!acc[cur.focusId]) {
                acc[cur.focusId] = [];
            }
            acc[cur.focusId].push(cur.moduleId);
            return acc;
        }, {});
        const score = scorePath(pathGroupedByFocus, focusDataset);
        return { score, pathGroupedByFocus };
    });

    const bestPath = scoredPaths.reduce((acc, cur) => {
        if (!acc) {
            return cur;
        }
        return cur.score > acc.score ? cur : acc;
    }, null);

    console.log("bestPath", bestPath);

    return bestPath ? bestPath.pathGroupedByFocus : {};
}

function scorePath(path, focusDataset) {
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
    node,
    focusData,
    focusDataset,
    moduleIds,
    level,
    placedModules,
    branchIndex
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
            newPlacedModules,
            i
        );
    }
    return false;
}
