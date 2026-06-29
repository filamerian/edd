
/*==========================================================
    37-goodman-kruskal-lambda.js
    EdD 602 - Advanced Educational Statistics

    Lesson 37
    Goodman and Kruskal's Lambda

    Part 1
    --------------------------------------------
    • Page Initialization
    • Basic Lambda Calculator
    • Prediction Buttons
    • Interpretation Slider
==========================================================*/

"use strict";

/*==========================================================
    PAGE INITIALIZATION
==========================================================*/

document.addEventListener("DOMContentLoaded", function () {

    initializeCalculator();

    initializePredictionButtons();

    initializeSlider();

    initializeContingencyTable();

});

/*==========================================================
    BASIC LAMBDA CALCULATOR
==========================================================*/

function initializeCalculator() {

    const button = document.getElementById("calculateLambda");

    if (!button) return;

    button.addEventListener("click", calculateLambda);

}


function calculateLambda() {

    const e1 = parseFloat(document.getElementById("errorsBefore").value);

    const e2 = parseFloat(document.getElementById("errorsAfter").value);

    const result = document.getElementById("lambdaResult");

    /* Validation */

    if (isNaN(e1) || isNaN(e2)) {

        result.innerHTML = createAlert(
            "danger",
            "Please enter both values before calculating."
        );

        return;

    }

    if (e1 <= 0) {

        result.innerHTML = createAlert(
            "danger",
            "Errors Before (E<sub>1</sub>) must be greater than zero."
        );

        return;

    }

    if (e2 < 0) {

        result.innerHTML = createAlert(
            "danger",
            "Errors After (E<sub>2</sub>) cannot be negative."
        );

        return;

    }

    if (e2 > e1) {

        result.innerHTML = createAlert(
            "warning",
            "Errors After (E<sub>2</sub>) cannot be greater than Errors Before (E<sub>1</sub>)."
        );

        return;

    }

    /* Compute Lambda */

    const lambda = (e1 - e2) / e1;

    const percent = lambda * 100;

    const interpretation = getInterpretation(lambda);

    result.innerHTML =

        '<div class="alert alert-success">' +

        '<h4 class="mb-3">Results</h4>' +

        '<table class="table table-bordered">' +

        '<tr>' +
        '<th width="35%">Errors Before (E<sub>1</sub>)</th>' +
        '<td>' + e1 + '</td>' +
        '</tr>' +

        '<tr>' +
        '<th>Errors After (E<sub>2</sub>)</th>' +
        '<td>' + e2 + '</td>' +
        '</tr>' +

        '<tr>' +
        '<th>Goodman and Kruskal\'s Lambda</th>' +
        '<td><strong>' + lambda.toFixed(3) + '</strong></td>' +
        '</tr>' +

        '<tr>' +
        '<th>Prediction Error Reduced</th>' +
        '<td><strong>' + percent.toFixed(1) + '%</strong></td>' +
        '</tr>' +

        '</table>' +

        '<div class="alert alert-primary mb-0">' +

        '<strong>Interpretation:</strong><br>' +

        interpretation +

        '</div>' +

        '</div>';

}


/*==========================================================
    PREDICTION BUTTONS
==========================================================*/

function initializePredictionButtons() {

    window.showPrediction = function (choice) {

        const feedback = document.getElementById("predictionFeedback");

        if (!feedback) return;

        switch (choice) {

            case "low":

                feedback.innerHTML =

                    createAlert(

                        "warning",

                        "<strong>Not Quite.</strong><br>" +

                        "The contingency table actually suggests a noticeable " +

                        "reduction in prediction errors. After completing the " +

                        "calculation you will observe a relatively high Lambda."

                    );

                break;

            case "moderate":

                feedback.innerHTML =

                    createAlert(

                        "info",

                        "<strong>Good Thinking.</strong><br>" +

                        "There is some evidence that internship performance " +

                        "improves prediction. Let's compute Lambda to verify."

                    );

                break;

            case "high":

                feedback.innerHTML =

                    createAlert(

                        "success",

                        "<strong>Excellent Prediction!</strong><br>" +

                        "The data indicate that knowing internship performance " +

                        "substantially reduces prediction errors."

                    );

                break;

        }

    };

}


/*==========================================================
    INTERPRETATION SLIDER
==========================================================*/

function initializeSlider() {

    const slider = document.getElementById("lambdaSlider");

    if (!slider) return;

    slider.addEventListener("input", updateSlider);

    updateSlider();

}


function updateSlider() {

    const slider = document.getElementById("lambdaSlider");

    const valueLabel = document.getElementById("lambdaValue");

    const interpretation = document.getElementById("lambdaInterpretation");

    const lambda = parseFloat(slider.value);

    valueLabel.innerHTML = lambda.toFixed(2);

    interpretation.innerHTML =

        "<strong>Interpretation:</strong><br>" +

        getInterpretation(lambda);

}


/*==========================================================
    INTERPRETATION FUNCTION
==========================================================*/

function getInterpretation(lambda) {

    if (lambda === 0) {

        return "Knowing the independent variable does not improve prediction.";

    }

    if (lambda <= 0.30) {

        return "The independent variable provides only a small improvement in prediction.";

    }

    if (lambda <= 0.60) {

        return "The independent variable provides a moderate improvement in prediction.";

    }

    if (lambda < 1) {

        return "The independent variable substantially improves prediction and greatly reduces prediction errors.";

    }

    return "Prediction errors have been completely eliminated. The independent variable perfectly predicts the dependent variable.";

}


/*==========================================================
    ALERT GENERATOR
==========================================================*/

function createAlert(type, message) {

    return '<div class="alert alert-' +

        type +

        '">' +

        message +

        '</div>';

}


/*==========================================================
    PART 2
    INTERACTIVE CONTINGENCY TABLE
==========================================================*/

/*
    Add this entire section BELOW Part 1.


document.addEventListener("DOMContentLoaded", function () {

    initializeContingencyTable();

});
*/

/*==========================================================
    INITIALIZE LIVE TABLE
==========================================================*/

function initializeContingencyTable() {

    const inputs = document.querySelectorAll(".lambda-input");

    if (inputs.length === 0) return;

    inputs.forEach(function (input) {

        input.addEventListener("input", updateContingencyTable);

    });

    updateContingencyTable();

}


/*==========================================================
    UPDATE CONTINGENCY TABLE
==========================================================*/

function updateContingencyTable() {

    const oEmp = getCellValue("oEmp");
    const oUnemp = getCellValue("oUnemp");
    const sEmp = getCellValue("sEmp");
    const sUnemp = getCellValue("sUnemp");

    const row1 = oEmp + oUnemp;
    const row2 = sEmp + sUnemp;

    const col1 = oEmp + sEmp;
    const col2 = oUnemp + sUnemp;

    const grandTotal = row1 + row2;

    if (grandTotal === 0) {

        document.getElementById("liveLambdaResults").innerHTML =

            createAlert(
                "warning",
                "Please enter values into the contingency table."
            );

        return;

    }

    /* -----------------------------------
       Compute E1
    -----------------------------------*/

    const largestColumn = Math.max(col1, col2);

    const e1 = grandTotal - largestColumn;

    /* -----------------------------------
       Compute E2
    -----------------------------------*/

    const largestRow1 = Math.max(oEmp, oUnemp);

    const largestRow2 = Math.max(sEmp, sUnemp);

    const errorsRow1 = row1 - largestRow1;

    const errorsRow2 = row2 - largestRow2;

    const e2 = errorsRow1 + errorsRow2;

    /* -----------------------------------
       Lambda
    -----------------------------------*/

    let lambda = 0;

    if (e1 > 0) {

        lambda = (e1 - e2) / e1;

    }

    if (lambda < 0) {

        lambda = 0;

    }

    const percent = lambda * 100;

    displayLiveResults({

        row1: row1,
        row2: row2,

        col1: col1,
        col2: col2,

        grand: grandTotal,

        e1: e1,
        e2: e2,

        lambda: lambda,

        percent: percent

    });

}


/*==========================================================
    DISPLAY RESULTS
==========================================================*/

function displayLiveResults(data) {

    const output = document.getElementById("liveLambdaResults");

    if (!output) return;

    let html = "";

    html += '<hr>';

    html += '<h4>Live Calculation Results</h4>';

    html += '<table class="table table-bordered">';

    html += '<tr>';
    html += '<th width="40%">Outstanding Total</th>';
    html += '<td>' + data.row1 + '</td>';
    html += '</tr>';

    html += '<tr>';
    html += '<th>Satisfactory Total</th>';
    html += '<td>' + data.row2 + '</td>';
    html += '</tr>';

    html += '<tr>';
    html += '<th>Employed Total</th>';
    html += '<td>' + data.col1 + '</td>';
    html += '</tr>';

    html += '<tr>';
    html += '<th>Unemployed Total</th>';
    html += '<td>' + data.col2 + '</td>';
    html += '</tr>';

    html += '<tr>';
    html += '<th>Grand Total</th>';
    html += '<td>' + data.grand + '</td>';
    html += '</tr>';

    html += '</table>';

    html += '<hr>';

    html += '<table class="table table-striped table-bordered">';

    html += '<tr>';
    html += '<th width="40%">Prediction Errors Before (E<sub>1</sub>)</th>';
    html += '<td>' + data.e1 + '</td>';
    html += '</tr>';

    html += '<tr>';
    html += '<th>Prediction Errors After (E<sub>2</sub>)</th>';
    html += '<td>' + data.e2 + '</td>';
    html += '</tr>';

    html += '<tr class="table-success">';
    html += '<th>Goodman and Kruskal\'s Lambda</th>';
    html += '<td><strong>' + data.lambda.toFixed(3) + '</strong></td>';
    html += '</tr>';

    html += '<tr>';
    html += '<th>Prediction Error Reduced</th>';
    html += '<td><strong>' + data.percent.toFixed(1) + '%</strong></td>';
    html += '</tr>';

    html += '</table>';

    html += createAlert(

        "primary",

        "<strong>Interpretation</strong><br>" +

        getInterpretation(data.lambda)

    );

    html += "<hr>";

    html += "<h5>Step-by-Step Computation</h5>";

    html += '<ol>';

    html += "<li>";

    html += "Largest Column Total = <strong>" +

        Math.max(data.col1, data.col2) +

        "</strong>";

    html += "</li>";

    html += "<li>";

    html += "E<sub>1</sub> = " +

        data.grand +

        " - " +

        Math.max(data.col1, data.col2) +

        " = <strong>" +

        data.e1 +

        "</strong>";

    html += "</li>";

    html += "<li>";

    html += "Largest cell in Outstanding row = <strong>" +

        Math.max(getCellValue("oEmp"), getCellValue("oUnemp")) +

        "</strong>";

    html += "</li>";

    html += "<li>";

    html += "Largest cell in Satisfactory row = <strong>" +

        Math.max(getCellValue("sEmp"), getCellValue("sUnemp")) +

        "</strong>";

    html += "</li>";

    html += "<li>";

    html += "E<sub>2</sub> = " +

        data.e2 +

        "</li>";

    html += "<li>";

    html += "&lambda; = (E<sub>1</sub> - E<sub>2</sub>) / E<sub>1</sub>";

    html += "</li>";

    html += "<li>";

    html += "&lambda; = (" +

        data.e1 +

        " - " +

        data.e2 +

        ") / " +

        data.e1 +

        " = <strong>" +

        data.lambda.toFixed(3) +

        "</strong>";

    html += "</li>";

    html += "</ol>";

    output.innerHTML = html;

}


/*==========================================================
    GET CELL VALUE
==========================================================*/

function getCellValue(id) {

    const value = parseInt(document.getElementById(id).value);

    if (isNaN(value) || value < 0) {

        return 0;

    }

    return value;

}

/*==========================================================
    PART 3
    EXTRA FEATURES
    • Reset Sample
    • Load Strong Example
    • Load Weak Example
    • Random Practice Dataset
    • APA Interpretation Generator
==========================================================*/


/*==========================================================
    SAMPLE DATA
==========================================================*/

function loadStrongExample() {

    setValues(18, 2, 6, 14);

}

function loadWeakExample() {

    setValues(15, 5, 13, 7);

}

function loadZeroExample() {

    setValues(18, 2, 10, 10);

}

function randomExample() {

    let oEmp = randomInteger(5, 25);
    let oUnemp = randomInteger(0, 15);

    let sEmp = randomInteger(5, 25);
    let sUnemp = randomInteger(0, 15);

    setValues(

        oEmp,
        oUnemp,
        sEmp,
        sUnemp

    );

}


function setValues(a, b, c, d) {

    document.getElementById("oEmp").value = a;
    document.getElementById("oUnemp").value = b;

    document.getElementById("sEmp").value = c;
    document.getElementById("sUnemp").value = d;

    updateContingencyTable();

}


function resetTable() {

    setValues(

        18,
        2,
        10,
        10

    );

}


/*==========================================================
    RANDOM INTEGER
==========================================================*/

function randomInteger(min, max) {

    return Math.floor(

        Math.random() * (max - min + 1)

    ) + min;

}


/*==========================================================
    APA INTERPRETATION
==========================================================*/

function generateAPA() {

    const oEmp = getCellValue("oEmp");
    const oUnemp = getCellValue("oUnemp");

    const sEmp = getCellValue("sEmp");
    const sUnemp = getCellValue("sUnemp");

    const row1 = oEmp + oUnemp;
    const row2 = sEmp + sUnemp;

    const col1 = oEmp + sEmp;
    const col2 = oUnemp + sUnemp;

    const total = row1 + row2;

    const e1 = total - Math.max(col1, col2);

    const e2 =

        (row1 - Math.max(oEmp, oUnemp))

        +

        (row2 - Math.max(sEmp, sUnemp));

    let lambda = 0;

    if (e1 > 0) {

        lambda = (e1 - e2) / e1;

    }

    let interpretation = "";

    if (lambda === 0) {

        interpretation =

            "Knowing the independent variable did not improve prediction.";

    }

    else if (lambda <= 0.30) {

        interpretation =

            "The independent variable produced only a small improvement in prediction.";

    }

    else if (lambda <= 0.60) {

        interpretation =

            "The independent variable produced a moderate improvement in prediction.";

    }

    else {

        interpretation =

            "The independent variable substantially improved prediction by reducing prediction errors.";

    }

    const apa =

        "Goodman and Kruskal's Lambda " +

        "(&lambda; = " +

        lambda.toFixed(3) +

        ") indicated that knowledge of the independent variable reduced " +

        "prediction errors by approximately " +

        (lambda * 100).toFixed(1) +

        "%. " +

        interpretation;

    return apa;

}


/*==========================================================
    COPY APA REPORT
==========================================================*/

function copyAPAReport() {

    const report = generateAPA();

    navigator.clipboard.writeText(report)

        .then(function () {

            alert(

                "APA interpretation copied to the clipboard."

            );

        })

        .catch(function () {

            alert(report);

        });

}


/*==========================================================
    SHOW APA REPORT
==========================================================*/

function showAPAReport() {

    const output = document.getElementById("apaReport");

    if (!output) return;

    output.innerHTML =

        '<div class="alert alert-success">' +

        '<h5>APA Interpretation</h5>' +

        '<p>' +

        generateAPA() +

        '</p>' +

        '<button class="btn btn-primary" onclick="copyAPAReport()">' +

        '<i class="bi bi-clipboard"></i> Copy Interpretation' +

        '</button>' +

        '</div>';

}


/*==========================================================
    BUTTON FUNCTIONS
==========================================================*/

window.loadStrongExample = function () {
    setValues(18, 2, 6, 14);
};

window.loadWeakExample = function () {
    setValues(15, 5, 13, 7);
};

window.loadZeroExample = function () {
    setValues(18, 2, 10, 10);
};

window.randomExample = function () {
    setValues(
        randomInteger(5, 25),
        randomInteger(0, 15),
        randomInteger(5, 25),
        randomInteger(0, 15)
    );
};

window.resetTable = function () {
    setValues(18, 2, 10, 10);
};

window.showAPAReport = function () {
    const output = document.getElementById("apaReport");

    if (!output) return;

    output.innerHTML =
        '<div class="alert alert-success">' +
        generateAPA() +
        '</div>';
};


/*==========================================================
    END OF FILE
==========================================================*/