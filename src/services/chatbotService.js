const faqs = require("../data/chatbotFaqs");

const categories = [...new Set(faqs.map((item) => item.category))];
const agentWords = ["agent", "human", "call", "support", "representative", "whatsapp", "phone", "talk"];

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
}

function answerQuestion({ message, selectedCategory = "", botAnswerCount = 0 }) {
  const text = normalize(message);
  if (!text) {
    return {
      answer: "Please type your question or choose a service category.",
      category: selectedCategory || "General Support",
      score: 0,
      recommendAgent: false,
      agentRequested: false,
      botAnswerCount
    };
  }

  if (agentWords.some((word) => text.includes(word))) {
    return {
      answer: "Sure. I can connect you with a live agent for personalised support.",
      category: selectedCategory || "General Support",
      score: 10,
      recommendAgent: true,
      agentRequested: true,
      botAnswerCount
    };
  }

  let best = null;
  for (const faq of faqs) {
    const categoryBoost = selectedCategory && faq.category === selectedCategory ? 1 : 0;
    const keywordScore = faq.keywords.reduce((score, keyword) => score + (text.includes(normalize(keyword)) ? 2 : 0), 0);
    const questionScore = normalize(faq.question).split(" ").reduce((score, word) => score + (word.length > 3 && text.includes(word) ? 1 : 0), 0);
    const score = keywordScore + questionScore + categoryBoost;
    if (!best || score > best.score) best = { ...faq, score };
  }

  const nextCount = botAnswerCount + 1;
  if (!best || best.score < 2) {
    return {
      answer: "I may need a little more detail. You can choose a service category or chat with a live agent.",
      category: selectedCategory || "General Support",
      score: best?.score || 0,
      recommendAgent: nextCount >= 6,
      agentRequested: false,
      botAnswerCount: nextCount
    };
  }

  return {
    answer: best.answer,
    category: best.category,
    question: best.question,
    score: best.score,
    recommendAgent: nextCount >= 6,
    agentRequested: false,
    botAnswerCount: nextCount
  };
}

module.exports = {
  answerQuestion,
  categories,
  faqs
};
