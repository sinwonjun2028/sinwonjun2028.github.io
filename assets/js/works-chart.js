function countChar(text, target) {
    let count = 0;
    for (const ch of text) {
        if (ch === target) {
            count++;
        }
    }
    return count;
}

const targets = ["이", "의", "는", "가", "을"];
let barChart = null;
let pieChart = null;

const btnBox = document.querySelector("#work-buttons");
const nowBox = document.querySelector("#now-showing");

fetch("/data/works.json")
    .then(response => response.json())
    .then(works => {
        for (const work of works) {
            const btn = document.createElement("button");
            btn.textContent = work.title;
            btn.addEventListener("click", () => analyze(work));
            btnBox.appendChild(btn);
        }
    });

function analyze(work) {
    fetch(work.file)
        .then(response => response.text())
        .then(text => {
            nowBox.textContent = `<${work.title}> 분석 결과`;
            const counts = targets.map(t => countChar(text, t));
            drawBar(counts);
            drawPie(counts);
        })
}

function drawBar(counts) {
    if (barChart !== null) barChart.destroy();

    const canvas = document.querySelector("#bar-chart");
    new Chart(canvas, {
        type: "bar",
        data: {
            labels: targets,
            datasets: [{
                label: "빈도",
                data: counts,
            }],
        },
        options: {scales: {y: {beginAtZero: true}}},
    });
}

function drawPie(counts) {
    if (pieChart !== null) pieChart.destroy();

    const canvas = document.querySelector("#pie-chart");
    new Chart(canvas, {
        type: "pie",
        data: {
            labels: targets,
            datasets: [{
                label: "빈도",
                data: counts,
            }],
        },
        options: {scales: {y: {beginAtZero: true}}},
    });
}
