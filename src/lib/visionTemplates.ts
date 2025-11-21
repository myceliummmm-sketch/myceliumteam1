export interface TemplateVariable {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'number';
  required: boolean;
  maxLength?: number;
  helpText?: string;
}

export interface VisionTemplate {
  id: string;
  stageNumber: 1 | 2 | 3 | 4;
  label: string;
  templateText: string;
  variables: TemplateVariable[];
  cardOutputFields: string[];
  exampleValues?: Record<string, string>;
}

export const STAGE_1_TEMPLATES: VisionTemplate[] = [
  {
    id: 'problem-audience',
    stageNumber: 1,
    label: 'Проблема целевой аудитории',
    templateText: 'Я заметил, что {target} постоянно сталкиваются с {problem}, потому что {reason}. Это стоит им {cost}.',
    variables: [
      { key: 'target', label: 'Целевая аудитория', placeholder: 'например: владельцы малого бизнеса', type: 'text', required: true },
      { key: 'problem', label: 'Проблема', placeholder: 'опишите главную боль', type: 'textarea', required: true },
      { key: 'reason', label: 'Причина', placeholder: 'почему эта проблема существует', type: 'textarea', required: true },
      { key: 'cost', label: 'Стоимость', placeholder: 'время/деньги/эмоции', type: 'text', required: true }
    ],
    cardOutputFields: ['ПРОБЛЕМА', 'КТО СТРАДАЕТ', 'МАСШТАБ', 'ПОЧЕМУ СЕЙЧАС']
  },
  {
    id: 'problem-time-waste',
    stageNumber: 1,
    label: 'Паттерн траты времени',
    templateText: 'Каждый день {count} людей тратят {time} на {action}, но результат всегда {outcome}.',
    variables: [
      { key: 'count', label: 'Количество людей', placeholder: 'например: 10000', type: 'number', required: true },
      { key: 'time', label: 'Время', placeholder: 'например: 2 часа', type: 'text', required: true },
      { key: 'action', label: 'Действие', placeholder: 'что они делают', type: 'textarea', required: true },
      { key: 'outcome', label: 'Негативный результат', placeholder: 'что идёт не так', type: 'textarea', required: true }
    ],
    cardOutputFields: ['ПРОБЛЕМА', 'КТО СТРАДАЕТ', 'МАСШТАБ']
  },
  {
    id: 'problem-existing-solutions',
    stageNumber: 1,
    label: 'Провал существующих решений',
    templateText: 'Существующие решения как {competitor1} и {competitor2} не работают, потому что они {failure}. Люди всё ещё страдают от {pain}.',
    variables: [
      { key: 'competitor1', label: 'Конкурент 1', placeholder: 'название продукта', type: 'text', required: true },
      { key: 'competitor2', label: 'Конкурент 2', placeholder: 'название продукта', type: 'text', required: true },
      { key: 'failure', label: 'Что не так', placeholder: 'почему они не работают', type: 'textarea', required: true },
      { key: 'pain', label: 'Боль', placeholder: 'от чего люди страдают', type: 'textarea', required: true }
    ],
    cardOutputFields: ['ПРОБЛЕМА', 'АЛЬТЕРНАТИВА СЕЙЧАС']
  },
  {
    id: 'problem-personal',
    stageNumber: 1,
    label: 'Личный опыт',
    templateText: 'Когда я сам столкнулся с {situation}, я понял что {insight}. Оказалось, что {scale}.',
    variables: [
      { key: 'situation', label: 'Ситуация', placeholder: 'опишите ваш опыт', type: 'textarea', required: true },
      { key: 'insight', label: 'Инсайт', placeholder: 'что вы поняли', type: 'textarea', required: true },
      { key: 'scale', label: 'Масштаб проблемы', placeholder: 'насколько это широко распространено', type: 'text', required: true }
    ],
    cardOutputFields: ['ПРОБЛЕМА', 'ИНСАЙТ', 'МАСШТАБ']
  }
];

export const STAGE_2_TEMPLATES: VisionTemplate[] = [
  {
    id: 'solution-like-but-for',
    stageNumber: 2,
    label: 'Аналогия с известным продуктом',
    templateText: 'Это как {known_product}, но для {audience}. Вместо {old_way}, мы делаем {new_way}.',
    variables: [
      { key: 'known_product', label: 'Известный продукт', placeholder: 'например: Uber', type: 'text', required: true },
      { key: 'audience', label: 'Ваша аудитория', placeholder: 'для кого', type: 'text', required: true },
      { key: 'old_way', label: 'Старый способ', placeholder: 'как делали раньше', type: 'textarea', required: true },
      { key: 'new_way', label: 'Новый способ', placeholder: 'как вы делаете', type: 'textarea', required: true }
    ],
    cardOutputFields: ['РЕШЕНИЕ', 'МАГИЯ', 'ДО', 'ПОСЛЕ']
  },
  {
    id: 'solution-result',
    stageNumber: 2,
    label: 'Желаемый результат',
    templateText: 'Представь, что ты можешь {result} всего за {timeaction}, используя {magic}. Больше не нужно {old_pain}.',
    variables: [
      { key: 'result', label: 'Желаемый результат', placeholder: 'чего добьётся пользователь', type: 'textarea', required: true },
      { key: 'timeaction', label: 'Время/действие', placeholder: '5 минут / один клик', type: 'text', required: true },
      { key: 'magic', label: 'Ваша магия', placeholder: 'что делает это возможным', type: 'textarea', required: true },
      { key: 'old_pain', label: 'Старая боль', placeholder: 'от чего избавляетесь', type: 'textarea', required: true }
    ],
    cardOutputFields: ['РЕШЕНИЕ', 'МАГИЯ', 'ДО', 'ПОСЛЕ']
  },
  {
    id: 'solution-tech-combo',
    stageNumber: 2,
    label: 'Комбинация технологий',
    templateText: 'Мы берём {tech1} и {tech2}, чтобы впервые дать возможность {capability}. Это невозможно было до {change}.',
    variables: [
      { key: 'tech1', label: 'Технология 1', placeholder: 'например: AI', type: 'text', required: true },
      { key: 'tech2', label: 'Технология 2', placeholder: 'например: blockchain', type: 'text', required: true },
      { key: 'capability', label: 'Что можно сделать', placeholder: 'новая возможность', type: 'textarea', required: true },
      { key: 'change', label: 'Что изменилось', placeholder: 'почему сейчас возможно', type: 'textarea', required: true }
    ],
    cardOutputFields: ['РЕШЕНИЕ', 'МАГИЯ', 'ПОЧЕМУ СЕЙЧАС']
  },
  {
    id: 'solution-x-for-y',
    stageNumber: 2,
    label: 'X для Y',
    templateText: '{template} для {use_case}',
    variables: [
      { key: 'template', label: 'Известный продукт', placeholder: 'Uber / Tinder / Duolingo', type: 'text', required: true },
      { key: 'use_case', label: 'Ваш кейс', placeholder: 'индустрия или применение', type: 'text', required: true }
    ],
    cardOutputFields: ['РЕШЕНИЕ', 'АНАЛОГИЯ']
  }
];

export const STAGE_3_TEMPLATES: VisionTemplate[] = [
  {
    id: 'value-help-achieve',
    stageNumber: 3,
    label: 'Помощь в достижении',
    templateText: 'Мы помогаем {who} достичь {outcome} за {time}, экономя {savings} по сравнению с {alternative}.',
    variables: [
      { key: 'who', label: 'Кому', placeholder: 'целевая аудитория', type: 'text', required: true },
      { key: 'outcome', label: 'Результат', placeholder: 'что достигнут', type: 'textarea', required: true },
      { key: 'time', label: 'Время', placeholder: 'за сколько', type: 'text', required: true },
      { key: 'savings', label: 'Экономия', placeholder: 'время/деньги', type: 'text', required: true },
      { key: 'alternative', label: 'Альтернатива', placeholder: 'с чем сравниваем', type: 'text', required: true }
    ],
    cardOutputFields: ['ЦЕННОСТЬ', 'ИЗМЕРЯЕМ УСПЕХ', 'АЛЬТЕРНАТИВА СЕЙЧАС']
  },
  {
    id: 'value-vs-old',
    stageNumber: 3,
    label: 'Против старого решения',
    templateText: 'Вместо того чтобы платить ${old_price} за {old_solution}, пользователь получает {result} за ${new_price}, потому что {reason}.',
    variables: [
      { key: 'old_price', label: 'Старая цена', placeholder: 'число', type: 'number', required: true },
      { key: 'old_solution', label: 'Старое решение', placeholder: 'что было раньше', type: 'text', required: true },
      { key: 'result', label: 'Результат', placeholder: 'что получает пользователь', type: 'textarea', required: true },
      { key: 'new_price', label: 'Ваша цена', placeholder: 'число', type: 'number', required: true },
      { key: 'reason', label: 'Причина', placeholder: 'почему дешевле', type: 'textarea', required: true }
    ],
    cardOutputFields: ['ЦЕННОСТЬ', 'АЛЬТЕРНАТИВА СЕЙЧАС', 'ГОТОВЫ ПЛАТИТЬ']
  },
  {
    id: 'value-metrics',
    stageNumber: 3,
    label: 'Метрики пользователя',
    templateText: 'Наш пользователь готов платить, потому что: экономит {hours} часов в {period}, зарабатывает на {percent}% больше, избавляется от {pain}.',
    variables: [
      { key: 'hours', label: 'Часы', placeholder: 'число', type: 'number', required: true },
      { key: 'period', label: 'Период', placeholder: 'неделю/месяц', type: 'text', required: true },
      { key: 'percent', label: 'Процент', placeholder: 'число', type: 'number', required: true },
      { key: 'pain', label: 'Боль', placeholder: 'от чего избавляется', type: 'textarea', required: true }
    ],
    cardOutputFields: ['ЦЕННОСТЬ', 'ИЗМЕРЯЕМ УСПЕХ', 'ГОТОВЫ ПЛАТИТЬ']
  },
  {
    id: 'value-success-metric',
    stageNumber: 3,
    label: 'Метрика успеха',
    templateText: 'Success = когда пользователь {metric}. Мы измеряем это через {measurement}.',
    variables: [
      { key: 'metric', label: 'Метрика', placeholder: 'что считаем успехом', type: 'textarea', required: true },
      { key: 'measurement', label: 'Как измеряем', placeholder: 'способ измерения', type: 'textarea', required: true }
    ],
    cardOutputFields: ['ЦЕННОСТЬ', 'ИЗМЕРЯЕМ УСПЕХ']
  }
];

export const STAGE_4_TEMPLATES: VisionTemplate[] = [
  {
    id: 'vision-world-where',
    stageNumber: 4,
    label: 'Мир, где...',
    templateText: 'Мы создаём мир, где {audience} могут {future}, не беспокоясь о {old_problem}.',
    variables: [
      { key: 'audience', label: 'Целевая аудитория', placeholder: 'кто', type: 'text', required: true },
      { key: 'future', label: 'Желаемое будущее', placeholder: 'что они смогут делать', type: 'textarea', required: true },
      { key: 'old_problem', label: 'Старая проблема', placeholder: 'от чего они свободны', type: 'textarea', required: true }
    ],
    cardOutputFields: ['VISION', 'MISSION']
  },
  {
    id: 'vision-by-year',
    stageNumber: 4,
    label: 'К 2030 году',
    templateText: 'К 2030 году каждый {who} будет иметь доступ к {what}, потому что мы сделали {change}.',
    variables: [
      { key: 'who', label: 'Кто', placeholder: 'целевая группа', type: 'text', required: true },
      { key: 'what', label: 'Что', placeholder: 'доступ к чему', type: 'textarea', required: true },
      { key: 'change', label: 'Что изменили', placeholder: 'ваш вклад', type: 'textarea', required: true }
    ],
    cardOutputFields: ['VISION', 'MISSION', 'НАСЛЕДИЕ']
  },
  {
    id: 'vision-we-believe',
    stageNumber: 4,
    label: 'Мы верим',
    templateText: 'Мы верим, что {belief}. Поэтому мы {daily_action} каждый день, чтобы {long_term}.',
    variables: [
      { key: 'belief', label: 'Убеждение', placeholder: 'во что вы верите', type: 'textarea', required: true },
      { key: 'daily_action', label: 'Ежедневное действие', placeholder: 'что делаете каждый день', type: 'textarea', required: true },
      { key: 'long_term', label: 'Долгосрочный эффект', placeholder: 'к чему это приведёт', type: 'textarea', required: true }
    ],
    cardOutputFields: ['VISION', 'MISSION']
  },
  {
    id: 'vision-imagine-5-years',
    stageNumber: 4,
    label: 'Мир через 5 лет',
    templateText: 'Представь мир через 5 лет: {future_description}. Это возможно, потому что {what_built}.',
    variables: [
      { key: 'future_description', label: 'Описание будущего', placeholder: 'как выглядит мир', type: 'textarea', required: true },
      { key: 'what_built', label: 'Что ты построил', placeholder: 'ваш продукт/платформа', type: 'textarea', required: true }
    ],
    cardOutputFields: ['VISION', 'НАСЛЕДИЕ']
  }
];

export const ALL_VISION_TEMPLATES = {
  1: STAGE_1_TEMPLATES,
  2: STAGE_2_TEMPLATES,
  3: STAGE_3_TEMPLATES,
  4: STAGE_4_TEMPLATES
};

export function interpolateTemplate(template: VisionTemplate, values: Record<string, string>): string {
  let result = template.templateText;
  Object.keys(values).forEach(key => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), values[key]);
  });
  return result;
}

export const EVER_GREEN_TIPS = {
  1: [
    "Don't worry about perfection. Pick the template that feels closest to your situation.",
    "The best problem statements are specific. 'People can't find parking' beats 'parking is hard'.",
    "If you're stuck between templates, trust your gut. You can always refine later."
  ],
  2: [
    "Your solution should sound exciting even to YOU. If you're bored, investors will be too.",
    "Analogies help: 'Uber for X' works because everyone gets it instantly.",
    "Focus on the transformation: BEFORE user was frustrated → AFTER user is empowered."
  ],
  3: [
    "Value isn't what you build, it's what users GAIN. Time saved? Money made? Stress avoided?",
    "Quantify everything. '10 hours saved per week' beats 'saves time'.",
    "Your alternative is your enemy. What do users suffer with today?"
  ],
  4: [
    "Vision statements aren't marketing fluff—they're your North Star when you're lost.",
    "Think 5 years ahead. What world do you want to create?",
    "Great visions inspire YOU first, your team second, investors third."
  ]
};

export function getVisionStageLabel(stageNumber: 1 | 2 | 3 | 4): string {
  const labels = {
    1: 'Problem Discovery',
    2: 'Solution Concept',
    3: 'Value Definition',
    4: 'Vision Statement'
  };
  return labels[stageNumber];
}
