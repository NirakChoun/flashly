import React, { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How accurate is the AI flashcard generation?",
      answer:
        "Our AI is trained on educational content and achieves 95%+ accuracy. You can always edit cards to match your preferences.",
    },
    {
      question: "What file formats can I upload?",
      answer:
        "We support PDF, DOCX, TXT files, and you can also paste text directly. More formats coming soon!",
    },
    {
      question: "Does spaced repetition really work?",
      answer:
        "Yes! Spaced repetition is scientifically proven to improve long-term retention by up to 200% compared to traditional studying.",
    },
    {
      question: "Can I use Flashly offline?",
      answer:
        "Yes, our mobile app allows you to download your flashcards for offline study sessions.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. All data is encrypted in transit and at rest. We never share your content with third parties.",
    },
  ];

  return (
    <section className="py-14 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-gray-300">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-xl border border-gray-700"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-750 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="text-white font-medium">{faq.question}</span>
                <span className="text-gray-400">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-4">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
