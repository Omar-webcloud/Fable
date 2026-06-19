"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect personal information that you voluntarily provide to us when you register on the platform, purchase ebooks, or express interest in obtaining information about us or our products and services.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.",
    },
    {
      title: "3. Sharing Your Information",
      content:
        "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. This includes third-party processors like Stripe for handling secure payments.",
    },
    {
      title: "4. Data Security",
      content:
        "We aim to protect your personal information through a system of organizational and technical security measures. However, please also remember that we cannot guarantee that the internet itself is 100% secure.",
    },
    {
      title: "5. Your Privacy Rights",
      content:
        "Depending on your location, you may have rights under applicable data protection laws (such as GDPR or CCPA). These may include the right to request access, rectification, or erasure of your personal data.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-extrabold text-dark sm:text-5xl">
              Privacy <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Last updated: June 19, 2026
            </p>
          </motion.div>
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-12"
        >
          <div className="prose prose-purple max-w-none text-gray-600 space-y-8">
            <div>
              <p className="text-lg leading-relaxed font-medium text-dark">
                At Fable, we are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy policy, please contact us at support@fable.com.
              </p>
            </div>

            <hr className="border-gray-100" />

            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="space-y-3"
              >
                <h2 className="text-xl font-bold text-dark">{section.title}</h2>
                <p className="leading-relaxed text-gray-600">{section.content}</p>
              </motion.div>
            ))}

            <hr className="border-gray-100" />

            <div className="rounded-xl bg-purple-50 p-6 text-sm text-primary">
              <h3 className="font-bold mb-2">Updates to this Policy</h3>
              <p>
                We may update this privacy notice from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date and the updated version will be effective as soon as it is accessible.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
