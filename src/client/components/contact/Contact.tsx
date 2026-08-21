import { CONTACT_DATA } from "@/client/data/contact";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — Info */}
          <ContactInfo data={CONTACT_DATA} />

          {/* Right — Form */}
          <ContactForm data={CONTACT_DATA} />
        </div>
      </div>
    </section>
  );
}
