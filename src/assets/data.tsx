import lightCurriculum from "./light curriculum.svg"
import darkCurriculum from "./dark curriculum.svg"
import lightSmallG from "./light small G.svg"
import darkSmallG from "./dark small G.svg"
import lightFlix from "./light fix.svg"
import darkFlix from "./dark flix.svg"
import lightSupport from "./light support.svg"
import darkSupport from "./dark support.svg"

// Course Images
import musculoskeletalImage from "./Musculoskeletal System.jpg";
import gastrointestinalImage from "./Gastrointestinal System.jpg";
import cardiopulmonaryImage from "./Cardiovascular System.jpg";

interface whyHippocampus  {
    lightIcon: string
    darkIcon: string
    title : string 
    text: string
}

interface courses {
    id:number
    image: string;
    keyWords: string[];
    title: string;
    description: string;
    duration: string;
    instructor: string;
    price: number;
    featured: boolean;
}
interface pages {
    name : string
    path : string
}
interface faqData {
    heading: string;
    questions: {
        question: string;
        answer: string;
    }[];
}

export const whyHippocampus:whyHippocampus[] = [
    {
        lightIcon : lightCurriculum,
        darkIcon: darkCurriculum,
        title : "Expert-Led Curriculum",
        text: "Learn from leading experts in your field, with a curriculum that blends theory and practical application.",
    },
    {
        lightIcon : lightSmallG,
        darkIcon: darkSmallG,
        title : "Small-Group Live Sessions",
        text: "Engage in interactive learning with small groups, led by expert instructors, fostering collaboration and personalized feedback.",
    },
    {
        lightIcon : lightFlix,
        darkIcon: darkFlix,
        title : "Flexible Video Access",
        text: "Access course materials and video lectures anytime, allowing you to study at your own pace and convenience.",
    },
    {
        lightIcon : lightSupport,
        darkIcon: darkSupport,
        title : "Personalized Support",
        text: "Receive dedicated support from our team of academic advisors and technical support staff, ensuring a smooth learning experience.",
    },
]

export const coursesData : courses[] = [
    {
        id:0,
        image: musculoskeletalImage,
        keyWords: ["musculoskeletal", "bones", "muscles", "joints", "orthopedics"],
        title: "Musculoskeletal Block",
        description: "Delve into the intricate anatomy, physiology, and common pathologies of the musculoskeletal system. This block covers bones, muscles, joints, and connective tissues, preparing you for clinical assessment and management of related conditions.",
        duration: "Varies", // You might want to define durations for each block
        instructor: "Expert Orthopedists", // Placeholder, you might link to actual instructors
        price: 3150,
        featured: true
    },
    {
        id:1,
        image: gastrointestinalImage,
        keyWords: ["gastrointestinal", "digestive system", "GI", "hepatology", "endoscopy"],
        title: "Gastrointestinal Block",
        description: "Explore the comprehensive functions of the digestive system, from esophagus to rectum, including liver, pancreas, and gallbladder. Understand common GI disorders, diagnostic techniques, and therapeutic approaches.",
        duration: "Varies",
        instructor: "Leading Gastroenterologists",
        price: 2800,
        featured: true
    },
    {
        id:2,
        image: cardiopulmonaryImage,
        keyWords: ["cardiopulmonary", "heart", "lungs", "cardiology", "pulmonology"],
        title: "Cardiopulmonary Block",
        description: "Master the complexities of the cardiovascular and respiratory systems. This block covers heart function, lung mechanics, common diseases like heart failure and asthma, and their integrated management.",
        duration: "Varies",
        instructor: "Cardiologists & Pulmonologists",
        price: 2450,
        featured: true
    },
];

export const pages:pages[] = [
    {
        name : "Home",
        path : "/"
    },
    {
        name : "Courses",
        path : "/courses"
    },
    {
        name : "FAQ",
        path : "/faq"
    },
    {
        name : "Contact",
        path : "/contact"
    }

]

export const faqData:faqData[] = [
    {
        heading: "General & Enrollment",
        questions: [
            {
                question : "What is Hippocampus?",
                answer : "Hippocampus is an online learning platform dedicated to providing high-quality courses designed to enhance your knowledge and skills. Our name is inspired by the part of the brain that is vital for learning and memory, reflecting our commitment to effective and lasting education."
            },
            {
                question : "Who are the courses for?",
                answer : "Our courses are designed for medical students at all stages of their studies, helping them excel through our unique and exceptional quality."
            },
            {
                question : "How do I enroll in a course?",
                answer : "To enroll, simply navigate to the course page you're interested in and click the 'Enroll Now' or 'Sign Up' button. You will be guided through a simple registration and payment process to get started."
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
                question : " What is the payment process to enrolling courses?",
                answer : "Payment must be made exclusively via bank transfer to either Al Rajhi Bank or the National Bank To Proceed : Please visit our Contact Page and reach out to our support team. Request the bank account details and specify which bank you prefer.After Transfer: Once the transfer is complete, kindly send us a screenshot of the transaction. Next Steps: Our team will give you access to the course you subscribed."
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
