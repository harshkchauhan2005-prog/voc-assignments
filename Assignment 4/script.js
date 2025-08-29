(() => {
 
  const LIB = {
    emoji: ["🍎","🍌","🍓","🍇","🍉","🍒","🍍","🥝","🥑","🥕","🌶️","🍄","🍔","🍕","🍟","🌭","🍿","🧁","🍪","🍩","🍰","🍫","🍬","🍭","☕","🍵","🥤","🍺","🍷","🥨","🥐","🥞","🧇","🍗","🍤","🍣","🍱"],
    shapes: ["★","◆","●","▲","■","✦","✿","☘","✺","✚","☀","☁","☂","♠","♥","♦","♣","☯","∞","⚑","✈","⌘","⌂","☾","✤","✧","❖","❀","✪","✩","✷","✚","✕","➤","➕","◉","◍"],
    animals:["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦉","🦄","🐝","🦋","🐢","🐙","🦑","🐠","🐳","🦖","🐍","🦓","🦒","🦘","🦥","🐇","🐿","🦊"],
    food:   ["🍕","🍔","🌮","🌯","🍣","🍜","🍙","🍛","🥗","🍞","🧀","🥪","🍰","🍦","🍪","🍩","🍫","🍓","🍇","🍉","🍋","🍑","🍒","🍍","🥝","🥑","🍗","🥟","🥞","🧇","🍝","🍱","🍤","🍲","🍢","🍧"]
  };

  const boardEl = document.getElementById('board');
  const timeEl  = document.getElementById('time');
  const movesEl = document.getElementById('moves');
  const starsEl = document.getElementById('stars');
  const toastEl = document.getElementById('toast');

  const diffSel = document.getElementById('difficulty');
  const setSel  = document.getElementById('symbolSet');
  const newBtn  = document.getElementById('newGame');
  const resetBestBtn = document.getElementById('resetBest');
  const kbdToggle = document.getElementById('kbdToggle');

  const modal = document.getElementById('winModal');
  const playAgainBtn = document.getElementById('playAgain');
  const closeModalBtn = document.getElementById('closeModal');
  const winTimeEl = document.getElementById('winTime');
  const winMovesEl = document.getElementById('winMoves');
  const winStarsEl = document.getElementById('winStars');
  const bestTimeEl = document.getElementById('bestTime');
  const bestMovesEl = document.getElementById('bestMoves');

  let difficulty = diffSel.value; 
  let symbolSet = setSel.value;
  let deck = [];          
  let first = null;      
  let lock = false;      
  let moves = 0;
  let matches = 0;
  let totalPairs = 0;

  let timer = { running:false, startTs:0, elapse:0, id:null };
  let kbdMode = false;

  const fmtTime = (ms) => {
    const s = Math.floor(ms/1000);
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${mm}:${ss}`;
  };
  const shuffle = (arr) => {
    for(let i=arr.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const showToast = (msg, ms=1800) => {
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=> toastEl.style.display='none', ms);
  };


  function renderStars(n){ starsEl.textContent = "★".repeat(n); }
function resetTimer(){ timeEl.textContent = "00:00"; }
function renderBest(){ bestTimeEl.textContent = "Time —"; bestMovesEl.textContent = "Moves —"; }
function startTimer(){ timer.running=true; }
function stopTimer(){ timer.running=false; }
function computeStars(){ return 3; }
function saveBest(){ }
function bestKey(){ return "best"; }
function focusIndex(){ }

//   Rating soon
// renderStars(3);
// renderBest();
// renderStars(stars);

// best score soon
// const stars = computeStars(moves, timer.elapse, totalPairs);

// saveBest(timer.elapse, moves);
// renderBest();
 
// time soon
// resetTimer();
// // stopTimer();

 function pairsByDifficulty(d){
    if (d==='easy') return 8;     // 4x4
    if (d==='medium') return 10;  // 5x4
    return 12;                    // hard 6x4
  }
  function gridClass(d){
    if (d==='easy') return 'grid-4x4';
    if (d==='medium') return 'grid-5x4';
    return 'grid-6x4';
  }

  function buildDeck(pairs, set){
    const pool = LIB[set].slice();
    shuffle(pool);
    const chosen = pool.slice(0, pairs);
    const doubled = chosen.flatMap((sym, idx) => ([
      { id:`${idx}-A`, symbol: sym, matched:false },
      { id:`${idx}-B`, symbol: sym, matched:false },
    ]));
    return shuffle(doubled);
  }

  function renderBoard(){
    boardEl.className = `board ${gridClass(difficulty)}`;
    boardEl.innerHTML = '';
    deck.forEach((card, idx) => {
      const cell = document.createElement('button');
      cell.className = 'card';
      cell.setAttribute('role','gridcell');
      cell.setAttribute('data-id', card.id);
      cell.setAttribute('data-idx', idx);
      cell.setAttribute('aria-label','Face down card');
      cell.tabIndex = 0;

      const inner = document.createElement('div');
      inner.className = 'card-inner';

      const back = document.createElement('div');
      back.className = 'face back';
      back.textContent = '❓';

      const front = document.createElement('div');
      front.className = 'face front';
      front.textContent = card.symbol;

      inner.appendChild(back);
      inner.appendChild(front);
      cell.appendChild(inner);
      boardEl.appendChild(cell);
    });
  }


   function newGame(){
    difficulty = diffSel.value;
    symbolSet = setSel.value;
    first = null; lock = false; moves = 0; matches = 0;
    totalPairs = pairsByDifficulty(difficulty);
    deck = buildDeck(totalPairs, symbolSet);
    renderBoard();
    movesEl.textContent = '0';
    renderStars(3);
    resetTimer();
    renderBest();
    if (kbdMode) focusIndex(0);
    showToast('New game ready. Good luck!', 1200);
  }

  function flip(el){
    el.classList.add('flipped');
    el.setAttribute('aria-label','Face up card');
  }
  function unflip(a,b){
    a.classList.remove('flipped');
    b.classList.remove('flipped');
    a.setAttribute('aria-label','Face down card');
    b.setAttribute('aria-label','Face down card');
  }
  function markMatched(a,b){
    a.classList.add('matched');
    b.classList.add('matched');
    a.setAttribute('aria-label','Matched card');
    b.setAttribute('aria-label','Matched card');
  }

  function onCardActivate(target){
    if (!(target && target.classList.contains('card'))) return;
    if (lock) return;
    if (target.classList.contains('flipped') || target.classList.contains('matched')) return;

    // start the timer on first action
    if (!timer.running && moves===0 && matches===0) startTimer();

    flip(target);
    if (!first){
      first = target;
      return;
    }

    // second c

     const aIdx = +first.getAttribute('data-idx');
    const bIdx = +target.getAttribute('data-idx');
    moves++; movesEl.textContent = String(moves);

    const a = deck[aIdx], b = deck[bIdx];
    if (a.symbol === b.symbol){
      // Match!
      deck[aIdx].matched = deck[bIdx].matched = true;
      markMatched(first, target);
      matches++;
      first = null;

      // win check
      if (matches === totalPairs){
        stopTimer();
        const stars = computeStars(moves, timer.elapse, totalPairs);
        renderStars(stars);
        winTimeEl.textContent = fmtTime(timer.elapse);
        winMovesEl.textContent = String(moves);
        winStarsEl.textContent = Array.from({length:3}, (_,i)=> i<stars?'★':'☆').join('');
        saveBest(timer.elapse, moves);
        renderBest();
        setTimeout(()=> modal.classList.add('open'), 350);
      }
    } else {
      // Not a match — brief lock + flip back
      lock = true;
      const prev = first;
      first = null;
      setTimeout(()=>{
        unflip(prev, target);
        lock = false;
      }, 650);
    }

    // update star rating live
    const liveStars = computeStars(moves, timer.elapse, totalPairs);
    renderStars(liveStars);
  }
//   key board soon



boardEl.addEventListener('click', (e)=> {
    const target = e.target.closest('.card');
    onCardActivate(target);
  });
  newBtn.addEventListener('click', newGame);
  resetBestBtn.addEventListener('click', ()=>{
    localStorage.removeItem(bestKey());
    renderBest();
    showToast('Best scores cleared for this difficulty.');
  });
  diffSel.addEventListener('change', newGame);
  setSel.addEventListener('change', newGame);
  kbdToggle.addEventListener('change', (e)=> {
    kbdMode = e.target.checked;
    if (kbdMode) focusIndex(0);
  });

  playAgainBtn.addEventListener('click', ()=>{ modal.classList.remove('open'); newGame(); });
  closeModalBtn.addEventListener('click', ()=> modal.classList.remove('open'));
  modal.addEventListener('click', (e)=>{ if (e.target===modal) modal.classList.remove('open'); });

 
  newGame();

})();






