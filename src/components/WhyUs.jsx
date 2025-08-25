import { whyHippocampus } from "../assets/data"
import { useTheme } from "../contexts/context"
const WhyUs = () => {
    const {currentMode} = useTheme()
  return (
            <div className="pt-12 pb-16">
                <div className="py-[40px]">
                    <p className="text-[36px]/[45px] font-black pb-4 dark:text-p4">
                        Why Hippocamps Acadmey ?
                    </p>
                    <p className="text-[16px] dark:text-p4 opacity-70">
                        Our courses are designed to meet the needs of busy medical professionals, offering flexibility and depth in various specialties.
                    </p>
                </div>
                <div className="flex flex-wrap gap-[12px]">
                    {whyHippocampus.map((item, index) => (
                        <div key={index} className="w-full min-lg:w-[calc(25%-12px)] min-md:w-[calc(50%-12px)] border-2 border-[#DBE0E5] dark:bg-[#21262B] dark:border-dark-Cs p-[16px] rounded-2xl transition-all duration-500 hvoer:translate-y-[30px] hover:scale-105 flex flex-col gap-4">
                            <img src={currentMode === "dark" ? item.darkIcon : item.lightIcon} className="w-[24px]"/>
                                <p className="dark:text-p4 text-p2 font-bold">{item.title}</p>
                                <p className=" text-[#637387] dark:text-[#94ABC7] slef-end">{item.text}</p>
                        </div>
                    )
                    )}
                </div>
            </div>
  )
}

export default WhyUs
