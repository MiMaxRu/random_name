(function(){
  const $ = s => document.querySelector(s);
  const namesEl = $('#names');
  // s1,s2,s3 замінено на динамічні слоти
  const pickBtn = $('#pickBtn');
  const shuffleBtn = $('#shuffleBtn');
  const clearBtn = $('#clearBtn');
  const winnersCountEl = $('#winnersCount');
  const prizesEl = $('#prizes');
  const usePrizesEl = $('#usePrizes');
  const copyWinnersBtn = $('#copyWinnersBtn');
  const shareListBtn = $('#shareListBtn');
  const winnersEl = $('#winners');
  const burstEl = $('#burst');
  const toastEl = $('#toast');
  const themeToggle = $('#themeToggle');
  const historyList = $('#historyList');
  const slotsContainer = document.querySelector('.slots');

  /* ---------- ТЕМА ---------- */
  const savedTheme = localStorage.getItem('rand_theme');
  if(savedTheme){ document.documentElement.setAttribute('data-theme', savedTheme); themeToggle.textContent = savedTheme==='light' ? '🌙' : '☀️'; }

  themeToggle.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', cur);
    themeToggle.textContent = cur==='light' ? '🌙' : '☀️';
    localStorage.setItem('rand_theme', cur);
    ripple(themeToggle);
  });

  /* ---------- УТИЛІТИ ---------- */
  function ripple(btn, x, y){
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const cx = (x ?? rect.width/2);
    const cy = (y ?? rect.height/2);
    r.style.left = cx + 'px';
    r.style.top  = cy + 'px';
    btn.appendChild(r);
    setTimeout(()=>r.remove(), 650);
  }

  function toast(text){
    toastEl.textContent = text;
    toastEl.classList.add('show');
    setTimeout(()=>toastEl.classList.remove('show'), 1200);
  }

  function normalizeList(text){
    return Array.from(new Set(
      text.split(/\r?\n/).map(x => x.trim()).filter(Boolean)
    ));
  }

  function sample3(list){
    const arr = list.slice();
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr.slice(0,3);
  }

  function confetti(){
    const colors = ['#f43f5e','#f59e0b','#84cc16','#22d3ee','#a78bfa','#f472b6','#34d399','#60a5fa'];
    const {innerWidth:w, innerHeight:h} = window;
    for(let i=0;i<120;i++){
      const d = document.createElement('div');
      d.className='dot';
      const x = Math.random()*w, y = -20;
      const tx = (Math.random()*w - x), ty = h + Math.random()*120;
      d.style.left = x+'px'; d.style.top = y+'px';
      d.style.setProperty('--tx', tx+'px');
      d.style.setProperty('--ty', ty+'px');
      d.style.background = colors[Math.floor(Math.random()*colors.length)];
      d.style.width = d.style.height = (6+Math.random()*10)+'px';
      burstEl.appendChild(d);
      setTimeout(()=>d.remove(), 1300);
    }
  }

  function thump(el){
    el.animate(
      [{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],
      {duration:260, easing:'ease-out'}
    );
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, m => (
      {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]
    ));
  }

  /* ---------- URL ІМПОРТ/ШАРИНГ ---------- */
  function tryLoadFromURL(){
    const url = new URL(location.href);
    const param = url.searchParams.get('names');
    if(param){
      try{
        const decoded = decodeURIComponent(param);
        namesEl.value = decoded.split('|').join('\n');
      }catch{}
    }
  }
  tryLoadFromURL();

  // Генеруємо початкові слоти (за замовчуванням 3)
  function renderSlots(count){
    slotsContainer.innerHTML = '';
    for(let i=0;i<count;i++){
      const slot = document.createElement('div');
      slot.className = 'slot multiple';
      const span = document.createElement('span');
      span.id = 's'+(i+1);
      span.textContent = '—';
      slot.appendChild(span);
      const prizeLabel = document.createElement('div');
      prizeLabel.className = 'label-prize';
      prizeLabel.textContent = '';
      slot.appendChild(prizeLabel);
      slotsContainer.appendChild(slot);
    }
  }
  renderSlots(Number(winnersCountEl?.value || 3));
  // Встановимо початковий текст кнопки і заголовка
  const initialCount = Number(winnersCountEl?.value || 3);
  pickBtn.textContent = `Обрати ${initialCount}`;
  const titleGrad = document.querySelector('.title .grad');
  titleGrad.textContent = `Обираємо ${initialCount} імена`;
  // синхронізуємо маленьку мітку в заголовку (якщо є)
  const pickCountLabel = document.getElementById('pickCountLabel');
  if(pickCountLabel) pickCountLabel.textContent = String(initialCount);

  // Перемальовуємо слоти при зміні кількості переможців
  winnersCountEl?.addEventListener('change', (e)=>{
    const n = Number(e.target.value || 3);
    renderSlots(n);
    pickBtn.textContent = `Обрати ${n}`;
  // Оновлюємо заголовок негайно
    titleGrad.textContent = `Обираємо ${n} імена`;
  if(pickCountLabel) pickCountLabel.textContent = String(n);
  });

  // Показувати / приховувати блок з призами
  if(usePrizesEl){
    const prizesWrap = document.getElementById('prizesWrap');
    function togglePrizes(){
      const btn = document.getElementById('copyWinnersPrizesBtn');
      if(usePrizesEl.checked){
        prizesWrap.removeAttribute('hidden');
        if(btn) { btn.removeAttribute('hidden'); }
      }
      else {
        prizesWrap.setAttribute('hidden','');
        if(btn) { btn.setAttribute('hidden',''); btn.disabled = true; }
      }
    }
    usePrizesEl.addEventListener('change', togglePrizes);
    togglePrizes();
  }

  shareListBtn.addEventListener('click', (e)=>{
    ripple(e.currentTarget, e.offsetX, e.offsetY);
    const list = normalizeList(namesEl.value);
    if(list.length === 0){ toast('Список порожній'); return; }
    const url = new URL(location.href.split('?')[0]);
    url.searchParams.set('names', encodeURIComponent(list.join('|')));
    const text = url.toString();
    if(navigator.clipboard){ navigator.clipboard.writeText(text).then(()=>toast('Посилання скопійовано')); }
    else { prompt('Скопіюй посилання:', text); }
  });

  /* ---------- ЛОГІКА РОЗІГРАШУ ---------- */
  let timers = [];
  let rollingPool = [];
  let lastWinners = [];
  const resultsModal = $('#resultsModal');
  const modalWinners = $('#modalWinners');
  const modalCopyBtn = $('#modalCopyBtn');
  const modalCloseBtn = $('#modalCloseBtn');
  const modalCloseBtn2 = document.querySelector('[data-close]');
  const copyWinnersPrizesBtn = document.getElementById('copyWinnersPrizesBtn');

  function startSpin(nodes){
    nodes.forEach(n => n.parentElement.classList.add('spin'));
    const update = n => {
      n.textContent = rollingPool[Math.floor(Math.random()*rollingPool.length)] || '—';
    };
    timers = nodes.map(n => setInterval(()=>update(n), 48));
  }

  function stopSpinAt(index, value, nodes){
    setTimeout(()=>{
      clearInterval(timers[index]);
      nodes[index].textContent = value;
      nodes[index].parentElement.classList.remove('spin');
      thump(nodes[index].parentElement);
    }, 280*index + 1900); // 1.9s, 2.18s, 2.46s
  }

  function addToHistory(picks){
  // historyList може бути видалений — перевірте перед використанням
    if(!historyList) return;
    const ts = new Date().toLocaleString();
    const li = document.createElement('li');
    li.textContent = `${ts}: ${picks.join(', ')}`;
    historyList.prepend(li);
  // тримаємо лише 5 останніх
    while(historyList.children.length > 5){
      historyList.lastElementChild.remove();
    }
  }

  pickBtn.addEventListener('click', (e)=>{
    ripple(e.currentTarget, e.offsetX, e.offsetY);

    const list = normalizeList(namesEl.value);
    const winnersCount = Number(winnersCountEl?.value || 3);
    if(list.length < Math.max(3, winnersCount)){
      alert(`Потрібно мінімум ${Math.max(3, winnersCount)} різних імен.`);
      return;
    }

    winnersEl.innerHTML = '';
    copyWinnersBtn.disabled = true;
    pickBtn.disabled = true; shuffleBtn.disabled = true; clearBtn.disabled = true;
    rollingPool = list.length > 12 ? list.slice(0,12) : list;

  // Випадкова вибірка N переможців
    const picks = (function(arr, n){
      const a = arr.slice();
      for(let i=a.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [a[i],a[j]] = [a[j],a[i]];
      }
      return a.slice(0,n);
    })(list, winnersCount);

  // Отримуємо ноди слотів
    const slotSpans = Array.from(document.querySelectorAll('.slots .slot > span'));
    startSpin(slotSpans);
    slotSpans.forEach((node, idx)=> stopSpinAt(idx, picks[idx] || '—', slotSpans));

    setTimeout(()=>{
      confetti();

  // Прив'язка призів (тільки якщо опція ввімкнена)
  const prizes = (usePrizesEl && !usePrizesEl.checked) ? [] : normalizeList(prizesEl.value);
  // Не заполняем метки призов в верхних слотах — сверху показываем только имена.
  // Призы остаются в нижних капсулах (.chip) и в модальном окне.

  // Показати ім'я і (за наявності) приз у нижніх капсулах; слоти зверху показують лише імена
      winnersEl.innerHTML = picks.map((n, i)=>{
        const pr = prizes[i] ? `<span class="chip-prize">${escapeHtml(prizes[i])}</span>` : '';
        return `<span class="chip">🏆 ${escapeHtml(n)} ${pr}</span>`;
      }).join('');
  lastWinners = picks.slice();
  // зберігаємо відповідність призів для кнопки копіювання у правому контейнері
  window.lastWinnersWithPrizes = picks.map((name, i)=>({ name, prize: prizes[i] || '' }));
  if(copyWinnersPrizesBtn) copyWinnersPrizesBtn.disabled = false;
      copyWinnersBtn.disabled = false;

      pickBtn.disabled = false; shuffleBtn.disabled = false; clearBtn.disabled = false;
      addToHistory(picks);

      // Подготовить и показать модальное окно с победителями и призами
      showResultsModal(picks, prizes);
    }, 280*(winnersCount-1) + 2000);
  });

  function showResultsModal(picks, prizes){
    modalWinners.innerHTML = '';
    picks.forEach((name, idx) => {
      const prize = prizes[idx] || '';
      const card = document.createElement('div');
      card.className = 'winner-card';

      const rank = document.createElement('div'); rank.className = 'winner-rank'; rank.textContent = `#${idx+1}`;
      const n = document.createElement('div'); n.className = 'winner-name'; n.textContent = name;
      const p = document.createElement('div'); p.className = 'winner-prize'; p.textContent = prize ? `🎁 ${prize}` : '';

      card.appendChild(rank);
      card.appendChild(n);
      card.appendChild(p);
      modalWinners.appendChild(card);
    });

  // Показати модальне вікно
    resultsModal.setAttribute('aria-hidden', 'false');
  }

  function closeResultsModal(){
    resultsModal.setAttribute('aria-hidden', 'true');
  }

  // Закрытие модала
  if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeResultsModal);
  document.querySelectorAll('[data-close]').forEach(el=> el.addEventListener('click', closeResultsModal));

  // Копирование из модала
  if(modalCopyBtn) modalCopyBtn.addEventListener('click', ()=>{
    const lines = Array.from(modalWinners.querySelectorAll('.winner-card')).map(c=>{
      const name = c.querySelector('.winner-name')?.textContent || '';
      const prize = c.querySelector('.winner-prize')?.textContent || '';
      return prize ? `${name} — ${prize}` : name;
    }).join('\n');
    if(navigator.clipboard){ navigator.clipboard.writeText(lines).then(()=>toast('Скопійовано')); }
    else { prompt('Скопіюй', lines); }
  });

  // Новая кнопка: копировать победителей и их призы (правый контейнер)
  if(copyWinnersPrizesBtn){
    copyWinnersPrizesBtn.addEventListener('click', (e)=>{
      ripple(e.currentTarget, e.offsetX, e.offsetY);
      const data = window.lastWinnersWithPrizes || [];
      if(!data.length){ toast('Немає результатів для копіювання'); return; }
      const text = data.map(d => d.prize ? `${d.name} — 🎁 ${d.prize}` : d.name).join('\n');
      if(navigator.clipboard){ navigator.clipboard.writeText(text).then(()=>toast('Скопійовано')); }
      else { prompt('Скопіюй', text); }
    });
  }

  shuffleBtn.addEventListener('click', (e)=>{
    ripple(e.currentTarget, e.offsetX, e.offsetY);
    const list = normalizeList(namesEl.value);
    if(list.length===0) return;
    const arr = list.slice();
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    namesEl.value = arr.join('\n');
    thump(shuffleBtn);
  });

  clearBtn.addEventListener('click', (e)=>{
    ripple(e.currentTarget, e.offsetX, e.offsetY);
    namesEl.value='';
  // Сбрасываем динамические слоты
  Array.from(document.querySelectorAll('.slots .slot > span')).forEach(sp=> sp.textContent='—');
  Array.from(document.querySelectorAll('.slots .slot .label-prize')).forEach(lb=> lb.textContent='');
    winnersEl.innerHTML=''; copyWinnersBtn.disabled = true;
    const btn = document.getElementById('copyWinnersPrizesBtn'); if(btn){ btn.disabled = true; }
  });

  copyWinnersBtn.addEventListener('click', (e)=>{
    ripple(e.currentTarget, e.offsetX, e.offsetY);
    if(!lastWinners.length){ return; }
    const text = lastWinners.join(', ');
    if(navigator.clipboard){
      navigator.clipboard.writeText(text).then(()=>toast('Скопійовано'));
    } else {
      prompt('Скопіюй переможців:', text);
    }
  });

  // iOS — прокрутити textarea в центр при фокусі
  namesEl.addEventListener('focus', ()=>{
    setTimeout(()=>{ namesEl.scrollIntoView({block:'center', behavior:'smooth'}); }, 120);
  });

  // Заповнити прикладом при першому запуску (або якщо порожньо після URL-імпорту)
  if(!namesEl.value.trim()){
    namesEl.value = [
      'Анна','Богдан','Вікторія','Гліб','Даша','Єгор','Женя',
      'Злата','Ігор','Кирило','Лєра','Марат','Надя','Олег','Поліна'
    ].join('\n');
  }

  /* ----- маленький тостер ------ */
  // стиль підключений у CSS через клас .toast.show
  const style = document.createElement('style');
  style.textContent = `
    .toast{
      position: fixed; left: 50%; bottom: clamp(12px, 4svh, 28px);
      transform: translateX(-50%) translateY(10px);
      background: rgba(0,0,0,.6);
      color: #fff; padding: 10px 14px; border-radius: 12px;
      opacity: 0; transition: opacity .2s ease, transform .2s ease;
      z-index: 30; backdrop-filter: blur(6px);
      box-shadow: 0 6px 18px rgba(0,0,0,.25);
      font-size: 14px;
    }
    :root[data-theme="light"] .toast{ background: rgba(30,41,59,.9) }
    .toast.show{ opacity: 1; transform: translateX(-50%) translateY(0) }
  `;
  document.head.appendChild(style);
})();