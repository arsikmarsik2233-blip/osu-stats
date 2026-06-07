document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statsBlock = document.getElementById('statsBlock');
    const osuWidget = document.getElementById('osuWidget');

    toggleBtn.addEventListener('click', () => {
        statsBlock.classList.toggle('show');

        if (statsBlock.classList.contains('show')) {
            toggleBtn.textContent = 'Скрыть статистику';
            
            // Принудительно перезагружаем встроенную карточку при открытии, чтобы подтянуть свежий ранк
            if (osuWidget) {
                osuWidget.src = osuWidget.src;
            }
        } else {
            toggleBtn.textContent = 'Показать статистику';
        }
    });

    // Раз в 30 секунд обновляем карточку в фоне, пока шторка открыта
    setInterval(() => {
        if (statsBlock.classList.contains('show') && osuWidget) {
            osuWidget.src = osuWidget.src;
        }
    }, 30000);
});
