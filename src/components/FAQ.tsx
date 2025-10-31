const FAQ = () => {
  const faqs = [
    {
      question: "Что если я не умею кодить?",
      answer: "Zero to Hero для тех, кто УЖЕ умеет кодить на базовом уровне. Если знаешь variables, loops, functions - достаточно. Команда научит остальному."
    },
    {
      question: "Что если у меня нет идеи?",
      answer: "Ever поможет найти идею на Day 1. Мы не строим \"еще одну соц.сеть\". Мы находим ТВОЮ проблему и решаем её."
    },
    {
      question: "А если я застряну в коде?",
      answer: "Tech Priest отвечает в течение 10 минут. Застрял? Пинг. Разбираемся. Двигаешься дальше. Никогда не остаешься один."
    },
    {
      question: "Что если я не успею за 2-3 недели?",
      answer: "Можем extend до 4 недель. Но 95% успевают. Секрет: Prisma режет scope агрессивно. MVP only. Shipping matters."
    },
    {
      question: "Что такое Mycelium Network?",
      answer: "Сообщество всех выпускников. Lifetime access. Находишь ко-фаундеров, партнеров, early users. 30% cohort #1 нашли со-founders."
    },
    {
      question: "Money-back guarantee - как работает?",
      answer: "Если ты follows процессу, но не shipping к концу cohort - полный возврат. Без вопросов. Мы уверены в системе."
    }
  ];

  return (
    <section className="py-20 px-6 bg-deep-purple" id="faq">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black text-center mb-12">
          <span className="neon-text-cyan">Частые</span>{' '}
          <span className="neon-text-pink">вопросы</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="bg-purple-950/40 backdrop-blur-sm rounded-xl p-6 border border-neon-cyan/30 hover:border-neon-cyan transition-all group"
            >
              <summary className="font-bold text-white cursor-pointer flex items-center justify-between">
                <span>{faq.question}</span>
                <span className="text-neon-cyan group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-purple-200 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
