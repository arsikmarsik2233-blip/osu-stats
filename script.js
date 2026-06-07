document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statsBlock = document.getElementById('statsBlock');
    const loadingEl = document.getElementById('loading');
    const statsContent = document.getElementById('statsContent');

    const userId = "38574892";
    // Исправленный адрес шлюза с обязательным указанием режима mode=osu под требования 2026 года
    const apiUrl = `https://vercel.app{userId}?mode=osu`;

    async function fetchOsuStats() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Основной шлюз перегружен');
            
            const userData = await response.json();
            
            if (userData) {
                document.getElementById('username').textContent = userData.username || "Statixcx";
                
                const rank = userData.global_rank || userData.rank;
                document.getElementById('globalRank').textContent = rank ? `#${parseInt(rank).toLocaleString()}` : 'Без ранга';
                
                const acc = userData.accuracy || userData.hit_accuracy;
                document.getElementById('accuracy').textContent = acc ? `${parseFloat(acc).toFixed(2)}%` : '--%';
                
                const pc = userData.play_count || userData.playcount;
                document.getElementById('playcount').textContent = pc ? parseInt(pc).toLocaleString() : '--';
                
                const ppVal = userData.pp;
                document.getElementById('pp').textContent = ppVal ? `${Math.round(parseFloat(ppVal)).toLocaleString()} pp` : '-- pp';
                
                const lvl = userData.level;
                document.getElementById('level').textContent = lvl ? Math.floor(parseFloat(lvl)) : '--';

                loadingEl.style.display = 'none';
                statsContent.style.display = 'block';
            }
        } catch (error) {
            console.warn("Сбой прямого шлюза. Активация резервного метода...", error);
            fetchBackupStats();
        }
    }

    // Резервный метод парсинга через CORS-прокси на случай перегрузки основного API
    async function fetchBackupStats() {
        try {
            const backupUrl = `https://allorigins.win{encodeURIComponent('https://ppy.sh' + userId)}`;
            const res = await fetch(backupUrl);
            const json = await res.json();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(json.contents, 'text/html');
            const jsonScript = doc.getElementById('json-user');
            
            if (jsonScript) {
                const backupData = JSON.parse(jsonScript.textContent);
                
                document.getElementById('username').textContent = backupData.username;
                document.getElementById('globalRank').textContent = backupData.statistics.global_rank ? `#${backupData.statistics.global_rank.toLocaleString()}` : 'Без ранга';
                document.getElementById('accuracy').textContent = `${backupData.statistics.hit_accuracy.toFixed(2)}%`;
                document.getElementById('playcount').textContent = backupData.statistics.play_count.toLocaleString();
                document.getElementById('pp').textContent = `${Math.round(backupData.statistics.pp).toLocaleString()} pp`;
                document.getElementById('level').textContent = `${backupData.statistics.level.current}`;

                loadingEl.style.display = 'none';
                statsContent.style.display = 'block';
            }
        } catch (fallbackError) {
            console.error("Браузер блокирует локальный CORS запрос.", fallbackError);
            loadingEl.textContent = "Синхронизация задерживается...";
        }
    }

    toggleBtn.addEventListener('click', () => {
        statsBlock.classList.toggle('show');

        if (statsBlock.classList.contains('show')) {
            toggleBtn.textContent = 'Скрыть статистику';
            fetchOsuStats(); 
        } else {
            toggleBtn.textContent = 'Показать статистику';
        }
    });

    // Обновление каждые 15 секунд при открытом виджете
    setInterval(() => {
        if (statsBlock.classList.contains('show')) {
            fetchOsuStats();
        }
    }, 15000);
});
