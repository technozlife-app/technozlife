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
        These Terms of Service ("Terms") govern your access to and use of the
        Technozlife website, applications, APIs, and other products or services
        (collectively, the "Services"). By accessing or using the Services, you
        agree to be bound by these Terms. If you do not agree, do not use the
        Services.
      </p>

      <h2 id='definitions'>1. Definitions</h2>
      <p>
        For the purposes of these Terms, "User", "you", or "your" means any
        natural person or legal entity using the Services. "Technozlife",
        "Company", "we", "our", or "us" refers to the operator of the Services.
      </p>

      <h2 id='acceptance'>2. Acceptance of terms & eligibility</h2>
      <p>
        You represent and warrant that you are at least the minimum legal age to
        form a binding contract in your jurisdiction and have the authority to
        enter into these Terms. Organizations using the Services represent that
        they are authorized to bind their employees and contractors to these
        Terms.
      </p>

      <h2 id='account'>3. Account creation and responsibilities</h2>
      <p>
        To access certain features, you may be required to register for an
        account. You are responsible for maintaining the confidentiality of your
        account credentials and for all activity on your account. You must
        notify us immediately of any unauthorized use or breach of security.
      </p>

      <h3 id='account-accuracy'>Account information</h3>
      <p>
        You agree to provide accurate and complete information and to keep it
        updated. We may suspend or terminate accounts that use false or
        misleading information.
      </p>

      <h2 id='license-grant'>4. User Content & license grant</h2>
      <p>
        "User Content" means any content you submit, post, or display through
        the Services. You retain ownership of your User Content. By submitting
        User Content, you grant Technozlife a worldwide, non-exclusive,
        royalty-free, sublicensable license to use, reproduce, modify, publish,
        and distribute the content in connection with operating and improving
        the Services.
      </p>

      <h2 id='permitted-use'>5. Permitted use & restrictions</h2>
      <p>
        You may use the Services only for lawful purposes and in accordance with
        these Terms and applicable law. You agree not to: (a) infringe the
        intellectual property or privacy rights of others; (b) transmit malware
        or malicious code; (c) attempt to reverse engineer or tamper with the
        Services; or (d) use the Services to send unsolicited communications.
      </p>

      <h2 id='payments'>6. Fees, billing, and subscriptions</h2>
      <p>
        Certain features may be subject to fees. If you purchase a subscription
        or paid service, you agree to provide current, complete, and accurate
        billing information. Fees are non-refundable unless otherwise stated in
        writing. We may change fees or payment terms with notice as required by
        law.
      </p>

      <h3 id='refunds'>Refunds & cancellations</h3>
      <p>
        Cancellation and refund policies are described in the billing
        documentation. We may offer free trials; we reserve the right to limit
        or terminate trial offers at our discretion.
      </p>

      <h2 id='third-party'>7. Third-party services</h2>
      <p>
        The Services may integrate third-party services (payment processors,
        analytics, or APIs). Your use of third-party features is governed by the
        third party's terms and policies. We are not responsible for third party
        functionality, availability, or privacy practices.
      </p>

      <h2 id='intellectual-property'>8. Intellectual property</h2>
      <p>
        The Services and all associated intellectual property rights (including
        software, designs, text, and graphics) are owned by Technozlife or its
        licensors. You are granted only the limited rights and licenses set out
        in these Terms.
      </p>

      <h2 id='dmca'>9. Copyright policy (DMCA)</h2>
      <p>
        We respect copyright law. If you believe your content has been used in a
        way that constitutes copyright infringement, please send a written
        notice to our Designated Agent at: support@technozlife.com with the
        following information: (a) identification of the copyrighted work; (b)
        identification of the infringing material; (c) contact information; and
        (d) a statement under penalty of perjury that you are authorized to act
        on behalf of the copyright holder.
      </p>

      <h2 id='warranty'>10. Disclaimers & warranty</h2>
      <p>
        THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
        OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
        WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE, INCLUDING
        IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
        TITLE, AND NON-INFRINGEMENT.
      </p>

      <h2 id='liability'>11. Limitation of liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
        TECHNOZLIFE OR ITS AFFILIATES BE LIABLE FOR INDIRECT, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO
        THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>

      <h2 id='indemnity'>12. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Technozlife and its
        officers, directors, employees, and agents from any claim, demand,
        damages, losses, liabilities, and expenses arising out of your use of
        the Services or violation of these Terms.
      </p>

      <h2 id='termination'>13. Termination & suspension</h2>
      <p>
        We may suspend or terminate your access for violations of these Terms or
        for other lawful reasons, including security concerns or legal
        requirements. Termination does not relieve you of obligations incurred
        prior to termination.
      </p>

      <h2 id='law'>14. Governing law & dispute resolution</h2>
      <p>
        These Terms are governed by the laws specified in our company
        information, without regard to conflict of law principles. Disputes not
        subject to arbitration will be resolved in the courts of the governing
        jurisdiction unless otherwise required by local law.
      </p>

      <h2 id='arbitration'>15. Arbitration & class action waiver</h2>
      <p>
        Where permitted by law, disputes may be resolved through individual
        arbitration rather than in court. You may opt out of arbitration within
        the time period described below by following the opt-out procedure.
      </p>

      <h2 id='changes'>16. Changes to the Terms</h2>
      <p>
        We may modify these Terms from time to time. We will post the updated
        Terms and update the effective date. Material changes will be notified
        to affected users as required by law. Continued use after changes
        constitutes acceptance of the updated Terms.
      </p>

      <h2 id='contact'>17. Contact</h2>
      <p>
        For questions about these Terms, please contact us at{" "}
        <strong>support@technozlife.com</strong>.
      </p>
    </LegalPage>
  );
}
