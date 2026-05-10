/**
 * forms.js — Form definitions for the Serenity AI chatbot.
 * Contains conversational flows for various mental wellness categories.
 */

const forms = {
  student_burnout: {
    id: 'student_burnout',
    title_en: 'Student Burnout',
    title_hi: 'छात्र बर्नआउट',
    fields: [
      {
        id: 'exams_stress',
        label_en: 'Are exams or assignments currently stressing you out? (Yes/No/A little)',
        label_hi: 'क्या परीक्षा या असाइनमेंट आपको तनाव दे रहे हैं? (हां/नहीं/थोड़ा सा)',
        explanation_term: 'Burnout',
        explanation_en: 'Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. It occurs when you feel overwhelmed, emotionally drained, and unable to meet constant demands.',
        explanation_hi: 'बर्नआउट (Burnout) अत्यधिक और लंबे समय तक तनाव के कारण होने वाली भावनात्मक, शारीरिक और मानसिक थकावट की स्थिति है।',
        type: 'text', validation: 'required'
      },
      {
        id: 'trouble_focusing',
        label_en: 'Are you having trouble focusing on your studies or daily tasks? (Yes/No)',
        label_hi: 'क्या आपको अपनी पढ़ाई या दैनिक कार्यों पर ध्यान केंद्रित करने में परेशानी हो रही है? (हां/नहीं)',
        type: 'text', validation: 'required'
      },
      {
        id: 'sleeping_properly',
        label_en: 'Are you sleeping properly? Tell me roughly how many hours you sleep.',
        label_hi: 'क्या आप ठीक से सो रहे हैं? मुझे बताएं कि आप लगभग कितने घंटे सोते हैं।',
        type: 'number', validation: 'required'
      },
      {
        id: 'mentally_exhausted',
        label_en: 'Do you feel mentally exhausted even before the day begins? (Yes/No)',
        label_hi: 'क्या आप दिन शुरू होने से पहले ही मानसिक रूप से थका हुआ महसूस करते हैं? (हां/नहीं)',
        explanation_term: 'Emotional fatigue',
        explanation_en: 'Emotional fatigue is feeling drained and emotionally depleted. It can make you feel like you have nothing left to give.',
        explanation_hi: 'भावनात्मक थकान (Emotional fatigue) का अर्थ है भावनात्मक रूप से खाली महसूस करना।',
        type: 'text', validation: 'required'
      }
    ]
  },

  anxiety_support: {
    id: 'anxiety_support',
    title_en: 'Anxiety Support',
    title_hi: 'चिंता (Anxiety) सहायता',
    fields: [
      {
        id: 'overthinking',
        label_en: 'Do you experience overthinking? (Yes/No)',
        label_hi: 'क्या आपको ज्यादा सोचने (Overthinking) की समस्या होती है? (हां/नहीं)',
        explanation_term: 'Anxiety & Overthinking',
        explanation_en: "Anxiety is your body's natural response to stress. Overthinking involves dwelling on the same thought repeatedly, making it hard to switch your mind off.",
        explanation_hi: 'चिंता तनाव के प्रति आपके शरीर की स्वाभाविक प्रतिक्रिया है। ओवरथिंकिंग में बार-बार एक ही विचार के बारे में सोचना शामिल है।',
        type: 'text', validation: 'required'
      },
      {
        id: 'panic_feelings',
        label_en: 'Are you having any panic feelings or physical symptoms like a racing heart right now? (Yes/No)',
        label_hi: 'क्या आपको अभी घबराहट या दिल की धड़कन तेज होने जैसे शारीरिक लक्षण महसूस हो रहे हैं? (हां/नहीं)',
        explanation_term: 'Panic Attack',
        explanation_en: 'A panic attack is a sudden episode of intense fear that triggers severe physical reactions when there is no real danger or apparent cause.',
        explanation_hi: 'पैनिक अटैक (Panic Attack) अचानक तीव्र भय का दौरा है जो गंभीर शारीरिक प्रतिक्रियाओं को ट्रिगर करता है।',
        type: 'text', validation: 'required'
      },
      {
        id: 'restlessness',
        label_en: 'Do you feel a sense of restlessness or an inability to sit still? (Yes/No)',
        label_hi: 'क्या आप बेचैनी महसूस करते हैं या स्थिर बैठने में असमर्थ हैं? (हां/नहीं)',
        type: 'text', validation: 'required'
      },
      {
        id: 'difficulty_relaxing',
        label_en: 'What makes it difficult for you to relax at the moment?',
        label_hi: 'इस समय आपको आराम करने में क्या कठिनाई हो रही है?',
        type: 'text', validation: 'required'
      }
    ]
  },

  sleep_problems: {
    id: 'sleep_problems',
    title_en: 'Sleep Problems',
    title_hi: 'नींद की समस्या',
    fields: [
      {
        id: 'screen_time',
        label_en: 'How much screen time do you usually have right before trying to sleep? (e.g., 1 hour, none)',
        label_hi: 'सोने की कोशिश करने से ठीक पहले आप आमतौर पर कितना स्क्रीन समय बिताते हैं? (उदा. 1 घंटा, कुछ नहीं)',
        type: 'text', validation: 'required'
      },
      {
        id: 'bedtime_routine',
        label_en: 'Do you have a specific bedtime routine, or do you just go to bed when you feel tired?',
        label_hi: 'क्या आपकी सोने की कोई विशिष्ट दिनचर्या है, या जब आपको थकान महसूस होती है तो आप सो जाते हैं?',
        type: 'text', validation: 'required'
      },
      {
        id: 'night_overthinking',
        label_en: 'Do you find yourself overthinking when you lie in bed at night? (Yes/No)',
        label_hi: 'क्या आप रात में बिस्तर पर लेटते समय ज्यादा सोचते हैं? (हां/नहीं)',
        explanation_term: 'Night Overthinking',
        explanation_en: 'It is very common for the mind to race at night because the distractions of the day are gone.',
        explanation_hi: 'रात में मन का दौड़ना बहुत आम है क्योंकि दिन की विकर्षण दूर हो जाती है।',
        type: 'text', validation: 'required'
      }
    ]
  },

  overthinking: {
    id: 'overthinking',
    title_en: 'Overthinking',
    title_hi: 'ज़्यादा सोचना (Overthinking)',
    fields: [
      {
        id: 'trigger',
        label_en: 'Is there a specific thought or event that triggered your overthinking today?',
        label_hi: 'क्या कोई विशिष्ट विचार या घटना है जिसने आज आपके ज़्यादा सोचने को प्रेरित किया?',
        explanation_term: 'Triggers',
        explanation_en: 'Triggers are specific situations, memories, or thoughts that cause an emotional reaction or worsen overthinking.',
        explanation_hi: 'ट्रिगर विशिष्ट स्थितियाँ, यादें या विचार हैं जो भावनात्मक प्रतिक्रिया का कारण बनते हैं।',
        type: 'text', validation: 'required'
      },
      {
        id: 'worst_case',
        label_en: 'Are you imagining the worst-case scenario right now? (Yes/No)',
        label_hi: 'क्या आप अभी सबसे खराब स्थिति की कल्पना कर रहे हैं? (हां/नहीं)',
        type: 'text', validation: 'required'
      },
      {
        id: 'physical_tension',
        label_en: 'Do you feel physical tension in your body, like in your shoulders or jaw?',
        label_hi: 'क्या आप अपने शरीर में शारीरिक तनाव महसूस करते हैं, जैसे अपने कंधों या जबड़े में?',
        type: 'text', validation: 'required'
      }
    ]
  },

  emotional_wellness: {
    id: 'emotional_wellness',
    title_en: 'Emotional Wellness',
    title_hi: 'भावनात्मक तंदुरुस्ती',
    fields: [
      {
        id: 'current_feeling',
        label_en: 'How are you feeling today? (Just a few words about what is on your mind)',
        label_hi: 'आज आप कैसा महसूस कर रहे हैं? (बस कुछ शब्द कि आपके दिमाग में क्या चल रहा है)',
        type: 'text', validation: 'required'
      },
      {
        id: 'support_system',
        label_en: 'Do you have someone you feel comfortable talking to about your feelings? (Yes/No)',
        label_hi: 'क्या आपके पास कोई ऐसा व्यक्ति है जिससे आप अपनी भावनाओं के बारे में आराम से बात कर सकते हैं? (हां/नहीं)',
        type: 'text', validation: 'required'
      }
    ]
  }
};

module.exports = forms;