// import FeatureCourses from "../components/FeatureCourses"
import Hero from "../components/Hero"
import WhyUs from "../components/WhyUs"
import Announcements from "../components/Announcements"
import SEO from "../components/SEO"

const Home = () => {
    return (
        <main className="container">
            <SEO
                description="Master complex medical topics with Hippocampus. High-yield courses for future doctors."
            />
            <Hero />
            <WhyUs />
            <Announcements />
        </main>
    )
}

export default Home
