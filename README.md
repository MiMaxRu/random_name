# Рандомайзер BYTE

Простий статичний проєкт: HTML/CSS/JS — вибір випадкових переможців і опційних призів.

Коротко:
- Початкова сторінка: `index.html`
- Стилі: `styles.css`
- Скрипт: `script.js`

Підготовка та публікація

1) Створіть репозиторій на GitHub і запуште проєкт

```bash
git init
git add .
git commit -m "Initial commit"
# створіть репозиторій на GitHub і додайте remote
git remote add origin git@github.com:<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

2) Простіший деплой на Netlify

- Через GitHub: зайдіть у Netlify, виберіть «New site from Git», підключіть GitHub і вкажіть репозиторій. У налаштуваннях збірки вкажіть:
  - Build command: (залиште порожнім)
  - Publish directory: `.`

- Або вручну: перетягніть папку з сайтом (що містить `index.html`) на Netlify Drag & Drop.

3) Локальна перевірка

Відкрийте `index.html` у браузері (подвійний клік або локальний сервер):

```bash
# статичний сервер на Python
python3 -m http.server 8000
# потім відкрийте http://localhost:8000
```

Корисні нотатки
- Кнопка копіювання результатів активується при наявності результатів і при ввімкнених призах.
- Для автоматичного деплою через Netlify залиште `publish` точкою проєкту (див. `netlify.toml`).

Якщо потрібно — можу додати GitHub Actions для автоматичного тесту/лінту перед деплоєм.
