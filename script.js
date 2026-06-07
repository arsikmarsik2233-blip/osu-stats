document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statsBlock = document.getElementById('statsBlock');
    const osuSig = document.getElementById('osuSig');

    // Ссылка на официальную картинку твоих стат
    const baseImgUrl = "https://lemres.de";

    toggleBtn.addEventListener('click', () => {
        statsBlock.classList.toggle('show');

        if (statsBlock.classList.contains('show')) {
            toggleBtn.textContent = 'Скрыть статистику';
            
            // Принудительно заставляем браузер обновить картинку в момент открытия шторки
            if (osuSig) {
                osuSig.src = `${baseImgUrl}?t=${Date.now()}`;
            }
        } else {
            toggleBtn.textContent = 'Показать статистику';
        }
    });

    // Каждые 30 секунд обновляем картинку, чтобы поймать окончание твоей катки
    setInterval(() => {
        if (statsBlock.classList.contains('show') && osuSig) {
            osuSig.src = `${baseImgUrl}?t=${Date.now()}`;
        }
    }, 30000);
});
