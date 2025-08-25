import { Outlet } from 'react-router'
import Header from "../components/Header"
import Context from '../contexts/context'
import Footer from '../components/Footer'
import ScrollToTop from "../components/scrollToTop"



const Layout = () => {
return (
    <Context>
        <ScrollToTop />
        <Header />
        <Outlet />
        <Footer />
    </Context> 
)
}

export default Layout
