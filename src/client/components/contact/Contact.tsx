import { CONTACT_DATA } from "@/client/data/contact";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section
      id="contact"
      className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-18"
      aria-labelledby="contact-heading"
    >
      <ContactInfo data={CONTACT_DATA} />
      <ContactForm data={CONTACT_DATA} />
    </section>
  );
}
