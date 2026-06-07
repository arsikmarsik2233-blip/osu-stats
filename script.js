document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statsBlock = document.getElementById('statsBlock');
    const osuImg = document.getElementById('osuImg');

    const baseImgUrl = "https://vtop.site";

    toggleBtn.addEventListener('click', () => {
        statsBlock.classList.toggle('show');

        if (statsBlock.classList.contains('show')) {
            toggleBtn.textContent = 'Скрыть статистику';
            
            // Принудительно сбрасываем кэш картинки при открытии шторки
            if (osuImg) {
                osuImg.src = `${baseImgUrl}&_t=${Date.now()}`;
            }
        } else {
            toggleBtn.textContent = 'Показать статистику';
        }
    });

    // Автоматическое обновление информера каждые 20 секунд прямо во время игры
    setInterval(() => {
        if (statsBlock.classList.contains('show') && osuImg) {
            osuImg.src = `${baseImgUrl}&_t=${Date.now()}`;
        }
    }, 20000);
});
