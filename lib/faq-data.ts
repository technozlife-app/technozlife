export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Safety" | "Technology" | "Process";
}

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "How safe are neural interface procedures?",
    answer:
      "Safety is our top priority. All our procedures are FDA-approved (or equivalent regulatory bodies) and conducted by board-certified neurosurgeons. We use minimally invasive techniques with a 99.7% success rate. Our implants are biocompatible, designed for long-term stability, and come with comprehensive monitoring protocols. Every patient undergoes thorough screening and receives personalized risk assessments.",
    category: "Safety",
  },
  {
    id: "2",
    question: "What is the recovery time after implantation?",
    answer:
      "Most patients experience initial recovery within 2-4 weeks, with full neural integration occurring over 3-6 months. The procedure itself is minimally invasive, often performed as outpatient surgery. You'll have regular follow-up appointments to monitor progress and optimize neural mapping. Many patients report noticeable improvements within the first month.",
    category: "Process",
  },
  {
    id: "3",
    question: "How does the neural interface technology work?",
    answer:
      "Our neural mesh uses bioelectronic sensors to detect and translate neural signals. The system employs machine learning algorithms that adapt to your unique neural patterns over time. It's a bidirectional interface—capable of both reading signals from your brain and delivering targeted stimulation when needed. The technology is wireless, powered by bio-safe energy harvesting, and requires no external components during daily use.",
    category: "Technology",
  },
  {
    id: "4",
    question: "Am I a good candidate for neural enhancement?",
    answer:
      "We evaluate candidates based on medical history, current health status, specific goals, and realistic expectations. Ideal candidates include individuals with motor impairments, neurological conditions, or those seeking cognitive enhancement. We offer free consultation to assess your unique situation. Age, overall health, and commitment to the integration process are key factors we consider.",
    category: "General",
  },
  {
    id: "5",
    question: "What does the process cost and does insurance cover it?",
    answer:
      "Costs vary based on the specific procedure and customization required, typically ranging from $15,000 to $85,000. Many insurance providers now cover therapeutic applications (motor restoration, seizure management). We offer flexible financing options and work with your insurance provider to maximize coverage. Our team provides detailed cost breakdowns during consultation.",
    category: "Process",
  },
  {
    id: "6",
    question: "Can the neural interface be removed or upgraded?",
    answer:
      "Yes, our systems are designed with both removability and upgradability in mind. The modular architecture allows for software updates delivered wirelessly, and hardware upgrades can be performed with minimally invasive procedures if needed. We're committed to long-term support—your device won't become obsolete. Removal, while rare, can be safely performed if medically necessary.",
    category: "Technology",
  },
  {
    id: "7",
    question: "What about privacy and data security?",
    answer:
      "Your neural data is encrypted end-to-end with military-grade security protocols. You maintain complete ownership of your data—we never sell or share it without explicit consent. All data processing can be done locally on-device, and cloud features are entirely optional. We're compliant with HIPAA, GDPR, and emerging neurorights legislation. Regular security audits ensure your cognitive privacy is protected.",
    category: "Safety",
  },
  {
    id: "8",
    question: "How long do the neural implants last?",
    answer:
      "Our current generation implants are designed for 15-20+ years of reliable operation. The biocompatible materials resist degradation, and the self-diagnostic systems alert us to any potential issues before they become problems. Most patients never need replacement. We provide lifetime monitoring and support, with routine check-ups every 6-12 months to ensure optimal performance.",
    category: "Technology",
  },
];
