const TELEGRAM_USERNAME = 'luchinson';

const profiles = [
  {
    name: 'Екатерина К.',
    initials: 'ЕК',
    role: 'Founder • HR Tech • Москва',
    bio: 'Строит B2B-сервис для HR-команд. Ищет партнёров для совместных запусков и интеграций.',
    tags: ['HR Tech', 'B2B', 'Партнёрства'],
    goals: ['Партнёры', 'Клиенты'],
    score: 92,
    telegram: '@ek_hrtech',
    matchOn: ['Партнёры']
  },
  {
    name: 'Илья С.',
    initials: 'ИС',
    role: 'BD • Event Agency • Санкт-Петербург',
    bio: 'Запускает деловые события и ищет клиентов и подрядчиков для новых форматов вовлечения.',
    tags: ['Event', 'B2B', 'Продажи'],
    goals: ['Клиенты', 'Партнёры'],
    score: 89,
    telegram: '@ilya_events',
    matchOn: ['Клиенты']
  },
  {
    name: 'Мария Т.',
    initials: 'МТ',
    role: 'Program Lead • Conference Team • Казань',
    bio: 'Собирает сильных спикеров и ищет людей, которые усиливают программу и опыт участников.',
    tags: ['Конференции', 'Спикеры', 'Программа'],
    goals: ['Спикеры', 'Партнёры'],
    score: 94,
    telegram: '@maria_program',
    matchOn: ['Спикеры']
  },
  {
    name: 'Андрей В.',
    initials: 'АВ',
    role: 'Angel Investor • SaaS • Екатеринбург',
    bio: 'Инвестирует в ранние B2B- и community-tech решения. Любит короткие понятные пилоты и метрики.',
    tags: ['Инвестиции', 'SaaS', 'Go-to-market'],
    goals: ['Инвесторы'],
    score: 91,
    telegram: '@andrey_seed',
    matchOn: ['Инвесторы']
  },
  {
    name: 'Наталья П.',
    initials: 'НП',
    role: 'Community Lead • B2B Club • Новосибирск',
    bio: 'Развивает бизнес-клуб и ищет инструменты, которые усиливают полезные знакомства и удержание участников.',
    tags: ['Комьюнити', 'Retention', 'Telegram'],
    goals: ['Клиенты', 'Партнёры'],
    score: 87,
    telegram: '@nataly_club',
    matchOn: ['Клиенты', 'Партнёры']
  }
];

let currentGoal = 'Партнёры';
let currentDeck = [];
let currentIndex = 0;
let stats = {
  viewed: 1,
  liked: 0,
  matched: 0,
  contacts: 0,
};

const byId = (id) => document.getElementById(id);

const form = byId('request-form');
const hint = byId('form-hint');
const goalGroup = byId('goal-group');
const activeGoalLabel = byId('active-goal-label');
const demoComment = byId('demo-comment');
const matchResult = byId('match-result');
const demoFinish = byId('demo-finish');

const statViewed = byId('stat-viewed');
const statLiked = byId('stat-liked');
const statMatched = byId('stat-matched');
const statContacts = byId('stat-contacts');

const demoAvatar = byId('demo-avatar');
const demoName = byId('demo-name');
const demoRole = byId('demo-role');
const matchScore = byId('match-score');
const demoTags = byId('demo-tags');
const demoBio = byId('demo-bio');
const matchName = byId('match-name');
const matchText = byId('match-text');
const matchContact = byId('match-contact');
const demoProfileCard = byId('demo-profile-card');

const normalizeTelegram = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

const sortDeckForGoal = (goal) => {
  return [...profiles].sort((a, b) => {
    const aRelevant = a.goals.includes(goal) ? 1 : 0;
    const bRelevant = b.goals.includes(goal) ? 1 : 0;
    if (aRelevant !== bRelevant) return bRelevant - aRelevant;
    return b.score - a.score;
  });
};

const updateStats = () => {
  statViewed.textContent = String(stats.viewed);
  statLiked.textContent = String(stats.liked);
  statMatched.textContent = String(stats.matched);
  statContacts.textContent = String(stats.contacts);
};

const hideOutcomeBlocks = () => {
  matchResult.classList.add('hidden');
  demoFinish.classList.add('hidden');
};

const renderProfile = () => {
  hideOutcomeBlocks();

  const profile = currentDeck[currentIndex];
  if (!profile) {
    demoProfileCard.classList.add('hidden');
    demoFinish.classList.remove('hidden');
    return;
  }

  demoProfileCard.classList.remove('hidden');
  activeGoalLabel.textContent = currentGoal;
  demoAvatar.textContent = profile.initials;
  demoName.textContent = profile.name;
  demoRole.textContent = profile.role;
  matchScore.textContent = `${profile.score}%`;
  demoBio.textContent = profile.bio;
  demoTags.innerHTML = profile.tags.map((tag) => `<span>${tag}</span>`).join('');
  demoComment.value = '';
};

const showMatch = (profile, withComment = false) => {
  const comment = demoComment.value.trim();
  matchResult.classList.remove('hidden');
  matchName.textContent = `Мэтч с ${profile.name}`;
  matchText.textContent = withComment && comment
    ? `Комментарий отправлен: «${comment}». Контакты открыты по взаимному интересу.`
    : 'Контакты открыты по взаимному интересу. Теперь можно продолжить общение уже вне сценария мэтчинга.';
  matchContact.textContent = `Telegram: ${profile.telegram}`;
};

const nextProfile = () => {
  currentIndex += 1;
  stats.viewed = Math.min(currentDeck.length, currentIndex + 1);
  updateStats();
  renderProfile();
};

const handleAction = (type) => {
  const profile = currentDeck[currentIndex];
  if (!profile) return;

  const isPositive = type === 'like' || type === 'comment';
  const isMatch = isPositive && profile.matchOn.includes(currentGoal);

  if (isPositive) {
    stats.liked += 1;
  }

  if (isMatch) {
    stats.matched += 1;
    stats.contacts += 1;
    updateStats();
    showMatch(profile, type === 'comment');
    window.setTimeout(nextProfile, 1150);
    return;
  }

  updateStats();
  nextProfile();
};

const resetDemo = (goal = currentGoal) => {
  currentGoal = goal;
  currentDeck = sortDeckForGoal(goal);
  currentIndex = 0;
  stats = { viewed: 1, liked: 0, matched: 0, contacts: 0 };
  updateStats();
  renderProfile();

  document.querySelectorAll('.goal-chip').forEach((button) => {
    button.classList.toggle('active', button.dataset.goal === goal);
  });
};

const initReveal = () => {
  const revealItems = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = (formData.get('name') || '').toString().trim();
  const company = (formData.get('company') || '').toString().trim();
  const telegram = normalizeTelegram((formData.get('telegram') || '').toString());
  const size = (formData.get('size') || '').toString().trim();
  const task = (formData.get('task') || '').toString().trim();

  if (!name || !company || !telegram || !size || !task) {
    hint.textContent = 'Пожалуйста, заполните все поля формы.';
    return;
  }

  const message = [
    'Здравствуйте! Хочу оставить заявку на подключение.',
    '',
    `Имя: ${name}`,
    `Компания / сообщество: ${company}`,
    `Telegram для связи: ${telegram}`,
    `Формат / размер: ${size}`,
    `Задача: ${task}`,
  ].join('\n');

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(message);
    }
  } catch (error) {
    console.warn('Clipboard copy failed:', error);
  }

  hint.textContent = 'Готово: открываем Telegram с подготовленным текстом заявки. Если сообщение не вставится автоматически, просто вставьте текст из буфера обмена.';

  const telegramUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
  window.open(telegramUrl, '_blank', 'noopener');
});

byId('skip-btn')?.addEventListener('click', () => handleAction('skip'));
byId('like-btn')?.addEventListener('click', () => handleAction('like'));
byId('comment-btn')?.addEventListener('click', () => handleAction('comment'));
byId('restart-demo')?.addEventListener('click', () => resetDemo(currentGoal));

goalGroup?.addEventListener('click', (event) => {
  const target = event.target.closest('.goal-chip');
  if (!target) return;
  resetDemo(target.dataset.goal);
});

document.querySelectorAll('.quick-comment').forEach((button) => {
  button.addEventListener('click', () => {
    demoComment.value = button.textContent.trim();
    demoComment.focus();
  });
});

initReveal();
resetDemo('Партнёры');
