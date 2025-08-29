# Рандомайзер BYTE

Простой статический проект: HTML/CSS/JS — выбор случайных победителей и опциональных призов.

Коротко:
- Стартовая страница: `index.html`
- Стили: `styles.css`
- Скрипт: `script.js`

Подготовка и публикация

1) Создать репозиторий на GitHub и запушить проект

```bash
git init
git add .
git commit -m "Initial commit"
# создайте репозиторий на GitHub и добавьте remote
git remote add origin git@github.com:<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

2) Простое развертывание на Netlify

- Через GitHub: войдите на Netlify, выберите «New site from Git», подключите GitHub и укажите репозиторий. В настройках сборки укажите:
  - Build command: (оставьте пустым)
  - Publish directory: `.`

- Или вручную: перетащите папку с сайтом (содержит `index.html`) на Netlify Drag & Drop.

3) Локальная проверка

Откройте `index.html` в браузере (двойной клик или локальный сервер):

```bash
# статический сервер на Python
python3 -m http.server 8000
# затем откройте http://localhost:8000
```

Полезные заметки
- Кнопка копирования результатов активируется при наличии результатов и при включённых призах.
- Для автоматического деплоя через Netlify оставьте `publish` точкой проекта (см. `netlify.toml`).

Если нужно — добавлю GitHub Actions для автоматического теста/линта перед деплоем.
