export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  image: string;
  content: string;
  rating: number;
  date: string;
  condition?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    role: "Neuroscientist",
    company: "MIT Neural Systems Lab",
    image: "/testimonials/sarah.jpg",
    content:
      "The neural interface technology from TechnozLife has revolutionized how we approach brain-computer interaction research. The precision and reliability are unprecedented. We've seen a 40% improvement in signal clarity compared to traditional methods.",
    rating: 5,
    date: "November 2024",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Patient & Advocate",
    company: undefined,
    image: "/testimonials/marcus.jpg",
    content:
      "After losing motor function in my hands, I thought my career as a designer was over. TechnozLife's neural mesh technology gave me back my independence. I can now control digital interfaces with thought alone. It's not just technology—it's freedom.",
    rating: 5,
    date: "October 2024",
    condition: "Spinal Cord Injury",
  },
  {
    id: "3",
    name: "Dr. Aisha Patel",
    role: "Chief Medical Officer",
    company: "NextGen Rehabilitation Center",
    image: "/testimonials/aisha.jpg",
    content:
      "We've integrated TechnozLife's solutions into our rehabilitation programs for stroke patients. The results speak for themselves: 85% of patients show measurable improvement in neural plasticity within 3 months. The support team's expertise is world-class.",
    rating: 5,
    date: "December 2024",
  },
  {
    id: "4",
    name: "James Liu",
    role: "Software Engineer",
    company: "Cognitive Computing Inc.",
    image: "/testimonials/james.jpg",
    content:
      "As someone with ADHD, focus has always been my biggest challenge. The cognitive enhancement protocols from TechnozLife have been transformative. I'm more productive, creative, and in control of my mental state than ever before. The ethical approach to enhancement is what sold me.",
    rating: 5,
    date: "September 2024",
  },
];
