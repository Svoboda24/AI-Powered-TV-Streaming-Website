const video = document.getElementById('video');
const list = document.getElementById('channel-list');
const channelLogo = document.getElementById('channel-logo');
const channelName = document.getElementById('channel-name');
const playerContainer = document.getElementById('player-container');

let hls;
let currentChannelIndex = 0;

// Добавляем кастомные кнопки
let playerControls = createPlayerControls(video, () => {
  const channel = playlist[currentChannelIndex];
  return playChannel(channel, currentChannelIndex);
});
playerContainer.appendChild(playerControls);

async function playChannel(channel, index) {
  return new Promise((resolve, reject) => {
    showLoader(); // Показать спиннер сразу при начале загрузки

    if (channel.type === 'youtube') {
      // Остановить HLS и видео
      if (hls) {
        hls.destroy();
        hls = null;
      }
      video.pause();
      video.removeAttribute('src');
      video.load();

      // Показать YouTube, скрыть HLS
      video.style.display = 'none';
      document.getElementById('youtube-container').style.display = 'block';

      // Чтобы спрятать спиннер, когда iframe загрузится:
      const ytFrame = document.getElementById('youtube-frame');
      ytFrame.onload = () => {
        hideLoader();
      };
      ytFrame.src = channel.url;

      if (typeof index === 'number') {
        currentChannelIndex = index;
        updateActiveChannel(index);
        updateChannelInfo(channel);
      }

      resolve();
      return;
    }

    // HLS режим
    document.getElementById('youtube-container').style.display = 'none';
    video.style.display = 'block';
    document.getElementById('youtube-frame').src = '';

    if (hls) {
      hls.destroy();
      hls = null;
    }

    video.pause();
    video.removeAttribute('src');
    video.load();

    if (Hls.isSupported()) {
      hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
        hideLoader(); // Скрыть спиннер, когда поток готов
        resolve();
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error('HLS error:', data);
        hideLoader(); // Скрыть спиннер при ошибке
        if (data.fatal) {
          alert('Ошибка воспроизведения потока. Возможно, канал недоступен.');
          reject(data);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.url;

      video.addEventListener('loadedmetadata', () => {
        video.play();
        hideLoader(); // Скрыть спиннер после загрузки
        resolve();
      });

      video.addEventListener('error', () => {
        hideLoader();
        alert('Ошибка воспроизведения видео.');
        reject();
      });
    } else {
      hideLoader();
      alert('Ваш браузер не поддерживает воспроизведение HLS.');
      reject();
    }

    if (typeof index === 'number') {
      currentChannelIndex = index;
      updateActiveChannel(index);
      updateChannelInfo(channel);
    }
  });
}

function updateActiveChannel(index) {
  // Удалить класс 'active' у всех элементов списка
  document.querySelectorAll('#channel-list .channel').forEach(el => {
    el.classList.remove('active');
  });

  // Добавить класс 'active' только выбранному элементу
  const selected = document.querySelectorAll('#channel-list .channel')[index];
  if (selected) {
    selected.classList.add('active');
  }
}

function updateChannelInfo(channel) {
  channelLogo.src = channel.logo || '';
  channelName.textContent = channel.name || 'Без названия';
}

function loadYouTubeAPI() {
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}

let controlsVisible = true;
let hideControlsTimeout;

const controls = document.getElementById('custom-controls');

// Показывает панель и запускает таймер скрытия
function showControls() {
  if (!controlsVisible) {
    controls.classList.remove('hidden');
    controlsVisible = true;
  }

  clearTimeout(hideControlsTimeout);
  hideControlsTimeout = setTimeout(() => {
    controls.classList.add('hidden');
    controlsVisible = false;
  }, 3000); // через 3 секунды бездействия — скрыть
}

// Отслеживаем движение мыши только в полноэкранном режиме
document.addEventListener('mousemove', () => {
  if (document.fullscreenElement) {
    showControls();
  }
});

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    // вошли в полноэкранный — запуск автоскрытия
    showControls();
  } else {
    // вышли из полноэкранного — всегда показывать
    clearTimeout(hideControlsTimeout);
    controls.classList.remove('hidden');
    controlsVisible = true;
  }
});

// Запускаем первый канал
playChannel(playlist[0], 0).catch(console.error);
