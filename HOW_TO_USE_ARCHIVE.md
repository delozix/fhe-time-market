# Как использовать архив time-marketplace-fhe.zip

## 📦 Что в архиве

Архив содержит **ВСЕ необходимые файлы** для развертывания Time Marketplace FHE DApp:

- ✅ **Frontend код** (Next.js + React + TypeScript)
- ✅ **Смарт-контракты** (Solidity + Hardhat)
- ✅ **Конфигурация** для GitHub и Vercel
- ✅ **Документация** и инструкции
- ✅ **CI/CD пайплайн** для автоматического деплоя

**Размер архива**: 174 KB  
**Файлов включено**: 50+ файлов

## 🚀 Быстрый старт

### Шаг 1: Распаковка
```bash
# Распакуйте архив в новую папку
unzip time-marketplace-fhe.zip
cd time-marketplace-fhe
```

### Шаг 2: Установка зависимостей
```bash
# Установите зависимости frontend
npm install

# Установите зависимости контрактов
cd contracts
npm install
cd ..
```

### Шаг 3: Настройка окружения
```bash
# Скопируйте примеры переменных окружения
cp env.example .env
cp contracts/env.example contracts/.env

# Отредактируйте .env файлы при необходимости
# (для локальной разработки можно оставить как есть)
```

### Шаг 4: Проверка сборки
```bash
# Соберите проект
npm run build

# Если все успешно - проект готов!
```

## 🌐 Деплой на GitHub + Vercel

### Вариант A: Через GitHub веб-интерфейс

1. **Создайте репозиторий** на GitHub.com:
   - Название: `time-marketplace-fhe`
   - Сделайте публичным
   - НЕ инициализируйте с README

2. **Загрузите файлы**:
   - Нажмите "uploading an existing file"
   - Перетащите ВСЕ файлы из распакованной папки
   - Commit: "Initial commit: Time Marketplace FHE DApp"

### Вариант B: Через Git командную строку

```bash
# Инициализируйте Git
git init
git add .
git commit -m "Initial commit: Time Marketplace FHE DApp"

# Добавьте remote и запушьте
git remote add origin https://github.com/YOUR_USERNAME/time-marketplace-fhe.git
git branch -M main
git push -u origin main
```

### Деплой на Vercel

1. **Идите на Vercel.com** и войдите через GitHub
2. **Import Project** → выберите ваш репозиторий
3. **Добавьте Environment Variables**:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x02D5ADeDf81F3c5Ee3FeBC76736Fe2d6A7124e51
   NEXT_PUBLIC_NETWORK=sepolia
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_FHE_RELAYER_URL=https://relayer.testnet.zama.cloud
   NEXT_PUBLIC_FHE_NETWORK=sepolia
   ```
4. **Deploy** → готово! 🎉

## 🔧 Локальная разработка

```bash
# Запустите dev сервер
npm run dev

# Откройте http://localhost:3000
# Подключите MetaMask к Sepolia сети
# Тестируйте функциональность
```

## 📋 Что включено в архив

### Основные файлы:
- `.gitignore` - Исключения для Git
- `README.md` - Полная документация
- `DEPLOYMENT.md` - Детальные инструкции деплоя
- `QUICK_DEPLOY.md` - Быстрый гайд
- `vercel.json` - Настройки Vercel

### Frontend (app/):
- React компоненты
- TypeScript хуки
- Стили и конфигурация
- Контракт ABI

### Смарт-контракты (contracts/):
- Solidity контракты
- Скрипты деплоя
- Hardhat конфигурация

### CI/CD (.github/):
- Автоматический деплой
- Тестирование

## ⚡ Готово к использованию!

Архив содержит **все необходимое** для:
- ✅ Создания GitHub репозитория
- ✅ Деплоя на Vercel
- ✅ Локальной разработки
- ✅ Продакшн использования

**Время до деплоя**: ~10 минут  
**Сложность**: Начинающий уровень

---

**Удачного деплоя! 🚀**
