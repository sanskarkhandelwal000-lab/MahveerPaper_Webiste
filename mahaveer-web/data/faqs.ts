import type { FAQ } from "@/types";

// Revision brief (Homepage — required corrections, "FAQs"): five useful
// homepage questions — samples, choosing paper, small quantities, checking
// current stock/price and locations served.
export const faqs: FAQ[] = [
  {
    id: "samples",
    question: "Do you provide samples?",
    answer:
      "Absolutely. We offer sample packs for most of our product lines so you can assess quality and suitability before committing to a full order. Samples are available on request — simply fill in our contact form.",
  },
  {
    id: "help-choosing",
    question: "Can you help me choose the right paper?",
    answer:
      "Yes — our team offers practical, experience-based guidance on the right paper for your project, based on your application, budget and finish requirements. Reach out via our contact form to speak with a specialist.",
  },
  {
    id: "small-quantities",
    question: "Can I order small quantities?",
    answer:
      "Yes. There's no minimum order quantity on our ready-stock papers — our only minimum is a ₹500 purchase. Our DigiLux brand has a minimum of 1 packet. Contact us for specifics on your preferred product.",
  },
  {
    id: "check-stock-price",
    question: "How do I check current stock and price?",
    answer:
      "Prices and stock can change, so we don't publish live pricing on the site. Reach out via our contact form or call our team directly and we'll confirm current stock and price for the papers you need.",
  },
  {
    id: "locations-served",
    question: "Which locations do you serve?",
    answer:
      "We operate from Bengaluru and Ahmedabad and serve customers across India, with ready stock and dispatch from both locations.",
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
