// Realistic demo conversations tailored to each therapist's specialty and approach

export const therapistDemoConversations = {
  // Dr. Sarah Chen - CBT Specialist
  'ed979f27-2491-43f1-a779-5095febb68b2': [
    {
      role: 'user',
      message: "I keep having these thoughts that I'm going to mess up my job interview tomorrow. I can't stop thinking about all the ways it could go wrong.",
      delay: 1000
    },
    {
      role: 'ai',
      message: "I can hear how anxious you're feeling about tomorrow's interview. What you're experiencing are called catastrophic thoughts - your mind is jumping to worst-case scenarios. Let's work on identifying and challenging these thoughts together. Can you tell me one specific thought that keeps coming up?",
      delay: 2500,
      shouldSpeak: true
    },
    {
      role: 'user',
      message: "I keep thinking 'They'll see I'm not qualified and I'll embarrass myself completely.'",
      delay: 2000
    },
    {
      role: 'ai',
      message: "That's a very common anxious thought pattern. Let's examine the evidence. Have you prepared for this interview? What qualifications do you actually have for this role? We're going to use a CBT technique called thought challenging to replace this unhelpful thought with a more balanced, realistic one.",
      delay: 3000,
      shouldSpeak: true
    }
  ],

  // Dr. Maya Patel - Mindfulness Coach
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': [
    {
      role: 'user',
      message: "I'm so overwhelmed with work and family responsibilities. My mind never stops racing, even when I try to relax.",
      delay: 1000
    },
    {
      role: 'ai',
      message: "I can sense the weight you're carrying right now. When our minds are constantly racing, it's like having too many browser tabs open - everything feels urgent and overwhelming. Let's start by simply noticing what's happening in this moment. Take a gentle breath with me and tell me three things you can hear around you right now.",
      delay: 2800,
      shouldSpeak: true
    },
    {
      role: 'user',
      message: "I can hear the air conditioning, some traffic outside, and my neighbor's dog barking.",
      delay: 1800
    },
    {
      role: 'ai',
      message: "Beautiful. You've just practiced mindful awareness - anchoring yourself in the present moment through your senses. This is how we begin to slow down the racing mind. When we're fully present, we can't simultaneously worry about tomorrow's deadlines. How did that brief moment of noticing feel for you?",
      delay: 3200,
      shouldSpeak: true
    }
  ],

  // Dr. Marcus Bennett - Solution-Focused Therapy
  '0772c602-306b-42ad-b610-2dc15ba06714': [
    {
      role: 'user',
      message: "I feel stuck in my career. I've been in the same position for three years and I don't see any way forward. Nothing ever changes.",
      delay: 1000
    },
    {
      role: 'ai',
      message: "I hear that you're feeling stuck, and that's understandable after three years. But I'm curious - you mentioned 'nothing ever changes,' but here you are, talking to me about it. That tells me part of you is ready for change. What would have to be different for you to feel like you're moving forward in your career?",
      delay: 2500,
      shouldSpeak: true
    },
    {
      role: 'user',
      message: "I guess I'd need new skills, or maybe a different role, but I don't even know where to start.",
      delay: 2000
    },
    {
      role: 'ai',
      message: "You've just identified two potential solutions - new skills and exploring different roles. That's not 'stuck' thinking, that's solution-focused thinking! Let's imagine it's six months from now and you've taken one small step in either direction. What would that small step look like? We're going to build your path forward one achievable action at a time.",
      delay: 3000,
      shouldSpeak: true
    }
  ],

  // Dr. Jordan Kim - Trauma-Informed Therapy
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': [
    {
      role: 'user',
      message: "I have trouble sleeping because I keep having flashbacks to the car accident. Even during the day, sudden noises make me jump and my heart races.",
      delay: 1000
    },
    {
      role: 'ai',
      message: "Thank you for sharing something so difficult with me. What you're describing - the flashbacks, being startled by noises, the racing heart - these are your body's natural responses to trauma. First, I want you to know you're safe here, and we'll go at your pace. Right now, can you feel your feet on the ground and notice that you're in a safe space?",
      delay: 3000,
      shouldSpeak: true
    },
    {
      role: 'user',
      message: "Yes, I can feel my feet. It does help a little to focus on that.",
      delay: 1800
    },
    {
      role: 'ai',
      message: "That's your strength showing - you were able to ground yourself just now. Trauma affects the nervous system, but we can work together to help your system learn it's safe again. We'll use gentle techniques to process these experiences when you're ready, always ensuring you feel in control. You've survived something difficult, and that resilience is still within you.",
      delay: 3500,
      shouldSpeak: true
    }
  ],

  // Dr. Taylor Morgan - Relationship Counselor
  '84148de7-b04d-4547-9d9b-80665efbd4af': [
    {
      role: 'user',
      message: "My partner and I keep having the same argument over and over. We can't seem to communicate without it turning into a fight about who's right.",
      delay: 1000
    },
    {
      role: 'ai',
      message: "Recurring arguments often signal that there's an underlying need that isn't being heard by either person. When you both focus on 'being right,' you miss the opportunity to understand each other's perspective. Can you think of the last argument you had - what was each of you really needing in that moment, underneath the words being said?",
      delay: 2800,
      shouldSpeak: true
    },
    {
      role: 'user',
      message: "I think I needed to feel heard and valued, and maybe they needed to feel respected and not criticized.",
      delay: 2000
    },
    {
      role: 'ai',
      message: "That's incredibly insightful - you've identified both of your core needs. Feeling heard, valued, respected, and not criticized - these are fundamental relationship needs. The beautiful thing is that meeting these needs isn't about who's right or wrong. Let's explore how you might communicate these needs directly to your partner, and how to listen for their needs too.",
      delay: 3200,
      shouldSpeak: true
    }
  ],

  // Dr. Luna Martinez - Eating Disorder Specialist
  'dr-luna-martinez': [
    {
      role: 'user',
      message: "I've been restricting my food intake again, and I know it's not healthy, but I feel so out of control when I eat normally. The guilt is overwhelming.",
      delay: 1000
    },
    {
      role: 'ai',
      message: "I'm grateful you're sharing this with me - that takes courage. The cycle of restriction and guilt is exhausting, and you're not alone in this struggle. First, let me remind you that food is not the enemy; it's nourishment for your body and mind. The 'out of control' feeling often comes from restriction itself. Your body and brain need consistent fuel to function. How has your energy been during these restrictive periods?",
      delay: 3000,
      shouldSpeak: true
    },
    {
      role: 'user',
      message: "I'm always tired and can't concentrate. I know I should eat more, but the fear of gaining weight is so strong.",
      delay: 2200
    },
    {
      role: 'ai',
      message: "Your body is telling you exactly what it needs - that fatigue and lack of concentration are signals that you need nourishment. The fear around weight is understandable, but let's work on separating your worth from a number on a scale. You are valuable regardless of your weight. Recovery means learning to trust your body again, and we'll take that journey together, one gentle step at a time.",
      delay: 3500,
      shouldSpeak: true
    }
  ],

  // Dr. Felix Chen - OCD Specialist
  'dr-felix-chen': [
    {
      role: 'user',
      message: "I've been checking the door locks repeatedly before bed - sometimes up to 20 times. I know it's excessive, but I can't stop thinking something bad will happen if I don't check.",
      delay: 1000
    },
    {
      role: 'ai',
      message: "Thank you for describing this so clearly. What you're experiencing is a classic OCD cycle - the intrusive thought about something bad happening creates anxiety, and checking the locks provides temporary relief, which reinforces the compulsion. The key insight is that the checking isn't actually preventing anything bad from happening; it's feeding the OCD. We're going to work on breaking this cycle using exposure and response prevention techniques.",
      delay: 3200,
      shouldSpeak: true
    },
    {
      role: 'user',
      message: "But what if I don't check and something actually does happen? That thought terrifies me.",
      delay: 2000
    },
    {
      role: 'ai',
      message: "That 'what if' thought is exactly what OCD wants you to focus on - it's designed to feel terrifying. But let's look at the evidence: How many times has something bad actually happened when doors were properly locked just once? The goal isn't to eliminate the thought, but to change your relationship with it. We'll start small - maybe checking only 15 times tonight instead of 20. The anxiety will be uncomfortable, but it will pass, and you'll learn that you can tolerate uncertainty.",
      delay: 3800,
      shouldSpeak: true
    }
  ],

  // Dr. River Thompson - Bipolar Disorder Specialist
  'dr-river-thompson': [
    {
      role: 'user',
      message: "I think I'm heading into a manic episode. I've been sleeping only 3 hours a night for the past week, and I have all these grand plans that probably aren't realistic.",
      delay: 1000
    },
    {
      role: 'ai',
      message: "I appreciate your self-awareness in recognizing these early warning signs - that's a crucial skill in managing bipolar disorder. Decreased sleep and grandiose planning are indeed common early indicators of mania. The fact that you're questioning whether your plans are realistic shows great insight. Let's focus on stabilizing your routine right now. What does your current sleep schedule look like, and are you taking your medications consistently?",
      delay: 3000,
      shouldSpeak: true
    },
    {
      role: 'user',
      message: "I've been taking my meds, but I keep staying up working on this business idea. I feel so energized and creative, but I know I need sleep.",
      delay: 2200
    },
    {
      role: 'ai',
      message: "That energy and creativity can feel really positive, but protecting your sleep is crucial right now to prevent a full manic episode. Your brain needs rest to regulate mood properly. Let's create a specific plan for tonight - what time will you commit to putting away all work and screens? We can capture your creative ideas in a notebook so they're not lost, but your wellbeing comes first. Can you reach out to your support system to help monitor your mood over the next few days?",
      delay: 3600,
      shouldSpeak: true
    }
  ]
};

// Function to get conversation for a therapist
export const getTherapistDemoConversation = (therapistId: string) => {
  return therapistDemoConversations[therapistId] || therapistDemoConversations['ed979f27-2491-43f1-a779-5095febb68b2']; // Default to Dr. Sarah Chen
};