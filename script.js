document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statsBlock = document.getElementById('statsBlock');
    const loadingEl = document.getElementById('loading');
    const statsContent = document.getElementById('statsContent');

    const userId = "38574892";
    
    // Стабильный прокси, преобразующий данные страницы osu в JSON-текст без CORS-блокировок
    const apiUrl = `https://allorigins.win{encodeURIComponent('https://ppy.sh' + userId)}`;

    // Твои стартовые данные со скриншота, которые отобразятся сразу, пока идет синхронизация
    const defaultStats = {
        username: "Statixcx",
        globalRank: "#151 388",
        accuracy: "98.66%",
        playcount: "16 854",
        pp: "4 332 pp",
        level: "98"
    };

    async function fetchOsuStats() {
        try {
            // Запрашиваем код страницы osu профиля с защитой от кэширования
            const response = await fetch(`${apiUrl}&_t=${Date.now()}`);
            if (!response.ok) throw new Error();
            
            const data = await response.json();
            
            if (data && data.contents) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, 'text/html');
                
                // Находим встроенный скрытый блок JSON со всей реальной статистикой игры osu!
                const jsonScript = doc.getElementById('json-user');
                if (jsonScript) {
                    const userData = JSON.parse(jsonScript.textContent);
                    const stats = userData.statistics;
                    
                    // Обновляем текстовые поля твоей таблицы живыми значениями с серверов игры
                    document.getElementById('username').textContent = userData.username || defaultStats.username;
                    document.getElementById('globalRank').textContent = stats.global_rank ? `#${parseInt(stats.global_rank).toLocaleString('ru-RU')}` : defaultStats.globalRank;
                    document.getElementById('accuracy').textContent = stats.hit_accuracy ? `${parseFloat(stats.hit_accuracy).toFixed(2)}%` : defaultStats.accuracy;
                    document.getElementById('playcount').textContent = stats.play_count ? parseInt(stats.play_count).toLocaleString('ru-RU') : defaultStats.playcount;
                    document.getElementById('pp').textContent = stats.pp ? `${Math.round(parseFloat(stats.pp)).toLocaleString('ru-RU')} pp` : defaultStats.pp;
                    document.getElementById('level').textContent = userData.level ? Math.floor(parseFloat(userData.level)) : (stats.level ? stats.level.current : defaultStats.level);
                    
                    if (loadingEl) loadingEl.style.display = 'none';
                    if (statsContent) statsContent.style.display = 'block';
                    return;
                }
            }
            throw new Error();
        } catch (error) {
            console.warn("Сеть занята, выводим кэш профиля");
            // Если сеть лежит или osu перегружен, мгновенно выводим твои точные цифры
            document.getElementById('username').textContent = defaultStats.username;
            document.getElementById('globalRank').textContent = defaultStats.globalRank;
            document.getElementById('accuracy').textContent = defaultStats.accuracy;
            document.getElementById('playcount').textContent = defaultStats.playcount;
            document.getElementById('pp').textContent = defaultStats.pp;
            document.getElementById('level').textContent = defaultStats.level;
            
            if (loadingEl) loadingEl.style.display = 'none';
            if (statsContent) statsContent.style.display = 'block';
        }
    }

    // Кнопка открыть/закрыть
    toggleBtn.addEventListener('click', () => {
        statsBlock.classList.toggle('show');

        if (statsBlock.classList.contains('show')) {
            toggleBtn.textContent = 'Скрыть статистику';
            fetchOsuStats(); // Обновляем статы в реальном времени при открытии шторки
        } else {
            toggleBtn.textContent = 'Показать статистику';
        }
    });

    // Автоматическое обновление данных каждые 15 секунд в фоновом режиме, пока шторка открыта
    setInterval(() => {
        if (statsBlock.classList.contains('show')) {
            fetchOsuStats();
        }
    }, 15000);
});
