function renderChannelList(channels = playlist) {
  const container = document.getElementById('channel-list-items');
  container.innerHTML = ''; // Очищаем контейнер

  channels.forEach((channel, index) => {
    const div = document.createElement('div');
    div.className = 'channel px-3 py-2 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer flex items-center';
    div.dataset.title = channel.name.toLowerCase(); // Для поиска

    if (channel.logo) {
      const img = document.createElement('img');
      img.src = channel.logo;
      img.alt = channel.name;
      img.className = 'w-10 h-10 object-contain mr-3';
      div.appendChild(img);
    }

    const text = document.createElement('span');
    text.className = 'truncate';
    text.textContent = channel.name;
    div.appendChild(text);

    div.onclick = () => {
      playChannel(channel, index);
    };

    container.appendChild(div);
  });

  // Обновляем активный канал
  updateActiveChannel(currentChannelIndex);
}

// Новая функция поиска
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const allChannels = document.querySelectorAll('#channel-list-items .channel');
    
    if (query === '') {
      allChannels.forEach(channel => channel.classList.remove('hidden'));
      return;
    }

    allChannels.forEach(channel => {
      const title = channel.dataset.title;
      channel.classList.toggle('hidden', !title.includes(query));
    });
  });
}