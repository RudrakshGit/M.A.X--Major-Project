export type Helpline = {
  id: string;
  name: string;
  description: string;
  number: string;
  hours: string;
  tags: string[];
};

export const helplines: Helpline[] = [
  {
    id: "vandrevala",
    name: "Vandrevala Foundation",
    description: "Crisis intervention and mental health support for anyone experiencing distress.",
    number: "9999 666 555",
    hours: "24/7",
    tags: ["Crisis", "General", "Multilingual"],
  },
  {
    id: "kiran",
    name: "KIRAN Mental Health Helpline",
    description: "A 24/7 toll-free helpline launched by the Ministry of Social Justice and Empowerment.",
    number: "1800-599-0019",
    hours: "24/7",
    tags: ["Government", "Anxiety", "Depression"],
  },
  {
    id: "nimhans",
    name: "NIMHANS Helpline",
    description: "National Institute of Mental Health and Neurosciences psychosocial support.",
    number: "080-46110007",
    hours: "24/7",
    tags: ["Clinical", "Emergency"],
  },
  {
    id: "snehi",
    name: "Snehi",
    description: "Support for emotional distress, psychological crisis, and mental health issues.",
    number: "011-65978181",
    hours: "10:00 AM - 10:00 PM",
    tags: ["Emotional Support"],
  }
];
