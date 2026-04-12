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
        explanation_en: 'If you applied online earlier, you would have a 14-digit Pre-Enrolment ID.',
        explanation_hi: 'यदि आपने पहले ऑनलाइन आवेदन किया है, तो आपके पास 14 अंकों की पूर्व-नामांकन आईडी होगी।',
        type: 'text', validation: 'required'
      },
      {
        id: 'pre_enrolment_id',
        label_en: 'Pre Enrolment ID:',
        label_hi: 'पूर्व-नामांकन आईडी:',
        explanation_en: 'Please enter your 14-digit Pre-Enrolment ID.',
        explanation_hi: 'कृपया अपना 14 अंकों का पूर्व-नामांकन आईडी दर्ज करें।',
        type: 'text', validation: 'required',
        condition: (ans) => ans.pre_enrolment_id_has && ans.pre_enrolment_id_has.toLowerCase() === 'yes'
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

      // ────────── UPDATE-ONLY: ID TYPE ──────────
      {
        id: 'id_type_update',
        label_en: 'Which ID will you provide? (EID / Aadhaar)',
        label_hi: 'आप कौन सा आईडी देंगे? (EID / Aadhaar)',
        explanation_en: () => 'Since you are updating, do you want to provide your Enrolment ID (EID) or your 12-digit Aadhaar number?',
        explanation_hi: () => 'चूंकि आप अपडेट कर रहे हैं, क्या आप अपना नामांकन आईडी (EID) या अपना 12 अंकों का आधार नंबर देना चाहते हैं?',
        type: 'text', validation: 'required',
        condition: (ans) => ans.app_type && ans.app_type.toLowerCase() === 'update'
      },
      {
        id: 'uid_eid_number',
        label_en: 'Enter your EID or Aadhaar Number',
        label_hi: 'अपना ईआईडी या आधार नंबर दर्ज करें',
        explanation_en: (ans) => `Please enter your ${ans.id_type_update || 'ID'} number clearly.`,
        explanation_hi: (ans) => `कृपया अपना ${ans.id_type_update || 'ID'} नंबर स्पष्ट रूप से दर्ज करें।`,
        type: 'text', validation: 'required',
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
      {
        id: 'relative_aadhaar',
        label_en: "Relative's EID / Aadhaar No.:",
        label_hi: 'रिश्तेदार का ईआईडी / आधार नंबर',
        explanation_en: 'Please provide their 12-digit Aadhaar Number.',
        explanation_hi: 'कृपया उनका 12-अंकों का आधार नंबर प्रदान करें।',
        type: 'number', validation: 'aadhaar',
        condition: (ans) => ans.relative_details_type &&
          ans.relative_details_type.toLowerCase() !== 'no' &&
          ans.relative_details_type.toLowerCase() !== 'नहीं'
      },

      // ────────── VERIFICATION TYPE ──────────
      {
        id: 'verification_type',
        label_en: 'Verification Type (Document / Introducer / HOF)',
        label_hi: 'सत्यापन प्रकार (Document / Introducer / HOF)',
        explanation_en: 'How are you verifying your identity? Based on Documents, an Introducer, or Head of Family (HOF)?',
        explanation_hi: 'आप अपनी पहचान कैसे सत्यापित कर रहे हैं? दस्तावेज़ों, एक परिचयकर्ता, या परिवार के मुखिया (HOF) के आधार पर?',
        type: 'text', validation: 'required'
      },

      // ────────── DOCUMENT-BASED ──────────
      {
        id: 'poi_doc',
        label_en: 'For Document Based - POI (Proof of Identity)',
        label_hi: 'दस्तावेज़ आधारित के लिए - पहचान का प्रमाण',
        explanation_en: 'Since you selected Document verification, what document are you submitting for Proof of Identity? (e.g. PAN card)',
        explanation_hi: 'चूंकि आपने दस्तावेज़ चुना है, आप पहचान के प्रमाण के लिए क्या जमा कर रहे हैं? (उदा. पैन कार्ड)',
        type: 'text', validation: 'required',
        condition: (ans) => ans.verification_type && ans.verification_type.toLowerCase().includes('document')
      },
      {
        id: 'poa_doc',
        label_en: 'For Document Based - POA (Proof of Address)',
        label_hi: 'दस्तावेज़ आधारित के लिए - पते का प्रमाण',
        explanation_en: 'What document are you submitting for Proof of Address? (e.g. Voter ID)',
        explanation_hi: 'पते के प्रमाण के लिए आप कौन सा दस्तावेज़ जमा कर रहे हैं? (उदा. वोटर आईडी)',
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
        explanation_en: 'If applicable, what is the document for Proof of Relationship?',
        explanation_hi: 'यदि लागू हो, तो रिश्ते के प्रमाण के लिए दस्तावेज़ क्या है?',
        type: 'text', validation: 'optional',
        condition: (ans) => ans.verification_type && ans.verification_type.toLowerCase().includes('document')
      },

      // ────────── INTRODUCER-BASED ──────────
      {
        id: 'introducer_aadhaar',
        label_en: "Introducer's Aadhaar No.:",
        label_hi: 'परिचयकर्ता का आधार नंबर',
        explanation_en: 'Since you chose Introducer verification, provide their Aadhaar Number.',
        explanation_hi: 'चूंकि आपने परिचयकर्ता सत्यापन चुना है, इसलिए उनका आधार नंबर प्रदान करें।',
        type: 'number', validation: 'aadhaar_optional',
        condition: (ans) => ans.verification_type && ans.verification_type.toLowerCase().includes('introducer')
      },

      // ────────── HOF-BASED ──────────
      {
        id: 'hof_type',
        label_en: 'HOF Relationship (Father/Mother/Guardian/Husband/Wife)',
        label_hi: 'HOF का रिश्ता (Father/Mother/Guardian/Husband/Wife)',
        explanation_en: 'Since you chose HOF validation, who is the Head of Family to you?',
        explanation_hi: 'चूंकि आपने HOF चुना है, तो HOF आपका क्या लगता है?',
        type: 'text', validation: 'required',
        condition: (ans) => ans.verification_type && ans.verification_type.toLowerCase().includes('hof')
      },
      {
        id: 'hof_aadhaar',
        label_en: "HoF's EID / Aadhaar No.:",
        label_hi: 'HoF का ईआईडी/आधार नंबर',
        explanation_en: "Please provide the Head of Family's Aadhaar Number.",
        explanation_hi: 'कृपया परिवार के मुखिया का आधार नंबर प्रदान करें।',
        type: 'number', validation: 'aadhaar_optional',
        condition: (ans) => ans.verification_type && ans.verification_type.toLowerCase().includes('hof')
      }
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
      { id: 'account_no', label_en: 'Account No.', label_hi: 'खाता संख्या', explanation_en: 'Enter your Post Office account number.', explanation_hi: 'अपना डाकघर खाता संख्या दर्ज करें।', type: 'text', validation: 'required' },
      { id: 'nature_of_payment', label_en: 'Nature of Payment', label_hi: 'भुगतान की प्रकृति', explanation_en: 'Are you withdrawing principal amount, or just the interest?', explanation_hi: 'क्या आप पूरी राशि निकाल रहे हैं, या सिर्फ ब्याज?', type: 'text', validation: 'required' },
      { id: 'amount_figures', label_en: 'Amount (In figures)', label_hi: 'राशि (अंकों में)', explanation_en: 'How much money do you want to withdraw? (Type numbers only)', explanation_hi: 'आप कितनी धनराशि निकालना चाहते हैं? (केवल संख्या लिखें)', type: 'number', validation: 'required' },
      { id: 'amount_words', label_en: 'Amount (In words)', label_hi: 'राशि (शब्दों में)', explanation_en: 'Please type the withdrawal amount in words for verification.', explanation_hi: 'सत्यापन के लिए कृपया निकासी राशि को शब्दों में टाइप करें।', type: 'text', validation: 'required' }
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
      { id: 'ippb_ac', label_en: 'IPPB A/C details', label_hi: 'आईपीपीबी खाता विवरण', explanation_en: 'If you already have an India Post Payments Bank account, mention it. Else skip.', explanation_hi: 'यदि आपके पास पहले से IPPB खाता है, तो उसका उल्लेख करें। अन्यथा छोड़ दें।', type: 'text', validation: 'optional' },
      { id: 'aadhaar_seeding', label_en: 'Aadhaar Seeding required? (Yes/No)', label_hi: 'आधार सीडिंग आवश्यक है? (हाँ/नहीं)', explanation_en: 'Do you want to link Aadhaar to receive DBT benefits in this account?', explanation_hi: 'क्या आप इस खाते में DBT प्राप्त करने के लिए आधार को लिंक करना चाहते हैं?', type: 'text', validation: 'optional' },
      { id: 'atm_card', label_en: 'ATM Card required? (Yes/No)', label_hi: 'एटीएम कार्ड आवश्यक है? (हाँ/नहीं)', explanation_en: 'Would you like an ATM debit card?', explanation_hi: 'क्या आप एटीएम डेबिट कार्ड चाहते हैं?', type: 'text', validation: 'optional' },
      { id: 'internet_banking', label_en: 'Internet Banking required? (Yes/No)', label_hi: 'इंटरनेट बैंकिंग आवश्यक है? (हाँ/नहीं)', explanation_en: 'Do you need Internet Banking enabled?', explanation_hi: 'क्या आपको इंटरनेट बैंकिंग सक्षम करने की आवश्यकता है?', type: 'text', validation: 'optional' },
      { id: 'mobile_banking', label_en: 'Mobile Banking required? (Yes/No)', label_hi: 'मोबाइल बैंकिंग आवश्यक है? (हाँ/नहीं)', explanation_en: 'Do you want Mobile Banking?', explanation_hi: 'क्या आप मोबाइल बैंकिंग चाहते हैं?', type: 'text', validation: 'optional' },
      { id: 'insurance_pension', label_en: 'Insurance/Pension products (PMSBY/PMJJBY/APY)', label_hi: 'बीमा/पेंशन उत्पाद', explanation_en: 'Are you subscribing to any insurance or pension product? Skip if none.', explanation_hi: 'क्या आप किसी बीमा या पेंशन उत्पाद की सदस्यता ले रहे हैं? छोड़ दें यदि नहीं।', type: 'text', validation: 'optional' },
      { id: 'account_holder_type', label_en: 'Account Holder Type', label_hi: 'खाताधारक का प्रकार', explanation_en: 'Are you opening for yourself (Self), a Minor, or Person of unsound mind?', explanation_hi: 'क्या आप अपने लिए (स्वयं), नाबालिग के लिए, या विकृत मानसिक व्यक्ति के लिए खोल रहे हैं?', type: 'text', validation: 'required' },
      { id: 'account_type', label_en: 'Account Type', label_hi: 'खाते का प्रकार', explanation_en: 'Is this a Single account, Joint (Either or Survivor), or Joint (All or Survivor)?', explanation_hi: 'क्या यह एकल खाता है या संयुक्त (जॉइंट)?', type: 'text', validation: 'required' },

      { id: 'minor_details_name', label_en: 'If minor: Name of Minor', label_hi: 'यदि नाबालिग: नाबालिग का नाम', explanation_en: 'Please provide the name of the minor.', explanation_hi: 'कृपया नाबालिग का नाम प्रदान करें।', type: 'text', validation: 'optional', condition: (ans) => ans.account_holder_type && ans.account_holder_type.toLowerCase().includes('minor') },
      { id: 'minor_details_dob', label_en: 'If minor: Date of Birth', label_hi: 'यदि नाबालिग: जन्मतिथि', explanation_en: "What is the minor's date of birth?", explanation_hi: 'नाबालिग की जन्मतिथि क्या है?', type: 'date', validation: 'optional', condition: (ans) => ans.account_holder_type && ans.account_holder_type.toLowerCase().includes('minor') },
      { id: 'minor_details_gender', label_en: 'If minor: Gender', label_hi: 'यदि नाबालिग: लिंग', explanation_en: "What is the minor's gender?", explanation_hi: 'नाबालिग का लिंग क्या है?', type: 'text', validation: 'optional', condition: (ans) => ans.account_holder_type && ans.account_holder_type.toLowerCase().includes('minor') },
      { id: 'minor_details_guardian', label_en: 'If minor: Name of Guardian', label_hi: 'यदि नाबालिग: अभिभावक का नाम', explanation_en: "Please provide the Guardian's name.", explanation_hi: 'कृपया अभिभावक का नाम प्रदान करें।', type: 'text', validation: 'optional', condition: (ans) => ans.account_holder_type && ans.account_holder_type.toLowerCase().includes('minor') },

      { id: 'initial_deposit_figures', label_en: 'Initial deposit amount Rs.', label_hi: 'प्रारंभिक जमा राशि रु.', explanation_en: 'How much cash are you depositing initially to open the account?', explanation_hi: 'खाता खोलने के लिए आप शुरू में कितनी नकदी जमा कर रहे हैं?', type: 'number', validation: 'required' },
      { id: 'initial_deposit_words', label_en: 'Initial deposit (In words)', label_hi: 'प्रारंभिक जमा (शब्दों में)', explanation_en: 'Please spell out the deposit amount.', explanation_hi: 'कृपया जमा राशि को शब्दों में लिखें।', type: 'text', validation: 'required' },
      { id: 'initial_deposit_type', label_en: 'Deposit type (Cash/DD/Cheque No. & Date)', label_hi: 'जमा प्रकार', explanation_en: 'Are you depositing via Cash, DD, or Cheque?', explanation_hi: 'क्या आप नकद, डीडी या चेक के माध्यम से जमा कर रहे हैं?', type: 'text', validation: 'required' },
      { id: 'app1_name', label_en: '1st Applicant: Name', label_hi: 'प्रथम आवेदक: नाम', explanation_en: 'Provide the full legal name of the 1st applicant.', explanation_hi: 'प्रथम आवेदक का पूरा कानूनी नाम दर्ज करें।', type: 'text', validation: 'name_required' },
      { id: 'app1_relative_name', label_en: '1st Applicant: Name of Husband/Father/Mother', label_hi: 'प्रथम आवेदक: पति/पिता/माता का नाम', explanation_en: 'Name of your parent or spouse.', explanation_hi: 'आपके माता-पिता या जीवनसाथी का नाम।', type: 'text', validation: 'required' },
      { id: 'app1_gender', label_en: '1st Applicant: Gender (M/F/O)', label_hi: 'प्रथम आवेदक: लिंग (M/F/O)', explanation_en: 'Gender of the applicant.', explanation_hi: 'आवेदक का लिंग।', type: 'text', validation: 'required' },
      { id: 'app1_dob', label_en: '1st Applicant: Date of Birth (DD/MM/YYYY)', label_hi: 'प्रथम आवेदक: जन्मतिथि', explanation_en: 'Date of birth of the applicant.', explanation_hi: 'आवेदक की जन्मतिथि।', type: 'date', validation: 'required' },
      { id: 'app1_aadhaar', label_en: '1st Applicant: Aadhaar Number', label_hi: 'प्रथम आवेदक: आधार नंबर', explanation_en: 'Your 12-digit Aadhaar number.', explanation_hi: 'आपका 12 अंकों का आधार नंबर।', type: 'number', validation: 'aadhaar' },
      { id: 'app1_pan', label_en: '1st Applicant: PAN Number', label_hi: 'प्रथम आवेदक: पैन नंबर', explanation_en: 'Your PAN card number.', explanation_hi: 'आपका पैन कार्ड नंबर।', type: 'text', validation: 'optional' },
      { id: 'app1_present_address', label_en: '1st Applicant: Present Address', label_hi: 'प्रथम आवेदक: वर्तमान पता', explanation_en: 'Where are you currently living?', explanation_hi: 'आप वर्तमान में कहाँ रह रहे हैं?', type: 'text', validation: 'required' },
      { id: 'app1_permanent_address', label_en: '1st Applicant: Permanent Address', label_hi: 'प्रथम आवेदक: स्थायी पता', explanation_en: 'What is your permanent address?', explanation_hi: 'आपका स्थायी पता क्या है?', type: 'text', validation: 'required' },
      { id: 'app1_mobile', label_en: '1st Applicant: Mobile No.', label_hi: 'प्रथम आवेदक: मोबाइल नंबर', explanation_en: 'Provide your 10-digit mobile number.', explanation_hi: 'अपना 10 अंकों का मोबाइल नंबर प्रदान करें।', type: 'number', validation: 'mobile' },
      { id: 'app1_id_proof', label_en: '1st Applicant: ID Proof (Doc No/Date/Issuer)', label_hi: 'प्रथम आवेदक: पहचान प्रमाण (विवरण)', explanation_en: 'Provide details of the ID proof document.', explanation_hi: 'पहचान प्रमाण दस्तावेज़ का विवरण प्रदान करें।', type: 'text', validation: 'required' },
      { id: 'app1_address_proof', label_en: '1st Applicant: Address Proof (Doc No/Date/Issuer)', label_hi: 'प्रथम आवेदक: पता प्रमाण (विवरण)', explanation_en: 'Provide details of the Address proof document.', explanation_hi: 'पता प्रमाण दस्तावेज़ का विवरण प्रदान करें।', type: 'text', validation: 'required' },

      { id: 'nomination_name', label_en: 'Nomination: Name(s) of nominee', label_hi: 'नामांकन: नॉमिनी का नाम', explanation_en: 'Do you want to nominate someone? If yes, provide their name. Else skip.', explanation_hi: 'क्या आप किसी का नामांकन करना चाहते हैं? यदि हाँ, तो उनका नाम दें। अन्यथा छोड़ दें।', type: 'text', validation: 'optional' },
      { id: 'nomination_address', label_en: 'Nomination: Full address', label_hi: 'नामांकन: पूरा पता', explanation_en: "Provide the nominee's address.", explanation_hi: 'नॉमिनी का पता प्रदान करें।', type: 'text', validation: 'optional', condition: (ans) => ans.nomination_name && ans.nomination_name.trim() !== '' },
      { id: 'nomination_aadhaar', label_en: 'Nomination: Aadhaar Number', label_hi: 'नामांकन: आधार नंबर', explanation_en: "Provide the nominee's Aadhaar, if available.", explanation_hi: 'नॉमिनी का आधार प्रदान करें, यदि उपलब्ध हो।', type: 'number', validation: 'aadhaar_optional', condition: (ans) => ans.nomination_name && ans.nomination_name.trim() !== '' },
      { id: 'nomination_dob_minor', label_en: 'Nomination: Date of birth (If minor)', label_hi: 'नामांकन: जन्मतिथि (यदि नाबालिग हो)', explanation_en: 'If the nominee is a minor, what is their Date of Birth?', explanation_hi: 'यदि नॉमिनी नाबालिग है, तो उनकी जन्मतिथि क्या है?', type: 'text', validation: 'optional', condition: (ans) => ans.nomination_name && ans.nomination_name.trim() !== '' }
    ]
  }
};

module.exports = forms