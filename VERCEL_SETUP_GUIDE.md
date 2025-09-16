# 🚀 Полное руководство по настройке Vercel

## 📋 Настройки Vercel Dashboard

### 1. Создание проекта

**Вариант A: Новый проект**
1. Идите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Импортируйте ваш GitHub репозиторий
4. Vercel автоматически определит Next.js

**Вариант B: Существующий проект**
1. Идите в ваш проект в Vercel Dashboard
2. Нажмите "Settings" → "General"

### 2. Framework Settings

**Framework Preset**: `Next.js` (автоматически определяется)
**Root Directory**: `.` (корень проекта)
**Build Command**: `npm run build` (автоматически)
**Output Directory**: `.next` (автоматически)
**Install Command**: `npm install` (автоматически)

### 3. Environment Variables

**Идите в Settings → Environment Variables и добавьте:**

```
NEXT_PUBLIC_CONTRACT_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_NETWORK = sepolia
NEXT_PUBLIC_CHAIN_ID = 11155111
NEXT_PUBLIC_FHE_RELAYER_URL = https://relayer.testnet.zama.cloud
NEXT_PUBLIC_FHE_NETWORK = sepolia
```

**Настройки для каждого Environment Variable:**
- **Name**: `NEXT_PUBLIC_CONTRACT_ADDRESS`
- **Value**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Environment**: Все среды (Production, Preview, Development)

### 4. Build & Development Settings

**Build Command**: `npm run build`
**Development Command**: `npm run dev`
**Install Command**: `npm install`
**Output Directory**: `.next`

**Node.js Version**: `18.x` (рекомендуется)

### 5. Git Settings

**Production Branch**: `main`
**Preview Branches**: Автоматически для всех остальных веток

## 🔧 Дополнительные настройки

### 6. Functions Settings

**Runtime**: Node.js 18.x
**Memory**: 1024 MB (по умолчанию)
**Max Duration**: 10s (для Serverless Functions)

### 7. Security Settings

**Deployment Protection**: Отключено (для публичного проекта)
**Password Protection**: Отключено
**Trusted IPs**: Не настроено

### 8. Analytics & Monitoring

**Web Analytics**: Включено (рекомендуется)
**Speed Insights**: Включено (рекомендуется)

## 📁 Структура проекта для Vercel

```
time-marketplace-fhe/
├── app/                    # Next.js App Router
│   ├── components/         # React компоненты
│   ├── hooks/             # Custom хуки
│   ├── lib/               # Утилиты
│   ├── page.tsx           # Главная страница
│   └── layout.tsx         # Layout
├── contracts/             # Smart contracts (исключены из деплоя)
├── .vercelignore          # Исключения для Vercel
├── vercel.json           # Конфигурация Vercel
├── package.json          # Зависимости
└── README.md             # Документация
```

## 🚀 Процесс деплоя

### 1. Автоматический деплой
- **Push в main** → Production деплой
- **Push в другие ветки** → Preview деплой
- **Pull Request** → Preview деплой

### 2. Ручной деплой
1. Идите в Vercel Dashboard
2. Нажмите "Deployments"
3. Нажмите "Redeploy" на нужном деплое

### 3. Локальный деплой
```bash
npm install -g vercel
vercel login
vercel
```

## 🔍 Troubleshooting

### Частые проблемы и решения:

**1. Build Error: "Missing public directory"**
- ✅ Решение: Упрощен `vercel.json` до `{"framework": "nextjs"}`
- ✅ Проверено: `.vercelignore` не исключает `.next/`

**2. Environment Variables не работают**
- ✅ Проверьте: Переменные начинаются с `NEXT_PUBLIC_`
- ✅ Проверьте: Переменные добавлены для всех сред

**3. Contract не найден**
- ✅ Проверьте: `NEXT_PUBLIC_CONTRACT_ADDRESS` правильный
- ✅ Проверьте: Контракт задеплоен в Sepolia

**4. RPC Connection Issues**
- ✅ Решение: Автоматическое переключение RPC в коде
- ✅ Проверьте: Интернет соединение

## 📊 Мониторинг

### 1. Build Logs
- Идите в Deployments → выберите деплой → View Function Logs
- Проверьте ошибки сборки

### 2. Runtime Logs
- Идите в Functions → выберите функцию → View Logs
- Проверьте ошибки выполнения

### 3. Analytics
- Идите в Analytics → Web Analytics
- Смотрите метрики производительности

## ✅ Checklist для деплоя

### Перед деплоем:
- [ ] Environment Variables настроены
- [ ] `vercel.json` содержит `{"framework": "nextjs"}`
- [ ] `.vercelignore` не исключает `.next/`
- [ ] Локальная сборка работает (`npm run build`)
- [ ] Контракт задеплоен в Sepolia

### После деплоя:
- [ ] Сайт открывается по URL
- [ ] MetaMask подключается
- [ ] Создание предложений работает
- [ ] Покупка предложений работает
- [ ] RPC переключение работает

## 🎯 Оптимальные настройки

### Performance:
- **Node.js**: 18.x
- **Memory**: 1024 MB
- **Edge Functions**: Включено (если нужно)

### Security:
- **HTTPS**: Автоматически включено
- **Security Headers**: Автоматически настроены
- **CORS**: Настроен в коде

### Monitoring:
- **Web Analytics**: Включено
- **Speed Insights**: Включено
- **Error Tracking**: Автоматически

---

## 🎉 Готово!

**После применения этих настроек ваш FHE Time Marketplace будет полностью готов к работе на Vercel!**

**Все ошибки исправлены, все настройки оптимизированы! 🚀**
