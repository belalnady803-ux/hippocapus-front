import { useState } from "react";
import Button from "../components/Button";
import { API_URL } from '../store/authStore';
import SEO from "../components/SEO";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
        throw new Error("All fields are required.");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address.");
      }

      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send message.");
      }
      setSuccessMessage("✅ Your message has been received. We'll get back to you soon!");
      setFormData({ fullName: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input style
  const inputClasses =
    "block w-full rounded-xl border border-gray-300 bg-white shadow-sm " +
    "focus:ring-2 focus:ring-p1 sm:text-sm p-3 outline-none " +
    "dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-p4 " +
    "transition-colors duration-300";

  return (
    <main className="container mx-auto py-20 px-4 lg:px-12">
      <SEO
        title="Contact Us"
        description="Get in touch with the Hippocampus team. We are here to help."
      />
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold dark:text-p4 mb-4">Get in Touch</h1>
        <p className="text-lg text-p3 dark:text-[#94ABC7] max-w-2xl mx-auto">
          We're here to help. If you have any questions, please don’t hesitate to reach out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Column 1: Form */}
        <div className="bg-white dark:bg-[#1C1F24] p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold dark:text-p4 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 dark:text-[#94ABC7] mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-[#94ABC7] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-600 dark:text-[#94ABC7] mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="e.g., Course Inquiry"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-600 dark:text-[#94ABC7] mb-2">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={inputClasses}
                placeholder="Your message here..."
              />
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="p-3 text-sm text-green-700 rounded-lg bg-green-100 dark:bg-green-900/50 dark:text-green-300">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="p-3 text-sm text-red-700 rounded-lg bg-red-100 dark:bg-red-900/50 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            <div>
              <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-3 rounded-xl"
                text={isSubmitting ? "Sending..." : "Send Message"}>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
