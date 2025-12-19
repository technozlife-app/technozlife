import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Terms of Service | Technozlife",
  description:
    "Review the Terms of Service for Technozlife — account rules, permitted use, liability, and governing law.",
};

const effectiveDate = new Date().toLocaleDateString(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function TermsPage() {
  return (
    <LegalPage title='Terms of Service' effectiveDate={effectiveDate}>
      <p>
        These Terms of Service govern your access to and use of Technozlife's
        website and services. By using our services, you agree to these terms.
      </p>

      <h2 id='acceptance'>1. Acceptance of terms & eligibility</h2>
      <p>
        You must be at least the legal age in your jurisdiction to form a
        binding contract to use our services. By using the services, you affirm
        that you are eligible and agree to comply with these terms.
      </p>

      <h2 id='account'>2. Account creation and responsibilities</h2>
      <p>
        If you create an account, you are responsible for safeguarding your
        credentials and for any activity under your account. Notify us
        immediately if you suspect unauthorized access.
      </p>

      <h2 id='service'>3. Service description & permitted use</h2>
      <p>
        Technozlife provides platform services that may include tools for
        generating content and managing information. You agree to use the
        services only for lawful purposes and in accordance with these terms.
      </p>

      <h2 id='prohibited'>4. Prohibited activities</h2>
      <p>
        You must not misuse the services (e.g., committing fraud, distributing
        malware, infringing rights of others, or attempting to breach service
        security).
      </p>

      <h2 id='payments'>5. Payments & billing</h2>
      <p>
        If the service includes paid features, those terms (billing cycles,
        refunds, cancellations) will be described where applicable. Check the
        billing documentation for details.
      </p>

      <h2 id='ip'>6. Intellectual property & content ownership</h2>
      <p>
        Unless otherwise specified, we own or license the service's content, and
        you retain ownership of the content you upload. You grant us a license
        to operate the service and provide features.
      </p>

      <h2 id='disclaimer'>7. Disclaimers & limitation of liability</h2>
      <p>
        Our services are provided "as is" and "as available". To the fullest
        extent permitted by law, we disclaim warranties and limit liability for
        damages arising from use of the services.
      </p>

      <h2 id='termination'>8. Termination & suspension</h2>
      <p>
        We may suspend or terminate access for violations of these terms or
        other policies. Termination does not relieve you of obligations incurred
        before termination.
      </p>

      <h2 id='law'>9. Governing law & dispute resolution</h2>
      <p>
        These terms are governed by applicable law as described in this section.
        Disputes may be subject to arbitration or court proceedings depending on
        your jurisdiction and these terms.
      </p>

      <h2 id='changes'>10. Changes to terms & contact</h2>
      <p>
        We may update these terms. We will notify users of material changes and
        post the updated date. For questions about these terms, contact:{" "}
        <strong>legal@technozlife.com</strong>.
      </p>
    </LegalPage>
  );
}
