/**
 * forms.js — Form definitions for the SmartGuide chatbot.
 *
 * REMOVED FIELDS (Aadhaar):
 *   - full_name, gender, age_or_dob
 *   - has_co, address_co, address_house, address_area, address_village,
 *     address_district, address_state
 *   - email, mobile_no, pin_code
 *   - relative_name
 */

const forms = {
  aadhaar: {
    id: 'aadhaar',
    name: 'Aadhaar Enrolment/Correction/Update Form',
    fields: [
      // ────────── RESIDENCY ──────────
      {
        id: 'resident_type',
        label_en: 'Are you an Indian Resident or NRI? (Resident/NRI)',
        label_hi: 'क्या आप भारतीय निवासी हैं या एनआरआई? (Resident/NRI)',
        explanation_en: "Don't worry, I'll guide you step by step 👍 Let's start with your residency status.",
        explanation_hi: 'चिंता मत करें, मैं आपको स्टेप-बाय-स्टेप गाइड करूंगा 👍 अपनी निवास स्थिति से शुरू करते हैं।',
        type: 'text', validation: 'required'
      },

      // ────────── PRE-ENROLMENT ID ──────────
      {
        id: 'pre_enrolment_id_has',
        label_en: 'Do you have a Pre-Enrolment ID? (Yes/No)',
        label_hi: 'क्या आपके पास पूर्व-नामांकन आईडी है? (हाँ/नहीं)',
        explanation_en: "Pre-Enrolment ID is a 14-digit number you get when you start Aadhaar update online. If you haven't done that, you can leave it blank.",
        explanation_hi: "प्री-एनरोलमेंट आईडी (Pre-Enrolment ID) एक 14 अंकों का नंबर है जो आपको ऑनलाइन आधार अपडेट शुरू करने पर मिलता है। यदि आपने ऐसा नहीं किया है, तो आप इसे खाली छोड़ सकते हैं।",
        type: 'text', validation: 'required'
      },


      // ────────── APPLICATION TYPE ──────────
      {
        id: 'app_type',
        label_en: 'Are you enrolling for a New Aadhaar or Updating existing? (New/Update)',
        label_hi: 'क्या आप नए आधार के लिए नामांकन कर रहे हैं या मौजूदा को अपडेट कर रहे हैं? (New/Update)',
        explanation_en: 'Tell me if this is for a new Aadhaar card or updating an existing one.',
        explanation_hi: 'मुझे बताएं कि क्या यह नए आधार कार्ड के लिए है या मौजूदा कार्ड को अपडेट करने के लिए है।',
        type: 'text', validation: 'required'
      },

      // ────────── AADHAAR GUIDANCE ──────────
      {
        id: 'aadhaar_guidance',
        label_en: 'You will need to write your 12-digit Aadhaar number in the form. Please keep it ready. (Type OK to continue)',
        label_hi: 'आपको फॉर्म में अपना 12 अंकों का आधार नंबर लिखना होगा। कृपया इसे तैयार रखें। (आगे बढ़ने के लिए OK टाइप करें)',
        explanation_en: 'We do not collect your Aadhaar number for privacy. Just keep it ready.',
        explanation_hi: 'हम गोपनीयता के लिए आपका आधार नंबर नहीं मांगते हैं। बस इसे तैयार रखें।',
        type: 'text', validation: 'optional',
        condition: (ans) => ans.app_type && ans.app_type.toLowerCase() === 'update'
      },

      {
        id: 'update_fields',
        label_en: 'What do you want to update? (Mobile, DOB, Address, Name, Gender, Email)',
        label_hi: 'आप क्या अपडेट करना चाहते हैं? (मोबाइल, जन्मतिथि, पता, नाम, लिंग, ईमेल)',
        explanation_en: 'You can list multiple things you want to update, separated by commas.',
        explanation_hi: 'आप कोमा द्वारा अलग करके कई चीज़ें सूचीबद्ध कर सकते हैं जो आप अपडेट करना चाहते हैं।',
        type: 'text', validation: 'required',
        condition: (ans) => ans.app_type && ans.app_type.toLowerCase() === 'update'
      },

      // ────────── AGE CHECK ──────────
      {
        id: 'age_group',
        label_en: 'Are you 18 or above? (Yes/No)',
        label_hi: 'क्या आप 18 वर्ष या उससे अधिक के हैं? (हाँ/नहीं)',
        explanation_en: 'Just a quick check for our guardian details requirements.',
        explanation_hi: 'केवल हमारी अभिभावक विवरण आवश्यकताओं के लिए एक त्वरित जाँच।',
        type: 'text', validation: 'required'
      },

      // ────────── DOB DECLARED / VERIFIED ──────────
      {
        id: 'dob_declared_verified',
        label_en: 'Date of Birth: Declared or Verified?',
        label_hi: 'जन्मतिथि: घोषित या सत्यापित?',
        explanation_en: "If you have a valid document like a birth certificate, type 'Verified'. Otherwise, type 'Declared'.",
        explanation_hi: "यदि आपके पास जन्म प्रमाण पत्र जैसा मान्य दस्तावेज़ है, तो 'Verified' चुनें। अन्यथा 'Declared' चुनें।",
        type: 'text', validation: 'required'
      },

      // ────────── RELATIVE / GUARDIAN (gate question kept; relative_name removed) ──────────
      {
        id: 'relative_details_type',
        label_en: 'Details of: Father/Mother/Guardian/Husband/Wife (or type No)',
        label_hi: 'विवरण: पिता/माता/अभिभावक/पति/पत्नी (या No टाइप करें)',
        explanation_en: (ans) => {
          if (ans.age_group && ans.age_group.toLowerCase() === 'yes') {
            return "Since you're 18 or older, you can simply type 'No' to skip this section.";
          }
          return 'Since you are under 18, it is mandatory to provide parent/guardian details. Please type Father, Mother, Guardian, etc.';
        },
        explanation_hi: (ans) => {
          if (ans.age_group && ans.age_group.toLowerCase() === 'yes') {
            return "चूंकि आप 18 वर्ष या उससे अधिक हैं, इसलिए आप 'No' टाइप करके इस अनुभाग को छोड़ सकते हैं।";
          }
          return 'चूंकि आप 18 वर्ष से कम के हैं, अभिभावक का विवरण देना अनिवार्य है। कृपया पिता, माता आदि टाइप करें।';
        },
        type: 'text', validation: 'required'
      },


      // ────────── VERIFICATION TYPE ──────────
      {
        id: 'verification_type',
        label_en: 'Verification Type (Document / Introducer / HOF)',
        label_hi: 'सत्यापन प्रकार (Document / Introducer / HOF)',
        explanation_en: 'Document-based means you provide standard documents. Introducer-based means someone authorized verifies you. HOF (Head of Family) means a family member helps update your details.',
        explanation_hi: 'Document-based (दस्तावेज़ आधारित) का मतलब है कि आप मानक दस्तावेज़ देते हैं। Introducer-based का मतलब है कि कोई अधिकृत व्यक्ति आपका सत्यापन करता है। HOF (परिवार का मुखिया) का मतलब है कि परिवार का कोई सदस्य आपके विवरण अपडेट करने में मदद करता है।',
        type: 'text', validation: 'required'
      },

      // ────────── DOCUMENT-BASED ──────────
      {
        id: 'poi_doc',
        label_en: 'For Document Based - POI (Proof of Identity)',
        label_hi: 'दस्तावेज़ आधारित के लिए - पहचान का प्रमाण',
        explanation_en: 'Proof of Identity (POI) means a document that confirms who you are (like Aadhaar, PAN, etc.)',
        explanation_hi: 'पहचान प्रमाण (POI) का मतलब वह दस्तावेज होता है जो आपकी पहचान साबित करता है जैसे आधार कार्ड, पैन कार्ड आदि।',
        type: 'text', validation: 'required',
        condition: (ans) => ans.verification_type && ans.verification_type.toLowerCase().includes('document')
      },
      {
        id: 'poa_doc',
        label_en: 'For Document Based - POA (Proof of Address)',
        label_hi: 'दस्तावेज़ आधारित के लिए - पते का प्रमाण',
        explanation_en: 'Proof of Address (POA) means a document that shows where you live (like Electricity Bill, Voter ID, etc.)',
        explanation_hi: 'पता प्रमाण (POA) का मतलब वह दस्तावेज होता है जो यह दिखाता है कि आप कहाँ रहते हैं (जैसे बिजली बिल, वोटर आईडी आदि)।',
        type: 'text', validation: 'required',
        condition: (ans) => ans.verification_type && ans.verification_type.toLowerCase().includes('document')
      },
      {
        id: 'dob_doc',
        label_en: 'For Document Based - DOB (Mandatory for Verified DOB)',
        label_hi: 'दस्तावेज़ आधारित के लिए - जन्मतिथि प्रमाण',
        explanation_en: (ans) => {
          if (ans.dob_declared_verified && ans.dob_declared_verified.toLowerCase() === 'verified') {
            return "Since you chose 'Verified' DOB earlier, you MUST provide a valid document like a birth certificate.";
          }
          return "What document proves your Date of Birth? It's optional since you declared your DOB.";
        },
        explanation_hi: (ans) => {
          if (ans.dob_declared_verified && ans.dob_declared_verified.toLowerCase() === 'verified') {
            return "चूंकि आपने पहले 'Verified' DOB चुना था, इसलिए आपको जन्म प्रमाण पत्र देना ही होगा।";
          }
          return 'आपकी जन्मतिथि कौन सा दस्तावेज़ साबित करता है?';
        },
        type: 'text', validation: 'required',
        condition: (ans) =>
          ans.verification_type && ans.verification_type.toLowerCase().includes('document') &&
          ans.dob_declared_verified && ans.dob_declared_verified.toLowerCase() === 'verified'
      },
      {
        id: 'por_doc',
        label_en: 'For Document Based - POR (Proof of Relationship)',
        label_hi: 'दस्तावेज़ आधारित के लिए - रिश्ते का प्रमाण',
        explanation_en: 'Proof of Relationship (POR) means a document showing how you are related to the Head of Family (like Ration Card, Birth Certificate).',
        explanation_hi: 'रिश्ते का प्रमाण (POR) का मतलब है वह दस्तावेज़ जो दिखाता है कि परिवार के मुखिया के साथ आपका क्या रिश्ता है (जैसे राशन कार्ड, जन्म प्रमाण पत्र)।',
        type: 'text', validation: 'optional',
        condition: (ans) => ans.verification_type && ans.verification_type.toLowerCase().includes('document')
      },

      // ────────── INTRODUCER-BASED ──────────


      // ────────── HOF-BASED ──────────
      {
        id: 'hof_type',
        label_en: 'HOF Relationship (Father/Mother/Guardian/Husband/Wife)',
        label_hi: 'HOF का रिश्ता (Father/Mother/Guardian/Husband/Wife)',
        explanation_en: 'HOF (Head of Family) means a family member whose Aadhaar can be used to update your address or details. Who is the Head of Family to you?',
        explanation_hi: 'HOF (Head of Family) का मतलब परिवार का वह मुखिया होता है जिसके आधार का उपयोग आपके अपडेट के लिए किया जा सकता है। तो HOF आपका क्या लगता है?',
        type: 'text', validation: 'required',
        condition: (ans) => ans.verification_type && ans.verification_type.toLowerCase().includes('hof')
      },

    ]
  },

  // ════════════════════════════════════════════════════════════════
  //  India Post Withdrawal Form (unchanged)
  // ════════════════════════════════════════════════════════════════
  withdrawal: {
    id: 'withdrawal',
    name: 'India Post Withdrawal Form (SB-7)',
    fields: [
      { id: 'post_office_name', label_en: 'Name of the Post Office', label_hi: 'डाकघर का नाम', explanation_en: 'At which post office branch do you hold the account?', explanation_hi: 'आपका खाता किस डाकघर शाखा में है?', type: 'text', validation: 'required' },
      { id: 'date', label_en: 'Date', label_hi: 'दिनांक', explanation_en: 'What is today\'s date?', explanation_hi: 'आज की तिथि क्या है?', type: 'date', validation: 'required' },
      { id: 'account_type', label_en: 'Type of Account', label_hi: 'खाते का प्रकार', explanation_en: 'What kind of account is this? (SB/TD/MIS/SCSS/NSS/Others)', explanation_hi: 'यह किस प्रकार का खाता है? (SB/TD/MIS/SCSS/NSS/अन्य)', type: 'text', validation: 'required' },
      { id: 'nature_of_payment', label_en: 'Nature of Payment', label_hi: 'भुगतान की प्रकृति', explanation_en: 'Are you withdrawing principal amount, or just the interest?', explanation_hi: 'क्या आप पूरी राशि निकाल रहे हैं, या सिर्फ ब्याज?', type: 'text', validation: 'required' }
    ]
  },

  // ════════════════════════════════════════════════════════════════
  //  Post Office Savings Bank Application (unchanged)
  // ════════════════════════════════════════════════════════════════
  account_opening: {
    id: 'account_opening',
    name: 'Post Office Savings Bank Application (AOF)',
    fields: [
      { id: 'post_office', label_en: 'Post Office', label_hi: 'डाकघर', explanation_en: 'Name of the post office where you are opening the account.', explanation_hi: 'डाकघर का नाम जहां आप खाता खोल रहे हैं।', type: 'text', validation: 'required' },
      { id: 'applicant_type', label_en: 'I/We hereby apply for opening of an account under (Scheme Name)', label_hi: 'योजना का नाम', explanation_en: 'Which scheme are you applying under? (e.g. SB, RD, TD, PPF)', explanation_hi: 'आप किस योजना के तहत आवेदन कर रहे हैं? (उदा. PPF, RD)', type: 'text', validation: 'required' },
      { id: 'cheque_book_required', label_en: 'Cheque Book required (Yes/No)', label_hi: 'चेक बुक की आवश्यकता (हाँ/नहीं)', explanation_en: 'Do you want a cheque book with this account?', explanation_hi: 'क्या आप इस खाते के साथ चेक बुक चाहते हैं?', type: 'text', validation: 'optional' },
      { id: 'aadhaar_seeding', label_en: 'Aadhaar Seeding required? (Yes/No)', label_hi: 'आधार सीडिंग आवश्यक है? (हाँ/नहीं)', explanation_en: 'Do you want to link Aadhaar to receive DBT benefits in this account?', explanation_hi: 'क्या आप इस खाते में DBT प्राप्त करने के लिए आधार को लिंक करना चाहते हैं?', type: 'text', validation: 'optional' },
      { id: 'atm_card', label_en: 'ATM Card required? (Yes/No)', label_hi: 'एटीएम कार्ड आवश्यक है? (हाँ/नहीं)', explanation_en: 'Would you like an ATM debit card?', explanation_hi: 'क्या आप एटीएम डेबिट कार्ड चाहते हैं?', type: 'text', validation: 'optional' },
      { id: 'internet_banking', label_en: 'Internet Banking required? (Yes/No)', label_hi: 'इंटरनेट बैंकिंग आवश्यक है? (हाँ/नहीं)', explanation_en: 'Do you need Internet Banking enabled?', explanation_hi: 'क्या आपको इंटरनेट बैंकिंग सक्षम करने की आवश्यकता है?', type: 'text', validation: 'optional' },
      { id: 'mobile_banking', label_en: 'Mobile Banking required? (Yes/No)', label_hi: 'मोबाइल बैंकिंग आवश्यक है? (हाँ/नहीं)', explanation_en: 'Do you want Mobile Banking?', explanation_hi: 'क्या आप मोबाइल बैंकिंग चाहते हैं?', type: 'text', validation: 'optional' },
      { id: 'insurance_pension', label_en: 'Insurance/Pension products (PMSBY/PMJJBY/APY)', label_hi: 'बीमा/पेंशन उत्पाद', explanation_en: 'Are you subscribing to any insurance or pension product? Skip if none.', explanation_hi: 'क्या आप किसी बीमा या पेंशन उत्पाद की सदस्यता ले रहे हैं? छोड़ दें यदि नहीं।', type: 'text', validation: 'optional' },
      { id: 'account_holder_type', label_en: 'Account Holder Type', label_hi: 'खाताधारक का प्रकार', explanation_en: 'Are you opening for yourself (Self), a Minor, or Person of unsound mind?', explanation_hi: 'क्या आप अपने लिए (स्वयं), नाबालिग के लिए, या विकृत मानसिक व्यक्ति के लिए खोल रहे हैं?', type: 'text', validation: 'required' },
      { id: 'account_type', label_en: 'Account Type', label_hi: 'खाते का प्रकार', explanation_en: 'Is this a Single account, Joint (Either or Survivor), or Joint (All or Survivor)?', explanation_hi: 'क्या यह एकल खाता है या संयुक्त (जॉइंट)?', type: 'text', validation: 'required' },
      { id: 'initial_deposit_type', label_en: 'Deposit type (Cash/DD/Cheque No. & Date)', label_hi: 'जमा प्रकार', explanation_en: 'Are you depositing via Cash, DD, or Cheque?', explanation_hi: 'क्या आप नकद, डीडी या चेक के माध्यम से जमा कर रहे हैं?', type: 'text', validation: 'required' }
    ]
  }
};

module.exports = forms