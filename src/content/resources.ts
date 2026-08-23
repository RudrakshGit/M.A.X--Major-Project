export type ResourceTopic = {
  id: string;
  title: string;
  shortDescription: string;
  introduction: string;
  signs: string[];
  strategies: { title: string; body: string }[];
  crisisEscalation: string;
};

export const resources: Record<string, ResourceTopic> = {
  depression: {
    id: "depression",
    title: "Understanding Depression",
    shortDescription: "More than just feeling sad, depression can drain your energy, hope, and drive.",
    introduction: "Depression is a common but serious mood state. It causes severe symptoms that affect how you feel, think, and handle daily activities, such as sleeping, eating, or working. It's completely normal to feel down sometimes, but if these feelings last for weeks and interfere with your daily life, it might be depression.",
    signs: [
      "Persistent sad, anxious, or 'empty' mood",
      "Loss of interest or pleasure in hobbies and activities",
      "Decreased energy or fatigue",
      "Difficulty sleeping, early-morning awakening, or oversleeping",
      "Appetite and/or weight changes",
      "Difficulty concentrating, remembering, or making decisions"
    ],
    strategies: [
      {
        title: "Break Tasks Down",
        body: "When you have no energy, big tasks seem impossible. Break them into tiny, manageable steps. 'Clean the room' becomes 'pick up three items of clothing'."
      },
      {
        title: "Challenge Negative Thinking",
        body: "Depression often puts a negative filter on how you see the world. Try to notice when you're being overly harsh on yourself and ask if you'd say those things to a friend."
      },
      {
        title: "Move a Little",
        body: "You don't need a full workout. Even a 10-minute walk outside can temporarily boost endorphins and shift your perspective."
      }
    ],
    crisisEscalation: "If you are having thoughts of self-harm or suicide, this is a medical emergency. Please reach out to emergency services, a campus counsellor, or a trusted individual immediately."
  },
  anxiety: {
    id: "anxiety",
    title: "Navigating Anxiety",
    shortDescription: "When worry becomes overwhelming and hard to control.",
    introduction: "Anxiety is your body's natural response to stress—a feeling of fear or apprehension about what's to come. While some anxiety is normal and can even be helpful in stressful situations (like before an exam), it becomes a problem when it's constant, overwhelming, and interferes with your daily life.",
    signs: [
      "Feeling restless, wound-up, or on-edge",
      "Being easily fatigued",
      "Having difficulty concentrating; mind going blank",
      "Irritability",
      "Muscle tension",
      "Difficulty controlling feelings of worry",
      "Sleep problems (difficulty falling or staying asleep)"
    ],
    strategies: [
      {
        title: "The 5-4-3-2-1 Grounding Technique",
        body: "Acknowledge 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you can taste. This pulls your mind out of worry and into the present."
      },
      {
        title: "Box Breathing",
        body: "Breathe in for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat. This helps regulate your nervous system."
      },
      {
        title: "Limit Caffeine",
        body: "Caffeine can mimic and exacerbate the physical symptoms of anxiety. Try switching to decaf or herbal tea."
      }
    ],
    crisisEscalation: "If your anxiety is causing severe panic attacks that mimic heart attacks, or if you feel completely unable to function, seek immediate support from a medical professional."
  },
  burnout: {
    id: "burnout",
    title: "Recovering from Burnout",
    shortDescription: "A state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress.",
    introduction: "Burnout occurs when you feel overwhelmed, emotionally drained, and unable to meet constant demands. In a college environment, this often looks like losing all motivation for your studies, feeling deeply cynical about your courses, and having no energy left for friends or hobbies.",
    signs: [
      "Feeling tired and drained most of the time",
      "Lowered immunity, frequent illnesses",
      "Sense of failure and self-doubt",
      "Loss of motivation",
      "Cynical and negative outlook",
      "Decreased satisfaction and sense of accomplishment"
    ],
    strategies: [
      {
        title: "Enforce Boundaries",
        body: "Set strict limits on when you study. For example, no coursework after 8 PM. Stick to it as if it were a strict rule."
      },
      {
        title: "Disconnect",
        body: "Take a full day off where you do not look at screens, emails, or study materials. Your brain needs genuine rest to recover."
      },
      {
        title: "Re-evaluate Priorities",
        body: "Determine what absolutely must be done and what can be dropped or delegated. You cannot do everything at 100% capacity."
      }
    ],
    crisisEscalation: "If burnout leads to severe depression, inability to get out of bed, or thoughts of giving up entirely, please consult a campus counsellor."
  },
  stress: {
    id: "stress",
    title: "Managing Stress",
    shortDescription: "Feeling overwhelmed by the pressures and demands of academic and personal life.",
    introduction: "Stress is a physical and mental response to an external cause, such as having a lot of assignments or an upcoming exam. While it usually resolves once the situation is over, chronic stress can take a heavy toll on your body and mind.",
    signs: [
      "Headaches or body aches",
      "Stomach or digestive issues",
      "Forgetfulness and disorganization",
      "Racing thoughts",
      "Changes in appetite",
      "Procrastination or avoiding responsibilities"
    ],
    strategies: [
      {
        title: "Time Management",
        body: "Use techniques like the Pomodoro method (25 mins work, 5 mins break) to manage cognitive load."
      },
      {
        title: "Write it Down",
        body: "Do a 'brain dump'. Write down everything you are stressed about to get it out of your head and onto paper."
      },
      {
        title: "Prioritize Sleep",
        body: "Stress often disrupts sleep, but lack of sleep makes stress worse. Maintain a strict sleep schedule even during exams."
      }
    ],
    crisisEscalation: "If stress is causing physical health emergencies (like extreme blood pressure spikes or fainting), seek medical attention immediately."
  },
  "sleep-issues": {
    id: "sleep-issues",
    title: "Improving Sleep",
    shortDescription: "Struggling to fall asleep, stay asleep, or waking up feeling unrefreshed.",
    introduction: "Good sleep is the foundation of mental health. In college, erratic schedules, late-night studying, and stress can severely disrupt your sleep architecture, leading to a cascade of negative mental and physical effects.",
    signs: [
      "Taking more than 30 minutes to fall asleep",
      "Waking up frequently during the night",
      "Waking up too early and not being able to get back to sleep",
      "Feeling unrefreshed after a full night's sleep",
      "Relying heavily on caffeine to stay awake"
    ],
    strategies: [
      {
        title: "Consistent Schedule",
        body: "Go to bed and wake up at the exact same time every day, even on weekends. This sets your circadian rhythm."
      },
      {
        title: "Cool and Dark Environment",
        body: "Your body needs to drop in temperature to sleep. Keep your room cool and as dark as possible."
      },
      {
        title: "The 20-Minute Rule",
        body: "If you can't sleep after 20 minutes, get out of bed and do a low-stimulation activity (like reading a physical book) until you feel tired."
      }
    ],
    crisisEscalation: "If you have not slept at all for multiple consecutive nights (insomnia), this can trigger severe psychological symptoms. Please see a doctor."
  },
  "relationship-issues": {
    id: "relationship-issues",
    title: "Navigating Relationship Issues",
    shortDescription: "Dealing with conflict, loneliness, or toxicity in friendships, family, or romantic relationships.",
    introduction: "Relationships are a core part of the college experience, but they can also be a major source of distress. Whether it's a conflict with a roommate, a breakup, or feeling disconnected from peers, relationship issues can heavily impact your mental well-being.",
    signs: [
      "Constant arguing or tension",
      "Feeling drained after interacting with someone",
      "Walking on eggshells around a person",
      "Deep feelings of loneliness or isolation",
      "Neglecting your own needs for someone else"
    ],
    strategies: [
      {
        title: "Use 'I' Statements",
        body: "Instead of 'You always ignore me', try 'I feel unheard when we talk'. This reduces defensiveness in conflicts."
      },
      {
        title: "Evaluate Boundaries",
        body: "Are you giving too much? It's okay to say no to social events or favors if you don't have the emotional capacity."
      },
      {
        title: "Seek New Connections",
        body: "If you feel isolated, try joining a campus club or study group focused on a shared interest to build organic connections."
      }
    ],
    crisisEscalation: "If you are in a relationship that is physically, emotionally, or verbally abusive, your safety is the priority. Contact campus security or a domestic abuse hotline."
  }
};
