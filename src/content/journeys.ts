export type JourneyDay = {
  day: number;
  title: string;
  content: string;
  actionItem: string;
};

export type Journey = {
  id: string;
  title: string;
  description: string;
  days: JourneyDay[];
};

export const journeys: Record<string, Journey> = {
  depression: {
    id: "depression",
    title: "Lifting the Fog",
    description: "A 5-day gentle start to reclaiming your energy and finding moments of brightness.",
    days: [
      {
        day: 1,
        title: "The Baseline",
        content: "When depression hits, it lies to you. It says everything is permanent. Today is about recognizing that this is a state, not a trait. It's an illness, not a character flaw.",
        actionItem: "Find one small self-care task you haven't done today (brushing teeth, drinking water) and do it. Acknowledge it as a victory."
      },
      {
        day: 2,
        title: "Tiny Routines",
        content: "Motivation follows action, not the other way around. If you wait until you 'feel like it', you might wait forever. We start with the smallest possible routines.",
        actionItem: "Set an alarm to simply stand outside in the daylight for 3 minutes tomorrow morning."
      },
      {
        day: 3,
        title: "Challenging the Inner Critic",
        content: "Notice the voice in your head. Depression makes it cruel. 'You're lazy', 'You'll fail'. If a friend spoke to you like that, would you keep them around?",
        actionItem: "Write down one harsh thought you had today, and rewrite it as if you were speaking to a loved one."
      },
      {
        day: 4,
        title: "The Power of 'No'",
        content: "Depression drains your battery. You cannot operate at 100% capacity right now. Part of recovery is fiercely protecting the little energy you have left.",
        actionItem: "Identify one non-essential commitment this week that is causing you dread, and politely cancel or postpone it."
      },
      {
        day: 5,
        title: "Building the Ladder",
        content: "Recovery is not a straight line upwards. It's a series of small, imperfect steps. You've made it through 5 days of showing up for yourself.",
        actionItem: "Reflect in your journal: What is one tiny routine you've built this week that you want to carry forward?"
      }
    ]
  },
  anxiety: {
    id: "anxiety",
    title: "Calming the Storm",
    description: "A 5-day guide to regulating your nervous system and finding solid ground.",
    days: [
      {
        day: 1,
        title: "Name the Feeling",
        content: "Anxiety loves vague, overwhelming threats. The moment you give the fear a specific name, it loses a fraction of its power. 'I feel anxious because...'",
        actionItem: "Write down exactly what you are anxious about right now. Don't solve it, just write it."
      },
      {
        day: 2,
        title: "Breathe Through the Panic",
        content: "When you are anxious, you take shallow breaths from your chest, signaling 'danger' to your brain. Deep belly breathing sends an 'all clear' signal.",
        actionItem: "Practice 4-7-8 breathing for three cycles: Inhale for 4s, hold for 7s, exhale for 8s."
      },
      {
        day: 3,
        title: "The Worry Time Technique",
        content: "Instead of worrying all day, schedule it. Give your brain permission to worry deeply, but only during a specific 15-minute window.",
        actionItem: "Schedule a 15-minute 'worry appointment' for tomorrow. If you worry outside that time, tell yourself 'I will think about this at my appointment'."
      },
      {
        day: 4,
        title: "Fact Checking",
        content: "Anxiety tells terrible stories about the future. 'I will fail, everyone will hate me.' But is there actual evidence for this?",
        actionItem: "Take a fear you have right now. Write down one piece of hard evidence that supports it, and three pieces of evidence against it."
      },
      {
        day: 5,
        title: "Grounding in the Present",
        content: "Anxiety lives in the future. Peace lives in the present. Grounding techniques force your brain to process the 'now' instead of the 'what if'.",
        actionItem: "Do the 5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste."
      }
    ]
  },
  burnout: {
    id: "burnout",
    title: "Reclaiming Your Spark",
    description: "A 5-day reset to detach from chronic stress and rebuild your boundaries.",
    days: [
      {
        day: 1,
        title: "Permission to Rest",
        content: "Burnout is not a failure of willpower; it's a failure of resources. Your engine is out of gas. Pushing harder will only break the engine.",
        actionItem: "Give yourself explicit, out-loud permission to do the bare minimum for the rest of the day."
      },
      {
        day: 2,
        title: "The Boundary Audit",
        content: "Where is your energy leaking? Are you saying 'yes' when you mean 'no'? Are you studying at 1 AM when you should be sleeping?",
        actionItem: "Identify one boundary you have let slip recently, and write down exactly how you will enforce it tomorrow."
      },
      {
        day: 3,
        title: "Digital Detox",
        content: "Constant notifications keep your brain in a state of high alert. You cannot recover from burnout while constantly connected to the source of demands.",
        actionItem: "Put your phone in a different room for one hour. Notice how it feels."
      },
      {
        day: 4,
        title: "Rediscovering Play",
        content: "When was the last time you did something just for the fun of it, with no outcome or grade attached? Burnout kills playfulness.",
        actionItem: "Spend 15 minutes doing something completely unproductive that you used to enjoy as a child (doodling, listening to a specific song, playing a casual game)."
      },
      {
        day: 5,
        title: "Redefining Success",
        content: "College culture equates exhaustion with success. This is a trap. True success is sustainable. You are worth more than your productivity.",
        actionItem: "Write a new definition of a 'successful day' that includes rest and well-being as core metrics."
      }
    ]
  },
  stress: {
    id: "stress",
    title: "Mastering the Pressure",
    description: "A 5-day bootcamp to organize your mind and reduce academic overwhelm.",
    days: [
      {
        day: 1,
        title: "The Brain Dump",
        content: "Your brain is a terrible office. Trying to hold all your tasks, deadlines, and worries in your working memory creates immense stress.",
        actionItem: "Take 10 minutes to write down every single thing you need to do. Get it all out of your head."
      },
      {
        day: 2,
        title: "The Eisenhower Matrix",
        content: "Not all tasks are created equal. Distinguish between what is Urgent (needs doing now) and what is Important (long-term value).",
        actionItem: "Pick the top 3 most important tasks from your brain dump. Hide the rest for now."
      },
      {
        day: 3,
        title: "Micro-Breaks",
        content: "Studying for 4 hours straight does not mean 4 hours of learning. Your brain needs time to consolidate information. Stress blocks this.",
        actionItem: "Work in Pomodoros today: 25 minutes of intense focus, followed by a strict 5-minute break away from your desk."
      },
      {
        day: 4,
        title: "Physical Release",
        content: "Stress is a physical cycle. Your body prepares for a tiger attack (exams). You must complete the stress cycle physically to tell your body you are safe.",
        actionItem: "Do 10 minutes of physical activity that raises your heart rate (jumping jacks, a fast walk, dancing in your room)."
      },
      {
        day: 5,
        title: "The 'Good Enough' Standard",
        content: "Perfectionism is the enemy of progress. Trying to get a 100% on a minor assignment will cost you the time you need for major exams.",
        actionItem: "Identify a task where 'good enough' is acceptable, and submit it without over-polishing."
      }
    ]
  },
  "sleep-issues": {
    id: "sleep-issues",
    title: "Restoring Your Rest",
    description: "A 5-day protocol to fix your circadian rhythm and get the deep sleep you need.",
    days: [
      {
        day: 1,
        title: "The Anchor Time",
        content: "Your brain's clock needs a strong anchor. Waking up at vastly different times confuses it. You must wake up at the same time, even on weekends.",
        actionItem: "Set an alarm for the exact same time every day for the next week. Do not hit snooze."
      },
      {
        day: 2,
        title: "Morning Light",
        content: "Light is the strongest signal to your brain that it is daytime. Seeing sunlight first thing in the morning sets a timer for sleep later that night.",
        actionItem: "Within 30 minutes of waking up, get outside and look at natural light for 5-10 minutes (do not stare directly at the sun)."
      },
      {
        day: 3,
        title: "The Caffeine Curfew",
        content: "Caffeine has a half-life of roughly 5-6 hours. A coffee at 4 PM means half of it is still active in your brain at 10 PM.",
        actionItem: "Commit to consuming zero caffeine (coffee, energy drinks, certain teas) after 2 PM today."
      },
      {
        day: 4,
        title: "The Wind-Down Routine",
        content: "You cannot drive a car at 100mph and instantly put it in park. Your brain needs a transition period from the stress of the day to the calm of sleep.",
        actionItem: "Create a 30-minute buffer zone before bed where you do not look at any screens or study materials."
      },
      {
        day: 5,
        title: "The 20-Minute Rule",
        content: "Laying in bed awake and frustrated trains your brain to associate the bed with stress. The bed should only be for sleep.",
        actionItem: "If you can't sleep after 20 minutes tonight, get up and do a boring activity in dim light until you feel sleepy."
      }
    ]
  },
  "relationship-issues": {
    id: "relationship-issues",
    title: "Building Better Bonds",
    description: "A 5-day guide to handling conflict, setting boundaries, and finding connection.",
    days: [
      {
        day: 1,
        title: "Check Your Energy",
        content: "Are you interacting from a place of fullness, or are you drained? You cannot be a good friend or partner if you are entirely depleted.",
        actionItem: "Take 30 minutes entirely for yourself today before responding to any non-urgent social texts or demands."
      },
      {
        day: 2,
        title: "The 'I' Statement",
        content: "Saying 'You always ignore me' immediately puts the other person on defense. 'I feel lonely when we don't talk' opens a conversation.",
        actionItem: "Think of a minor frustration you have with someone. Rewrite it as an 'I feel... when... because...' statement."
      },
      {
        day: 3,
        title: "Setting a Boundary",
        content: "Boundaries are not walls; they are instructions on how to love and respect you. They protect the relationship from resentment.",
        actionItem: "Say 'no' to one request today that you do not have the capacity for, without over-explaining or apologizing excessively."
      },
      {
        day: 4,
        title: "Active Listening",
        content: "Most of us listen to reply, not to understand. True connection happens when the other person feels deeply heard and validated.",
        actionItem: "In your next conversation, wait a full 2 seconds after the person finishes speaking before you reply."
      },
      {
        day: 5,
        title: "Quality over Quantity",
        content: "Having 50 acquaintances but feeling totally alone is common in college. Deep connection requires vulnerability and dedicated time.",
        actionItem: "Reach out to one person you value and schedule a 1-on-1 hangout or phone call."
      }
    ]
  }
};
