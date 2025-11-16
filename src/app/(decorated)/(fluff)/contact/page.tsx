export default function ContactPage() {
  return (
    <div className="mx-auto mt-20 w-full p-6">
      <header className="mb-10 text-center">
        <h1 className="font-alsun-serif text-secondary text-4xl font-bold tracking-tight">
          Contact Us
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          Reach out to us anytime! Find us on the map or get in touch via phone, email, or WhatsApp.
        </p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center md:gap-12 lg:gap-16">
        <div className="text-center">
          <h2 className="text-primary font-alsun-serif mb-1 font-semibold">Phone</h2>
          <a href="tel:+201030483636" className="hover:underline">
            +2 0103 048 3636
          </a>
        </div>

        <div className="text-center">
          <h2 className="text-primary font-alsun-serif mb-1 font-semibold">Email</h2>
          <a href="mailto:alalsonacademy2@gmail.com" className="hover:underline">
            alalsonacademy2@gmail.com
          </a>
        </div>

        <div className="text-center">
          <h2 className="text-primary font-alsun-serif mb-1 font-semibold">WhatsApp</h2>
          <a
            href="https://wa.me/+201030483636"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </div>

      <iframe
        title="Google Maps Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.033076483299!2d30.9483156!3d31.108812700000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7ab85c27fd3d9%3A0xf36d2a177297977d!2sAl-Alsun%20Academy!5e0!3m2!1sen!2seg!4v1755421491557!5m2!1sen!2seg"
        loading="lazy"
        className="mx-auto my-4 h-80 w-full max-w-4xl rounded-2xl shadow-2xl"
      />
    </div>
  );
}
