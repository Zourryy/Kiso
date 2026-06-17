// ==========================================================================
// localdb.js - LOGIKA DATABASE & STORAGE
// ==========================================================================

let db = {};
let allKotobaFlat = [];
let savedKotoba = JSON.parse(localStorage.getItem('kn5_saved')) || [];
let userActivity = JSON.parse(localStorage.getItem('kn5_activity')) || {};
let examHistory = JSON.parse(localStorage.getItem('kn5_exam_history')) || [];

// Fungsi rekam aktivitas harian (Streak Github)
function recordActivity() {
    let today = new Date().toISOString().split('T')[0];
    if (!userActivity[today]) userActivity[today] = 0;
    userActivity[today]++;
    localStorage.setItem('kn5_activity', JSON.stringify(userActivity));
}

// Fungsi simpan histori ujian
function saveExamHistory(score, total, timeStr) {
    let today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    let examNumber = examHistory.length + 1;
    examHistory.unshift({ no: examNumber, date: today, score: score, total: total, time: timeStr });
    if(examHistory.length > 20) examHistory.pop(); // Simpan max 20 ujian terakhir
    localStorage.setItem('kn5_exam_history', JSON.stringify(examHistory));
}

async function loadData() {
    try {
        const response = await fetch('kosakata_bab1_25_lengkap.txt');
        if(!response.ok) throw new Error("File txt tidak ditemukan.");
        const text = await response.text();
        parseData(text);
        
        if(Object.keys(db).length === 0) throw new Error("File kosong / Format salah");
        
        document.getElementById('loader').style.display = 'none';
        updateStatistik();
        initGrids();
        renderSavedKotoba();
        renderHeatmap();
        renderExamHistory();
        
        switchTab('home');
        
    } catch (err) {
        const errDiv = document.getElementById('loader-error');
        if (errDiv) {
            errDiv.style.display = 'block';
            errDiv.innerHTML = `Gagal sinkron file TXT.<br><span style="font-size:12px; font-weight:normal; color:var(--text-muted);">(Info: ${err.message}. Harap jalankan index.html menggunakan Local Server).</span>`;
        }
        renderSavedKotoba();
    }
}

function parseData(text) {
    const lines = text.split('\n'); 
    let currentBab = 0;
    let indexUrutan = 1;
    allKotobaFlat = [];
    
    lines.forEach(line => {
        line = line.trim(); 
        if(!line) return;
        if (line.toLowerCase().startsWith('pelajaran')) {
            currentBab = parseInt(line.replace(/\D/g, '')); 
            db[currentBab] = [];
            indexUrutan = 1; // Reset urutan tiap ganti bab
        } else if (line.includes(' : ') && currentBab !== 0) {
            let parts = line.split(' : '); 
            let jepang = parts[0].trim(); 
            let arti = parts[1].trim();
            let kanji = "-"; 
            let hiragana = jepang;
            let match = jepang.match(/(.+?)\s*\((.+?)\)/);
            if(match) { kanji = match[1].trim(); hiragana = match[2].trim(); }
            
            // Buat ID Unik untuk fix bug save (Bab_Urutan)
            let uniqueId = `B${currentBab}_${indexUrutan}`;
            
            let wordObj = { id: uniqueId, bab: currentBab, no: indexUrutan, kanji: kanji, hiragana: hiragana, romaji: toRomaji(hiragana), arti: arti };
            db[currentBab].push(wordObj);
            allKotobaFlat.push(wordObj);
            indexUrutan++;
        }
    });
}

function toggleSaveKotoba(id, event) {
    if(event) event.stopPropagation();
    
    let obj = allKotobaFlat.find(k => k.id === id);
    if(!obj) return;

    let index = savedKotoba.findIndex(k => k.id === id);
    
    if(index === -1) {
        savedKotoba.push(obj);
        if(event && event.currentTarget) event.currentTarget.classList.add('saved');
    } else {
        savedKotoba.splice(index, 1);
        if(event && event.currentTarget) event.currentTarget.classList.remove('saved');
    }
    localStorage.setItem('kn5_saved', JSON.stringify(savedKotoba));
    
    // Auto refresh jika sedang di tab saved
    if(document.getElementById('saved-kotoba').classList.contains('active')){
        renderSavedKotoba();
    }
}

function checkIsSaved(id) {
    return savedKotoba.some(k => k.id === id);
}
