import LegalPage from "@/components/legal/LegalPage"

export const metadata = {
  title: "Privacy Policy | Technozlife",
  description:
    "Read Technozlife's Privacy Policy to learn what data we collect, how we use it, your rights, and how to contact us.",
}

const effectiveDate = new Date().toLocaleDateString(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate={effectiveDate}>
      <p>
        This Privacy Policy explains how Technozlife collects, uses, discloses, and protects your personal
        information. It applies to all users of our website and services.
      </p>

      <h2 id="what-we-collect">1. What information we collect</h2>
      <p>
        We may collect information you provide directly (such as account information and communications) and
        information collected automatically (such as analytics and cookies). When you interact with our services,
        we may collect data necessary to provide and improve the product.
      </p>

      <h2 id="how-we-use">2. How we use your information</h2>
      <p>
        We use collected information to provide, maintain, and improve our services, to communicate with you, and
        to comply with legal obligations. We may also use data for research and analytics to understand and improve
        user experience.
      </p>

      <h2 id="cookies">3. Cookies and tracking technologies</h2>
      <p>
        We use cookies and similar technologies to provide core functionality and to understand how our site is
        used. You can control cookie preferences through your browser settings. For more details, check the Cookies
        &amp; Tracking section and our cookie policy (if available).
      </p>

      <h2 id="third-parties">4. Third-party services and integrations</h2>
      <p>
        We may share information with third-party service providers to support our services (e.g., analytics,
        hosting, payment processors). These providers are bound by contractual obligations to protect your data.
      </p>

      <h2 id="retention">5. Data retention and security</h2>
      <p>
        We retain personal data for as long as needed to fulfill the purposes outlined in this policy. We implement
        reasonable security measures to protect data, but no system is completely secure.
      </p>

      <h2 id="rights">6. Your choices &amp; rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or delete your personal information. To
        exercise these rights or for privacy inquiries, contact us using the information below.
      </p>

      <h2 id="changes">7. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post the updated policy here and change the effective
        date accordingly.
      </p>

      <h2 id="contact">8. Contact information</h2>
      <p>
        For privacy-related questions, please contact: <strong>privacy@technozlife.com</strong>.
      </p>
    </LegalPage>
  )
}
