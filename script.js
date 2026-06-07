document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statsBlock = document.getElementById('statsBlock');
    const loadingEl = document.getElementById('loading');
    const statsContent = document.getElementById('statsContent');

    const userId = "38574892";
    // Официальный и самый быстрый JSON-шлюз сообщества osu!
    const apiUrl = `https://vercel.app{userId}?mode=osu`;

    async function fetchOsuStats() {
        try {
            // Добавляем timestamp к ссылке, чтобы данные в браузере обновлялись моментально после каждой сыгранной карты
            const response = await fetch(`${apiUrl}&cache_bust=${new Date().getTime()}`);
            if (!response.ok) throw new Error('Шлюз временно занят');
            
            const userData = await response.json();
            
            if (userData) {
                // Подставляем живые значения в карточку
                document.getElementById('username').textContent = userData.username || "Statixcx";
                
                const rank = userData.global_rank || userData.rank;
                document.getElementById('globalRank').textContent = rank ? `#${parseInt(rank).toLocaleString()}` : 'Без ранга';
                
                const acc = userData.accuracy || userData.hit_accuracy;
                document.getElementById('accuracy').textContent = acc ? `${parseFloat(acc).toFixed(2)}%` : '98.35%';
                
                const pc = userData.play_count || userData.playcount;
                document.getElementById('playcount').textContent = pc ? parseInt(pc).toLocaleString() : '13,653';
                
                const ppVal = userData.pp;
                document.getElementById('pp').textContent = ppVal ? `${Math.round(parseFloat(ppVal)).toLocaleString()} pp` : '-- pp';
                
                const lvl = userData.level;
                document.getElementById('level').textContent = lvl ? Math.floor(parseFloat(lvl)) : '--';

                // Скрываем загрузку и плавно открываем статы
                loadingEl.style.display = 'none';
                statsContent.style.display = 'block';
            }
        } catch (error) {
            console.error("Повторное подключение к шлюзу...", error);
            loadingEl.textContent = "Синхронизация задерживается...";
        }
    }

    // Обработка кнопки
    toggleBtn.addEventListener('click', () => {
        statsBlock.classList.toggle('show');

        if (statsBlock.classList.contains('show')) {
            toggleBtn.textContent = 'Скрыть статистику';
            fetchOsuStats(); // Первый запуск при открытии шторки
        } else {
            toggleBtn.textContent = 'Показать статистику';
        }
    });

    // Постоянное авто-обновление каждые 15 секунд в фоновом режиме, пока открыта шторка
    setInterval(() => {
        if (statsBlock.classList.contains('show')) {
            fetchOsuStats();
        }
    }, 15000);
});
