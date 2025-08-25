import { Link } from "react-router"
import Button from "./Button"

const Hero = () => {
    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="min-lg:h-[512px] min-sm:aspect-[1.875] relative rounded-2xl mx-auto flex justify-end items-center flex-col min-sm:py-20">
                <h1 className="min-lg:text-[40px]/[60px] text-[25px] sm:text-[30px] z-10 font-black pb-4 text-center">Unlock Your Future in <span className="text-primary">Medicine</span> with World-Class Courses Designed by Leading Experts</h1>
                <p className="text-[16px] pb-4 text-center">Gain expertise in specialized medical fields through our comprehensive online courses, designed for professionals seeking to enhance their skills and knowledge.</p>
                <Link to="/courses">
                    <Button text={"Explore Courses"} />
                </Link>
            </div>
        </div>
    )
}

export default Hero
