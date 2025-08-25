import { Link , useLoaderData } from "react-router";
import {useState} from "react"
import { useNavigate } from "react-router";
import { FaCircleExclamation } from "react-icons/fa6";
import { useAuthStore } from "../store/authStore";
import clsx from "clsx";
import loginPhoto from "../assets/login bg.jpg"
import Button from "../components/Button";
export function loader({request}){
    const message = new URL(request.url).searchParams.get("message")
    return message
}
const Login = () => {
    const {login, isLoading, error} = useAuthStore()
    const message = useLoaderData()
    const navigate = useNavigate();
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState ("")
    const handleLoginIn = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };
    return (
        <section className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-screen pt-28">
            <div className="flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full relative">
            {message && <h2 className="text-red-700 font-bold py-4 text-2xl">{message}</h2>}
            <h1 className="text-4xl font-bold text-p2 dark:text-p4 mb-2">
                Welcome back!
            </h1>
            <p className="text-p3 dark:text-[#94ABC7] mb-2">
                Enter your credentials to access your account.
            </p>
            <div className="absolute w-full dark:bg-[] bg-p1 my-4">
            </div>
            <form className="flex flex-col gap-4 pt-8 pb-2" onSubmit={handleLoginIn}>
                <div>
                <label
                    htmlFor="email-input"
                    className="block text-sm font-medium text-p3 dark:text-[#94ABC7] mb-1"
                >
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email-input"
                    required
                    className={clsx("w-full px-4 py-2 border border-[#DBE0E5] dark:border-dark-Cs rounded-lg bg-p4 dark:bg-[#21262B] focus:outline-none focus:ring-2 focus:ring-p1 dark:focus:ring-s2 dark:text-p4",error && "border-red-500")}
                    placeholder="email@example.com"
                    onChange={(e)=> {
                        setEmail(e.currentTarget.value)
                    }}
                />
                </div>
                <div>
                <label
                    htmlFor="pass-input"
                    className="block text-sm font-medium text-p3 dark:text-[#94ABC7] mb-1"
                >
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="pass-input"
                    className={clsx("w-full px-4 py-2 border border-[#DBE0E5] dark:border-dark-Cs rounded-lg bg-p4 dark:bg-[#21262B] focus:outline-none focus:ring-2 focus:ring-p1 dark:focus:ring-s2 dark:text-p4",error && "border-red-500")}
                    placeholder="Enter your password"
                    onChange={(e)=> {
                        setPassword(e.currentTarget.value)
                    }}
                />
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    text = {isLoading ? "Submitting..." :"log in"} >
                </Button>
            </form>
            {error && <div className="flex gap-4 items-center pl-4">
                    <FaCircleExclamation  className="text-red-500"/>
                    <p className="text-red-500">{error}</p>
                </div>}
            <div className="text-center mt-6 text-sm">
                <p className="text-p3 dark:text-[#94ABC7]">
                Not a member?{" "}
                <Link to="/signup" className="font-semibold text-p2 dark:text-p1 hover:underline">
                    Register now
                </Link>
                </p>
            </div>
            </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
            {/* Your illustration or image component goes here */}
                <div className="w-full  rounded-lg flex items-center justify-center">
                    <img src={loginPhoto} alt="loginPhoto"  className="rounded-2xl"/>
                </div>
            </div>
        </section>
    );
};

export default Login;