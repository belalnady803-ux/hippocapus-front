import { coursesData } from "../assets/data.tsx";
import useWhatsApp from '../Hooks/useWhatsApp';
import Button from "./Button.jsx";

const FeatureCourses = () => {
    const number = "966566292547"; // This should ideally be in an environment variable
    const { openWhatsApp } = useWhatsApp(number);
    const goToWhatsApp = (courseTitle) => {
        const message = `Hello, I want to enroll in the ${courseTitle} course. Could you please provide more details?`;
        openWhatsApp(message);
    }
    return (
        <section className="py-[40px]">
            <div className="py-[12px] text-center">
                <p className="text-[36px] font-extrabold dark:text-p4">
                    Our Popular Courses
                </p>
                <p className="text-[16px] text-[#637387] dark:text-[#94ABC7]">
                    Explore our top-rated courses designed to enhance your skills.
                </p>
            </div>
            <div className="grid grid-cols-1 min-md:grid-cols-2 min-lg:grid-cols-3 gap-[24px] justify-center pt-6">
                {coursesData.map((course) => (
                    <div
                        key={course.id}
                        className="w-full flex flex-col justify-between gap-4 bg-white dark:bg-[#21262B] shadow-lg rounded-lg overflow-hidden relative transition-transform hover:scale-105"
                    >
                        <img
                            loading="lazy"
                            src={course.image}
                            alt={course.title}
                            className="w-full h-[200px] object-cover"
                        />
                        <div className="p-4 flex flex-col gap-2 flex-grow">
                            <h3 className="dark:text-p4 text-p1 font-bold text-[20px]">
                                {course.title}
                            </h3>
                            <p className="text-[#5C708A] dark:text-[#94ABC7] text-[14px]">
                                {course.description}
                            </p>
                        </div>
                        <div className="self-center pb-4">
                            <Button
                                onClick={() => goToWhatsApp(course.title)}
                                text="Enroll Now"
                            >
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeatureCourses;
