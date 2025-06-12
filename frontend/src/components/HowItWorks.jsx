import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Upload Your Materials",
      description:
        "Upload PDFs, documents, or paste your notes directly into Flashly",
      icon: "📄",
    },
    {
      step: "02",
      title: "AI Generates Cards",
      description:
        "Our AI analyzes your content and creates personalized flashcards automatically",
      icon: "🤖",
    },
    {
      step: "03",
      title: "Start Learning",
      description:
        "Review cards with spaced repetition and track your progress",
      icon: "🧠",
    },
  ];

  return (
    <section className="py-14 bg-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            How Flashly Works
          </h2>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-6xl mb-4">{item.icon}</div>
              <div className="text-cyan-400 font-bold text-sm mb-2">
                STEP {item.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
