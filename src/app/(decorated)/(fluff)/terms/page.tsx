import Link from "next/link";

export default function Terms() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-24 text-secondary">
      <header className="mb-10">
        <h1 className="font-alsun-serif text-4xl font-bold tracking-tight text-secondary">
          Terms and Conditions
        </h1>
        <p className="mt-2 text-lg text-slate-500">Last updated on 31/10/2025</p>
      </header>

      <div className="space-y-6 text-slate-600 mb-10">
        <p>
          Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before
          using the Al-Alsun Academy website (the "Service") operated by Al-Alsun Academy ("us",
          "we", or "our"). Your access to and use of the Service is conditioned on your acceptance
          of and compliance with these Terms. These Terms apply to all visitors, users, and others
          who access or use the Service. By accessing or using the Service you agree to be bound by
          these Terms.
        </p>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            1. User Accounts
          </h2>
          <p>
            When you create an account with us, you must provide information that is accurate,
            complete, and current at all times. Failure to do so constitutes a breach of the Terms,
            which may result in immediate termination of your account on our Service. You are
            responsible for safeguarding the password that you use to access the Service and for any
            activities or actions under your password. You agree not to disclose your password to
            any third party. You must notify us immediately upon becoming aware of any breach of
            security or unauthorized use of your account.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            2. Intellectual Property
          </h2>
          <p>
            The Service and all its original content, including but not limited to course materials,
            text, graphics, logos, videos, and software, are the exclusive property of Al-Alsun
            Academy and its licensors. Our content is protected by copyright, trademark, and other
            laws. Our trademarks and content may not be used in connection with any product or
            service without the prior written consent of Al-Alsun Academy.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            3. User Conduct
          </h2>
          <p>As a user of the Service, you agree not to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              Use the Service in any way that violates any applicable local or international law or
              regulation.
            </li>
            <li>
              Engage in any conduct that is harassing, abusive, threatening, or otherwise
              objectionable.
            </li>
            <li>
              Reproduce, distribute, modify, or create derivative works of any course content
              without our express permission.
            </li>
            <li>
              Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts
              of the Service, the server on which the Service is stored, or any server, computer, or
              database connected to the Service.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            4. Purchases and Payments
          </h2>
          <p>
            If you wish to purchase any product or service made available through the Service
            ("Purchase"), you may be asked to supply certain information relevant to your Purchase.
            All billing information you provide must be truthful and accurate. Providing any
            untruthful or inaccurate information constitutes a breach of these Terms. We reserve the
            right to refuse or cancel your order at any time for reasons including but not limited
            to: product or service availability, errors in the description or price of the product
            or service, or error in your order.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            5. Termination
          </h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability,
            for any reason whatsoever, including without limitation if you breach the Terms. Upon
            termination, your right to use the Service will immediately cease. If you wish to
            terminate your account, you may simply discontinue using the Service.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            6. Limitation of Liability
          </h2>
          <p>
            In no event shall Al-Alsun Academy, nor its directors, employees, partners, or agents,
            be liable for any indirect, incidental, special, consequential, or punitive damages,
            including without limitation, loss of profits, data, use, goodwill, or other intangible
            losses, resulting from your access to or use of or inability to access or use the
            Service.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            7. Disclaimer
          </h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and
            "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether
            express or implied, including, but not limited to, implied warranties of
            merchantability, fitness for a particular purpose, non-infringement, or course of
            performance.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            8. Governing Law
          </h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of Egypt,
            without regard to its conflict of law provisions.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            9. Changes to These Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any
            time. We will provide notice of any changes by posting the new Terms on this page and
            updating the "Last updated" date. By continuing to access or use our Service after those
            revisions become effective, you agree to be bound by the revised terms.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            10. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please{" "}
            <Link href={"/contact"} className="text-primary underline">
              contact us.
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
