import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="p-8 font-sans">
      <h2 className="text-3xl font-bold mb-4">Privacy Policy</h2>
      <p className="text-sm text-gray-400 mb-6">
        Effective Date: 22 of May, 2024
      </p>

      <h3 className="text-xl font-semibold mb-2">Introduction</h3>
      <p className="mb-4">
        Welcome to stackText Pro! Your privacy is of utmost importance to us.
        This Privacy Policy outlines how we collect, use, and protect your
        personal information when you use our platform.
      </p>

      <h3 className="text-xl font-semibold mb-2">Information We Collect</h3>
      <p className="mb-4">We may collect the following types of information:</p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Personal Information:</strong> Information that can be used to
          identify you, such as your name, email address, and contact details.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about how you use our
          service, including your interactions and generated content.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">
        How We Use Your Information
      </h3>
      <p className="mb-4">Your information is used to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Provide and improve our services</li>
        <li>Personalize your experience</li>
        <li>Communicate with you about updates, promotions, and support</li>
        <li>Analyze usage patterns to enhance functionality</li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">Sharing Your Information</h3>
      <p className="mb-4">
        We do not share your personal information with third parties except:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>When required by law</li>
        <li>To protect our rights and safety</li>
        <li>
          With service providers who assist in our operations (under strict
          confidentiality agreements)
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">
        Security of Your Information
      </h3>
      <p className="mb-4">
        We implement industry-standard security measures to protect your data.
        However, no method of transmission over the Internet or electronic
        storage is 100% secure.
      </p>

      <h3 className="text-xl font-semibold mb-2">Your Choices</h3>
      <p className="mb-4">
        You have the right to access, update, or delete your personal
        information. You can also opt-out of receiving promotional
        communications from us.
      </p>

      <h3 className="text-xl font-semibold mb-2">Changes to This Policy</h3>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will notify you
        of any significant changes by posting the new policy on our website and
        updating the effective date.
      </p>

      <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us
        at [Insert Contact Information].
      </p>
    </div>
  );
};

export default PrivacyPolicy;
