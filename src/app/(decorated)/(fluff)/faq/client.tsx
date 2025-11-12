"use client";

import Link from "next/link";
import { useState } from "react";

const faqData = [
  {
    category: "Enrollment",
    faqs: [
      {
        question: "How do I enroll?",
        answer: "You can enroll online through our portal or visit us in person at the center.",
      },
      {
        question: "Are there any prerequisites?",
        answer: "No prerequisites. We welcome beginners and advanced learners alike.",
      },
    ],
  },
  {
    category: "Classes",
    faqs: [
      {
        question: "What languages do you offer?",
        answer: (
          <span>
            Check our{" "}
            <Link href="/courses" className="text-primary underline font-semibold">
              course browser
            </Link>{" "}
            for up to date information on all of our courses.
          </span>
        ),
      },
      {
        question: "Can I switch variants mid-module?",
        answer: "Yes, with approval from your instructor and the admin team.",
      },
    ],
  },
  {
    category: "Payments",
    faqs: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept credit cards, PayPal, and bank transfers.",
      },
      {
        question: "Is there a refund policy?",
        answer:
          "Refunds are available within the first two weeks of class with no questions asked.",
      },
    ],
  },
  {
    category: "Hybrid Learning",
    faqs: [
      {
        question: "How does hybrid learning work?",
        answer:
          "You can attend classes in-person or online, with all materials accessible digitally.",
      },
      {
        question: "What technology do I need for online classes?",
        answer: (
          <>
            <p>You’ll need:</p>
            <ul className="list-disc pl-5">
              <li>A stable internet connection</li>
              <li>A computer, tablet, or smartphone</li>
              <li>A headset or headphones with a mic</li>
            </ul>
          </>
        ),
      },
    ],
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState("");
  const toggleFaq = (idx: string) => {
    setOpenFaq(idx);
  };

  return (
    <section className="mx-auto max-w-4xl px-6 pt-24">
      <header className="mb-10">
        <h1 className="font-alsun-serif text-secondary text-4xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          Got questions? We’ve got answers. If you don’t see what you’re looking for, please{" "}
          <Link
            href="/contact"
            className="text-primary hover:text-primary underline transition-colors"
          >
            contact us
          </Link>
          .
        </p>
      </header>

      {faqData.map(({ category, faqs }) => (
        <div key={category} className="mb-16">
          <h2 className="font-alsun-serif border-primary mb-6 border-b pb-2 text-3xl font-semibold tracking-wide">
            {category}
          </h2>
          <div className="space-y-6">
            {faqs.map(({ question, answer }, i) => {
              const idx = `${category}-${i}`;
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  onClick={() => toggleFaq(idx)}
                  className="group hover:border-primary cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all select-none hover:shadow-lg"
                >
                  <h3 className="font-alsun-serif text-secondary group-hover:text-primary flex items-center justify-between text-xl font-semibold transition-colors">
                    {question}
                    <span>{isOpen ? "−" : "+"}</span>
                  </h3>
                  <div
                    className={`text-secondary mt-3 overflow-hidden text-base leading-relaxed transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
