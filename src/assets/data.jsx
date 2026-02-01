import lightCurriculum from "./light curriculum.svg"
import darkCurriculum from "./dark curriculum.svg"
import lightSmallG from "./light small G.svg"
import darkSmallG from "./dark small G.svg"
import lightFlix from "./light flix.svg"
import darkFlix from "./dark flix.svg"
import lightSupport from "./light support.svg"
import darkSupport from "./dark support.svg"


export const journeySteps = [
    {
        title: "Crystal Clear Explanations",
        description: "High-quality recorded lectures that simplify complex medical concepts, ensuring you understand, not just memorize.",
        icon: lightCurriculum,
        darkIcon: darkCurriculum,
    },
    {
        title: "Weekly Live Interactive Sessions",
        description: "Join weekly live sessions with the doctor to review materials, solve questions, and clarify doubts in real-time.",
        icon: lightSmallG,
        darkIcon: darkSmallG,
    },
    {
        title: "Comprehensive Study Materials",
        description: "Access organized, translated PDF notes and A3 summary sheets for every lecture to streamline your revision.",
        icon: lightFlix,
        darkIcon: darkFlix,
    },
    {
        title: "Master with Question Banks",
        description: "Test your knowledge with extensive question banks for every lecture, designed to mirror real exam scenarios.",
        icon: lightSupport,
        darkIcon: darkSupport,
    },
    {
        title: "Continuous Follow-up",
        description: "Stay on track with regular follow-up tests to ensure you are always ready for your exams.",
        icon: lightCurriculum,
        darkIcon: darkCurriculum,
    },
    {
        title: "Rewards for Excellence",
        description: "We celebrate success! Top achievers winning prizes and recognition for their hard work.",
        icon: lightSmallG,
        darkIcon: darkSmallG,
    },
];

export const pages = [
    {
        name: "Home",
        path: "/"
    },
    {
        name: "Courses",
        path: "/courses"
    },
    {
        name: "FAQ",
        path: "/faq"
    },
    {
        name: "Contact",
        path: "/contact"
    }

]

export const faqData = [
    {
        heading: "General & Enrollment",
        questions: [
            {
                question: "What is Hippocampus?",
                answer: "Hippocampus is an online learning platform dedicated to providing high-quality courses designed to enhance your knowledge and skills. Our name is inspired by the part of the brain that is vital for learning and memory, reflecting our commitment to effective and lasting education."
            },
            {
                question: "Who are the courses for?",
                answer: "Our courses are designed for medical students at all stages of their studies, helping them excel through our unique and exceptional quality."
            },
            {
                question: "How do I enroll in a course?",
                answer: "To enroll, simply navigate to the course page you're interested in and click the 'Enroll Now' or 'Sign Up' button. You will be guided through a simple registration and payment process to get started."
            },
        ]
    },
    {
        // New heading and questions
        heading: "Course Experience & Features",
        questions: [
            {
                question: "What features does your platform offer to students?",
                answer: "We provide a comprehensive educational offering that includes: Live-streamed videos and high-quality recorded videos, available on our website.Embedded 3D designs within the videos to enhance demonstrations and visually clarify explanations.Accompanying question banks and interactive quizzes to support active learning and self-assessment.Competitions with prizes, designed to engage and motivate learners through a fun and rewarding experience"
            },
            {
                question: "Can I interact with instructors and other students?",
                answer: "Each course has a dedicated discussion forum where you can ask questions, share your work, and connect with both your peers and the course instructor. We believe in the power of community learning."
            },
            {
                question: "Can I access courses on my mobile device?",
                answer: "Our platform is fully responsive, meaning you can access your courses and learn on any device, whether it's a desktop, tablet, or smartphone."
            }
        ]
    },
    {
        heading: "Payment & Support",
        questions: [
            {
                question: " What is the payment process to enrolling courses?",
                answer: "Payment must be made exclusively via bank transfer to either Al Rajhi Bank or the National Bank To Proceed : Please visit our Contact Page and reach out to our support team. Request the bank account details and specify which bank you prefer.After Transfer: Once the transfer is complete, kindly send us a screenshot of the transaction. Next Steps: Our team will give you access to the course you subscribed."
            },
            {
                question: "Can I access the course material after I finish?",
                answer: "You will have access to the courses you have registered for until the end of the semester."
            },
            {
                question: "I'm having a technical issue. Who can I contact?",
                answer: "If you encounter any technical difficulties, please visit our 'Support' page and fill out the contact form. Our dedicated technical support team will get back to you within 24 hours to assist you."
            }
        ]
    }
];
