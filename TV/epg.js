// EPG Manager
class EPG {
  constructor() {
    this.container = document.getElementById('epg-program-list');
    this.currentChannel = null;
  }

  async load(channelId) {
    try {
      // Замените на реальный API или файл с данными
      const response = await fetch(`https://your-epg-api.com/programs?channel=${channelId}`);
      const programs = await response.json();
      
      this.render(programs);
      this.currentChannel = channelId;
    } catch (error) {
      console.error('EPG load error:', error);
      this.container.innerHTML = '<div class="p-4 text-gray-400">Программа передач недоступна</div>';
    }
  }

  render(programs) {
    this.container.innerHTML = '';
    
    if (!programs || programs.length === 0) {
      this.container.innerHTML = '<div class="p-4 text-gray-400">Нет данных о программе</div>';
      return;
    }

    const now = new Date();
    
    programs.forEach(program => {
      const item = document.createElement('div');
      item.className = 'epg-item flex items-start';
      
      const startTime = new Date(program.start);
      const endTime = new Date(program.end);
      
      // Проверка, идет ли передача сейчас
      const isCurrent = startTime <= now && endTime >= now;
      
      item.innerHTML = `
        <div class="epg-time">
          ${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          -
          ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
        <div class="flex-1">
          <div class="font-medium ${isCurrent ? 'text-white' : 'text-gray-300'}">${program.title}</div>
          ${program.description ? `<div class="text-sm text-gray-400 mt-1">${program.description}</div>` : ''}
        </div>
      `;
      
      if (isCurrent) {
        item.classList.add('current');
      }
      
      this.container.appendChild(item);
    });
  }
}

// Инициализация EPG
export const epg = new EPG();