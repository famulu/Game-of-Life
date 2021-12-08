const grid = document.querySelector("#grid");
const checkboxes = [];
const side = 23;

for (let i = 0; i < side; i++) {
    const row = document.createElement("div");
    row.style.padding = 0;
    row.style.margin = 0;
    row.style.height = "13px";
    const rowArray = [];
    grid.appendChild(row);
    for (let j = 0; j < side; j++) {
        const checkbox = document.createElement("input");
        rowArray.push(checkbox);
        checkbox.type = "checkbox";
        checkbox.style.margin = 0;
        row.appendChild(checkbox);
    }
    checkboxes.push(rowArray);
}

function toBooleanGrid(checkboxes) {
    return checkboxes.map(row => row.map(checkbox => checkbox.checked));
}

function updateCheckboxes(booleanGrid, checkboxes) {
    booleanGrid.forEach(
        (row, i) => row.forEach((value, j) => checkboxes[i][j].checked = value)
    );
}

function randomGrid() {
    const result = [];
    for (let i = 0; i < side; i++) {
        const row = [];
        for (let j = 0; j < side; j++) {
            row.push((Math.random() < 0.2 ? true : false));
        }
        result.push(row);
    }
    return result;
}

updateCheckboxes(randomGrid(), checkboxes);

function isBetween(num, min, max) {
    return num >= min && num <= max;
}

function countAliveNeighbors(row, col, checkboxes) {
    let alive = 0;
    const neighbors = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ];

    for (const neighbor of neighbors) {
        const neighborY = row + neighbor[0], neighborX = col + neighbor[1];
        if (isBetween(neighborY, 0, side - 1) && isBetween(neighborX, 0, side - 1)) {
            if (checkboxes[neighborY][neighborX].checked) alive += 1;
        }
    }
    return alive;
}

function nextGeneration(checkboxes) {
    const boolGrid = toBooleanGrid(checkboxes);
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {

            const isAlive = checkboxes[i][j].checked;
            const aliveNeighbors = countAliveNeighbors(i, j, checkboxes);
            if (isAlive) {
                if (!(aliveNeighbors === 2 || aliveNeighbors === 3)) {
                    boolGrid[i][j] = false;
                }
            } else {
                if (aliveNeighbors === 3) {
                    boolGrid[i][j] = true;
                }
            }
        }
    }
    updateCheckboxes(boolGrid, checkboxes);
}

document.querySelector("#next").addEventListener("click", () => {
    nextGeneration(checkboxes);
});

const interval = 100 // 100 ms
let intervalID = null;
const next = document.querySelector("#auto");
next.addEventListener("click", () => {
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
        next.textContent = "Auto Generate";
    } else {
        intervalID = setInterval(() => nextGeneration(checkboxes), interval);
        next.textContent = "Pause";
    }
});

function resetGrid() {
    for (const row of checkboxes) {
        for (const box of row) {
            box.checked = false;
        }
    }
}
document.querySelector("#reset").addEventListener("click", resetGrid);
document.querySelector("#random").addEventListener("click", () => {
    updateCheckboxes(randomGrid(), checkboxes);
});
