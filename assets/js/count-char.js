const text = "이상의 <날개>는 1936년에 발표된 단편소설이다.";
const targets = ["이", "의", "날", "개", "소"];

function countChar(text, target) {
    let count = 0;
    for (const ch of text) {
        if (ch === target) {
            count++;
        }
    }
    return count;
}

counts = targets.map(ch => countChar(text, ch));

for (let i = 0; i < targets.length; i++) {
    console.log(`'${targets[i]}': ${counts[i]}번`);
}



let maxIdx = 0;
for (let i = 1; i < targets.length; i++) {
    if (counts[i] > counts[maxIdx]) {
        maxIdx = i;
    }
}
const topTarget = targets[maxIdx];
console.log(`가장 자주 나온 글자: '${topTarget}' (${counts[maxIdx]}번)`);
