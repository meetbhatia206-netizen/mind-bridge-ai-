/**
 * forms.js — Form definitions for the Serenity AI chatbot.
 * Contains conversational flows for various mental wellness categories.
 */

const forms = {
  student_burnout: {
    id: 'student_burnout',
    name: 'Student Burnout',
    fields: [
      {
        id: 'exams_stress',
        label_en: 'Are exams or assignments currently stressing you out? (Yes/No/A little)',
        explanation_term: 'Burnout',
        explanation_en: 'Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. It occurs when you feel overwhelmed, emotionally drained, and unable to meet constant demands.',
        type: 'text', validation: 'required'
      },
      {
        id: 'trouble_focusing',
        label_en: 'Are you having trouble focusing on your studies or daily tasks? (Yes/No)',
        type: 'text', validation: 'required'
      },
      {
        id: 'sleeping_properly',
        label_en: 'Are you sleeping properly? Tell me roughly how many hours you sleep.',
        type: 'number', validation: 'required'
      },
      {
        id: 'mentally_exhausted',
        label_en: 'Do you feel mentally exhausted even before the day begins? (Yes/No)',
        explanation_term: 'Emotional fatigue',
        explanation_en: 'Emotional fatigue is feeling drained and emotionally depleted. It can make you feel like you have nothing left to give.',
        type: 'text', validation: 'required'
      }
    ]
  },

  anxiety_support: {
    id: 'anxiety_support',
    name: 'Anxiety Support',
    fields: [
      {
        id: 'overthinking',
        label_en: 'Do you experience overthinking? (Yes/No)',
        explanation_term: 'Anxiety & Overthinking',
        explanation_en: "Anxiety is your body's natural response to stress. Overthinking involves dwelling on the same thought repeatedly, making it hard to switch your mind off.",
        type: 'text', validation: 'required'
      },
      {
        id: 'panic_feelings',
        label_en: 'Are you having any panic feelings or physical symptoms like a racing heart right now? (Yes/No)',
        explanation_term: 'Panic Attack',
        explanation_en: 'A panic attack is a sudden episode of intense fear that triggers severe physical reactions when there is no real danger or apparent cause.',
        type: 'text', validation: 'required'
      },
      {
        id: 'restlessness',
        label_en: 'Do you feel a sense of restlessness or an inability to sit still? (Yes/No)',
        type: 'text', validation: 'required'
      },
      {
        id: 'difficulty_relaxing',
        label_en: 'What makes it difficult for you to relax at the moment?',
        type: 'text', validation: 'required'
      }
    ]
  },

  sleep_problems: {
    id: 'sleep_problems',
    name: 'Sleep Problems',
    fields: [
      {
        id: 'screen_time',
        label_en: 'How much screen time do you usually have right before trying to sleep? (e.g., 1 hour, none)',
        type: 'text', validation: 'required'
      },
      {
        id: 'bedtime_routine',
        label_en: 'Do you have a specific bedtime routine, or do you just go to bed when you feel tired?',
        type: 'text', validation: 'required'
      },
      {
        id: 'night_overthinking',
        label_en: 'Do you find yourself overthinking when you lie in bed at night? (Yes/No)',
        explanation_term: 'Night Overthinking',
        explanation_en: 'It is very common for the mind to race at night because the distractions of the day are gone.',
        type: 'text', validation: 'required'
      }
    ]
  },

  emotional_wellness: {
    id: 'emotional_wellness',
    name: 'Emotional Wellness',
    fields: [
      {
        id: 'current_feeling',
        label_en: 'How are you feeling today? (Just a few words about what is on your mind)',
        type: 'text', validation: 'required'
      },
      {
        id: 'support_system',
        label_en: 'Do you have someone you feel comfortable talking to about your feelings? (Yes/No)',
        type: 'text', validation: 'required'
      }
    ]
  }
};

module.exports = forms;