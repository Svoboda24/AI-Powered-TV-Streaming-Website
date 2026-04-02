// Init libraries
      AOS.init({ once: true, duration: 700 });
      document.getElementById('year').textContent = new Date().getFullYear();

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  renderChannelList();
  setupSearch();
  
  // Запускаем первый канал
  if (playlist.length > 0) {
    playChannel(playlist[0], 0).catch(console.error);
  }
});

      /*
        ▸ Patch legacy loader helpers so они знают про наш новый overlay.
        Старые loading.js → showLoader()/hideLoader() работали c #loading-spinner.
        Мы оставили этот id, но также показываем / скрываем overlay для затемнения.
      */
      window.showLoader = () => {
        document.getElementById('loading-overlay')?.classList.remove('hidden');
        document.getElementById('loading-spinner')?.style.setProperty('display', 'block');
      };
      window.hideLoader = () => {
        document.getElementById('loading-overlay')?.classList.add('hidden');
        document.getElementById('loading-spinner')?.style.setProperty('display', 'none');
      };