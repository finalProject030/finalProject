import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

const ContactForm = ({ darkMode }) => {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm(
      "Are you sure you want to send this email?"
    );
    if (!userConfirmed) {
      return;
    }

    emailjs
      .sendForm("service_300tnm8", "template_yimu61z", formRef.current, {
        publicKey: "GovCcuyinh4W8qXDf",
      })
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text);
          // Add any success message handling here
        },
        (error) => {
          console.error("Email sending failed:", error.text);
          // Add any error message handling here
        }
      );

    // Clear the form fields after submission (optional)
    formRef.current.reset();
  };

  return (
    <section id="contactUs" className={`bg-white dark:bg-gray-900`}>
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Contact Us
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          Got a technical issue? Want to send feedback about a beta feature?
          Need details about our Business plan? Let us know.
        </p>
        <form ref={formRef} onSubmit={sendEmail} className="space-y-8">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="user_name"
              className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${
                darkMode
                  ? "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                  : ""
              }`}
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${
                darkMode
                  ? "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                  : ""
              }`}
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className={`block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 ${
                darkMode
                  ? "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                  : ""
              }`}
              placeholder="Let us know how we can help you"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Your message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 ${
                darkMode
                  ? "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  : ""
              }`}
              placeholder="Leave a comment..."
            ></textarea>
          </div>
          <button
            type="submit"
            className={`py-3 px-6 text-sm font-medium text-center text-white rounded-lg bg-gray-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 ${
              darkMode
                ? "dark:bg-gray-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                : ""
            }`}
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
