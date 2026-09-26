const canvas = document.getElementById("area-canvas");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const scale = 150;
const tickSize = 5;

//Paint Graph
// X
ctx.beginPath();
ctx.moveTo(0, centerY);
ctx.lineTo(canvas.width, centerY);
ctx.stroke();

//Y
ctx.beginPath();
ctx.moveTo(centerX, 0);
ctx.lineTo(centerX, canvas.height);
ctx.stroke();

// Arrows Left
ctx.beginPath();
ctx.moveTo(canvas.width, centerY);
ctx.lineTo(canvas.width - 12, centerY - 8);
ctx.moveTo(canvas.width, centerY);
ctx.lineTo(canvas.width - 12, centerY + 8);
ctx.stroke();

// Arrow Up
ctx.beginPath();
ctx.moveTo(centerX, 0);
ctx.lineTo(centerX - 8, 12);
ctx.moveTo(centerX, 0);
ctx.lineTo(centerX + 8, 12);
ctx.stroke();

// Axis labels
ctx.font = "18px Arial";
ctx.fillText("X", canvas.width - 25, centerY - 12);
ctx.fillText("Y", centerX + 12, 22);

// Origin label
ctx.fillText("0", centerX + 8, centerY - 8);

ctx.fillStyle = "black";
ctx.font = "12px Arial";

// Y wıth Rs
ctx.fillText("R", centerX + 8, centerY - scale + 5);
ctx.fillText("R/2", centerX + 8, centerY - scale / 2 + 5);
ctx.fillText("-R/2", centerX + 8, centerY + scale / 2 + 5);
ctx.fillText("-R", centerX + 8, centerY + scale + 5);

// X wıth Rs
ctx.fillText("-R", centerX - scale - 12, centerY - 8);
ctx.fillText("-R/2", centerX - scale / 2 - 18, centerY - 8);
ctx.fillText("R/2", centerX + scale / 2 - 10, centerY - 8);
ctx.fillText("R", centerX + scale - 5, centerY - 8);

ctx.beginPath();

// X ekseni çentikleri
ctx.moveTo(centerX - scale, centerY - tickSize);
ctx.lineTo(centerX - scale, centerY + tickSize);

ctx.moveTo(centerX - scale / 2, centerY - tickSize);
ctx.lineTo(centerX - scale / 2, centerY + tickSize);

ctx.moveTo(centerX + scale / 2, centerY - tickSize);
ctx.lineTo(centerX + scale / 2, centerY + tickSize);

ctx.moveTo(centerX + scale, centerY - tickSize);
ctx.lineTo(centerX + scale, centerY + tickSize);

// Y ekseni çentikleri
ctx.moveTo(centerX - tickSize, centerY - scale);
ctx.lineTo(centerX + tickSize, centerY - scale);

ctx.moveTo(centerX - tickSize, centerY - scale / 2);
ctx.lineTo(centerX + tickSize, centerY - scale / 2);

ctx.moveTo(centerX - tickSize, centerY + scale / 2);
ctx.lineTo(centerX + tickSize, centerY + scale / 2);

ctx.moveTo(centerX - tickSize, centerY + scale);
ctx.lineTo(centerX + tickSize, centerY + scale);

ctx.stroke();

// Rectangular
ctx.fillStyle = "rgb(50 152 240 / 0.6)";
ctx.fillRect(centerX, centerY - scale / 2, scale, scale / 2);

// Triangle
ctx.beginPath();
ctx.moveTo(centerX, centerY);
ctx.lineTo(centerX + scale, centerY);
ctx.lineTo(centerX, centerY + scale);
ctx.closePath();
ctx.fill();

// Circle
ctx.beginPath();
ctx.moveTo(centerX, centerY);
ctx.arc(centerX, centerY, scale, Math.PI / 2, Math.PI);
ctx.closePath();
ctx.fill();
// Canvas End //

// Validation
const pointForm = document.getElementById("point-form");
const yInput = document.getElementById("y-input");
const rInput = document.getElementById("r-input");
const xError = document.getElementById("x-error");
const yError = document.getElementById("y-error");
const rError = document.getElementById("r-error");

function parseDecimal(text) {
    const trimmed = text.trim();
    const dotIndex = trimmed.indexOf(".");

    if (dotIndex === -1) {
        return Number(trimmed);
    }

    const truncated = trimmed.slice(0, dotIndex + 11);
    return Number(truncated);
}
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}
function clearErrors() {
    xError.textContent = "";
    yError.textContent = "";
    rError.textContent = "";
}

pointForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const startTime = performance.now();
    clearErrors();

    const yValue = yInput.value;
    const rValue = rInput.value;

    const checkedCheckboxes = document.querySelectorAll('#point-form input[type="checkbox"]:checked');
    if (checkedCheckboxes.length === 0) {
        xError.textContent = "Please select at least one value for X.";
        return;
    }

    const yNumber = parseDecimal(yValue);
    if (yValue.trim() === "" || isNaN(yNumber) || yNumber <= -5 || yNumber >= 3) {
        yError.textContent = "Y must be a number between -5 and 3.";
        return;
    }

    const rNumber = parseDecimal(rValue);
    if (rValue.trim() === "" || isNaN(rNumber) || rNumber <= 1 || rNumber >= 4) {
        rError.textContent = "R must be a number between 1 and 4.";
        return;
    }

    const resultTableBody = document.getElementById("result-table-body");
    const placeholderRow = document.querySelector("#result-table-body tr td[colspan]");
    if (placeholderRow) {
        placeholderRow.closest("tr").remove();
    }

    const savedResults = JSON.parse(localStorage.getItem("results") || "[]");

    checkedCheckboxes.forEach(function (checkbox) {
        const xNumber = Number(checkbox.value);

        const inRectangle = xNumber >= 0 && xNumber <= rNumber && yNumber >= 0 && yNumber <= rNumber / 2;
        const inTriangle = xNumber >= 0 && yNumber <= 0 && (xNumber - yNumber) <= rNumber;
        const inCircle = xNumber <= 0 && yNumber <= 0 && (xNumber * xNumber + yNumber * yNumber) <= (rNumber * rNumber);

        const isInside = inRectangle || inTriangle || inCircle;

        const now = new Date();
        const timestamp = now.getTime();
        const endTime = performance.now();
        const executionTime = (endTime - startTime).toFixed(3);
        const formattedDateTime = formatDateTime(timestamp);

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${xNumber}</td>
            <td>${yNumber}</td>
            <td>${rNumber}</td>
            <td>${isInside ? "Inside" : "Outside"}</td>
            <td>${formattedDateTime}</td>
            <td>${executionTime} ms</td>
        `;
        resultTableBody.appendChild(newRow);

        savedResults.push({
            x: xNumber,
            y: yNumber,
            r: rNumber,
            isInside: isInside,
            timestamp: timestamp,
            executionTime: executionTime
        });
    });

    localStorage.setItem("results", JSON.stringify(savedResults));
});

// Load saved results on page load
const savedResultsOnLoad = JSON.parse(localStorage.getItem("results") || "[]");

if (savedResultsOnLoad.length > 0) {
    const placeholderRow = document.querySelector("#result-table-body tr td[colspan]");
    if (placeholderRow) {
        placeholderRow.closest("tr").remove();
    }

    savedResultsOnLoad.forEach(function (result) {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${result.x}</td>
        <td>${result.y}</td>
        <td>${result.r}</td>
        <td>${result.isInside ? "Inside" : "Outside"}</td>
        <td>${formatDateTime(result.timestamp)}</td>
        <td>${result.executionTime} ms</td>
    `;
        document.getElementById("result-table-body").appendChild(row);
    });
}

const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", function () {
    localStorage.removeItem("results");

    const resultTableBody = document.getElementById("result-table-body");
    resultTableBody.innerHTML = `
        <tr>
            <td colspan="6">Пока нет результатов</td>
        </tr>
    `;
});