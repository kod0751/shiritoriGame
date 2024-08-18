const API_KEY = 'C7B5380B9591BBFD8F2C28E6B67A2FDC';

const wordInput = document.querySelector('.wordInput');
const curWord = document.getElementById('curWord');
const searchBtn = document.getElementById('searchBtn');
const heart = document.getElementById('heart');
const modal = document.getElementById('modal');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const closeBtn = document.getElementById('closeBtn');
const highScore = document.getElementById('highScore');
const curScore = document.getElementById('curScore');
const score = document.getElementById('score');
const line = document.getElementById('line');

let falseCount = 2;
let currentScore = 100;
let timer;

const scoreData = JSON.parse(localStorage.getItem('scores')) || [];
const high = localStorage.getItem('scores') || [];

const setting = () => {
  const defaultWord = ['가마', '나비', '다과', '라면', '마차', '바지', '사자'];
  const randomIndex = Math.floor(Math.random() * defaultWord.length);
  curWord.innerText = `현재단어: ${defaultWord[randomIndex]}`;
  scoreCal();
};

const scoreCal = () => {
  score.innerText = `점수: ${currentScore}`;
  curScore.innerText = `점수: ${currentScore}`;
};

const startTimer = () => {
  clearInterval(timer);
  line.style.width = '100%';

  // 10초 동안 line의 width를 100%에서 0%로 애니메이션
  const startTime = Date.now();
  timer = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    let percentage = 100 - (elapsedTime / 10000) * 100;

    if (percentage <= 0) {
      clearInterval(timer);
      line.style.width = '0%';
      heart.children[falseCount].style.display = 'none';
      falseCount--;
      currentScore -= 10;
      scoreCal();
      startTimer();
      if (falseCount == -1) {
        modal.style.display = 'flex';
        const resultScore = currentScore;
        scoreData.push(resultScore);
        localStorage.setItem('scores', JSON.stringify(scoreData));
        highScore.innerText = `최고점수: ${Math.max(
          ...JSON.parse(localStorage.getItem('scores'))
        )}`;
      }
    } else {
      line.style.width = percentage + '%';
    }
  }, 50);
};

const wordTest = async () => {
  const query = wordInput.value;
  const url = `http://localhost:3000/api/dictionary?q=${query}&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (
      data.channel &&
      curWord.innerText.charAt(curWord.innerText.length - 1) == query.charAt(0)
    ) {
      curWord.textContent = `현재단어: ${query}`;
      currentScore += 10;
      scoreCal();
    } else {
      heart.children[falseCount].style.display = 'none';
      falseCount--;
      currentScore -= 10;
      scoreCal();
      if (falseCount == -1) {
        modal.style.display = 'flex';
        const resultScore = currentScore;
        scoreData.push(resultScore);
        localStorage.setItem('scores', JSON.stringify(scoreData));
        highScore.innerText = `최고점수: ${Math.max(
          ...JSON.parse(localStorage.getItem('scores'))
        )}`;
      }
    }
  } catch {
    curWord.textContent = 'error';
  }
};

startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  startTimer();
});

searchBtn.addEventListener('click', async () => {
  wordTest();
  startTimer();
});

closeBtn.addEventListener('click', () => {
  location.reload();
});

setting();
