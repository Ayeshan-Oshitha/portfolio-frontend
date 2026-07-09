import Contact from "../components/contact/Contact";

export default function ContactPage() {
  return (
    <>
      {/* Spacer to account for fixed header, since hero isn't here */}
      <div className="h-[73px]" aria-hidden="true" />
      <Contact />
    </>
  );
}
