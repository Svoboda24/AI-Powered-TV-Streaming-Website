function createPlayerControls(video, playLiveCallback) {
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'custom-controls';
  controlsContainer.className = 'absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-xl transition-opacity duration-300 opacity-0 pointer-events-none';

  // === Play/Pause Button ===
  const btnPlayPause = document.createElement('button');
  btnPlayPause.setAttribute('aria-label', 'Play/Pause');
  btnPlayPause.className = 'text-white hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded';
  btnPlayPause.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path id="play-icon" d="M8 5v14l11-7z" />
      <path id="pause-icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" style="display: none;" />
    </svg>
  `;
  const playIcon = btnPlayPause.querySelector('#play-icon');
  const pauseIcon = btnPlayPause.querySelector('#pause-icon');

  btnPlayPause.onclick = () => {
    if (video.paused) {
      video.play();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      video.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  };

  // === Fullscreen Button ===
  const btnFullscreen = document.createElement('button');
  btnFullscreen.setAttribute('aria-label', 'Toggle Fullscreen');
  btnFullscreen.className = 'text-white hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded';
  btnFullscreen.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path id="fullscreen-icon" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
      <path id="exit-fullscreen-icon" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" style="display: none;" />
    </svg>
  `;
  const fullscreenIcon = btnFullscreen.querySelector('#fullscreen-icon');
  const exitFullscreenIcon = btnFullscreen.querySelector('#exit-fullscreen-icon');

  function enterFullscreen(elem) {
    if (elem.requestFullscreen) return elem.requestFullscreen();
    if (elem.webkitRequestFullscreen) return elem.webkitRequestFullscreen();
    if (elem.msRequestFullscreen) return elem.msRequestFullscreen();
    return Promise.reject('Fullscreen API is not supported');
  }
  function exitFullscreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
    return Promise.reject('Fullscreen API is not supported');
  }

  btnFullscreen.onclick = () => {
    const playerContainer = document.getElementById('player-container');
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      enterFullscreen(playerContainer).then(() => {
        fullscreenIcon.style.display = 'none';
        exitFullscreenIcon.style.display = 'block';
      }).catch(() => {});
    } else {
      exitFullscreen().then(() => {
        fullscreenIcon.style.display = 'block';
        exitFullscreenIcon.style.display = 'none';
      }).catch(() => {});
    }
  };

  // === Live Button ===
  const btnLive = document.createElement('button');
  btnLive.setAttribute('aria-label', 'Play Live');
  btnLive.className = 'text-white hover:text-indigo-300 px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded';
  btnLive.innerHTML = `
    <span class="flex items-center gap-1">
      <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      <span>Live</span>
    </span>
  `;
  btnLive.onclick = () => {
    btnLive.disabled = true;
    btnLive.textContent = 'Обновляю...';
    playLiveCallback().finally(() => {
      btnLive.disabled = false;
      btnLive.innerHTML = `
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span>Live</span>
        </span>
      `;
    });
  };

  // === Volume Controls ===
  const volumeIcon = document.createElement('button');
  volumeIcon.setAttribute('aria-label', 'Toggle Mute');
  volumeIcon.className = 'text-white hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded';
  volumeIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path id="volume-high" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      <path id="volume-mute" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" style="display: none;" />
    </svg>
  `;
  const volumeHighIcon = volumeIcon.querySelector('#volume-high');
  const volumeMuteIcon = volumeIcon.querySelector('#volume-mute');

  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.min = 0;
  volumeSlider.max = 1;
  volumeSlider.step = 0.01;
  volumeSlider.className = 'w-24 h-1 bg-gray-500 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-colors';

  const volumeContainer = document.createElement('div');
  volumeContainer.className = 'flex items-center gap-2 ml-auto';
  volumeContainer.appendChild(volumeIcon);
  volumeContainer.appendChild(volumeSlider);

  // === Volume logic ===
  function updateVolume(vol) {
    vol = Math.min(Math.max(parseFloat(vol), 0), 1);
    video.volume = vol;

    // YouTube player integration if exists
    if (typeof ytPlayer !== 'undefined' && ytPlayer.setVolume) {
      ytPlayer.setVolume(vol * 100);
    }

    if (vol === 0) {
      volumeHighIcon.style.display = 'none';
      volumeMuteIcon.style.display = 'block';
    } else {
      volumeHighIcon.style.display = 'block';
      volumeMuteIcon.style.display = 'none';
    }

    localStorage.setItem('playerVolume', vol);
  }

  volumeSlider.value = 0.7; // default
  const savedVolume = parseFloat(localStorage.getItem('playerVolume'));
  if (!isNaN(savedVolume)) {
    volumeSlider.value = savedVolume;
  }
  updateVolume(volumeSlider.value);

  volumeSlider.oninput = () => updateVolume(volumeSlider.value);

  volumeIcon.onclick = () => {
    if (parseFloat(volumeSlider.value) > 0) {
      volumeSlider.value = 0;
      updateVolume(0);
    } else {
      const restoredVolume = parseFloat(localStorage.getItem('playerVolume')) || 0.7;
      volumeSlider.value = restoredVolume;
      updateVolume(restoredVolume);
    }
  };

  // === Append controls ===
  controlsContainer.appendChild(btnPlayPause);
  controlsContainer.appendChild(btnFullscreen);
  controlsContainer.appendChild(btnLive);
  controlsContainer.appendChild(volumeContainer);

  // === Show/hide controls logic with debounce ===
  const playerContainer = document.getElementById('player-container');
  let hideTimeout;
  let mouseMoveTimeout;

  function showControls() {
    controlsContainer.classList.add('visible');
    controlsContainer.style.opacity = '1';
    controlsContainer.style.pointerEvents = 'auto';

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!video.paused) {
        hideControls();
      }
    }, 3000);
  }

  function hideControls() {
    controlsContainer.classList.remove('visible');
    controlsContainer.style.opacity = '0';
    controlsContainer.style.pointerEvents = 'none';
  }

  function onMouseMoveDebounced() {
    if (mouseMoveTimeout) return;
    mouseMoveTimeout = requestAnimationFrame(() => {
      showControls();
      mouseMoveTimeout = null;
    });
  }

  playerContainer.addEventListener('mouseenter', showControls);
  playerContainer.addEventListener('mouseleave', () => {
    if (!video.paused) hideControls();
  });
  playerContainer.addEventListener('mousemove', onMouseMoveDebounced);
  video.addEventListener('play', showControls);
  video.addEventListener('pause', () => {
    showControls();
    clearTimeout(hideTimeout);
  });
  video.addEventListener('volumechange', showControls);

  // Инициализация иконок Play/Pause
  if (video.paused) {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  } else {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  }

  // Начинаем с автоскрытия контролов (если видео играет)
  if (!video.paused) {
    setTimeout(hideControls, 3000);
  }

  return controlsContainer;
}
