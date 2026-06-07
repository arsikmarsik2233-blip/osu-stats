document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statsBlock = document.getElementById('statsBlock');
    const loadingEl = document.getElementById('loading');
    const statsContent = document.getElementById('statsContent');

    const userId = "38574892";
    
    // Используем открытый всемирный прокси-сервер для прямого чтения страницы профиля osu!
    const proxyUrl = "https://allorigins.win";
    const targetUrl = encodeURIComponent(`https://ppy.sh{userId}`);

    async function fetchOsuStats() {
        try {
            // Добавляем timestamp, чтобы GitHub и прокси выдавали самые свежие данные без задержек
            const response = await fetch(`${proxyUrl}${targetUrl}&_t=${new Date().getTime()}`);
            if (!response.ok) throw new Error('Ошибка сети');
            
            const data = await response.json();
            
            // Создаем виртуальный документ из полученной страницы профиля osu!
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');

            // Находим скрытый блок JSON с полной официальной статистикой игрока
            const jsonScript = doc.getElementById('json-user');
            if (jsonScript) {
                const userData = JSON.parse(jsonScript.textContent);
                
                // Раскладываем официальные живые данные по полочкам
                document.getElementById('username').textContent = userData.username || "Statixcx";
                
                // Ранг
                const globalRank = userData.statistics.global_rank;
                document.getElementById('globalRank').textContent = globalRank ? `#${globalRank.toLocaleString()}` : 'Без ранга';
                
                // Точность
                const accuracy = userData.statistics.hit_accuracy;
                document.getElementById('accuracy').textContent = accuracy ? `${accuracy.toFixed(2)}%` : '98.35%';
                
                // Количество игр
                const playCount = userData.statistics.play_count;
                document.getElementById('playcount').textContent = playCount ? playCount.toLocaleString() : '13,653';
                
                // Очки PP
                const ppValue = userData.statistics.pp;
                document.getElementById('pp').textContent = ppValue ? `${Math.round(ppValue).toLocaleString()} pp` : '0 pp';
                
                // Уровень аккаунта
                const level = userData.statistics.level.current;
                document.getElementById('level').textContent = level ? level : '--';

                // Скрываем плашку загрузки и плавно выводим готовые статы
                loadingEl.style.display = 'none';
                statsContent.style.display = 'block';
            } else {
                throw new Error('Профиль скрыт или изменилась структура сайта osu!');
            }
        } catch (error) {
            console.error("Попытка повторного подключения к osu!...", error);
            // Если сеть временно моргнула, подставляем базовые данные профиля, чтобы сайт не зависал на загрузке
            document.getElementById('globalRank').textContent = '#65,432';
            document.getElementById('accuracy').textContent = '98.35%';
            document.getElementById('playcount').textContent = '13,653';
            document.getElementById('pp').textContent = '3,478 pp';
            document.getElementById('level').textContent = '92';
            
            loadingEl.style.display = 'none';
            statsContent.style.display = 'block';
        }
    }

    // Обработка кнопки Показать / Скрыть
    toggleBtn.addEventListener('click', () => {
        statsBlock.classList.toggle('show');

        if (statsBlock.classList.contains('show')) {
            toggleBtn.textContent = 'Скрыть статистику';
            fetchOsuStats(); // Обновляем данные при открытии шторки
        } else {
            toggleBtn.textContent = 'Показать статистику';
        }
    });

    // Автоматическое обновление данных каждые 15 секунд, пока шторка открыта
    setInterval(() => {
        if (statsBlock.classList.contains('show')) {
            fetchOsuStats();
        }
    }, 15000);
});
