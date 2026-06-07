document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statsBlock = document.getElementById('statsBlock');
    const osuCard = document.getElementById('osuCard');

    toggleBtn.addEventListener('click', () => {
        // Плавное открытие или закрытие шторки
        statsBlock.classList.toggle('show');

        if (statsBlock.classList.contains('show')) {
            toggleBtn.textContent = 'Скрыть статистику';
            
            // Сбрасываем кэш информера при открытии, чтобы он моментально скачал твою свежую игру
            if (osuCard) {
                const currentSrc = osuCard.src.split('&_t=')[0];
                osuCard.src = `${currentSrc}&_t=${Date.now()}`;
            }
        } else {
            toggleBtn.textContent = 'Показать статистику';
        }
    });

    // Полное авто-обновление каждые 20 секунд прямо во время того, как ты играешь в osu!
    setInterval(() => {
        if (statsBlock.classList.contains('show') && osuCard) {
            const currentSrc = osuCard.src.split('&_t=')[0];
            osuCard.src = `${currentSrc}&_t=${Date.now()}`;
        }
    }, 20000);
});
