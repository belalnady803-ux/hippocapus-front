import { journeySteps } from "../assets/data.jsx"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/context"

const WhyUs = () => {
    const { currentMode } = useTheme()
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black dark:text-p4 mb-4">My Hippocampus Journey</h2>
                    <p className="text-lg text-gray-600 dark:text-[#94ABC7]">Step by step towards medical excellence</p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical Connecting Line (Desktop) */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-blue-200 to-blue-100 dark:from-[#21262B] dark:via-blue-900 dark:to-[#21262B] transform -translate-x-1/2 hidden md:block rounded-full" />

                    {/* Vertical Connecting Line (Mobile) */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-blue-200 to-blue-100 dark:from-[#21262B] dark:via-blue-900 dark:to-[#21262B] transform -translate-x-1/2 block md:hidden rounded-full" />

                    {journeySteps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`flex flex-col md:flex-row items-center mb-16 last:mb-0 relative ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}
                        >
                            {/* Icon Node */}
                            <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white dark:bg-[#1C1F24] border-4 border-blue-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                                <img
                                    src={currentMode === "dark" ? step.darkIcon : step.icon}
                                    alt={step.title}
                                    className="w-8 h-8 dark:brightness-0 dark:invert"
                                />
                            </div>

                            {/* Content Side */}
                            <div className={`w-full md:w-1/2 px-4 pl-20 md:pl-4 ${index % 2 === 0 ? 'md:text-right md:pr-16 text-left' : 'md:text-left md:pl-16 text-left'
                                }`}>
                                <div className="bg-white dark:bg-[#21262B] p-6 rounded-2xl shadow-xl dark:border dark:border-dark-Cs hover:-translate-y-1 transition-transform duration-300">
                                    <h3 className="text-xl font-bold dark:text-p4 mb-2">{step.title}</h3>
                                    <p className="text-gray-600 dark:text-[#94ABC7]">{step.description}</p>
                                </div>
                            </div>

                            {/* Empty Side for alignment */}
                            <div className="w-full md:w-1/2"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhyUs
