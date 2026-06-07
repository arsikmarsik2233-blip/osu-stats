document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statsBlock = document.getElementById('statsBlock');
    const osuWidget = document.getElementById('osuWidget');

    // Базовый адрес информера
    const baseSrc = "https://vercel.app";

    function refreshStats() {
        if (osuWidget) {
            // Добавляем timestamp, чтобы информер выдавал живой ранг без старого кэша
            osuWidget.src = `${baseSrc}&_cb=${Date.now()}`;
        }
    }

    toggleBtn.addEventListener('click', () => {
        statsBlock.classList.toggle('show');

        if (statsBlock.classList.contains('show')) {
            toggleBtn.textContent = 'Скрыть статистику';
            refreshStats(); // Обновляем информер в момент открытия
        } else {
            toggleBtn.textContent = 'Показать статистику';
        }
    });

    // Полноценный цикл авто-обновления раз в 15 секунд во время твоей игры
    setInterval(() => {
        if (statsBlock.classList.contains('show')) {
            refreshStats();
        }
    }, 15000);
});
