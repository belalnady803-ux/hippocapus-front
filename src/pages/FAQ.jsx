import { faqData } from "../assets/data.jsx"
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';




const Faq = () => {
    const [id,setId] = useState(null)
  return (
    <section className="container pt-28">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black dark:text-p4 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-p3 dark:text-[#94ABC7]">
          Find answers to common questions about our courses, enrollment, technical support.
        </p>
      </div>
      <div>
        {faqData.map((data) => (
          <div key={data.heading} className="py-[20px]">
            <h3 className="text-[22px] font-bold dark:text-p4 mb-[16px]">{data.heading}</h3>
            <div className="flex flex-col gap-4">
              {data.questions.map((question) => {
                const isOpen = id === question.question;
                return (
                  <div key={question.question} className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-[#21262B]">
                    <button 
                      onClick={() => setId(isOpen ? null : question.question)}
                      className="w-full px-6 py-4 text-left transition-colors font-medium flex justify-between items-center"
                    >
                      <span className="dark:text-p4">{question.question}</span>
                      <span className="text-gray-500">{isOpen ? '▲' : '▼'}</span>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 300,
                            damping: 24
                          }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-gray-50 dark:bg-[#21262B]">
                            <ul className="list-disc list-inside text-gray-700 dark:text-[#94ABC7] space-y-2">
                              {question.answer
                                .split('.')
                                .filter(sentence => sentence.trim().length > 0)
                                .map((sentence, index) => (
                                  // We add the period back for display, ensuring each list item is a full sentence.
                                  <li key={index} className="list-none">{sentence.trim()}.</li>
                                ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Faq
