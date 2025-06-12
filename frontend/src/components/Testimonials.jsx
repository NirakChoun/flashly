import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Medical Student",
      content:
        "Flashly cut my study time in half! The AI-generated cards are incredibly accurate and help me focus on what matters.",
      avatar: "👩‍⚕️",
    },
    {
      name: "Marcus Johnson",
      role: "Law Student",
      content:
        "The spaced repetition feature is game-changing. I actually remember what I study now instead of cramming and forgetting.",
      avatar: "👨‍💼",
    },
    {
      name: "Emily Rodriguez",
      role: "Engineering Student",
      content:
        "Being able to upload my lecture PDFs and get instant flashcards saves me hours every week. Love the mobile app too!",
      avatar: "👩‍💻",
    },
  ];

  return (
    <section className="py-14 bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Loved by Students Worldwide
          </h2>
          <p className="mt-3 text-gray-300">
            Join thousands of students who are studying smarter with Flashly
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{item.avatar}</div>
                <div>
                  <h4 className="text-white font-semibold">{item.name}</h4>
                  <p className="text-gray-400 text-sm">{item.role}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"{item.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
