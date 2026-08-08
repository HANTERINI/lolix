/**
 * Meme Generator - Templates & Presets Catalog with Built-in Fallbacks & Unique Captions
 */

// Dictionary of funny unique Russian default captions for popular meme templates
const MEME_CAPTIONS_DICTIONARY = {
    "drake": ["Писать код без тестов", "Писать код с тестами"],
    "two_buttons": ["Исправить баг в коде", "Переписать всё на новый фреймворк"],
    "distracted": ["Новый JS фреймворк", "Разработчик", "Проверенный стак"],
    "change_my_mind": ["Пятница — лучший день для деплоя", "Измени моё мнение"],
    "cat_yelling": ["ТЫ ОБЕЩАЛ ПОЧИНИТЬ БАГ К УТРУ!", "я просто запустил npm install"],
    "trade_offer": ["Я получаю: твое внимание", "Ты получаешь: топовый мем"],
    "disaster_girl": ["Когда удалил prod базу данных", "Но бэкап сделан в 2018 году"],
    "roll_safe": ["Багов не будет", "Если не писать код"],
    "buff_doge": ["Программисты в 1995: пишут ОС на C", "Программисты в 2026: центрируют иконку в CSS"],
    "this_is_fine": ["Сервер упал", "Всё отлично"],
    "batman_slap": ["Я нашел баг в...", "ЭТО НЕ БАГ, ЭТО ФИЧА!"],
    "ancient_aliens": ["Почему код работает?", "ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ"],
    "181913649": ["Писать код без тестов", "Писать код с тестами"],
    "87743020": ["Исправить баг в коде", "Переписать всё на новый фреймворк"],
    "112126428": ["Новый JS фреймворк", "Разработчик", "Проверенный стак"],
    "222403160": ["Я снова прошу вас", "Посмотреть мой пулл-реквест"],
    "217743513": ["Написать документацию к коду", "ИЛИ ВЗЯТЬ 25 КАРТ"],
    "124822590": ["Рефакторинг старого кода", "Разработчик", "Написать всё с нуля"],
    "252600902": ["Подожди, это всё баг?", "Всегда им был"],
    "322841258": ["Я залил фичу на прод", "И она протестирована?", "И она протестирована, правда?"],
    "135256802": ["Сеньор", "Разработка без багов", "Джуниор"],
    "80707627": ["Когда ждешь", "Окончание билда проекта"],
    "131087935": ["Мои планы на выходные", "Я", "Новый баг в продакшене"],
    "131940431": ["Написать идеальный код", "Запустить тесты", "Тесты упали", "Тесты упали"],
    "129242436": ["Пятница — лучший день для деплоя", "Измени моё мнение"],
    "4087833": ["Жду ответ на StackOverflow", "С 2015 года"],
    "161865971": ["Отмечен как живой после", "Пятничного деплоя в 17:59"],
    "97984": ["Удалил папку node_modules", "Проект стал весить на 50 ГБ меньше"],
    "91538330": ["Баги", "Баги везде"],
    "309868304": ["Я получаю: твой лайк", "Ты получаешь: топовый мем"],
    "101470": ["Почему код работает?", "ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ"],
    "438680": ["Я нашел баг в...", "ЭТО НЕ БАГ, ЭТО ФИЧА!"],
    "102156234": ["я Же ГоВоРиЛ чТо ЭтО рАбОтАеТ", "НЕ МОЖЕТ БЫТЬ"],
    "79132341": ["Запустил проект без конфига", "Упал баг", "Зачем сервер это сделал?"],
    "188390779": ["ТЫ ОБЕЩАЛ ПОЧИНИТЬ БАГ К УТРУ!", "я просто запустил npm install"],
    "61579": ["Нельзя просто так взять", "И задеплоить без багов"],
    "100777631": ["Это новая фича?", "Разработчик"],
    "177682295": ["Вы пацаны получаете зарплату?", "Я пишу open-source"],
    "252758727": ["Баг в продакшене", "Менеджер", "Документация к коду"],
    "93895088": ["Кодить на JS", "Кодить на TypeScript", "Переписать все на Rust", "Писать код в Блокноте"],
    "180190441": ["Мой код", "Код из туториала 10 лет назад", "Это одно и то же"],
    "505705955": ["АБСОЛЮТНОЕ КИНО", "Когда код скомпилировался с 1 раза"],
    "370867422": ["Где коммиты?", "Без тестов?"],
    "178591752": ["Обычный код", "Код с однострочными лямбдами"],
    "55311130": ["Сервер упал", "Всё отлично"],
    "195515965": ["Завтра напишу тесты", "Код работает, зачем тесты", "Удалю тесты", "Всё упало"],
    "316466202": ["Где документация?", "Где бэкапы?"],
    "110163934": ["Он наверное думает о других бабах", "А что если console.log() не выведет..."],
    "148909805": ["Когда спросили кто удалил базу данных", "Я не знаю"],
    "110133729": ["Frontend разработчик", "Backend разработчик"],
    "216523697": ["Все мои кенты ненавидят", "Пятничный деплой"],
    "354700819": ["Всё горит на проде", "Зато пятница!"],
    "166969924": ["Огромный баг в системе", "try { ... } catch (e) {}"],
    "99683372": ["Сервер упал в 3 ночи", "Вышел новый мем"],
    "371619279": ["Без багов?", "Без документации?"],
    "114585149": ["Я ПОЧИНИЛ БАГ!", "УПАЛО 10 НОВЫХ!"],
    "187102311": ["React", "Vue", "Angular в 2026"],
    "226297822": ["Нашел баг на проде", "Он только у одного юзера", "Этот юзер — генеральный директор"],
    "61520": ["Не пойму это баг", "Или незадокументированная фича"],
    "155067746": ["Запустил код без проверки", "Код упал", "Удивленный пикачу"],
    "133946291": ["Знаете, я и сам своего рода", "Программист"],
    "29562797": ["Посмотри на меня", "Теперь я Сеньор"],
    "72525473": ["Скажи это!", "It works on my machine..."],
    "135678846": ["Разработчик", "Зачем проект упал?", "Пятничный коммит"],
    "259237855": ["Когда сеньор ищет баг 3 часа", "А ты нашел опечатку за 5 секунд"],
    "342785297": ["Ты пишешь код ради денег", "Я пишу код ради мемов", "Мы разные"],
    "123999232": ["Свиток истины", "Никто не читает документацию"],
    "50421420": ["Пятница вечер", "Деплой на прод"],
    "29617627": ["Смотри на меня", "Теперь я системный архитектор"],
    "20007896": ["Ну же", "Скомпилируйся!"]
};

// Helper function to get or generate text for ANY template
function getMemeDefaultText(memeId, memeTitle) {
    if (MEME_CAPTIONS_DICTIONARY[memeId]) {
        return MEME_CAPTIONS_DICTIONARY[memeId];
    }
    const cleanTitle = (memeTitle || "МЕМ").toUpperCase();
    return [`КОГДА ${cleanTitle}`, "НО ВСЁ РАВНО РАБОТАЕТ!"];
}

// Helper to construct crisp SVG Meme Templates
function createSvgTemplate(type, title) {
    let svgContent = '';
    
    if (type === 'drake') {
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
            <rect width="800" height="800" fill="#0f172a"/>
            <!-- Top Panel: Reject -->
            <rect x="10" y="10" width="380" height="380" rx="12" fill="#ef4444"/>
            <text x="200" y="200" font-family="sans-serif" font-size="120" text-anchor="middle" fill="#ffffff">🙅‍♂️</text>
            <text x="200" y="320" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#ffffff">НЕТ / REJECT</text>
            <rect x="400" y="10" width="390" height="380" rx="12" fill="#1e293b" stroke="#334155" stroke-width="4"/>
            
            <!-- Bottom Panel: Approve -->
            <rect x="10" y="410" width="380" height="380" rx="12" fill="#10b981"/>
            <text x="200" y="600" font-family="sans-serif" font-size="120" text-anchor="middle" fill="#ffffff">👉</text>
            <text x="200" y="720" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#ffffff">ДА / APPROVE</text>
            <rect x="400" y="410" width="390" height="380" rx="12" fill="#1e293b" stroke="#334155" stroke-width="4"/>
        </svg>`;
    } else if (type === 'two_buttons') {
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
            <rect width="600" height="900" fill="#1e1b4b"/>
            <!-- Panel Header -->
            <rect x="20" y="20" width="560" height="400" rx="16" fill="#312e81" stroke="#6366f1" stroke-width="4"/>
            <!-- Button A -->
            <ellipse cx="180" cy="200" rx="110" ry="70" fill="#ef4444" stroke="#dc2626" stroke-width="6"/>
            <text x="180" y="210" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#ffffff">ОПЦИЯ А</text>
            <!-- Button B -->
            <ellipse cx="420" cy="200" rx="110" ry="70" fill="#ef4444" stroke="#dc2626" stroke-width="6"/>
            <text x="420" y="210" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#ffffff">ОПЦИЯ Б</text>
            <!-- Sweating Guy Panel -->
            <rect x="20" y="440" width="560" height="440" rx="16" fill="#0f172a"/>
            <text x="300" y="660" font-family="sans-serif" font-size="140" text-anchor="middle">😰</text>
            <text x="300" y="800" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle" fill="#94a3b8">СЛОЖНЫЙ ВЫБОР...</text>
        </svg>`;
    } else if (type === 'trade_offer') {
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
            <rect width="600" height="800" fill="#090d16"/>
            <!-- Title -->
            <rect x="30" y="30" width="540" height="80" rx="12" fill="#8b5cf6"/>
            <text x="300" y="82" font-family="Impact, sans-serif" font-size="42" text-anchor="middle" fill="#ffffff" letter-spacing="2">TRADE OFFER</text>
            <!-- Character -->
            <text x="300" y="340" font-family="sans-serif" font-size="160" text-anchor="middle">👔💼</text>
            <!-- Trade Box Left -->
            <rect x="30" y="460" width="250" height="300" rx="14" fill="#1e293b" stroke="#06b6d4" stroke-width="4"/>
            <text x="155" y="510" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#06b6d4">Я ПОЛУЧАЮ:</text>
            <!-- Trade Box Right -->
            <rect x="320" y="460" width="250" height="300" rx="14" fill="#1e293b" stroke="#ec4899" stroke-width="4"/>
            <text x="445" y="510" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#ec4899">ТЫ ПОЛУЧАЕШЬ:</text>
        </svg>`;
    } else if (type === 'cat_yelling') {
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
            <rect width="800" height="500" fill="#0f172a"/>
            <!-- Left Panel: Woman Screaming -->
            <rect x="15" y="15" width="375" height="470" rx="14" fill="#881337" stroke="#f43f5e" stroke-width="4"/>
            <text x="202" y="240" font-family="sans-serif" font-size="140" text-anchor="middle">👩‍🦰🗯️</text>
            <text x="202" y="400" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#ffffff">ОРАТЬ И ОБВИНЯТЬ</text>
            <!-- Right Panel: Confused Cat -->
            <rect x="410" y="15" width="375" height="470" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="4"/>
            <text x="597" y="240" font-family="sans-serif" font-size="140" text-anchor="middle">🐱🥗</text>
            <text x="597" y="400" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#ffffff">НЕПОНИМАЮЩИЙ КОТ</text>
        </svg>`;
    } else {
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
            <rect width="800" height="800" fill="#1e1b4b"/>
            <rect x="20" y="20" width="760" height="760" rx="20" fill="#0f172a" stroke="#8b5cf6" stroke-width="6"/>
            <circle cx="400" cy="360" r="160" fill="#312e81"/>
            <text x="400" y="400" font-family="sans-serif" font-size="160" text-anchor="middle">🗿</text>
            <text x="400" y="620" font-family="Impact, sans-serif" font-size="44" text-anchor="middle" fill="#8b5cf6">${title.toUpperCase()}</text>
        </svg>`;
    }

    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);
}

const MEME_PRESETS = [
    {
        id: "drake",
        name: "Drake Hotline Bling",
        url: "https://i.imgflip.com/30b1gx.jpg",
        fallbackUrl: createSvgTemplate('drake', 'Drake Hotline Bling'),
        width: 800,
        height: 800,
        box_count: 2,
        category: "classic",
        defaultText: getMemeDefaultText("drake", "Drake Hotline Bling")
    },
    {
        id: "two_buttons",
        name: "Two Buttons",
        url: "https://i.imgflip.com/1g8my4.jpg",
        fallbackUrl: createSvgTemplate('two_buttons', 'Two Buttons'),
        width: 600,
        height: 900,
        box_count: 3,
        category: "classic",
        defaultText: getMemeDefaultText("two_buttons", "Two Buttons")
    },
    {
        id: "distracted",
        name: "Distracted Boyfriend",
        url: "https://i.imgflip.com/1ur9b0.jpg",
        fallbackUrl: createSvgTemplate('default', 'Distracted Boyfriend'),
        width: 800,
        height: 600,
        box_count: 3,
        category: "classic",
        defaultText: getMemeDefaultText("distracted", "Distracted Boyfriend")
    },
    {
        id: "change_my_mind",
        name: "Change My Mind",
        url: "https://i.imgflip.com/24y43o.jpg",
        fallbackUrl: createSvgTemplate('default', 'Change My Mind'),
        width: 800,
        height: 600,
        box_count: 2,
        category: "classic",
        defaultText: getMemeDefaultText("change_my_mind", "Change My Mind")
    },
    {
        id: "cat_yelling",
        name: "Woman Yelling At Cat",
        url: "https://i.imgflip.com/345v97.jpg",
        fallbackUrl: createSvgTemplate('cat_yelling', 'Woman Yelling At Cat'),
        width: 800,
        height: 500,
        box_count: 2,
        category: "cats",
        defaultText: getMemeDefaultText("cat_yelling", "Woman Yelling At Cat")
    },
    {
        id: "trade_offer",
        name: "Trade Offer",
        url: "https://i.imgflip.com/54hjww.jpg",
        fallbackUrl: createSvgTemplate('trade_offer', 'Trade Offer'),
        width: 600,
        height: 800,
        box_count: 3,
        category: "reaction",
        defaultText: getMemeDefaultText("trade_offer", "Trade Offer")
    },
    {
        id: "disaster_girl",
        name: "Disaster Girl",
        url: "https://i.imgflip.com/23ls.jpg",
        fallbackUrl: createSvgTemplate('default', 'Disaster Girl'),
        width: 800,
        height: 600,
        box_count: 2,
        category: "classic",
        defaultText: getMemeDefaultText("disaster_girl", "Disaster Girl")
    },
    {
        id: "roll_safe",
        name: "Roll Safe Think About It",
        url: "https://i.imgflip.com/1h7in3.jpg",
        fallbackUrl: createSvgTemplate('default', 'Roll Safe'),
        width: 800,
        height: 600,
        box_count: 2,
        category: "reaction",
        defaultText: getMemeDefaultText("roll_safe", "Roll Safe Think About It")
    },
    {
        id: "buff_doge",
        name: "Buff Doge vs Cheems",
        url: "https://i.imgflip.com/43a45p.png",
        fallbackUrl: createSvgTemplate('default', 'Buff Doge vs Cheems'),
        width: 800,
        height: 600,
        box_count: 4,
        category: "cats",
        defaultText: getMemeDefaultText("buff_doge", "Buff Doge vs Cheems")
    },
    {
        id: "this_is_fine",
        name: "This Is Fine",
        url: "https://i.imgflip.com/wxica.jpg",
        fallbackUrl: createSvgTemplate('default', 'This Is Fine'),
        width: 800,
        height: 500,
        box_count: 2,
        category: "reaction",
        defaultText: getMemeDefaultText("this_is_fine", "This Is Fine")
    },
    {
        id: "batman_slap",
        name: "Batman Slapping Robin",
        url: "https://i.imgflip.com/9ehk.jpg",
        fallbackUrl: createSvgTemplate('default', 'Batman Slapping Robin'),
        width: 800,
        height: 600,
        box_count: 2,
        category: "classic",
        defaultText: getMemeDefaultText("batman_slap", "Batman Slapping Robin")
    },
    {
        id: "ancient_aliens",
        name: "Ancient Aliens",
        url: "https://i.imgflip.com/26am.jpg",
        fallbackUrl: createSvgTemplate('default', 'Ancient Aliens'),
        width: 800,
        height: 600,
        box_count: 2,
        category: "reaction",
        defaultText: getMemeDefaultText("ancient_aliens", "Ancient Aliens")
    }
];

const FUNNY_CAPTIONS = [
    { top: "КОГДА НАПИСАЛ КОД С ПЕРВОГО РАЗА", bottom: "И ОН РАБОТАЕТ БЕЗ ОШИБОК" },
    { top: "Я: ПРОСТО ИСПРАВЛЮ ОДНУ ОПЕЧАТКУ", bottom: "ПРОЕКТ: ПЕРЕСТАЕТ КОМПИЛИРОВАТЬСЯ" },
    { top: "ПЯТНИЦА 17:59", bottom: "ГОТОВ К ДЕПЛОЮ НА ПРОД" },
    { top: "СЕНЬОР СМОТРИТ МОЙ ПУЛЛ-РЕКВЕСТ", bottom: "142 КОММЕНТАРИЯ" },
    { top: "МОЙ МОЗГ В 3 ЧАСА НОЧИ", bottom: "А ЧТО ЕСЛИ ПЕРЕПИСАТЬ ВСЁ НА RUST?" },
    { top: "КОГДА НАШЕЛ РЕШЕНИЕ НА STACKOVERFLOW", bottom: "ОТВЕТ НАПИСАН В 2011 ГОДУ" },
    { top: "ДЖУНИОР ПОСЛЕ ПЕРВОГО ДНЯ", bottom: "Я ПОЧИНИЛ ВСЕ ПРЕДУПРЕЖДЕНИЯ В LINTER" },
    { top: "КОГДА СПРОСИЛ AI ПОЧЕМУ ОШИБКА", bottom: "AI: ИЗВИНИТЕ, Я ОШИБСЯ, ВОТ НОВАЯ ОШИБКА" }
];

const STICKERS_CATALOG = [
    { id: "thug_life", type: "emoji", value: "🕶️", label: "Thug Life" },
    { id: "fire", type: "emoji", value: "🔥", label: "Огонь" },
    { id: "joy", type: "emoji", value: "😂", label: "Смех" },
    { id: "rofl", type: "emoji", value: "🤣", label: "Ржу" },
    { id: "skull", type: "emoji", value: "💀", label: "Череп" },
    { id: "clown", type: "emoji", value: "🤡", label: "Клоун" },
    { id: "brain", type: "emoji", value: "🧠", label: "Мозг" },
    { id: "poop", type: "emoji", value: "💩", label: "Какашка" },
    { id: "sparkles", type: "emoji", value: "✨", label: "Искры" },
    { id: "crown", type: "emoji", value: "👑", label: "Корона" },
    { id: "eyes", type: "emoji", value: "👀", label: "Глаза" },
    { id: "exploding", type: "emoji", value: "🤯", label: "Взрыв мозга" },
    { id: "thinking", type: "emoji", value: "🤔", label: "Раздумья" },
    { id: "bug", type: "emoji", value: "🐛", label: "Баг" },
    { id: "rocket", type: "emoji", value: "🚀", label: "Ракета" },
    { id: "100", type: "emoji", value: "💯", label: "100 баллов" }
];
