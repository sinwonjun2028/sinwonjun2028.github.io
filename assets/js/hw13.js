// [숙제13] 텍스트 분석 도구 구현
// 신원준

// --- 함수 정의들 (21강 코드 재사용) ---

function extractBody(text) {
  const startMark = "*** START OF THE PROJECT GUTENBERG EBOOK";
  const endMark = "*** END OF THE PROJECT GUTENBERG EBOOK";

  const startIdx = text.indexOf(startMark);
  const endIdx = text.indexOf(endMark);

  return text.slice(startIdx, endIdx);
}

function getWords(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"“”‘’()\[\]_*—-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function countWords(words) {
  const counts = {};

  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }

  return counts;
}

function removeStopwords(words, stopwords) {
  return words.filter(w => !stopwords.includes(w));
}

function topN(counts, n) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

function drawChart(selector, top, color) {
  const canvas = document.querySelector(selector);

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: top.map(item => item[0]),
      datasets: [{
        label: "빈도",
        data: top.map(item => item[1]),
        backgroundColor: color
      }]
    },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          ticks: {
            autoSkip: false
          }
        }
      }
    }
  });
}

function analyze(text, stopwords) {
  const body = extractBody(text);
  const words = getWords(body);
  const cleaned = removeStopwords(words, stopwords);
  const counts = countWords(cleaned);

  return topN(counts, 30);
}

// --- 메인: 네 파일을 동시에 fetch ---

Promise.all([
  fetch("/data/frankenstein.txt").then(r => r.text()),
  fetch("/data/dracula.txt").then(r => r.text()),
  fetch("/data/stopwords-en.txt").then(r => r.text()),
  fetch("/data/stopwords-custom.txt").then(r => r.text())
]).then(([frankText, dracText, baseStop, customStop]) => {
  const stopwords = (baseStop + "\n" + customStop)
    .split(/\s+/)
    .filter(w => w.length > 0);

  const frankTop = analyze(frankText, stopwords);
  const dracTop = analyze(dracText, stopwords);

  drawChart("#chart-frankenstein", frankTop, "rgba(40, 167, 69, 0.6)");
  drawChart("#chart-dracula", dracTop, "rgba(220, 53, 69, 0.6)");
});