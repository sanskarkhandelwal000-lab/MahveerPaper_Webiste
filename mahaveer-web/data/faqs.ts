import type { FAQ } from "@/types";

export const faqs: FAQ[] = [
  {
    id: "place-order",
    question: "How can I place an order?",
    answer:
      "You can reach out via our contact form or directly connect with our sales team for bulk inquiries.",
  },
  {
    id: "custom-solutions",
    question: "Do you offer customized paper solutions?",
    answer:
      "Yes, we specialise in bespoke paper solutions tailored to your exact specifications — including custom weights, finishes, sizes, and coatings. Contact our team to discuss your project requirements.",
  },
  {
    id: "industries",
    question: "What industries do you serve?",
    answer:
      "We serve a wide range of industries including publishing, packaging, commercial printing, education, luxury goods, retail, and industrial sectors. Our portfolio spans fine stationery to heavy-duty packaging materials.",
  },
  {
    id: "moq",
    question: "What is your minimum order quantity?",
    answer:
      "There's no MOQ on our ready-stock papers — our only minimum is a ₹500 purchase. Our DigiLux brand has a minimum of 1 packet. Custom or bespoke speciality requirements vary paper to paper, so contact us for specifics on your preferred product.",
  },
  {
    id: "estimates",
    question: "Are your estimates free?",
    answer:
      "Yes, all quotes and consultations are completely free of charge. Our team will assess your requirements and provide a detailed, no-obligation estimate within 24–48 hours.",
  },
  {
    id: "samples",
    question: "Do you provide samples?",
    answer:
      "Absolutely. We offer sample packs for most of our product lines so you can assess quality and suitability before committing to a full order. Samples are available on request — simply fill in our contact form.",
  },
];

// Revision brief (About Us Page Brief): the About page's FAQ section should stay
// limited to company-related questions — general ordering/product questions
// (place-order, custom-solutions, moq, estimates, samples above) belong on
// Contact or Products instead.
export const companyFaqs: FAQ[] = [
  {
    id: "established",
    question: "When was Mahaveer Papers established?",
    answer:
      "Mahaveer Papers was established in Bengaluru in 1992 and has been a speciality-paper sourcing, stocking and distribution business for more than three decades.",
  },
  {
    id: "where-operate",
    question: "Where does Mahaveer Papers operate?",
    answer:
      "We operate from our head office in Bengaluru and our branch in Ahmedabad, serving customers across India.",
  },
  {
    id: "manufacturer-or-distributor",
    question: "Is Mahaveer Papers a manufacturer or distributor?",
    answer:
      "Mahaveer Papers is a distributor, not a manufacturer. We source, stock and distribute speciality papers from trusted domestic and international mills, and help customers choose the right paper for their requirement.",
  },
  {
    id: "fsc-certified",
    question: "Is Mahaveer Papers FSC-certified?",
    answer:
      "Yes. Mahaveer Papers is an FSC-certified company, committed to responsible sourcing wherever applicable.",
  },
  {
    id: "visit-or-speak",
    question: "Can customers visit or speak with a paper specialist?",
    answer:
      "Yes — you're welcome to visit our Bengaluru or Ahmedabad locations, or speak with a paper specialist directly through our contact page for guidance and samples before you decide.",
  },
];
