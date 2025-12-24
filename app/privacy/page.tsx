import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Privacy Policy | Technozlife",
  description:
    "Read Technozlife's Privacy Policy to learn what data we collect, how we use it, your rights, and how to contact us.",
};

const effectiveDate = new Date().toLocaleDateString(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function PrivacyPage() {
  return (
    <LegalPage title='Privacy Policy' effectiveDate={effectiveDate}>
      <p>
        At Technozlife, we are committed to protecting your privacy. This
        Privacy Policy explains how we collect, use, share, and protect your
        personal information when you use our Services.
      </p>

      <h2 id='scope'>1. Scope & applicability</h2>
      <p>
        This Policy applies to personal information collected through our
        website, applications, APIs, and other interactions where we refer to
        this Privacy Policy. It does not apply to third-party websites or
        services that may be linked from our Services.
      </p>

      <h2 id='what-we-collect'>2. Information we collect</h2>
      <h3 id='categories'>Categories of personal information</h3>
      <ul>
        <li>
          <strong>Account information:</strong> name, email, username, password
          (hashed), and profile information.
        </li>
        <li>
          <strong>Transactional information:</strong> payment details and
          billing address (processed by third-party payment processors).
        </li>
        <li>
          <strong>Usage data:</strong> analytics, logs, feature usage, and
          performance metrics.
        </li>
        <li>
          <strong>Device and connection data:</strong> IP address, browser type,
          operating system, and device identifiers.
        </li>
        <li>
          <strong>Communications:</strong> support requests, feedback, and other
          correspondence you send us.
        </li>
      </ul>

      <h2 id='how-we-use'>3. How we use your information</h2>
      <p>
        We use personal information to provide and improve the Services, process
        payments, communicate with you, personalize content, and comply with
        legal obligations. We may also use aggregated or de-identified data for
        analytics and research.
      </p>

      <h2 id='legal-basis'>4. Legal bases for processing (where applicable)</h2>
      <p>
        Where applicable (e.g., under GDPR), we process personal data on legal
        bases including performance of a contract, consent, compliance with
        legal obligations, and legitimate interests such as improving the
        Service and preventing fraud.
      </p>

      <h2 id='cookies'>5. Cookies & tracking technologies</h2>
      <p>
        We use cookies and similar technologies for authentication, security,
        analytics, and advertising. You can manage or disable cookies via your
        browser settings, but this may affect functionality.
      </p>

      <h2 id='sharing'>6. Sharing & disclosure</h2>
      <p>
        We share personal data with: (a) service providers who perform functions
        on our behalf (e.g., hosting, payments, analytics); (b) affiliates and
        subsidiaries; (c) law enforcement, regulators, or other third parties to
        comply with legal obligations or protect our rights; and (d) in
        connection with mergers, acquisitions or asset sales (with notice to
        affected users as required by law).
      </p>

      <h2 id='international'>7. International transfers</h2>
      <p>
        Your information may be transferred to, stored, or processed in
        countries outside your jurisdiction. We take steps to ensure an adequate
        level of protection for such transfers (e.g., standard contractual
        clauses or equivalent safeguards) where required by law.
      </p>

      <h2 id='retention'>8. Data retention</h2>
      <p>
        We retain personal data only for as long as necessary to fulfill the
        purposes described in this Policy and as required by law. Retention
        periods vary based on the type of information and legal requirements.
      </p>

      <h2 id='security'>9. Security measures</h2>
      <p>
        We implement reasonable technical and organizational measures to protect
        personal information from unauthorized access, disclosure, or misuse.
        However, no security system is perfect; we cannot guarantee absolute
        security.
      </p>

      <h2 id='rights'>10. Your rights & choices</h2>
      <p>
        Depending on your location, you may have rights to access, correct,
        delete, or port your personal data, and to object to or restrict certain
        processing. To exercise these rights, contact us at
        <strong> support@technozlife.com</strong>. We will respond to requests
        in accordance with applicable law.
      </p>

      <h2 id='children'>11. Children</h2>
      <p>
        Our Services are not directed to children under 13 (or higher age where
        local law requires). We do not knowingly collect personal information
        from children without parental consent. If we learn we have collected
        such information, we will take steps to remove it.
      </p>

      <h2 id='third-party-links'>12. Third-party services & links</h2>
      <p>
        Our Services may contain links to third-party sites. We are not
        responsible for the privacy practices of those sites. Please review
        their privacy policies before providing personal information.
      </p>

      <h2 id='policy-changes'>13. Changes to this Privacy Policy</h2>
      <p>
        We may update this Policy and will post the revised Policy with a new
        effective date. When required by law, we will provide notice of material
        changes.
      </p>

      <h2 id='contact'>14. Contact & complaints</h2>
      <p>
        If you have questions or concerns about this Policy or our practices,
        please contact us at <strong>support@technozlife.com</strong>. For EU
        residents, you may also have the right to lodge a complaint with a
        supervisory authority.
      </p>
    </LegalPage>
  );
}
