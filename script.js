// ==========================================================================
// script.js - LOGIKA UI & APLIKASI
// ==========================================================================

let currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme !== 'light' && currentTheme !== 'dark') currentTheme = 'dark';
setTheme(currentTheme);

function toggleTheme() {
 currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
 setTheme(currentTheme);
}

function setTheme(themeName) {
 document.documentElement.setAttribute('data-theme', themeName);
 localStorage.setItem('theme', themeName);
 
 const btnIcon = document.getElementById('btn-theme-toggle');
 if (btnIcon) {
     if (themeName === 'light') {
         btnIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
     } else {
         btnIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/></svg>`;
     }
 }
}

let sessionStats = { totalBenar: 0, totalSalah: 0 };

const romajiMap = { 
'あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so','た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no','は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo','や':'ya','ゆ':'yu','よ':'yo',
'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'wo','ん':'n', 
'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
'だ':'da','ぢ':'ji','づ':'zu','де':'de','ど':'do','ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po', 
'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho',
'ちゃ':'cha','ちゅ':'chu','ちょ':'cho','にゃ':'nya','にゅ':'nyu','にょ':'nyo',
'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo',
'りゃ':'rya','りゅ':'ryu','りょ':'ryo', 
'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo','じゃ':'ja','じゅ':'ju','じょ':'jo',
'びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo', 
'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o','カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so','タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
'ナ':'na','ニ':'ni','ぬ':'nu','ネ':'ne','ノ':'no','ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','防':'ho',
'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo','ヤ':'ya','ユ':'yu','ヨ':'yo',
'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro','ワ':'wa','ヲ':'wo','ン':'n',
'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go','ザ':'za','ジ':'ji','ズ':'zu','ぜ':'ze','ぞ':'zo',
'ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do','バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo',
'パ':'pa','pi':'pi','プ':'pu','ペ':'pe','ポ':'po',
'キャ':'kya','キュ':'kyu','キョ':'kyo','シャ':'sha','シュ':'shu','ショ':'sho',
'チャ':'cha','チュ':'chu','チョ':'cho','ニャ':'nya','ニュ':'nyu','ニョ':'nyo',
'ヒャ':'hya','ヒュ':'hyu','ヒょ':'hyo','ミャ':'mya','ミュ':'myu','ミョ':'myo',
'リゃ':'rya','リュ':'ryu','リょ':'ryo',
'ギャ':'gya','ギュ':'gyu','ギョ':'gyo','ジャ':'ja','ジュ':'ju','ジョ':'jo',
'ビゃ':'bya','ビュ':'byu','ビョ':'byo','ピャ':'pya','ピュ':'pyu','ピョ':'po',
'ファ':'fa','フィ':'fi','フェ':'fe','フォ':'fo','ティ':'ti','トゥ':'tu',
'ディ':'di','ドゥ':'du','デュ':'dyu','ウィ':'wi','ウェ':'we','ウォ':'wo',
'チェ':'che','シェ':'she','ジェ':'je','ヴァ':'va','ヴィ':'vi','ヴ':'vu','ヴェ':'ve','ヴォ':'vo'
};

function toRomaji(kanaStr) { 
let result = ''; 
for(let i=0; i<kanaStr.length; i++) { 
    let double = kanaStr.substring(i, i+2); 
    if(romajiMap[double]) { result += romajiMap[double]; i++; } 
    else if(romajiMap[kanaStr[i]]) { result += romajiMap[kanaStr[i]]; } 
    else if(kanaStr[i] === 'っ' || kanaStr[i] === 'ッ') { if(i+1 < kanaStr.length && romajiMap[kanaStr[i+1]]) { result += romajiMap[kanaStr[i+1]][0]; } } 
    else if(kanaStr[i] === 'ー') { result += '-'; } 
    else { result += kanaStr[i]; } 
} 
return result; 
}

// GENERATOR KARTU (ANIMASI + LENGKAP)
function generateKotobaCard(item, delayIndex) {
    let mainText = item.kanji !== "-" ? item.kanji : item.hiragana;
    let subText = item.kanji !== "-" ? item.hiragana : "";
    let isSaved = checkIsSaved(item.id);
    let delay = delayIndex * 0.05; 
    
    return `
        <div class="vocab-card animate-slide-up" style="animation-delay: ${delay}s; animation-fill-mode: both;">
            <div class="vocab-jp">
                <span class="vocab-bab-badge">Bab ${item.bab} - No.${item.no}</span>
                <span class="vocab-kanji">${mainText}</span>
                ${subText ? `<span style="font-size:14px; font-weight:bold; color:var(--text-muted); margin-bottom:5px;">${subText}</span>` : ''}
                <span class="vocab-romaji">${item.romaji}</span>
            </div>
            <div class="vocab-id">
                <span class="vocab-arti">${item.arti}</span>
                <button class="save-icon-btn ${isSaved ? 'saved' : ''}" style="position:relative; top:auto; right:auto; margin-top:10px; background:transparent;" onclick="toggleSaveKotoba('${item.id}', event)">
                    <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                </button>
            </div>
        </div>`;
}

function renderSavedKotoba() {
const listDiv = document.getElementById('saved-list');
if(!listDiv) return;
listDiv.innerHTML = '';

if(savedKotoba.length === 0) {
    listDiv.innerHTML = `<div style="text-align:center; padding: 30px; color:var(--text-muted);">Belum ada kotoba yang disimpan.</div>`;
    return;
}

let html = "";
savedKotoba.forEach((item, index) => { html += generateKotobaCard(item, index); });
listDiv.innerHTML = html;
}

function filterSaved() {
let query = document.getElementById('search-saved').value.toLowerCase();
let cards = document.querySelectorAll('#saved-list .vocab-card');
cards.forEach(card => {
    let text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? 'flex' : 'none';
});
}

let appMode = 'belajar';

function setAppMode(mode) {
appMode = mode;
document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
let btnMode = document.getElementById('btn-mode-' + mode);
if(btnMode) btnMode.classList.add('active');

let homeTitle = document.getElementById('home-title');
if(homeTitle) homeTitle.innerText = mode === 'belajar' ? 'Mode Belajar' : 'Mode Ujian';

let bulkExam = document.getElementById('bulk-exam-container');
if(bulkExam) bulkExam.style.display = mode === 'ujian' ? 'block' : 'none';

switchTab('home');
}

function toggleMenu() {
document.getElementById('sidebar').classList.toggle('open');
document.getElementById('overlay').classList.toggle('show');
}

function switchTab(tabId) {
document.querySelectorAll('.container').forEach(c => {
    c.classList.remove('active');
    c.style.display = ''; 
});
document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

let targetTab = document.getElementById(tabId);
if(targetTab) { targetTab.classList.add('active'); }

if(document.getElementById('sidebar').classList.contains('open')) { toggleMenu(); }

let isHome = (tabId === 'home');
let isPreview = (tabId === 'preview');

let btnHam = document.getElementById('btn-hamburger');
if(btnHam) btnHam.style.display = (tabId === 'flashcard-app' || tabId === 'exam-run-tab' || tabId === 'saved-kotoba') ? 'none' : 'flex';

let btnBack = document.getElementById('btn-back');
if(btnBack) btnBack.style.display = (tabId === 'flashcard-app' || tabId === 'exam-run-tab' || tabId === 'saved-kotoba') ? 'flex' : 'none';

let modeToggle = document.getElementById('top-mode-toggle');
if(modeToggle) modeToggle.style.display = isHome ? 'flex' : 'none';

let topSearch = document.getElementById('btn-top-search');
if(topSearch) topSearch.style.display = (isHome || isPreview) ? 'flex' : 'none';

let fab = document.getElementById('fab-saved');
if(fab) {
    if(tabId === 'home' || tabId === 'preview') fab.style.display = 'flex';
    else fab.style.display = 'none';
}

if(tabId === 'statistik') { updateCharts(); renderHeatmap(); renderExamHistory(); }
if(tabId === 'saved-kotoba') renderSavedKotoba();
}

function openGlobalSearch() {
document.getElementById('global-search-popup').classList.add('show');
document.getElementById('global-search-input').focus();
performGlobalSearch();
}

function performGlobalSearch() {
let query = document.getElementById('global-search-input').value.toLowerCase();
const listDiv = document.getElementById('global-search-results');
if(!listDiv) return;
listDiv.innerHTML = '';

if(!query || query.length < 1) {
    listDiv.innerHTML = `<div style="text-align:center; padding: 20px; color:var(--text-muted); font-size:14px;">Ketik untuk mencari kotoba...</div>`;
    return;
}

let results = allKotobaFlat.filter(k => 
    k.arti.toLowerCase().includes(query) || 
    k.hiragana.toLowerCase().includes(query) || 
    k.romaji.toLowerCase().includes(query) || 
    k.kanji.toLowerCase().includes(query)
);

if(results.length === 0) {
    listDiv.innerHTML = `<div style="text-align:center; padding: 20px; color:var(--btn-salah); font-size:14px;">Tidak ada hasil ditemukan.</div>`;
    return;
}

let html = "";
results.slice(0, 50).forEach((item, index) => { html += generateKotobaCard(item, index); });
listDiv.innerHTML = html;
}

function updateStatistik() {
let total = 0;
Object.values(db).forEach(babArray => { total += babArray.length; });
document.getElementById('stat-total').innerText = total;
}

function initGrids() {
const fcGrid = document.getElementById('bab-grid');
const pvChapterBar = document.getElementById('pv-chapter-bar');

if(fcGrid) fcGrid.innerHTML = ''; 
if(pvChapterBar) pvChapterBar.innerHTML = ''; 

Object.keys(db).forEach(bab => {
    if(fcGrid) {
        let btnFc = document.createElement('button'); 
        btnFc.className = 'btn-bab animate-slide-up'; btnFc.innerText = bab; 
        btnFc.style.animationDelay = `${parseInt(bab)*0.02}s`;
        btnFc.onclick = () => handleBabClick(bab);
        fcGrid.appendChild(btnFc);
    }
    
    if(pvChapterBar) {
        let btnChip = document.createElement('button'); 
        btnChip.className = 'btn-chip'; btnChip.id = 'chip-bab-' + bab; btnChip.innerText = bab; 
        btnChip.onclick = () => showPreview(bab); 
        pvChapterBar.appendChild(btnChip);
    }
});

if(Object.keys(db).length > 0) showPreview(Object.keys(db)[0]);
}

function handleBabClick(bab) {
if(appMode === 'belajar') {
    openSetupPopup(bab);
} else {
    openExamSetupPopup([bab]);
}
}

function showPreview(bab) {
document.querySelectorAll('.btn-chip').forEach(b => b.classList.remove('active'));
let activeChip = document.getElementById('chip-bab-' + bab);
if(activeChip) activeChip.classList.add('active');

let pvTitle = document.getElementById('pv-title');
if(pvTitle) pvTitle.innerText = `Pelajaran ${bab}`;

let searchPv = document.getElementById('search-preview');
if(searchPv) searchPv.value = ''; 

const listDiv = document.getElementById('pv-list'); 
if(!listDiv) return;
listDiv.innerHTML = '';

if(!db[bab]) return;

let html = "";
db[bab].forEach((item, index) => { html += generateKotobaCard(item, index); });
listDiv.innerHTML = html;
}

function filterPreview() {
let searchEl = document.getElementById('search-preview');
if(!searchEl) return;
let query = searchEl.value.toLowerCase();
let cards = document.querySelectorAll('#pv-list .vocab-card');
cards.forEach(card => {
    let text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? 'flex' : 'none';
});
}

let fcCards = [];
let fcIndex = 0;
let isFcRandom = false;
let tempBab = null;
let fcSetup = { front: 'kanji', evalMode: true };

function openSetupPopup(bab) { tempBab = bab; document.getElementById('fc-setup-popup').classList.add('show'); }
function selectSetupFront(val, ev) {
fcSetup.front = val;
document.querySelectorAll('#setup-front-group .btn-select').forEach(btn => btn.classList.remove('active'));
if(ev && ev.currentTarget) ev.currentTarget.classList.add('active');
}
function selectSetupEval(val, ev) {
fcSetup.evalMode = val;
document.querySelectorAll('#setup-eval-group .btn-select').forEach(btn => btn.classList.remove('active'));
if(ev && ev.currentTarget) ev.currentTarget.classList.add('active');
}
function confirmFlashcardSetup() { document.getElementById('fc-setup-popup').classList.remove('show'); startFlashcard(tempBab); }

function toggleRandomMode() {
isFcRandom = !isFcRandom;
let btn = document.getElementById('btn-random');
btn.innerText = `Acak: ${isFcRandom ? 'ON' : 'OFF'}`;
btn.classList.toggle('active');
if (isFcRandom && fcCards.length > 0) {
    let remaining = fcCards.slice(fcIndex);
    remaining.sort(() => 0.5 - Math.random());
    fcCards.splice(fcIndex, remaining.length, ...remaining);
}
showNextCard();
}

function startFlashcard(bab) {
switchTab('flashcard-app');
if(!db[bab] || db[bab].length === 0) return;

recordActivity(); 

fcCards = [...db[bab]];
fcIndex = 0;
sessionStats.totalBenar = 0;
sessionStats.totalSalah = 0;
updateCounters();

if(isFcRandom) fcCards.sort(() => 0.5 - Math.random());

if(fcSetup.evalMode) {
    document.getElementById('fc-actions-eval').style.display = 'grid';
    document.getElementById('fc-actions-nav').style.display = 'none';
    document.getElementById('fc-counter-display').style.visibility = 'visible';
} else {
    document.getElementById('fc-actions-eval').style.display = 'none';
    document.getElementById('fc-actions-nav').style.display = 'grid';
    document.getElementById('fc-counter-display').style.visibility = 'hidden';
}

showNextCard();
}

function updateCounters() {
document.getElementById('cnt-salah').innerText = sessionStats.totalSalah;
document.getElementById('cnt-benar').innerText = sessionStats.totalBenar;
}

function showNextCard() {
updateCounters();
document.getElementById('card').classList.remove('flipped');

let currentCard = fcCards[fcIndex];
document.getElementById('status-msg').innerText = `Kartu Ke-${fcIndex + 1} dari ${fcCards.length} (Bab ${currentCard.bab} - No.${currentCard.no})`;

let mainTxt, subTxt, romTxt, artiTxt;

if (fcSetup.front === 'kanji') {
    mainTxt = currentCard.kanji !== "-" ? currentCard.kanji : currentCard.hiragana;
    subTxt = currentCard.kanji !== "-" ? currentCard.hiragana : "";
    romTxt = currentCard.romaji;
    artiTxt = currentCard.arti;
} else if (fcSetup.front === 'hiragana') {
    mainTxt = currentCard.hiragana;
    subTxt = currentCard.kanji !== "-" ? currentCard.kanji : "";
    romTxt = currentCard.romaji;
    artiTxt = currentCard.arti;
} else if (fcSetup.front === 'arti') {
    mainTxt = currentCard.arti;
    subTxt = "";
    artiTxt = currentCard.kanji !== "-" ? `${currentCard.kanji} (${currentCard.hiragana})` : currentCard.hiragana;
    romTxt = currentCard.romaji;
}

let frontEl = document.getElementById('fc-front');
frontEl.innerText = mainTxt;

frontEl.classList.remove('fc-text-normal', 'fc-text-medium', 'fc-text-long', 'fc-text-xlong');
let txtLen = mainTxt.length;
if (txtLen > 18) frontEl.classList.add('fc-text-xlong');
else if (txtLen > 10) frontEl.classList.add('fc-text-long');
else if (txtLen > 5) frontEl.classList.add('fc-text-medium');
else frontEl.classList.add('fc-text-normal');

document.getElementById('fc-furi').innerText = subTxt;
document.getElementById('fc-romaji').innerText = romTxt;
document.getElementById('fc-arti').innerText = artiTxt;

updateFcSaveButton();
}

function flipCard() { if(fcCards.length > 0) document.getElementById('card').classList.toggle('flipped'); }

function toggleSaveFromFC(event) {
    event.stopPropagation();
    if (fcCards.length > 0) {
        let currentCard = fcCards[fcIndex];
        toggleSaveKotoba(currentCard.id, event);
        updateFcSaveButton();
    }
}

function updateFcSaveButton() {
    if (fcCards.length === 0) return;
    let isSaved = checkIsSaved(fcCards[fcIndex].id);
    let btnF = document.getElementById('fc-save-btn-front');
    let btnB = document.getElementById('fc-save-btn-back');
    if (btnF) isSaved ? btnF.classList.add('saved') : btnF.classList.remove('saved');
    if (btnB) isSaved ? btnB.classList.add('saved') : btnB.classList.remove('saved');
}

function markCard(isCorrect) {
    if (isCorrect) sessionStats.totalBenar++;
    else sessionStats.totalSalah++;

    let globalRet = JSON.parse(localStorage.getItem('kn5_retention')) || { benar: 0, salah: 0 };
    if (isCorrect) globalRet.benar++;
    else globalRet.salah++;
    localStorage.setItem('kn5_retention', JSON.stringify(globalRet));

    fcIndex++;
    if (fcIndex >= fcCards.length) {
        fcIndex = 0;
        if (isFcRandom) fcCards.sort(() => 0.5 - Math.random());
    }
    showNextCard();
}

function navCard(direction) {
fcIndex += direction;
if (fcIndex >= fcCards.length) {
    fcIndex = 0;
    if (isFcRandom) fcCards.sort(() => 0.5 - Math.random());
} else if (fcIndex < 0) {
    fcIndex = fcCards.length - 1;
}
showNextCard();
}

let examQuestions = []; let currentQIndex = 0; let score = 0; let currentExamPool = []; let timerInterval; let timeExamStarted = 0;
let tempSelectedExamBabs = [];

function openBulkExamPopup() {
let container = document.getElementById('bulk-exam-list');
container.innerHTML = '';
Object.keys(db).forEach(bab => {
    container.innerHTML += `<label style="display:flex; gap:10px; padding:10px; border:1px solid var(--border); margin-bottom:5px; border-radius:8px; cursor:pointer; align-items:center;"><input type="checkbox" value="${bab}" class="bulk-cb" style="accent-color:var(--accent); width:18px; height:18px;"> Bab ${bab}</label>`;
});
document.getElementById('bulk-exam-popup').classList.add('show');
}

function startBulkExam() {
let selected = Array.from(document.querySelectorAll('.bulk-cb:checked')).map(cb => cb.value);
if(selected.length === 0) return alert("Pilih minimal 1 bab!");
document.getElementById('bulk-exam-popup').classList.remove('show');
openExamSetupPopup(selected);
}

function openExamSetupPopup(babsArr) {
tempSelectedExamBabs = babsArr;
let pool = [];
babsArr.forEach(b => { if(db[b]) pool = pool.concat(db[b]); });

let maxAvailable = pool.length;
let inputSoal = document.getElementById('exam-jumlah-soal');
inputSoal.max = maxAvailable;
if(parseInt(inputSoal.value) > maxAvailable) inputSoal.value = maxAvailable;
document.getElementById('max-soal-hint').innerText = `Maksimal soal tersedia: ${maxAvailable}`;

document.getElementById('exam-setup-popup').classList.add('show');
}

function confirmStartExam() {
document.getElementById('exam-setup-popup').classList.remove('show');

recordActivity(); 

currentExamPool = [];
tempSelectedExamBabs.forEach(b => { if(db[b]) currentExamPool = currentExamPool.concat(db[b]); });

let reqCount = parseInt(document.getElementById('exam-jumlah-soal').value); 
let finalCount = Math.min(reqCount, currentExamPool.length);
if(currentExamPool.length < 4) return alert("Kosakata belum mencukupi untuk membuat soal.");

examQuestions = currentExamPool.sort(() => 0.5 - Math.random()).slice(0, finalCount); 
currentQIndex = 0; score = 0; timeExamStarted = Date.now();

switchTab('exam-run-tab');
document.getElementById('exam-run').style.display = 'block'; 
document.getElementById('exam-result').style.display = 'none'; 
document.getElementById('btn-next-q').style.display = 'none';

clearInterval(timerInterval); 
let timerMin = parseFloat(document.getElementById('exam-timer-input').value); 
let timerDisplay = document.getElementById('exam-timer-display');

if(timerMin && timerMin > 0) {
    let seconds = Math.floor(timerMin * 60); timerDisplay.style.display = 'inline';
    timerInterval = setInterval(() => { 
        seconds--; let m = Math.floor(seconds / 60); let s = seconds % 60; 
        timerDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`; 
        if(seconds <= 0) { clearInterval(timerInterval); alert("Waktu Ujian Habis!"); finishExam(); } 
    }, 1000);
} else {
    timerDisplay.style.display = 'none';
}
loadQuestion();
}

function loadQuestion() {
if (currentQIndex >= examQuestions.length) return finishExam();
let dir = document.getElementById('exam-direction').value; let diff = document.getElementById('exam-difficulty').value; let q = examQuestions[currentQIndex];
let isJpToId = dir === 'jp-id' || (dir === 'random' && Math.random() > 0.5);

document.getElementById('exam-progress').innerText = `Soal: ${currentQIndex + 1} / ${examQuestions.length}`; 
document.getElementById('exam-score').innerText = `Skor: ${score}`;

let questionText = isJpToId ? (q.kanji !== "-" ? q.kanji : q.hiragana) : q.arti;
let correctAnswer = isJpToId ? q.arti : `${q.kanji !== "-" ? q.kanji + " " : ""}(${q.hiragana})`;

document.getElementById('mc-q').innerText = questionText;

let wrongOptions = currentExamPool.filter(item => item.id !== q.id).sort(() => 0.5 - Math.random());
let optionCount = diff === 'easy' ? 2 : (diff === 'hard' ? 4 : 3); wrongOptions = wrongOptions.slice(0, optionCount - 1);

let options = [{ text: correctAnswer, isCorrect: true }];
wrongOptions.forEach(wo => options.push({ text: isJpToId ? wo.arti : `${wo.kanji !== "-" ? wo.kanji + " " : ""}(${wo.hiragana})`, isCorrect: false }));
options.sort(() => 0.5 - Math.random()); 

let optsDiv = document.getElementById('mc-opts'); optsDiv.innerHTML = '';
options.forEach(opt => { 
    let btn = document.createElement('button'); btn.className = 'mc-btn'; btn.innerText = opt.text; 
    btn.onclick = () => handleAnswer(btn, opt.isCorrect); optsDiv.appendChild(btn); 
});
}

function handleAnswer(btn, isCorrect) {
let buttons = document.querySelectorAll('.mc-btn'); buttons.forEach(b => b.style.pointerEvents = 'none'); 
let showAnswer = document.getElementById('exam-show-answer').checked;

if (isCorrect) { 
    btn.classList.add('correct'); score++; 
    document.getElementById('exam-score').innerText = `Skor: ${score}`; 
} else { 
    btn.classList.add('wrong'); 
    if (showAnswer) { 
        buttons.forEach(b => { 
            let q = examQuestions[currentQIndex]; 
            if(b.innerText.includes(q.arti) || b.innerText.includes(q.hiragana)) b.classList.add('correct-reveal'); 
        }); 
    } 
}
document.getElementById('btn-next-q').style.display = 'block';
}

function nextExamQuestion() { document.getElementById('btn-next-q').style.display = 'none'; currentQIndex++; loadQuestion(); }

function finishExam() {
clearInterval(timerInterval); 
let timeExamEnded = Date.now(); 
let timeDiff = Math.floor((timeExamEnded - timeExamStarted) / 1000); 
let m = Math.floor(timeDiff / 60); let s = timeDiff % 60;
let timeStr = `${m}m ${s}s`;

document.getElementById('exam-run').style.display = 'none'; 
document.getElementById('exam-result').style.display = 'block';
document.getElementById('res-score').innerText = score; 
document.getElementById('res-time').innerText = timeStr; 
document.getElementById('res-total').innerText = examQuestions.length;

saveExamHistory(score, examQuestions.length, timeStr);
}

function abortExam() { if(confirm("Yakin ingin mengakhiri ujian ini?")) finishExam(); }
function goHomeFromExam() { switchTab('home'); }

let chartRetrievabilityInstance;
function updateCharts() {
    if(chartRetrievabilityInstance) chartRetrievabilityInstance.destroy();
    const ctx2 = document.getElementById('chartRetrievability').getContext('2d');
    
    let globalRet = JSON.parse(localStorage.getItem('kn5_retention')) || { benar: 0, salah: 0 };
    
    if(ctx2) {
        chartRetrievabilityInstance = new Chart(ctx2, {
            type: 'bar', 
            data: { 
                labels: ['Benar', 'Salah'], 
                datasets: [{ 
                    label: 'Total Jawaban', 
                    data: [globalRet.benar, globalRet.salah], 
                    backgroundColor: ['#059669', '#e11d48'], 
                    borderRadius: 4 
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } }, 
                scales: { y: { ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } } 
            }
        });
    }
}

function renderHeatmap() {
   const heatmapDiv = document.getElementById('github-heatmap');
   if(!heatmapDiv) return;
   heatmapDiv.innerHTML = '';
   
   let today = new Date();
   // Render 30 hari terakhir
   for(let i = 29; i >= 0; i--) {
       let d = new Date(today);
       d.setDate(d.getDate() - i);
       let dateStr = d.toISOString().split('T')[0];
       let count = userActivity[dateStr] || 0;
       
       let level = 0;
       if(count > 0 && count <= 2) level = 1;
       else if(count > 2 && count <= 5) level = 2;
       else if(count > 5) level = 3;
       
       heatmapDiv.innerHTML += `<div class="heatmap-cell level-${level}" title="${d.toLocaleDateString('id-ID')} : ${count} Aktivitas"></div>`;
   }
}

function renderExamHistory() {
   const histDiv = document.getElementById('exam-history-list');
   if(!histDiv) return;
   histDiv.innerHTML = '';
   
   if(examHistory.length === 0){
       histDiv.innerHTML = '<div style="color:var(--text-muted); font-size:13px; text-align:center;">Belum ada histori ujian.</div>';
       return;
   }
   
   examHistory.forEach((h) => {
       let percentage = Math.round((h.score / h.total) * 100);
       let color = percentage >= 75 ? 'var(--btn-benar)' : (percentage >= 50 ? '#f59e0b' : 'var(--btn-salah)');
       histDiv.innerHTML += `
       <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border);">
           <div><div style="font-weight:bold; font-size:14px;">Ujian Ke-${h.no}</div><div style="font-size:12px; color:var(--text-muted);">${h.date} | ⏱ ${h.time}</div></div>
           <div style="text-align:right;"><div style="font-weight:bold; color:${color};">${h.score}/${h.total}</div><div style="font-size:12px; color:var(--text-muted);">${percentage}%</div></div>
       </div>`;
   });
}

function exportStatsPDF() {
   document.body.classList.add('pdf-export-mode');
   document.getElementById('btn-export-pdf').style.display = 'none';
   
   const element = document.getElementById('stats-content');
   const opt = { margin: 15, filename: 'KN5_Data_Statistik_Belajar.pdf', image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
   
   html2pdf().set(opt).from(element).save().then(() => {
       document.body.classList.remove('pdf-export-mode');
       document.getElementById('btn-export-pdf').style.display = 'block';
   });
}

function copyRekening() {
  navigator.clipboard.writeText("107397547525").then(() => { alert("Nomor Rekening Jago berhasil disalin!"); });
}

// Tutup window popup saat area luar diklik
document.querySelectorAll('.popup-overlay').forEach(popup => {
   popup.addEventListener('click', function(e) {
       if (e.target === this) {
           this.classList.remove('show');
       }
   });
});

if ('serviceWorker' in navigator) {
 navigator.serviceWorker.getRegistrations().then(function(registrations) {
     for(let registration of registrations) { registration.unregister(); }
 });
}

// Mulai
loadData();