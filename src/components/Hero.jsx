import { Link } from "react-router"
import Button from "./Button"

const Hero = () => {
    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="min-lg:h-[512px] min-sm:aspect-[1.875] relative rounded-2xl mx-auto flex justify-end items-center flex-col min-sm:py-20 px-4">
                <h1 className="min-lg:text-[50px]/[70px] text-[30px] sm:text-[40px] z-10 font-black pb-4 text-center dark:text-p4">
                    Your Medical Future <span className="text-secondary">Starts Here.</span>
                </h1>
                <p className="text-[18px] sm:text-[22px] font-medium pb-2 text-center dark:text-[#94ABC7]">
                    Understand medicine correctly, study smartly, and enter exams with confidence.
                </p>
                <p className="text-[16px] text-gray-500 pb-8 text-center max-w-2xl dark:text-gray-400">
                    We explain it simply... and get you to excellence with confidence.
                </p>
                <Link to="/courses">
                    <Button text={"Explore Courses"} />
                </Link>
            </div>
        </div>
    )
}

export default Hero
