import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-24 text-secondary">
      <header className="mb-10">
        <h1 className="font-alsun-serif text-4xl font-bold tracking-tight text-secondary">
          Privacy Policy
        </h1>
        <p className="mt-2 text-lg text-slate-500">Last updated on 31/10/2025</p>
      </header>

      <div className="space-y-6 text-slate-600 mb-10">
        <p>
          Welcome to Al-Alsun Academy ("we," "us," or "our"). We are committed to protecting your
          personal information and your right to privacy. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit our website and use
          our language course services. If you have any questions or concerns about this privacy
          notice or our practices with regards to your personal information, please{" "}
          <Link href={"/contact"} className="text-primary underline">
            contact us.
          </Link>
        </p>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            Information We Collect
          </h2>
          <p>
            We collect personal information that you voluntarily provide to us when you use our
            services. The personal information we collect includes:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Personal Identification Information:</strong> Your name and email address,
              which you provide when you sign up for our courses or fill out forms on our website.
            </li>
            <li>
              <strong>User Content:</strong> Profile pictures that you choose to submit to create
              your user profile.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            How We Collect Your Information
          </h2>
          <p>
            We collect information about you directly when you provide it to us. This happens when
            you:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Fill out registration forms to enroll in a language course.</li>
            <li>Create a user profile and voluntarily upload a profile picture.</li>
            <li>Contact us with inquiries or for support.</li>
          </ul>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            How We Use Your Information
          </h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>To Provide Core Website Functionality:</strong> Your name, email, and profile
              picture are used to create and manage your account, provide you with access to our
              language courses, and personalize your learning experience.
            </li>
            <li>
              <strong>To Communicate With You:</strong> We use your email address to send you
              important information about your courses, updates to our services, and to respond to
              your inquiries.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            Sharing and Disclosure of Your Information
          </h2>
          <p>
            We do not sell your personal information for advertising or marketing purposes. However,
            to provide our services, we rely on third-party Software as a Service (SaaS) providers
            to host our website and store your data. Your personal information is shared with the
            following categories of third-party service providers:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Cloud Hosting and Database Providers:</strong> We use services like Supabase
              and Netlify to host our website and manage our user database.
            </li>
            <li>
              <strong>File Storage Providers:</strong> We use services like Uploadthing for the
              storage and handling of files you upload, such as your profile picture.
            </li>
          </ul>
          <p className="mt-2">
            These service providers are contractually obligated to protect your data and are only
            permitted to use it to provide the services we have engaged them for. While your data is
            stored on their servers, we remain the controller of your personal information.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            Data Security
          </h2>
          <p>
            We and our third-party service providers implement a variety of security measures to
            maintain the safety of your personal information. We are committed to protecting your
            personal data from unauthorized access, use, or disclosure. However, please remember
            that no method of transmission over the Internet or method of electronic storage is 100%
            secure.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            Your Data Protection Rights
          </h2>
          <p>
            Depending on your location within the MENA region, you may have certain rights regarding
            your personal data under local data protection laws. These rights may include:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>The Right to Access:</strong> You have the right to request copies of your
              personal data.
            </li>
            <li>
              <strong>The Right to Rectification:</strong> You have the right to request that we
              correct any information you believe is inaccurate or complete information you believe
              is incomplete.
            </li>
            <li>
              <strong>The Right to Erasure:</strong> You have the right to request that we erase
              your personal data, under certain conditions.
            </li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please{" "}
            <Link href={"/contact"} className="text-primary underline">
              contact us.
            </Link>
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            Data Retention
          </h2>
          <p>
            We will retain your personal information only for as long as is necessary for the
            purposes set out in this privacy policy. We will retain and use your information to the
            extent necessary to comply with our legal obligations, resolve disputes, and enforce our
            policies.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. The updated version will be
            indicated by a "Last Updated" date at the top of this policy. We encourage you to review
            this privacy policy frequently to be informed of how we are protecting your information.
          </p>
        </div>

        <div>
          <h2 className="my-4 text-sm font-bold uppercase tracking-widest text-secondary/70">
            Contact Us
          </h2>
          <p>
            If you have any questions or comments about this policy, you may contact us through our{" "}
            <Link href={"/contact"} className="text-primary underline">
              contact page.
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
