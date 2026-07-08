
function installCasualInspectionBlocker() {
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const blockedShortcut =
      event.key === 'F12' ||
      (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
      (event.ctrlKey && key === 'u');

    if (blockedShortcut) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

installCasualInspectionBlocker();

function formatLabel(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '-';
  if (raw === '-') return '-';
  const known = {
    crm: 'CRM',
    admin: 'Admin',
    board: 'Board Member',
    board_member: 'Board Member',
    employee: 'Employee',
    student: 'Student',
    client: 'Client',
    ceo: 'Admin / CEO',
    b2b: 'B2B',
    new_user: 'New User',
    work_started: 'Work Started',
    not_started: 'Not Started',
    in_progress: 'In Progress',
    client_consultant: 'Client / Consultant',
    own_self: 'Own / Self',
    online_reference: 'Online Reference',
    banker_reference: 'Banker Reference',
    employee_reference: 'Employee Reference',
    not_applicable: 'Not Applicable',
    admin_status: 'Admin Status',
    user_dashboard: 'User Dashboard',
    student_login: 'Student Login'
  };
  const lowered = raw.toLowerCase();
  if (known[lowered]) return known[lowered];
  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

window.NIDHI_formatLabel = formatLabel;

// Translation dictionary
const translations = {
  'en': {
    'home': 'Home',
    'home-nav': 'Home',
    'services-nav': 'Services',
    'about-us-nav': 'About Us',
    'eligibility-nav': 'Eligibility',
    'contact-us-nav': 'Contact Us',
    'hero-title': 'Education Loan Specialist',
    'hero-desc': 'Guiding you to the right financial solutions',
    'apply-now': 'Apply Now',
    'calculator-title': 'Eligibility & EMI Calculator',
    'loan-amount': 'Loan Amount',
    'tenure': 'Tenure (Months)',
    'interest-rate': 'Interest Rate (per annum %)',
    'calculate': 'Calculate EMI',
    'services-title': 'Our Services',
    'education-loan': 'Education Loan',
    'education-loan-desc': 'Affordable solutions for your education',
    'personal-loan': 'Personal Loan',
    'personal-loan-desc': 'Loan for your personal needs',
    'business-loan': 'Business Loan',
    'business-loan-desc': 'Finance for your business ventures',
    'home-loan': 'Home Loan',
    'home-loan-desc': 'Make your dream home a reality',
    'mutual-funds': 'Mutual Funds',
    'mutual-funds-desc': 'Investment options for wealth building',
    'insurance': 'Insurance',
    'insurance-desc': 'Protection for tomorrow',
    'all-loans': 'All Types of Loans',
    'all-loans-desc': 'Comprehensive loan options',
    'loan-consultation': 'Loan Consultation',
    'loan-consultation-desc': 'Expert advice and guidance',
    'why-title': 'About Us',
    'guidance': 'Guidance',
    'guidance-desc': 'We provide personalised guidance for your loan application',
    'consultation': 'Consultation',
    'consultation-desc': 'Expert consultation to choose the right loan',
    'processing-support': 'Processing Support',
    'processing-support-desc': 'End-to-end support through the loan processing',
    'contact-title': 'Contact Us',
    'contact-info': 'For any enquiries or support, please contact us.',
    'login': 'Login',
    'secure-access': 'Secure Access',
    'login-title': 'Welcome back to your {{brand}} portal',
    'login-subtitle': 'Sign in to review loan updates, continue applications, and stay close to your financial journey.',
    'login-highlight-1': 'Track applications and support requests whenever you need them.',
    'login-highlight-2': 'Protected access for your customer information and documents.',
    'login-help-title': 'Need help signing in?',
    'login-help-desc': 'Our team can help you recover access, answer account questions, or guide you to the right loan support desk.',
    'sign-in': 'Sign In',
    'login-panel-copy': 'Use your registered email address or phone number to continue.',
    'login-email-or-phone': 'Email or Phone Number',
    'login-password': 'Password',
    'login-email-placeholder': 'Enter your email or mobile number',
    'login-password-placeholder': 'Enter your password',
    'remember-me': 'Remember me on this device',
    'forgot-password': 'Forgot password?',
    'sign-up': 'Sign Up',
    'create-account': 'Create Account',
    'confirm-password': 'Confirm Password',
  'signup-consent': 'By creating an account, you agree that Nidhi Path Loan Ventures may contact you regarding your loan services and account access.',
  'password-mismatch': 'Passwords do not match.',
  'signup-success': 'Account created. Please check your email and complete verification before signing in.',
  'email-verification-required': 'Please verify your email before signing in.',
  'login-security-title': 'Verified email access',
  'login-security-copy': 'New customer signup uses email verification before account login.',
  'login-trust-copy': 'Your details are used only for account access and loan support.',
  'new-customer-prompt': 'New customer?',
  'already-registered-prompt': 'Already registered?',
  'translate-label': 'Translate',
    'show-password': 'Show',
    'hide-password': 'Hide',
    'login-note': 'Only authorized users can sign in. For access help, contact our support team.',
    'login-success': 'Sign-in successful. Redirecting...',
    'login-error': 'Enter a valid email or phone number and a password with at least 6 characters.',
    'name-label': 'Name',
    'email-label': 'Email',
    'phone-label': 'Phone',
    'message-label': 'Message',
    'submit': 'Submit',
    'loan-type': 'Loan Type',
    'loan-amount-needed': 'Loan Amount Needed',
    'loan-tenure': 'Tenure (Months)',
    'loan-interest-rate': 'Interest Rate (%)',
    'result-emi': 'Monthly EMI',
    'result-total-payment': 'Total Payment',
    'result-total-interest': 'Total Interest'
  },
  'hi': {
    'hero-title': 'शिक्षा ऋण विशेषज्ञ',
    'hero-desc': 'आपको सही वित्तीय समाधानों के लिए मार्गदर्शन करना',
    'apply-now': 'अभी आवेदन करें',
    'calculator-title': 'पात्रता एवं ईएमआई कैलकुलेटर',
    'loan-amount': 'ऋण राशि',
    'tenure': 'कार्यकाल (महीने)',
    'interest-rate': 'ब्याज दर (प्रति वर्ष%)',
    'calculate': 'मासिक किस्त गणना करें',
    'services-title': 'हमारी सेवाएँ',
    'education-loan': 'शिक्षा ऋण',
    'education-loan-desc': 'आपकी शिक्षा के लिए किफायती समाधान',
    'personal-loan': 'व्यक्तिगत ऋण',
    'personal-loan-desc': 'आपकी व्यक्तिगत जरूरतों के लिए फंड',
    'business-loan': 'बिजनेस लोन',
    'business-loan-desc': 'आपके व्यावसायिक उद्यमों के लिए वित्त',
    'home-loan': 'गृह ऋण',
    'home-loan-desc': 'अपने घर के सपने को साकार करें',
    'mutual-funds': 'म्यूचुअल फंड',
    'mutual-funds-desc': 'धन निर्माण के लिए निवेश विकल्प',
    'insurance': 'बीमा',
    'insurance-desc': 'कल के लिए सुरक्षा',
    'all-loans': 'सभी प्रकार के ऋण',
    'all-loans-desc': 'व्यापक फंड विकल्प',
    'loan-consultation': 'ऋण परामर्श',
    'loan-consultation-desc': 'विशेषज्ञ की सलाह एवं मार्गदर्शन',
    'why-title': 'हमारे बारे में',
    'guidance': 'मार्गदर्शन',
    'guidance-desc': 'हम आपके फंड आवेदन के लिए व्यक्तिगत मार्गदर्शन प्रदान करते हैं',
    'consultation': 'परामर्श',
    'consultation-desc': 'सही फंड चुनने के लिए विशेषज्ञ परामर्श',
    'processing-support': 'प्रक्रिया सहायता',
    'processing-support-desc': 'फंड प्रोसेसिंग के माध्यम से शुरू से अंत तक समर्थन',
    'contact-title': 'हमसे संपर्क करें',
    'contact-info': 'किसी भी पूछताछ या सहायता के लिए कृपया हमसे संपर्क करें।',
    'name-label': 'नाम',
    'email-label': 'ईमेल',
    'phone-label': 'फ़ोन',
    'message-label': 'संदेश',
    'submit': 'सबमिट करें',
    'loan-type': 'ऋण प्रकार',
    'loan-amount-needed': 'आवश्यक ऋण राशि',
    'loan-tenure': 'कार्यकाल (महीने)',
    'loan-interest-rate': 'ब्याज दर (%)',
    'result-emi': 'मासिक किस्त',
    'result-total-payment': 'कुल भुगतान',
    'result-total-interest': 'कुल ब्याज'
  },
  'te': {
    'hero-title': 'ఎడ్యుకేషన్ లోన్ స్పెషలిస్ట్',
    'hero-desc': 'సరైన ఆర్థిక పరిష్కారాల వైపు మీకు మార్గనిర్దేశం చేస్తుంది',
    'apply-now': 'ఇప్పుడే వర్తించు',
    'calculator-title': 'అర్హత & EMI కాలిక్యులేటర్',
    'loan-amount': 'రుణ మొత్తం',
    'tenure': 'పదవీకాలం (నెలలు)',
    'interest-rate': 'వడ్డీ రేటు (సంవత్సరానికి %)',
    'calculate': 'నెలవారీ వాయిదా లెక్కించండి',
    'services-title': 'మా సేవలు',
    'education-loan': 'విద్యా రుణం',
    'education-loan-desc': 'మీ విద్య కోసం సరసమైన పరిష్కారాలు',
    'personal-loan': 'వ్యక్తిగత రుణం',
    'personal-loan-desc': 'మీ వ్యక్తిగత అవసరాల కోసం ఫండ్',
    'business-loan': 'వ్యాపార రుణం',
    'business-loan-desc': 'మీ వ్యాపార వెంచర్లకు ఫైనాన్స్',
    'home-loan': 'గృహ రుణం',
    'home-loan-desc': 'మీ కలల ఇంటిని సాకారం చేసుకోండి',
    'mutual-funds': 'మ్యూచువల్ ఫండ్లు',
    'mutual-funds-desc': 'సంపద నిర్మాణానికి పెట్టుబడి ఎంపికలు',
    'insurance': 'బీమా',
    'insurance-desc': 'రేపటికి రక్షణ',
    'all-loans': 'అన్ని రకాల రుణాలు',
    'all-loans-desc': 'సమగ్ర ఫండ్ ఎంపికలు',
    'loan-consultation': 'లోన్ కన్సల్టేషన్',
    'loan-consultation-desc': 'నిపుణుల సలహా మరియు మార్గదర్శకత్వం',
    'why-title': 'మా గురించి',
    'guidance': 'మార్గదర్శకం',
    'guidance-desc': 'మేము మీ ఫండ్ అప్లికేషన్ కోసం వ్యక్తిగతీకరించిన మార్గదర్శకాలను అందిస్తాము',
    'consultation': 'సంప్రదింపు',
    'consultation-desc': 'సరైన ఫండ్‌ను ఎంచుకోవడానికి నిపుణుల సంప్రదింపులు',
    'processing-support': 'ప్రక్రియ సహాయం',
    'processing-support-desc': 'ఫండ్ ప్రాసెసింగ్ ద్వారా ఎండ్-టు-ఎండ్ మద్దతు',
    'contact-title': 'మమ్మల్ని సంప్రదించండి',
    'contact-info': 'ఏవైనా విచారణలు లేదా మద్దతు కోసం, దయచేసి మమ్మల్ని సంప్రదించండి.',
    'name-label': 'పేరు',
    'email-label': 'ఈమెయిల్',
    'phone-label': 'ఫోన్',
    'message-label': 'సందేశం',
    'submit': 'సమర్పించండి',
    'loan-type': 'రుణ రకం',
    'loan-amount-needed': 'అవసరమైన రుణ మొత్తం',
    'loan-tenure': 'పదవీకాలం (నెలలు)',
    'loan-interest-rate': 'వడ్డీ రేటు (%)',
    'result-emi': 'నెలవారీ వాయిదా',
    'result-total-payment': 'మొత్తం చెల్లింపు',
    'result-total-interest': 'మొత్తం వడ్డీ'
  }
};

Object.assign(translations.hi, {
  'home-nav': 'मुख्य पृष्ठ',
  'services-nav': 'सेवाएं',
  'about-us-nav': 'हमारे बारे में',
  'eligibility-nav': 'पात्रता',
  'contact-us-nav': 'हमसे संपर्क करें',
  'login': 'लॉगिन',
  'translate-label': 'अनुवाद करें',
  'services-title': 'हमारी सेवाएँ',
  'education-loan': 'शिक्षा ऋण',
  'personal-loan': 'व्यक्तिगत ऋण',
  'business-loan': 'बिजनेस लोन',
  'home-loan': 'गृह ऋण',
  'mutual-funds': 'म्यूचुअल फंड',
  'insurance': 'बीमा',
  'all-loans': 'सभी प्रकार के ऋण',
  'loan-consultation': 'ऋण परामर्श',
  'contact-title': 'हमसे संपर्क करें',
  'secure-access': 'सुरक्षित प्रवेश',
  'login-title': '{{brand}} पोर्टल में आपका फिर से स्वागत है',
  'login-subtitle': 'ऋण अपडेट देखने, आवेदन जारी रखने और अपनी वित्तीय यात्रा से जुड़े रहने के लिए साइन इन करें।',
  'login-highlight-1': 'जब भी ज़रूरत हो आवेदन और सहायता अनुरोध देखें।',
  'login-highlight-2': 'ग्राहक जानकारी और दस्तावेज़ों के लिए सुरक्षित पहुंच।',
  'login-help-title': 'साइन इन में मदद चाहिए?',
  'login-help-desc': 'हमारी टीम पहुंच वापस पाने, खाते से जुड़े प्रश्नों का उत्तर देने या सही ऋण सहायता डेस्क तक पहुंचाने में मदद कर सकती है।',
  'sign-in': 'साइन इन',
  'login-panel-copy': 'जारी रखने के लिए अपना पंजीकृत ईमेल पता या फ़ोन नंबर दर्ज करें।',
  'login-email-or-phone': 'ईमेल या फ़ोन नंबर',
  'login-password': 'पासवर्ड',
  'login-email-placeholder': 'अपना ईमेल या मोबाइल नंबर दर्ज करें',
  'login-password-placeholder': 'अपना पासवर्ड दर्ज करें',
  'remember-me': 'इस डिवाइस पर याद रखें',
  'forgot-password': 'पासवर्ड भूल गए?',
  'show-password': 'दिखाएं',
  'hide-password': 'छुपाएं',
  'login-note': 'बैकएंड उपलब्ध होने पर यह प्रोटोटाइप वास्तविक प्रमाणीकरण प्रक्रिया से जोड़ा जा सकता है।',
  'login-success': 'डेमो साइन इन सफल रहा। आगे बढ़ने के लिए इस फ़ॉर्म को वास्तविक प्रमाणीकरण सेवा से जोड़ें।',
  'login-error': 'मान्य ईमेल या फ़ोन नंबर और कम से कम 6 अक्षरों का पासवर्ड दर्ज करें।',
  'name-label': 'नाम',
  'email-label': 'ईमेल',
  'phone-label': 'फ़ोन',
  'message-label': 'संदेश',
  'submit': 'सबमिट करें',
  'loan-amount-needed': 'आवश्यक ऋण राशि',
  'loan-tenure': 'कार्यकाल (महीने)',
  'result-emi': 'मासिक किस्त',
  'result-total-payment': 'कुल भुगतान',
  'result-total-interest': 'कुल ब्याज'
});

Object.assign(translations.te, {
  'home-nav': 'ముఖ్య పేజీ',
  'services-nav': 'సేవలు',
  'about-us-nav': 'మా గురించి',
  'eligibility-nav': 'అర్హత',
  'contact-us-nav': 'మమ్మల్ని సంప్రదించండి',
  'login': 'ప్రవేశం',
  'translate-label': 'అనువదించు',
  'services-title': 'మా సేవలు',
  'education-loan': 'విద్యా రుణం',
  'personal-loan': 'వ్యక్తిగత రుణం',
  'business-loan': 'వ్యాపార రుణం',
  'home-loan': 'గృహ రుణం',
  'mutual-funds': 'మ్యూచువల్ ఫండ్లు',
  'insurance': 'బీమా',
  'all-loans': 'అన్ని రకాల రుణాలు',
  'loan-consultation': 'లోన్ కన్సల్టేషన్',
  'contact-title': 'మమ్మల్ని సంప్రదించండి',
  'secure-access': 'సురక్షిత ప్రవేశం',
  'login-title': '{{brand}} పోర్టల్‌కు తిరిగి స్వాగతం',
  'login-subtitle': 'రుణ నవీకరణలను చూడడానికి, దరఖాస్తులను కొనసాగించడానికి మరియు మీ ఆర్థిక ప్రయాణానికి దగ్గరగా ఉండడానికి సైన్ ఇన్ చేయండి.',
  'login-highlight-1': 'అవసరమైనప్పుడు దరఖాస్తులు మరియు సహాయ అభ్యర్థనలను చూడండి.',
  'login-highlight-2': 'కస్టమర్ సమాచారం మరియు పత్రాల కోసం రక్షిత ప్రవేశం.',
  'login-help-title': 'సైన్ ఇన్‌కు సహాయం కావాలా?',
  'login-help-desc': 'మా బృందం ప్రవేశాన్ని తిరిగి పొందడంలో, ఖాతా ప్రశ్నలకు సమాధానం ఇవ్వడంలో లేదా సరైన రుణ సహాయ విభాగానికి దారి చూపడంలో సహాయపడుతుంది.',
  'sign-in': 'సైన్ ఇన్',
  'login-panel-copy': 'కొనసాగడానికి మీ నమోదైన ఈమెయిల్ చిరునామా లేదా ఫోన్ నంబర్‌ను ఉపయోగించండి.',
  'login-email-or-phone': 'ఈమెయిల్ లేదా ఫోన్ నంబర్',
  'login-password': 'పాస్‌వర్డ్',
  'login-email-placeholder': 'మీ ఈమెయిల్ లేదా మొబైల్ నంబర్ నమోదు చేయండి',
  'login-password-placeholder': 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
  'remember-me': 'ఈ పరికరంలో గుర్తుంచుకోండి',
  'forgot-password': 'పాస్‌వర్డ్ మర్చిపోయారా?',
  'show-password': 'చూపించండి',
  'hide-password': 'దాచండి',
  'login-note': 'బ్యాకెండ్ అందుబాటులో ఉన్నప్పుడు ఈ నమూనాను నిజమైన ప్రమాణీకరణ ప్రక్రియతో కలపవచ్చు.',
  'login-success': 'డెమో సైన్ ఇన్ విజయవంతమైంది. కొనసాగడానికి ఈ ఫారమ్‌ను నిజమైన ప్రమాణీకరణ సేవతో కలపండి.',
  'login-error': 'సరైన ఈమెయిల్ లేదా ఫోన్ నంబర్ మరియు కనీసం 6 అక్షరాల పాస్‌వర్డ్ నమోదు చేయండి.',
  'name-label': 'పేరు',
  'email-label': 'ఈమెయిల్',
  'phone-label': 'ఫోన్',
  'message-label': 'సందేశం',
  'submit': 'సమర్పించండి',
  'loan-amount-needed': 'అవసరమైన రుణ మొత్తం',
  'loan-tenure': 'పదవీకాలం (నెలలు)',
  'result-emi': 'నెలవారీ వాయిదా',
  'result-total-payment': 'మొత్తం చెల్లింపు',
  'result-total-interest': 'మొత్తం వడ్డీ'
});

const phraseTranslations = {
  hi: {
    'Education Loan Specialist': 'शिक्षा ऋण विशेषज्ञ',
    'Shape Your': 'बनाएं अपनी',
    'Ambition': 'महत्वाकांक्षा',
    'Direction': 'दिशा',
    'Milestone': 'उपलब्धि',
    'Momentum': 'गति',
    'With Guided Support': 'मार्गदर्शक सहायता के साथ',
    'Nidhi Path Loan Ventures helps students and parents prepare for education loans with clear consultation, document preparation, EMI planning and practical multiple bank process guidance.': 'निधि पथ फंड वेंचर्स छात्रों और अभिभावकों को स्पष्ट परामर्श, दस्तावेज़ तैयार करने, ईएमआई योजना और व्यावहारिक एकाधिक बैंक प्रक्रिया मार्गदर्शन के साथ शिक्षा वित्त पोषण के लिए तैयार करने में मदद करता है।',
    'Education loan focus': 'शिक्षा निधि फोकस',
    'Domestic and abroad guidance': 'घरेलू और विदेशी मार्गदर्शन',
    'Parent/co-applicant support': 'माता-पिता/सह-आवेदक का समर्थन',
    'Documentation clarity': 'दस्तावेज़ीकरण स्पष्टता',
    'Apply for Education Loan': 'शिक्षा ऋण के लिए आवेदन करें',
    'Calculate EMI': 'मासिक किस्त गणना करें',
    'India + Abroad': 'भारत + विदेश',
    'Study route planning': 'मार्ग योजना का अध्ययन करें',
    'Documents': 'दस्तावेज़',
    'Checklist support': 'चेकलिस्ट समर्थन',
    'EMI Planning': 'ईएमआई योजना',
    'Cost clarity': 'लागत स्पष्टता',
    'Ambition Mapping': 'महत्वाकांक्षा मानचित्रण',
    'Start with a practical loans route': 'एक व्यावहारिक फंडिंग मार्ग से शुरुआत करें',
    'Course fee, living expenses, books and travel planning in one discussion.': 'एक चर्चा में पाठ्यक्रम शुल्क, रहने का खर्च, किताबें और यात्रा योजना।',
    'Direction Desk': 'दिशा डेस्क',
    'Prepare before multiple bank discussion': 'एकाधिक बैंक चर्चा से पहले तैयारी करें',
    'Admission proof, co-applicant details and repayment comfort mapped clearly.': 'प्रवेश प्रमाण, सह-आवेदक विवरण और पुनर्भुगतान सुविधा स्पष्ट रूप से दर्शाई गई है।',
    'Milestone Budgeting': 'मील का पत्थर बजट',
    'Plan study costs with family clarity': 'पारिवारिक स्पष्टता के साथ अध्ययन लागत की योजना बनाएं',
    'Country-aware guidance for tuition, living cost and supporting documents.': 'ट्यूशन, रहने की लागत और सहायक दस्तावेजों के लिए देश-जागरूक मार्गदर्शन।',
    'Momentum Support': 'गति समर्थन',
    'Move with documented confidence': 'दस्तावेज़ी आत्मविश्वास के साथ आगे बढ़ें',
    'Transparent guidance without approval promises or confusing shortcuts.': 'अनुमोदन के वादों या भ्रमित करने वाले शॉर्टकट के बिना पारदर्शी मार्गदर्शन।',
    'Maximum loans guidance': 'अधिकतम वित्त पोषण मार्गदर्शन',
    'Repayment planning': 'पुनर्भुगतान योजना',
    'Initial file review': 'प्रारंभिक फ़ाइल समीक्षा',
    'How We Help': 'हम कैसे मदद करते हैं',
    'Clear support for important financial decisions': 'महत्वपूर्ण वित्तीय निर्णयों के लिए स्पष्ट समर्थन',
    'Visual Guidance Map': 'दृश्य मार्गदर्शन मानचित्र',
    'Understand the support journey through clear visuals': 'स्पष्ट दृश्यों के माध्यम से समर्थन यात्रा को समझें',
    'From study plans to documents and repayment clarity, the website now shows the major service ideas through image-led panels before detailed reading begins.': 'अध्ययन योजनाओं से लेकर दस्तावेज़ों और पुनर्भुगतान की स्पष्टता तक, वेबसाइट अब विस्तृत रीडिंग शुरू होने से पहले छवि-आधारित पैनलों के माध्यम से प्रमुख सेवा विचारों को दिखाती है।',
    'Step 01': 'चरण 01',
    'Step 02': 'चरण 02',
    'Step 03': 'चरण 03',
    'Step 04': 'चरण 04',
    'Step 05': 'चरण 05',
    'Step 06': 'चरण 06',
    'Course and country goal': 'पाठ्यक्रम और देश लक्ष्य',
    'Fee and living-cost picture': 'शुल्क और जीवनयापन-लागत चित्र',
    'Family and co-applicant preparation': 'परिवार और सह-आवेदक की तैयारी',
    'Document file review': 'दस्तावेज़ फ़ाइल समीक्षा',
    'EMI and repayment roadmap': 'ईएमआई और पुनर्भुगतान रोडमैप',
    'Follow-up and tracking support': 'अनुवर्ती और ट्रैकिंग समर्थन',
    'Guidance from first discussion to application support': 'पहली चर्चा से लेकर आवेदन समर्थन तक मार्गदर्शन',
    'About the Company': 'कंपनी के बारे में',
    'Client Support': 'ग्राहक सहायता',
    'Where we assist': 'जहां हम सहायता करते हैं',
    'Requirement understanding and loan type guidance': 'आवश्यकता समझ और ऋण प्रकार मार्गदर्शन',
    'Eligibility and documentation preparation': 'पात्रता एवं दस्तावेज़ीकरण तैयारी',
    'Student, parent, salaried and business consultation': 'छात्र, अभिभावक, वेतनभोगी और व्यावसायिक परामर्श',
    'Multiple bank process support without approval promises': 'अनुमोदन के वादों के बिना एकाधिक बैंक प्रक्रिया समर्थन',
    'Education Loan Focus': 'शिक्षा ऋण फोकस',
    'Support for students, parents and admission-based loans decisions': 'छात्रों, अभिभावकों और प्रवेश-आधारित फंडिंग निर्णयों के लिए समर्थन',
    'Study in India': 'भारत में पढ़ाई',
    'Study Abroad': 'विदेश में पढ़ाई',
    'Documentation': 'दस्तावेज़ीकरण',
    'Family Guidance': 'पारिवारिक मार्गदर्शन',
    'How We Work': 'हम कैसे काम करते हैं',
    'A practical loan guidance flow': 'एक व्यावहारिक निधि मार्गदर्शन प्रवाह',
    'Free consultation': 'निःशुल्क परामर्श',
    'Requirement review': 'आवश्यकता समीक्षा',
    'Eligibility preparation': 'पात्रता तैयारी',
    'Document checklist': 'दस्तावेज़ चेकलिस्ट',
    'Option discussion': 'विकल्प चर्चा',
    'Processing support': 'प्रसंस्करण समर्थन',
    'Responsible Guidance': 'जिम्मेदार मार्गदर्शन',
    'Transparent support without false approval promises': 'झूठे अनुमोदन वादों के बिना पारदर्शी समर्थन',
    'Next Phase Digital Dashboard Preview': 'अगले चरण का डिजिटल डैशबोर्ड पूर्वावलोकन',
    'Prepared for the next phase of customer and staff tracking': 'ग्राहक और स्टाफ ट्रैकिंग के अगले चरण के लिए तैयार',
    'Lead tracking': 'लीड ट्रैकिंग',
    'Application status': 'आवेदन स्थिति',
    'Document upload': 'दस्तावेज़ अपलोड',
    'Customer login': 'ग्राहक लॉगिन',
    'Admin dashboard': 'प्रशासन डैशबोर्ड',
    'Follow-up reminders': 'अनुवर्ती याद दिलाना',
    'Destination-Smart Education Loan Guidance': 'गंतव्य-स्मार्ट शिक्षा ऋण मार्गदर्शन',
    'Plan education loans for India and popular study-abroad routes': 'भारत और लोकप्रिय अध्ययन-विदेश मार्गों के लिए शिक्षा निधि की योजना बनाएं',
    'Expense Mapping': 'व्यय मानचित्रण',
    'Family Preparation': 'पारिवारिक तैयारी',
    'All': 'सब',
    'India': 'भारत',
    'North America': 'उत्तरी अमेरिका',
    'Europe': 'यूरोप',
    'Asia Pacific': 'एशिया प्रशांत',
    'Showing all guidance cards': 'सभी मार्गदर्शन कार्ड दिखा रहा हूँ',
    'guidance cards shown': 'मार्गदर्शन कार्ड दिखाए गए',
    'United States': 'संयुक्त राज्य अमेरिका',
    'United Kingdom': 'यूनाइटेड किंगडम',
    'Canada': 'कनाडा',
    'Australia': 'ऑस्ट्रेलिया',
    'Germany': 'जर्मनी',
    'Ireland': 'आयरलैंड',
    'France': 'फ़्रांस',
    'Netherlands': 'नीदरलैंड',
    'Singapore': 'सिंगापुर',
    'New Zealand': 'न्यूज़ीलैंड',
    'Sweden': 'स्वीडन',
    'Planning note:': 'योजना नोट:',
    'Need help choosing a loan path?': 'ऋण मार्ग चुनने में सहायता चाहिए?',
    'Share your requirement and our team will guide you with the next practical step.': 'अपनी आवश्यकता साझा करें और हमारी टीम अगले व्यावहारिक कदम के लिए आपका मार्गदर्शन करेगी।',
    'Contact Nidhi Path': 'निधि पथ से संपर्क करें',
    'Share your details': 'अपना विवरण साझा करें',
    'Submit Enquiry': 'पूछताछ भेजें',
    'Our team will contact you shortly.': 'हमारी टीम शीघ्र ही आपसे संपर्क करेगी.',
    'Full Name': 'पूरा नाम',
    'Phone Number': 'फ़ोन नंबर',
    'Email': 'ईमेल',
    'Select Service': 'सेवा का चयन करें',
    'Quick Enquiry': 'त्वरित पूछताछ',
    'Quick EMI': 'त्वरित ईएमआई',
    'Calculator': 'गणक',
    'Loan Amount': 'ऋण राशि',
    'Interest %': 'ब्याज %',
    'Tenure (Months)': 'कार्यकाल (महीने)',
    'Monthly EMI:': 'मासिक ईएमआई:',
    'Total Interest:': 'कुल ब्याज:',
    'Enter valid values': 'मान्य मान दर्ज करें',
    'Visual Service Desk': 'विजुअल सर्विस डेस्क',
    'Visual Service Desk': 'विजुअल सर्विस डेस्क',
    'Company Visual Story': 'कंपनी विज़ुअल स्टोरी',
    'Eligibility Visual Board': 'पात्रता विज़ुअल बोर्ड',
    'Contact Visual Desk': 'विजुअल डेस्क से संपर्क करें',
    'Dashboard Preview': 'डैशबोर्ड पूर्वावलोकन',
    'Education Visual Path': 'शिक्षा दृश्य पथ',
    'Personal Loaning Visual Path': 'व्यक्तिगत ऋण दृश्य पथ',
    'Business Loaning Visual Path': 'व्यवसाय ऋण दृश्य पथ',
    'Property Loans Visual Path': 'प्रॉपर्टी फ़ंडिंग विज़ुअल पथ',
    'Investment Visual Path': 'निवेश दृश्य पथ',
    'Protection Visual Path': 'सुरक्षा दृश्य पथ',
    'All-Loan Visual Navigator': 'ऑल-फंड विज़ुअल नेविगेटर',
    'Consultation Visual Path': 'परामर्श दृश्य पथ',
    'Open Details': 'विवरण खोलें',
    'Support Areas': 'सहायता क्षेत्र',
    'Common Documents': 'सामान्य दस्तावेज़',
    'What We Help With': 'हम क्या मदद करते हैं',
    'Typical Documents': 'विशिष्ट दस्तावेज़',
    'Coverage': 'कवरेज',
    'How We Help': 'हम कैसे मदद करते हैं'
  },
  te: {
    'Education Loan Specialist': 'ఎడ్యుకేషన్ లోన్ స్పెషలిస్ట్',
    'Shape Your': 'మీ',
    'Ambition': 'ఆశయం',
    'Direction': 'దిశ',
    'Milestone': 'మైలురాయి',
    'Momentum': 'పురోగతి',
    'With Guided Support': 'మార్గదర్శక సహాయంతో',
    'Nidhi Path Loan Ventures helps students and parents prepare for education loans with clear consultation, document preparation, EMI planning and practical multiple bank process guidance.': 'నిధి పథ్ ఫండ్ వెంచర్స్ విద్యార్థులు మరియు తల్లిదండ్రులకు స్పష్టమైన సంప్రదింపులు, పత్రాల తయారీ, EMI ప్రణాళిక మరియు ఆచరణాత్మక బహుళ బ్యాంక్ ప్రక్రియ మార్గదర్శకాలతో విద్యా నిధుల కోసం సిద్ధం చేయడంలో సహాయపడుతుంది.',
    'Education loan focus': 'విద్యా నిధి దృష్టి',
    'Domestic and abroad guidance': 'దేశీయ మరియు విదేశాల మార్గదర్శకత్వం',
    'Parent/co-applicant support': 'తల్లిదండ్రులు/సహ-దరఖాస్తుదారుల మద్దతు',
    'Documentation clarity': 'డాక్యుమెంటేషన్ స్పష్టత',
    'Apply for Education Loan': 'ఎడ్యుకేషన్ లోన్ కోసం అప్లై చేయండి',
    'Calculate EMI': 'నెలవారీ వాయిదా లెక్కించండి',
    'India + Abroad': 'భారతదేశం + విదేశాలలో',
    'Study route planning': 'మార్గ ప్రణాళికను అధ్యయనం చేయండి',
    'Documents': 'పత్రాలు',
    'Checklist support': 'చెక్‌లిస్ట్ మద్దతు',
    'EMI Planning': 'EMI ప్రణాళిక',
    'Cost clarity': 'ఖర్చు స్పష్టత',
    'Ambition Mapping': 'యాంబిషన్ మ్యాపింగ్',
    'Start with a practical loans route': 'ఆచరణాత్మక నిధుల మార్గంతో ప్రారంభించండి',
    'Course fee, living expenses, books and travel planning in one discussion.': 'ఒక చర్చలో కోర్సు రుసుము, జీవన వ్యయాలు, పుస్తకాలు మరియు ప్రయాణ ప్రణాళిక.',
    'Direction Desk': 'డైరెక్షన్ డెస్క్',
    'Prepare before multiple bank discussion': 'బహుళ బ్యాంక్ చర్చల ముందు సిద్ధం చేయండి',
    'Admission proof, co-applicant details and repayment comfort mapped clearly.': 'ప్రవేశ రుజువు, సహ-దరఖాస్తుదారు వివరాలు మరియు తిరిగి చెల్లింపు సౌకర్యం స్పష్టంగా మ్యాప్ చేయబడింది.',
    'Milestone Budgeting': 'మైలురాయి బడ్జెట్',
    'Plan study costs with family clarity': 'కుటుంబ స్పష్టతతో అధ్యయన ఖర్చులను ప్లాన్ చేయండి',
    'Country-aware guidance for tuition, living cost and supporting documents.': 'ట్యూషన్, జీవన వ్యయం మరియు సహాయక పత్రాల కోసం దేశం-అవగాహన మార్గదర్శకత్వం.',
    'Momentum Support': 'మొమెంటం మద్దతు',
    'Move with documented confidence': 'డాక్యుమెంట్ చేయబడిన విశ్వాసంతో కదలండి',
    'Transparent guidance without approval promises or confusing shortcuts.': 'ఆమోదం వాగ్దానాలు లేదా గందరగోళ సత్వరమార్గాలు లేకుండా పారదర్శక మార్గదర్శకత్వం.',
    'Maximum loans guidance': 'గరిష్ట నిధుల మార్గదర్శకత్వం',
    'Repayment planning': 'తిరిగి చెల్లింపు ప్రణాళిక',
    'Initial file review': 'ప్రారంభ ఫైల్ సమీక్ష',
    'How We Help': 'మేము ఎలా సహాయం చేస్తాము',
    'Clear support for important financial decisions': 'ముఖ్యమైన ఆర్థిక నిర్ణయాలకు స్పష్టమైన మద్దతు',
    'Visual Guidance Map': 'విజువల్ గైడెన్స్ మ్యాప్',
    'Understand the support journey through clear visuals': 'స్పష్టమైన విజువల్స్ ద్వారా మద్దతు ప్రయాణాన్ని అర్థం చేసుకోండి',
    'From study plans to documents and repayment clarity, the website now shows the major service ideas through image-led panels before detailed reading begins.': 'స్టడీ ప్లాన్‌ల నుండి డాక్యుమెంట్‌లు మరియు రీపేమెంట్ క్లారిటీ వరకు, వెబ్‌సైట్ ఇప్పుడు వివరణాత్మక పఠనం ప్రారంభించే ముందు ఇమేజ్-లెడ్ ప్యానెల్‌ల ద్వారా ప్రధాన సేవా ఆలోచనలను చూపుతుంది.',
    'Step 01': 'దశ 01',
    'Step 02': 'దశ 02',
    'Step 03': 'దశ 03',
    'Step 04': 'దశ 04',
    'Step 05': 'దశ 05',
    'Step 06': 'దశ 06',
    'Course and country goal': 'కోర్సు మరియు దేశం లక్ష్యం',
    'Fee and living-cost picture': 'రుసుము మరియు జీవన వ్యయం చిత్రం',
    'Family and co-applicant preparation': 'కుటుంబం మరియు సహ-దరఖాస్తుదారుల తయారీ',
    'Document file review': 'డాక్యుమెంట్ ఫైల్ సమీక్ష',
    'EMI and repayment roadmap': 'EMI మరియు రీపేమెంట్ రోడ్‌మ్యాప్',
    'Follow-up and tracking support': 'ఫాలో-అప్ మరియు ట్రాకింగ్ మద్దతు',
    'Guidance from first discussion to application support': 'మొదటి చర్చ నుండి అప్లికేషన్ మద్దతు వరకు మార్గదర్శకత్వం',
    'About the Company': 'కంపెనీ గురించి',
    'Client Support': 'క్లయింట్ మద్దతు',
    'Where we assist': 'మేము ఎక్కడ సహాయం చేస్తాము',
    'Requirement understanding and loan type guidance': 'అవసరాల అవగాహన మరియు లోన్ రకం మార్గదర్శకత్వం',
    'Eligibility and documentation preparation': 'అర్హత మరియు డాక్యుమెంటేషన్ తయారీ',
    'Student, parent, salaried and business consultation': 'విద్యార్థి, తల్లిదండ్రులు, జీతం మరియు వ్యాపార సంప్రదింపులు',
    'Multiple bank process support without approval promises': 'ఆమోదం వాగ్దానాలు లేకుండా బహుళ బ్యాంక్ ప్రక్రియ మద్దతు',
    'Education Loan Focus': 'ఎడ్యుకేషన్ లోన్ ఫోకస్',
    'Support for students, parents and admission-based loans decisions': 'విద్యార్థులు, తల్లిదండ్రులు మరియు ప్రవేశ ఆధారిత నిధుల నిర్ణయాలకు మద్దతు',
    'Study in India': 'భారతదేశంలో చదువు',
    'Study Abroad': 'విదేశాల్లో చదువు',
    'Documentation': 'డాక్యుమెంటేషన్',
    'Family Guidance': 'కుటుంబ మార్గదర్శకత్వం',
    'How We Work': 'మేము ఎలా పని చేస్తాము',
    'A practical loan guidance flow': 'ప్రాక్టికల్ ఫండ్ గైడెన్స్ ఫ్లో',
    'Free consultation': 'ఉచిత సంప్రదింపులు',
    'Requirement review': 'అవసరాల సమీక్ష',
    'Eligibility preparation': 'అర్హత తయారీ',
    'Document checklist': 'డాక్యుమెంట్ చెక్‌లిస్ట్',
    'Option discussion': 'ఎంపిక చర్చ',
    'Processing support': 'ప్రాసెసింగ్ మద్దతు',
    'Responsible Guidance': 'బాధ్యతాయుతమైన మార్గదర్శకత్వం',
    'Transparent support without false approval promises': 'తప్పుడు ఆమోదం వాగ్దానాలు లేకుండా పారదర్శక మద్దతు',
    'Next Phase Digital Dashboard Preview': 'తదుపరి దశ డిజిటల్ డాష్‌బోర్డ్ ప్రివ్యూ',
    'Prepared for the next phase of customer and staff tracking': 'కస్టమర్ మరియు సిబ్బంది ట్రాకింగ్ యొక్క తదుపరి దశ కోసం సిద్ధం చేయబడింది',
    'Lead tracking': 'లీడ్ ట్రాకింగ్',
    'Application status': 'దరఖాస్తు స్థితి',
    'Document upload': 'పత్రాల అప్‌లోడ్',
    'Customer login': 'కస్టమర్ లాగిన్',
    'Admin dashboard': 'నిర్వాహక డ్యాష్‌బోర్డ్',
    'Follow-up reminders': 'తదుపరి గుర్తింపులు',
    'Destination-Smart Education Loan Guidance': 'డెస్టినేషన్-స్మార్ట్ ఎడ్యుకేషన్ లోన్ గైడెన్స్',
    'Plan education loans for India and popular study-abroad routes': 'భారతదేశం మరియు ప్రసిద్ధ అధ్యయన-విదేశాల మార్గాల కోసం విద్యా నిధులను ప్లాన్ చేయండి',
    'Expense Mapping': 'ఖర్చు మ్యాపింగ్',
    'Family Preparation': 'కుటుంబ తయారీ',
    'All': 'అన్నీ',
    'India': 'భారతదేశం',
    'North America': 'ఉత్తర అమెరికా',
    'Europe': 'యూరప్',
    'Asia Pacific': 'ఆసియా పసిఫిక్',
    'Showing all guidance cards': 'అన్ని మార్గదర్శక కార్డ్‌లను చూపుతోంది',
    'guidance cards shown': 'మార్గదర్శక కార్డులు చూపబడ్డాయి',
    'United States': 'యునైటెడ్ స్టేట్స్',
    'United Kingdom': 'యునైటెడ్ కింగ్‌డమ్',
    'Canada': 'కెనడా',
    'Australia': 'ఆస్ట్రేలియా',
    'Germany': 'జర్మనీ',
    'Ireland': 'ఐర్లాండ్',
    'France': 'ఫ్రాన్స్',
    'Netherlands': 'నెదర్లాండ్స్',
    'Singapore': 'సింగపూర్',
    'New Zealand': 'న్యూజిలాండ్',
    'Sweden': 'స్వీడన్',
    'Planning note:': 'ప్రణాళిక గమనిక:',
    'Need help choosing a loan path?': 'రుణ మార్గాన్ని ఎంచుకోవడంలో సహాయం కావాలా?',
    'Share your requirement and our team will guide you with the next practical step.': 'మీ అవసరాన్ని పంచుకోండి మరియు తదుపరి ఆచరణాత్మక దశతో మా బృందం మీకు మార్గనిర్దేశం చేస్తుంది.',
    'Contact Nidhi Path': 'నిధి పథ్‌ను సంప్రదించండి',
    'Share your details': 'మీ వివరాలను పంచుకోండి',
    'Submit Enquiry': 'విచారణ పంపండి',
    'Our team will contact you shortly.': 'మా బృందం త్వరలో మిమ్మల్ని సంప్రదిస్తుంది.',
    'Full Name': 'పూర్తి పేరు',
    'Phone Number': 'ఫోన్ నంబర్',
    'Email': 'ఈమెయిల్',
    'Select Service': 'సేవను ఎంచుకోండి',
    'Quick Enquiry': 'త్వరిత విచారణ',
    'Quick EMI': 'త్వరిత EMI',
    'Calculator': 'లెక్కింపు',
    'Loan Amount': 'రుణ మొత్తం',
    'Interest %': 'వడ్డీ %',
    'Tenure (Months)': 'పదవీకాలం (నెలలు)',
    'Monthly EMI:': 'నెలవారీ EMI:',
    'Total Interest:': 'మొత్తం వడ్డీ:',
    'Enter valid values': 'చెల్లుబాటు అయ్యే విలువలను నమోదు చేయండి',
    'Visual Service Desk': 'విజువల్ సర్వీస్ డెస్క్',
    'Company Visual Story': 'కంపెనీ విజువల్ స్టోరీ',
    'Eligibility Visual Board': 'అర్హత విజువల్ బోర్డ్',
    'Contact Visual Desk': 'విజువల్ డెస్క్‌ని సంప్రదించండి',
    'Dashboard Preview': 'డాష్‌బోర్డ్ ప్రివ్యూ',
    'Education Visual Path': 'విద్య దృశ్య మార్గం',
    'Personal Loaning Visual Path': 'వ్యక్తిగత రుణ విజువల్ మార్గం',
    'Business Loaning Visual Path': 'వ్యాపార రుణ విజువల్ మార్గం',
    'Property Loans Visual Path': 'ఆస్తి నిధుల దృశ్య మార్గం',
    'Investment Visual Path': 'పెట్టుబడి దృశ్య మార్గం',
    'Protection Visual Path': 'రక్షణ దృశ్య మార్గం',
    'All-Loan Visual Navigator': 'ఆల్-ఫండ్ విజువల్ నావిగేటర్',
    'Consultation Visual Path': 'కన్సల్టేషన్ దృశ్య మార్గం',
    'Open Details': 'వివరాలు తెరవండి',
    'Support Areas': 'మద్దతు ప్రాంతాలు',
    'Common Documents': 'సాధారణ పత్రాలు',
    'What We Help With': 'మేము ఏమి సహాయం చేస్తాము',
    'Typical Documents': 'సాధారణ పత్రాలు',
    'Coverage': 'కవరేజ్',
    'How We Help': 'మేము ఎలా సహాయం చేస్తాము'
  }
};

Object.assign(phraseTranslations.hi, {
  'Loan Guidance': 'ऋण मार्गदर्शन',
  'Choose a dedicated service page to understand the support available before you enquire. Each service is built around requirement understanding, eligibility review, documentation clarity and responsible process support.': 'पूछताछ करने से पहले उपलब्ध सहायता को समझने के लिए एक समर्पित सेवा पृष्ठ चुनें। प्रत्येक सेवा आवश्यकता समझ, पात्रता समीक्षा, दस्तावेज़ीकरण स्पष्टता और जिम्मेदार प्रक्रिया समर्थन के आसपास बनाई गई है।',
  'Service Method': 'सेवा विधि',
  'Every enquiry follows a clear support structure': 'प्रत्येक पूछताछ एक स्पष्ट समर्थन संरचना का अनुसरण करती है',
  'Education-first expertise': 'शिक्षा-प्रथम विशेषज्ञता',
  'Clear documentation': 'स्पष्ट दस्तावेज',
  'Transparent expectations': 'पारदर्शी उम्मीदें',
  'Start your conversation with': 'से अपनी बातचीत शुरू करें',
  'Share your requirement': 'अपनी आवश्यकता साझा करें',
  'Use this form for education loan, home loan, business loan, personal loan, insurance or consultation support.': 'इस फॉर्म का उपयोग शिक्षा निधि, गृह निधि, व्यवसाय निधि, व्यक्तिगत निधि, बीमा या परामर्श सहायता के लिए करें।',
  'Phone support': 'फ़ोन समर्थन',
  'Monday to Saturday': 'सोमवार से शनिवार',
  'All types of loans, documentation and loan consultation.': 'सभी प्रकार की फंडिंग, दस्तावेज़ीकरण और फंड परामर्श।',
  'Share the details that help us guide you faster': 'वे विवरण साझा करें जो हमें आपको तेजी से मार्गदर्शन करने में मदद करते हैं',
  'Vijayawada support point': 'विजयवाड़ा समर्थन बिंदु',
  'Loan Eligibility & Document Preparation': 'निधि पात्रता एवं दस्तावेज तैयार करना',
  'Use this page as a practical preparation checklist before speaking with our team. It combines education-loan document planning, other loan requirements and an advanced EMI planner for first-level financial clarity.': 'हमारी टीम से बात करने से पहले इस पृष्ठ का उपयोग व्यावहारिक तैयारी चेकलिस्ट के रूप में करें। यह प्रथम-स्तरीय वित्तीय स्पष्टता के लिए शिक्षा-निधि दस्तावेज़ योजना, अन्य ऋण आवश्यकताओं और एक उन्नत ईएमआई योजनाकार को जोड़ती है।',
  'For Education Loan': 'शिक्षा ऋण के लिए',
  'For Other Loans': 'अन्य ऋणों के लिए',
  'Plan eligibility, EMI and loan cost in one view': 'योजना पात्रता, ईएमआई और फंड लागत एक नजर में',
  'Nidhi Path Loan Ventures is built to guide students, families, salaried professionals and business owners through loan decisions with clarity, trust and end-to-end support.': 'निधि पथ फंड वेंचर्स को स्पष्टता, विश्वास और अंत-से-अंत समर्थन के साथ फंड निर्णयों के माध्यम से छात्रों, परिवारों, वेतनभोगी पेशेवरों और व्यापार मालिकों का मार्गदर्शन करने के लिए बनाया गया है।',
  'Way to Money': 'धन तक पहुंच का मार्ग',
  'Our Support': 'हमारा समर्थन',
  'Financial guidance that feels clear, local and accountable': 'वित्तीय मार्गदर्शन जो स्पष्ट, स्थानीय और जवाबदेह लगता है',
  'Guidance for students and parents planning domestic or abroad education loans.': 'घरेलू या विदेश में शिक्षा निधि की योजना बनाने वाले छात्रों और अभिभावकों के लिए मार्गदर्शन।',
  'Guidance for eligible business owners seeking working capital, expansion support or business loans clarity.': 'कार्यशील पूंजी, विस्तार सहायता या व्यवसाय वित्तपोषण की स्पष्टता चाहने वाले पात्र व्यवसाय मालिकों के लिए मार्गदर्शन।',
  'Guidance for home purchase, construction, renovation and balance transfer discussions.': 'घर की खरीद, निर्माण, नवीकरण और शेष हस्तांतरण चर्चा के लिए मार्गदर्शन।',
  'Loan requirement review and guidance across multiple loan categories.': 'विभिन्न ऋण श्रेणियों में निधि की आवश्यकता की समीक्षा और मार्गदर्शन।',
  'What We Help With': 'हम क्या मदद करते हैं',
  'Typical Documents': 'विशिष्ट दस्तावेज़',
  'Support Areas': 'सहायता क्षेत्र',
  'Common Documents': 'सामान्य दस्तावेज़',
  'Useful For': 'के लिए उपयोगी',
  'Coverage': 'कवरेज',
  'Visual Service Desk': 'विजुअल सर्विस डेस्क',
  'Choose the right support route by looking at the need first': 'पहले जरूरत को देखकर सही सपोर्ट रूट चुनें',
  'The service page now works like a visual directory: education, income, business, property, investment and protection needs are separated into clear visual lanes.': 'सेवा पृष्ठ अब एक दृश्य निर्देशिका की तरह काम करता है: शिक्षा, आय, व्यवसाय, संपत्ति, निवेश और सुरक्षा आवश्यकताओं को स्पष्ट दृश्य लेन में अलग किया गया है।',
  'core service paths': 'मुख्य सेवा पथ',
  'guided enquiry desk': 'निर्देशित पूछताछ डेस्क',
  'next-phase ready': 'अगला चरण तैयार',
  'Company Visual Story': 'कंपनी विज़ुअल स्टोरी',
  'A guidance-first company built around clarity and trust': 'स्पष्टता और विश्वास के इर्द-गिर्द निर्मित एक मार्गदर्शन-प्रथम कंपनी',
  '8+ Years Experience': '8+ वर्षों का अनुभव',
  'Trusted guidance built through years of education finance support': 'वर्षों की शिक्षा वित्त सहायता से बना भरोसेमंद मार्गदर्शन',
  '25+ Network Banks': '25+ नेटवर्क बैंक',
  'Access to a wider banking network for practical option comparison': 'व्यावहारिक विकल्प तुलना के लिए व्यापक बैंकिंग नेटवर्क तक पहुंच',
  '500+ Disbursements': '500+ वितरण',
  'Strong execution experience across student loans cases': 'छात्र फंडिंग मामलों में मजबूत कार्यान्वयन अनुभव',
  '100+ Top-Ups': '100+ टॉप-अप',
  'Additional loans support for eligible ongoing study needs': 'योग्य चल रही पढ़ाई की जरूरतों के लिए अतिरिक्त फंडिंग सहायता',
  'Eligibility Visual Board': 'पात्रता विज़ुअल बोर्ड',
  'See the loans-preparation picture before calculating EMI': 'ईएमआई की गणना करने से पहले फंडिंग-तैयारी की तस्वीर देखें',
  'Contact Visual Desk': 'विजुअल डेस्क से संपर्क करें',
  'Connect through a clear enquiry and office support path': 'स्पष्ट पूछताछ और कार्यालय सहायता पथ के माध्यम से जुड़ें',
  'Dashboard Preview': 'डैशबोर्ड पूर्वावलोकन',
  'A future-ready login area for customers, staff and admin users': 'ग्राहकों, कर्मचारियों और व्यवस्थापक उपयोगकर्ताओं के लिए भविष्य के लिए तैयार लॉगिन क्षेत्र',
  'Education Visual Path': 'शिक्षा दृश्य पथ',
  'From admission proof to study-expense planning': 'प्रवेश प्रमाण से लेकर अध्ययन-व्यय योजना तक',
  'Personal Loaning Visual Path': 'व्यक्तिगत ऋण दृश्य पथ',
  'Income, purpose and repayment comfort in one view': 'आय, उद्देश्य और पुनर्भुगतान सुविधा एक नजर में',
  'Business Loaning Visual Path': 'व्यवसाय ऋण दृश्य पथ',
  'Visualize business need, cash flow and document preparation': 'व्यवसाय की आवश्यकता, नकदी प्रवाह और दस्तावेज़ तैयारी की कल्पना करें',
  'Property Loans Visual Path': 'प्रॉपर्टी फ़ंडिंग विज़ुअल पथ',
  'Understand property stage, down payment and EMI planning': 'संपत्ति चरण, डाउन पेमेंट और ईएमआई योजना को समझें',
  'Investment Visual Path': 'निवेश दृश्य पथ',
  'Map goals, time horizon and risk comfort visually': 'लक्ष्यों, समय क्षितिज और जोखिम आराम को दृष्टिगत रूप से मानचित्रित करें',
  'Protection Visual Path': 'सुरक्षा दृश्य पथ',
  'See protection needs before comparing policy options': 'पॉलिसी विकल्पों की तुलना करने से पहले सुरक्षा आवश्यकताओं को देखें',
  'All-Loan Visual Navigator': 'ऑल-फंड विज़ुअल नेविगेटर',
  'Sort the requirement before choosing the product': 'उत्पाद चुनने से पहले आवश्यकता को क्रमबद्ध करें',
  'Consultation Visual Path': 'परामर्श दृश्य पथ',
  'A guided conversation before any formal application': 'किसी भी औपचारिक आवेदन से पहले एक निर्देशित बातचीत',
  'Education': 'शिक्षा',
  'Income': 'आय',
  'Business': 'व्यवसायी',
  'Protection': 'सुरक्षा',
  'Clarity': 'स्पष्टता',
  'Preparation': 'तैयारी',
  'Coordination': 'समन्वय',
  'Expansion': 'विस्तार',
  'Student proof': 'छात्र प्रमाण',
  'Co-applicant': 'सह-आवेदक',
  'Income view': 'आय दृश्य',
  'Repayment map': 'चुकौती मानचित्र',
  'Call': 'बुलाओ',
  'Form': 'प्रपत्र',
  'Visit': 'दौरा',
  'Follow-up': 'अनुवर्ती',
  'Customer': 'ग्राहक',
  'Staff': 'कर्मचारी',
  'Admin': 'व्यवस्थापक',
  'Admission': 'प्रवेश',
  'Expenses': 'व्यय',
  'Purpose': 'प्रयोजन',
  'Tenure': 'अवधि',
  'Need': 'जरुरत',
  'Cash flow': 'नकदी प्रवाह',
  'Proof': 'सबूत',
  'Next step': 'अगला कदम',
  'Property': 'संपत्ति',
  'Papers': 'कागजात',
  'Goal': 'लक्ष्य',
  'Horizon': 'क्षितिज',
  'KYC': 'KYC',
  'Review': 'समीक्षा',
  'Coverage': 'कवरेज',
  'Family': 'परिवार',
  'Route': 'मार्ग',
  'Profile': 'प्रोफाइल',
  'Action': 'कार्रवाई',
  'Discuss': 'चर्चा करें',
  'Plan': 'योजना'
});

Object.assign(phraseTranslations.te, {
  'Loan Guidance': 'రుణ మార్గదర్శకం',
  'Choose a dedicated service page to understand the support available before you enquire. Each service is built around requirement understanding, eligibility review, documentation clarity and responsible process support.': 'మీరు ఎంక్వైరీ చేసే ముందు అందుబాటులో ఉన్న మద్దతును అర్థం చేసుకోవడానికి అంకితమైన సేవా పేజీని ఎంచుకోండి. ప్రతి సేవ అవసరాన్ని అర్థం చేసుకోవడం, అర్హత సమీక్ష, డాక్యుమెంటేషన్ స్పష్టత మరియు బాధ్యతాయుతమైన ప్రక్రియ మద్దతు చుట్టూ నిర్మించబడింది.',
  'Service Method': 'సేవా పద్ధతి',
  'Every enquiry follows a clear support structure': 'ప్రతి విచారణ స్పష్టమైన మద్దతు నిర్మాణాన్ని అనుసరిస్తుంది',
  'Education-first expertise': 'విద్య-మొదటి నైపుణ్యం',
  'Clear documentation': 'డాక్యుమెంటేషన్‌ను క్లియర్ చేయండి',
  'Transparent expectations': 'పారదర్శకమైన అంచనాలు',
  'Start your conversation with': 'దీనితో మీ సంభాషణను ప్రారంభించండి',
  'Share your requirement': 'మీ అవసరాన్ని పంచుకోండి',
  'Use this form for education loan, home loan, business loan, personal loan, insurance or consultation support.': 'ఎడ్యుకేషన్ ఫండ్, హోమ్ ఫండ్, బిజినెస్ ఫండ్, పర్సనల్ ఫండ్, ఇన్సూరెన్స్ లేదా కన్సల్టేషన్ సపోర్ట్ కోసం ఈ ఫారమ్‌ని ఉపయోగించండి.',
  'Phone support': 'ఫోన్ మద్దతు',
  'Monday to Saturday': 'సోమవారం నుండి శనివారం వరకు',
  'All types of loans, documentation and loan consultation.': 'అన్ని రకాల నిధులు, డాక్యుమెంటేషన్ మరియు ఫండ్ కన్సల్టేషన్.',
  'Share the details that help us guide you faster': 'మీకు వేగంగా మార్గనిర్దేశం చేయడంలో మాకు సహాయపడే వివరాలను భాగస్వామ్యం చేయండి',
  'Vijayawada support point': 'విజయవాడ సపోర్టు పాయింట్',
  'Loan Eligibility & Document Preparation': 'ఫండ్ అర్హత & డాక్యుమెంట్ తయారీ',
  'Use this page as a practical preparation checklist before speaking with our team. It combines education-loan document planning, other loan requirements and an advanced EMI planner for first-level financial clarity.': 'మా బృందంతో మాట్లాడే ముందు ఈ పేజీని ప్రాక్టికల్ ప్రిపరేషన్ చెక్‌లిస్ట్‌గా ఉపయోగించండి. ఇది ఎడ్యుకేషన్-ఫండ్ డాక్యుమెంట్ ప్లానింగ్, ఇతర లోన్ అవసరాలు మరియు మొదటి-స్థాయి ఆర్థిక స్పష్టత కోసం అధునాతన EMI ప్లానర్‌ను మిళితం చేస్తుంది.',
  'For Education Loan': 'ఎడ్యుకేషన్ లోన్ కోసం',
  'For Other Loans': 'ఇతర రుణాలకు',
  'Plan eligibility, EMI and loan cost in one view': 'ఒకే వీక్షణలో ప్లాన్ అర్హత, EMI మరియు ఫండ్ ఖర్చు',
  'Nidhi Path Loan Ventures is built to guide students, families, salaried professionals and business owners through loan decisions with clarity, trust and end-to-end support.': 'నిధి పథ్ ఫండ్ వెంచర్స్ విద్యార్థులు, కుటుంబాలు, జీతం తీసుకునే నిపుణులు మరియు వ్యాపార యజమానులకు స్పష్టత, నమ్మకం మరియు ఎండ్-టు-ఎండ్ మద్దతుతో ఫండ్ నిర్ణయాల ద్వారా మార్గనిర్దేశం చేయడానికి నిర్మించబడింది.',
  'Way to Money': 'ధనానికి మార్గం',
  'Our Support': 'మా మద్దతు',
  'Financial guidance that feels clear, local and accountable': 'స్పష్టంగా, స్థానికంగా మరియు జవాబుదారీగా భావించే ఆర్థిక మార్గదర్శకత్వం',
  'Guidance for students and parents planning domestic or abroad education loans.': 'విద్యార్థులు మరియు తల్లిదండ్రులకు దేశీయ లేదా విదేశాలలో విద్యా నిధులను ప్లాన్ చేయడం కోసం మార్గదర్శకత్వం.',
  'Guidance for eligible business owners seeking working capital, expansion support or business loans clarity.': 'వర్కింగ్ క్యాపిటల్, విస్తరణ మద్దతు లేదా వ్యాపార నిధుల స్పష్టతను కోరుకునే అర్హతగల వ్యాపార యజమానులకు మార్గదర్శకత్వం.',
  'Guidance for home purchase, construction, renovation and balance transfer discussions.': 'ఇంటి కొనుగోలు, నిర్మాణం, పునర్నిర్మాణం మరియు బ్యాలెన్స్ బదిలీ చర్చల కోసం మార్గదర్శకత్వం.',
  'Loan requirement review and guidance across multiple loan categories.': 'బహుళ లోన్ కేటగిరీలలో ఫండ్ అవసరాల సమీక్ష మరియు మార్గదర్శకత్వం.',
  'What We Help With': 'మేము ఏమి సహాయం చేస్తాము',
  'Typical Documents': 'సాధారణ పత్రాలు',
  'Support Areas': 'మద్దతు ప్రాంతాలు',
  'Common Documents': 'సాధారణ పత్రాలు',
  'Useful For': 'కోసం ఉపయోగపడుతుంది',
  'Coverage': 'కవరేజ్',
  'Visual Service Desk': 'విజువల్ సర్వీస్ డెస్క్',
  'Choose the right support route by looking at the need first': 'ముందుగా అవసరాన్ని చూసి సరైన మద్దతు మార్గాన్ని ఎంచుకోండి',
  'The service page now works like a visual directory: education, income, business, property, investment and protection needs are separated into clear visual lanes.': 'సేవా పేజీ ఇప్పుడు దృశ్య డైరెక్టరీ వలె పని చేస్తుంది: విద్య, ఆదాయం, వ్యాపారం, ఆస్తి, పెట్టుబడి మరియు రక్షణ అవసరాలు స్పష్టమైన దృశ్య దారులుగా విభజించబడ్డాయి.',
  'core service paths': 'ప్రధాన సేవా మార్గాలు',
  'guided enquiry desk': 'మార్గదర్శక విచారణ డెస్క్',
  'next-phase ready': 'తదుపరి దశ సిద్ధంగా ఉంది',
  'Company Visual Story': 'కంపెనీ విజువల్ స్టోరీ',
  'A guidance-first company built around clarity and trust': 'మార్గదర్శకత్వం-మొదటి కంపెనీ స్పష్టత మరియు నమ్మకం చుట్టూ నిర్మించబడింది',
  '8+ Years Experience': '8+ సంవత్సరాల అనుభవం',
  'Trusted guidance built through years of education finance support': 'ఏళ్ల విద్యా ఫైనాన్స్ సహాయం ద్వారా నిర్మితమైన నమ్మదగిన మార్గదర్శకం',
  '25+ Network Banks': '25+ నెట్‌వర్క్ బ్యాంకులు',
  'Access to a wider banking network for practical option comparison': 'ఆచరణాత్మక ఎంపికల పోలిక కోసం విస్తృత బ్యాంకింగ్ నెట్‌వర్క్‌కు ప్రాప్యత',
  '500+ Disbursements': '500+ నిధుల విడుదలలు',
  'Strong execution experience across student loans cases': 'విద్యార్థి ఫండింగ్ కేసుల్లో బలమైన అమలు అనుభవం',
  '100+ Top-Ups': '100+ టాప్-అప్స్',
  'Additional loans support for eligible ongoing study needs': 'అర్హతగల కొనసాగుతున్న చదువు అవసరాలకు అదనపు ఫండింగ్ సహాయం',
  'Eligibility Visual Board': 'అర్హత విజువల్ బోర్డ్',
  'See the loans-preparation picture before calculating EMI': 'EMIని లెక్కించే ముందు నిధుల తయారీ చిత్రాన్ని చూడండి',
  'Contact Visual Desk': 'విజువల్ డెస్క్‌ని సంప్రదించండి',
  'Connect through a clear enquiry and office support path': 'స్పష్టమైన విచారణ మరియు కార్యాలయ మద్దతు మార్గం ద్వారా కనెక్ట్ అవ్వండి',
  'Dashboard Preview': 'డాష్‌బోర్డ్ ప్రివ్యూ',
  'A future-ready login area for customers, staff and admin users': 'కస్టమర్‌లు, సిబ్బంది మరియు అడ్మిన్ వినియోగదారుల కోసం భవిష్యత్తులో సిద్ధంగా ఉన్న లాగిన్ ప్రాంతం',
  'Education Visual Path': 'విద్య దృశ్య మార్గం',
  'From admission proof to study-expense planning': 'ప్రవేశ రుజువు నుండి అధ్యయనం-వ్యయ ప్రణాళిక వరకు',
  'Personal Loaning Visual Path': 'వ్యక్తిగత రుణ విజువల్ మార్గం',
  'Income, purpose and repayment comfort in one view': 'ఒక దృష్టిలో ఆదాయం, ప్రయోజనం మరియు తిరిగి చెల్లింపు సౌకర్యం',
  'Business Loaning Visual Path': 'వ్యాపార రుణ విజువల్ మార్గం',
  'Visualize business need, cash flow and document preparation': 'వ్యాపార అవసరాలు, నగదు ప్రవాహం మరియు పత్రాల తయారీని దృశ్యమానం చేయండి',
  'Property Loans Visual Path': 'ఆస్తి నిధుల దృశ్య మార్గం',
  'Understand property stage, down payment and EMI planning': 'ఆస్తి దశ, డౌన్ పేమెంట్ మరియు EMI ప్రణాళికను అర్థం చేసుకోండి',
  'Investment Visual Path': 'పెట్టుబడి దృశ్య మార్గం',
  'Map goals, time horizon and risk comfort visually': 'మ్యాప్ లక్ష్యాలు, సమయ హోరిజోన్ మరియు రిస్క్ సౌకర్యం దృశ్యమానంగా',
  'Protection Visual Path': 'రక్షణ దృశ్య మార్గం',
  'See protection needs before comparing policy options': 'పాలసీ ఎంపికలను పోల్చడానికి ముందు రక్షణ అవసరాలను చూడండి',
  'All-Loan Visual Navigator': 'ఆల్-ఫండ్ విజువల్ నావిగేటర్',
  'Sort the requirement before choosing the product': 'ఉత్పత్తిని ఎంచుకునే ముందు అవసరాన్ని క్రమబద్ధీకరించండి',
  'Consultation Visual Path': 'కన్సల్టేషన్ దృశ్య మార్గం',
  'A guided conversation before any formal application': 'ఏదైనా అధికారిక దరఖాస్తుకు ముందు మార్గదర్శక సంభాషణ',
  'Education': 'విద్య',
  'Income': 'ఆదాయం',
  'Business': 'వ్యాపారి',
  'Protection': 'రక్షణ',
  'Clarity': 'స్పష్టత',
  'Preparation': 'తయారీ',
  'Coordination': 'సమన్వయం',
  'Expansion': 'విస్తరణ',
  'Student proof': 'విద్యార్థి రుజువు',
  'Co-applicant': 'సహ దరఖాస్తుదారు',
  'Income view': 'ఆదాయ వీక్షణ',
  'Repayment map': 'తిరిగి చెల్లింపు మ్యాప్',
  'Call': 'కాల్ చేయండి',
  'Form': 'రూపం',
  'Visit': 'సందర్శించండి',
  'Follow-up': 'ఫాలో-అప్',
  'Customer': 'కస్టమర్',
  'Staff': 'సిబ్బంది',
  'Admin': 'అడ్మిన్',
  'Admission': 'ప్రవేశం',
  'Expenses': 'ఖర్చులు',
  'Purpose': 'ప్రయోజనం',
  'Tenure': 'కాలవ్యవధి',
  'Need': 'అవసరం',
  'Cash flow': 'నగదు ప్రవాహం',
  'Proof': 'రుజువు',
  'Next step': 'తదుపరి దశ',
  'Property': 'ఆస్తి',
  'Papers': 'పేపర్లు',
  'Goal': 'లక్ష్యం',
  'Horizon': 'హోరిజోన్',
  'KYC': 'KYC',
  'Review': 'సమీక్షించండి',
  'Family': 'కుటుంబం',
  'Route': 'మార్గం',
  'Profile': 'ప్రొఫైల్',
  'Action': 'చర్య',
  'Discuss': 'చర్చించండి',
  'Plan': 'ప్లాన్ చేయండి'
});

Object.assign(phraseTranslations.hi, {
  'Home': 'मुख्य पृष्ठ',
  'Services': 'सेवाएं',
  'About Us': 'हमारे बारे में',
  'Eligibility': 'पात्रता',
  'Contact Us': 'हमसे संपर्क करें',
  'Login': 'लॉगिन',
  'Translate': 'अनुवाद करें',
  'English': 'अंग्रेज़ी',
  'Hindi': 'हिंदी',
  'Telugu': 'तेलुगू',
  'Loan Ventures': 'फंड वेंचर्स',
  'Guidance': 'मार्गदर्शन',
  'Consultation': 'परामर्श',
  'Documentation support': 'दस्तावेज़ीकरण समर्थन',
  'Multiple bank coordination support': 'एकाधिक बैंक समन्वय समर्थन',
  'Company Purpose': 'कंपनी का उद्देश्य',
  'Loan customers often face the same problems: unclear eligibility, scattered documents, confusing repayment terms and uncertainty about which option suits their profile.': 'फंड ग्राहकों को अक्सर समान समस्याओं का सामना करना पड़ता है: अस्पष्ट पात्रता, बिखरे हुए दस्तावेज़, भ्रमित करने वाली पुनर्भुगतान शर्तें और अनिश्चितता कि कौन सा विकल्प उनकी प्रोफ़ाइल के लिए उपयुक्त है।',
  'Nidhi Path works as a guidance partner, helping clients understand requirements, prepare documents and move forward with a practical application plan.': 'निधि पथ एक मार्गदर्शन भागीदार के रूप में काम करता है, जो ग्राहकों को आवश्यकताओं को समझने, दस्तावेज़ तैयार करने और व्यावहारिक अनुप्रयोग योजना के साथ आगे बढ़ने में मदद करता है।',
  'For students': 'छात्रों के लिए',
  'Admission-based education loan guidance for India and abroad.': 'भारत और विदेश के लिए प्रवेश-आधारित शिक्षा निधि मार्गदर्शन।',
  'For families': 'परिवारों के लिए',
  'Parent or co-applicant support, repayment discussion and document preparation.': 'माता-पिता या सह-आवेदक का समर्थन, पुनर्भुगतान चर्चा और दस्तावेज़ तैयार करना।',
  'For professionals': 'पेशेवरों के लिए',
  'Personal, home and financial solution consultation based on profile.': 'प्रोफ़ाइल के आधार पर व्यक्तिगत, घरेलू और वित्तीय समाधान परामर्श।',
  'For businesses': 'व्यवसायों के लिए',
  'Business loans discussion with income, banking and documentation focus.': 'आय, बैंकिंग और दस्तावेज़ीकरण फोकस के साथ बिजनेस फंडिंग पर चर्चा।',
  'Simple explanation': 'सरल व्याख्या',
  'We explain the loan path, possible document needs, repayment basics and application steps in customer-friendly language.': 'हम ऋण पथ, संभावित दस्तावेज़ आवश्यकताओं, पुनर्भुगतान की मूल बातें और आवेदन चरणों को ग्राहक-अनुकूल भाषा में समझाते हैं।',
  'Document preparation': 'दस्तावेज़ की तैयारी',
  'We help customers prepare KYC, admission proof, academic records, income documents, bank statements and relevant supporting papers.': 'हम ग्राहकों को केवाईसी, प्रवेश प्रमाण, शैक्षणिक रिकॉर्ड, आय दस्तावेज, बैंक विवरण और प्रासंगिक सहायक कागजात तैयार करने में मदद करते हैं।',
  'Process support': 'प्रक्रिया का समर्थन',
  'We support customer follow-up and communication clarity while respecting that final decisions rest with multiple banks.': 'हम इस बात का सम्मान करते हुए कि अंतिम निर्णय कई बैंकों के पास हैं, ग्राहक फॉलो-अप और संचार स्पष्टता का समर्थन करते हैं।',
  'Next phase': 'अगला चरण',
  'Digital expansion': 'डिजिटल विस्तार',
  'The website is structured for next-phase CRM, customer login, staff login, document upload and application status tracking.': 'वेबसाइट अगले चरण के सीआरएम, ग्राहक लॉगिन, स्टाफ लॉगिन, दस्तावेज़ अपलोड और एप्लिकेशन स्थिति ट्रैकिंग के लिए संरचित है।',
  'Responsible service note:': 'जिम्मेदार सेवा नोट:',
  'Nidhi Path Loan Ventures provides guidance and consultation. Loan approval, rate, amount, charges and disbursement are subject to multiple bank policies, eligibility, credit assessment, documentation and verification.': 'निधि पथ फंड वेंचर्स मार्गदर्शन और परामर्श प्रदान करता है। ऋण अनुमोदन, दर, राशि, शुल्क और संवितरण कई बैंक नीतियों, पात्रता, क्रेडिट मूल्यांकन, दस्तावेज़ीकरण और सत्यापन के अधीन हैं।',
  'Education loans': 'शिक्षा वित्त पोषण',
  'Personal loans': 'व्यक्तिगत फंडिंग',
  'Business loans': 'बिजनेस फंडिंग',
  'Home loans': 'गृह वित्त पोषण',
  'Other suitable loan categories': 'अन्य उपयुक्त ऋण श्रेणियाँ',
  'We understand your requirement, check basic preparation and guide you toward practical next steps without making approval promises.': 'हम आपकी आवश्यकता को समझते हैं, बुनियादी तैयारी की जांच करते हैं और अनुमोदन का वादा किए बिना व्यावहारिक अगले चरणों के लिए आपका मार्गदर्शन करते हैं।',
  'Enquire About Loans': 'फंडिंग के बारे में पूछताछ करें',
  'Loan Support Desk': 'फंड सपोर्ट डेस्क',
  'Tell us what you are planning. Our team will help you understand the right loan path, document preparation, repayment estimate and next practical step before formal processing.': 'हमें बताएं कि आप क्या योजना बना रहे हैं. हमारी टीम आपको सही ऋण पथ, दस्तावेज़ तैयार करने, पुनर्भुगतान अनुमान और औपचारिक प्रसंस्करण से पहले अगले व्यावहारिक कदम को समझने में मदद करेगी।',
  'Email the Desk': 'डेस्क को ईमेल करें',
  'Open Office Map': 'कार्यालय का नक्शा खोलें',
  'Enquiry Intake': 'पूछताछ सेवन',
  'Email Address': 'ईमेल पता',
  'City': 'शहर',
  'Service Needed': 'सेवा की आवश्यकता',
  'Approx. Loan Amount': 'लगभग. निधि राशि',
  'Requirement Notes': 'आवश्यकता नोट्स',
  'Send Requirement': 'आवश्यकता भेजें',
  'Fastest response': 'सबसे तेज़ प्रतिक्रिया',
  'Website': 'वेबसाइट',
  'Office Hours': 'कार्यालय समय',
  'Support Focus': 'फोकस का समर्थन करें',
  'Before You Contact': 'संपर्क करने से पहले',
  'Education loan': 'शिक्षा निधि',
  'Course, college, country or city, admission status, fee structure and parent/co-applicant details.': 'पाठ्यक्रम, कॉलेज, देश या शहर, प्रवेश स्थिति, शुल्क संरचना और माता-पिता/सह-आवेदक का विवरण।',
  'Personal or home loan': 'व्यक्तिगत या घरेलू निधि',
  'Approximate amount, monthly income, existing EMIs, property stage and preferred tenure.': 'अनुमानित राशि, मासिक आय, मौजूदा ईएमआई, संपत्ति चरण और पसंदीदा कार्यकाल।',
  'Business loan': 'बिजनेस फंड',
  'Business type, years in operation, banking history, loan purpose and basic turnover range.': 'व्यवसाय का प्रकार, संचालन के वर्ष, बैंकिंग इतिहास, ऋण उद्देश्य और मूल टर्नओवर सीमा।',
  'Your goal, urgency, available documents and the exact point where you need clarity.': 'आपका लक्ष्य, तात्कालिकता, उपलब्ध दस्तावेज़ और सटीक बिंदु जहां आपको स्पष्टता की आवश्यकता है।',
  'Visit Our Office': 'हमारे कार्यालय पर आएं',
  'Open Route': 'खुला मार्ग',
  'Specialist Service': 'विशेषज्ञ सेवा',
  'Study in India loan guidance': 'भारत में अध्ययन निधि मार्गदर्शन',
  'Study abroad loan guidance': 'विदेश में अध्ययन निधि मार्गदर्शन',
  'Course fee, living expenses, travel and books planning': 'पाठ्यक्रम शुल्क, रहने का खर्च, यात्रा और पुस्तकों की योजना',
  'Parent or co-applicant support': 'माता-पिता या सह-आवेदक का समर्थन',
  'Admission-based documentation support': 'प्रवेश-आधारित दस्तावेज़ीकरण समर्थन',
  'Admission proof': 'प्रवेश प्रमाण',
  'Academic records': 'शैक्षणिक रिकॉर्ड',
  'KYC documents': 'केवाईसी दस्तावेज़',
  'Co-applicant income proof if applicable': 'यदि लागू हो तो सह-आवेदक का आय प्रमाण',
  'Bank statements if required': 'आवश्यक होने पर बैंक विवरण',
  'Enquire About Education Loan': 'शिक्षा ऋण के बारे में पूछताछ करें',
  'Check Eligibility': 'पात्रता जांचें',
  'Student admission proof': 'विद्यार्थी प्रवेश प्रमाण',
  'Co-applicant or parent details': 'सह-आवेदक या अभिभावक विवरण',
  'Income proof if applicable': 'लागू होने पर आय प्रमाण',
  'Income proof': 'आय प्रमाण',
  'Bank statements': 'बैंक विवरण',
  'Property or business documents based on loan type': 'ऋण के प्रकार के आधार पर संपत्ति या व्यावसायिक दस्तावेज़',
  'Student Profile': 'छात्र प्रोफाइल',
  'Admission and academic preparation': 'प्रवेश एवं शैक्षणिक तैयारी',
  'Keep admission letter or offer proof, course duration, fee structure, academic records and entrance result details ready where applicable.': 'जहां लागू हो, प्रवेश पत्र या प्रस्ताव प्रमाण, पाठ्यक्रम अवधि, शुल्क संरचना, शैक्षणिक रिकॉर्ड और प्रवेश परिणाम विवरण तैयार रखें।',
  'Parent or guardian details': 'माता-पिता या अभिभावक का विवरण',
  'Education loans commonly require parent or co-applicant information, KYC, bank statements and income details based on the bank process.': 'शिक्षा निधि के लिए आमतौर पर माता-पिता या सह-आवेदक की जानकारी, केवाईसी, बैंक विवरण और बैंक प्रक्रिया के आधार पर आय विवरण की आवश्यकता होती है।',
  'Repayment': 'चुकौती',
  'EMI and moratorium planning': 'ईएमआई और अधिस्थगन योजना',
  'Plan repayment using tenure, interest rate, down payment, processing fee and education moratorium assumptions before the formal application.': 'औपचारिक आवेदन से पहले कार्यकाल, ब्याज दर, डाउन पेमेंट, प्रोसेसिंग शुल्क और शिक्षा अधिस्थगन मान्यताओं का उपयोग करके पुनर्भुगतान की योजना बनाएं।',
  'Other Loans': 'अन्य फंडिंग',
  'Income and credit profile': 'आय और क्रेडिट प्रोफ़ाइल',
  'For personal, home and business loans, eligibility commonly depends on income, obligations, credit history, bank statements and loan purpose.': 'व्यक्तिगत, घरेलू और व्यावसायिक फंडिंग के लिए, पात्रता आमतौर पर आय, दायित्वों, क्रेडिट इतिहास, बैंक विवरण और ऋण उद्देश्य पर निर्भर करती है।',
  'Smart EMI Planner': 'स्मार्ट ईएमआई प्लानर',
  'Estimate your EMI with education-specific options like moratorium, plus processing fee, down payment, disbursement estimate and a first-month repayment preview.': 'शिक्षा-विशिष्ट विकल्पों जैसे अधिस्थगन, प्लस प्रोसेसिंग शुल्क, डाउन पेमेंट, संवितरण अनुमान और पहले महीने के पुनर्भुगतान पूर्वावलोकन के साथ अपनी ईएमआई का अनुमान लगाएं।',
  'Loan Type': 'ऋण प्रकार',
  'Other': 'अन्य',
  'Tenure Mode': 'कार्यकाल मोड',
  'Months': 'महीने',
  'Years': 'वर्ष',
  'Annual Interest Rate': 'वार्षिक ब्याज दर',
  'Loan Tenure': 'निधि कार्यकाल',
  'Down Payment / Margin Money': 'डाउन पेमेंट/मार्जिन मनी',
  'Processing Fee %': 'प्रक्रिया शुल्क %',
  'Education Moratorium (months)': 'शिक्षा अधिस्थगन (महीने)',
  'Estimated Monthly EMI': 'अनुमानित मासिक ईएमआई',
  'months repayment tenure': 'महीनों की चुकौती अवधि',
  'Principal': 'मूलधन',
  'principal': 'प्रधान',
  'Interest': 'ब्याज',
  'interest': 'रुचि',
  'Balance': 'संतुलन',
  'Month': 'माह',
  'Total Payable': 'कुल देय राशि',
  'Processing Fee': 'प्रोसेसिंग शुल्क',
  'Estimated Disbursement': 'अनुमानित संवितरण',
  'Effective Disbursement': 'प्रभावी संवितरण',
  'Moratorium Interest': 'मोरेटोरियम ब्याज',
  'Repayment Mix': 'चुकौती मिश्रण',
  'Principal vs Interest': 'मूलधन और ब्याज',
  'First 6 Months Preview': 'पहले 6 महीने का पूर्वावलोकन',
  'This is an estimate for planning only. Final EMI, eligibility, rate, charges and disbursement depend on multiple bank policies, documents and credit assessment.': 'यह केवल योजना के लिए एक अनुमान है. अंतिम ईएमआई, पात्रता, दर, शुल्क और संवितरण कई बैंक नीतियों, दस्तावेजों और क्रेडिट मूल्यांकन पर निर्भर करते हैं।',
  'Check My Eligibility': 'मेरी पात्रता जांचें',
  'Important:': 'महत्वपूर्ण:',
  'Calculated EMI and document lists are planning aids only. Final eligibility, loan amount, interest rate, fees, collateral and disbursement depend on multiple bank policies, credit profile, verification and submitted documents.': 'परिकलित ईएमआई और दस्तावेज़ सूचियाँ केवल योजना बनाने में सहायता करती हैं। अंतिम पात्रता, फंड राशि, ब्याज दर, शुल्क, संपार्श्विक और संवितरण कई बैंक नीतियों, क्रेडिट प्रोफ़ाइल, सत्यापन और प्रस्तुत दस्तावेजों पर निर्भर करते हैं।',
  'Maximum loans guidance': 'अधिकतम वित्त पोषण मार्गदर्शन',
  'Repayment planning': 'पुनर्भुगतान योजना',
  'Initial file review': 'प्रारंभिक फ़ाइल समीक्षा',
  'Business requirement review': 'व्यावसायिक आवश्यकता की समीक्षा',
  'Documentation checklist': 'दस्तावेज़ीकरण चेकलिस्ट',
  'Income and bank statement review': 'आय और बैंक विवरण की समीक्षा',
  'Loan option discussion': 'फंड विकल्प पर चर्चा',
  'Business proof': 'व्यवसाय प्रमाण',
  'Financial documents where applicable': 'वित्तीय दस्तावेज जहां लागू हो',
  'Enquire About Business Loan': 'बिजनेस लोन के बारे में पूछताछ करें',
  'Loan eligibility discussion': 'निधि पात्रता चर्चा',
  'Property document preparation': 'संपत्ति दस्तावेज तैयार करना',
  'Income proof checklist': 'आय प्रमाण चेकलिस्ट',
  'EMI and tenure planning': 'ईएमआई और कार्यकाल योजना',
  'Enquire About Home Loan': 'गृह ऋण के बारे में पूछताछ करें',
  'Protection Guidance': 'संरक्षण मार्गदर्शन',
  'Needs discussion': 'चर्चा की जरूरत है',
  'Coverage understanding': 'कवरेज समझ',
  'Documentation guidance': 'दस्तावेज़ीकरण मार्गदर्शन',
  'Policy comparison support': 'नीति तुलना समर्थन',
  'Helpful For': 'के लिए सहायक',
  'Enquire About Insurance': 'बीमा के बारे में पूछताछ करें',
  'Consultation Includes': 'परामर्श शामिल है',
  'Understanding your loan requirement': 'अपनी ऋण आवश्यकता को समझना',
  'Checking basic eligibility review': 'बुनियादी पात्रता समीक्षा की जाँच करना',
  'Explaining document needs': 'दस्तावेज़ की आवश्यकताओं को समझाना',
  'Planning the next action steps': 'अगले कार्य चरणों की योजना बनाना',
  'Best For': 'के लिए सर्वोत्तम',
  'Book Consultation': 'पुस्तक परामर्श',
  'Financial Guidance': 'वित्तीय मार्गदर्शन',
  'Goal-based discussion': 'लक्ष्य आधारित चर्चा',
  'Risk understanding': 'जोखिम की समझ',
  'Investment horizon planning': 'निवेश क्षितिज योजना',
  'Basic documentation guidance': 'बुनियादी दस्तावेज़ीकरण मार्गदर्शन',
  'Important Note': 'महत्वपूर्ण नोट',
  'Enquire About Mutual Funds': 'म्यूचुअल फंड के बारे में पूछताछ करें',
  'Requirement understanding': 'आवश्यकता समझ',
  'Eligibility discussion': 'पात्रता चर्चा',
  'Income and KYC document guidance': 'आय और केवाईसी दस्तावेज़ मार्गदर्शन',
  'Loan amount and tenure planning': 'निधि राशि और कार्यकाल योजना',
  'Enquire About Personal Loan': 'पर्सनल लोन के बारे में पूछताछ करें',
  'Requirement map': 'आवश्यकता मानचित्र',
  'Cost awareness': 'लागत जागरूकता',
  'Follow-up support': 'अनुवर्ती समर्थन',
  'Quick EMI calculator': 'त्वरित ईएमआई कैलकुलेटर',
  'Quick enquiry form': 'त्वरित पूछताछ प्रपत्र',
  'Close EMI calculator': 'ईएमआई कैलकुलेटर बंद करें',
  'Quick Enquiry': 'त्वरित पूछताछ',
  'Share your details': 'अपना विवरण साझा करें',
  'Loan Amount': 'ऋण राशि',
  'Interest %': 'ब्याज %',
  'Tenure (Months)': 'कार्यकाल (महीने)',
  'Full Name': 'पूरा नाम',
  'Phone Number': 'फ़ोन नंबर',
  'Email': 'ईमेल',
  'Select Service': 'सेवा का चयन करें',
  'Submit Enquiry': 'पूछताछ भेजें',
  'Our team will contact you shortly.': 'हमारी टीम शीघ्र ही आपसे संपर्क करेगी.',
  'Please check the details and try again.': 'कृपया विवरण जांचें और पुनः प्रयास करें।'
});

Object.assign(phraseTranslations.te, {
  'Home': 'ముఖ్య పేజీ',
  'Services': 'సేవలు',
  'About Us': 'మా గురించి',
  'Eligibility': 'అర్హత',
  'Contact Us': 'మమ్మల్ని సంప్రదించండి',
  'Login': 'ప్రవేశం',
  'Translate': 'అనువదించు',
  'English': 'ఇంగ్లీష్',
  'Hindi': 'హిందీ',
  'Telugu': 'తెలుగు',
  'Loan Ventures': 'ఫండ్ వెంచర్లు',
  'Guidance': 'మార్గదర్శకం',
  'Consultation': 'సంప్రదింపు',
  'Documentation support': 'డాక్యుమెంటేషన్ మద్దతు',
  'Multiple bank coordination support': 'బహుళ బ్యాంకు సమన్వయ మద్దతు',
  'Company Purpose': 'కంపెనీ ప్రయోజనం',
  'Loan customers often face the same problems: unclear eligibility, scattered documents, confusing repayment terms and uncertainty about which option suits their profile.': 'ఫండ్ కస్టమర్‌లు తరచూ అదే సమస్యలను ఎదుర్కొంటారు: అస్పష్టమైన అర్హత, చెల్లాచెదురుగా ఉన్న పత్రాలు, గందరగోళంగా ఉన్న రీపేమెంట్ నిబంధనలు మరియు వారి ప్రొఫైల్‌కు ఏ ఎంపిక సరిపోతుందో అనిశ్చితి.',
  'Nidhi Path works as a guidance partner, helping clients understand requirements, prepare documents and move forward with a practical application plan.': 'నిధి పథ్ మార్గదర్శక భాగస్వామిగా పని చేస్తుంది, క్లయింట్‌లు అవసరాలను అర్థం చేసుకోవడానికి, పత్రాలను సిద్ధం చేయడానికి మరియు ఆచరణాత్మక అప్లికేషన్ ప్లాన్‌తో ముందుకు సాగడానికి సహాయపడుతుంది.',
  'For students': 'విద్యార్థుల కోసం',
  'Admission-based education loan guidance for India and abroad.': 'భారతదేశం మరియు విదేశాలకు ప్రవేశ ఆధారిత విద్యా నిధి మార్గదర్శకత్వం.',
  'For families': 'కుటుంబాల కోసం',
  'Parent or co-applicant support, repayment discussion and document preparation.': 'తల్లిదండ్రులు లేదా సహ-దరఖాస్తుదారుల మద్దతు, తిరిగి చెల్లింపు చర్చ మరియు డాక్యుమెంట్ తయారీ.',
  'For professionals': 'నిపుణుల కోసం',
  'Personal, home and financial solution consultation based on profile.': 'ప్రొఫైల్ ఆధారంగా వ్యక్తిగత, గృహ మరియు ఆర్థిక పరిష్కార సంప్రదింపులు.',
  'For businesses': 'వ్యాపారాల కోసం',
  'Business loans discussion with income, banking and documentation focus.': 'ఆదాయం, బ్యాంకింగ్ మరియు డాక్యుమెంటేషన్ దృష్టితో వ్యాపార నిధుల చర్చ.',
  'Simple explanation': 'సాధారణ వివరణ',
  'We explain the loan path, possible document needs, repayment basics and application steps in customer-friendly language.': 'మేము రుణ మార్గం, సాధ్యమయ్యే డాక్యుమెంట్ అవసరాలు, రీపేమెంట్ బేసిక్స్ మరియు అప్లికేషన్ దశలను కస్టమర్-స్నేహపూర్వక భాషలో వివరిస్తాము.',
  'Document preparation': 'పత్రం తయారీ',
  'We help customers prepare KYC, admission proof, academic records, income documents, bank statements and relevant supporting papers.': 'KYC, అడ్మిషన్ ప్రూఫ్, అకడమిక్ రికార్డ్‌లు, ఆదాయ పత్రాలు, బ్యాంక్ స్టేట్‌మెంట్‌లు మరియు సంబంధిత సపోర్టింగ్ పేపర్‌లను సిద్ధం చేయడానికి మేము కస్టమర్‌లకు సహాయం చేస్తాము.',
  'Process support': 'ప్రాసెస్ మద్దతు',
  'We support customer follow-up and communication clarity while respecting that final decisions rest with multiple banks.': 'మేము కస్టమర్ ఫాలో-అప్ మరియు కమ్యూనికేషన్ క్లారిటీకి మద్దతిస్తాము, అయితే తుది నిర్ణయాలు బహుళ బ్యాంకులతో ఉంటాయి.',
  'Next phase': 'తదుపరి దశ',
  'Digital expansion': 'డిజిటల్ విస్తరణ',
  'The website is structured for next-phase CRM, customer login, staff login, document upload and application status tracking.': 'వెబ్‌సైట్ తదుపరి దశ CRM, కస్టమర్ లాగిన్, స్టాఫ్ లాగిన్, డాక్యుమెంట్ అప్‌లోడ్ మరియు అప్లికేషన్ స్టేటస్ ట్రాకింగ్ కోసం రూపొందించబడింది.',
  'Responsible service note:': 'బాధ్యతాయుతమైన సేవా గమనిక:',
  'Nidhi Path Loan Ventures provides guidance and consultation. Loan approval, rate, amount, charges and disbursement are subject to multiple bank policies, eligibility, credit assessment, documentation and verification.': 'నిధి పథ్ ఫండ్ వెంచర్స్ మార్గదర్శకత్వం మరియు సంప్రదింపులను అందిస్తుంది. లోన్ ఆమోదం, రేటు, మొత్తం, ఛార్జీలు మరియు చెల్లింపులు బహుళ బ్యాంక్ పాలసీలు, అర్హత, క్రెడిట్ అసెస్‌మెంట్, డాక్యుమెంటేషన్ మరియు ధృవీకరణకు లోబడి ఉంటాయి.',
  'Education loans': 'విద్యా నిధులు',
  'Personal loans': 'వ్యక్తిగత నిధులు',
  'Business loans': 'వ్యాపార నిధులు',
  'Home loans': 'గృహ నిధులు',
  'Other suitable loan categories': 'ఇతర తగిన రుణ వర్గాలు',
  'We understand your requirement, check basic preparation and guide you toward practical next steps without making approval promises.': 'మేము మీ అవసరాన్ని అర్థం చేసుకున్నాము, ప్రాథమిక తయారీని తనిఖీ చేస్తాము మరియు ఆమోదం వాగ్దానాలు చేయకుండా ఆచరణాత్మక తదుపరి దశల వైపు మీకు మార్గనిర్దేశం చేస్తాము.',
  'Enquire About Loans': 'నిధుల గురించి విచారించండి',
  'Loan Support Desk': 'ఫండ్ సపోర్ట్ డెస్క్',
  'Tell us what you are planning. Our team will help you understand the right loan path, document preparation, repayment estimate and next practical step before formal processing.': 'మీరు ఏమి ప్లాన్ చేస్తున్నారో మాకు చెప్పండి. అధికారిక ప్రాసెసింగ్‌కు ముందు సరైన లోన్ మార్గం, డాక్యుమెంట్ తయారీ, రీపేమెంట్ అంచనా మరియు తదుపరి ఆచరణాత్మక దశను అర్థం చేసుకోవడానికి మా బృందం మీకు సహాయం చేస్తుంది.',
  'Email the Desk': 'డెస్క్‌కి ఇమెయిల్ చేయండి',
  'Open Office Map': 'ఆఫీస్ మ్యాప్‌ని తెరవండి',
  'Enquiry Intake': 'విచారణ తీసుకోవడం',
  'Email Address': 'ఇమెయిల్ చిరునామా',
  'City': 'నగరం',
  'Service Needed': 'సేవ అవసరం',
  'Approx. Loan Amount': 'సుమారు ఫండ్ మొత్తం',
  'Requirement Notes': 'ఆవశ్యక గమనికలు',
  'Send Requirement': 'అవసరం పంపండి',
  'Fastest response': 'వేగవంతమైన ప్రతిస్పందన',
  'Website': 'వెబ్‌సైట్',
  'Office Hours': 'ఆఫీసు వేళలు',
  'Support Focus': 'మద్దతు ఫోకస్',
  'Before You Contact': 'మీరు సంప్రదించడానికి ముందు',
  'Education loan': 'విద్యా నిధి',
  'Course, college, country or city, admission status, fee structure and parent/co-applicant details.': 'కోర్సు, కళాశాల, దేశం లేదా నగరం, ప్రవేశ స్థితి, ఫీజు నిర్మాణం మరియు తల్లిదండ్రులు/సహ దరఖాస్తుదారు వివరాలు.',
  'Personal or home loan': 'వ్యక్తిగత లేదా గృహ నిధి',
  'Approximate amount, monthly income, existing EMIs, property stage and preferred tenure.': 'సుమారు మొత్తం, నెలవారీ ఆదాయం, ఇప్పటికే ఉన్న EMIలు, ఆస్తి దశ మరియు ప్రాధాన్య వ్యవధి.',
  'Business loan': 'వ్యాపార నిధి',
  'Business type, years in operation, banking history, loan purpose and basic turnover range.': 'వ్యాపార రకం, పనిచేస్తున్న సంవత్సరాలు, బ్యాంకింగ్ చరిత్ర, రుణ ప్రయోజనం మరియు ప్రాథమిక టర్నోవర్ పరిధి.',
  'Your goal, urgency, available documents and the exact point where you need clarity.': 'మీ లక్ష్యం, అత్యవసరం, అందుబాటులో ఉన్న పత్రాలు మరియు మీకు స్పష్టత అవసరమైన ఖచ్చితమైన పాయింట్.',
  'Visit Our Office': 'మా కార్యాలయాన్ని సందర్శించండి',
  'Open Route': 'మార్గాన్ని తెరవండి',
  'Specialist Service': 'స్పెషలిస్ట్ సర్వీస్',
  'Study in India loan guidance': 'ఇండియా ఫండ్ గైడెన్స్‌లో అధ్యయనం చేయండి',
  'Study abroad loan guidance': 'విదేశాల్లో అధ్యయనం చేయడం ఫండ్ మార్గదర్శకత్వం',
  'Course fee, living expenses, travel and books planning': 'కోర్సు రుసుము, జీవన వ్యయాలు, ప్రయాణం మరియు పుస్తకాల ప్రణాళిక',
  'Parent or co-applicant support': 'తల్లిదండ్రులు లేదా సహ-దరఖాస్తుదారుల మద్దతు',
  'Admission-based documentation support': 'ప్రవేశ ఆధారిత డాక్యుమెంటేషన్ మద్దతు',
  'Admission proof': 'ప్రవేశ రుజువు',
  'Academic records': 'విద్యా రికార్డులు',
  'KYC documents': 'KYC పత్రాలు',
  'Co-applicant income proof if applicable': 'వర్తిస్తే సహ-దరఖాస్తుదారు ఆదాయ రుజువు',
  'Bank statements if required': 'అవసరమైతే బ్యాంకు వివరాలు',
  'Enquire About Education Loan': 'ఎడ్యుకేషన్ లోన్ గురించి ఎంక్వైరీ చేయండి',
  'Check Eligibility': 'అర్హతను తనిఖీ చేయండి',
  'Student admission proof': 'విద్యార్థి ప్రవేశ రుజువు',
  'Co-applicant or parent details': 'సహ-దరఖాస్తుదారు లేదా తల్లిదండ్రుల వివరాలు',
  'Income proof if applicable': 'అవసరమైతే ఆదాయ రుజువు',
  'Income proof': 'ఆదాయ రుజువు',
  'Bank statements': 'బ్యాంకు వివరాలు',
  'Property or business documents based on loan type': 'లోన్ రకం ఆధారంగా ఆస్తి లేదా వ్యాపార పత్రాలు',
  'Student Profile': 'విద్యార్థి ప్రొఫైల్',
  'Admission and academic preparation': 'ప్రవేశం మరియు విద్యా తయారీ',
  'Keep admission letter or offer proof, course duration, fee structure, academic records and entrance result details ready where applicable.': 'అడ్మిషన్ లెటర్ లేదా ఆఫర్ ప్రూఫ్, కోర్సు వ్యవధి, ఫీజు నిర్మాణం, అకడమిక్ రికార్డులు మరియు ప్రవేశ ఫలితాల వివరాలను వర్తించే చోట సిద్ధంగా ఉంచండి.',
  'Parent or guardian details': 'తల్లిదండ్రులు లేదా సంరక్షకుల వివరాలు',
  'Education loans commonly require parent or co-applicant information, KYC, bank statements and income details based on the bank process.': 'విద్యా నిధులకు సాధారణంగా తల్లిదండ్రులు లేదా సహ-దరఖాస్తుదారుల సమాచారం, KYC, బ్యాంక్ స్టేట్‌మెంట్‌లు మరియు బ్యాంక్ ప్రక్రియ ఆధారంగా ఆదాయ వివరాలు అవసరం.',
  'Repayment': 'తిరిగి చెల్లింపు',
  'EMI and moratorium planning': 'EMI మరియు మారటోరియం ప్రణాళిక',
  'Plan repayment using tenure, interest rate, down payment, processing fee and education moratorium assumptions before the formal application.': 'అధికారిక దరఖాస్తుకు ముందు పదవీకాలం, వడ్డీ రేటు, డౌన్ పేమెంట్, ప్రాసెసింగ్ ఫీజు మరియు ఎడ్యుకేషన్ మారటోరియం అంచనాలను ఉపయోగించి తిరిగి చెల్లింపును ప్లాన్ చేయండి.',
  'Other Loans': 'ఇతర నిధులు',
  'Income and credit profile': 'ఆదాయం మరియు క్రెడిట్ ప్రొఫైల్',
  'For personal, home and business loans, eligibility commonly depends on income, obligations, credit history, bank statements and loan purpose.': 'వ్యక్తిగత, ఇల్లు మరియు వ్యాపార నిధుల కోసం, అర్హత సాధారణంగా ఆదాయం, బాధ్యతలు, క్రెడిట్ చరిత్ర, బ్యాంక్ స్టేట్‌మెంట్‌లు మరియు రుణ ప్రయోజనంపై ఆధారపడి ఉంటుంది.',
  'Smart EMI Planner': 'స్మార్ట్ EMI ప్లానర్',
  'Estimate your EMI with education-specific options like moratorium, plus processing fee, down payment, disbursement estimate and a first-month repayment preview.': 'తాత్కాలిక నిషేధం, ప్లస్ ప్రాసెసింగ్ ఫీజు, డౌన్ పేమెంట్, డిస్బర్స్‌మెంట్ అంచనా మరియు మొదటి నెల రీపేమెంట్ ప్రివ్యూ వంటి విద్య-నిర్దిష్ట ఎంపికలతో మీ EMIని అంచనా వేయండి.',
  'Loan Type': 'రుణ రకం',
  'Other': 'ఇతరము',
  'Tenure Mode': 'పదవీకాల మోడ్',
  'Months': 'నెలలు',
  'Years': 'సంవత్సరాలు',
  'Annual Interest Rate': 'వార్షిక వడ్డీ రేటు',
  'Loan Tenure': 'ఫండ్ పదవీకాలం',
  'Down Payment / Margin Money': 'డౌన్ పేమెంట్ / మార్జిన్ మనీ',
  'Processing Fee %': 'ప్రక్రియ రుసుము %',
  'Education Moratorium (months)': 'విద్య మారటోరియం (నెలలు)',
  'Estimated Monthly EMI': 'అంచనా వేసిన నెలవారీ EMI',
  'months repayment tenure': 'నెలల తిరిగి చెల్లింపు పదవీకాలం',
  'Principal': 'అసలు',
  'principal': 'ప్రిన్సిపాల్',
  'Interest': 'వడ్డీ',
  'interest': 'ఆసక్తి',
  'Balance': 'బ్యాలెన్స్',
  'Month': 'నెల',
  'Total Payable': 'మొత్తం చెల్లించవలసినది',
  'Processing Fee': 'ప్రాసెసింగ్ రుసుము',
  'Estimated Disbursement': 'అంచనా పంపిణీ',
  'Effective Disbursement': 'ప్రభావవంతమైన పంపిణీ',
  'Moratorium Interest': 'మొరటోరియం వడ్డీ',
  'Repayment Mix': 'తిరిగి చెల్లింపు మిశ్రమం',
  'Principal vs Interest': 'అసలు మరియు వడ్డీ',
  'First 6 Months Preview': 'మొదటి 6 నెలల ప్రివ్యూ',
  'This is an estimate for planning only. Final EMI, eligibility, rate, charges and disbursement depend on multiple bank policies, documents and credit assessment.': 'ఇది ప్రణాళిక కోసం మాత్రమే అంచనా. చివరి EMI, అర్హత, రేటు, ఛార్జీలు మరియు చెల్లింపులు బహుళ బ్యాంక్ పాలసీలు, డాక్యుమెంట్‌లు మరియు క్రెడిట్ అసెస్‌మెంట్‌పై ఆధారపడి ఉంటాయి.',
  'Check My Eligibility': 'నా అర్హతను చూడండి',
  'Important:': 'ముఖ్యమైన:',
  'Calculated EMI and document lists are planning aids only. Final eligibility, loan amount, interest rate, fees, collateral and disbursement depend on multiple bank policies, credit profile, verification and submitted documents.': 'లెక్కించబడిన EMI మరియు పత్రాల జాబితాలు ప్రణాళికా సహాయాలు మాత్రమే. తుది అర్హత, ఫండ్ మొత్తం, వడ్డీ రేటు, ఫీజులు, అనుషంగిక మరియు చెల్లింపులు బహుళ బ్యాంక్ పాలసీలు, క్రెడిట్ ప్రొఫైల్, ధృవీకరణ మరియు సమర్పించిన పత్రాలపై ఆధారపడి ఉంటాయి.',
  'Maximum loans guidance': 'గరిష్ట నిధుల మార్గదర్శకత్వం',
  'Repayment planning': 'తిరిగి చెల్లింపు ప్రణాళిక',
  'Initial file review': 'ప్రారంభ ఫైల్ సమీక్ష',
  'Business requirement review': 'వ్యాపార అవసరాల సమీక్ష',
  'Documentation checklist': 'డాక్యుమెంటేషన్ చెక్‌లిస్ట్',
  'Income and bank statement review': 'ఆదాయం మరియు బ్యాంక్ స్టేట్‌మెంట్ సమీక్ష',
  'Loan option discussion': 'ఫండ్ ఎంపిక చర్చ',
  'Business proof': 'వ్యాపార రుజువు',
  'Financial documents where applicable': 'వర్తించే ఆర్థిక పత్రాలు',
  'Enquire About Business Loan': 'బిజినెస్ లోన్ గురించి ఎంక్వైరీ చేయండి',
  'Loan eligibility discussion': 'ఫండ్ అర్హత చర్చ',
  'Property document preparation': 'ఆస్తి పత్రం తయారీ',
  'Income proof checklist': 'ఆదాయ రుజువు చెక్‌లిస్ట్',
  'EMI and tenure planning': 'EMI మరియు పదవీకాల ప్రణాళిక',
  'Enquire About Home Loan': 'హోమ్ లోన్ గురించి విచారించండి',
  'Protection Guidance': 'రక్షణ మార్గదర్శకత్వం',
  'Needs discussion': 'చర్చ అవసరం',
  'Coverage understanding': 'కవరేజ్ అవగాహన',
  'Documentation guidance': 'డాక్యుమెంటేషన్ మార్గదర్శకత్వం',
  'Policy comparison support': 'పాలసీ పోలిక మద్దతు',
  'Helpful For': 'కోసం ఉపయోగపడుతుంది',
  'Enquire About Insurance': 'బీమా గురించి విచారించండి',
  'Consultation Includes': 'సంప్రదింపులు ఉన్నాయి',
  'Understanding your loan requirement': 'మీ లోన్ అవసరాన్ని అర్థం చేసుకోవడం',
  'Checking basic eligibility review': 'ప్రాథమిక అర్హత సమీక్షను తనిఖీ చేస్తోంది',
  'Explaining document needs': 'డాక్యుమెంట్ అవసరాలను వివరిస్తుంది',
  'Planning the next action steps': 'తదుపరి కార్యాచరణ దశలను ప్లాన్ చేస్తోంది',
  'Best For': 'ఉత్తమమైనది',
  'Book Consultation': 'బుక్ కన్సల్టేషన్',
  'Financial Guidance': 'ఆర్థిక మార్గదర్శకత్వం',
  'Goal-based discussion': 'లక్ష్యం ఆధారిత చర్చ',
  'Risk understanding': 'ప్రమాద అవగాహన',
  'Investment horizon planning': 'పెట్టుబడి హోరిజోన్ ప్రణాళిక',
  'Basic documentation guidance': 'ప్రాథమిక డాక్యుమెంటేషన్ మార్గదర్శకత్వం',
  'Important Note': 'ముఖ్యమైన గమనిక',
  'Enquire About Mutual Funds': 'మ్యూచువల్ ఫండ్స్ గురించి విచారించండి',
  'Requirement understanding': 'అవసరాల అవగాహన',
  'Eligibility discussion': 'అర్హత చర్చ',
  'Income and KYC document guidance': 'ఆదాయం మరియు KYC డాక్యుమెంట్ మార్గదర్శకత్వం',
  'Loan amount and tenure planning': 'ఫండ్ మొత్తం మరియు పదవీకాల ప్రణాళిక',
  'Enquire About Personal Loan': 'పర్సనల్ లోన్ గురించి విచారించండి',
  'Requirement map': 'అవసరాల మ్యాప్',
  'Cost awareness': 'ఖర్చుపై అవగాహన',
  'Follow-up support': 'ఫాలో-అప్ మద్దతు',
  'Quick EMI calculator': 'త్వరిత EMI కాలిక్యులేటర్',
  'Quick enquiry form': 'త్వరిత విచారణ రూపం',
  'Close EMI calculator': 'EMI కాలిక్యులేటర్‌ను మూసివేయండి',
  'Quick Enquiry': 'త్వరిత విచారణ',
  'Share your details': 'మీ వివరాలను పంచుకోండి',
  'Loan Amount': 'రుణ మొత్తం',
  'Interest %': 'వడ్డీ %',
  'Tenure (Months)': 'పదవీకాలం (నెలలు)',
  'Full Name': 'పూర్తి పేరు',
  'Phone Number': 'ఫోన్ నంబర్',
  'Email': 'ఈమెయిల్',
  'Select Service': 'సేవను ఎంచుకోండి',
  'Submit Enquiry': 'విచారణ పంపండి',
  'Our team will contact you shortly.': 'మా బృందం త్వరలో మిమ్మల్ని సంప్రదిస్తుంది.',
  'Please check the details and try again.': 'దయచేసి వివరాలను తనిఖీ చేసి, మళ్లీ ప్రయత్నించండి.'
});

Object.assign(phraseTranslations.hi, {
  'Our Services': 'हमारी सेवाएँ',
  'All Types of Loans': 'सभी प्रकार के ऋण',
  'Education Loan': 'शिक्षा ऋण',
  'Personal Loan': 'व्यक्तिगत ऋण',
  'Business Loan': 'बिजनेस लोन',
  'Home Loan': 'गृह ऋण',
  'Mutual Funds': 'म्यूचुअल फंड',
  'Insurance': 'बीमा',
  'Loan Consultation': 'ऋण परामर्श',
  'The company focuses on education loans while also providing consultation for personal loans, business loans, home loans, insurance, Mutual Funds and other financial solutions. The goal is not to rush a customer into an application, but to make the path understandable before formal processing begins.': 'कंपनी शिक्षा फंडिंग पर ध्यान केंद्रित करती है, साथ ही व्यक्तिगत फंडिंग, बिजनेस फंडिंग, होम फंडिंग, बीमा, म्यूचुअल फंड और अन्य वित्तीय समाधानों के लिए परामर्श भी प्रदान करती है। लक्ष्य किसी ग्राहक को किसी एप्लिकेशन के पास ले जाना नहीं है, बल्कि औपचारिक प्रसंस्करण शुरू होने से पहले पथ को समझने योग्य बनाना है।',
  'Customers who want a clear home loan process overview before beginning formal bank documentation.': 'जो ग्राहक औपचारिक बैंक दस्तावेज़ीकरण शुरू करने से पहले एक स्पष्ट होम फंड प्रक्रिया का अवलोकन चाहते हैं।',
  'Nidhi Path Loan Ventures helps customers understand the right loan path before they apply. The team focuses on education loans while also supporting enquiries for personal loans, business loans, home loans, insurance, Mutual Funds and other financial solutions.': 'निधि पथ फंड वेंचर्स ग्राहकों को आवेदन करने से पहले सही ऋण मार्ग समझने में मदद करता है। टीम व्यक्तिगत फंडिंग, बिजनेस फंडिंग, होम फंडिंग, बीमा, म्यूचुअल फंड और अन्य वित्तीय समाधानों के लिए पूछताछ का समर्थन करते हुए शिक्षा फंडिंग पर ध्यान केंद्रित करती है।',
  'The purpose is simple: reduce confusion, prepare documents properly and make every customer conversation practical.': 'उद्देश्य सरल है: भ्रम कम करें, दस्तावेज़ ठीक से तैयार करें और प्रत्येक ग्राहक वार्तालाप को व्यावहारिक बनाएं।',
  'Education loans usually involve admission proof, course expenses, co-applicant details, repayment planning and bank-specific documentation. We help families organize the discussion before they approach the formal loan process.': 'शिक्षा निधि में आमतौर पर प्रवेश प्रमाण, पाठ्यक्रम व्यय, सह-आवेदक विवरण, पुनर्भुगतान योजना और बैंक-विशिष्ट दस्तावेज़ शामिल होते हैं। औपचारिक निधि प्रक्रिया शुरू करने से पहले हम परिवारों को चर्चा आयोजित करने में मदद करते हैं।',
  'Guidance for approved courses, fee schedules, academic records and parent or guardian preparation.': 'अनुमोदित पाठ्यक्रम, शुल्क कार्यक्रम, शैक्षणिक रिकॉर्ड और माता-पिता या अभिभावक की तैयारी के लिए मार्गदर्शन।',
  'Support for admission letters, living cost planning, travel cost discussion and collateral preparation where required.': 'जहां आवश्यक हो वहां प्रवेश पत्र, रहने की लागत योजना, यात्रा लागत चर्चा और संपार्श्विक तैयारी के लिए सहायता।',
  'Checklist support for KYC, academic documents, bank statements, income proof and expense schedules.': 'केवाईसी, शैक्षणिक दस्तावेज़, बैंक विवरण, आय प्रमाण और व्यय कार्यक्रम के लिए चेकलिस्ट समर्थन।',
  'Clear explanation for students, parents and co-applicants so everyone understands the next step.': 'छात्रों, अभिभावकों और सह-आवेदकों के लिए स्पष्ट स्पष्टीकरण ताकि हर कोई अगले चरण को समझ सके।',
  'Loan approval depends on multiple bank policies, eligibility, documents, income profile, credit history and verification. Nidhi Path keeps the conversation honest and helps customers prepare better before formal submission.': 'ऋण स्वीकृति कई बैंक नीतियों, पात्रता, दस्तावेजों, आय प्रोफ़ाइल, क्रेडिट इतिहास और सत्यापन पर निर्भर करती है। निधि पथ बातचीत को ईमानदार रखता है और ग्राहकों को औपचारिक रूप से प्रस्तुत करने से पहले बेहतर तैयारी करने में मदद करता है।',
  'Education Loaning': 'शिक्षा ऋण',
  'Parent Guidance': 'माता-पिता का मार्गदर्शन',
  'Document Support': 'दस्तावेज़ समर्थन',
  'Business Loaning': 'व्यवसाय ऋण',
  'Home Loan Advice': 'गृह ऋण सलाह',
  'Education-first': 'शिक्षा-प्रथम',
  'Specialized student and parent support': 'विशिष्ट छात्र और अभिभावक समर्थन',
  'CRM-prepared': 'सीआरएम-तैयार',
  'Next-phase lead tracking and dashboard expansion': 'अगले चरण की लीड ट्रैकिंग और डैशबोर्ड विस्तार',
  'Local office': 'स्थानीय कार्यालय',
  'Vijayawada support with phone and map access': 'फोन और मानचित्र पहुंच के साथ विजयवाड़ा समर्थन',
  'The website is structured so the next development phase can connect CRM, login, document upload and follow-up workflows without rebuilding the brand experience.': 'वेबसाइट को इस तरह से संरचित किया गया है कि अगला विकास चरण ब्रांड अनुभव के पुनर्निर्माण के बिना सीआरएम, लॉगिन, दस्तावेज़ अपलोड और अनुवर्ती वर्कफ़्लो को कनेक्ट कर सकता है।',
  'New enquiries, source, service type and follow-up owner.': 'नई पूछताछ, स्रोत, सेवा प्रकार और अनुवर्ती स्वामी।',
  'Submitted, documents pending, under review and disbursement updates.': 'प्रस्तुत, दस्तावेज़ लंबित, समीक्षाधीन और संवितरण अद्यतन।',
  'Student records, KYC, income proof, bank statements and property files.': 'छात्र रिकॉर्ड, केवाईसी, आय प्रमाण, बैंक विवरण और संपत्ति फाइलें।',
  'Customer area for status, reminders and protected document requests.': 'स्थिति, अनुस्मारक और संरक्षित दस्तावेज़ अनुरोधों के लिए ग्राहक क्षेत्र।',
  'Lead assignment, service pipeline, team notes and reporting.': 'लीड असाइनमेंट, सर्विस पाइपलाइन, टीम नोट्स और रिपोर्टिंग।',
  'Call backs, document gaps, appointment notes and WhatsApp enquiry routing.': 'कॉल बैक, दस्तावेज़ अंतराल, अपॉइंटमेंट नोट्स और WhatsApp पूछताछ रूटिंग।',
  'Nidhi Path helps students and parents prepare country-aware loan discussions: admission proof, course expenses, living cost estimates, travel needs, co-applicant preparation, collateral questions and EMI planning.': 'निधि पथ छात्रों और अभिभावकों को देश-जागरूक निधि चर्चाएँ तैयार करने में मदद करता है: प्रवेश प्रमाण, पाठ्यक्रम व्यय, रहने की लागत का अनुमान, यात्रा की ज़रूरतें, सह-आवेदक की तैयारी, संपार्श्विक प्रश्न और ईएमआई योजना।',
  'Domestic and overseas admission-based planning.': 'घरेलू और विदेशी प्रवेश-आधारित योजना।',
  'Tuition, living cost, books, equipment and travel.': 'ट्यूशन, रहने का खर्च, किताबें, उपकरण और यात्रा।',
  'Parent/co-applicant documents and repayment comfort.': 'माता-पिता/सह-आवेदक के दस्तावेज़ और पुनर्भुगतान की सुविधा।',
  'Domestic education loan guidance': 'घरेलू शिक्षा निधि मार्गदर्शन',
  'For professional, technical, management and higher-education courses with fee schedule, academic record and parent/co-applicant preparation.': 'शुल्क अनुसूची, शैक्षणिक रिकॉर्ड और माता-पिता/सह-आवेदक की तैयारी के साथ पेशेवर, तकनीकी, प्रबंधन और उच्च-शिक्षा पाठ्यक्रमों के लिए।',
  'Fee schedule': 'शुल्क अनुसूची',
  'Parent support': 'माता-पिता का सहयोग',
  'High-value overseas planning': 'उच्च मूल्य वाली विदेशी योजना',
  'Guidance for tuition planning, living-cost estimate, travel, visa loan discussion and collateral preparation where applicable.': 'जहां लागू हो, ट्यूशन योजना, रहने-खाने की लागत का अनुमान, यात्रा, वीज़ा फंड चर्चा और संपार्श्विक तैयारी के लिए मार्गदर्शन।',
  'Living cost': 'रहने की लागत',
  'Postgraduate and professional routes': 'स्नातकोत्तर और व्यावसायिक मार्ग',
  'Support for admission letter, tuition estimate, accommodation planning and repayment discussion for family decision-making.': 'पारिवारिक निर्णय लेने के लिए प्रवेश पत्र, ट्यूशन अनुमान, आवास योजना और पुनर्भुगतान चर्चा के लिए सहायता।',
  'Study and living-cost preparation': 'अध्ययन और जीवन-यापन-लागत की तैयारी',
  'Country-aware checklist support for tuition, living loans, student profile, parent details and bank process preparation.': 'ट्यूशन, लिविंग फंड, छात्र प्रोफ़ाइल, माता-पिता का विवरण और बैंक प्रक्रिया की तैयारी के लिए देश-जागरूक चेकलिस्ट समर्थन।',
  'Overseas education loans guidance': 'विदेशी शिक्षा वित्त पोषण मार्गदर्शन',
  'Planning support for university expenses, accommodation estimate, travel cost and education-loan repayment assumptions.': 'विश्वविद्यालय के खर्चों, आवास अनुमान, यात्रा लागत और शिक्षा-निधि पुनर्भुगतान मान्यताओं के लिए योजना समर्थन।',
  'Visa loans': 'वीज़ा फंड',
  'EMI plan': 'ईएमआई योजना',
  'Structured budget discussion': 'संरचित बजट चर्चा',
  'Guidance for tuition, blocked-account style loan planning conversations, living cost and supporting documents.': 'ट्यूशन, अवरुद्ध-खाता शैली फंड योजना वार्तालाप, रहने की लागत और सहायक दस्तावेजों के लिए मार्गदर्शन।',
  'Education loan route preparation': 'शिक्षा निधि मार्ग तैयारी',
  'Support for admission-based expense planning, travel estimate and parent/co-applicant document preparation.': 'प्रवेश-आधारित व्यय योजना, यात्रा अनुमान और माता-पिता/सह-आवेदक दस्तावेज़ तैयार करने के लिए सहायता।',
  'Parent docs': 'अभिभावक दस्तावेज़',
  'Tuition and living-cost guidance': 'ट्यूशन और जीवन-यापन संबंधी मार्गदर्शन',
  'Planning for course fee, accommodation, local expenses and document checklist before formal discussion with multiple banks.': 'कई बैंकों के साथ औपचारिक चर्चा से पहले पाठ्यक्रम शुल्क, आवास, स्थानीय खर्च और दस्तावेज़ चेकलिस्ट की योजना बनाना।',
  'Housing': 'आवास',
  'International study planning': 'अंतर्राष्ट्रीय अध्ययन योजना',
  'Guidance around course cost, living estimate, student documents and loan repayment comfort for families.': 'पाठ्यक्रम लागत, रहने का अनुमान, छात्र दस्तावेज़ और परिवारों के लिए फंड पुनर्भुगतान सुविधा के बारे में मार्गदर्शन।',
  'Course fee': 'पाठ्यक्रम शुल्क',
  'Student KYC': 'छात्र केवाईसी',
  'Near-abroad study support': 'निकट-विदेश में अध्ययन सहायता',
  'Focused guidance for fee estimate, accommodation planning, travel and compact documentation for faster preparation.': 'तेजी से तैयारी के लिए शुल्क अनुमान, आवास योजना, यात्रा और कॉम्पैक्ट दस्तावेज़ीकरण के लिए केंद्रित मार्गदर्शन।',
  'Fee estimate': 'शुल्क अनुमान',
  'Faster Preparation': 'तेज़ तैयारी',
  'Student loans preparation': 'छात्र वित्त तैयारी',
  'Support for admission documents, cost estimate, repayment assumptions and family financial planning discussion.': 'प्रवेश दस्तावेजों, लागत अनुमान, पुनर्भुगतान अनुमान और परिवार वित्तीय नियोजन चर्चा के लिए समर्थन।',
  'Family plan': 'परिवार योजना',
  'Nordic study-cost planning': 'नॉर्डिक अध्ययन-लागत योजना',
  'Guidance for tuition, living estimate, travel and academic-document preparation before loan option discussion.': 'फंड विकल्प चर्चा से पहले ट्यूशन, रहने का अनुमान, यात्रा और शैक्षणिक-दस्तावेज़ तैयार करने के लिए मार्गदर्शन।',
  'Country cards are guidance categories only. Actual loan amount, margin money, collateral, rate and eligibility depend on course, university, multiple bank policies, documents and credit assessment.': 'देश कार्ड केवल मार्गदर्शन श्रेणियां हैं। वास्तविक फंड राशि, मार्जिन मनी, संपार्श्विक, दर और पात्रता पाठ्यक्रम, विश्वविद्यालय, कई बैंक नीतियों, दस्तावेजों और क्रेडिट मूल्यांकन पर निर्भर करती है।',
  'Apply': 'आवेदन करें',
  'Guidance for insurance options based on personal, family and business needs.': 'व्यक्तिगत, पारिवारिक और व्यावसायिक आवश्यकताओं के आधार पर बीमा विकल्पों के लिए मार्गदर्शन।',
  'Customers who want clear guidance before choosing insurance options for protection and planning.': 'जो ग्राहक सुरक्षा और योजना के लिए बीमा विकल्प चुनने से पहले स्पष्ट मार्गदर्शन चाहते हैं।',
  'One-to-one consultation for eligibility, documentation and process clarity.': 'पात्रता, दस्तावेज़ीकरण और प्रक्रिया स्पष्टता के लिए एक-से-एक परामर्श।',
  'Students, parents, salaried customers, business owners and families who need practical loan guidance before applying.': 'छात्र, अभिभावक, वेतनभोगी ग्राहक, व्यवसाय मालिक और परिवार जिन्हें आवेदन करने से पहले व्यावहारिक निधि मार्गदर्शन की आवश्यकता होती है।',
  'Consultation support for customers exploring long-term financial planning options.': 'दीर्घकालिक वित्तीय नियोजन विकल्प तलाशने वाले ग्राहकों के लिए परामर्श सहायता।',
  'Mutual loan investments are subject to market risks. Customers should review scheme documents and suitability before investing.': 'म्यूचुअल फंड निवेश बाजार जोखिमों के अधीन हैं। ग्राहकों को निवेश से पहले योजना के दस्तावेजों और उपयुक्तता की समीक्षा करनी चाहिए।',
  'Support for customers exploring personal loans options with clear eligibility and documentation guidance.': 'स्पष्ट पात्रता और दस्तावेज़ीकरण मार्गदर्शन के साथ व्यक्तिगत फंडिंग विकल्प तलाशने वाले ग्राहकों के लिए सहायता।',
  'Personal financial needs where a customer wants clarity on process, documentation and suitable options before applying.': 'व्यक्तिगत वित्तीय ज़रूरतें जहां ग्राहक आवेदन करने से पहले प्रक्रिया, दस्तावेज़ीकरण और उपयुक्त विकल्पों पर स्पष्टता चाहता है।',
  'Guidance for study in India, study abroad, course fee planning, living expenses, parent support and document preparation.': 'भारत और विदेश में पढ़ाई, पाठ्यक्रम शुल्क योजना, रहने के खर्च, अभिभावक सहायता और दस्तावेज़ तैयारी के लिए मार्गदर्शन।',
  'Support for salaried customers seeking clarity on eligibility, income proof, EMI planning and suitable personal loans options.': 'वेतनभोगी ग्राहकों के लिए पात्रता, आय प्रमाण, मासिक किस्त योजना और उपयुक्त व्यक्तिगत धन विकल्पों पर स्पष्ट सहायता।',
  'Consultation for business owners around working capital, expansion needs, banking history and documentation preparation.': 'कार्यशील पूंजी, विस्तार आवश्यकताओं, बैंकिंग इतिहास और दस्तावेज़ तैयारी पर व्यवसाय मालिकों के लिए परामर्श।',
  'Guidance for purchase, construction, renovation and balance transfer discussions with EMI and property document focus.': 'खरीद, निर्माण, नवीनीकरण और शेष ऋण स्थानांतरण चर्चा के लिए मासिक किस्त और संपत्ति दस्तावेज़ केंद्रित मार्गदर्शन।',
  'Goal-based consultation for customers who want to understand horizon, risk, documentation and planning suitability.': 'लक्ष्य, अवधि, जोखिम, दस्तावेज़ और योजना उपयुक्तता समझना चाहने वाले ग्राहकों के लिए परामर्श।',
  'Protection guidance for individuals, families and business owners comparing coverage needs and basic policy documents.': 'व्यक्तियों, परिवारों और व्यवसाय मालिकों के लिए कवरेज आवश्यकताओं और मूल पॉलिसी दस्तावेज़ों पर सुरक्षा मार्गदर्शन।',
  'Requirement review across multiple loan categories so customers can identify a practical path before formal application.': 'कई ऋण श्रेणियों में आवश्यकता की समीक्षा ताकि ग्राहक औपचारिक आवेदन से पहले एक व्यावहारिक मार्ग की पहचान कर सकें।',
  'One-to-one consultation for eligibility discussion, document checklist, repayment planning and next action steps.': 'पात्रता चर्चा, दस्तावेज़ सूची, पुनर्भुगतान योजना और अगले कदमों के लिए व्यक्तिगत परामर्श।',
  'Nidhi Path does not position loan guidance as a one-click promise. The team first understands the customer profile, then checks preparation, explains possible documents, discusses repayment impact and supports the next formal process step.': 'निधि पथ फंड मार्गदर्शन को एक-क्लिक के वादे के रूप में नहीं रखता है। टीम पहले ग्राहक प्रोफ़ाइल को समझती है, फिर तैयारी की जांच करती है, संभावित दस्तावेजों की व्याख्या करती है, पुनर्भुगतान प्रभाव पर चर्चा करती है और अगले औपचारिक प्रक्रिया चरण का समर्थन करती है।',
  'Purpose, amount, urgency, city, income type and applicant profile.': 'उद्देश्य, राशि, तात्कालिकता, शहर, आय का प्रकार और आवेदक प्रोफ़ाइल।',
  'Age, income, co-applicant, credit history and document availability.': 'आयु, आय, सह-आवेदक, क्रेडिट इतिहास और दस्तावेज़ उपलब्धता।',
  'EMI, tenure, processing fees, margin money and total repayment estimate.': 'ईएमआई, कार्यकाल, प्रोसेसिंग फीस, मार्जिन मनी और कुल पुनर्भुगतान अनुमान।',
  'Practical reminders, document gaps and next-phase CRM-prepared lead tracking.': 'व्यावहारिक अनुस्मारक, दस्तावेज़ अंतराल और अगले चरण की सीआरएम-तैयार लीड ट्रैकिंग।',
  'Students and parents get dedicated guidance for domestic and abroad education loans, admission proof, expense schedules and co-applicant preparation.': 'छात्रों और अभिभावकों को घरेलू और विदेशी शिक्षा वित्त पोषण, प्रवेश प्रमाण, व्यय कार्यक्रम और सह-आवेदक की तैयारी के लिए समर्पित मार्गदर्शन मिलता है।',
  'Customers are guided on common documents such as KYC, income proof, bank statements, academic records, business documents and property papers when relevant.': 'प्रासंगिक होने पर ग्राहकों को केवाईसी, आय प्रमाण, बैंक विवरण, शैक्षणिक रिकॉर्ड, व्यावसायिक दस्तावेज़ और संपत्ति के कागजात जैसे सामान्य दस्तावेजों पर मार्गदर्शन किया जाता है।',
  'Loan approval is never promised. We keep the process realistic and explain that final decisions depend on multiple bank policies and verification.': 'ऋण स्वीकृति का कभी वादा नहीं किया जाता. हम प्रक्रिया को यथार्थवादी रखते हैं और समझाते हैं कि अंतिम निर्णय कई बैंक नीतियों और सत्यापन पर निर्भर करते हैं।'
});

Object.assign(phraseTranslations.te, {
  'Our Services': 'మా సేవలు',
  'All Types of Loans': 'అన్ని రకాల రుణాలు',
  'Education Loan': 'విద్యా రుణం',
  'Personal Loan': 'వ్యక్తిగత రుణం',
  'Business Loan': 'వ్యాపార రుణం',
  'Home Loan': 'గృహ రుణం',
  'Mutual Funds': 'మ్యూచువల్ ఫండ్లు',
  'Insurance': 'బీమా',
  'Loan Consultation': 'లోన్ కన్సల్టేషన్',
  'The company focuses on education loans while also providing consultation for personal loans, business loans, home loans, insurance, Mutual Funds and other financial solutions. The goal is not to rush a customer into an application, but to make the path understandable before formal processing begins.': 'వ్యక్తిగత నిధులు, వ్యాపార నిధులు, గృహ నిధులు, బీమా, మ్యూచువల్ ఫండ్‌లు మరియు ఇతర ఆర్థిక పరిష్కారాల కోసం సంప్రదింపులను అందిస్తూనే విద్య నిధులపై కంపెనీ దృష్టి సారిస్తుంది. లక్ష్యం కస్టమర్‌ని అప్లికేషన్‌లోకి రష్ చేయడం కాదు, అధికారిక ప్రాసెసింగ్ ప్రారంభమయ్యే ముందు మార్గం అర్థమయ్యేలా చేయడం.',
  'Customers who want a clear home loan process overview before beginning formal bank documentation.': 'అధికారిక బ్యాంక్ డాక్యుమెంటేషన్ ప్రారంభించే ముందు స్పష్టమైన హోమ్ ఫండ్ ప్రాసెస్ ఓవర్‌వ్యూను కోరుకునే కస్టమర్‌లు.',
  'Nidhi Path Loan Ventures helps customers understand the right loan path before they apply. The team focuses on education loans while also supporting enquiries for personal loans, business loans, home loans, insurance, Mutual Funds and other financial solutions.': 'నిధి పథ్ ఫండ్ వెంచర్లు కస్టమర్‌లు దరఖాస్తు చేసుకునే ముందు సరైన లోన్ మార్గాన్ని అర్థం చేసుకోవడంలో సహాయపడతాయి. వ్యక్తిగత నిధులు, వ్యాపార నిధులు, గృహ నిధులు, బీమా, మ్యూచువల్ ఫండ్‌లు మరియు ఇతర ఆర్థిక పరిష్కారాల కోసం విచారణలకు మద్దతునిస్తూనే బృందం విద్య నిధులపై దృష్టి పెడుతుంది.',
  'The purpose is simple: reduce confusion, prepare documents properly and make every customer conversation practical.': 'ప్రయోజనం సులభం: గందరగోళాన్ని తగ్గించండి, పత్రాలను సరిగ్గా సిద్ధం చేయండి మరియు ప్రతి కస్టమర్ సంభాషణను ఆచరణాత్మకంగా చేయండి.',
  'Education loans usually involve admission proof, course expenses, co-applicant details, repayment planning and bank-specific documentation. We help families organize the discussion before they approach the formal loan process.': 'ఎడ్యుకేషన్ ఫండింగ్‌లో సాధారణంగా అడ్మిషన్ ప్రూఫ్, కోర్సు ఖర్చులు, సహ-దరఖాస్తుదారుల వివరాలు, రీపేమెంట్ ప్లానింగ్ మరియు బ్యాంక్-నిర్దిష్ట డాక్యుమెంటేషన్ ఉంటాయి. కుటుంబాలు అధికారిక ఫండ్ ప్రక్రియను చేరుకోవడానికి ముందు చర్చను నిర్వహించడానికి మేము సహాయం చేస్తాము.',
  'Guidance for approved courses, fee schedules, academic records and parent or guardian preparation.': 'ఆమోదించబడిన కోర్సులు, ఫీజు షెడ్యూల్‌లు, విద్యాసంబంధ రికార్డులు మరియు తల్లిదండ్రులు లేదా సంరక్షకుల తయారీ కోసం మార్గదర్శకత్వం.',
  'Support for admission letters, living cost planning, travel cost discussion and collateral preparation where required.': 'అవసరమైన చోట అడ్మిషన్ లెటర్స్, లివింగ్ కాస్ట్ ప్లానింగ్, ట్రావెల్ కాస్ట్ డిస్కషన్ మరియు కొలేటరల్ ప్రిపరేషన్ కోసం సపోర్ట్.',
  'Checklist support for KYC, academic documents, bank statements, income proof and expense schedules.': 'KYC, విద్యా పత్రాలు, బ్యాంక్ స్టేట్‌మెంట్‌లు, ఆదాయ రుజువు మరియు ఖర్చు షెడ్యూల్‌ల కోసం చెక్‌లిస్ట్ మద్దతు.',
  'Clear explanation for students, parents and co-applicants so everyone understands the next step.': 'విద్యార్థులు, తల్లిదండ్రులు మరియు సహ-దరఖాస్తుదారులకు స్పష్టమైన వివరణ కాబట్టి ప్రతి ఒక్కరూ తదుపరి దశను అర్థం చేసుకుంటారు.',
  'Loan approval depends on multiple bank policies, eligibility, documents, income profile, credit history and verification. Nidhi Path keeps the conversation honest and helps customers prepare better before formal submission.': 'లోన్ ఆమోదం బహుళ బ్యాంక్ పాలసీలు, అర్హత, పత్రాలు, ఆదాయ ప్రొఫైల్, క్రెడిట్ చరిత్ర మరియు ధృవీకరణపై ఆధారపడి ఉంటుంది. Nidhi Path సంభాషణను నిజాయితీగా ఉంచుతుంది మరియు అధికారిక సమర్పణకు ముందు కస్టమర్‌లు మెరుగ్గా సిద్ధం కావడానికి సహాయపడుతుంది.',
  'Education Loaning': 'విద్యా రుణం',
  'Parent Guidance': 'తల్లిదండ్రుల మార్గదర్శకత్వం',
  'Document Support': 'పత్రం మద్దతు',
  'Business Loaning': 'వ్యాపార రుణం',
  'Home Loan Advice': 'హోమ్ లోన్ సలహా',
  'Education-first': 'విద్య-మొదట',
  'Specialized student and parent support': 'ప్రత్యేక విద్యార్థి మరియు తల్లిదండ్రుల మద్దతు',
  'CRM-prepared': 'CRM- సిద్ధం చేయబడింది',
  'Next-phase lead tracking and dashboard expansion': 'తదుపరి దశ లీడ్ ట్రాకింగ్ మరియు డాష్‌బోర్డ్ విస్తరణ',
  'Local office': 'స్థానిక కార్యాలయం',
  'Vijayawada support with phone and map access': 'ఫోన్ మరియు మ్యాప్ యాక్సెస్‌తో విజయవాడ మద్దతు',
  'The website is structured so the next development phase can connect CRM, login, document upload and follow-up workflows without rebuilding the brand experience.': 'వెబ్‌సైట్ నిర్మాణాత్మకమైనది కాబట్టి తదుపరి అభివృద్ధి దశ బ్రాండ్ అనుభవాన్ని పునర్నిర్మించకుండానే CRM, లాగిన్, డాక్యుమెంట్ అప్‌లోడ్ మరియు ఫాలో-అప్ వర్క్‌ఫ్లోలను కనెక్ట్ చేయగలదు.',
  'New enquiries, source, service type and follow-up owner.': 'కొత్త విచారణలు, మూలం, సేవా రకం మరియు తదుపరి యజమాని.',
  'Submitted, documents pending, under review and disbursement updates.': 'సమర్పించబడినవి, పత్రాలు పెండింగ్‌లో ఉన్నాయి, సమీక్షలో ఉన్నాయి మరియు చెల్లింపు నవీకరణలు.',
  'Student records, KYC, income proof, bank statements and property files.': 'విద్యార్థి రికార్డులు, KYC, ఆదాయ రుజువు, బ్యాంక్ స్టేట్‌మెంట్‌లు మరియు ఆస్తి ఫైల్‌లు.',
  'Customer area for status, reminders and protected document requests.': 'స్థితి, రిమైండర్‌లు మరియు రక్షిత పత్ర అభ్యర్థనల కోసం కస్టమర్ ప్రాంతం.',
  'Lead assignment, service pipeline, team notes and reporting.': 'లీడ్ అసైన్‌మెంట్, సర్వీస్ పైప్‌లైన్, టీమ్ నోట్స్ మరియు రిపోర్టింగ్.',
  'Call backs, document gaps, appointment notes and WhatsApp enquiry routing.': 'కాల్ బ్యాక్‌లు, డాక్యుమెంట్ గ్యాప్‌లు, అపాయింట్‌మెంట్ నోట్‌లు మరియు WhatsApp విచారణ రూటింగ్.',
  'Nidhi Path helps students and parents prepare country-aware loan discussions: admission proof, course expenses, living cost estimates, travel needs, co-applicant preparation, collateral questions and EMI planning.': 'నిధి మార్గం విద్యార్థులు మరియు తల్లిదండ్రులకు దేశం-అవగాహన ఫండ్ చర్చలను సిద్ధం చేయడంలో సహాయపడుతుంది: ప్రవేశ రుజువు, కోర్సు ఖర్చులు, జీవన వ్యయ అంచనాలు, ప్రయాణ అవసరాలు, సహ-దరఖాస్తుదారుల తయారీ, అనుషంగిక ప్రశ్నలు మరియు EMI ప్రణాళిక.',
  'Domestic and overseas admission-based planning.': 'దేశీయ మరియు విదేశీ ప్రవేశ ఆధారిత ప్రణాళిక.',
  'Tuition, living cost, books, equipment and travel.': 'ట్యూషన్, జీవన వ్యయం, పుస్తకాలు, పరికరాలు మరియు ప్రయాణం.',
  'Parent/co-applicant documents and repayment comfort.': 'తల్లిదండ్రులు/సహ-దరఖాస్తుదారు పత్రాలు మరియు తిరిగి చెల్లింపు సౌకర్యం.',
  'Domestic education loan guidance': 'దేశీయ విద్యా నిధి మార్గదర్శకత్వం',
  'For professional, technical, management and higher-education courses with fee schedule, academic record and parent/co-applicant preparation.': 'ఫీజు షెడ్యూల్, అకడమిక్ రికార్డ్ మరియు పేరెంట్/కో-దరఖాస్తుదారుల ప్రిపరేషన్‌తో ప్రొఫెషనల్, టెక్నికల్, మేనేజ్‌మెంట్ మరియు ఉన్నత-విద్యా కోర్సుల కోసం.',
  'Fee schedule': 'ఫీజు షెడ్యూల్',
  'Parent support': 'తల్లిదండ్రుల మద్దతు',
  'High-value overseas planning': 'అధిక విలువ కలిగిన విదేశీ ప్రణాళిక',
  'Guidance for tuition planning, living-cost estimate, travel, visa loan discussion and collateral preparation where applicable.': 'ట్యూషన్ ప్లానింగ్, జీవన వ్యయ అంచనా, ప్రయాణం, వీసా ఫండ్ చర్చ మరియు అనుషంగిక తయారీకి సంబంధించిన మార్గదర్శకాలు.',
  'Living cost': 'జీవన వ్యయం',
  'Postgraduate and professional routes': 'పోస్ట్ గ్రాడ్యుయేట్ మరియు వృత్తిపరమైన మార్గాలు',
  'Support for admission letter, tuition estimate, accommodation planning and repayment discussion for family decision-making.': 'కుటుంబ నిర్ణయాధికారం కోసం అడ్మిషన్ లెటర్, ట్యూషన్ అంచనా, వసతి ప్రణాళిక మరియు తిరిగి చెల్లింపు చర్చలకు మద్దతు.',
  'Study and living-cost preparation': 'అధ్యయనం మరియు జీవన వ్యయం తయారీ',
  'Country-aware checklist support for tuition, living loans, student profile, parent details and bank process preparation.': 'ట్యూషన్, లివింగ్ ఫండ్స్, స్టూడెంట్ ప్రొఫైల్, పేరెంట్ వివరాలు మరియు బ్యాంక్ ప్రాసెస్ ప్రిపరేషన్ కోసం దేశం-అవగాహన చెక్‌లిస్ట్ మద్దతు.',
  'Overseas education loans guidance': 'విదేశీ విద్య నిధుల మార్గదర్శకత్వం',
  'Planning support for university expenses, accommodation estimate, travel cost and education-loan repayment assumptions.': 'విశ్వవిద్యాలయ ఖర్చులు, వసతి అంచనా, ప్రయాణ ఖర్చు మరియు విద్య-నిధి తిరిగి చెల్లింపు అంచనాలకు ప్రణాళిక మద్దతు.',
  'Visa loans': 'వీసా నిధులు',
  'EMI plan': 'EMI ప్లాన్',
  'Structured budget discussion': 'నిర్మాణాత్మక బడ్జెట్ చర్చ',
  'Guidance for tuition, blocked-account style loan planning conversations, living cost and supporting documents.': 'ట్యూషన్ కోసం మార్గదర్శకత్వం, బ్లాక్ చేయబడిన ఖాతా శైలి ఫండ్ ప్రణాళిక సంభాషణలు, జీవన వ్యయం మరియు సహాయక పత్రాలు.',
  'Education loan route preparation': 'విద్యా నిధి మార్గం తయారీ',
  'Support for admission-based expense planning, travel estimate and parent/co-applicant document preparation.': 'అడ్మిషన్ ఆధారిత వ్యయ ప్రణాళిక, ప్రయాణ అంచనా మరియు పేరెంట్/సహ-దరఖాస్తుదారుల పత్రాల తయారీకి మద్దతు.',
  'Parent docs': 'మాతృ పత్రాలు',
  'Tuition and living-cost guidance': 'ట్యూషన్ మరియు జీవన వ్యయ మార్గదర్శకత్వం',
  'Planning for course fee, accommodation, local expenses and document checklist before formal discussion with multiple banks.': 'బహుళ బ్యాంకులతో అధికారిక చర్చకు ముందు కోర్సు రుసుము, వసతి, స్థానిక ఖర్చులు మరియు డాక్యుమెంట్ చెక్‌లిస్ట్ కోసం ప్లాన్ చేయడం.',
  'Housing': 'హౌసింగ్',
  'International study planning': 'అంతర్జాతీయ అధ్యయన ప్రణాళిక',
  'Guidance around course cost, living estimate, student documents and loan repayment comfort for families.': 'కోర్సు ఖర్చు, జీవన అంచనా, విద్యార్థి పత్రాలు మరియు కుటుంబాల కోసం ఫండ్ రీపేమెంట్ సౌకర్యం గురించి మార్గదర్శకత్వం.',
  'Course fee': 'కోర్సు రుసుము',
  'Student KYC': 'విద్యార్థి KYC',
  'Near-abroad study support': 'సమీప-విదేశాల అధ్యయనానికి మద్దతు',
  'Focused guidance for fee estimate, accommodation planning, travel and compact documentation for faster preparation.': 'వేగవంతమైన ప్రిపరేషన్ కోసం ఫీజు అంచనా, వసతి ప్రణాళిక, ప్రయాణం మరియు కాంపాక్ట్ డాక్యుమెంటేషన్ కోసం ఫోకస్డ్ గైడెన్స్.',
  'Fee estimate': 'రుసుము అంచనా',
  'Faster Preparation': 'వేగవంతమైన తయారీ',
  'Student loans preparation': 'విద్యార్థి నిధుల తయారీ',
  'Support for admission documents, cost estimate, repayment assumptions and family financial planning discussion.': 'ప్రవేశ పత్రాలు, వ్యయ అంచనా, తిరిగి చెల్లింపు అంచనాలు మరియు కుటుంబ ఆర్థిక ప్రణాళిక చర్చలకు మద్దతు.',
  'Family plan': 'కుటుంబ ప్రణాళిక',
  'Nordic study-cost planning': 'నార్డిక్ అధ్యయనం-వ్యయ ప్రణాళిక',
  'Guidance for tuition, living estimate, travel and academic-document preparation before loan option discussion.': 'ఫండ్ ఎంపిక చర్చకు ముందు ట్యూషన్, జీవన అంచనా, ప్రయాణం మరియు అకడమిక్-డాక్యుమెంట్ తయారీ కోసం మార్గదర్శకత్వం.',
  'Country cards are guidance categories only. Actual loan amount, margin money, collateral, rate and eligibility depend on course, university, multiple bank policies, documents and credit assessment.': 'కంట్రీ కార్డ్‌లు మార్గదర్శక వర్గాలు మాత్రమే. వాస్తవ ఫండ్ మొత్తం, మార్జిన్ మనీ, కొలేటరల్, రేటు మరియు అర్హత కోర్సు, విశ్వవిద్యాలయం, బహుళ బ్యాంక్ పాలసీలు, డాక్యుమెంట్‌లు మరియు క్రెడిట్ అసెస్‌మెంట్‌పై ఆధారపడి ఉంటుంది.',
  'Apply': 'దరఖాస్తు చేసుకోండి',
  'Guidance for insurance options based on personal, family and business needs.': 'వ్యక్తిగత, కుటుంబ మరియు వ్యాపార అవసరాల ఆధారంగా బీమా ఎంపికల కోసం మార్గదర్శకత్వం.',
  'Customers who want clear guidance before choosing insurance options for protection and planning.': 'రక్షణ మరియు ప్రణాళిక కోసం బీమా ఎంపికలను ఎంచుకునే ముందు స్పష్టమైన మార్గదర్శకత్వం కోరుకునే కస్టమర్‌లు.',
  'One-to-one consultation for eligibility, documentation and process clarity.': 'అర్హత, డాక్యుమెంటేషన్ మరియు ప్రాసెస్ క్లారిటీ కోసం వన్-టు-వన్ కన్సల్టేషన్.',
  'Students, parents, salaried customers, business owners and families who need practical loan guidance before applying.': 'విద్యార్థులు, తల్లిదండ్రులు, జీతం తీసుకునే కస్టమర్‌లు, వ్యాపార యజమానులు మరియు దరఖాస్తు చేయడానికి ముందు ఆచరణాత్మక ఫండ్ మార్గదర్శకత్వం అవసరమయ్యే కుటుంబాలు.',
  'Consultation support for customers exploring long-term financial planning options.': 'దీర్ఘకాలిక ఆర్థిక ప్రణాళిక ఎంపికలను అన్వేషించే కస్టమర్‌లకు సంప్రదింపుల మద్దతు.',
  'Mutual loan investments are subject to market risks. Customers should review scheme documents and suitability before investing.': 'మ్యూచువల్ ఫండ్ పెట్టుబడులు మార్కెట్ నష్టాలకు లోబడి ఉంటాయి. కస్టమర్లు పెట్టుబడి పెట్టే ముందు పథకం పత్రాలు మరియు అనుకూలతను సమీక్షించాలి.',
  'Support for customers exploring personal loans options with clear eligibility and documentation guidance.': 'స్పష్టమైన అర్హత మరియు డాక్యుమెంటేషన్ మార్గదర్శకత్వంతో వ్యక్తిగత నిధుల ఎంపికలను అన్వేషించే కస్టమర్‌లకు మద్దతు.',
  'Personal financial needs where a customer wants clarity on process, documentation and suitable options before applying.': 'కస్టమర్ దరఖాస్తు చేసుకునే ముందు ప్రాసెస్, డాక్యుమెంటేషన్ మరియు తగిన ఎంపికలపై స్పష్టత కోరుకునే వ్యక్తిగత ఆర్థిక అవసరాలు.',
  'Guidance for study in India, study abroad, course fee planning, living expenses, parent support and document preparation.': 'భారతదేశం మరియు విదేశాల్లో చదువు, కోర్సు ఫీజు ప్రణాళిక, జీవన ఖర్చులు, తల్లిదండ్రుల సహాయం మరియు పత్రాల సిద్ధతకు మార్గదర్శకం.',
  'Support for salaried customers seeking clarity on eligibility, income proof, EMI planning and suitable personal loans options.': 'వేతన ఉద్యోగులకు అర్హత, ఆదాయ రుజువు, నెలవారీ వాయిదా ప్రణాళిక మరియు సరైన వ్యక్తిగత నిధుల ఎంపికలపై స్పష్టమైన సహాయం.',
  'Consultation for business owners around working capital, expansion needs, banking history and documentation preparation.': 'నడిచే మూలధనం, విస్తరణ అవసరాలు, బ్యాంకు చరిత్ర మరియు పత్రాల సిద్ధతపై వ్యాపార యజమానులకు సంప్రదింపు.',
  'Guidance for purchase, construction, renovation and balance transfer discussions with EMI and property document focus.': 'కొనుగోలు, నిర్మాణం, పునరుద్ధరణ మరియు మిగిలిన రుణ బదిలీ చర్చలకు నెలవారీ వాయిదా మరియు ఆస్తి పత్రాలపై దృష్టితో మార్గదర్శకం.',
  'Goal-based consultation for customers who want to understand horizon, risk, documentation and planning suitability.': 'లక్ష్యం, కాలవ్యవధి, ప్రమాదం, పత్రాలు మరియు ప్రణాళిక సరితూగుదల తెలుసుకోవాలనుకునే కస్టమర్లకు సంప్రదింపు.',
  'Protection guidance for individuals, families and business owners comparing coverage needs and basic policy documents.': 'వ్యక్తులు, కుటుంబాలు మరియు వ్యాపార యజమానులకు కవరేజ్ అవసరాలు మరియు ప్రాథమిక పాలసీ పత్రాలపై రక్షణ మార్గదర్శకం.',
  'Requirement review across multiple loan categories so customers can identify a practical path before formal application.': 'బహుళ లోన్ కేటగిరీలలో రిక్వైర్మెంట్ రివ్యూ కాబట్టి కస్టమర్‌లు అధికారిక దరఖాస్తుకు ముందు ఆచరణాత్మక మార్గాన్ని గుర్తించగలరు.',
  'One-to-one consultation for eligibility discussion, document checklist, repayment planning and next action steps.': 'అర్హత చర్చ, పత్రాల జాబితా, తిరిగి చెల్లింపు ప్రణాళిక మరియు తదుపరి చర్యల కోసం వ్యక్తిగత సంప్రదింపు.',
  'Nidhi Path does not position loan guidance as a one-click promise. The team first understands the customer profile, then checks preparation, explains possible documents, discusses repayment impact and supports the next formal process step.': 'నిధి పథ్ ఫండ్ గైడెన్స్‌ను ఒక క్లిక్ వాగ్దానంగా ఉంచదు. బృందం మొదట కస్టమర్ ప్రొఫైల్‌ను అర్థం చేసుకుంటుంది, ఆపై ప్రిపరేషన్‌ని తనిఖీ చేస్తుంది, సాధ్యమైన పత్రాలను వివరిస్తుంది, తిరిగి చెల్లింపు ప్రభావాన్ని చర్చిస్తుంది మరియు తదుపరి అధికారిక ప్రక్రియ దశకు మద్దతు ఇస్తుంది.',
  'Purpose, amount, urgency, city, income type and applicant profile.': 'ప్రయోజనం, మొత్తం, అత్యవసరం, నగరం, ఆదాయ రకం మరియు దరఖాస్తుదారు ప్రొఫైల్.',
  'Age, income, co-applicant, credit history and document availability.': 'వయస్సు, ఆదాయం, సహ దరఖాస్తుదారు, క్రెడిట్ చరిత్ర మరియు పత్రాల లభ్యత.',
  'EMI, tenure, processing fees, margin money and total repayment estimate.': 'EMI, పదవీకాలం, ప్రాసెసింగ్ ఫీజు, మార్జిన్ మనీ మరియు మొత్తం రీపేమెంట్ అంచనా.',
  'Practical reminders, document gaps and next-phase CRM-prepared lead tracking.': 'ప్రాక్టికల్ రిమైండర్‌లు, డాక్యుమెంట్ గ్యాప్‌లు మరియు తదుపరి దశ CRM-సిద్ధమైన లీడ్ ట్రాకింగ్.',
  'Students and parents get dedicated guidance for domestic and abroad education loans, admission proof, expense schedules and co-applicant preparation.': 'విద్యార్థులు మరియు తల్లిదండ్రులు దేశీయ మరియు విదేశాలలో విద్యా నిధులు, ప్రవేశ రుజువు, ఖర్చు షెడ్యూల్‌లు మరియు సహ-దరఖాస్తుదారుల తయారీ కోసం అంకితమైన మార్గదర్శకత్వం పొందుతారు.',
  'Customers are guided on common documents such as KYC, income proof, bank statements, academic records, business documents and property papers when relevant.': 'KYC, ఆదాయ రుజువు, బ్యాంక్ స్టేట్‌మెంట్‌లు, విద్యాసంబంధ రికార్డులు, వ్యాపార పత్రాలు మరియు ప్రాపర్టీ పేపర్‌లు వంటి సాధారణ పత్రాలపై కస్టమర్‌లు మార్గనిర్దేశం చేయబడతారు.',
  'Loan approval is never promised. We keep the process realistic and explain that final decisions depend on multiple bank policies and verification.': 'రుణ ఆమోదం ఎప్పుడూ హామీ ఇవ్వబడదు. మేము ప్రక్రియను వాస్తవికంగా ఉంచుతాము మరియు తుది నిర్ణయాలు బహుళ బ్యాంక్ విధానాలు మరియు ధృవీకరణపై ఆధారపడి ఉంటాయని వివరిస్తాము.'
});

Object.assign(phraseTranslations.hi, {
  'Phone:': 'फ़ोन:',
  'Email:': 'ईमेल:',
  'Website:': 'वेबसाइट:',
  'Location Map': 'स्थान मानचित्र',
  'Open in Google Maps': 'Google मानचित्र में खोलें',
  'Open Office Map': 'कार्यालय का नक्शा खोलें',
  'Open Route': 'खुला मार्ग',
  'Call +91 97056 82595': '+91 97056 82595 पर कॉल करें',
  'Email the Desk': 'डेस्क को ईमेल करें',
  'Visit Our Office': 'हमारे कार्यालय पर आएं',
  'Vijayawada support point': 'विजयवाड़ा समर्थन बिंदु',
  'Office Hours': 'कार्यालय समय',
  'Support Focus': 'फोकस का समर्थन करें',
  'Fastest response': 'सबसे तेज़ प्रतिक्रिया',
  'Phone support': 'फ़ोन समर्थन',
  'Before You Contact': 'संपर्क करने से पहले',
  'Loan Support Desk': 'फंड सपोर्ट डेस्क',
  'Enquiry Intake': 'पूछताछ सेवन',
  'Full Name': 'पूरा नाम',
  'Phone Number': 'फ़ोन नंबर',
  'Email Address': 'ईमेल पता',
  'City': 'शहर',
  'Service Needed': 'सेवा की आवश्यकता',
  'Approx. Loan Amount': 'लगभग. निधि राशि',
  'Requirement Notes': 'आवश्यकता नोट्स',
  'Send Requirement': 'आवश्यकता भेजें',
  'Enter your full name': 'अपना पूरा नाम दर्ज करें',
  'Your city': 'आपका शहर',
  'Example: INR 25,00,000': 'उदाहरण: INR 25,00,000',
  'Tell us about your admission, loan need, documents, or questions...': 'हमें अपने प्रवेश, निधि की आवश्यकता, दस्तावेज़ों या प्रश्नों के बारे में बताएं...',
  '4th Floor, Prasad Plaza,': 'चौथी मंजिल, प्रसाद प्लाजा,',
  'Brooks Backside Lane,': 'ब्रूक्स बैकसाइड लेन,',
  'Konera Lakshmaya Gari Veedhi,': 'कोनेरा लक्ष्मया गारी विधि,',
  'Near United Telugu Kitchens Restaurant,': 'यूनाइटेड तेलुगु किचन रेस्तरां के पास,',
  '40-3/14-6/4C, Vijayawada,': '40-3/14-6/4सी, विजयवाड़ा,',
  'Andhra Pradesh 520010': 'आंध्र प्रदेश 520010',
  'Vijayawada, Andhra Pradesh': 'विजयवाड़ा, आंध्र प्रदेश',
  'Loan Ventures. All rights reserved. Nidhi Path provides loan guidance and consultation. Loan approval is subject to multiple bank policies, eligibility, documents and credit assessment.': 'फंड वेंचर्स. सर्वाधिकार सुरक्षित। निधि पथ निधि मार्गदर्शन और परामर्श प्रदान करता है। ऋण स्वीकृति कई बैंक नीतियों, पात्रता, दस्तावेजों और क्रेडिट मूल्यांकन के अधीन है।'
});

Object.assign(phraseTranslations.te, {
  'Phone:': 'ఫోన్:',
  'Email:': 'ఇమెయిల్:',
  'Website:': 'వెబ్‌సైట్:',
  'Location Map': 'స్థాన మ్యాప్',
  'Open in Google Maps': 'Google Mapsలో తెరవండి',
  'Open Office Map': 'ఆఫీస్ మ్యాప్‌ని తెరవండి',
  'Open Route': 'మార్గాన్ని తెరవండి',
  'Call +91 97056 82595': 'కాల్ +91 97056 82595',
  'Email the Desk': 'డెస్క్‌కి ఇమెయిల్ చేయండి',
  'Visit Our Office': 'మా కార్యాలయాన్ని సందర్శించండి',
  'Vijayawada support point': 'విజయవాడ సపోర్టు పాయింట్',
  'Office Hours': 'ఆఫీసు వేళలు',
  'Support Focus': 'మద్దతు ఫోకస్',
  'Fastest response': 'వేగవంతమైన ప్రతిస్పందన',
  'Phone support': 'ఫోన్ మద్దతు',
  'Before You Contact': 'మీరు సంప్రదించడానికి ముందు',
  'Loan Support Desk': 'ఫండ్ సపోర్ట్ డెస్క్',
  'Enquiry Intake': 'విచారణ తీసుకోవడం',
  'Full Name': 'పూర్తి పేరు',
  'Phone Number': 'ఫోన్ నంబర్',
  'Email Address': 'ఇమెయిల్ చిరునామా',
  'City': 'నగరం',
  'Service Needed': 'సేవ అవసరం',
  'Approx. Loan Amount': 'సుమారు ఫండ్ మొత్తం',
  'Requirement Notes': 'ఆవశ్యక గమనికలు',
  'Send Requirement': 'అవసరం పంపండి',
  'Enter your full name': 'మీ పూర్తి పేరును నమోదు చేయండి',
  'Your city': 'మీ నగరం',
  'Example: INR 25,00,000': 'ఉదాహరణ: INR 25,00,000',
  'Tell us about your admission, loan need, documents, or questions...': 'మీ అడ్మిషన్, ఫండ్ అవసరం, పత్రాలు లేదా ప్రశ్నల గురించి మాకు చెప్పండి...',
  '4th Floor, Prasad Plaza,': '4వ అంతస్తు, ప్రసాద్ ప్లాజా,',
  'Brooks Backside Lane,': 'బ్రూక్స్ బ్యాక్‌సైడ్ లేన్,',
  'Konera Lakshmaya Gari Veedhi,': 'కోనేర లక్ష్మయ్య గారి వీధి,',
  'Near United Telugu Kitchens Restaurant,': 'యునైటెడ్ తెలుగు కిచెన్స్ రెస్టారెంట్ దగ్గర,',
  '40-3/14-6/4C, Vijayawada,': '40-3/14-6/4C, విజయవాడ,',
  'Andhra Pradesh 520010': 'ఆంధ్రప్రదేశ్ 520010',
  'Vijayawada, Andhra Pradesh': 'విజయవాడ, ఆంధ్రప్రదేశ్',
  'Loan Ventures. All rights reserved. Nidhi Path provides loan guidance and consultation. Loan approval is subject to multiple bank policies, eligibility, documents and credit assessment.': 'ఫండ్ వెంచర్లు. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి. నిధి పథ్ ఫండ్ మార్గదర్శకత్వం మరియు సంప్రదింపులను అందిస్తుంది. లోన్ ఆమోదం బహుళ బ్యాంక్ పాలసీలు, అర్హత, పత్రాలు మరియు క్రెడిట్ అసెస్‌మెంట్‌కు లోబడి ఉంటుంది.'
});

Object.assign(phraseTranslations.hi, {
  'EMI': 'EMI',
  'Docs': 'दस्तावेज़',
  'KYC': 'KYC',
  'multiple banks': 'कई बैंक',
  'CRM': 'CRM',
  'Eligibility is easier to understand when applicants can see the role of admission proof, income, co-applicant documents, bank statements and repayment comfort together.': 'पात्रता को समझना तब आसान हो जाता है जब आवेदक प्रवेश प्रमाण, आय, सह-आवेदक दस्तावेज़, बैंक विवरण और पुनर्भुगतान सुविधा की भूमिका को एक साथ देख सकते हैं।',
  'estimate planning': 'अनुमान योजना',
  'preparation review': 'तैयारी की समीक्षा',
  'basic review': 'बुनियादी समीक्षा',
  'need sorting': 'छँटाई की जरूरत है',
  'preparation view': 'तैयारी का दृश्य',
  'next-step plan': 'अगले चरण की योजना',
  'Student proof': 'छात्र प्रमाण',
  'Admission, fee and academic documents': 'प्रवेश, शुल्क और शैक्षणिक दस्तावेज',
  'Parent or guardian profile preparation': 'माता-पिता या अभिभावक प्रोफ़ाइल तैयार करना',
  'Salary, business or bank statement support': 'वेतन, व्यवसाय या बैंक स्टेटमेंट समर्थन',
  'Tenure and EMI estimate discussion': 'कार्यकाल और ईएमआई अनुमान पर चर्चा',
  'Customers who are unsure can visually compare education, personal, business, home and other requirements before selecting a suitable support path.': 'जो ग्राहक अनिश्चित हैं वे उपयुक्त समर्थन पथ का चयन करने से पहले शिक्षा, व्यक्तिगत, व्यवसाय, घर और अन्य आवश्यकताओं की तुलना कर सकते हैं।',
  'Purpose': 'प्रयोजन',
  'What the money is for': 'पैसा किस लिए है',
  'Income, city and documents': 'आय, शहर और दस्तावेज़',
  'Match': 'मिलान',
  'Possible support route': 'संभावित समर्थन मार्ग',
  'Enquiry': 'पूछताछ',
  'Move to dedicated page': 'समर्पित पृष्ठ पर जाएँ',
  'Route': 'मार्ग',
  'Profile': 'प्रोफाइल',
  'Action': 'कार्रवाई',
  'profile review': 'प्रोफ़ाइल समीक्षा',
  'comfort check': 'आराम की जांच',
  'KYC basics': 'केवाईसी मूल बातें',
  'business need': 'व्यवसाय की आवश्यकता',
  'statement view': 'कथन दृश्य',
  'ITR/GST basics': 'आईटीआर/जीएसटी मूल बातें',
  'Long-term repayment planning': 'दीर्घकालिक पुनर्भुगतान योजना',
  'Loans route discussion': 'फंडिंग रूट पर चर्चा',
  'requirement': 'आवश्यकता',
  'preparation': 'तैयारी',
  'next action': 'अगली कार्रवाई',
  'Profile and document gaps': 'प्रोफ़ाइल और दस्तावेज़ में कमियाँ',
  'EMI and tenure comfort': 'ईएमआई और कार्यकाल की सुविधा',
  'Action plan for follow-up': 'अनुवर्ती कार्रवाई के लिए कार्य योजना'
});

Object.assign(phraseTranslations.te, {
  'EMI': 'EMI',
  'Docs': 'పత్రాలు',
  'KYC': 'KYC',
  'multiple banks': 'అనేక బ్యాంకులు',
  'CRM': 'CRM',
  'Eligibility is easier to understand when applicants can see the role of admission proof, income, co-applicant documents, bank statements and repayment comfort together.': 'దరఖాస్తుదారులు అడ్మిషన్ ప్రూఫ్, ఆదాయం, సహ-దరఖాస్తుదారు పత్రాలు, బ్యాంక్ స్టేట్‌మెంట్‌లు మరియు రీపేమెంట్ సౌకర్యం యొక్క పాత్రను చూడగలిగినప్పుడు అర్హతను సులభంగా అర్థం చేసుకోవచ్చు.',
  'estimate planning': 'అంచనా ప్రణాళిక',
  'preparation review': 'తయారీ సమీక్ష',
  'basic review': 'ప్రాథమిక సమీక్ష',
  'need sorting': 'క్రమబద్ధీకరణ అవసరం',
  'preparation view': 'తయారీ వీక్షణ',
  'next-step plan': 'తదుపరి దశ ప్రణాళిక',
  'Student proof': 'విద్యార్థి రుజువు',
  'Admission, fee and academic documents': 'అడ్మిషన్, ఫీజు మరియు విద్యా పత్రాలు',
  'Parent or guardian profile preparation': 'తల్లిదండ్రులు లేదా సంరక్షకుల ప్రొఫైల్ తయారీ',
  'Salary, business or bank statement support': 'జీతం, వ్యాపారం లేదా బ్యాంక్ స్టేట్‌మెంట్ మద్దతు',
  'Tenure and EMI estimate discussion': 'పదవీకాలం మరియు EMI అంచనా చర్చ',
  'Customers who are unsure can visually compare education, personal, business, home and other requirements before selecting a suitable support path.': 'ఖచ్చితంగా తెలియని కస్టమర్‌లు తగిన మద్దతు మార్గాన్ని ఎంచుకునే ముందు విద్య, వ్యక్తిగత, వ్యాపారం, ఇల్లు మరియు ఇతర అవసరాలను దృశ్యమానంగా సరిపోల్చవచ్చు.',
  'Purpose': 'ప్రయోజనం',
  'What the money is for': 'డబ్బు దేనికి',
  'Income, city and documents': 'ఆదాయం, నగరం మరియు పత్రాలు',
  'Match': 'మ్యాచ్',
  'Possible support route': 'సాధ్యమైన మద్దతు మార్గం',
  'Enquiry': 'విచారణ',
  'Move to dedicated page': 'అంకితమైన పేజీకి తరలించండి',
  'Route': 'మార్గం',
  'Profile': 'ప్రొఫైల్',
  'Action': 'చర్య',
  'profile review': 'ప్రొఫైల్ సమీక్ష',
  'comfort check': 'సౌకర్యం తనిఖీ',
  'KYC basics': 'KYC ప్రాథమిక అంశాలు',
  'business need': 'వ్యాపార అవసరం',
  'statement view': 'ప్రకటన వీక్షణ',
  'ITR/GST basics': 'ITR/GST బేసిక్స్',
  'Long-term repayment planning': 'దీర్ఘకాలిక రీపేమెంట్ ప్లానింగ్',
  'Loans route discussion': 'నిధుల మార్గం చర్చ',
  'requirement': 'అవసరం',
  'preparation': 'తయారీ',
  'next action': 'తదుపరి చర్య',
  'Profile and document gaps': 'ప్రొఫైల్ మరియు డాక్యుమెంట్ ఖాళీలు',
  'EMI and tenure comfort': 'EMI మరియు పదవీకాలం సౌకర్యం',
  'Action plan for follow-up': 'ఫాలో-అప్ కోసం కార్యాచరణ ప్రణాళిక'
});

Object.assign(phraseTranslations.hi, {
  'Nidhi Path': 'निधि पथ',
  'Trust': 'भरोसा रखें',
  'Support': 'समर्थन',
  'Local': 'स्थानीय',
  'clear conversations': 'स्पष्ट बातचीत',
  'student and family focus': 'छात्र और परिवार का ध्यान',
  'Vijayawada office': 'विजयवाड़ा कार्यालय',
  'Nidhi Path is positioned as a practical support desk where customers can understand documents, eligibility, repayment and formal process expectations before they move ahead.': 'निधि पथ को एक व्यावहारिक सहायता डेस्क के रूप में तैनात किया गया है जहां ग्राहक आगे बढ़ने से पहले दस्तावेजों, पात्रता, पुनर्भुगतान और औपचारिक प्रक्रिया अपेक्षाओं को समझ सकते हैं।',
  'Explain options in plain language': 'विकल्पों को सरल भाषा में समझाइये',
  'Organize documents before processing': 'प्रसंस्करण से पहले दस्तावेज़ व्यवस्थित करें',
  'Support customer follow-up': 'ग्राहक फॉलो-अप का समर्थन करें',
  'Ready for digital tracking later': 'बाद में डिजिटल ट्रैकिंग के लिए तैयार',
  'Loan customers often face the same problems: unclear eligibility, scattered documents, confusing repayment terms and uncertainty about which option suits their profile.': 'फंड ग्राहकों को अक्सर समान समस्याओं का सामना करना पड़ता है: अस्पष्ट पात्रता, बिखरे हुए दस्तावेज़, भ्रमित करने वाली पुनर्भुगतान शर्तें और अनिश्चितता कि कौन सा विकल्प उनकी प्रोफ़ाइल के लिए उपयुक्त है।',
  'Nidhi Path works as a guidance partner, helping clients understand requirements, prepare documents and move forward with a practical application plan.': 'निधि पथ एक मार्गदर्शन भागीदार के रूप में काम करता है, जो ग्राहकों को आवश्यकताओं को समझने, दस्तावेज़ तैयार करने और व्यावहारिक अनुप्रयोग योजना के साथ आगे बढ़ने में मदद करता है।',
  'Loan customers often face the same problems: unclear eligibility, scattered documents, confusing repayment terms and uncertainty about which option suits their profile. Nidhi Path works as a guidance partner, helping clients understand requirements, prepare documents and move forward with a practical application plan.': 'फंड ग्राहकों को अक्सर समान समस्याओं का सामना करना पड़ता है: अस्पष्ट पात्रता, बिखरे हुए दस्तावेज़, भ्रमित करने वाली पुनर्भुगतान शर्तें और अनिश्चितता कि कौन सा विकल्प उनकी प्रोफ़ाइल के लिए उपयुक्त है। निधि पथ एक मार्गदर्शन भागीदार के रूप में काम करता है, जो ग्राहकों को आवश्यकताओं को समझने, दस्तावेज़ तैयार करने और व्यावहारिक अनुप्रयोग योजना के साथ आगे बढ़ने में मदद करता है।',
  'Digital expansion': 'डिजिटल विस्तार',
  'The website is structured for next-phase CRM, customer login, staff login, document upload and application status tracking.': 'वेबसाइट अगले चरण के सीआरएम, ग्राहक लॉगिन, स्टाफ लॉगिन, दस्तावेज़ अपलोड और एप्लिकेशन स्थिति ट्रैकिंग के लिए संरचित है।'
});

Object.assign(phraseTranslations.te, {
  'Nidhi Path': 'నిధి పథ్',
  'Trust': 'నమ్మండి',
  'Support': 'మద్దతు',
  'Local': 'స్థానిక',
  'clear conversations': 'స్పష్టమైన సంభాషణలు',
  'student and family focus': 'విద్యార్థి మరియు కుటుంబ దృష్టి',
  'Vijayawada office': 'విజయవాడ కార్యాలయం',
  'Nidhi Path is positioned as a practical support desk where customers can understand documents, eligibility, repayment and formal process expectations before they move ahead.': 'నిధి పథ్ ప్రాక్టికల్ సపోర్ట్ డెస్క్‌గా ఉంచబడింది, ఇక్కడ కస్టమర్‌లు ముందుకు వెళ్లడానికి ముందు డాక్యుమెంట్‌లు, అర్హత, రీపేమెంట్ మరియు అధికారిక ప్రక్రియ అంచనాలను అర్థం చేసుకోగలరు.',
  'Explain options in plain language': 'సాదా భాషలో ఎంపికలను వివరించండి',
  'Organize documents before processing': 'ప్రాసెస్ చేయడానికి ముందు పత్రాలను నిర్వహించండి',
  'Support customer follow-up': 'కస్టమర్ ఫాలో-అప్‌కు మద్దతు ఇవ్వండి',
  'Ready for digital tracking later': 'తర్వాత డిజిటల్ ట్రాకింగ్ కోసం సిద్ధంగా ఉంది',
  'Loan customers often face the same problems: unclear eligibility, scattered documents, confusing repayment terms and uncertainty about which option suits their profile.': 'ఫండ్ కస్టమర్‌లు తరచూ అదే సమస్యలను ఎదుర్కొంటారు: అస్పష్టమైన అర్హత, చెల్లాచెదురుగా ఉన్న పత్రాలు, గందరగోళంగా ఉన్న రీపేమెంట్ నిబంధనలు మరియు వారి ప్రొఫైల్‌కు ఏ ఎంపిక సరిపోతుందో అనిశ్చితి.',
  'Nidhi Path works as a guidance partner, helping clients understand requirements, prepare documents and move forward with a practical application plan.': 'నిధి పథ్ మార్గదర్శక భాగస్వామిగా పని చేస్తుంది, క్లయింట్‌లు అవసరాలను అర్థం చేసుకోవడానికి, పత్రాలను సిద్ధం చేయడానికి మరియు ఆచరణాత్మక అప్లికేషన్ ప్లాన్‌తో ముందుకు సాగడానికి సహాయపడుతుంది.',
  'Loan customers often face the same problems: unclear eligibility, scattered documents, confusing repayment terms and uncertainty about which option suits their profile. Nidhi Path works as a guidance partner, helping clients understand requirements, prepare documents and move forward with a practical application plan.': 'ఫండ్ కస్టమర్‌లు తరచూ అదే సమస్యలను ఎదుర్కొంటారు: అస్పష్టమైన అర్హత, చెల్లాచెదురుగా ఉన్న పత్రాలు, గందరగోళంగా ఉన్న రీపేమెంట్ నిబంధనలు మరియు వారి ప్రొఫైల్‌కు ఏ ఎంపిక సరిపోతుందో అనిశ్చితి. నిధి పథ్ మార్గదర్శక భాగస్వామిగా పని చేస్తుంది, క్లయింట్‌లు అవసరాలను అర్థం చేసుకోవడానికి, పత్రాలను సిద్ధం చేయడానికి మరియు ఆచరణాత్మక అప్లికేషన్ ప్లాన్‌తో ముందుకు సాగడానికి సహాయపడుతుంది.',
  'Digital expansion': 'డిజిటల్ విస్తరణ',
  'The website is structured for next-phase CRM, customer login, staff login, document upload and application status tracking.': 'వెబ్‌సైట్ తదుపరి దశ CRM, కస్టమర్ లాగిన్, స్టాఫ్ లాగిన్, డాక్యుమెంట్ అప్‌లోడ్ మరియు అప్లికేషన్ స్టేటస్ ట్రాకింగ్ కోసం రూపొందించబడింది.'
});

Object.assign(phraseTranslations.hi, {
  'Admission, course fee and family preparation': 'प्रवेश, पाठ्यक्रम शुल्क और पारिवारिक तैयारी',
  'Personal loans and repayment comfort': 'व्यक्तिगत वित्त पोषण और पुनर्भुगतान सुविधा',
  'Working capital and documentation': 'कार्यशील पूंजी और दस्तावेज़ीकरण',
  'Insurance and long-term planning': 'बीमा और दीर्घकालिक योजना',
  'Documents to keep ready': 'दस्तावेज़ तैयार रखें',
  'Guidance Flow': 'मार्गदर्शन प्रवाह',
  'How this service moves forward': 'ये सेवा कैसे आगे बढ़ती है',
  'Education': 'शिक्षा',
  'Income': 'आय',
  'Business': 'व्यवसायी',
  'Protection': 'सुरक्षा',
  'EMI': 'EMI',
  'KYC': 'KYC',
  'multiple banks': 'कई बैंक',
  'CRM': 'CRM',
  'Login': 'लॉगिन',
  'Customer Login': 'ग्राहक लॉगिन',
  'Staff Login': 'कर्मचारी लॉगिन',
  'Admin Login': 'प्रशासन लॉगिन',
  'customer login': 'ग्राहक लॉगिन',
  'staff login': 'स्टाफ लॉगिन',
  'Please enter valid positive numbers for all fields.': 'कृपया सभी क्षेत्रों के लिए मान्य सकारात्मक संख्याएँ दर्ज करें।',
  'Thank you': 'धन्यवाद',
  'Your request for': 'के लिए आपका अनुरोध',
  'has been submitted.': 'प्रस्तुत कर दिया गया है.',
  'We have received your message and will get back to you soon.': 'हमें आपका संदेश मिल गया है और हम जल्द ही आपसे संपर्क करेंगे।'
});

Object.assign(phraseTranslations.te, {
  'Admission, course fee and family preparation': 'అడ్మిషన్, కోర్సు ఫీజు మరియు కుటుంబ తయారీ',
  'Personal loans and repayment comfort': 'వ్యక్తిగత నిధులు మరియు తిరిగి చెల్లింపు సౌకర్యం',
  'Working capital and documentation': 'వర్కింగ్ క్యాపిటల్ మరియు డాక్యుమెంటేషన్',
  'Insurance and long-term planning': 'బీమా మరియు దీర్ఘకాలిక ప్రణాళిక',
  'Documents to keep ready': 'సిద్ధంగా ఉంచాల్సిన పత్రాలు',
  'Guidance Flow': 'మార్గదర్శక ప్రవాహం',
  'How this service moves forward': 'ఈ సేవ ఎలా ముందుకు సాగుతుంది',
  'Education': 'విద్య',
  'Income': 'ఆదాయం',
  'Business': 'వ్యాపారి',
  'Protection': 'రక్షణ',
  'EMI': 'EMI',
  'KYC': 'KYC',
  'multiple banks': 'అనేక బ్యాంకులు',
  'CRM': 'CRM',
  'Login': 'ప్రవేశం',
  'Customer Login': 'కస్టమర్ లాగిన్',
  'Staff Login': 'సిబ్బంది లాగిన్',
  'Admin Login': 'నిర్వాహక లాగిన్',
  'customer login': 'కస్టమర్ లాగిన్',
  'staff login': 'సిబ్బంది లాగిన్',
  'Please enter valid positive numbers for all fields.': 'దయచేసి అన్ని ఫీల్డ్‌లకు చెల్లుబాటు అయ్యే సానుకూల సంఖ్యలను నమోదు చేయండి.',
  'Thank you': 'ధన్యవాదాలు',
  'Your request for': 'మీ అభ్యర్థన',
  'has been submitted.': 'సమర్పించబడింది.',
  'We have received your message and will get back to you soon.': 'మేము మీ సందేశాన్ని స్వీకరించాము మరియు త్వరలో మిమ్మల్ని సంప్రదిస్తాము.'
});

Object.assign(phraseTranslations.hi, {
  'Nidhi Path Education Loan Assistance': 'निधि पथ शिक्षा फंड सहायता',
  'About Us | Nidhi Path Loan Ventures': 'हमारे बारे में | निधि पथ फंड वेंचर्स',
  'Services | Nidhi Path Loan Ventures': 'सेवाएं | निधि पथ फंड वेंचर्स',
  'Eligibility | Nidhi Path Loan Ventures': 'पात्रता | निधि पथ फंड वेंचर्स',
  'Contact Us | Nidhi Path Loan Ventures': 'संपर्क करें | निधि पथ फंड वेंचर्स',
  'Login | Nidhi Path Loan Ventures': 'लॉगिन | निधि पथ फंड वेंचर्स',
  'Education Loan | Nidhi Path Loan Ventures': 'शिक्षा ऋण | निधि पथ फंड वेंचर्स',
  'Personal Loan | Nidhi Path Loan Ventures': 'व्यक्तिगत ऋण | निधि पथ फंड वेंचर्स',
  'Business Loan | Nidhi Path Loan Ventures': 'व्यवसाय ऋण | निधि पथ फंड वेंचर्स',
  'Home Loan | Nidhi Path Loan Ventures': 'गृह ऋण | निधि पथ फंड वेंचर्स',
  'Mutual Funds | Nidhi Path Loan Ventures': 'म्यूचुअल फंड | निधि पथ फंड वेंचर्स',
  'Insurance | Nidhi Path Loan Ventures': 'बीमा | निधि पथ फंड वेंचर्स',
  'All Types of Loans | Nidhi Path Loan Ventures': 'सभी प्रकार के ऋण | निधि पथ फंड वेंचर्स',
  'Loan Consultation | Nidhi Path Loan Ventures': 'ऋण परामर्श | निधि पथ फंड वेंचर्स',
  'Nidhi Path logo': 'निधि पथ लोगो',
  'Nidhi Path Loan Ventures logo': 'निधि पथ फंड वेंचर्स लोगो',
  'Nidhi Path Loan Ventures office map': 'निधि पथ फंड वेंचर्स कार्यालय मानचित्र',
  'Menu': 'मेनू',
  'Apply Now': 'अभी आवेदन करें',
  'Nidhi Path Loan Ventures helps students and families plan education loans for higher studies in India and abroad. The platform focuses on admission-based loans, college fee financing, co-applicant preparation, document preparation and bank education loan assistance. The purpose is simple: reduce confusion, compare suitable options and help every student move toward formal application with clarity.': 'निधि पथ फंड वेंचर्स छात्रों और परिवारों को भारत और विदेश में उच्च शिक्षा के लिए शिक्षा फंडिंग की योजना बनाने में मदद करता है। प्लेटफॉर्म प्रवेश-आधारित फंडिंग, कॉलेज फीस वित्तपोषण, सह-आवेदक तैयारी, दस्तावेज तैयारी और बैंक शिक्षा फंड सहायता पर केंद्रित है। उद्देश्य सरल है: भ्रम कम करना, उपयुक्त विकल्पों की तुलना करना और हर छात्र को स्पष्टता के साथ औपचारिक आवेदन की ओर बढ़ने में मदद करना।',
  'Education loan approval depends on bank policy, admission details, eligibility, documents, co-applicant profile and verification. Nidhi Path keeps the process transparent and helps students prepare better before submission.': 'शिक्षा फंड की मंजूरी बैंक नीति, प्रवेश विवरण, पात्रता, दस्तावेज, सह-आवेदक प्रोफाइल और सत्यापन पर निर्भर करती है। निधि पथ प्रक्रिया को पारदर्शी रखता है और छात्रों को जमा करने से पहले बेहतर तैयारी में मदद करता है।',
  'Education loans involve admission proof, course expenses, co-applicant details, repayment planning and bank-specific documentation. We help families organize every discussion before they approach the formal loan process.': 'शिक्षा फंडिंग में प्रवेश प्रमाण, कोर्स खर्च, सह-आवेदक विवरण, पुनर्भुगतान योजना और बैंक-विशिष्ट दस्तावेज शामिल होते हैं। हम परिवारों को औपचारिक फंड प्रक्रिया से पहले हर चर्चा व्यवस्थित करने में मदद करते हैं।',
  'Students and parents use our education loan assistance to understand eligibility, compare bank options, prepare documents and move confidently toward college fee financing.': 'छात्र और अभिभावक पात्रता समझने, बैंक विकल्पों की तुलना करने, दस्तावेज तैयार करने और कॉलेज फीस वित्तपोषण की ओर आत्मविश्वास से बढ़ने के लिए हमारी शिक्षा फंड सहायता का उपयोग करते हैं।',
  'The team explained co-applicant requirements, income documents and repayment planning clearly, which made the education loan process less stressful.': 'टीम ने सह-आवेदक आवश्यकताएं, आय दस्तावेज और पुनर्भुगतान योजना स्पष्ट रूप से समझाई, जिससे शिक्षा फंड प्रक्रिया कम तनावपूर्ण लगी।',
  'Nidhi Path helped my family understand study abroad loan options, living cost estimates and document preparation before my university deadline.': 'निधि पथ ने मेरे परिवार को विश्वविद्यालय की समय-सीमा से पहले विदेश अध्ययन फंड विकल्प, जीवन-यापन खर्च अनुमान और दस्तावेज तैयारी समझने में मदद की।',
  'The purpose is simple: reduce confusion, compare suitable options and help every student move toward formal application with clarity.': 'उद्देश्य सरल है: भ्रम कम करना, उपयुक्त विकल्पों की तुलना करना और हर छात्र को स्पष्टता के साथ औपचारिक आवेदन की ओर बढ़ाना।',
  'I received guidance for college fee financing, eligibility checks and bank comparison without confusing promises.': 'मुझे बिना भ्रमित करने वाले वादों के कॉलेज फीस वित्तपोषण, पात्रता जांच और बैंक तुलना पर मार्गदर्शन मिला।',
  'We understood the difference between tuition, living expenses and margin money before selecting an education loan route.': 'शिक्षा फंड मार्ग चुनने से पहले हमने ट्यूशन, जीवन-यापन खर्च और मार्जिन मनी का अंतर समझा।',
  'The counseling helped me prepare academic records, KYC, income proof and travel-cost estimates for my loan discussion.': 'परामर्श ने मुझे फंड चर्चा के लिए शैक्षणिक रिकॉर्ड, KYC, आय प्रमाण और यात्रा खर्च अनुमान तैयार करने में मदद की।',
  'The admission letter, fee schedule and EMI planning were organized in one place before approaching the bank.': 'बैंक से संपर्क करने से पहले प्रवेश पत्र, फीस शेड्यूल और EMI योजना एक जगह व्यवस्थित की गई।',
  'Share your admission, course fee and study destination details. Our team will guide you with the next practical step.': 'अपना प्रवेश, कोर्स फीस और अध्ययन गंतव्य विवरण साझा करें। हमारी टीम आपको अगले व्यावहारिक कदम में मार्गदर्शन देगी।',
  'Guidance for approved Indian colleges, course fees, academic records and parent or guardian preparation.': 'मान्यता प्राप्त भारतीय कॉलेजों, कोर्स फीस, शैक्षणिक रिकॉर्ड और माता-पिता या अभिभावक तैयारी के लिए मार्गदर्शन।',
  'Profile review for course, admission, co-applicant strength, documents and repayment comfort.': 'कोर्स, प्रवेश, सह-आवेदक मजबूती, दस्तावेज और पुनर्भुगतान सुविधा की प्रोफाइल समीक्षा।',
  'Support for admission letters, living cost planning, travel expenses and collateral preparation where required.': 'जहां आवश्यक हो, प्रवेश पत्र, जीवन-यापन खर्च योजना, यात्रा खर्च और कोलेटरल तैयारी के लिए सहायता।',
  'Tuition, travel, books, equipment and living expenses are arranged into a clear estimate.': 'ट्यूशन, यात्रा, पुस्तकें, उपकरण और जीवन-यापन खर्च को स्पष्ट अनुमान में व्यवस्थित किया जाता है।',
  'Students and parents receive timely reminders for document gaps, bank updates and next-step preparation.': 'छात्रों और अभिभावकों को दस्तावेज कमियों, बैंक अपडेट और अगले कदम की तैयारी के लिए समय पर याद दिलाया जाता है।',
  'KYC, academics, bank statements, income proof and fee schedules are organized.': 'KYC, शैक्षणिक रिकॉर्ड, बैंक स्टेटमेंट, आय प्रमाण और फीस शेड्यूल व्यवस्थित किए जाते हैं।',
  'Parents and guardians understand their role, documents and repayment comfort.': 'माता-पिता और अभिभावक अपनी भूमिका, दस्तावेज और पुनर्भुगतान सुविधा समझते हैं।',
  'Families can understand approximate monthly commitment before formal processing.': 'परिवार औपचारिक प्रक्रिया से पहले अनुमानित मासिक प्रतिबद्धता समझ सकते हैं।',
  'We help students and parents understand education-loan possibilities with calm, practical consultation. From study abroad loans discussions to documentation, EMI awareness, co-applicant preparation and multiple bank guidance, our work is built around trust, clarity and responsible financial decisions.': 'हम छात्रों और अभिभावकों को शांत, व्यावहारिक परामर्श के साथ शिक्षा फंड संभावनाएं समझने में मदद करते हैं। विदेश अध्ययन फंड चर्चा से लेकर दस्तावेज, EMI जागरूकता, सह-आवेदक तैयारी और कई बैंक मार्गदर्शन तक, हमारा काम भरोसे, स्पष्टता और जिम्मेदार वित्तीय निर्णयों पर आधारित है।',
  'Nidhi Path Loan Ventures provides guidance and consultation. Loan approval, rate, amount, charges and disbursement are subject to multiple bank policies, eligibility, credit assessment, documentation and verification.': 'निधि पथ फंड वेंचर्स मार्गदर्शन और परामर्श प्रदान करता है। फंड मंजूरी, दर, राशि, शुल्क और वितरण कई बैंक नीतियों, पात्रता, क्रेडिट मूल्यांकन, दस्तावेज और सत्यापन के अधीन हैं।',
  'Nidhi Path guided me throughout my abroad education loan process. Their transparent consultation and documentation support helped me move ahead confidently.': 'निधि पथ ने मेरी पूरी विदेश शिक्षा फंड प्रक्रिया में मार्गदर्शन दिया। उनके पारदर्शी परामर्श और दस्तावेज सहायता ने मुझे आत्मविश्वास से आगे बढ़ने में मदद की।',
  'The consultation was transparent about bank policies and timelines. My family trusted the process because expectations were clear.': 'परामर्श बैंक नीतियों और समय-सीमा के बारे में पारदर्शी था। अपेक्षाएं स्पष्ट होने के कारण मेरे परिवार ने प्रक्रिया पर भरोसा किया।',
  'I received a clear checklist for admission loans and blocked-account related expense discussions. The process felt more manageable.': 'मुझे प्रवेश फंडिंग और ब्लॉक्ड-अकाउंट संबंधित खर्च चर्चाओं के लिए स्पष्ट चेकलिस्ट मिली। प्रक्रिया अधिक संभालने योग्य लगी।',
  'My consultation covered tuition, living expenses and EMI comfort. The guidance made our study abroad financing plan feel organized.': 'मेरे परामर्श में ट्यूशन, जीवन-यापन खर्च और EMI सुविधा शामिल थे। मार्गदर्शन से हमारी विदेश अध्ययन वित्त योजना व्यवस्थित लगी।',
  'The documentation support was excellent. We knew what to prepare, what gaps to fix and how to approach the next conversation.': 'दस्तावेज सहायता उत्कृष्ट थी। हमें पता था क्या तैयार करना है, कौन सी कमियां ठीक करनी हैं और अगली बातचीत कैसे करनी है।',
  'The team helped my parents understand co-applicant documents, repayment planning and possible bank routes before we applied.': 'टीम ने आवेदन से पहले मेरे माता-पिता को सह-आवेदक दस्तावेज, पुनर्भुगतान योजना और संभावित बैंक मार्ग समझने में मदद की।',
  'From counseling to loans-preparation guidance, Nidhi Path kept the conversation student-first and practical for my family.': 'काउंसलिंग से लेकर फंडिंग-तैयारी मार्गदर्शन तक, निधि पथ ने मेरे परिवार के लिए बातचीत को छात्र-प्रथम और व्यावहारिक रखा।',
  'Nidhi Path explained multiple bank consultation options and helped us prepare financial documents before the visa timeline.': 'निधि पथ ने कई बैंक परामर्श विकल्प समझाए और वीजा समय-सीमा से पहले वित्तीय दस्तावेज तैयार करने में हमारी मदद की।',
  'Students get patient guidance across admission loans, country planning, study expenses and loans-preparation conversations.': 'छात्रों को प्रवेश फंडिंग, देश योजना, अध्ययन खर्च और फंडिंग-तैयारी बातचीत में धैर्यपूर्ण मार्गदर्शन मिलता है।',
  'We listen to the student goal first, then discuss loans possibilities, affordability and responsible repayment planning.': 'हम पहले छात्र लक्ष्य सुनते हैं, फिर फंडिंग संभावनाएं, सामर्थ्य और जिम्मेदार पुनर्भुगतान योजना पर चर्चा करते हैं।',
  'We support repeated discussions so families can clarify documents, repayment comfort, bank options and timeline expectations.': 'हम बार-बार चर्चा का समर्थन करते हैं ताकि परिवार दस्तावेज, पुनर्भुगतान सुविधा, बैंक विकल्प और समय-सीमा अपेक्षाएं स्पष्ट कर सकें।',
  'Families receive clear document checklists for KYC, income proof, admission letters, fee structure and co-applicant papers.': 'परिवारों को KYC, आय प्रमाण, प्रवेश पत्र, फीस संरचना और सह-आवेदक कागजात के लिए स्पष्ट दस्तावेज चेकलिस्ट मिलती है।',
  'We explain the loan path, possible document needs, repayment basics and application steps in customer-friendly language.': 'हम फंड मार्ग, संभावित दस्तावेज जरूरतें, पुनर्भुगतान मूल बातें और आवेदन चरण ग्राहक-हितैषी भाषा में समझाते हैं।',
  'Nidhi Path Loan Ventures supports families with structured education-loan consultation, abroad-study loans preparation, document clarity, EMI planning and responsible bank process guidance. The goal is simple: make every education loans conversation calm, transparent and well prepared.': 'निधि पथ फंड वेंचर्स परिवारों को संरचित शिक्षा फंड परामर्श, विदेश अध्ययन फंड तैयारी, दस्तावेज स्पष्टता, EMI योजना और जिम्मेदार बैंक प्रक्रिया मार्गदर्शन के साथ सहायता करता है। लक्ष्य सरल है: हर शिक्षा फंडिंग बातचीत को शांत, पारदर्शी और अच्छी तरह तैयार बनाना।',
  'Families receive clear discussions on eligibility, documents, bank policies, cost expectations and next steps without unrealistic approval promises.': 'परिवारों को अवास्तविक मंजूरी वादों के बिना पात्रता, दस्तावेज, बैंक नीतियां, लागत अपेक्षाएं और अगले कदमों पर स्पष्ट चर्चा मिलती है।',
  'From admission proof to expense estimates, we help students understand the loans journey before formal bank processing begins.': 'प्रवेश प्रमाण से खर्च अनुमान तक, हम छात्रों को औपचारिक बैंक प्रक्रिया शुरू होने से पहले फंडिंग यात्रा समझने में मदद करते हैं।',
  'Guidance covers tuition, living expenses, destination requirements, co-applicant preparation and responsible repayment planning.': 'मार्गदर्शन में ट्यूशन, जीवन-यापन खर्च, गंतव्य आवश्यकताएं, सह-आवेदक तैयारी और जिम्मेदार पुनर्भुगतान योजना शामिल है।',
  'Every recommendation is framed around affordability, documentation strength, repayment comfort and long-term family confidence.': 'हर सुझाव सामर्थ्य, दस्तावेज मजबूती, पुनर्भुगतान सुविधा और दीर्घकालिक पारिवारिक भरोसे के आसपास बनाया जाता है।',
  'Use this page as a practical preparation checklist before speaking with our team. It combines education-loan document planning, other loan requirements and an advanced EMI planner for first-level financial clarity.': 'हमारी टीम से बात करने से पहले इस पेज को व्यावहारिक तैयारी चेकलिस्ट के रूप में उपयोग करें। इसमें शिक्षा फंड दस्तावेज योजना, अन्य फंड आवश्यकताएं और प्रथम-स्तर की वित्तीय स्पष्टता के लिए उन्नत EMI प्लानर शामिल है।',
  'For personal, home and business loans, eligibility commonly depends on income, obligations, credit history, bank statements and loan purpose.': 'व्यक्तिगत, गृह और व्यवसाय फंडिंग के लिए पात्रता सामान्यतः आय, देनदारियों, क्रेडिट इतिहास, बैंक स्टेटमेंट और फंड उद्देश्य पर निर्भर करती है।',
  'Tell us what you are planning. Our team will help you understand the right loan path, document preparation, repayment estimate and next practical step before formal processing.': 'हमें बताएं आप क्या योजना बना रहे हैं। हमारी टीम औपचारिक प्रक्रिया से पहले सही फंड मार्ग, दस्तावेज तैयारी, पुनर्भुगतान अनुमान और अगले व्यावहारिक कदम को समझने में मदद करेगी।',
  'Business type, years in operation, banking history, loan purpose and basic turnover range.': 'व्यवसाय प्रकार, संचालन के वर्ष, बैंकिंग इतिहास, फंड उद्देश्य और मूल टर्नओवर सीमा।',
  'Loan Ventures. All rights reserved. Terms & Conditions Apply. Loan approval is subject to bank policies, eligibility, verification, documentation, and credit assessment.': 'फंड वेंचर्स। सर्वाधिकार सुरक्षित। नियम और शर्तें लागू। फंड मंजूरी बैंक नीतियों, पात्रता, सत्यापन, दस्तावेज और क्रेडिट मूल्यांकन के अधीन है।',
  'Loan Ventures. All rights reserved. Terms & Conditions Apply. Loan approval is subject to bank policies, eligibility, verification, documentation, and credit assessment.': 'फंड वेंचर्स। सर्वाधिकार सुरक्षित। नियम और शर्तें लागू। ऋण मंजूरी बैंक नीतियों, पात्रता, सत्यापन, दस्तावेज और क्रेडिट मूल्यांकन के अधीन है।'
});

Object.assign(phraseTranslations.te, {
  'Nidhi Path Education Loan Assistance': 'నిధి పథ్ విద్యా ఫండ్ సహాయం',
  'About Us | Nidhi Path Loan Ventures': 'మా గురించి | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Services | Nidhi Path Loan Ventures': 'సేవలు | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Eligibility | Nidhi Path Loan Ventures': 'అర్హత | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Contact Us | Nidhi Path Loan Ventures': 'మమ్మల్ని సంప్రదించండి | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Login | Nidhi Path Loan Ventures': 'లాగిన్ | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Education Loan | Nidhi Path Loan Ventures': 'విద్యా రుణం | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Personal Loan | Nidhi Path Loan Ventures': 'వ్యక్తిగత రుణం | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Business Loan | Nidhi Path Loan Ventures': 'వ్యాపార రుణం | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Home Loan | Nidhi Path Loan Ventures': 'గృహ రుణం | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Mutual Funds | Nidhi Path Loan Ventures': 'మ్యూచువల్ ఫండ్స్ | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Insurance | Nidhi Path Loan Ventures': 'బీమా | నిధి పథ్ ఫండ్ వెంచర్స్',
  'All Types of Loans | Nidhi Path Loan Ventures': 'అన్ని రకాల రుణాలు | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Loan Consultation | Nidhi Path Loan Ventures': 'రుణ సంప్రదింపు | నిధి పథ్ ఫండ్ వెంచర్స్',
  'Nidhi Path logo': 'నిధి పథ్ లోగో',
  'Nidhi Path Loan Ventures logo': 'నిధి పథ్ ఫండ్ వెంచర్స్ లోగో',
  'Nidhi Path Loan Ventures office map': 'నిధి పథ్ ఫండ్ వెంచర్స్ కార్యాలయ మ్యాప్',
  'Menu': 'మెనూ',
  'Apply Now': 'ఇప్పుడే దరఖాస్తు చేయండి',
  'Nidhi Path Loan Ventures helps students and families plan education loans for higher studies in India and abroad. The platform focuses on admission-based loans, college fee financing, co-applicant preparation, document preparation and bank education loan assistance. The purpose is simple: reduce confusion, compare suitable options and help every student move toward formal application with clarity.': 'నిధి పథ్ ఫండ్ వెంచర్స్ విద్యార్థులు మరియు కుటుంబాలు భారత్ మరియు విదేశాలలో ఉన్నత చదువుల కోసం విద్యా ఫండింగ్ ప్లాన్ చేసేందుకు సహాయం చేస్తుంది. ఈ ప్లాట్‌ఫార్మ్ అడ్మిషన్ ఆధారిత ఫండింగ్, కాలేజ్ ఫీజు ఫైనాన్సింగ్, సహ-దరఖాస్తుదారుల సిద్ధత, పత్రాల సిద్ధత మరియు బ్యాంక్ విద్యా ఫండ్ సహాయంపై దృష్టి పెడుతుంది. లక్ష్యం సులభం: అయోమయాన్ని తగ్గించడం, సరైన ఎంపికలను పోల్చడం మరియు ప్రతి విద్యార్థి స్పష్టతతో అధికారిక దరఖాస్తు వైపు సాగేందుకు సహాయం చేయడం.',
  'Education loan approval depends on bank policy, admission details, eligibility, documents, co-applicant profile and verification. Nidhi Path keeps the process transparent and helps students prepare better before submission.': 'విద్యా ఫండ్ ఆమోదం బ్యాంక్ పాలసీ, అడ్మిషన్ వివరాలు, అర్హత, పత్రాలు, సహ-దరఖాస్తుదారుడి ప్రొఫైల్ మరియు ధృవీకరణపై ఆధారపడి ఉంటుంది. నిధి పథ్ ప్రక్రియను పారదర్శకంగా ఉంచి, సమర్పణకు ముందు విద్యార్థులు మెరుగ్గా సిద్ధం కావడానికి సహాయం చేస్తుంది.',
  'Education loans involve admission proof, course expenses, co-applicant details, repayment planning and bank-specific documentation. We help families organize every discussion before they approach the formal loan process.': 'విద్యా ఫండింగ్‌లో అడ్మిషన్ ప్రూఫ్, కోర్స్ ఖర్చులు, సహ-దరఖాస్తుదారుడి వివరాలు, తిరిగి చెల్లింపు ప్లానింగ్ మరియు బ్యాంక్-ప్రత్యేక డాక్యుమెంటేషన్ ఉంటాయి. కుటుంబాలు అధికారిక ఫండ్ ప్రక్రియకు వెళ్లే ముందు ప్రతి చర్చను సక్రమంగా ఏర్పాటు చేయడంలో మేము సహాయం చేస్తాము.',
  'Students and parents use our education loan assistance to understand eligibility, compare bank options, prepare documents and move confidently toward college fee financing.': 'విద్యార్థులు మరియు తల్లిదండ్రులు అర్హతను అర్థం చేసుకోవడానికి, బ్యాంక్ ఎంపికలను పోల్చడానికి, పత్రాలను సిద్ధం చేయడానికి మరియు కాలేజ్ ఫీజు ఫైనాన్సింగ్ వైపు నమ్మకంగా వెళ్లడానికి మా విద్యా ఫండ్ సహాయాన్ని ఉపయోగిస్తారు.',
  'The team explained co-applicant requirements, income documents and repayment planning clearly, which made the education loan process less stressful.': 'బృందం సహ-దరఖాస్తుదారుడి అవసరాలు, ఆదాయ పత్రాలు మరియు తిరిగి చెల్లింపు ప్రణాళికను స్పష్టంగా వివరించింది, దీనితో విద్యా ఫండ్ ప్రక్రియ తక్కువ ఒత్తిడిగా అనిపించింది.',
  'Nidhi Path helped my family understand study abroad loan options, living cost estimates and document preparation before my university deadline.': 'నా యూనివర్సిటీ గడువుకు ముందు విదేశీ అధ్యయన ఫండ్ ఎంపికలు, జీవన ఖర్చుల అంచనాలు మరియు పత్రాల సిద్ధతను నా కుటుంబం అర్థం చేసుకోవడానికి నిధి పథ్ సహాయం చేసింది.',
  'The purpose is simple: reduce confusion, compare suitable options and help every student move toward formal application with clarity.': 'లక్ష్యం సులభం: అయోమయాన్ని తగ్గించడం, సరైన ఎంపికలను పోల్చడం మరియు ప్రతి విద్యార్థి స్పష్టతతో అధికారిక దరఖాస్తు వైపు కదలడంలో సహాయం చేయడం.',
  'I received guidance for college fee financing, eligibility checks and bank comparison without confusing promises.': 'అయోమయపరిచే హామీలు లేకుండా కాలేజ్ ఫీజు ఫైనాన్సింగ్, అర్హత తనిఖీలు మరియు బ్యాంక్ పోలికపై నాకు మార్గదర్శకం లభించింది.',
  'We understood the difference between tuition, living expenses and margin money before selecting an education loan route.': 'విద్యా ఫండ్ మార్గాన్ని ఎంచుకునే ముందు ట్యూషన్, జీవన ఖర్చులు మరియు మార్జిన్ మనీ మధ్య తేడాను మేము అర్థం చేసుకున్నాం.',
  'The counseling helped me prepare academic records, KYC, income proof and travel-cost estimates for my loan discussion.': 'కౌన్సెలింగ్ నా ఫండ్ చర్చ కోసం విద్యా రికార్డులు, KYC, ఆదాయ ప్రూఫ్ మరియు ప్రయాణ ఖర్చు అంచనాలను సిద్ధం చేయడంలో సహాయం చేసింది.',
  'The admission letter, fee schedule and EMI planning were organized in one place before approaching the bank.': 'బ్యాంక్‌ను సంప్రదించే ముందు అడ్మిషన్ లేఖ, ఫీజు షెడ్యూల్ మరియు EMI ప్లానింగ్ ఒకేచోట ఏర్పాటు చేయబడ్డాయి.',
  'Share your admission, course fee and study destination details. Our team will guide you with the next practical step.': 'మీ అడ్మిషన్, కోర్స్ ఫీజు మరియు అధ్యయన గమ్యస్థాన వివరాలను పంచుకోండి. మా బృందం తదుపరి ప్రాక్టికల్ దశలో మీకు మార్గదర్శకం ఇస్తుంది.',
  'Guidance for approved Indian colleges, course fees, academic records and parent or guardian preparation.': 'ఆమోదిత భారతీయ కాలేజీలు, కోర్స్ ఫీజులు, విద్యా రికార్డులు మరియు తల్లిదండ్రులు లేదా సంరక్షకుల సిద్ధత కోసం మార్గదర్శకం.',
  'Profile review for course, admission, co-applicant strength, documents and repayment comfort.': 'కోర్స్, అడ్మిషన్, సహ-దరఖాస్తుదారుడి బలం, పత్రాలు మరియు తిరిగి చెల్లింపు సౌకర్యం కోసం ప్రొఫైల్ సమీక్ష.',
  'Support for admission letters, living cost planning, travel expenses and collateral preparation where required.': 'అవసరమైన చోట అడ్మిషన్ లేఖలు, జీవన ఖర్చుల ప్రణాళిక, ప్రయాణ ఖర్చులు మరియు కోలాటరల్ సిద్ధతకు సహాయం.',
  'Tuition, travel, books, equipment and living expenses are arranged into a clear estimate.': 'ట్యూషన్, ప్రయాణం, పుస్తకాలు, పరికరాలు మరియు జీవన ఖర్చులను స్పష్టమైన అంచనాగా ఏర్పాటు చేస్తాము.',
  'Students and parents receive timely reminders for document gaps, bank updates and next-step preparation.': 'విద్యార్థులు మరియు తల్లిదండ్రులకు డాక్యుమెంట్ లోపాలు, బ్యాంక్ అప్‌డేట్లు మరియు తదుపరి దశ సిద్ధతకు సమయానుకూల రిమైండర్లు అందుతాయి.',
  'KYC, academics, bank statements, income proof and fee schedules are organized.': 'KYC, విద్యా రికార్డులు, బ్యాంక్ స్టేట్మెంట్లు, ఆదాయ ప్రూఫ్ మరియు ఫీజు షెడ్యూల్లు ఏర్పాటు చేస్తాము.',
  'Parents and guardians understand their role, documents and repayment comfort.': 'తల్లిదండ్రులు మరియు సంరక్షకులు తమ పాత్ర, పత్రాలు మరియు తిరిగి చెల్లింపు సౌకర్యాన్ని అర్థం చేసుకుంటారు.',
  'Families can understand approximate monthly commitment before formal processing.': 'అధికారిక ప్రక్రియకు ముందు కుటుంబాలు సుమారు నెలవారీ బాధ్యతను అర్థం చేసుకోవచ్చు.',
  'We help students and parents understand education-loan possibilities with calm, practical consultation. From study abroad loans discussions to documentation, EMI awareness, co-applicant preparation and multiple bank guidance, our work is built around trust, clarity and responsible financial decisions.': 'మేము ప్రశాంతమైన, ప్రాక్టికల్ సంప్రదింపులతో విద్యార్థులు మరియు తల్లిదండ్రులు విద్యా ఫండ్ అవకాశాలను అర్థం చేసుకోవడంలో సహాయం చేస్తాము. విదేశీ అధ్యయన ఫండింగ్ చర్చల నుండి పత్రాలు, EMI అవగాహన, సహ-దరఖాస్తుదారుడి సిద్ధత మరియు అనేక బ్యాంక్ మార్గదర్శకం వరకు మా పని నమ్మకం, స్పష్టత మరియు బాధ్యతాయుత ఆర్థిక నిర్ణయాలపై ఆధారపడింది.',
  'Nidhi Path Loan Ventures provides guidance and consultation. Loan approval, rate, amount, charges and disbursement are subject to multiple bank policies, eligibility, credit assessment, documentation and verification.': 'నిధి పథ్ ఫండ్ వెంచర్స్ మార్గదర్శకం మరియు సంప్రదింపులు అందిస్తుంది. ఫండ్ ఆమోదం, రేటు, మొత్తం, ఛార్జీలు మరియు విడుదల అనేక బ్యాంక్ పాలసీలు, అర్హత, క్రెడిట్ అంచనా, పత్రాలు మరియు ధృవీకరణకు లోబడి ఉంటాయి.',
  'Nidhi Path guided me throughout my abroad education loan process. Their transparent consultation and documentation support helped me move ahead confidently.': 'నా విదేశీ విద్యా ఫండ్ ప్రక్రియ అంతటా నిధి పథ్ నాకు మార్గదర్శకం ఇచ్చింది. వారి పారదర్శక సంప్రదింపు మరియు డాక్యుమెంటేషన్ సహాయం నన్ను నమ్మకంగా ముందుకు సాగించాయి.',
  'The consultation was transparent about bank policies and timelines. My family trusted the process because expectations were clear.': 'బ్యాంక్ పాలసీలు మరియు టైమ్‌లైన్‌ల గురించి సంప్రదింపు పారదర్శకంగా ఉంది. అంచనాలు స్పష్టంగా ఉండటంతో నా కుటుంబం ప్రక్రియను నమ్మింది.',
  'I received a clear checklist for admission loans and blocked-account related expense discussions. The process felt more manageable.': 'అడ్మిషన్ ఫండింగ్ మరియు బ్లాక్‌డ్-అకౌంట్ సంబంధిత ఖర్చుల చర్చల కోసం నాకు స్పష్టమైన చెక్‌లిస్ట్ లభించింది. ప్రక్రియ మరింత నిర్వహణయోగ్యంగా అనిపించింది.',
  'My consultation covered tuition, living expenses and EMI comfort. The guidance made our study abroad financing plan feel organized.': 'నా సంప్రదింపులో ట్యూషన్, జీవన ఖర్చులు మరియు EMI సౌకర్యం చర్చించబడ్డాయి. ఆ మార్గదర్శకం మా విదేశీ అధ్యయన ఫైనాన్సింగ్ ప్లాన్‌ను సక్రమంగా అనిపించేలా చేసింది.',
  'The documentation support was excellent. We knew what to prepare, what gaps to fix and how to approach the next conversation.': 'డాక్యుమెంటేషన్ సహాయం అద్భుతంగా ఉంది. ఏమి సిద్ధం చేయాలి, ఏ లోపాలు సరిచేయాలి మరియు తదుపరి చర్చను ఎలా ఎదుర్కోవాలి అన్నది మాకు తెలిసింది.',
  'The team helped my parents understand co-applicant documents, repayment planning and possible bank routes before we applied.': 'దరఖాస్తు చేసే ముందు సహ-దరఖాస్తుదారుడి పత్రాలు, తిరిగి చెల్లింపు ప్రణాళిక మరియు సాధ్యమైన బ్యాంక్ మార్గాలను నా తల్లిదండ్రులు అర్థం చేసుకోవడంలో బృందం సహాయం చేసింది.',
  'From counseling to loans-preparation guidance, Nidhi Path kept the conversation student-first and practical for my family.': 'కౌన్సెలింగ్ నుండి ఫండింగ్-సిద్ధత మార్గదర్శకం వరకు, నిధి పథ్ నా కుటుంబానికి సంభాషణను విద్యార్థి-మొదటి మరియు ప్రాక్టికల్‌గా ఉంచింది.',
  'Nidhi Path explained multiple bank consultation options and helped us prepare financial documents before the visa timeline.': 'నిధి పథ్ అనేక బ్యాంక్ సంప్రదింపు ఎంపికలను వివరించి, వీసా టైమ్‌లైన్‌కు ముందు ఆర్థిక పత్రాలను సిద్ధం చేయడంలో మాకు సహాయం చేసింది.',
  'Students get patient guidance across admission loans, country planning, study expenses and loans-preparation conversations.': 'అడ్మిషన్ ఫండింగ్, దేశ ప్రణాళిక, అధ్యయన ఖర్చులు మరియు ఫండింగ్-సిద్ధత చర్చల్లో విద్యార్థులకు ఓర్పుతో మార్గదర్శకం లభిస్తుంది.',
  'We listen to the student goal first, then discuss loans possibilities, affordability and responsible repayment planning.': 'మేము ముందుగా విద్యార్థి లక్ష్యాన్ని వింటాము, తర్వాత ఫండింగ్ అవకాశాలు, చెల్లించగల సామర్థ్యం మరియు బాధ్యతాయుత తిరిగి చెల్లింపు ప్రణాళికపై చర్చిస్తాము.',
  'We support repeated discussions so families can clarify documents, repayment comfort, bank options and timeline expectations.': 'కుటుంబాలు పత్రాలు, తిరిగి చెల్లింపు సౌకర్యం, బ్యాంక్ ఎంపికలు మరియు టైమ్‌లైన్ అంచనాలను స్పష్టంచేసుకోగలిగేలా పునరావృత చర్చలకు మేము సహాయం చేస్తాము.',
  'Families receive clear document checklists for KYC, income proof, admission letters, fee structure and co-applicant papers.': 'కుటుంబాలకు KYC, ఆదాయ ప్రూఫ్, అడ్మిషన్ లేఖలు, ఫీజు నిర్మాణం మరియు సహ-దరఖాస్తుదారుడి పత్రాలకు స్పష్టమైన డాక్యుమెంట్ చెక్‌లిస్ట్‌లు అందుతాయి.',
  'We explain the loan path, possible document needs, repayment basics and application steps in customer-friendly language.': 'మేము ఫండ్ మార్గం, సాధ్యమైన పత్రాల అవసరాలు, తిరిగి చెల్లింపు ప్రాథమికాలు మరియు దరఖాస్తు దశలను కస్టమర్‌కు సులభమైన భాషలో వివరిస్తాము.',
  'Nidhi Path Loan Ventures supports families with structured education-loan consultation, abroad-study loans preparation, document clarity, EMI planning and responsible bank process guidance. The goal is simple: make every education loans conversation calm, transparent and well prepared.': 'నిధి పథ్ ఫండ్ వెంచర్స్ నిర్మిత విద్యా ఫండ్ సంప్రదింపు, విదేశీ అధ్యయన ఫండింగ్ సిద్ధత, పత్రాల స్పష్టత, EMI ప్లానింగ్ మరియు బాధ్యతాయుత బ్యాంక్ ప్రక్రియ మార్గదర్శకంతో కుటుంబాలకు సహాయం చేస్తుంది. లక్ష్యం సులభం: ప్రతి విద్యా ఫండింగ్ సంభాషణను ప్రశాంతంగా, పారదర్శకంగా మరియు బాగా సిద్ధంగా మార్చడం.',
  'Families receive clear discussions on eligibility, documents, bank policies, cost expectations and next steps without unrealistic approval promises.': 'అవాస్తవిక ఆమోద హామీలు లేకుండా కుటుంబాలకు అర్హత, పత్రాలు, బ్యాంక్ పాలసీలు, ఖర్చు అంచనాలు మరియు తదుపరి దశలపై స్పష్టమైన చర్చలు అందుతాయి.',
  'From admission proof to expense estimates, we help students understand the loans journey before formal bank processing begins.': 'అడ్మిషన్ ప్రూఫ్ నుండి ఖర్చుల అంచనాల వరకు, అధికారిక బ్యాంక్ ప్రక్రియ ప్రారంభమయ్యే ముందు విద్యార్థులు ఫండింగ్ ప్రయాణాన్ని అర్థం చేసుకోవడంలో మేము సహాయం చేస్తాము.',
  'Guidance covers tuition, living expenses, destination requirements, co-applicant preparation and responsible repayment planning.': 'మార్గదర్శకంలో ట్యూషన్, జీవన ఖర్చులు, గమ్యస్థాన అవసరాలు, సహ-దరఖాస్తుదారుడి సిద్ధత మరియు బాధ్యతాయుత తిరిగి చెల్లింపు ప్రణాళిక ఉన్నాయి.',
  'Every recommendation is framed around affordability, documentation strength, repayment comfort and long-term family confidence.': 'ప్రతి సిఫార్సు చెల్లించగల సామర్థ్యం, పత్రాల బలం, తిరిగి చెల్లింపు సౌకర్యం మరియు దీర్ఘకాలిక కుటుంబ నమ్మకంపై ఆధారపడి ఉంటుంది.',
  'Use this page as a practical preparation checklist before speaking with our team. It combines education-loan document planning, other loan requirements and an advanced EMI planner for first-level financial clarity.': 'మా బృందంతో మాట్లాడే ముందు ఈ పేజీని ప్రాక్టికల్ సిద్ధత చెక్‌లిస్ట్‌గా ఉపయోగించండి. ఇది విద్యా ఫండ్ డాక్యుమెంట్ ప్లానింగ్, ఇతర ఫండ్ అవసరాలు మరియు మొదటి స్థాయి ఆర్థిక స్పష్టత కోసం అధునాతన EMI ప్లానర్‌ను కలిపి చూపిస్తుంది.',
  'For personal, home and business loans, eligibility commonly depends on income, obligations, credit history, bank statements and loan purpose.': 'వ్యక్తిగత, గృహ మరియు వ్యాపార ఫండింగ్ కోసం అర్హత సాధారణంగా ఆదాయం, బాధ్యతలు, క్రెడిట్ చరిత్ర, బ్యాంక్ స్టేట్మెంట్లు మరియు ఫండ్ ఉద్దేశంపై ఆధారపడి ఉంటుంది.',
  'Tell us what you are planning. Our team will help you understand the right loan path, document preparation, repayment estimate and next practical step before formal processing.': 'మీరు ఏమి ప్లాన్ చేస్తున్నారు మాకు చెప్పండి. అధికారిక ప్రక్రియకు ముందు సరైన ఫండ్ మార్గం, పత్రాల సిద్ధత, తిరిగి చెల్లింపు అంచనా మరియు తదుపరి ప్రాక్టికల్ దశను అర్థం చేసుకోవడంలో మా బృందం సహాయం చేస్తుంది.',
  'Business type, years in operation, banking history, loan purpose and basic turnover range.': 'వ్యాపార రకం, నిర్వహణ సంవత్సరాలు, బ్యాంకింగ్ చరిత్ర, ఫండ్ ఉద్దేశం మరియు ప్రాథమిక టర్నోవర్ పరిధి.',
  'Loan Ventures. All rights reserved. Terms & Conditions Apply. Loan approval is subject to bank policies, eligibility, verification, documentation, and credit assessment.': 'ఫండ్ వెంచర్స్. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి. నియమాలు మరియు షరతులు వర్తిస్తాయి. ఫండ్ ఆమోదం బ్యాంక్ పాలసీలు, అర్హత, ధృవీకరణ, పత్రాలు మరియు క్రెడిట్ అంచనాకు లోబడి ఉంటుంది.',
  'Loan Ventures. All rights reserved. Terms & Conditions Apply. Loan approval is subject to bank policies, eligibility, verification, documentation, and credit assessment.': 'ఫండ్ వెంచర్స్. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి. నియమాలు మరియు షరతులు వర్తిస్తాయి. రుణ ఆమోదం బ్యాంక్ పాలసీలు, అర్హత, ధృవీకరణ, పత్రాలు మరియు క్రెడిట్ అంచనాకు లోబడి ఉంటుంది.'
});

const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();
Object.assign(phraseTranslations.hi, {
  'Consultation is focused on eligibility review, bank policy awareness and realistic next steps for India and abroad education loans.': 'परामर्श भारत और विदेश शिक्षा फंडिंग के लिए पात्रता समीक्षा, बैंक नीति जागरूकता और यथार्थवादी अगले कदमों पर केंद्रित है।',
  'A student-first education-loan guidance partner for families planning bigger journeys': 'बड़ी यात्राओं की योजना बना रहे परिवारों के लिए छात्र-प्रथम शिक्षा फंड मार्गदर्शन भागीदार',
  'Real students. Real guidance. Real education journeys supported with confidence.': 'वास्तविक छात्र। वास्तविक मार्गदर्शन। आत्मविश्वास के साथ समर्थित वास्तविक शिक्षा यात्राएं।',
  'Student plans are mapped for India or abroad with admission and expense context.': 'छात्र योजनाएं भारत या विदेश के लिए प्रवेश और खर्च के संदर्भ के साथ मैप की जाती हैं।',
  'Continuous guidance for students, parents and education-loan decisions': 'छात्रों, अभिभावकों और शिक्षा फंड निर्णयों के लिए निरंतर मार्गदर्शन',
  'Modern education-loan service highlights for every family conversation': 'हर परिवार बातचीत के लिए आधुनिक शिक्षा फंड सेवा की मुख्य बातें',
  'Education loan support that feels personal, practical and transparent': 'शिक्षा फंड सहायता जो व्यक्तिगत, व्यावहारिक और पारदर्शी लगे',
  'Guidance built for students, parents and confident study decisions': 'छात्रों, अभिभावकों और आत्मविश्वासी अध्ययन निर्णयों के लिए बनाया गया मार्गदर्शन',
  'Focused support for students, parents and admission-based loans': 'छात्रों, अभिभावकों और प्रवेश-आधारित फंडिंग के लिए केंद्रित सहायता',
  'Clear guidance for students, parents and college fee financing': 'छात्रों, अभिभावकों और कॉलेज फीस वित्तपोषण के लिए स्पष्ट मार्गदर्शन',
  'Bank education loan assistance without false approval promises': 'झूठे मंजूरी वादों के बिना बैंक शिक्षा फंड सहायता',
  'Guide every education decision with clarity and confidence.': 'हर शिक्षा निर्णय को स्पष्टता और आत्मविश्वास के साथ मार्गदर्शित करें।',
  'Education financing support built around real student needs': 'वास्तविक छात्र जरूरतों पर आधारित शिक्षा वित्तपोषण सहायता',
  'Understand education loan support through clear visuals': 'स्पष्ट दृश्यों के माध्यम से शिक्षा फंड सहायता समझें',
  'Student eligibility check and documentation preparation': 'छात्र पात्रता जांच और दस्तावेज तैयारी',
  'Multiple route discussions with realistic expectations': 'यथार्थवादी अपेक्षाओं के साथ कई मार्गों पर चर्चा',
  'Families trust Nidhi Path for education loan guidance': 'परिवार शिक्षा फंड मार्गदर्शन के लिए निधि पथ पर भरोसा करते हैं',
  'Property or business documents based on loan type': 'फंड प्रकार के आधार पर संपत्ति या व्यवसाय दस्तावेज',
  'Domestic and study abroad education loan guidance': 'देशीय और विदेश अध्ययन शिक्षा फंड मार्गदर्शन',
  'Co-applicant preparation and repayment clarity': 'सह-आवेदक तैयारी और पुनर्भुगतान स्पष्टता',
  'Education loan assistance for academic dreams': 'शैक्षणिक सपनों के लिए शिक्षा फंड सहायता',
  'Changing education loan guidance highlights': 'बदलती शिक्षा फंड मार्गदर्शन मुख्य बातें',
  'Parent or co-applicant profile preparation': 'माता-पिता या सह-आवेदक प्रोफाइल तैयारी',
  'Destination-Smart Education Loan Guidance': 'गंतव्य-स्मार्ट शिक्षा फंड मार्गदर्शन',
  'Country, course and living-cost guidance': 'देश, कोर्स और जीवन-यापन खर्च मार्गदर्शन',
  'Need help planning an education loan?': 'शिक्षा फंड की योजना में मदद चाहिए?',
  'Student-First Consultation Process': 'छात्र-प्रथम परामर्श प्रक्रिया',
  'Education loan planning highlights': 'शिक्षा फंड योजना की मुख्य बातें',
  'Visual guide to Nidhi Path support': 'निधि पथ सहायता की दृश्य गाइड',
  'Transparent Documentation Support': 'पारदर्शी दस्तावेज सहायता',
  'Talk to an Education Loan Advisor': 'शिक्षा फंड सलाहकार से बात करें',
  'Education loan service highlights': 'शिक्षा फंड सेवा मुख्य बातें',
  'Trusted Education Loan Guidance': 'विश्वसनीय शिक्षा फंड मार्गदर्शन',
  'Education Loan Journey Support': 'शिक्षा ऋण यात्रा सहायता',
  'Nidhi Path service highlights': 'निधि पथ सेवा की मुख्य बातें',
  'Parent Co-applicant Guidance': 'अभिभावक सह-आवेदक मार्गदर्शन',
  'Education Loan EMI Planning': 'शिक्षा फंड EMI योजना',
  'Always Supporting Students': 'हमेशा छात्रों का समर्थन',
  'Admission Document Support': 'प्रवेश दस्तावेज सहायता',
  'Domestic Education Loans': 'देशीय शिक्षा फंडिंग',
  'Loan Comparison Assistance': 'फंड तुलना सहायता',
  'Study destination filters': 'अध्ययन गंतव्य फिल्टर',
  'Education Loan Specialist': 'शिक्षा फंड विशेषज्ञ',
  'Student Eligibility Check': 'छात्र पात्रता जांच',
  'Admission + Loan Guidance': 'प्रवेश + फंड मार्गदर्शन',
  'Abroad Education Loans': 'विदेश शिक्षा फंडिंग',
  'Responsible Consultation': 'जिम्मेदार परामर्श',
  'Student success stories': 'छात्र सफलता कहानियां',
  'Student Success Stories': 'छात्र सफलता कहानियां',
  'University Fee Planning': 'विश्वविद्यालय फीस योजना',
  'Education Loan Services': 'शिक्षा फंड सेवाएं',
  'Abroad Study Assistance': 'विदेश अध्ययन सहायता',
  'Overseas loan planning': 'विदेशी फंड योजना',
  'Education Loan Support': 'शिक्षा फंड सहायता',
  'Multiple Bank Options': 'कई बैंक विकल्प',
  'Minimal Documentation': 'न्यूनतम दस्तावेज',
  'College fee financing': 'कॉलेज फीस वित्तपोषण',
  'Study Abroad Planning': 'विदेश अध्ययन योजना',
  'Loan Approvals Guided': 'फंड मंजूरी मार्गदर्शन',
  'Why Students Trust Us': 'छात्र हम पर क्यों भरोसा करते हैं',
  'Responsible guidance': 'जिम्मेदार मार्गदर्शन',
  'Study Abroad Support': 'विदेश अध्ययन सहायता',
  'Student Loan Journey': 'छात्र फंड यात्रा',
  'Education Loan Focus': 'शिक्षा फंड फोकस',
  'Transparent Guidance': 'पारदर्शी मार्गदर्शन',
  'Quick Loan Approval': 'त्वरित फंड मंजूरी',
  'Student Loan Impact': 'छात्र फंड प्रभाव',
  'Education Loan Desk': 'शिक्षा ऋण डेस्क',
  'Responsible Support': 'जिम्मेदार सहायता',
  'For Education Loan': 'शिक्षा फंड के लिए',
  'Low Interest Rates': 'कम ब्याज दरें',
  'Flexible Repayment': 'लचीला पुनर्भुगतान',
  'Students Supported': 'सहायता प्राप्त छात्र',
  'Eligibility Review': 'पात्रता समीक्षा',
  'Managing Director': 'प्रबंध निदेशक',
  'Loan Consultation': 'फंड परामर्श',
  'Repayment clarity': 'पुनर्भुगतान स्पष्टता',
  'Education Loans': 'शिक्षा फंडिंग',
  'Countries Covered': 'कवर किए गए देश',
  '5 out of 5 stars': '5 में से 5 सितारे',
  'Student Guidance': 'छात्र मार्गदर्शन',
  'About Nidhi Path': 'निधि पथ के बारे में',
  'Student Support': 'छात्र सहायता',
  'Success Stories': 'सफलता कहानियां',
  'Student Stories': 'छात्र कहानियां',
  'Education Loan': 'शिक्षा फंड',
  'Total Interest': 'कुल ब्याज',
  'Graduate study': 'स्नातकोत्तर अध्ययन',
  'Parent Support': 'अभिभावक सहायता',
  'Multiple Student Consultations': 'कई छात्र परामर्श',
  'Personal Loan': 'व्यक्तिगत फंड',
  'Business Loan': 'व्यवसाय फंड',
  'Partner Banks': 'साझेदार बैंक',
  'Bank Guidance': 'बैंक मार्गदर्शन',
  'Up To 15 Yrs': '15 वर्ष तक',
  'GIC planning': 'GIC योजना',
  'Our Mission': 'हमारा मिशन',
  'Who We Are': 'हम कौन हैं',
  'Home Loan': 'गृह फंड',
  'Checklist': 'चेकलिस्ट',
  'Academics': 'शैक्षणिक रिकॉर्ड',
  '30 years': '30 वर्ष',
  '1 month': '1 महीना',
  'Masters': 'मास्टर्स',
  'Tuition': 'ट्यूशन',
  '72 Hrs': '72 घंटे',
  'Travel': 'यात्रा',
  'Budget': 'बजट',
  '₹1Cr': '₹1 करोड़',
  '?1Cr': '₹1 करोड़',
  '?1L': '₹1 लाख',
  'STEM': 'STEM',
  '10:00 AM to 6:30 PM': 'सुबह 10:00 से शाम 6:30 तक',
  'Vamsi Krishna Kiliampalli': 'वामसी कृष्णा किलियाम्पल्ली',
  'info@nidhipath.in': 'info@nidhipath.in',
  'www.nidhipath.in': 'www.nidhipath.in',
  'you@example.com': 'you@example.com',
  'Ananya, MS Student': 'अनन्या, एमएस छात्रा',
  'Meghana, Engineering Student': 'मेघना, इंजीनियरिंग छात्रा',
  'Arjun, MBA Applicant': 'अर्जुन, एमबीए आवेदक',
  'Sneha, Parent': 'स्नेहा, अभिभावक',
  'Kiran, Study Abroad Applicant': 'किरण, विदेश अध्ययन आवेदक',
  'Ravi, Parent': 'रवि, अभिभावक',
  'Ananya Reddy': 'अनन्या रेड्डी',
  'Rahul Varma': 'राहुल वर्मा',
  'Meera Joshi': 'मीरा जोशी',
  'Karthik Nair': 'कार्तिक नायर',
  'Pooja Menon': 'पूजा मेनन',
  'Divya Kumar': 'दिव्या कुमार',
  'Sneha Iyer': 'स्नेहा अय्यर',
  'Arjun Shah': 'अर्जुन शाह',
  'USA | MS Finance | Boston': 'अमेरिका | एमएस फाइनेंस | बॉस्टन',
  'Canada | MBA | Toronto': 'कनाडा | एमबीए | टोरंटो',
  'UK | Data Science | Manchester': 'यूके | डेटा साइंस | मैनचेस्टर',
  'Australia | Nursing | Melbourne': 'ऑस्ट्रेलिया | नर्सिंग | मेलबर्न',
  'Germany | Engineering | Munich': 'जर्मनी | इंजीनियरिंग | म्यूनिख',
  'Ireland | Business Analytics | Dublin': 'आयरलैंड | बिजनेस एनालिटिक्स | डबलिन',
  'France | Hospitality | Paris': 'फ्रांस | हॉस्पिटैलिटी | पेरिस',
  'Singapore | Management | NUS': 'सिंगापुर | मैनेजमेंट | NUS',
  'IN': 'IN',
  'US': 'US',
  'UK': 'UK',
  'CA': 'CA',
  'AU': 'AU',
  'DE': 'DE',
  'IE': 'IE',
  'FR': 'FR',
  'NL': 'NL',
  'SG': 'SG',
  'NZ': 'NZ',
  'SE': 'SE'
});

Object.assign(phraseTranslations.te, {
  'Consultation is focused on eligibility review, bank policy awareness and realistic next steps for India and abroad education loans.': 'సంప్రదింపు భారత్ మరియు విదేశీ విద్యా ఫండింగ్ కోసం అర్హత సమీక్ష, బ్యాంక్ పాలసీ అవగాహన మరియు వాస్తవిక తదుపరి దశలపై కేంద్రీకృతమై ఉంటుంది.',
  'A student-first education-loan guidance partner for families planning bigger journeys': 'పెద్ద ప్రయాణాలను ప్లాన్ చేసే కుటుంబాల కోసం విద్యార్థి-మొదటి విద్యా ఫండ్ మార్గదర్శక భాగస్వామి',
  'Real students. Real guidance. Real education journeys supported with confidence.': 'నిజమైన విద్యార్థులు. నిజమైన మార్గదర్శకం. నమ్మకంతో సహాయం పొందిన నిజమైన విద్యా ప్రయాణాలు.',
  'Student plans are mapped for India or abroad with admission and expense context.': 'విద్యార్థి ప్రణాళికలు భారత్ లేదా విదేశాలకు అడ్మిషన్ మరియు ఖర్చుల సందర్భంతో మ్యాప్ చేయబడతాయి.',
  'Continuous guidance for students, parents and education-loan decisions': 'విద్యార్థులు, తల్లిదండ్రులు మరియు విద్యా ఫండ్ నిర్ణయాలకు నిరంతర మార్గదర్శకం',
  'Modern education-loan service highlights for every family conversation': 'ప్రతి కుటుంబ సంభాషణ కోసం ఆధునిక విద్యా ఫండ్ సేవల ముఖ్యాంశాలు',
  'Education loan support that feels personal, practical and transparent': 'వ్యక్తిగతంగా, ప్రాక్టికల్‌గా మరియు పారదర్శకంగా అనిపించే విద్యా ఫండ్ సహాయం',
  'Guidance built for students, parents and confident study decisions': 'విద్యార్థులు, తల్లిదండ్రులు మరియు నమ్మకమైన అధ్యయన నిర్ణయాల కోసం నిర్మించిన మార్గదర్శకం',
  'Focused support for students, parents and admission-based loans': 'విద్యార్థులు, తల్లిదండ్రులు మరియు అడ్మిషన్ ఆధారిత ఫండింగ్ కోసం కేంద్రీకృత సహాయం',
  'Clear guidance for students, parents and college fee financing': 'విద్యార్థులు, తల్లిదండ్రులు మరియు కాలేజ్ ఫీజు ఫైనాన్సింగ్ కోసం స్పష్టమైన మార్గదర్శకం',
  'Bank education loan assistance without false approval promises': 'తప్పుడు ఆమోద హామీలు లేకుండా బ్యాంక్ విద్యా ఫండ్ సహాయం',
  'Guide every education decision with clarity and confidence.': 'ప్రతి విద్యా నిర్ణయానికి స్పష్టత మరియు నమ్మకంతో మార్గదర్శనం ఇవ్వండి.',
  'Education financing support built around real student needs': 'వాస్తవ విద్యార్థి అవసరాల చుట్టూ నిర్మించిన విద్యా ఫైనాన్సింగ్ సహాయం',
  'Understand education loan support through clear visuals': 'స్పష్టమైన విజువల్స్ ద్వారా విద్యా ఫండ్ సహాయాన్ని అర్థం చేసుకోండి',
  'Student eligibility check and documentation preparation': 'విద్యార్థి అర్హత తనిఖీ మరియు డాక్యుమెంట్ సిద్ధత',
  'Multiple route discussions with realistic expectations': 'వాస్తవిక అంచనాలతో అనేక మార్గాల చర్చలు',
  'Families trust Nidhi Path for education loan guidance': 'విద్యా ఫండ్ మార్గదర్శకానికి కుటుంబాలు నిధి పథ్‌ను నమ్ముతాయి',
  'Property or business documents based on loan type': 'ఫండ్ రకం ఆధారంగా ఆస్తి లేదా వ్యాపార పత్రాలు',
  'Domestic and study abroad education loan guidance': 'దేశీయ మరియు విదేశీ అధ్యయన విద్యా ఫండ్ మార్గదర్శకం',
  'Co-applicant preparation and repayment clarity': 'సహ-దరఖాస్తుదారుడి సిద్ధత మరియు తిరిగి చెల్లింపు స్పష్టత',
  'Education loan assistance for academic dreams': 'విద్యా కలల కోసం విద్యా ఫండ్ సహాయం',
  'Changing education loan guidance highlights': 'మారుతున్న విద్యా ఫండ్ మార్గదర్శక ముఖ్యాంశాలు',
  'Parent or co-applicant profile preparation': 'తల్లిదండ్రులు లేదా సహ-దరఖాస్తుదారుడి ప్రొఫైల్ సిద్ధత',
  'Destination-Smart Education Loan Guidance': 'గమ్యస్థానం-స్మార్ట్ విద్యా ఫండ్ మార్గదర్శకం',
  'Country, course and living-cost guidance': 'దేశం, కోర్స్ మరియు జీవన ఖర్చుల మార్గదర్శకం',
  'Need help planning an education loan?': 'విద్యా ఫండ్ ప్లాన్ చేయడానికి సహాయం కావాలా?',
  'Student-First Consultation Process': 'విద్యార్థి-మొదటి సంప్రదింపు ప్రక్రియ',
  'Education loan planning highlights': 'విద్యా ఫండ్ ప్లానింగ్ ముఖ్యాంశాలు',
  'Visual guide to Nidhi Path support': 'నిధి పథ్ సహాయానికి విజువల్ గైడ్',
  'Transparent Documentation Support': 'పారదర్శక డాక్యుమెంటేషన్ సహాయం',
  'Talk to an Education Loan Advisor': 'విద్యా ఫండ్ సలహాదారుతో మాట్లాడండి',
  'Education loan service highlights': 'విద్యా ఫండ్ సేవల ముఖ్యాంశాలు',
  'Trusted Education Loan Guidance': 'నమ్మకమైన విద్యా ఫండ్ మార్గదర్శకం',
  'Education Loan Journey Support': 'విద్యా రుణ ప్రయాణ సహాయం',
  'Nidhi Path service highlights': 'నిధి పథ్ సేవల ముఖ్యాంశాలు',
  'Parent Co-applicant Guidance': 'తల్లిదండ్రుల సహ-దరఖాస్తుదారుల మార్గదర్శకం',
  'Education Loan EMI Planning': 'విద్యా ఫండ్ EMI ప్లానింగ్',
  'Always Supporting Students': 'ఎల్లప్పుడూ విద్యార్థులకు సహాయం',
  'Admission Document Support': 'అడ్మిషన్ డాక్యుమెంట్ సహాయం',
  'Domestic Education Loans': 'దేశీయ విద్యా ఫండింగ్',
  'Loan Comparison Assistance': 'ఫండ్ పోలిక సహాయం',
  'Study destination filters': 'అధ్యయన గమ్యస్థాన ఫిల్టర్లు',
  'Education Loan Specialist': 'విద్యా ఫండ్ నిపుణుడు',
  'Student Eligibility Check': 'విద్యార్థి అర్హత తనిఖీ',
  'Admission + Loan Guidance': 'అడ్మిషన్ + ఫండ్ మార్గదర్శకం',
  'Abroad Education Loans': 'విదేశీ విద్యా ఫండింగ్',
  'Responsible Consultation': 'బాధ్యతాయుత సంప్రదింపు',
  'Student success stories': 'విద్యార్థి విజయ కథలు',
  'Student Success Stories': 'విద్యార్థి విజయ కథలు',
  'University Fee Planning': 'యూనివర్సిటీ ఫీజు ప్లానింగ్',
  'Education Loan Services': 'విద్యా ఫండ్ సేవలు',
  'Abroad Study Assistance': 'విదేశీ అధ్యయన సహాయం',
  'Overseas loan planning': 'విదేశీ ఫండ్ ప్లానింగ్',
  'Education Loan Support': 'విద్యా ఫండ్ సహాయం',
  'Multiple Bank Options': 'అనేక బ్యాంక్ ఎంపికలు',
  'Minimal Documentation': 'కనీస డాక్యుమెంటేషన్',
  'College fee financing': 'కాలేజ్ ఫీజు ఫైనాన్సింగ్',
  'Study Abroad Planning': 'విదేశీ అధ్యయన ప్రణాళిక',
  'Loan Approvals Guided': 'ఫండ్ ఆమోద మార్గదర్శనం',
  'Why Students Trust Us': 'విద్యార్థులు మమ్మల్ని ఎందుకు నమ్ముతారు',
  'Responsible guidance': 'బాధ్యతాయుత మార్గదర్శకం',
  'Study Abroad Support': 'విదేశీ అధ్యయన సహాయం',
  'Student Loan Journey': 'విద్యార్థి ఫండ్ ప్రయాణం',
  'Education Loan Focus': 'విద్యా ఫండ్ దృష్టి',
  'Transparent Guidance': 'పారదర్శక మార్గదర్శకం',
  'Quick Loan Approval': 'త్వరిత ఫండ్ ఆమోదం',
  'Student Loan Impact': 'విద్యార్థి ఫండ్ ప్రభావం',
  'Education Loan Desk': 'విద్యా రుణ డెస్క్',
  'Responsible Support': 'బాధ్యతాయుత సహాయం',
  'For Education Loan': 'విద్యా ఫండ్ కోసం',
  'Low Interest Rates': 'తక్కువ వడ్డీ రేట్లు',
  'Flexible Repayment': 'సౌకర్యవంతమైన తిరిగి చెల్లింపు',
  'Students Supported': 'సహాయం పొందిన విద్యార్థులు',
  'Eligibility Review': 'అర్హత సమీక్ష',
  'Managing Director': 'మేనేజింగ్ డైరెక్టర్',
  'Loan Consultation': 'ఫండ్ సంప్రదింపు',
  'Repayment clarity': 'తిరిగి చెల్లింపు స్పష్టత',
  'Education Loans': 'విద్యా ఫండింగ్',
  'Countries Covered': 'కవర్ చేసిన దేశాలు',
  '5 out of 5 stars': '5లో 5 నక్షత్రాలు',
  'Student Guidance': 'విద్యార్థి మార్గదర్శకం',
  'About Nidhi Path': 'నిధి పథ్ గురించి',
  'Student Support': 'విద్యార్థి సహాయం',
  'Success Stories': 'విజయ కథలు',
  'Student Stories': 'విద్యార్థి కథలు',
  'Education Loan': 'విద్యా ఫండ్',
  'Total Interest': 'మొత్తం వడ్డీ',
  'Graduate study': 'గ్రాడ్యుయేట్ అధ్యయనం',
  'Parent Support': 'తల్లిదండ్రుల సహాయం',
  'Multiple Student Consultations': 'అనేక విద్యార్థి సంప్రదింపులు',
  'Personal Loan': 'వ్యక్తిగత ఫండ్',
  'Business Loan': 'వ్యాపార ఫండ్',
  'Partner Banks': 'భాగస్వామ్య బ్యాంకులు',
  'Bank Guidance': 'బ్యాంక్ మార్గదర్శకం',
  'Up To 15 Yrs': '15 సంవత్సరాల వరకు',
  'GIC planning': 'GIC ప్లానింగ్',
  'Our Mission': 'మా లక్ష్యం',
  'Who We Are': 'మేమెవరం',
  'Home Loan': 'గృహ ఫండ్',
  'Checklist': 'చెక్‌లిస్ట్',
  'Academics': 'విద్యా రికార్డులు',
  '30 years': '30 సంవత్సరాలు',
  '1 month': '1 నెల',
  'Masters': 'మాస్టర్స్',
  'Tuition': 'ట్యూషన్',
  '72 Hrs': '72 గంటలు',
  'Travel': 'ప్రయాణం',
  'Budget': 'బడ్జెట్',
  '₹1Cr': '₹1 కోటి',
  '?1Cr': '₹1 కోటి',
  '?1L': '₹1 లక్ష',
  'STEM': 'STEM',
  '10:00 AM to 6:30 PM': 'ఉదయం 10:00 నుండి సాయంత్రం 6:30 వరకు',
  'Vamsi Krishna Kiliampalli': 'వంశీ కృష్ణ కిలియంపల్లి',
  'info@nidhipath.in': 'info@nidhipath.in',
  'www.nidhipath.in': 'www.nidhipath.in',
  'you@example.com': 'you@example.com',
  'Ananya, MS Student': 'అనన్య, ఎంఎస్ విద్యార్థి',
  'Meghana, Engineering Student': 'మేఘన, ఇంజినీరింగ్ విద్యార్థి',
  'Arjun, MBA Applicant': 'అర్జున్, ఎంబీఏ దరఖాస్తుదారు',
  'Sneha, Parent': 'స్నేహ, తల్లి/తండ్రి',
  'Kiran, Study Abroad Applicant': 'కిరణ్, విదేశీ అధ్యయన దరఖాస్తుదారు',
  'Ravi, Parent': 'రవి, తల్లి/తండ్రి',
  'Ananya Reddy': 'అనన్య రెడ్డి',
  'Rahul Varma': 'రాహుల్ వర్మ',
  'Meera Joshi': 'మీరా జోషి',
  'Karthik Nair': 'కార్తిక్ నాయర్',
  'Pooja Menon': 'పూజా మేనన్',
  'Divya Kumar': 'దివ్య కుమార్',
  'Sneha Iyer': 'స్నేహ అయ్యర్',
  'Arjun Shah': 'అర్జున్ షా',
  'USA | MS Finance | Boston': 'అమెరికా | ఎంఎస్ ఫైనాన్స్ | బోస్టన్',
  'Canada | MBA | Toronto': 'కెనడా | ఎంబీఏ | టొరంటో',
  'UK | Data Science | Manchester': 'యూకే | డేటా సైన్స్ | మాంచెస్టర్',
  'Australia | Nursing | Melbourne': 'ఆస్ట్రేలియా | నర్సింగ్ | మెల్‌బోర్న్',
  'Germany | Engineering | Munich': 'జర్మనీ | ఇంజినీరింగ్ | మ్యూనిక్',
  'Ireland | Business Analytics | Dublin': 'ఐర్లాండ్ | బిజినెస్ అనలిటిక్స్ | డబ్లిన్',
  'France | Hospitality | Paris': 'ఫ్రాన్స్ | హాస్పిటాలిటీ | పారిస్',
  'Singapore | Management | NUS': 'సింగపూర్ | మేనేజ్‌మెంట్ | NUS',
  'IN': 'IN',
  'US': 'US',
  'UK': 'UK',
  'CA': 'CA',
  'AU': 'AU',
  'DE': 'DE',
  'IE': 'IE',
  'FR': 'FR',
  'NL': 'NL',
  'SG': 'SG',
  'NZ': 'NZ',
  'SE': 'SE'
});

Object.assign(phraseTranslations.hi, {
  'Quick WhatsApp enquiry': 'त्वरित व्हाट्सएप पूछताछ',
  'WhatsApp chat': 'व्हाट्सएप चैट',
  'WhatsApp Assistant': 'व्हाट्सएप सहायक',
  'Tell us what support you need.': 'हमें बताएं आपको किस सहायता की जरूरत है।',
  'Hi! Share your details here, or type agent to continue on WhatsApp.': 'नमस्ते! यहां अपना विवरण साझा करें, या व्हाट्सएप पर जारी रखने के लिए agent लिखें।',
  'Type your requirement or agent help needed': 'अपनी जरूरत लिखें या agent help needed लिखें',
  'Send to WhatsApp': 'व्हाट्सएप पर भेजें',
  'Talk with Agent': 'एजेंट से बात करें',
  'Your enquiry will open in WhatsApp so the team can reply faster.': 'आपकी पूछताछ व्हाट्सएप में खुलेगी ताकि टीम जल्दी जवाब दे सके।',
  'Opening WhatsApp so our team can reply faster.': 'व्हाट्सएप खोल रहे हैं ताकि हमारी टीम जल्दी जवाब दे सके।',
  'Opening WhatsApp to connect you with an agent.': 'आपको एजेंट से जोड़ने के लिए व्हाट्सएप खोल रहे हैं।',
  'Please enter your requirement or type agent.': 'कृपया अपनी जरूरत लिखें या agent लिखें।',
  'We are opening WhatsApp with your enquiry details.': 'हम आपकी पूछताछ के विवरण के साथ व्हाट्सएप खोल रहे हैं।',
  'Share your details': 'अपना विवरण साझा करें'
});

Object.assign(phraseTranslations.te, {
  'Quick WhatsApp enquiry': 'త్వరిత వాట్సాప్ విచారణ',
  'WhatsApp chat': 'వాట్సాప్ చాట్',
  'WhatsApp Assistant': 'వాట్సాప్ సహాయకుడు',
  'Tell us what support you need.': 'మీకు ఏ సహాయం కావాలో చెప్పండి.',
  'Hi! Share your details here, or type agent to continue on WhatsApp.': 'నమస్తే! మీ వివరాలను ఇక్కడ పంచుకోండి, లేదా వాట్సాప్‌లో కొనసాగడానికి agent అని టైప్ చేయండి.',
  'Type your requirement or agent help needed': 'మీ అవసరాన్ని టైప్ చేయండి లేదా agent help needed అని టైప్ చేయండి',
  'Send to WhatsApp': 'వాట్సాప్‌కు పంపండి',
  'Talk with Agent': 'ఏజెంట్‌తో మాట్లాడండి',
  'Your enquiry will open in WhatsApp so the team can reply faster.': 'టీమ్ త్వరగా స్పందించేందుకు మీ విచారణ వాట్సాప్‌లో తెరుచుకుంటుంది.',
  'Opening WhatsApp so our team can reply faster.': 'మా టీమ్ త్వరగా స్పందించేందుకు వాట్సాప్ తెరవబడుతోంది.',
  'Opening WhatsApp to connect you with an agent.': 'మీను ఏజెంట్‌తో కలపడానికి వాట్సాప్ తెరవబడుతోంది.',
  'Please enter your requirement or type agent.': 'దయచేసి మీ అవసరాన్ని టైప్ చేయండి లేదా agent అని టైప్ చేయండి.',
  'We are opening WhatsApp with your enquiry details.': 'మీ విచారణ వివరాలతో వాట్సాప్‌ను తెరవుతున్నాము.',
  'Share your details': 'మీ వివరాలను పంచుకోండి'
});

Object.assign(phraseTranslations.hi, {
  'Continue': '\u091c\u093e\u0930\u0940 \u0930\u0916\u0947\u0902',
  'Connect with Agent': '\u090f\u091c\u0947\u0902\u091f \u0938\u0947 \u091c\u0941\u0921\u093c\u0947\u0902',
  'Connected with agent desk. Reference ID:': '\u090f\u091c\u0947\u0902\u091f \u0921\u0947\u0938\u094d\u0915 \u0938\u0947 \u091c\u0941\u0921\u093c \u0917\u090f. \u0930\u0947\u092b\u0930\u0947\u0902\u0938 ID:',
  'Please share your name, phone number and requirement if you have not already shared them.': '\u092f\u0926\u093f \u0906\u092a\u0928\u0947 \u092a\u0939\u0932\u0947 \u0938\u093e\u091d\u093e \u0928\u0939\u0940\u0902 \u0915\u093f\u092f\u093e \u0939\u0948, \u0924\u094b \u0915\u0943\u092a\u092f\u093e \u0905\u092a\u0928\u093e \u0928\u093e\u092e, \u092b\u094b\u0928 \u0928\u0902\u092c\u0930 \u0914\u0930 \u091c\u0930\u0942\u0930\u0924 \u0938\u093e\u091d\u093e \u0915\u0930\u0947\u0902.'
});

Object.assign(phraseTranslations.te, {
  'Continue': '\u0c15\u0c4a\u0c28\u0c38\u0c3e\u0c17\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
  'Connect with Agent': '\u0c0f\u0c1c\u0c46\u0c02\u0c1f\u0c4d\u200c\u0c24\u0c4b \u0c15\u0c28\u0c46\u0c15\u0c4d\u0c1f\u0c4d \u0c05\u0c35\u0c4d\u0c35\u0c02\u0c21\u0c3f',
  'Connected with agent desk. Reference ID:': '\u0c0f\u0c1c\u0c46\u0c02\u0c1f\u0c4d \u0c21\u0c46\u0c38\u0c4d\u0c15\u0c4d\u200c\u0c24\u0c4b \u0c15\u0c28\u0c46\u0c15\u0c4d\u0c1f\u0c4d \u0c05\u0c2f\u0c4d\u0c2f\u0c3e\u0c30\u0c41. \u0c30\u0c3f\u0c2b\u0c30\u0c46\u0c28\u0c4d\u0c38\u0c4d ID:',
  'Please share your name, phone number and requirement if you have not already shared them.': '\u0c2e\u0c40\u0c30\u0c41 \u0c07\u0c2a\u0c4d\u0c2a\u0c1f\u0c3f\u0c15\u0c47 \u0c2a\u0c02\u0c1a\u0c41\u0c15\u0c4b\u0c32\u0c47\u0c26\u0c28\u0c41\u0c15\u0c41\u0c02\u0c1f\u0c47, \u0c26\u0c2f\u0c1a\u0c47\u0c38\u0c3f \u0c2e\u0c40 \u0c2a\u0c47\u0c30\u0c41, \u0c2b\u0c4b\u0c28\u0c4d \u0c28\u0c02\u0c2c\u0c30\u0c4d \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c05\u0c35\u0c38\u0c30\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c2a\u0c02\u0c1a\u0c41\u0c15\u0c4b\u0c02\u0c21\u0c3f.'
});

Object.assign(phraseTranslations.hi, {
  'User Login': '\u092f\u0942\u091c\u0930 \u0932\u0949\u0917\u093f\u0928',
  'Admin Login': '\u090f\u0921\u092e\u093f\u0928 \u0932\u0949\u0917\u093f\u0928',
  'Create User Account': '\u092f\u0942\u091c\u0930 \u0916\u093e\u0924\u093e \u092c\u0928\u093e\u090f\u0902',
  'For clients with a registered Nidhi Path account.': '\u092a\u0902\u091c\u0940\u0915\u0943\u0924 \u0916\u093e\u0924\u0947 \u0935\u093e\u0932\u0947 \u0917\u094d\u0930\u093e\u0939\u0915\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f\u0964',
  'Sign up with your genuine email address. Verify the email before signing in.': '\u0905\u092a\u0928\u0947 \u0938\u0939\u0940 \u0908\u092e\u0947\u0932 \u092a\u0924\u0947 \u0938\u0947 \u0938\u093e\u0907\u0928 \u0905\u092a \u0915\u0930\u0947\u0902\u0964 \u0938\u093e\u0907\u0928 \u0907\u0928 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0908\u092e\u0947\u0932 \u0935\u0947\u0930\u093f\u092b\u093e\u0908 \u0915\u0930\u0947\u0902\u0964',
  'After signup, check your email and complete verification before login.': '\u0938\u093e\u0907\u0928 \u0905\u092a \u0915\u0947 \u092c\u093e\u0926, \u0932\u0949\u0917\u093f\u0928 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0905\u092a\u0928\u093e \u0908\u092e\u0947\u0932 \u091a\u0947\u0915 \u0915\u0930\u0915\u0947 \u0935\u0947\u0930\u093f\u092b\u093f\u0915\u0947\u0936\u0928 \u092a\u0942\u0930\u093e \u0915\u0930\u0947\u0902\u0964',
  'For authorized Nidhi Path team members only.': '\u0915\u0947\u0935\u0932 \u0905\u0927\u093f\u0915\u0943\u0924 \u091f\u0940\u092e \u0938\u0926\u0938\u094d\u092f\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f\u0964',
  'For account access help, contact our support team.': '\u0916\u093e\u0924\u093e \u090f\u0915\u094d\u0938\u0947\u0938 \u0938\u0939\u093e\u092f\u0924\u093e \u0915\u0947 \u0932\u093f\u090f \u0939\u092e\u093e\u0930\u0940 \u0938\u092a\u094b\u0930\u094d\u091f \u091f\u0940\u092e \u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0964',
  'Admin access is restricted to authorized team members.': '\u090f\u0921\u092e\u093f\u0928 \u090f\u0915\u094d\u0938\u0947\u0938 \u0915\u0947\u0935\u0932 \u0905\u0927\u093f\u0915\u0943\u0924 \u091f\u0940\u092e \u0938\u0926\u0938\u094d\u092f\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u0939\u0948\u0964'
});

Object.assign(phraseTranslations.te, {
  'User Login': '\u0c2f\u0c42\u0c1c\u0c30\u0c4d \u0c32\u0c3e\u0c17\u0c3f\u0c28\u0c4d',
  'Admin Login': '\u0c05\u0c21\u0c4d\u0c2e\u0c3f\u0c28\u0c4d \u0c32\u0c3e\u0c17\u0c3f\u0c28\u0c4d',
  'Create User Account': '\u0c2f\u0c42\u0c1c\u0c30\u0c4d \u0c16\u0c3e\u0c24\u0c3e \u0c38\u0c43\u0c37\u0c4d\u0c1f\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
  'For clients with a registered Nidhi Path account.': '\u0c30\u0c3f\u0c1c\u0c3f\u0c38\u0c4d\u0c1f\u0c30\u0c4d \u0c1a\u0c47\u0c38\u0c3f\u0c28 \u0c16\u0c3e\u0c24\u0c3e \u0c09\u0c28\u0c4d\u0c28 \u0c15\u0c4d\u0c32\u0c2f\u0c3f\u0c02\u0c1f\u0c4d\u0c32 \u0c15\u0c4b\u0c38\u0c02.',
  'Sign up with your genuine email address. Verify the email before signing in.': '\u0c2e\u0c40 \u0c38\u0c30\u0c48\u0c28 \u0c08\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d \u0c1a\u0c3f\u0c30\u0c41\u0c28\u0c3e\u0c2e\u0c3e\u0c24\u0c4b \u0c38\u0c48\u0c28\u0c4d \u0c05\u0c2a\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f. \u0c38\u0c48\u0c28\u0c4d \u0c07\u0c28\u0c4d \u0c1a\u0c47\u0c2f\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c2e\u0c41\u0c02\u0c26\u0c41 \u0c08\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d\u200c\u0c28\u0c41 \u0c35\u0c46\u0c30\u0c3f\u0c2b\u0c48 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
  'After signup, check your email and complete verification before login.': '\u0c38\u0c48\u0c28\u0c4d \u0c05\u0c2a\u0c4d \u0c24\u0c30\u0c4d\u0c35\u0c3e\u0c24, \u0c32\u0c3e\u0c17\u0c3f\u0c28\u0c4d \u0c2e\u0c41\u0c02\u0c26\u0c41 \u0c2e\u0c40 \u0c08\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d \u0c1a\u0c46\u0c15\u0c4d \u0c1a\u0c47\u0c38\u0c3f \u0c35\u0c46\u0c30\u0c3f\u0c2b\u0c3f\u0c15\u0c47\u0c37\u0c28\u0c4d \u0c2a\u0c42\u0c30\u0c4d\u0c24\u0c3f \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
  'For authorized Nidhi Path team members only.': '\u0c05\u0c27\u0c3f\u0c15\u0c43\u0c24 \u0c1f\u0c40\u0c2e\u0c4d \u0c38\u0c2d\u0c4d\u0c2f\u0c41\u0c32\u0c15\u0c41 \u0c2e\u0c3e\u0c24\u0c4d\u0c30\u0c2e\u0c47.',
  'For account access help, contact our support team.': '\u0c16\u0c3e\u0c24\u0c3e \u0c0e\u0c15\u0c4d\u0c38\u0c46\u0c38\u0c4d \u0c38\u0c39\u0c3e\u0c2f\u0c02 \u0c15\u0c4b\u0c38\u0c02 \u0c2e\u0c3e \u0c38\u0c2a\u0c4b\u0c30\u0c4d\u0c1f\u0c4d \u0c1f\u0c40\u0c2e\u0c4d\u200c\u0c28\u0c41 \u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.',
  'Admin access is restricted to authorized team members.': '\u0c05\u0c21\u0c4d\u0c2e\u0c3f\u0c28\u0c4d \u0c0e\u0c15\u0c4d\u0c38\u0c46\u0c38\u0c4d \u0c05\u0c27\u0c3f\u0c15\u0c43\u0c24 \u0c1f\u0c40\u0c2e\u0c4d \u0c38\u0c2d\u0c4d\u0c2f\u0c41\u0c32\u0c15\u0c41 \u0c2e\u0c3e\u0c24\u0c4d\u0c30\u0c2e\u0c47.'
});

const skipTranslationSelector = 'script, style, iframe, svg, canvas, input, textarea, select, option, .brand-name, [data-i18n], [data-i18n-btn], [data-no-translate]';

// Set initial language
let currentLang = 'en';
let currentLoginStatusKey = '';
const enquiryStorageKey = 'nidhi-enquiry-queue';
const liveChatStorageKey = 'nidhi-live-chat-queue';
let activeLiveChatReference = '';
const API_BASE_URL = window.NIDHI_API_BASE_URL || '';
const ADMIN_TOKEN_KEY = 'nidhi_admin_token';
const ADMIN_PROFILE_KEY = 'nidhi_admin_user';
const LEGACY_ADMIN_TOKEN_KEY = 'nidhi-admin-token';
const LEGACY_ADMIN_PROFILE_KEY = 'nidhi-admin-profile';
const USER_TOKEN_KEY = 'nidhi_user_token';
const USER_PROFILE_KEY = 'nidhi_user_profile';
const CHAT_ID_KEY = 'nidhi-active-chat-id';
const CHAT_CATEGORY_KEY = 'nidhi-active-chat-category';
let activeLiveChatId = '';
const FRONTEND_DEV_MODE = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const DEFAULT_SITE_SETTINGS = {
  business_name: 'Nidhi Path Loan Ventures',
  tagline: 'Way to Money',
  official_email: 'info@nidhipath.in',
  official_website: 'www.nidhipath.in',
  official_phone: '+91 97056 82595',
  whatsapp_number: '+91 97056 82595',
  address: '4th Floor, Prasad Plaza, Brooks Backside Lane, Konera Lakshmaya Gari Veedhi, Near United Telugu Kitchens Restaurant, 40-3/14-6/4C, Vijayawada, Andhra Pradesh 520010',
  working_hours: 'Monday to Saturday, 10:00 AM to 6:00 PM',
  support_message: 'Our team will contact you regarding your enquiry.',
  footer_text: 'Nidhi Path provides loan guidance and consultation. Loan approval is subject to multiple bank policies, eligibility, documents and credit assessment.',
  consent_text: 'By submitting this form, you agree that Nidhi Path Loan Ventures may contact you regarding your enquiry.',
  seo_title: 'Nidhi Path Loan Ventures',
  seo_description: 'Loan consultation, education loan guidance, and financial services.'
};
let publicSiteSettings = { ...DEFAULT_SITE_SETTINGS };

if (FRONTEND_DEV_MODE) {
  console.debug('Nidhi frontend script loaded');
}

Object.assign(translations.en, {
  'submit-enquiry': 'Submit enquiry',
  'submitting': 'Submitting...',
  'reference-id': 'Reference ID',
  'something-went-wrong': 'Something went wrong. Please try again.',
  'network-error': 'Network error. Please check your internet connection.',
  'valid-mobile-error': 'Please enter a valid mobile number.',
  'valid-email-error': 'Please enter a valid email address.',
  'required-fields-error': 'Please complete all required fields.',
  'success-enquiry-message': 'Requirement submitted successfully. Our team will contact you shortly.',
  'team-contact-shortly': 'Our team will contact you shortly.',
  'support-forwarded': 'Your enquiry has been forwarded to our support team.',
  'live-chat': 'Live Chat',
  'start-chat': 'Start Chat',
  'name-label': 'Name',
  'phone-label': 'Phone',
  'service-label': 'Service',
  'message-label': 'Message',
  'agent-reply-shortly': 'An agent will reply shortly.',
  'admin-login': 'Admin Login',
  'dashboard': 'Dashboard',
  'enquiries': 'Enquiries',
  'chats': 'Chats',
  'logout': 'Logout',
  'login-error': 'Enter a valid email address and password. New accounts need at least 8 password characters.'
});

Object.assign(translations.hi, {
  'submit-enquiry': '\u092a\u0942\u091b\u0924\u093e\u091b \u092d\u0947\u091c\u0947\u0902',
  'submitting': '\u092d\u0947\u091c\u093e \u091c\u093e \u0930\u0939\u093e \u0939\u0948...',
  'reference-id': '\u0930\u0947\u092b\u0930\u0947\u0902\u0938 ID',
  'something-went-wrong': '\u0915\u0941\u091b \u0917\u0932\u0924 \u0939\u094b \u0917\u092f\u093e. \u0915\u0943\u092a\u092f\u093e \u092b\u093f\u0930 \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902.',
  'network-error': '\u0928\u0947\u091f\u0935\u0930\u094d\u0915 \u0924\u094d\u0930\u0941\u091f\u093f. \u0915\u0943\u092a\u092f\u093e \u0905\u092a\u0928\u093e \u0907\u0902\u091f\u0930\u0928\u0947\u091f \u0915\u0928\u0947\u0915\u094d\u0936\u0928 \u091c\u093e\u0902\u091a\u0947\u0902.',
  'valid-mobile-error': '\u0915\u0943\u092a\u092f\u093e \u092e\u093e\u0928\u094d\u092f \u092e\u094b\u092c\u093e\u0907\u0932 \u0928\u0902\u092c\u0930 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902.',
  'valid-email-error': '\u0915\u0943\u092a\u092f\u093e \u092e\u093e\u0928\u094d\u092f \u0908\u092e\u0947\u0932 \u092a\u0924\u093e \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902.',
  'required-fields-error': '\u0915\u0943\u092a\u092f\u093e \u0938\u092d\u0940 \u0906\u0935\u0936\u094d\u092f\u0915 \u092b\u0940\u0932\u094d\u0921 \u092d\u0930\u0947\u0902.',
  'success-enquiry-message': '\u0927\u0928\u094d\u092f\u0935\u093e\u0926. \u0906\u092a\u0915\u0940 \u092a\u0942\u091b\u0924\u093e\u091b \u0938\u092b\u0932\u0924\u093e\u092a\u0942\u0930\u094d\u0935\u0915 \u092d\u0947\u091c \u0926\u0940 \u0917\u0908 \u0939\u0948.',
  'team-contact-shortly': '\u0939\u092e\u093e\u0930\u0940 \u091f\u0940\u092e \u091c\u0932\u094d\u0926 \u0939\u0940 \u0906\u092a\u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0917\u0940.',
  'support-forwarded': '\u0906\u092a\u0915\u0940 \u092a\u0942\u091b\u0924\u093e\u091b \u0938\u092a\u094b\u0930\u094d\u091f \u091f\u0940\u092e \u0915\u094b \u092d\u0947\u091c \u0926\u0940 \u0917\u0908 \u0939\u0948.',
  'live-chat': '\u0932\u093e\u0907\u0935 \u091a\u0948\u091f',
  'start-chat': '\u091a\u0948\u091f \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902',
  'service-label': '\u0938\u0947\u0935\u093e',
  'agent-reply-shortly': '\u090f\u091c\u0947\u0902\u091f \u091c\u0932\u094d\u0926 \u0939\u0940 \u091c\u0935\u093e\u092c \u0926\u0947\u0917\u093e.',
  'admin-login': '\u090f\u0921\u092e\u093f\u0928 \u0932\u0949\u0917\u093f\u0928',
  'dashboard': '\u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921',
  'enquiries': '\u092a\u0942\u091b\u0924\u093e\u091b',
  'chats': '\u091a\u0948\u091f',
  'logout': '\u0932\u0949\u0917\u0906\u0909\u091f'
});

Object.assign(translations.te, {
  'submit-enquiry': '\u0c35\u0c3f\u0c1a\u0c3e\u0c30\u0c23 \u0c2a\u0c02\u0c2a\u0c02\u0c21\u0c3f',
  'submitting': '\u0c2a\u0c02\u0c2a\u0c41\u0c24\u0c4b\u0c02\u0c26\u0c3f...',
  'reference-id': '\u0c30\u0c3f\u0c2b\u0c30\u0c46\u0c28\u0c4d\u0c38\u0c4d ID',
  'something-went-wrong': '\u0c0f\u0c26\u0c4b \u0c24\u0c2a\u0c4d\u0c2a\u0c41 \u0c1c\u0c30\u0c3f\u0c17\u0c3f\u0c02\u0c26\u0c3f. \u0c26\u0c2f\u0c1a\u0c47\u0c38\u0c3f \u0c2e\u0c33\u0c4d\u0c32\u0c40 \u0c2a\u0c4d\u0c30\u0c2f\u0c24\u0c4d\u0c28\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.',
  'network-error': '\u0c28\u0c46\u0c1f\u0c4d\u200c\u0c35\u0c30\u0c4d\u0c15\u0c4d \u0c32\u0c4b\u0c2a\u0c02. \u0c26\u0c2f\u0c1a\u0c47\u0c38\u0c3f \u0c2e\u0c40 \u0c07\u0c02\u0c1f\u0c30\u0c4d\u0c28\u0c46\u0c1f\u0c4d \u0c15\u0c28\u0c46\u0c15\u0c4d\u0c37\u0c28\u0c4d\u200c\u0c28\u0c41 \u0c1a\u0c46\u0c15\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
  'valid-mobile-error': '\u0c26\u0c2f\u0c1a\u0c47\u0c38\u0c3f \u0c38\u0c30\u0c48\u0c28 \u0c2e\u0c4a\u0c2c\u0c48\u0c32\u0c4d \u0c28\u0c02\u0c2c\u0c30\u0c4d \u0c28\u0c2e\u0c4b\u0c26\u0c41 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
  'valid-email-error': '\u0c26\u0c2f\u0c1a\u0c47\u0c38\u0c3f \u0c38\u0c30\u0c48\u0c28 \u0c08\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d \u0c1a\u0c3f\u0c30\u0c41\u0c28\u0c3e\u0c2e\u0c3e \u0c28\u0c2e\u0c4b\u0c26\u0c41 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
  'required-fields-error': '\u0c26\u0c2f\u0c1a\u0c47\u0c38\u0c3f \u0c05\u0c35\u0c38\u0c30\u0c2e\u0c48\u0c28 \u0c05\u0c28\u0c4d\u0c28\u0c3f \u0c2b\u0c40\u0c32\u0c4d\u0c21\u0c4d\u0c32\u0c28\u0c41 \u0c2a\u0c42\u0c30\u0c4d\u0c24\u0c3f \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
  'success-enquiry-message': '\u0c27\u0c28\u0c4d\u0c2f\u0c35\u0c3e\u0c26\u0c3e\u0c32\u0c41. \u0c2e\u0c40 \u0c35\u0c3f\u0c1a\u0c3e\u0c30\u0c23 \u0c35\u0c3f\u0c1c\u0c2f\u0c35\u0c02\u0c24\u0c02\u0c17\u0c3e \u0c38\u0c2e\u0c30\u0c4d\u0c2a\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c02\u0c26\u0c3f.',
  'team-contact-shortly': '\u0c2e\u0c3e \u0c1f\u0c40\u0c2e\u0c4d \u0c24\u0c4d\u0c35\u0c30\u0c32\u0c4b \u0c2e\u0c40\u0c24\u0c4b \u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c02\u0c26\u0c3f.',
  'support-forwarded': '\u0c2e\u0c40 \u0c35\u0c3f\u0c1a\u0c3e\u0c30\u0c23 \u0c2e\u0c3e \u0c38\u0c2a\u0c4b\u0c30\u0c4d\u0c1f\u0c4d \u0c1f\u0c40\u0c2e\u0c4d\u200c\u0c15\u0c41 \u0c2a\u0c02\u0c2a\u0c2c\u0c21\u0c3f\u0c02\u0c26\u0c3f.',
  'live-chat': '\u0c32\u0c48\u0c35\u0c4d \u0c1a\u0c3e\u0c1f\u0c4d',
  'start-chat': '\u0c1a\u0c3e\u0c1f\u0c4d \u0c2a\u0c4d\u0c30\u0c3e\u0c30\u0c02\u0c2d\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
  'service-label': '\u0c38\u0c47\u0c35',
  'agent-reply-shortly': '\u0c0f\u0c1c\u0c46\u0c02\u0c1f\u0c4d \u0c24\u0c4d\u0c35\u0c30\u0c32\u0c4b \u0c2a\u0c4d\u0c30\u0c24\u0c3f\u0c38\u0c4d\u0c2a\u0c02\u0c26\u0c3f\u0c38\u0c4d\u0c24\u0c3e\u0c30\u0c41.',
  'admin-login': '\u0c05\u0c21\u0c4d\u0c2e\u0c3f\u0c28\u0c4d \u0c32\u0c3e\u0c17\u0c3f\u0c28\u0c4d',
  'dashboard': '\u0c21\u0c3e\u0c37\u0c4d\u200c\u0c2c\u0c4b\u0c30\u0c4d\u0c21\u0c4d',
  'enquiries': '\u0c35\u0c3f\u0c1a\u0c3e\u0c30\u0c23\u0c32\u0c41',
  'chats': '\u0c1a\u0c3e\u0c1f\u0c4d\u0c32\u0c41',
  'logout': '\u0c32\u0c3e\u0c17\u0c4d \u0c05\u0c35\u0c41\u0c1f\u0c4d'
});

Object.assign(translations.hi, {
  'sign-up': '\u0938\u093e\u0907\u0928 \u0905\u092a',
  'create-account': '\u0916\u093e\u0924\u093e \u092c\u0928\u093e\u090f\u0902',
  'confirm-password': '\u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0930\u0947\u0902',
  'signup-consent': '\u0916\u093e\u0924\u093e \u092c\u0928\u093e\u0915\u0930, \u0906\u092a \u0938\u0939\u092e\u0924 \u0939\u0948\u0902 \u0915\u093f Nidhi Path Loan Ventures \u0906\u092a\u0915\u0940 \u0932\u094b\u0928 \u0938\u0947\u0935\u093e\u0913\u0902 \u0914\u0930 \u0916\u093e\u0924\u093e \u090f\u0915\u094d\u0938\u0947\u0938 \u0915\u0947 \u0932\u093f\u090f \u0906\u092a\u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930 \u0938\u0915\u0924\u093e \u0939\u0948\u0964',
  'password-mismatch': '\u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u092e\u0947\u0932 \u0928\u0939\u0940\u0902 \u0916\u093e\u0924\u0947\u0964',
  'signup-success': '\u0916\u093e\u0924\u093e \u092c\u0928 \u0917\u092f\u093e\u0964 \u0938\u093e\u0907\u0928 \u0907\u0928 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0915\u0943\u092a\u092f\u093e \u0905\u092a\u0928\u093e \u0908\u092e\u0947\u0932 \u0935\u0947\u0930\u093f\u092b\u093e\u0908 \u0915\u0930\u0947\u0902\u0964',
  'email-verification-required': '\u0938\u093e\u0907\u0928 \u0907\u0928 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0915\u0943\u092a\u092f\u093e \u0905\u092a\u0928\u093e \u0908\u092e\u0947\u0932 \u0935\u0947\u0930\u093f\u092b\u093e\u0908 \u0915\u0930\u0947\u0902\u0964',
  'login-security-title': '\u0935\u0947\u0930\u093f\u092b\u093e\u0907\u0921 \u0908\u092e\u0947\u0932 \u090f\u0915\u094d\u0938\u0947\u0938',
  'login-security-copy': '\u0928\u090f \u0917\u094d\u0930\u093e\u0939\u0915 \u0938\u093e\u0907\u0928 \u0905\u092a \u092e\u0947\u0902 \u0932\u0949\u0917\u093f\u0928 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0908\u092e\u0947\u0932 \u0935\u0947\u0930\u093f\u092b\u093f\u0915\u0947\u0936\u0928 \u0939\u094b\u0924\u093e \u0939\u0948\u0964',
  'login-trust-copy': '\u0906\u092a\u0915\u0947 \u0935\u093f\u0935\u0930\u0923 \u0915\u0947\u0935\u0932 \u0916\u093e\u0924\u093e \u090f\u0915\u094d\u0938\u0947\u0938 \u0914\u0930 \u0932\u094b\u0928 \u0938\u0939\u093e\u092f\u0924\u093e \u0915\u0947 \u0932\u093f\u090f \u0909\u092a\u092f\u094b\u0917 \u0915\u093f\u090f \u091c\u093e\u0924\u0947 \u0939\u0948\u0902\u0964',
  'new-customer-prompt': '\u0928\u090f \u0917\u094d\u0930\u093e\u0939\u0915?',
  'already-registered-prompt': '\u092a\u0939\u0932\u0947 \u0938\u0947 \u092a\u0902\u091c\u0940\u0915\u0943\u0924?',
  'login-note': '\u0915\u0947\u0935\u0932 \u0905\u0927\u093f\u0915\u0943\u0924 \u0909\u092a\u092f\u094b\u0917\u0915\u0930\u094d\u0924\u093e \u0938\u093e\u0907\u0928 \u0907\u0928 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964 \u090f\u0915\u094d\u0938\u0947\u0938 \u0938\u0939\u093e\u092f\u0924\u093e \u0915\u0947 \u0932\u093f\u090f \u0938\u092a\u094b\u0930\u094d\u091f \u091f\u0940\u092e \u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0964',
  'login-success': '\u0938\u093e\u0907\u0928 \u0907\u0928 \u0938\u092b\u0932\u0964 \u0930\u0940\u0921\u093e\u092f\u0930\u0947\u0915\u094d\u091f \u0915\u093f\u092f\u093e \u091c\u093e \u0930\u0939\u093e \u0939\u0948...'
});

Object.assign(translations.te, {
  'sign-up': '\u0c38\u0c48\u0c28\u0c4d \u0c05\u0c2a\u0c4d',
  'create-account': '\u0c16\u0c3e\u0c24\u0c3e \u0c38\u0c43\u0c37\u0c4d\u0c1f\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
  'confirm-password': '\u0c2a\u0c3e\u0c38\u0c4d\u200c\u0c35\u0c30\u0c4d\u0c21\u0c4d \u0c28\u0c3f\u0c30\u0c4d\u0c27\u0c3e\u0c30\u0c23',
  'signup-consent': '\u0c16\u0c3e\u0c24\u0c3e \u0c38\u0c43\u0c37\u0c4d\u0c1f\u0c3f\u0c02\u0c1a\u0c21\u0c02 \u0c26\u0c4d\u0c35\u0c3e\u0c30\u0c3e, Nidhi Path Loan Ventures \u0c2e\u0c40 \u0c32\u0c4b\u0c28\u0c4d \u0c38\u0c47\u0c35\u0c32\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c16\u0c3e\u0c24\u0c3e \u0c0e\u0c15\u0c4d\u0c38\u0c46\u0c38\u0c4d \u0c17\u0c41\u0c30\u0c3f\u0c02\u0c1a\u0c3f \u0c2e\u0c40\u0c28\u0c41 \u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c1a\u0c35\u0c1a\u0c4d\u0c1a\u0c28\u0c3f \u0c2e\u0c40\u0c30\u0c41 \u0c05\u0c02\u0c17\u0c40\u0c15\u0c30\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c30\u0c41.',
  'password-mismatch': '\u0c2a\u0c3e\u0c38\u0c4d\u200c\u0c35\u0c30\u0c4d\u0c21\u0c4d\u0c32\u0c41 \u0c38\u0c30\u0c3f\u0c2a\u0c4b\u0c32\u0c47\u0c26\u0c41.',
  'signup-success': '\u0c16\u0c3e\u0c24\u0c3e \u0c38\u0c43\u0c37\u0c4d\u0c1f\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c02\u0c26\u0c3f. \u0c38\u0c48\u0c28\u0c4d \u0c07\u0c28\u0c4d \u0c1a\u0c47\u0c2f\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c2e\u0c41\u0c02\u0c26\u0c41 \u0c26\u0c2f\u0c1a\u0c47\u0c38\u0c3f \u0c2e\u0c40 \u0c08\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d\u200c\u0c28\u0c41 \u0c35\u0c46\u0c30\u0c3f\u0c2b\u0c48 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
  'email-verification-required': '\u0c38\u0c48\u0c28\u0c4d \u0c07\u0c28\u0c4d \u0c1a\u0c47\u0c2f\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c2e\u0c41\u0c02\u0c26\u0c41 \u0c26\u0c2f\u0c1a\u0c47\u0c38\u0c3f \u0c2e\u0c40 \u0c08\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d\u200c\u0c28\u0c41 \u0c35\u0c46\u0c30\u0c3f\u0c2b\u0c48 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
  'login-security-title': '\u0c35\u0c46\u0c30\u0c3f\u0c2b\u0c48 \u0c1a\u0c47\u0c38\u0c3f\u0c28 \u0c08\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d \u0c0e\u0c15\u0c4d\u0c38\u0c46\u0c38\u0c4d',
  'login-security-copy': '\u0c15\u0c4a\u0c24\u0c4d\u0c24 \u0c15\u0c38\u0c4d\u0c1f\u0c2e\u0c30\u0c4d \u0c38\u0c48\u0c28\u0c4d \u0c05\u0c2a\u0c4d\u200c\u0c32\u0c4b \u0c32\u0c3e\u0c17\u0c3f\u0c28\u0c4d \u0c2e\u0c41\u0c02\u0c26\u0c41 \u0c08\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d \u0c35\u0c46\u0c30\u0c3f\u0c2b\u0c3f\u0c15\u0c47\u0c37\u0c28\u0c4d \u0c09\u0c02\u0c1f\u0c41\u0c02\u0c26\u0c3f.',
  'login-trust-copy': '\u0c2e\u0c40 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41 \u0c16\u0c3e\u0c24\u0c3e \u0c0e\u0c15\u0c4d\u0c38\u0c46\u0c38\u0c4d \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c32\u0c4b\u0c28\u0c4d \u0c38\u0c39\u0c3e\u0c2f\u0c02 \u0c15\u0c4b\u0c38\u0c2e\u0c47 \u0c09\u0c2a\u0c2f\u0c4b\u0c17\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c24\u0c3e\u0c2f\u0c3f.',
  'new-customer-prompt': '\u0c15\u0c4a\u0c24\u0c4d\u0c24 \u0c15\u0c38\u0c4d\u0c1f\u0c2e\u0c30\u0c4d?',
  'already-registered-prompt': '\u0c07\u0c2a\u0c4d\u0c2a\u0c1f\u0c3f\u0c15\u0c47 \u0c30\u0c3f\u0c1c\u0c3f\u0c38\u0c4d\u0c1f\u0c30\u0c4d \u0c05\u0c2f\u0c4d\u0c2f\u0c3e\u0c30\u0c3e?',
  'login-note': '\u0c05\u0c27\u0c3f\u0c15\u0c43\u0c24 \u0c35\u0c3f\u0c28\u0c3f\u0c2f\u0c4b\u0c17\u0c26\u0c3e\u0c30\u0c41\u0c32\u0c41 \u0c2e\u0c3e\u0c24\u0c4d\u0c30\u0c2e\u0c47 \u0c38\u0c48\u0c28\u0c4d \u0c07\u0c28\u0c4d \u0c1a\u0c47\u0c2f\u0c17\u0c32\u0c30\u0c41. \u0c0e\u0c15\u0c4d\u0c38\u0c46\u0c38\u0c4d \u0c38\u0c39\u0c3e\u0c2f\u0c02 \u0c15\u0c4b\u0c38\u0c02 \u0c2e\u0c3e \u0c38\u0c2a\u0c4b\u0c30\u0c4d\u0c1f\u0c4d \u0c1f\u0c40\u0c2e\u0c4d\u200c\u0c28\u0c41 \u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.',
  'login-success': '\u0c38\u0c48\u0c28\u0c4d \u0c07\u0c28\u0c4d \u0c35\u0c3f\u0c1c\u0c2f\u0c35\u0c02\u0c24\u0c02. \u0c30\u0c40\u0c21\u0c48\u0c30\u0c46\u0c15\u0c4d\u0c1f\u0c4d \u0c1a\u0c47\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c02...'
});

function getTranslation(lang, key) {
  return postProcessTranslation(lang, translations[lang]?.[key] ?? translations.en?.[key] ?? key);
}

function repairMojibakeText(text) {
  if (typeof text !== 'string' || !/[ÃÂà]/.test(text)) {
    return text;
  }

  try {
    if (typeof TextDecoder === 'undefined') {
      return text;
    }
    const cp1252Bytes = {
      '\u20AC': 0x80,
      '\u201A': 0x82,
      '\u0192': 0x83,
      '\u201E': 0x84,
      '\u2026': 0x85,
      '\u2020': 0x86,
      '\u2021': 0x87,
      '\u02C6': 0x88,
      '\u2030': 0x89,
      '\u0160': 0x8a,
      '\u2039': 0x8b,
      '\u0152': 0x8c,
      '\u017D': 0x8e,
      '\u2018': 0x91,
      '\u2019': 0x92,
      '\u201C': 0x93,
      '\u201D': 0x94,
      '\u2022': 0x95,
      '\u2013': 0x96,
      '\u2014': 0x97,
      '\u02DC': 0x98,
      '\u2122': 0x99,
      '\u0161': 0x9a,
      '\u203A': 0x9b,
      '\u0153': 0x9c,
      '\u017E': 0x9e,
      '\u0178': 0x9f
    };
    const bytes = new Uint8Array(Array.from(text, (char) => cp1252Bytes[char] ?? (char.charCodeAt(0) & 0xff)));
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    const looksRecovered = /[\u0900-\u0D7F]/.test(decoded) && !decoded.includes('\uFFFD');
    return looksRecovered ? decoded : text;
  } catch (error) {
    return text;
  }
}

function postProcessTranslation(lang, text) {
  if (typeof text !== 'string') {
    return text;
  }

  text = repairMojibakeText(text);

  if (lang === 'en') {
    return text;
  }

  const glossary = lang === 'hi'
    ? {
        'NEED SORTING': 'आवश्यकता वर्गीकरण',
        'PREPARATION VIEW': 'तैयारी दृश्य',
        'NEXT-STEP PLAN': 'अगले कदम की योजना',
        'Need Sorting': 'आवश्यकता वर्गीकरण',
        'Preparation View': 'तैयारी दृश्य',
        'Next-Step Plan': 'अगले कदम की योजना',
        'EMI': 'EMI',
        'Docs': 'दस्तावेज़',
        'KYC': 'KYC',
        'multiple banks': 'कई बैंक',
        'CRM': 'CRM',
        'Trust': 'भरोसा रखें',
        'Support': 'समर्थन',
        'Local': 'स्थानीय',
        'Match': 'मिलान',
        'Enquiry': 'पूछताछ',
        'Profile': 'प्रोफाइल',
        'Action': 'कार्रवाई',
        'Nidhi Path': 'निधि पथ'
      }
    : {
        'NEED SORTING': 'అవసరాల వర్గీకరణ',
        'PREPARATION VIEW': 'సిద్ధత వీక్షణ',
        'NEXT-STEP PLAN': 'తదుపరి దశ ప్రణాళిక',
        'Need Sorting': 'అవసరాల వర్గీకరణ',
        'Preparation View': 'సిద్ధత వీక్షణ',
        'Next-Step Plan': 'తదుపరి దశ ప్రణాళిక',
        'EMI': 'EMI',
        'Docs': 'పత్రాలు',
        'KYC': 'KYC',
        'multiple banks': 'అనేక బ్యాంకులు',
        'CRM': 'CRM',
        'Trust': 'నమ్మండి',
        'Support': 'మద్దతు',
        'Local': 'స్థానిక',
        'Match': 'మ్యాచ్',
        'Enquiry': 'విచారణ',
        'Profile': 'ప్రొఫైల్',
        'Action': 'చర్య',
        'Nidhi Path': 'నిధి పథ్'
      };

  const processed = Object.entries(glossary).reduce((value, [english, translated]) => {
    const pattern = new RegExp(`(^|[^A-Za-z])${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[^A-Za-z]|$)`, 'g');
    return value.replace(pattern, `$1${repairMojibakeText(translated)}`);
  }, text);

  return repairMojibakeText(processed);
}

function renderTranslatedText(el, text) {
  if (text.includes('{{brand}}')) {
    el.innerHTML = text.replace(
      '{{brand}}',
      `<span class="brand-name brand-name-inline">${escapeHtml(getConfiguredBrandName())}</span>`
    );
    return;
  }

  el.textContent = text;
}

function getPhraseTranslation(lang, text) {
  if (lang === 'en') {
    return text;
  }

  const normalized = text.replace(/\s+/g, ' ').trim();
  const translated = phraseTranslations[lang]?.[text]
    ?? phraseTranslations[lang]?.[normalized]
    ?? translations[lang]?.[text]
    ?? translations[lang]?.[normalized]
    ?? translateKnownFragments(lang, normalized)
    ?? text;
  return postProcessTranslation(lang, translated);
}

function translateKnownFragments(lang, text) {
  const dictionary = phraseTranslations[lang];
  if (!dictionary || !text) {
    return null;
  }

  let translatedText = text;
  Object.keys(dictionary)
    .filter((key) => key.length > 18 && translatedText.includes(key))
    .sort((a, b) => b.length - a.length)
    .forEach((key) => {
      translatedText = translatedText.replaceAll(key, dictionary[key]);
    });

  return translatedText === text ? null : translatedText;
}

function preserveOuterWhitespace(original, translated) {
  const leading = original.match(/^\s*/)?.[0] ?? '';
  const trailing = original.match(/\s*$/)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

function shouldSkipTranslationNode(node) {
  const parent = node.parentElement;
  return !parent || Boolean(parent.closest(skipTranslationSelector));
}

function translatePlainTextNodes(lang) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (shouldSkipTranslationNode(node)) {
          return NodeFilter.FILTER_REJECT;
        }

        return node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const original = originalTextNodes.get(node) ?? node.nodeValue;
    originalTextNodes.set(node, original);

    const trimmedOriginal = original.trim();
    const translated = getPhraseTranslation(lang, trimmedOriginal);
    node.nodeValue = lang === 'en'
      ? original
      : preserveOuterWhitespace(original, translated);
  });
}

function translateElementAttributes(lang) {
  document.querySelectorAll('[placeholder], [aria-label], [title], [alt]').forEach((el) => {
    if (el.hasAttribute('data-placeholder-i18n')) {
      return;
    }

    if (el.closest(skipTranslationSelector) && !el.matches('input, textarea')) {
      return;
    }

    ['placeholder', 'aria-label', 'title', 'alt'].forEach((attributeName) => {
      if (!el.hasAttribute(attributeName)) {
        return;
      }

      const originalMap = originalAttributes.get(el) ?? {};
      if (!originalMap[attributeName]) {
        originalMap[attributeName] = el.getAttribute(attributeName);
        originalAttributes.set(el, originalMap);
      }

      const original = originalMap[attributeName];
      el.setAttribute(attributeName, lang === 'en' ? original : getPhraseTranslation(lang, original));
    });
  });
}

function translateStaticPage(lang) {
  translateDocumentTitle(lang);
  translatePlainTextNodes(lang);
  translateElementAttributes(lang);
  updateLocalizedBrandText(lang);
}

function translateDocumentTitle(lang) {
  const originalTitle = document.documentElement.dataset.originalTitle || document.title;
  document.documentElement.dataset.originalTitle = originalTitle;
  document.title = lang === 'en' ? originalTitle : getPhraseTranslation(lang, originalTitle);
}

function updateLocalizedBrandText(lang) {
  const configuredBrand = getConfiguredBrandName();
  const isDefaultBrand = configuredBrand === getConfiguredBrandName(DEFAULT_SITE_SETTINGS.business_name);
  const brandText = isDefaultBrand
    ? (lang === 'hi' ? 'निधि पथ' : lang === 'te' ? 'నిధి పథ్' : configuredBrand)
    : configuredBrand;
  document.querySelectorAll('.brand-text, .brand-name-inline').forEach((el) => {
    if (el.querySelector('img')) {
      return;
    }
    el.textContent = brandText;
  });
}

function translateActiveHeroWord(lang) {
  const word = document.getElementById('hero-rotating-word');
  const activeSlide = document.querySelector('.hero-story-slide.is-active');
  if (!word || !activeSlide) {
    return;
  }

  const heroWords = ['Ambition', 'Direction', 'Milestone', 'Momentum'];
  const activeIndex = Number(activeSlide.getAttribute('data-hero-index') || 0);
  const translatedWord = getPhraseTranslation(lang, heroWords[activeIndex] || heroWords[0]);

  if (typeof window.NIDHI_renderHeroWord === 'function') {
    window.NIDHI_renderHeroWord(translatedWord);
  } else {
    word.textContent = translatedWord;
  }
}

function persistLanguage(lang) {
  try {
    window.localStorage.setItem('nidhi-language', lang);
  } catch (error) {
    // Ignore storage issues and keep the page usable.
  }
}

function getSavedLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem('nidhi-language');
    return translations[savedLanguage] ? savedLanguage : null;
  } catch (error) {
    return null;
  }
}

function cleanEnquiryValue(value) {
  return String(value ?? '').trim();
}

function createEnquiryReference() {
  return `NP-${Date.now().toString(36).toUpperCase()}`;
}

function getCurrentSourcePage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL.replace(/\/$/, '')}${normalizedPath}`;
}

async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
  } catch (error) {
    const networkError = new Error(getTranslation(currentLang, 'network-error'));
    networkError.code = 'NETWORK';
    throw networkError;
  }

  let rawText = "";
  let data = {};
  try {
    rawText = await response.text();
    data = rawText ? JSON.parse(rawText) : {};
  } catch (error) {
    data = {};
  }

  if (!response.ok || data.success === false) {
    console.error('API request failed', {
      path,
      status: response.status,
      response: data,
      rawText: Object.keys(data).length ? '' : rawText.slice(0, 500)
    });
    const requestError = new Error(data.error || getTranslation(currentLang, 'something-went-wrong'));
    requestError.status = response.status;
    requestError.code = data.code || '';
    throw requestError;
  }

  return data;
}

function normalizeIndianPhone(phone) {
  const raw = cleanEnquiryValue(phone).replace(/[()\-\s]/g, '');
  let digits = raw;

  if (digits.startsWith('+91')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  }

  if (!/^[6-9]\d{9}$/.test(digits)) {
    return '';
  }

  return `+91${digits}`;
}

function isValidOptionalEmail(email) {
  const value = cleanEnquiryValue(email);
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function buildEnquiryPayload(values = {}, sourceForm = 'quick_enquiry') {
  const fullName = cleanEnquiryValue(values.fullName || values.name);
  const name = cleanEnquiryValue(values.name || values.fullName);
  const serviceNeeded = cleanEnquiryValue(values.serviceNeeded || values.service);
  const service = cleanEnquiryValue(values.service || values.serviceNeeded);
  const approxLoanAmount = cleanEnquiryValue(values.approxLoanAmount || values.loanAmount || values.amount);
  const loanAmount = cleanEnquiryValue(values.loanAmount || values.approxLoanAmount || values.amount);
  const notes = cleanEnquiryValue(values.notes || values.message);
  const message = cleanEnquiryValue(values.message || values.notes);

  return {
    fullName: fullName || name,
    name: name || fullName,
    phone: normalizeIndianPhone(values.phone),
    email: cleanEnquiryValue(values.email),
    serviceNeeded: serviceNeeded || service,
    service: service || serviceNeeded,
    approxLoanAmount: approxLoanAmount || loanAmount,
    loanAmount: loanAmount || approxLoanAmount,
    notes: notes || message,
    message: message || notes,
    sourcePage: cleanEnquiryValue(values.sourcePage) || getCurrentSourcePage(),
    sourceForm,
    preferredLanguage: currentLang,
    createdFrom: 'website',
    city: cleanEnquiryValue(values.city),
    employmentType: cleanEnquiryValue(values.employmentType),
    monthlyIncome: cleanEnquiryValue(values.monthlyIncome),
    preferredContactTime: cleanEnquiryValue(values.preferredContactTime),
    educationLevel: cleanEnquiryValue(values.educationLevel),
    countryPreference: cleanEnquiryValue(values.countryPreference),
    loanType: cleanEnquiryValue(values.loanType),
    tenure: cleanEnquiryValue(values.tenure),
    companyWebsite: cleanEnquiryValue(values.companyWebsite),
    metadata: values.metadata || {}
  };
}

function validateEnquiryPayload(payload, options = {}) {
  const requireEmail = Boolean(options.requireEmail);
  const requiredValues = [payload.fullName || payload.name, payload.phone, payload.serviceNeeded || payload.service];

  if (requiredValues.some((value) => !cleanEnquiryValue(value))) {
    return { valid: false, message: getTranslation(currentLang, 'required-fields-error') };
  }

  if (!payload.phone) {
    return { valid: false, message: getTranslation(currentLang, 'valid-mobile-error') };
  }

  if (requireEmail && !payload.email) {
    return { valid: false, message: getTranslation(currentLang, 'valid-email-error') };
  }

  if (!isValidOptionalEmail(payload.email)) {
    return { valid: false, message: getTranslation(currentLang, 'valid-email-error') };
  }

  if (payload.companyWebsite) {
    return { valid: false, message: getTranslation(currentLang, 'something-went-wrong') };
  }

  return { valid: true, message: '' };
}

function setStatusElement(element, message, type = '') {
  if (!element) {
    return;
  }

  element.textContent = message || '';
  element.classList.remove('is-success', 'is-error', 'is-info');
  if (type) {
    element.classList.add(type);
  }
}

function getOrCreateFormStatus(form, id) {
  if (!form) {
    return null;
  }
  let status = id ? document.getElementById(id) : form.querySelector('.form-status');
  if (!status) {
    status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('aria-live', 'polite');
    if (id) {
      status.id = id;
    }
    form.appendChild(status);
  }
  return status;
}

function getServiceFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return cleanEnquiryValue(params.get('service'));
}

function getSourceFormFromUrl(defaultSourceForm = 'contact_form') {
  const params = new URLSearchParams(window.location.search);
  const source = cleanEnquiryValue(params.get('source'));
  const allowed = ['contact_form', 'contact_page', 'service_enquiry', 'loan_consultation', 'eligibility_enquiry'];
  return allowed.includes(source) ? source : defaultSourceForm;
}

function setSelectValueByText(select, value) {
  if (!select || !value) {
    return;
  }
  const normalized = value.toLowerCase();
  const match = Array.from(select.options).find((option) => option.value.toLowerCase() === normalized || option.textContent.toLowerCase() === normalized);
  if (match) {
    select.value = match.value;
  }
}

function prefillServiceFields(service) {
  if (!service) {
    return;
  }
  ['contact-service', 'quick-lead-service', 'chat-start-service'].forEach((id) => {
    setSelectValueByText(document.getElementById(id), service);
  });
  const applyService = document.getElementById('apply-service');
  if (applyService) {
    applyService.value = service;
  }
}

function prepareContextualLinks() {
  const pageService = getCurrentPageName() === 'index.html'
    ? 'Education Loan'
    : cleanEnquiryValue(document.querySelector('main h1')?.textContent);
  document.querySelectorAll('.page-cta a[href="contact.html"], .home-contact-cta a[href="contact.html"]').forEach((link) => {
    const params = new URLSearchParams();
    if (pageService && !['Contact Us', 'Services', 'About Us'].includes(pageService)) {
      params.set('service', pageService);
    }
    const sourceForm = pageService === 'Loan Consultation'
      ? 'loan_consultation'
      : document.body.classList.contains('service-detail-page') ? 'service_enquiry' : 'eligibility_enquiry';
    params.set('source', sourceForm);
    link.href = `contact.html?${params.toString()}`;
  });
}

function getEligibilityHref(service = '') {
  const params = new URLSearchParams();
  const serviceName = cleanEnquiryValue(service);
  if (serviceName) params.set('service', serviceName);
  const query = params.toString();
  return getCurrentPageName() === 'eligibility.html'
    ? '#advanced-emi-planner'
    : `eligibility.html${query ? `?${query}` : ''}#advanced-emi-planner`;
}

function serviceUsesEligibility(service = '') {
  const serviceName = cleanEnquiryValue(service);
  return Boolean(serviceName) && serviceName !== 'Loan Consultation';
}

const serviceCardFallbacks = [
  {
    title: 'Education Loan',
    description: 'Guidance for domestic and abroad education loans, admission proof, fee schedules, living cost planning, and repayment discussion.'
  },
  {
    title: 'Personal Loan',
    description: 'Support for personal loan eligibility discussion, documentation readiness, income proof review, and repayment planning.'
  },
  {
    title: 'Business Loan',
    description: 'Business funding guidance for self-employed customers, company documents, turnover review, bank discussion, and repayment planning.'
  },
  {
    title: 'Home Loan',
    description: 'Home loan consultation for eligibility, property documentation, income assessment, EMI planning, and bank process support.'
  },
  {
    title: 'Mutual Funds',
    description: 'Goal-based mutual fund consultation for customers who want to understand risk, documentation, planning suitability, and long-term investment direction.'
  },
  {
    title: 'Insurance',
    description: 'Basic insurance consultation to help customers understand suitable protection options linked to family and financial planning.'
  },
  {
    title: 'Loan Comparison Assistance',
    description: 'Support in comparing multiple bank options based on eligibility, documentation, interest rate, processing fee, and repayment comfort.'
  },
  {
    title: 'Documentation Support',
    description: 'Help with understanding and preparing KYC, income documents, bank statements, admission proof, and other supporting loan papers.'
  }
];

function repairServiceCards() {
  document.querySelectorAll('.service-grid > .service-link-card').forEach((card, index) => {
    const contentTarget = card.querySelector('.service-card-main-link') || card;
    const fallback = serviceCardFallbacks[index];
    if (!fallback) return;

    const title = contentTarget.querySelector('h3');
    const description = contentTarget.querySelector('p');
    const hasBrokenWebsiteText = /www\.nidhipath\.in|https?:\/\/(www\.)?nidhipath\.in/i.test(contentTarget.textContent || '');
    const isMissingContent = !title || !description || !cleanEnquiryValue(title.textContent) || !cleanEnquiryValue(description.textContent);

    if (!hasBrokenWebsiteText && !isMissingContent) {
      return;
    }

    const media = contentTarget.querySelector('.service-card-media')?.outerHTML
      || '<span class="service-card-media" aria-hidden="true"><span class="service-bg service-bg-one"></span><span class="service-bg service-bg-two"></span><span class="service-bg service-bg-three"></span></span>';
    contentTarget.innerHTML = `
      ${media}
      <h3>${escapeHtml(fallback.title)}</h3>
      <p>${escapeHtml(fallback.description)}</p>
      <span class="btn-like">Open Details</span>
    `;
  });
}

function enhanceEligibilityCtas() {
  repairServiceCards();

  document.querySelectorAll('.service-grid > a.service-link-card[href]').forEach((card) => {
    const serviceName = cleanEnquiryValue(card.querySelector('h3')?.textContent);
    const detailsLink = document.createElement('a');
    detailsLink.className = 'service-card-main-link';
    detailsLink.setAttribute('href', card.getAttribute('href') || card.href);
    detailsLink.innerHTML = card.innerHTML;

    const article = document.createElement('article');
    article.className = card.className;
    article.appendChild(detailsLink);

    if (serviceUsesEligibility(serviceName)) {
      const eligibilityLink = document.createElement('a');
      eligibilityLink.className = 'btn-like eligibility-card-cta';
      eligibilityLink.setAttribute('href', `contact.html?service=${encodeURIComponent(serviceName)}`);
      eligibilityLink.textContent = 'Check My Eligibility';
      article.appendChild(eligibilityLink);
    }

    card.replaceWith(article);
  });

  repairServiceCards();

  if (document.body.classList.contains('service-detail-page')) {
    const pageCta = document.querySelector('.page-cta');
    const serviceName = cleanEnquiryValue(document.querySelector('main h1')?.textContent);
    if (pageCta && serviceUsesEligibility(serviceName)) {
      const existing = Array.from(pageCta.querySelectorAll('a')).find((link) => /eligibility/i.test(link.textContent || link.href));
      if (existing) {
        existing.textContent = 'Check My Eligibility';
        existing.href = getEligibilityHref(serviceName);
        existing.classList.add('secondary-btn', 'eligibility-inline-cta');
      } else {
        const link = document.createElement('a');
        link.className = 'btn secondary-btn eligibility-inline-cta';
        link.href = getEligibilityHref(serviceName);
        link.textContent = 'Check My Eligibility';
        pageCta.appendChild(link);
      }
    }
  }

  if (getCurrentPageName() === 'eligibility.html') {
    document.querySelectorAll('.page-cta a').forEach((link) => {
      if (/eligibility/i.test(link.textContent || '')) {
        link.href = '#advanced-emi-planner';
      }
    });

    const readinessServices = ['Education Loan', 'Education Loan', 'Education Loan', 'All Types of Loans'];
    document.querySelectorAll('.eligibility-readiness-grid article').forEach((article, index) => {
      if (article.querySelector('.eligibility-inline-cta')) return;
      const link = document.createElement('a');
      link.className = 'btn secondary-btn eligibility-inline-cta';
      link.href = '#advanced-emi-planner';
      link.dataset.service = readinessServices[index] || 'All Types of Loans';
      link.textContent = 'Check My Eligibility';
      article.appendChild(link);
    });
  }
}

function getSuccessfulEnquiryMessage(referenceId) {
  const referenceLine = referenceId ? `${getTranslation(currentLang, 'reference-id')}: ${referenceId}` : '';
  return [
    getTranslation(currentLang, 'success-enquiry-message'),
    referenceLine
  ].filter(Boolean).join('\n');
}

function setFormSubmitting(form, isSubmitting, labelKey = 'submitting') {
  if (!form) {
    return;
  }

  form.dataset.submitting = isSubmitting ? 'true' : 'false';

  form.querySelectorAll('button[type="submit"]').forEach((button) => {
    if (!button.dataset.idleText) {
      button.dataset.idleText = button.textContent;
    }
    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? getTranslation(currentLang, labelKey) : button.dataset.idleText;
  });
}

function isFormSubmitting(form) {
  return form?.dataset.submitting === 'true';
}

async function submitEnquiry(payload) {
  console.log("Submitting enquiry payload:", payload);

  let response;
  try {
    response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Enquiry submit failed:", "NETWORK", error.message || error);
    const networkError = new Error(getTranslation(currentLang, 'network-error'));
    networkError.code = 'NETWORK';
    throw networkError;
  }

  let rawText = "";
  let responseBody = {};
  try {
    rawText = await response.text();
    responseBody = rawText ? JSON.parse(rawText) : {};
  } catch (error) {
    responseBody = {};
  }

  if (!response.ok || responseBody.success === false) {
    const errorTextOrJson = Object.keys(responseBody).length ? responseBody : rawText;
    console.error("Enquiry submit failed:", response.status, errorTextOrJson);
    const requestError = new Error(responseBody.message || responseBody.error || getTranslation(currentLang, 'something-went-wrong'));
    requestError.status = response.status;
    requestError.code = responseBody.code || '';
    throw requestError;
  }

  return {
    ...responseBody,
    referenceId: responseBody.referenceId || responseBody.reference || responseBody.id
  };
}

async function startChat(payload) {
  const response = await apiRequest('/api/chat/start', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (response.chatId) {
    activeLiveChatId = response.chatId;
    try {
      window.sessionStorage.setItem(CHAT_ID_KEY, response.chatId);
    } catch (error) {
      // Chat still works for the current page session.
    }
  }
  return response;
}

async function sendChatMessage(chatId, message) {
  return apiRequest('/api/chat/message', {
    method: 'POST',
    body: JSON.stringify({ chatId, message })
  });
}

async function fetchChatMessages(chatId) {
  if (!chatId) {
    return { success: true, messages: [] };
  }
  return apiRequest(`/api/chat/messages/${encodeURIComponent(chatId)}`);
}

async function askChatbot(payload) {
  return apiRequest('/api/chatbot/answer', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

async function loginAdmin(email, password) {
  const response = await apiRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (response.token) {
    window.sessionStorage.setItem(ADMIN_TOKEN_KEY, response.token);
    window.sessionStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(response.user || response.admin || { email }));
    window.sessionStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
    window.sessionStorage.removeItem(LEGACY_ADMIN_PROFILE_KEY);
  }
  return response;
}

async function loginUser(email, password, loginRole = 'student') {
  const response = await apiRequest('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, loginRole })
  });
  if (response.token) {
    const rawProfile = response.user || response.profile || { email };
    const selectedRole = String(loginRole || '').trim().toLowerCase();
    if (['student', 'client', 'employee'].includes(selectedRole)) {
      rawProfile.loginRole = selectedRole;
    }
    const profile = JSON.stringify(rawProfile);
    window.sessionStorage.setItem(USER_TOKEN_KEY, response.token);
    window.sessionStorage.setItem(USER_PROFILE_KEY, profile);
    window.localStorage.setItem(USER_TOKEN_KEY, response.token);
    window.localStorage.setItem(USER_PROFILE_KEY, profile);
    if (response.adminAccess || ['admin', 'ceo', 'board', 'board_member', 'super_admin'].includes(String(rawProfile.role || '').toLowerCase())) {
      window.sessionStorage.setItem(ADMIN_TOKEN_KEY, response.token);
      window.sessionStorage.setItem(ADMIN_PROFILE_KEY, profile);
      window.sessionStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
      window.sessionStorage.removeItem(LEGACY_ADMIN_PROFILE_KEY);
    }
  }
  return response;
}

function dashboardForLoginProfile(profile = {}, loginMode = 'user', requestedRole = '') {
  const selectedRole = String(requestedRole || profile.loginRole || '').trim().toLowerCase();
  if (loginMode !== 'admin') {
    if (selectedRole === 'client') return 'client-dashboard.html';
    if (selectedRole === 'student') return 'student-dashboard.html';
    if (selectedRole === 'employee') return 'employee-dashboard.html';
  }
  const role = String(profile.role || profile.adminRole || '').trim().toLowerCase();
  if (['admin', 'ceo', 'super_admin'].includes(role)) return 'admin-dashboard.html';
  if (['board', 'board_member'].includes(role)) return 'board-dashboard.html';
  if (role === 'employee') return 'employee-dashboard.html';
  if (['connector', 'client_consultant', 'own_self', 'online_reference', 'banker_reference', 'employee_reference', 'client'].includes(role)) {
    return 'client-dashboard.html';
  }
  if (role === 'student') return 'student-dashboard.html';
  return loginMode === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
}

function redirectForLoginResult(result = {}, loginMode = 'user', requestedRole = '') {
  if (result.redirectTo) return result.redirectTo;
  return dashboardForLoginProfile(result.user || result.profile || result.admin || {}, loginMode, requestedRole);
}

async function signupUser(payload) {
  return apiRequest('/api/user/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

function getAdminToken() {
  try {
    const token = window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || window.sessionStorage.getItem(LEGACY_ADMIN_TOKEN_KEY) || '';
    if (token && !window.sessionStorage.getItem(ADMIN_TOKEN_KEY)) {
      window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
    return token;
  } catch (error) {
    return '';
  }
}

function getUserTokenForNavigation() {
  try {
    const token = window.sessionStorage.getItem(USER_TOKEN_KEY) || window.localStorage.getItem(USER_TOKEN_KEY) || '';
    if (token && !window.sessionStorage.getItem(USER_TOKEN_KEY)) {
      window.sessionStorage.setItem(USER_TOKEN_KEY, token);
    }
    return token;
  } catch (error) {
    return '';
  }
}

function updateAuthenticatedNavigation() {
  if (document.body.classList.contains('user-dashboard-page') || document.body.classList.contains('smartcrm-page') || document.body.classList.contains('admin-page')) {
    return;
  }

  document.querySelectorAll('a.header-login-link, nav a').forEach((link) => {
    const label = (link.textContent || '').trim().toLowerCase();
    const href = (link.getAttribute('href') || '').toLowerCase();
    const isPublicLoginLink =
      link.classList.contains('header-login-link') ||
      link.dataset.i18n === 'login' ||
      label === 'login' ||
      href === 'login.html' ||
      href === 'user-dashboard.html';

    if (!isPublicLoginLink || link.dataset.userLogout !== undefined || link.dataset.adminLogout !== undefined) {
      return;
    }

    link.href = 'login.html';
    if (link.dataset.loginNavigationBound === 'true') {
      return;
    }
    link.dataset.loginNavigationBound = 'true';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'login.html';
    });
  });
}

function bindPublicLoginNavigation() {
  if (document.body.classList.contains('user-dashboard-page') || document.body.classList.contains('smartcrm-page') || document.body.classList.contains('admin-page')) {
    return;
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('a, button');
    if (!target) return;

    const label = (target.textContent || '').trim().toLowerCase();
    const href = (target.getAttribute('href') || '').toLowerCase();
    const isLoginTrigger =
      target.classList.contains('header-login-link') ||
      target.dataset.i18n === 'login' ||
      label === 'login' ||
      href === 'login.html' ||
      href === 'user-dashboard.html';

    if (!isLoginTrigger || target.dataset.userLogout !== undefined || target.dataset.adminLogout !== undefined) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    window.location.href = 'login.html';
  }, true);
}

async function adminApiRequest(path, options = {}) {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Unauthorized');
  }
  return apiRequest(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
}

function settingsArrayToMap(settings = []) {
  return settings.reduce((map, item) => {
    if (item?.settingKey) {
      map[item.settingKey] = item.settingValue?.value ?? item.settingValue ?? '';
    }
    return map;
  }, {});
}

function normalizeWebsiteDisplay(value = '') {
  let cleaned = cleanEnquiryValue(value)
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/g, '');
  if (cleaned.toLowerCase() === 'nidhipath.in') {
    cleaned = 'www.nidhipath.in';
  }
  return cleaned || DEFAULT_SITE_SETTINGS.official_website;
}

function normalizeWebsiteHref(value = '') {
  const display = normalizeWebsiteDisplay(value);
  return `https://${display}`;
}

function normalizeTelHref(value = '') {
  const digits = cleanEnquiryValue(value).replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : '';
}

function getConfiguredBrandName(value = publicSiteSettings.business_name) {
  const businessName = cleanEnquiryValue(value) || DEFAULT_SITE_SETTINGS.business_name;
  return businessName
    .replace(/\s+Loan\s+Ventures\b.*$/i, '')
    .trim() || businessName;
}

function setTextForSiteSetting(selector, value) {
  const text = cleanEnquiryValue(value);
  if (!text) return;
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = text;
  });
}

function applySiteSettingTextReplacements(settings) {
  const businessName = cleanEnquiryValue(settings.business_name) || DEFAULT_SITE_SETTINGS.business_name;
  const brandName = getConfiguredBrandName(businessName);
  const replacements = new Map([
    [DEFAULT_SITE_SETTINGS.business_name, businessName],
    ['Nidhi Path Loan Ventures', businessName],
    ['NIDHI PATH', brandName.toUpperCase()],
    ['Nidhi Path', brandName],
    [DEFAULT_SITE_SETTINGS.tagline, cleanEnquiryValue(settings.tagline) || DEFAULT_SITE_SETTINGS.tagline],
    [DEFAULT_SITE_SETTINGS.official_email, cleanEnquiryValue(settings.official_email) || DEFAULT_SITE_SETTINGS.official_email],
    [DEFAULT_SITE_SETTINGS.official_website, normalizeWebsiteDisplay(settings.official_website)],
    [DEFAULT_SITE_SETTINGS.official_phone, cleanEnquiryValue(settings.official_phone) || DEFAULT_SITE_SETTINGS.official_phone],
    [DEFAULT_SITE_SETTINGS.whatsapp_number, cleanEnquiryValue(settings.whatsapp_number) || DEFAULT_SITE_SETTINGS.whatsapp_number],
    [DEFAULT_SITE_SETTINGS.address, cleanEnquiryValue(settings.address) || DEFAULT_SITE_SETTINGS.address],
    [DEFAULT_SITE_SETTINGS.city, cleanEnquiryValue(settings.city) || DEFAULT_SITE_SETTINGS.city],
    [DEFAULT_SITE_SETTINGS.state, cleanEnquiryValue(settings.state) || DEFAULT_SITE_SETTINGS.state],
    [DEFAULT_SITE_SETTINGS.working_hours, cleanEnquiryValue(settings.working_hours) || DEFAULT_SITE_SETTINGS.working_hours],
    [DEFAULT_SITE_SETTINGS.support_message, cleanEnquiryValue(settings.support_message) || DEFAULT_SITE_SETTINGS.support_message],
    [DEFAULT_SITE_SETTINGS.footer_text, cleanEnquiryValue(settings.footer_text) || DEFAULT_SITE_SETTINGS.footer_text],
    [DEFAULT_SITE_SETTINGS.consent_text, cleanEnquiryValue(settings.consent_text) || DEFAULT_SITE_SETTINGS.consent_text]
  ]);

  const entries = Array.from(replacements.entries())
    .filter(([from, to]) => from && to && from !== to)
    .sort((a, b) => b[0].length - a[0].length);
  if (!entries.length || !document.body) return;

  const pattern = new RegExp(entries.map(([from]) => from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  const replacementMap = new Map(entries);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      if (parent.closest('script, style, textarea, input, select, option, svg, canvas, [data-no-site-settings]')) {
        return NodeFilter.FILTER_REJECT;
      }
      pattern.lastIndex = 0;
      return pattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    pattern.lastIndex = 0;
    node.nodeValue = node.nodeValue.replace(pattern, (match) => replacementMap.get(match) || match);
  });
}

function updatePublicSiteSettings(settings = publicSiteSettings) {
  publicSiteSettings = { ...DEFAULT_SITE_SETTINGS, ...(settings || {}) };
  const businessName = cleanEnquiryValue(publicSiteSettings.business_name) || DEFAULT_SITE_SETTINGS.business_name;
  const brandName = getConfiguredBrandName(businessName);
  const tagline = cleanEnquiryValue(publicSiteSettings.tagline) || DEFAULT_SITE_SETTINGS.tagline;
  const email = cleanEnquiryValue(publicSiteSettings.official_email) || DEFAULT_SITE_SETTINGS.official_email;
  const websiteDisplay = normalizeWebsiteDisplay(publicSiteSettings.official_website);
  const websiteHref = normalizeWebsiteHref(websiteDisplay);
  const phone = cleanEnquiryValue(publicSiteSettings.official_phone) || DEFAULT_SITE_SETTINGS.official_phone;
  const telHref = normalizeTelHref(phone);
  const address = cleanEnquiryValue(publicSiteSettings.address);
  const workingHours = cleanEnquiryValue(publicSiteSettings.working_hours);
  const consentText = cleanEnquiryValue(publicSiteSettings.consent_text);
  const footerText = cleanEnquiryValue(publicSiteSettings.footer_text);
  const seoTitle = cleanEnquiryValue(publicSiteSettings.seo_title);
  const seoDescription = cleanEnquiryValue(publicSiteSettings.seo_description);

  if (seoTitle) {
    const originalTitle = document.documentElement.dataset.originalTitle || document.title;
    const pagePrefix = originalTitle.includes('|') ? originalTitle.split('|')[0].trim() : '';
    document.title = pagePrefix && pagePrefix.toLowerCase() !== seoTitle.toLowerCase()
      ? `${pagePrefix} | ${seoTitle}`
      : seoTitle;
    document.documentElement.dataset.originalTitle = document.title;
  }
  if (seoDescription) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = seoDescription;
  }

  applySiteSettingTextReplacements(publicSiteSettings);
  setTextForSiteSetting('[data-site-setting="business_name"]', businessName);
  setTextForSiteSetting('[data-site-setting="tagline"], .tubes-intro-tagline', tagline);
  setTextForSiteSetting('.brand-text, .brand-name-inline, .tubes-intro-brand', brandName);
  document.querySelectorAll('img[alt*="Nidhi Path"], iframe[title*="Nidhi Path"]').forEach((element) => {
    const attribute = element.tagName === 'IFRAME' ? 'title' : 'alt';
    element.setAttribute(attribute, `${businessName}${attribute === 'alt' ? ' logo' : ' location map'}`);
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const subject = link.getAttribute('href')?.split('?')[1];
    link.href = `mailto:${email}${subject ? `?${subject}` : ''}`;
    if (/nidhi/i.test(link.textContent || '') || /@/.test(link.textContent || '')) {
      link.textContent = email;
    }
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    if (telHref) link.href = telHref;
    if (/\+?\d[\d\s-]{7,}/.test(link.textContent || '')) {
      link.textContent = phone;
    }
  });

  document.querySelectorAll('a[data-site-setting="official_website"], footer a[href*="nidhipath.in"], .response-card a[href*="nidhipath.in"], .contact-action-row a[href*="nidhipath.in"]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('mailto:')) return;

    try {
      const url = new URL(href, window.location.origin);
      const isWebsiteRoot = /(^|\.)nidhipath\.in$/i.test(url.hostname) && (url.pathname === '/' || url.pathname === '');
      if (!isWebsiteRoot) return;
    } catch (error) {
      return;
    }

    link.href = websiteHref;
    if (!link.children.length) {
      link.textContent = websiteDisplay;
    }
  });

  document.querySelectorAll('[data-site-setting="official_email"]').forEach((element) => { element.textContent = email; });
  document.querySelectorAll('[data-site-setting="official_phone"]').forEach((element) => { element.textContent = phone; });
  document.querySelectorAll('[data-site-setting="official_website"]').forEach((element) => { element.textContent = websiteDisplay; });
  document.querySelectorAll('[data-site-setting="working_hours"]').forEach((element) => { element.textContent = publicSiteSettings.working_hours; });
  document.querySelectorAll('[data-site-setting="address"]').forEach((element) => { element.textContent = address; });

  if (address) {
    document.querySelectorAll('footer address, .footer-address-block address, .office-copy-card address').forEach((element) => {
      element.textContent = address;
    });
  }

  if (workingHours) {
    document.querySelectorAll('.response-card').forEach((card) => {
      if (/office hours/i.test(card.querySelector('span')?.textContent || '')) {
        const textNode = card.querySelector('p');
        if (textNode) textNode.textContent = workingHours;
      }
    });
  }

  if (consentText) {
    document.querySelectorAll('.form-consent, .floating-form-note').forEach((element) => {
      if (/submitting this form/i.test(element.textContent || '')) {
        element.textContent = consentText;
      }
    });
  }

  if (footerText) {
    document.querySelectorAll('.footer-bottom').forEach((element) => {
      const businessSuffix = businessName === brandName ? '' : ` ${businessName.replace(brandName, '').trim()}`;
      element.innerHTML = `&copy; 2026 <span class="brand-name brand-name-inline">${escapeHtml(brandName)}</span>${escapeHtml(businessSuffix)}. All rights reserved. ${escapeHtml(footerText)}`;
    });
  }

  repairServiceCards();
}

async function loadPublicSiteSettings() {
  try {
    const response = await apiRequest('/api/site/settings', { method: 'GET', cache: 'no-store' });
    updatePublicSiteSettings(response.settingsMap || settingsArrayToMap(response.settings || response.data || []));
  } catch (error) {
    console.warn('Using fallback site settings', error);
    updatePublicSiteSettings(publicSiteSettings);
  }
}

function submitLeadEnquiry(enquiry = {}) {
  return submitEnquiry(buildEnquiryPayload(enquiry, enquiry.sourceForm || 'quick_enquiry'));
}

function requestAgentHandoff(enquiry = {}) {
  return startChat(buildEnquiryPayload(enquiry, 'live_chat_start'));
}

async function postLiveChatMessage(message, context = {}) {
  if (!activeLiveChatId) {
    activeLiveChatId = window.sessionStorage.getItem(CHAT_ID_KEY) || '';
  }
  if (!activeLiveChatId) {
    const started = await startChat(buildEnquiryPayload({ ...context, message }, 'live_chat_start'));
    activeLiveChatId = started.chatId || '';
    return started;
  }
  return sendChatMessage(activeLiveChatId, message);
}

function isAgentHandoffRequest(message) {
  const text = cleanEnquiryValue(message).toLowerCase();
  return /\bagent\b/.test(text)
    || /\bhuman\b/.test(text)
    || /\brepresentative\b/.test(text)
    || /\bhelp needed\b/.test(text)
    || /\btalk with\b/.test(text)
    || /\btalk to\b/.test(text);
}

const websiteChatKnowledge = [
  {
    patterns: ['can i get a loan for studying abroad', 'loan for studying abroad', 'study abroad loan', 'abroad loan', 'overseas education loan'],
    answer: 'Yes. Nidhi Path guides students and parents for study abroad education loan preparation, including admission proof, tuition estimate, living cost, travel cost, co-applicant details and bank-specific document readiness.'
  },
  {
    patterns: ['maximum education loan amount', 'maximum loan amount', 'how much loan', 'loan amount can i get', 'max education loan'],
    answer: 'The website shows guidance for education loans up to Rs. 1 crore. The actual eligible loan amount depends on course, university, fee structure, co-applicant profile, documents, collateral if required, bank policy and credit assessment.'
  },
  {
    patterns: ['specific universities only', 'approved university loans', 'recognized university', 'listed university', 'recognized and listed universities'],
    answer: 'Nidhi Path supports loan guidance for recognized and listed universities. If the university is not clearly listed, the team can help you understand what documents and bank checks may be needed, but final acceptance depends on bank policy.'
  },
  {
    patterns: ['which countries are eligible', 'eligible countries', 'countries covered', 'country eligible', 'which country'],
    answer: 'The website covers India and popular study-abroad routes such as the United States, United Kingdom, Canada, Australia, Germany, Ireland, France, Netherlands, Singapore, New Zealand and Sweden. Final loan eligibility depends on university, course, documents and bank policy.'
  },
  {
    patterns: ['without collateral', 'no collateral', 'collateral free', 'collateral required', 'security required'],
    answer: 'Collateral may or may not be required depending on loan amount, course, university, co-applicant profile and bank policy. Nidhi Path can guide you on collateral-free and collateral-based route discussions, but the final requirement is decided by the bank.'
  },
  {
    patterns: ['am i eligible', 'eligible for education loan', 'education loan eligibility', 'student eligibility'],
    answer: 'Education loan eligibility depends on admission status, course and university, fee structure, student academic profile, co-applicant strength, income proof, credit history, documents and bank policy. Nidhi Path helps you review these points before formal processing.'
  },
  {
    patterns: ['how long does approval take', 'approval time', 'loan approval take', 'processing time', 'how many days'],
    answer: 'The website mentions an initial file review within 72 hours. Final loan approval time can vary by bank, documents, verification, university checks, co-applicant profile and credit assessment.'
  },
  {
    patterns: ['interest rate', 'rate of interest', 'education loan rate', 'what is the rate'],
    answer: 'Interest rate is not fixed by Nidhi Path. It depends on the selected bank, loan amount, collateral, co-applicant profile, course, university and credit assessment. The website EMI tools can help estimate repayment using different rates.'
  },
  {
    patterns: ['need a co applicant', 'co applicant needed', 'co-applicant', 'coapplicant', 'parent co applicant'],
    answer: 'Most education loan discussions require a parent, guardian or suitable co-applicant. Their income, documents, bank statements and credit profile may affect eligibility and bank terms.'
  },
  {
    patterns: ['which bank is best', 'best bank', 'right bank', 'choose the bank', 'choose right bank'],
    answer: 'There is no single best bank for every student. Nidhi Path helps compare suitable bank routes based on university, course cost, loan amount, collateral needs, co-applicant profile, repayment comfort and document readiness.'
  },
  {
    patterns: ['help with loan processing', 'loan processing help', 'process my loan', 'processing support'],
    answer: 'Yes. Nidhi Path provides loan guidance and processing support such as eligibility discussion, document preparation, bank route guidance, EMI planning and follow-up support. Final approval remains subject to bank policy and verification.'
  },
  {
    patterns: ['service fee', 'charge any fee', 'do you charge', 'consultation fee', 'fees for service'],
    answer: 'Service fee details are not listed on the website. Please contact the team at +91 97056 82595 or info@nidhipath.in for the current consultation or service fee information.'
  },
  {
    patterns: ['role of parents', 'parents role', 'parent role', 'what parents do'],
    answer: 'Parents or guardians usually support the education loan as co-applicants. Their KYC, income proof, bank statements, repayment comfort and credit profile may be reviewed by the bank.'
  },
  {
    patterns: ['parent income required', 'income required for parents', 'parents income', 'minimum income'],
    answer: 'The required parent or co-applicant income depends on the loan amount, repayment plan, bank policy, existing obligations and credit assessment. Nidhi Path can help families prepare income documents and understand repayment comfort.'
  },
  {
    patterns: ['without my parents', 'apply without parents', 'no parents', 'without parent'],
    answer: 'Some cases may need an alternate guardian or suitable co-applicant, depending on bank rules. Nidhi Path can help you understand possible routes, but final acceptance depends on the bank.'
  },
  {
    patterns: ['when do i start repaying', 'start repayment', 'repayment start', 'moratorium'],
    answer: 'Education loan repayment often starts after the study period or moratorium period, depending on bank terms. Exact repayment start date, interest during study and EMI schedule are decided by the bank.'
  },
  {
    patterns: ['emi after graduation', 'emi after study', 'monthly emi after graduation', 'what is the emi'],
    answer: 'EMI after graduation depends on loan amount, interest rate, tenure, moratorium terms and bank charges. You can use the website EMI planner for an estimate; the final EMI is confirmed by the bank.'
  },
  {
    patterns: ['prepay', 'prepayment', 'pay early', 'close loan early', 'foreclose'],
    answer: 'Many banks allow early repayment or prepayment, but rules and charges vary. Please confirm the exact prepayment terms with the selected bank before finalizing the loan.'
  },
  {
    patterns: ['all universities', 'loans for all universities', 'university not listed', 'not listed university'],
    answer: 'Nidhi Path focuses on loan support for recognized and listed universities. If your university is not listed, the team can guide you on what checks may be needed, but bank approval depends on bank policy and university acceptance.'
  },
  {
    patterns: ['university selection', 'help with university selection', 'choose university', 'admission help', 'admissions'],
    answer: 'Nidhi Path focuses only on loan-related information and guidance. We do not provide admission services or university selection services.'
  },
  {
    patterns: ['are you a bank', 'bank or consultancy', 'consultancy', 'are you bank'],
    answer: 'Nidhi Path is a loan guidance and consultation service, not a bank. The team helps with eligibility discussion, document preparation, bank route guidance and EMI planning. Loan approval and disbursement are handled by banks.'
  },
  {
    patterns: ['how are you different', 'different from others', 'why nidhi path'],
    answer: 'Nidhi Path focuses on clear education loan guidance, document readiness, co-applicant preparation, EMI awareness, multiple bank route discussion and transparent support without false approval promises.'
  },
  {
    patterns: ['guarantee loan approval', 'guaranteed approval', 'do you guarantee', 'approval guarantee'],
    answer: 'No. Nidhi Path does not guarantee loan approval. Approval depends on bank policy, eligibility, documents, verification, credit assessment, admission details and co-applicant profile.'
  },
  {
    patterns: ['hello', 'hi', 'hlo', 'hey', 'good morning', 'good evening', 'namaste', 'నమస్తే', 'హలో', 'नमस्ते'],
    answer: 'Hello! I can help with questions about Nidhi Path services, education loans, documents, eligibility, EMI planning, contact details and how to submit an enquiry.'
  },
  {
    patterns: ['service', 'services', 'what do you provide', 'what you do', 'loan types', 'loan types', 'సేవలు', 'లోన్ రకాలు', 'सेवाएं', 'ऋण प्रकार'],
    answer: 'Nidhi Path Loan Ventures provides guidance for education loans, personal loans, business loans, home loans, Mutual Funds, insurance, all types of loan guidance and loan consultation.'
  },
  {
    patterns: ['education loan', 'education loan', 'study abroad', 'study in india', 'student loan', 'abroad education', 'విద్యా లోన్', 'ఎడ్యుకేషన్ లోన్', 'विद्या ऋण', 'शिक्षा ऋण'],
    answer: 'For education loans, Nidhi Path helps students and parents with study in India or abroad guidance, course fee and living-expense planning, travel and books planning, parent or co-applicant support, admission-based documents and EMI awareness.'
  },
  {
    patterns: ['document', 'documents', 'kyc', 'proof', 'papers', 'checklist', 'డాక్యుమెంట్', 'పత్రాలు', 'दस्तावेज', 'कागज'],
    answer: 'Common documents include KYC, admission proof, academic records, fee structure, co-applicant or parent details, income proof if applicable and bank statements if required. For business or home loans, property or business documents may also be needed.'
  },
  {
    patterns: ['eligibility', 'eligible', 'qualify', 'qualification', 'can i get', 'అర్హత', 'అర్హుడు', 'पात्रता', 'योग्य'],
    answer: 'Eligibility depends on the loan type, income or co-applicant profile, documents, credit history, obligations, bank statements and multiple bank policies. The eligibility page helps you prepare documents and estimate EMI before speaking with the team.'
  },
  {
    patterns: ['emi', 'calculator', 'interest', 'rate', 'tenure', 'monthly payment', 'moratorium', 'ఈఎంఐ', 'వడ్డీ', 'ఈఎమ్ఐ', 'ब्याज', 'किस्त'],
    answer: 'The website includes EMI planning tools. You can estimate monthly EMI using loan amount, annual interest rate and tenure. The advanced planner also includes down payment, processing fee and education moratorium assumptions. Final EMI, rate and charges depend on bank policy and credit assessment.'
  },
  {
    patterns: ['personal loan', 'personal loan', 'పర్సనల్ లోన్', 'వ్యక్తిగత లోన్', 'पर्सनल लोन', 'व्यक्तिगत ऋण'],
    answer: 'For personal loans, Nidhi Path guides customers on requirement understanding, eligibility discussion, income and KYC document preparation, loan amount and tenure planning, and EMI comfort before applying.'
  },
  {
    patterns: ['business loan', 'business loan', 'working capital', 'expansion', 'బిజినెస్ లోన్', 'వ్యాపార లోన్', 'बिजनेस लोन', 'व्यापार ऋण'],
    answer: 'For business loans, Nidhi Path supports business owners with requirement review, documentation checklist, income and bank statement review, working capital or expansion discussions and practical loans route guidance.'
  },
  {
    patterns: ['home loan', 'home loan', 'property', 'construction', 'renovation', 'balance transfer', 'హోమ్ లోన్', 'ఇంటి లోన్', 'होम लोन', 'गृह ऋण'],
    answer: 'For home loans, Nidhi Path provides guidance for home purchase, construction, renovation and balance transfer discussions, with EMI and property document focus.'
  },
  {
    patterns: ['mutual loan', 'Mutual Funds', 'investment', 'invest', 'మ్యూచువల్ ఫండ్', 'పెట్టుబడి', 'म्यूचुअल फंड', 'निवेश'],
    answer: 'For Mutual Funds, the website offers consultation support around goal-based discussion, risk understanding, investment horizon planning and basic documentation guidance. Mutual loan investments are subject to market risks.'
  },
  {
    patterns: ['insurance', 'policy', 'coverage', 'protection', 'ఇన్సూరెన్స్', 'బీమా', 'बीमा'],
    answer: 'For insurance, Nidhi Path helps customers understand protection needs, coverage discussion and basic policy documents before choosing options.'
  },
  {
    patterns: ['consultation', 'consult', 'appointment', 'book', 'కన్సల్టేషన్', 'సలహా', 'परामर्श', 'सलाह'],
    answer: 'Loan consultation includes understanding your requirement, checking basic eligibility, explaining document needs and planning next action steps. It is useful for students, parents, salaried customers, business owners and families.'
  },
  {
    patterns: ['contact', 'phone', 'mobile', 'call', 'email', 'mail', 'address', 'location', 'office', 'vijayawada', 'ఫోన్', 'కాంటాక్ట్', 'విజయవాడ', 'फोन', 'संपर्क'],
    answer: 'You can contact Nidhi Path Loan Ventures at +91 97056 82595 or info@nidhipath.in. The office location shown on the website is Vijayawada, Andhra Pradesh.'
  },
  {
    patterns: ['apply', 'enquire', 'enquiry', 'submit', 'form', 'request', 'అప్లై', 'ఎంక్వైరీ', 'ఫారం', 'आवेदन', 'पूछताछ', 'फॉर्म'],
    answer: 'To start, use the contact form or quick enquiry form and share your name, phone number, service type, approximate loan amount and requirement. The team will guide you on documents, eligibility, repayment estimate and next practical steps.'
  },
  {
    patterns: ['approval', 'guarantee', 'approved', 'disbursement', 'final decision', 'bank policy', 'అప్రూవల్', 'గ్యారంటీ', 'బ్యాంక్ పాలసీ', 'मंजूरी', 'गारंटी'],
    answer: 'Nidhi Path provides guidance and consultation. Loan approval, rate, amount, charges and disbursement are subject to multiple bank policies, eligibility, credit assessment, documentation and verification.'
  },
  {
    patterns: ['login', 'portal', 'dashboard', 'status', 'upload', 'లాగిన్', 'డాష్‌బోర్డ్', 'लॉगिन'],
    answer: 'Use the login page if you already have account access. For loan status, document support or account help, please contact our support team.'
  },
  {
    patterns: ['language', 'translate', 'telugu', 'hindi', 'భాష', 'తెలుగు', 'హిందీ', 'भाषा', 'हिंदी'],
    answer: 'The website supports English, हिन्दी and తెలుగు from the language selector in the header.'
  },
  {
    patterns: ['about', 'company', 'who are you', 'nidhi path', 'కంపెనీ', 'నిధి పథ్', 'कंपनी'],
    answer: 'Nidhi Path Loan Ventures is a guidance-first company built to help students, families, salaried professionals and business owners understand loan decisions with clarity, trust and end-to-end support.'
  }
];

function normalizeChatText(message) {
  return cleanEnquiryValue(message)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s+@.]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getKeywordTokens(text) {
  return normalizeChatText(text)
    .split(' ')
    .filter((word) => word.length > 2);
}

function getChatKeywordScore(messageText, messageTokens, pattern) {
  const normalizedPattern = normalizeChatText(pattern);
  if (!normalizedPattern) {
    return 0;
  }

  if (messageText.includes(normalizedPattern)) {
    return normalizedPattern.includes(' ') ? 8 : 5;
  }

  const patternTokens = getKeywordTokens(normalizedPattern);
  if (!patternTokens.length) {
    return 0;
  }

  const matchedTokens = patternTokens.filter((token) => messageTokens.includes(token));
  if (!matchedTokens.length) {
    return 0;
  }

  return matchedTokens.length / patternTokens.length;
}

function findWebsiteChatKnowledge(message) {
  const text = normalizeChatText(message);
  const tokens = getKeywordTokens(text);
  let bestMatch = null;
  let bestScore = 0;

  websiteChatKnowledge.forEach((entry) => {
    const score = Math.max(
      ...entry.patterns.map((pattern) => getChatKeywordScore(text, tokens, pattern))
    );

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  });

  return bestScore > 0 ? bestMatch : null;
}

function getWebsiteChatReply(message) {
  const text = normalizeChatText(message);
  if (!text) {
    return getPhraseTranslation(currentLang, 'Please type your question about our services, documents, eligibility, EMI or contact details.');
  }

  const matchedEntry = findWebsiteChatKnowledge(message);

  if (matchedEntry) {
    return getPhraseTranslation(currentLang, matchedEntry.answer);
  }

  if (isAgentHandoffRequest(message)) {
    return getPhraseTranslation(currentLang, 'Sure. Please share your name, phone number and requirement in the quick enquiry form so the team can follow up.');
  }

  return getPhraseTranslation(
    currentLang,
    'I can answer questions based on this website about services, documents, eligibility, EMI, contact details and enquiries. For anything outside the website, please contact the team at +91 97056 82595.'
  );
}

function getAgentContactReply(reference = '') {
  const referenceLine = reference ? `Reference ID: ${reference}\n\n` : '';
  return `${referenceLine}Contact Us

Phone: +91 97056 82595
Email: info@nidhipath.in
Website: www.nidhipath.in

4th Floor, Prasad Plaza,
Brooks Backside Lane,
Konera Lakshmaya Gari Veedhi,
Near United Telugu Kitchens Restaurant,
40-3/14-6/4C, Vijayawada,
Andhra Pradesh 520010`;
}

function appendQuickChatMessage(message, type = 'bot', messagesId = 'quick-chat-messages') {
  const messages = document.getElementById(messagesId);
  if (!messages || !message) {
    return;
  }

  const bubble = document.createElement('p');
  const typeClassMap = {
    user: 'is-user',
    agent: 'is-agent',
    system: 'is-system',
    bot: 'is-bot'
  };
  bubble.className = `floating-chat-message ${typeClassMap[type] || 'is-bot'}`;
  bubble.textContent = message;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function appendLiveChatActionButtons({ onContinue, onAgent } = {}) {
  const messages = document.getElementById('live-chat-messages');
  if (!messages) {
    return;
  }

  messages.querySelectorAll('.floating-chat-action-row').forEach((row) => row.remove());

  const actionRow = document.createElement('div');
  actionRow.className = 'floating-chat-action-row';

  const continueButton = document.createElement('button');
  continueButton.type = 'button';
  continueButton.className = 'floating-chat-action-button';
  continueButton.textContent = getPhraseTranslation(currentLang, 'Continue');
  continueButton.addEventListener('click', () => {
    actionRow.remove();
    onContinue?.();
  });

  const agentButton = document.createElement('button');
  agentButton.type = 'button';
  agentButton.className = 'floating-chat-action-button is-agent';
  agentButton.textContent = getPhraseTranslation(currentLang, 'Connect with Agent');
  agentButton.addEventListener('click', async () => {
    actionRow.remove();
    agentButton.disabled = true;
    await onAgent?.();
  });

  actionRow.append(continueButton, agentButton);
  messages.appendChild(actionRow);
  messages.scrollTop = messages.scrollHeight;
}

function updatePasswordToggleText() {
  const passwordToggle = document.getElementById('password-toggle');
  const passwordInput = document.getElementById('login-password');
  if (!passwordToggle || !passwordInput) {
    return;
  }

  const translationKey = passwordInput.type === 'password' ? 'show-password' : 'hide-password';
  passwordToggle.textContent = getTranslation(currentLang, translationKey);
}

function setLoginStatus(statusKey, statusType) {
  const loginStatus = document.getElementById('login-status');
  if (!loginStatus) {
    return;
  }

  currentLoginStatusKey = statusKey;
  loginStatus.textContent = statusKey ? getTranslation(currentLang, statusKey) : '';
  loginStatus.classList.remove('is-success', 'is-error');
  if (statusType) {
    loginStatus.classList.add(statusType);
  }
}

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  persistLanguage(lang);
  // Update text content
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    renderTranslatedText(el, getTranslation(lang, key));
  });
  document.querySelectorAll('[data-i18n-btn]').forEach((el) => {
    const key = el.getAttribute('data-i18n-btn');
    el.textContent = getTranslation(lang, key);
  });
  document.querySelectorAll('[data-placeholder-i18n]').forEach((el) => {
    const key = el.getAttribute('data-placeholder-i18n');
    el.placeholder = getTranslation(lang, key);
  });
  translateStaticPage(lang);
  updatePageVisualSystemTranslations(lang);
  window.NIDHI_updateLoginModeText?.();
  translateActiveHeroWord(lang);
  // Update select value
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.value = lang;
    updateLanguageOptionLabels(languageSelect);
  }
  // Update EMI results labels if visible
  updateEMIResultLabels();
  updatePasswordToggleText();
  calculateFloatingEMI();
  updateAdvancedEMIPlanner();

  if (currentLoginStatusKey) {
    const loginStatus = document.getElementById('login-status');
    if (loginStatus) {
      loginStatus.textContent = getTranslation(lang, currentLoginStatusKey);
    }
  }
}

function updateLanguageOptionLabels(languageSelect) {
  const nativeLanguageNames = {
    en: 'English',
    hi: 'हिन्दी',
    te: 'తెలుగు'
  };

  Object.entries(nativeLanguageNames).forEach(([value, label]) => {
    const option = languageSelect.querySelector(`option[value="${value}"]`);
    if (option) {
      option.textContent = label;
    }
  });
}

function updatePageVisualSystemTranslations(lang) {
  document.querySelectorAll('[data-phrase-source]').forEach((el) => {
    const source = el.getAttribute('data-phrase-source');
    if (!source) {
      return;
    }

    el.textContent = getPhraseTranslation(lang, source);
  });
}

function updateEMIResultLabels() {
  // Update EMI result section labels
  const emiResult = document.getElementById('emi-result');
  if (emiResult && emiResult.dataset.hasResult === 'true') {
    const resultData = JSON.parse(emiResult.dataset.result);
    const emiLabel = getTranslation(currentLang, 'result-emi');
    const totalPaymentLabel = getTranslation(currentLang, 'result-total-payment');
    const totalInterestLabel = getTranslation(currentLang, 'result-total-interest');
    emiResult.innerHTML = `
      <p><strong>${emiLabel}:</strong> ${resultData.emi.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
      <p><strong>${totalPaymentLabel}:</strong> ${resultData.total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
      <p><strong>${totalInterestLabel}:</strong> ${resultData.interest.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
    `;
  }
}

function isLoginPage() {
  return document.body.classList.contains('login-page');
}

function isAdminPage() {
  return document.body.classList.contains('admin-page') || getCurrentPageName().startsWith('admin-');
}

function isSmartcrmInternalDashboard() {
  return ['employee', 'client', 'board'].includes(document.body.dataset.smartcrmPage || '');
}

function createHeaderCalculatorButton() {
  if (isLoginPage() || isAdminPage() || document.querySelector('.header-calculator-button')) {
    return;
  }

  const headerRight = document.querySelector('.header-right');
  if (!headerRight) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'header-calculator-button';
  button.setAttribute('aria-controls', 'floating-emi-panel');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'EMI';
  headerRight.appendChild(button);
}

function injectFloatingWidgets() {
  if (isLoginPage() || isAdminPage() || isSmartcrmInternalDashboard() || document.getElementById('floating-emi-panel')) {
    if (isSmartcrmInternalDashboard() && !document.getElementById('floating-emi-panel')) {
      document.body.insertAdjacentHTML('beforeend', `
        <aside class="floating-emi-panel" id="floating-emi-panel" aria-label="Quick EMI calculator">
          <div class="floating-widget-header">
            <div>
              <span>Quick EMI</span>
              <strong>Calculator</strong>
            </div>
            <button type="button" class="floating-close" id="close-emi-panel" aria-label="Close EMI calculator">Ã—</button>
          </div>
          <div class="floating-widget-body">
            <label>Loan Amount
              <input type="number" id="floating-principal" value="1000000" min="1">
            </label>
            <label>Interest %
              <input type="number" id="floating-rate" value="10" min="0" step="0.01">
            </label>
            <label>Tenure (Months)
              <input type="number" id="floating-tenure" value="120" min="1">
            </label>
            <div class="floating-result" id="floating-emi-result">Monthly EMI: &#8377;13,215</div>
          </div>
        </aside>
      `);
    }
    return;
  }

  document.body.insertAdjacentHTML('beforeend', `
    <aside class="floating-emi-panel" id="floating-emi-panel" aria-label="Quick EMI calculator">
      <div class="floating-widget-header">
        <div>
          <span>Quick EMI</span>
          <strong>Calculator</strong>
        </div>
        <button type="button" class="floating-close" id="close-emi-panel" aria-label="Close EMI calculator">×</button>
      </div>
      <div class="floating-widget-body">
        <label>Loan Amount
          <input type="number" id="floating-principal" value="1000000" min="1">
        </label>
        <label>Interest %
          <input type="number" id="floating-rate" value="10" min="0" step="0.01">
        </label>
        <label>Tenure (Months)
          <input type="number" id="floating-tenure" value="120" min="1">
        </label>
        <div class="floating-result" id="floating-emi-result">Monthly EMI: &#8377;13,215</div>
      </div>
    </aside>

    <aside class="floating-lead-widget is-collapsed" id="quick-enquiry-widget" aria-label="Quick enquiry form">
      <button type="button" class="floating-lead-toggle" id="quick-enquiry-toggle" aria-expanded="false">
        <span>Quick Enquiry</span>
        <strong>Share your details</strong>
      </button>
      <form class="floating-lead-body" id="quick-lead-form">
        <label for="quick-lead-name">Name <span aria-hidden="true">*</span></label>
        <input type="text" id="quick-lead-name" name="name" placeholder="Full Name" autocomplete="name" required>
        <label for="quick-lead-phone">Phone <span aria-hidden="true">*</span></label>
        <input type="tel" id="quick-lead-phone" name="phone" placeholder="+91 9876543210" autocomplete="tel" required>
        <label for="quick-lead-email">Email</label>
        <input type="email" id="quick-lead-email" name="email" placeholder="you@example.com" autocomplete="email">
        <label for="quick-lead-service">Service <span aria-hidden="true">*</span></label>
        <select id="quick-lead-service" name="service" required>
          <option value="">Select Service</option>
          <option>Education Loan</option>
          <option>Personal Loan</option>
          <option>Business Loan</option>
          <option>Home Loan</option>
          <option>Mutual Funds</option>
          <option>Insurance</option>
          <option>All Types of Loans</option>
          <option>Loan Consultation</option>
        </select>
        <label for="quick-lead-message">Message <span aria-hidden="true">*</span></label>
        <textarea id="quick-lead-message" name="message" rows="3" placeholder="Type your requirement" required></textarea>
        <input type="text" id="quick-lead-website" name="companyWebsite" class="honeypot-field" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button type="submit" class="btn btn-block">Submit enquiry</button>
        <p class="floating-form-note">By submitting this form, you agree that Nidhi Path Loan Ventures may contact you regarding your enquiry.</p>
        <p class="floating-form-status" id="quick-lead-status" aria-live="polite"></p>
      </form>
    </aside>

    <aside class="floating-live-chat-widget is-collapsed" id="live-chat-widget" aria-label="Live chat">
      <button type="button" class="floating-live-chat-toggle" id="live-chat-toggle" aria-expanded="false" aria-label="Open live chat">
        <span class="live-chat-launch-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" focusable="false">
            <path d="M16 4C9.4 4 4 8.8 4 14.8c0 3.3 1.7 6.3 4.4 8.3l-.8 4.2 4.4-2.2c1.3.3 2.6.5 4 .5 6.6 0 12-4.8 12-10.8S22.6 4 16 4Zm-5.1 9.6h10.2v2.2H10.9v-2.2Zm0 4.2h6.8V20h-6.8v-2.2Z"></path>
          </svg>
        </span>
        <span class="live-chat-launch-copy">Live Chat</span>
      </button>
      <div class="floating-live-chat-body">
        <div class="floating-chat-head">
          <span>Nidhi Path Assistant</span>
          <strong>Ask first, connect anytime</strong>
        </div>
        <div class="live-chat-room" id="chatbot-room">
          <div class="floating-chat-messages live-chat-messages" id="chatbot-messages" aria-live="polite"></div>
          <div class="floating-chat-action-row" id="chatbot-category-chips">
            <button type="button" class="floating-chat-action-button" data-chatbot-category="Education Loan">Education Loan</button>
            <button type="button" class="floating-chat-action-button" data-chatbot-category="Personal Loan">Personal Loan</button>
            <button type="button" class="floating-chat-action-button" data-chatbot-category="Business Loan">Business Loan</button>
            <button type="button" class="floating-chat-action-button" data-chatbot-category="Home Loan">Home Loan</button>
            <button type="button" class="floating-chat-action-button" data-chatbot-category="Mutual Funds">Mutual Funds</button>
            <button type="button" class="floating-chat-action-button" data-chatbot-category="Insurance">Insurance</button>
            <button type="button" class="floating-chat-action-button" data-chatbot-category="All Types of Loans">All Loans</button>
            <button type="button" class="floating-chat-action-button" data-chatbot-category="Loan Consultation">Consultation</button>
            <button type="button" class="floating-chat-action-button is-agent" id="chatbot-agent-button">Talk to Agent</button>
          </div>
          <form class="live-chat-compose" id="chatbot-form">
            <textarea id="chatbot-input" rows="2" placeholder="Ask a loan or service question" required></textarea>
            <button type="submit" class="btn btn-block">Ask Assistant</button>
          </form>
        </div>
        <form class="live-chat-preform" id="live-chat-start-form" hidden>
          <label for="chat-start-name">Name <span aria-hidden="true">*</span></label>
          <input type="text" id="chat-start-name" name="name" placeholder="Full Name" autocomplete="name" required>
          <label for="chat-start-phone">Phone <span aria-hidden="true">*</span></label>
          <input type="tel" id="chat-start-phone" name="phone" placeholder="+91 9876543210" autocomplete="tel" required>
          <label for="chat-start-email">Email</label>
          <input type="email" id="chat-start-email" name="email" placeholder="you@example.com" autocomplete="email">
          <label for="chat-start-service">Service <span aria-hidden="true">*</span></label>
          <select id="chat-start-service" name="service" required>
            <option value="">Select Service</option>
            <option>Education Loan</option>
            <option>Personal Loan</option>
            <option>Business Loan</option>
            <option>Home Loan</option>
            <option>Mutual Funds</option>
            <option>Insurance</option>
            <option>All Types of Loans</option>
            <option>Loan Consultation</option>
          </select>
          <label for="chat-start-message">Initial message <span aria-hidden="true">*</span></label>
          <textarea id="chat-start-message" name="message" rows="3" placeholder="How can our agent help?" required></textarea>
          <input type="text" id="chat-start-website" name="companyWebsite" class="honeypot-field" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button type="submit" class="btn btn-block">Start Chat</button>
          <p class="floating-form-note">By submitting this form, you agree that Nidhi Path Loan Ventures may contact you regarding your enquiry.</p>
          <p class="floating-form-status" id="live-chat-start-status" aria-live="polite"></p>
        </form>
        <div class="live-chat-room" id="live-chat-room" hidden>
          <div class="floating-chat-messages live-chat-messages" id="live-chat-messages" aria-live="polite"></div>
          <form class="live-chat-compose" id="live-chat-form">
            <textarea id="live-chat-input" rows="3" placeholder="Type your message" required></textarea>
            <button type="submit" class="btn btn-block">Send Message</button>
          </form>
          <p class="floating-form-note" id="live-chat-room-note">An agent will reply shortly.</p>
          <p class="floating-form-status" id="live-chat-message-status" aria-live="polite"></p>
        </div>
      </div>
    </aside>
  `);

}

function calculateFloatingEMI() {
  const principalInput = document.getElementById('floating-principal');
  const rateInput = document.getElementById('floating-rate');
  const tenureInput = document.getElementById('floating-tenure');
  const result = document.getElementById('floating-emi-result');
  if (!principalInput || !rateInput || !tenureInput || !result) {
    return;
  }

  const principal = parseFloat(principalInput.value);
  const rate = parseFloat(rateInput.value);
  const tenure = parseFloat(tenureInput.value);

  if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(tenure) || tenure <= 0 || !Number.isFinite(rate) || rate < 0) {
    result.textContent = getPhraseTranslation(currentLang, 'Enter valid values');
    return;
  }

  const monthlyRate = rate / 12 / 100;
  const emi = monthlyRate === 0
    ? principal / tenure
    : (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - principal;

  result.innerHTML = `
    <strong>${getPhraseTranslation(currentLang, 'Monthly EMI:')} ${formatINRCurrency(emi)}</strong>
    <span>${getPhraseTranslation(currentLang, 'Total Interest:')} ${formatINRCurrency(totalInterest)}</span>
  `;
}

function formatINRCurrency(value) {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(safeAmount).replace(/^INR\s?/i, '\u20B9');
  } catch (error) {
    return `\u20B9${Math.round(safeAmount).toLocaleString('en-IN')}`;
  }
}

function calculateMonthlyEMI(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate <= 0) {
    return principal / months;
  }
  const compound = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * compound) / (compound - 1);
}

function getAdvancedTenureMonths() {
  const tenure = parseFloat(document.getElementById('advanced-tenure')?.value || '0');
  const mode = document.getElementById('advanced-tenure-mode')?.value || 'months';
  const safeTenure = Math.max(1, tenure || 1);
  return mode === 'years' ? Math.round(safeTenure * 12) : Math.round(safeTenure);
}

function syncAdvancedTenureFromRange() {
  const range = document.getElementById('advanced-tenure-range');
  const tenure = document.getElementById('advanced-tenure');
  const mode = document.getElementById('advanced-tenure-mode');
  if (!range || !tenure || !mode) {
    return;
  }

  const months = parseInt(range.value, 10);
  tenure.value = mode.value === 'years'
    ? String(Math.max(1, Math.round(months / 12)))
    : String(months);
}

function syncAdvancedRangeFromTenure() {
  const range = document.getElementById('advanced-tenure-range');
  if (!range) {
    return;
  }
  range.value = String(Math.min(360, Math.max(1, getAdvancedTenureMonths())));
}

function updateAdvancedEMIPlanner() {
  const amountInput = document.getElementById('advanced-amount');
  const rateInput = document.getElementById('advanced-rate');
  const downPaymentInput = document.getElementById('advanced-downpayment');
  const processingInput = document.getElementById('advanced-processing');
  const moratoriumInput = document.getElementById('advanced-moratorium');
  const loanTypeInput = document.getElementById('advanced-loan-type');

  if (!amountInput || !rateInput || !downPaymentInput || !processingInput || !moratoriumInput || !loanTypeInput) {
    return;
  }

  const amount = Math.max(0, parseFloat(amountInput.value) || 0);
  const rate = Math.max(0, parseFloat(rateInput.value) || 0);
  const downPayment = Math.max(0, parseFloat(downPaymentInput.value) || 0);
  const processingPercent = Math.max(0, parseFloat(processingInput.value) || 0);
  const months = getAdvancedTenureMonths();
  const principal = Math.max(0, amount - downPayment);
  const monthlyRate = rate / 12 / 100;
  const moratoriumMonths = loanTypeInput.value === 'Education Loan'
    ? Math.max(0, parseInt(moratoriumInput.value || '0', 10))
    : 0;
  const moratoriumPrincipal = monthlyRate > 0 && moratoriumMonths > 0
    ? principal * Math.pow(1 + monthlyRate, moratoriumMonths)
    : principal;
  const moratoriumInterest = Math.max(0, moratoriumPrincipal - principal);
  const emi = principal > 0 ? calculateMonthlyEMI(moratoriumPrincipal, rate, months) : 0;
  const totalPayable = emi * months;
  const totalInterest = Math.max(0, totalPayable - principal);
  const processingFee = principal * processingPercent / 100;
  const disbursement = Math.max(0, principal - processingFee);
  const totalMix = principal + totalInterest || 1;
  const principalPercent = Math.max(6, Math.min(94, (principal / totalMix) * 100));
  const interestPercent = Math.max(6, 100 - principalPercent);

  const outputMap = {
    'advanced-monthly-emi': formatINRCurrency(emi),
    'advanced-principal': formatINRCurrency(principal),
    'advanced-interest': formatINRCurrency(totalInterest),
    'advanced-payable': formatINRCurrency(totalPayable),
    'advanced-fee': formatINRCurrency(processingFee),
    'advanced-disbursement': formatINRCurrency(disbursement),
    'advanced-moratorium-interest': formatINRCurrency(moratoriumInterest),
    'advanced-tenure-summary': `${months} ${getPhraseTranslation(currentLang, 'months repayment tenure')}`
  };

  Object.entries(outputMap).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });

  const principalBar = document.getElementById('advanced-principal-bar');
  const interestBar = document.getElementById('advanced-interest-bar');
  const mixLabel = document.getElementById('advanced-mix-label');
  if (principalBar && interestBar && mixLabel) {
    principalBar.style.width = `${principalPercent}%`;
    interestBar.style.width = `${interestPercent}%`;
    mixLabel.textContent = `${Math.round(principalPercent)}% ${getPhraseTranslation(currentLang, 'principal')} / ${Math.round(interestPercent)}% ${getPhraseTranslation(currentLang, 'interest')}`;
  }

  const amortization = document.getElementById('advanced-amortization');
  if (amortization) {
    let balance = moratoriumPrincipal;
    let rows = `
      <div class="mini-table-row mini-table-head">
        <span>${getPhraseTranslation(currentLang, 'Month')}</span>
        <span>${getPhraseTranslation(currentLang, 'Principal')}</span>
        <span>${getPhraseTranslation(currentLang, 'Interest')}</span>
        <span>${getPhraseTranslation(currentLang, 'Balance')}</span>
      </div>
    `;
    for (let month = 1; month <= Math.min(6, months); month += 1) {
      const interestPaid = monthlyRate > 0 ? balance * monthlyRate : 0;
      const principalPaid = Math.min(Math.max(0, emi - interestPaid), balance);
      balance = Math.max(0, balance - principalPaid);
      rows += `
        <div class="mini-table-row">
          <span>${month}</span>
          <span>${formatINRCurrency(principalPaid)}</span>
          <span>${formatINRCurrency(interestPaid)}</span>
          <span>${formatINRCurrency(balance)}</span>
        </div>
      `;
    }
    amortization.innerHTML = rows;
  }
}

function bindAdvancedEMIPlanner() {
  const form = document.getElementById('advanced-emi-form');
  if (!form) {
    return;
  }

  const pairs = [
    ['advanced-amount', 'advanced-amount-range'],
    ['advanced-rate', 'advanced-rate-range']
  ];

  pairs.forEach(([inputId, rangeId]) => {
    const input = document.getElementById(inputId);
    const range = document.getElementById(rangeId);
    input?.addEventListener('input', () => {
      if (range) {
        range.value = input.value;
      }
      updateAdvancedEMIPlanner();
    });
    range?.addEventListener('input', () => {
      if (input) {
        input.value = range.value;
      }
      updateAdvancedEMIPlanner();
    });
  });

  document.getElementById('advanced-tenure-range')?.addEventListener('input', () => {
    syncAdvancedTenureFromRange();
    updateAdvancedEMIPlanner();
  });

  document.getElementById('advanced-tenure')?.addEventListener('input', () => {
    syncAdvancedRangeFromTenure();
    updateAdvancedEMIPlanner();
  });

  document.getElementById('advanced-tenure-mode')?.addEventListener('change', () => {
    syncAdvancedTenureFromRange();
    updateAdvancedEMIPlanner();
  });

  ['advanced-loan-type', 'advanced-downpayment', 'advanced-processing', 'advanced-moratorium'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', updateAdvancedEMIPlanner);
    document.getElementById(id)?.addEventListener('change', updateAdvancedEMIPlanner);
  });

  syncAdvancedRangeFromTenure();
  updateAdvancedEMIPlanner();
}

function bindFloatingWidgets() {
  if (isLoginPage() || isAdminPage()) {
    return;
  }

  const calculatorButton = document.querySelector('.header-calculator-button');
  const emiPanel = document.getElementById('floating-emi-panel');
  const closeEmiPanel = document.getElementById('close-emi-panel');

  calculatorButton?.addEventListener('click', () => {
    const isOpen = emiPanel?.classList.toggle('is-open');
    calculatorButton.setAttribute('aria-expanded', String(Boolean(isOpen)));
    calculateFloatingEMI();
  });

  closeEmiPanel?.addEventListener('click', () => {
    emiPanel?.classList.remove('is-open');
    calculatorButton?.setAttribute('aria-expanded', 'false');
  });

  ['floating-principal', 'floating-rate', 'floating-tenure'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', calculateFloatingEMI);
  });

  const quickWidget = document.getElementById('quick-enquiry-widget');
  const quickToggle = document.getElementById('quick-enquiry-toggle');
  const liveChatWidget = document.getElementById('live-chat-widget');
  const liveChatToggle = document.getElementById('live-chat-toggle');
  const liveChatStartForm = document.getElementById('live-chat-start-form');
  const liveChatStartStatus = document.getElementById('live-chat-start-status');
  const liveChatRoom = document.getElementById('live-chat-room');
  const liveChatForm = document.getElementById('live-chat-form');
  const liveChatInput = document.getElementById('live-chat-input');
  const liveChatMessageStatus = document.getElementById('live-chat-message-status');
  const liveChatMessages = document.getElementById('live-chat-messages');
  const chatbotRoom = document.getElementById('chatbot-room');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotCategoryChips = document.getElementById('chatbot-category-chips');
  const quickLeadStatus = document.getElementById('quick-lead-status');
  let chatPollingTimer = null;
  let selectedChatbotCategory = '';
  try {
    selectedChatbotCategory = window.sessionStorage.getItem(CHAT_CATEGORY_KEY) || '';
  } catch (error) {
    selectedChatbotCategory = '';
  }
  let botAnswerCount = Number(window.localStorage.getItem('nidhi-bot-answer-count') || '0');
  const renderedLiveMessageIds = new Set();

  const setSelectedChatCategory = (category) => {
    selectedChatbotCategory = cleanEnquiryValue(category);
    try {
      if (selectedChatbotCategory) {
        window.sessionStorage.setItem(CHAT_CATEGORY_KEY, selectedChatbotCategory);
      }
    } catch (error) {
      // Category still remains available for this page session.
    }
    chatbotCategoryChips?.setAttribute('hidden', '');
    setSelectValueByText(document.getElementById('chat-start-service'), selectedChatbotCategory);
  };

  const showAgentStartForm = () => {
    chatbotRoom?.setAttribute('hidden', '');
    if (selectedChatbotCategory) {
      setSelectValueByText(document.getElementById('chat-start-service'), selectedChatbotCategory);
    }
    liveChatStartForm?.removeAttribute('hidden');
    document.getElementById('chat-start-name')?.focus();
  };

  const appendAgentSuggestion = () => {
    if (!chatbotMessages) return;
    chatbotMessages.querySelectorAll('.floating-chat-action-row.is-handoff').forEach((row) => row.remove());
    const row = document.createElement('div');
    row.className = 'floating-chat-action-row is-handoff';
    const note = document.createElement('span');
    note.className = 'floating-form-note';
    note.textContent = 'Need more help? You can chat with a live agent.';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'floating-chat-action-button is-agent';
    button.textContent = 'Chat with Live Agent';
    button.addEventListener('click', showAgentStartForm);
    row.append(note, button);
    chatbotMessages.appendChild(row);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  if (chatbotMessages && !chatbotMessages.dataset.greeted) {
    chatbotMessages.dataset.greeted = 'true';
    appendQuickChatMessage('Hi, I am Nidhi Path Assistant. Please select a service or ask your question.', 'bot', 'chatbot-messages');
    if (selectedChatbotCategory) {
      chatbotCategoryChips?.setAttribute('hidden', '');
      appendQuickChatMessage(`You selected ${selectedChatbotCategory}. Ask your question and I will guide you.`, 'bot', 'chatbot-messages');
    }
  }

  document.querySelectorAll('[data-chatbot-category]').forEach((button) => {
    button.addEventListener('click', () => {
      setSelectedChatCategory(button.dataset.chatbotCategory || '');
      appendQuickChatMessage(selectedChatbotCategory, 'user', 'chatbot-messages');
      appendQuickChatMessage(`You selected ${selectedChatbotCategory}. Ask your question and I will guide you.`, 'bot', 'chatbot-messages');
      chatbotInput?.focus();
    });
  });
  document.getElementById('chatbot-agent-button')?.addEventListener('click', showAgentStartForm);

  chatbotForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = cleanEnquiryValue(chatbotInput?.value);
    if (!message) return;
    appendQuickChatMessage(message, 'user', 'chatbot-messages');
    if (chatbotInput) chatbotInput.value = '';
    setFormSubmitting(chatbotForm, true, 'submitting');
    try {
      const answer = await askChatbot({ message, selectedCategory: selectedChatbotCategory, botAnswerCount });
      botAnswerCount = Number(answer.botAnswerCount || botAnswerCount + 1);
      selectedChatbotCategory = answer.category || selectedChatbotCategory;
      window.localStorage.setItem('nidhi-bot-answer-count', String(botAnswerCount));
      appendQuickChatMessage(answer.answer, 'bot', 'chatbot-messages');
      if (answer.recommendAgent || answer.agentRequested || botAnswerCount >= 6) {
        appendAgentSuggestion();
      }
      if (answer.agentRequested) showAgentStartForm();
    } catch (error) {
      appendQuickChatMessage('I may need a little more detail. You can choose a service category or chat with a live agent.', 'bot', 'chatbot-messages');
      appendAgentSuggestion();
    } finally {
      setFormSubmitting(chatbotForm, false);
    }
  });

  const renderChatMessages = (messages = []) => {
    if (!liveChatMessages) {
      return;
    }
    if (!messages.length && !renderedLiveMessageIds.size) {
      appendQuickChatMessage('Connecting you to an agent...', 'system', 'live-chat-messages');
      return;
    }
    messages.forEach((entry) => {
      const key = entry.id || `${entry.sender}-${entry.createdAt}-${entry.message}`;
      const contentKey = `${entry.sender || entry.senderType}-${entry.message}`;
      if (renderedLiveMessageIds.has(key) || renderedLiveMessageIds.has(contentKey)) return;
      renderedLiveMessageIds.add(key);
      renderedLiveMessageIds.add(contentKey);
      const type = entry.sender === 'customer' ? 'user' : entry.sender === 'agent' ? 'agent' : 'system';
      const timestamp = entry.createdAt ? `\n${new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '';
      appendQuickChatMessage(`${entry.message}${timestamp}`, type, 'live-chat-messages');
    });
  };

  const loadChatMessages = async () => {
    if (!activeLiveChatId) {
      return;
    }
    try {
      const response = await fetchChatMessages(activeLiveChatId);
      renderChatMessages(response.messages || []);
      setStatusElement(liveChatMessageStatus, 'Live chat connected', 'is-success');
    } catch (error) {
      setStatusElement(liveChatMessageStatus, getTranslation(currentLang, 'network-error'), 'is-error');
    }
  };

  const startChatPolling = () => {
    window.clearInterval(chatPollingTimer);
    chatPollingTimer = window.setInterval(loadChatMessages, 3000);
  };

  const openLiveChat = () => {
    liveChatWidget?.classList.remove('is-collapsed');
    liveChatToggle?.setAttribute('aria-expanded', 'true');
    if (activeLiveChatId && liveChatRoom) {
      chatbotRoom?.setAttribute('hidden', '');
      liveChatStartForm?.setAttribute('hidden', '');
      liveChatRoom.hidden = false;
      liveChatInput?.focus();
      loadChatMessages();
      startChatPolling();
    } else {
      chatbotInput?.focus();
    }
  };

  quickToggle?.addEventListener('click', () => {
    const isCollapsed = quickWidget?.classList.toggle('is-collapsed');
    quickToggle.setAttribute('aria-expanded', String(!isCollapsed));
    if (!isCollapsed) {
      document.getElementById('quick-lead-name')?.focus();
    }
  });

  liveChatToggle?.addEventListener('click', () => {
    const isCollapsed = liveChatWidget?.classList.toggle('is-collapsed');
    liveChatToggle.setAttribute('aria-expanded', String(!isCollapsed));
    if (!isCollapsed) {
      openLiveChat();
    }
  });

  const quickLeadForm = document.getElementById('quick-lead-form');
  const getQuickLeadData = () => ({
    name: document.getElementById('quick-lead-name')?.value,
    phone: document.getElementById('quick-lead-phone')?.value,
    email: document.getElementById('quick-lead-email')?.value,
    service: document.getElementById('quick-lead-service')?.value,
    message: document.getElementById('quick-lead-message')?.value,
    companyWebsite: document.getElementById('quick-lead-website')?.value
  });

  quickLeadForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isFormSubmitting(quickLeadForm)) {
      return;
    }
    const payload = buildEnquiryPayload(getQuickLeadData(), 'quick_enquiry');
    const validation = validateEnquiryPayload(payload);
    if (!validation.valid) {
      setStatusElement(quickLeadStatus, validation.message, 'is-error');
      return;
    }

    setFormSubmitting(quickLeadForm, true);
    setStatusElement(quickLeadStatus, '', '');
    try {
      const submission = await submitEnquiry(payload);
      setStatusElement(quickLeadStatus, getSuccessfulEnquiryMessage(submission.referenceId), 'is-success');
      quickLeadForm.reset();
    } catch (error) {
      console.error('Quick enquiry submit failed', error);
      setStatusElement(quickLeadStatus, error.message || getTranslation(currentLang, 'something-went-wrong'), 'is-error');
    } finally {
      setFormSubmitting(quickLeadForm, false);
    }
  });

  liveChatStartForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = buildEnquiryPayload({
      name: document.getElementById('chat-start-name')?.value,
      phone: document.getElementById('chat-start-phone')?.value,
      email: document.getElementById('chat-start-email')?.value,
      service: document.getElementById('chat-start-service')?.value,
      message: document.getElementById('chat-start-message')?.value,
      companyWebsite: document.getElementById('chat-start-website')?.value,
      metadata: {
        liveAgentRequested: true,
        serviceCategory: selectedChatbotCategory || document.getElementById('chat-start-service')?.value,
        botAnswerCount
      }
    }, 'live_chat_start');
    const validation = validateEnquiryPayload(payload);
    if (!validation.valid) {
      setStatusElement(liveChatStartStatus, validation.message, 'is-error');
      return;
    }

    setFormSubmitting(liveChatStartForm, true, 'submitting');
    setStatusElement(liveChatStartStatus, 'Connecting you to an agent...', 'is-info');
    try {
      const response = await startChat(payload);
      activeLiveChatId = response.chatId;
      activeLiveChatReference = response.enquiryId || '';
      setStatusElement(liveChatStartStatus, `Chat ID: ${response.chatId}`, 'is-success');
      liveChatStartForm.setAttribute('hidden', '');
      chatbotRoom?.setAttribute('hidden', '');
      if (liveChatRoom) {
        liveChatRoom.hidden = false;
      }
      appendQuickChatMessage('Connecting you to an agent...', 'system', 'live-chat-messages');
      appendQuickChatMessage('Our team has received your request.', 'system', 'live-chat-messages');
      appendQuickChatMessage(getTranslation(currentLang, 'agent-reply-shortly'), 'system', 'live-chat-messages');
      await loadChatMessages();
      startChatPolling();
      liveChatInput?.focus();
    } catch (error) {
      setStatusElement(liveChatStartStatus, error.message || 'Our support team is currently offline. Please leave your message and we will contact you shortly.', 'is-error');
    } finally {
      setFormSubmitting(liveChatStartForm, false, 'start-chat');
    }
  });

  liveChatForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = cleanEnquiryValue(liveChatInput?.value);
    if (!message) {
      return;
    }

    appendQuickChatMessage(message, 'user', 'live-chat-messages');
    renderedLiveMessageIds.add(`customer-${message}`);
    if (liveChatInput) {
      liveChatInput.value = '';
    }
    setFormSubmitting(liveChatForm, true, 'submitting');
    setStatusElement(liveChatMessageStatus, 'Sending...', 'is-info');
    try {
      if (!activeLiveChatId) {
        throw new Error('Please start the chat first.');
      }
      await sendChatMessage(activeLiveChatId, message);
      setStatusElement(liveChatMessageStatus, '', '');
      await loadChatMessages();
    } catch (error) {
      setStatusElement(liveChatMessageStatus, `${error.message || getTranslation(currentLang, 'something-went-wrong')} Retry by sending again.`, 'is-error');
    } finally {
      setFormSubmitting(liveChatForm, false);
    }
  });

  try {
    activeLiveChatId = window.sessionStorage.getItem(CHAT_ID_KEY) || activeLiveChatId;
  } catch (error) {
    activeLiveChatId = activeLiveChatId || '';
  }
  if (activeLiveChatId && liveChatStartForm && liveChatRoom) {
    liveChatStartForm.setAttribute('hidden', '');
    liveChatRoom.hidden = false;
    loadChatMessages();
    startChatPolling();
  }

  calculateFloatingEMI();
}

function enhanceFooter() {
  const footer = document.querySelector('footer');
  if (!footer) {
    return;
  }
  const loginDeveloperCredit = document.body.classList.contains('login-page')
    ? `
    <div class="login-developer-credit">
      <span>Website developed by <strong>BDITS</strong></span>
      <span>Project Contributors: Praneetha Mahavadi and Himasri Kolli</span>
    </div>`
    : "";

  footer.innerHTML = `
    <div class="footer-grid premium-footer-grid">
      <div class="footer-brand-block">
        <img src="logo.jpg" alt="Nidhi Path Loan Ventures logo" class="footer-logo">
        <span class="brand-name brand-name-inline" data-site-setting="business_name">Nidhi Path Loan Ventures</span>
        <small data-site-setting="tagline">Way to Money</small>
      </div>
      <div class="footer-services-block">
        <h4 data-i18n="services-title">Our Services</h4>
        <ul class="footer-link-list footer-service-grid">
          <li><a href="education-loan.html" data-i18n="education-loan"></a></li>
          <li><a href="personal-loan.html" data-i18n="personal-loan"></a></li>
          <li><a href="business-loan.html" data-i18n="business-loan"></a></li>
          <li><a href="home-loan.html" data-i18n="home-loan"></a></li>
          <li><a href="mutual-funds.html" data-i18n="mutual-funds"></a></li>
          <li><a href="insurance.html" data-i18n="insurance"></a></li>
        </ul>
      </div>
      <div class="footer-address-block">
        <h4 data-i18n="contact-title">Contact Us</h4>
        <p><strong>Phone:</strong> <a href="tel:+919705682595" data-site-setting="official_phone">+91 97056 82595</a></p>
        <p><strong>Email:</strong> <a href="mailto:info@nidhipath.in" data-site-setting="official_email">info@nidhipath.in</a></p>
        <p><strong>Website:</strong> <a href="https://www.nidhipath.in" data-site-setting="official_website">www.nidhipath.in</a></p>
        <address data-site-setting="address">
          4th Floor, Prasad Plaza,<br>
          Brooks Backside Lane,<br>
          Konera Lakshmaya Gari Veedhi,<br>
          Near United Telugu Kitchens Restaurant,<br>
          40-3/14-6/4C, Vijayawada,<br>
          Andhra Pradesh 520010
        </address>
      </div>
      <div class="footer-map-block">
        <h4>Location Map</h4>
        <a class="map-open-link" href="https://maps.app.goo.gl/gKMZ7mSm5YEk1dWK8" target="_blank" rel="noopener">Open in Google Maps</a>
        <iframe
          title="Nidhi Path Loan Ventures location map"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=16.5030278,80.6472778&z=17&output=embed">
        </iframe>
      </div>
    </div>
    <p class="footer-bottom">&copy; 2026 <span class="brand-name brand-name-inline">Nidhi Path</span> Loan Ventures. All rights reserved. Nidhi Path provides loan guidance and consultation. Loan approval is subject to multiple bank policies, eligibility, documents and credit assessment.</p>
    <p class="footer-terms-note">Terms and Conditions apply.</p>
    ${loginDeveloperCredit}
  `;
}

const serviceDetailContent = {
  'education-loan.html': {
    badge: 'Education Loan Desk',
    title: 'Complete guidance for domestic and abroad education loans',
    summary: 'We help students and parents prepare the education loan conversation with admission-based planning, course expense review, co-applicant preparation and documentation support.',
    highlights: [
      ['Domestic study', 'Course fee, hostel, exam, library, books and equipment discussion for study in India.'],
      ['Study abroad', 'Admission letter, living cost, travel, forex-related questions and collateral preparation where applicable.'],
      ['Parent support', 'Co-applicant profile, income proof, bank statement and repayment planning guidance.'],
      ['Moratorium planning', 'EMI estimate with study-period and repayment-period assumptions for better family planning.']
    ],
    documents: ['Admission letter or offer proof', 'Fee structure and expense schedule', 'Academic records', 'Student and co-applicant KYC', 'Income proof where applicable', 'Bank statements', 'Scholarship letter if available', 'Collateral papers if required'],
    process: ['Understand course and admission status', 'Prepare fee and living-cost estimate', 'Review co-applicant and documents', 'Discuss bank process and next steps'],
    note: 'Education loan approval, margin money, collateral and moratorium terms depend on multiple bank policies and customer profile.'
  },
  'personal-loan.html': {
    badge: 'Personal Loan Desk',
    title: 'Personal loan guidance with income, EMI and document clarity',
    summary: 'We support customers who need loans for personal requirements and want to understand eligibility, repayment comfort and documentation before applying.',
    highlights: [
      ['Profile review', 'Monthly income, existing EMIs, city, employer type and credit history discussion.'],
      ['EMI planning', 'Tenure and loan amount planning so repayment remains practical.'],
      ['Document preparation', 'KYC, salary slips, bank statements and employer details where needed.'],
      ['Transparent guidance', 'No approval promises, only profile-based preparation and next-step clarity.']
    ],
    documents: ['PAN or Aadhaar', 'Address proof', 'Recent salary slips', 'Bank statements', 'Employment details', 'Existing loan details if any'],
    process: ['Understand loan purpose', 'Check income and obligation comfort', 'Prepare basic documents', 'Guide formal application step'],
    note: 'Personal loan eligibility usually depends on income, credit history, repayment track record and multiple bank policies.'
  },
  'business-loan.html': {
    badge: 'Business Loan Desk',
    title: 'Loans guidance for working capital and business growth',
    summary: 'We help business owners organize requirements, banking history and documents before discussing suitable loans options.',
    highlights: [
      ['Business requirement', 'Working capital, expansion, machinery, stock or cash-flow support discussion.'],
      ['Banking review', 'Current account behavior, cash flow and existing obligations are considered for preparation.'],
      ['Document checklist', 'Business proof, KYC, statements, ITR or financial documents where applicable.'],
      ['Option clarity', 'Secured and unsecured loans conversations based on profile and need.']
    ],
    documents: ['Owner KYC', 'Business registration or proof', 'Bank statements', 'ITR or financials where applicable', 'GST details if available', 'Loan purpose notes'],
    process: ['Map business need', 'Review banking and income indicators', 'Prepare document checklist', 'Plan discussion with multiple banks'],
    note: 'Business loans depends on business stability, cash flow, documents, credit assessment and multiple bank policies.'
  },
  'home-loan.html': {
    badge: 'Home Loan Desk',
    title: 'Home loan preparation for purchase, construction and transfer',
    summary: 'We guide customers through property-stage discussion, income profile, EMI planning and documentation expectations before formal bank processing.',
    highlights: [
      ['Property clarity', 'Purchase, construction, renovation and balance transfer discussion.'],
      ['Income Review', 'Salary, business income, obligations and co-applicant possibilities.'],
      ['Document support', 'Property papers, KYC, bank statements and income documents.'],
      ['Long-term planning', 'Tenure, EMI, down payment and repayment comfort review.']
    ],
    documents: ['Applicant KYC', 'Income proof', 'Bank statements', 'Property documents', 'Sale agreement if available', 'Existing loan statement for transfer cases'],
    process: ['Understand property stage', 'Review applicant profile', 'Prepare document list', 'Discuss EMI and next steps'],
    note: 'Property valuation, legal checks, eligibility and sanction terms are decided by multiple banks.'
  },
  'mutual-funds.html': {
    badge: 'Investment Guidance',
    title: 'Goal-based mutual loan consultation support',
    summary: 'We help customers understand investment horizon, risk comfort and documentation basics before taking a decision.',
    highlights: [
      ['Goal mapping', 'Education, family goals, wealth creation or long-term planning discussion.'],
      ['Risk understanding', 'Customer comfort, time horizon and volatility awareness.'],
      ['KYC preparation', 'PAN, bank details and basic identity preparation.'],
      ['Review discipline', 'Encouragement to read scheme information and invest only after understanding risk.']
    ],
    documents: ['PAN', 'Aadhaar or identity proof', 'Bank account details', 'Nominee details', 'Mobile and email', 'KYC status'],
    process: ['Understand goal and time horizon', 'Discuss risk comfort', 'Prepare KYC basics', 'Review suitability before action'],
    note: 'Mutual loan investments are subject to market risks. Customers should read scheme documents and assess suitability.'
  },
  'insurance.html': {
    badge: 'Protection Guidance',
    title: 'Insurance guidance for family, personal and business protection',
    summary: 'We help customers understand coverage needs, nominee details, documents and comparison points before choosing insurance options.',
    highlights: [
      ['Need assessment', 'Life, health, vehicle, property or business protection discussion.'],
      ['Coverage clarity', 'Sum insured, premium, exclusions, waiting periods and claim basics.'],
      ['Family planning', 'Nominee details, dependent needs and continuity planning.'],
      ['Documentation', 'KYC, existing policy details and health or asset information where required.']
    ],
    documents: ['Applicant KYC', 'Nominee details', 'Existing policy details if any', 'Medical history where applicable', 'Asset documents for asset insurance'],
    process: ['Understand protection gap', 'Review coverage need', 'Prepare document basics', 'Discuss suitable next step'],
    note: 'Insurance issuance, premium and coverage are subject to insurer underwriting, policy terms and disclosures.'
  },
  'all-loans.html': {
    badge: 'Loan Navigation',
    title: 'One desk for multiple loan requirements',
    summary: 'When customers are unsure which loan path is suitable, we help compare purpose, eligibility review and practical next steps.',
    highlights: [
      ['Requirement sorting', 'Education, personal, business, home and other loan categories discussed clearly.'],
      ['Profile match', 'Income type, documents, city, co-applicant and repayment comfort reviewed.'],
      ['Document planning', 'A clean checklist is created based on the selected loan type.'],
      ['Follow-up tracking', 'The team can organize enquiry follow-up and next-step status updates.']
    ],
    documents: ['KYC', 'Income proof', 'Bank statements', 'Purpose proof', 'Property or business documents if relevant', 'Academic records for education loans'],
    process: ['Identify loan purpose', 'Shortlist possible route', 'Check preparation gaps', 'Move to service-specific enquiry'],
    note: 'Every loan category has different multiple bank policies. Formal approval depends on verification and eligibility.'
  },
  'loan-consultation.html': {
    badge: 'Consultation Desk',
    title: 'Personalized loan consultation before you apply',
    summary: 'This service is for customers who want a clear conversation before deciding loan type, amount, tenure or documentation route.',
    highlights: [
      ['Decision clarity', 'Understand whether education, personal, home, business or another route fits the requirement.'],
      ['Eligibility discussion', 'Basic preparation review around income, credit history, co-applicant and documents.'],
      ['Cost planning', 'EMI, tenure, processing fee and repayment comfort explanation.'],
      ['Action plan', 'A practical next-step checklist for customer and family follow-up.']
    ],
    documents: ['Basic KYC', 'Income or academic details', 'Existing loan details', 'Approximate amount required', 'Purpose notes', 'Available supporting documents'],
    process: ['Discuss requirement', 'Review preparation', 'Build document checklist', 'Plan next action'],
    note: 'Consultation is guidance only. It does not promise loan approval, rate or disbursement.'
  }
};

function getCurrentPageName() {
  const page = window.location.pathname.split('/').pop();
  return page || 'index.html';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function listMarkup(items) {
  return items.map((item) => `<li>${getPhraseTranslation(currentLang, item)}</li>`).join('');
}

function cardMarkup(items) {
  return items.map(([title, text], index) => `
    <article class="compact-card">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <h3>${getPhraseTranslation(currentLang, title)}</h3>
      <p>${getPhraseTranslation(currentLang, text)}</p>
    </article>
  `).join('');
}

const pageVisualContent = {
  'services.html': {
    badge: 'Visual Service Desk',
    title: 'Choose the right support route by looking at the need first',
    copy: 'The service page now works like a visual directory: education, income, business, property, investment and protection needs are separated into clear visual lanes.',
    imageClass: 'visual-page-services',
    stats: [['6+', 'core service paths'], ['1', 'guided enquiry desk'], ['24/7', 'online enquiry']],
    tiles: [
      ['Education', 'Admission, course fee and family preparation'],
      ['Income', 'Personal loans and repayment comfort'],
      ['Business', 'Working capital and documentation'],
      ['Protection', 'Insurance and long-term planning']
    ]
  },
  'about.html': {
    badge: 'Company Visual Story',
    title: 'A guidance-first company built around clarity and trust',
    copy: 'Nidhi Path is positioned as a practical support desk where customers can understand documents, eligibility, repayment and formal process expectations before they move ahead.',
    imageClass: 'visual-page-about',
    stats: [['Trust', 'clear conversations'], ['Support', 'student and family focus'], ['Local', 'Vijayawada office']],
    tiles: [
      ['8+ Years Experience', 'Trusted guidance built through years of education finance support'],
      ['25+ Network Banks', 'Access to a wider banking network for practical option comparison'],
      ['500+ Disbursements', 'Strong execution experience across student loans cases'],
      ['100+ Top-Ups', 'Additional loans support for eligible ongoing study needs']
    ]
  },
  'eligibility.html': {
    badge: 'Eligibility Visual Board',
    title: 'See the loans-preparation picture before calculating EMI',
    copy: 'Eligibility is easier to understand when applicants can see the role of admission proof, income, co-applicant documents, bank statements and repayment comfort together.',
    imageClass: 'visual-page-eligibility',
    stats: [['EMI', 'estimate planning'], ['Docs', 'preparation review'], ['Profile', 'basic review']],
    tiles: [
      ['Student proof', 'Admission, fee and academic documents'],
      ['Co-applicant', 'Parent or guardian profile preparation'],
      ['Income view', 'Salary, business or bank statement support'],
      ['Repayment map', 'Tenure and EMI estimate discussion']
    ]
  },
  'contact.html': {
    badge: 'Contact Visual Desk',
    title: 'Connect through a clear enquiry and office support path',
    copy: 'The contact page visually separates enquiry, phone support, office visit, location map and follow-up so customers know exactly how to reach the team.',
    imageClass: 'visual-page-contact',
    stats: [['Phone', '+91 97056 82595'], ['Office', 'Vijayawada'], ['Map', 'live location']],
    tiles: [
      ['Call', 'Speak with the team'],
      ['Form', 'Share requirement details'],
      ['Visit', 'Use the office map'],
      ['Follow-up', 'Receive next-step guidance']
    ]
  },
  'login.html': {
    badge: 'Dashboard Preview',
    title: 'A future-ready login area for customers, staff and admin users',
    copy: 'This visual preview explains the next phase: lead tracking, document upload, customer updates and staff follow-up without activating a live dashboard yet.',
    imageClass: 'visual-page-dashboard',
    stats: [['Customer', 'status access'], ['Staff', 'follow-ups'], ['Admin', 'pipeline view']],
    tiles: [
      ['Customer Login', 'Application status and reminders'],
      ['Staff Login', 'Lead notes and follow-up tasks'],
      ['Admin Login', 'Team view and reports'],
      ['Documents', 'Upload-ready expansion path']
    ]
  },
  'education-loan.html': {
    badge: 'Education Visual Path',
    title: 'From admission proof to study-expense planning',
    copy: 'Students and parents can quickly see the full education loans preparation flow: course, country, documents, family preparation and repayment planning.',
    imageClass: 'visual-page-education',
    stats: [['India', 'domestic study'], ['Abroad', 'overseas planning'], ['Family', 'co-applicant support']],
    tiles: [
      ['Admission', 'Offer letter and course details'],
      ['Expenses', 'Fee, living, books and travel'],
      ['Documents', 'Student and parent checklist'],
      ['Repayment', 'EMI and moratorium assumptions']
    ]
  },
  'personal-loan.html': {
    badge: 'Personal Loaning Visual Path',
    title: 'Income, purpose and repayment comfort in one view',
    copy: 'Personal loan guidance is presented visually around requirement, income documents, existing obligations and responsible EMI planning.',
    imageClass: 'visual-page-personal',
    stats: [['Income', 'profile review'], ['EMI', 'comfort check'], ['Docs', 'KYC basics']],
    tiles: [
      ['Purpose', 'Understand the loan requirement'],
      ['Income', 'Salary and bank statement preparation'],
      ['Obligations', 'Existing EMI and credit behavior'],
      ['Tenure', 'Practical repayment discussion']
    ]
  },
  'business-loan.html': {
    badge: 'Business Loaning Visual Path',
    title: 'Visualize business need, cash flow and document preparation',
    copy: 'Business owners can see how working capital, expansion plans, banking history and financial documents connect before formal discussions.',
    imageClass: 'visual-page-business',
    stats: [['Capital', 'business need'], ['Banking', 'statement view'], ['Docs', 'ITR/GST basics']],
    tiles: [
      ['Need', 'Working capital or expansion'],
      ['Cash flow', 'Banking and income indicators'],
      ['Proof', 'Business registration and KYC'],
      ['Next step', 'Loans route discussion']
    ]
  },
  'home-loan.html': {
    badge: 'Property Loans Visual Path',
    title: 'Understand property stage, down payment and EMI planning',
    copy: 'Home loan preparation becomes easier when purchase stage, property papers, income, co-applicant and repayment plan are seen together.',
    imageClass: 'visual-page-home',
    stats: [['Property', 'document view'], ['Tenure', 'long-term plan'], ['Income', 'eligibility inputs']],
    tiles: [
      ['Property', 'Purchase, construction or transfer'],
      ['Papers', 'Agreement and ownership documents'],
      ['Income', 'Applicant and co-applicant profile'],
      ['EMI', 'Long-term repayment planning']
    ]
  },
  'mutual-funds.html': {
    badge: 'Investment Visual Path',
    title: 'Map goals, time horizon and risk comfort visually',
    copy: 'Mutual loan guidance is shown as a goal-first visual journey where customers see horizon, KYC, risk awareness and review discipline.',
    imageClass: 'visual-page-mutual',
    stats: [['Goals', 'planning focus'], ['KYC', 'basic preparation'], ['Risk', 'awareness first']],
    tiles: [
      ['Goal', 'Education, family or wealth objective'],
      ['Horizon', 'Short, medium or long-term view'],
      ['KYC', 'PAN, bank and nominee basics'],
      ['Review', 'Understand risk before action']
    ]
  },
  'insurance.html': {
    badge: 'Protection Visual Path',
    title: 'See protection needs before comparing policy options',
    copy: 'Insurance guidance is represented around family protection, health, asset cover, nominee details and documentation awareness.',
    imageClass: 'visual-page-insurance',
    stats: [['Life', 'family cover'], ['Health', 'medical protection'], ['Asset', 'property/vehicle']],
    tiles: [
      ['Need', 'Life, health or asset protection'],
      ['Coverage', 'Sum insured and exclusions'],
      ['Family', 'Nominee and dependent details'],
      ['Documents', 'KYC and policy records']
    ]
  },
  'all-loans.html': {
    badge: 'All-Loan Visual Navigator',
    title: 'Sort the requirement before choosing the product',
    copy: 'Customers who are unsure can visually compare education, personal, business, home and other requirements before selecting a suitable support path.',
    imageClass: 'visual-page-all',
    stats: [['Route', 'need sorting'], ['Profile', 'preparation view'], ['Action', 'next-step plan']],
    tiles: [
      ['Purpose', 'What the money is for'],
      ['Profile', 'Income, city and documents'],
      ['Match', 'Possible support route'],
      ['Enquiry', 'Move to dedicated page']
    ]
  },
  'loan-consultation.html': {
    badge: 'Consultation Visual Path',
    title: 'A guided conversation before any formal application',
    copy: 'The consultation page shows the decision path visually: requirement, eligibility, documents, EMI and practical next action.',
    imageClass: 'visual-page-consult',
    stats: [['Discuss', 'requirement'], ['Review', 'preparation'], ['Plan', 'next action']],
    tiles: [
      ['Requirement', 'Amount, purpose and urgency'],
      ['Eligibility', 'Profile and document gaps'],
      ['Cost', 'EMI and tenure comfort'],
      ['Checklist', 'Action plan for follow-up']
    ]
  }
};

function injectPageVisualSystem() {
  if (isLoginPage() || isAdminPage()) {
    return;
  }

  if (document.body.classList.contains('home-page') && !document.body.classList.contains('content-page')) {
    return;
  }

  const main = document.querySelector('main.content-main') || document.querySelector('main.login-main');
  const hero = main?.querySelector('.content-hero, .login-shell');
  const pageData = pageVisualContent[getCurrentPageName()];
  if (!main || !hero || !pageData || document.querySelector('.page-visual-system')) {
    return;
  }

  const stats = pageData.stats.map(([value, label]) => `
    <article>
      <strong data-phrase-source="${escapeHtml(value)}">${getPhraseTranslation(currentLang, value)}</strong>
      <span data-phrase-source="${escapeHtml(label)}">${getPhraseTranslation(currentLang, label)}</span>
    </article>
  `).join('');

  const tiles = pageData.tiles.map(([title, text], index) => `
    <article>
      <span>${String(index + 1).padStart(2, '0')}</span>
      <strong data-phrase-source="${escapeHtml(title)}">${getPhraseTranslation(currentLang, title)}</strong>
      <p data-phrase-source="${escapeHtml(text)}">${getPhraseTranslation(currentLang, text)}</p>
    </article>
  `).join('');

  hero.insertAdjacentHTML('afterend', `
    <section class="page-visual-system">
      <div class="page-visual-grid">
        <div class="page-visual-stage ${pageData.imageClass}">
          <img class="page-visual-logo" src="logo.jpg" alt="Nidhi Path logo">
          <div class="page-visual-caption">
            <span data-phrase-source="${escapeHtml(pageData.badge)}">${getPhraseTranslation(currentLang, pageData.badge)}</span>
            <strong data-phrase-source="${escapeHtml(pageData.title)}">${getPhraseTranslation(currentLang, pageData.title)}</strong>
            <p data-phrase-source="${escapeHtml(pageData.copy)}">${getPhraseTranslation(currentLang, pageData.copy)}</p>
          </div>
        </div>
        <div class="page-visual-panel">
          <div class="page-visual-stats">${stats}</div>
          <div class="page-visual-tiles">${tiles}</div>
        </div>
      </div>
    </section>
  `);
}

function injectServiceDetailContent() {
  if (!document.body.classList.contains('service-detail-page')) {
    return;
  }

  const data = serviceDetailContent[getCurrentPageName()];
  const main = document.querySelector('main.content-main');
  if (!data || !main || document.querySelector('.service-detail-expansion')) {
    return;
  }

  const pageCta = main.querySelector('.page-cta');
  const html = `
    <section class="page-section service-detail-expansion">
      <div class="content-band service-detail-band">
        <div>
          <p class="eyebrow">${getPhraseTranslation(currentLang, data.badge)}</p>
          <h2>${getPhraseTranslation(currentLang, data.title)}</h2>
          <p>${getPhraseTranslation(currentLang, data.summary)}</p>
        </div>
        <div class="document-chip-box">
          <h3>${getPhraseTranslation(currentLang, 'Documents to keep ready')}</h3>
          <ul class="document-chip-grid">${listMarkup(data.documents)}</ul>
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="dense-card-grid">${cardMarkup(data.highlights)}</div>
    </section>

    <section class="page-section">
      <div class="service-process-panel">
        <div>
          <p class="eyebrow">${getPhraseTranslation(currentLang, 'Guidance Flow')}</p>
          <h2>${getPhraseTranslation(currentLang, 'How this service moves forward')}</h2>
        </div>
        <div class="process-strip mini-process-strip">
          ${data.process.map((step, index) => `<article><strong>${index + 1}</strong><span>${getPhraseTranslation(currentLang, step)}</span></article>`).join('')}
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="responsibility-note">
        <strong>${getPhraseTranslation(currentLang, 'Important:')}</strong>
        <span>${getPhraseTranslation(currentLang, data.note)}</span>
      </div>
    </section>
  `;

  if (pageCta) {
    pageCta.insertAdjacentHTML('beforebegin', html);
  } else {
    main.insertAdjacentHTML('beforeend', html);
  }
}

function bindDestinationFilters() {
  const filters = document.querySelectorAll('.destination-filter');
  const cards = document.querySelectorAll('.destination-card');
  const count = document.getElementById('destination-filter-count');
  if (!filters.length || !cards.length) {
    return;
  }

  const updateFilter = (filterValue) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const group = card.getAttribute('data-destination-group');
      const shouldShow = filterValue === 'all' || group === filterValue;
      card.classList.toggle('is-hidden', !shouldShow);
      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filters.forEach((button) => {
      button.classList.toggle('is-active', button.getAttribute('data-destination-filter') === filterValue);
    });

    if (count) {
      count.textContent = filterValue === 'all'
        ? getPhraseTranslation(currentLang, 'Showing all guidance cards')
        : `${visibleCount} ${getPhraseTranslation(currentLang, 'guidance cards shown')}`;
    }
  };

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      updateFilter(button.getAttribute('data-destination-filter') || 'all');
    });
  });
}

function bindHeroStoryRotator() {
  const word = document.getElementById('hero-rotating-word');
  const slides = Array.from(document.querySelectorAll('.hero-story-slide'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  const words = ['Ambition', 'Direction', 'Milestone', 'Momentum'];

  if (!word || !slides.length) {
    return;
  }

  // B4 — Render a string as per-letter spans inside `word`, so each letter
  // can be animated independently for the rotate-in / rotate-out effect.
  const renderLetters = (text) => {
    word.innerHTML = '';
    const fragment = document.createDocumentFragment();
    Array.from(text).forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'rw-letter rw-in-init';
      span.style.transitionDelay = `${i * 28}ms`;
      span.textContent = char === ' ' ? ' ' : char;
      if (char === ' ') {
        span.textContent = '\u00a0';
      }
      fragment.appendChild(span);
    });
    word.appendChild(fragment);
    // Next frame, remove the init class so letters animate in.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        word.querySelectorAll('.rw-letter').forEach((l) => l.classList.remove('rw-in-init'));
      });
    });
  };

  // Seed the initial render with the existing static text so the page does
  // not flash empty before the first interval tick.
  renderLetters(word.textContent.trim());

  let activeIndex = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.NIDHI_renderHeroWord = (text) => {
    if (reduced) {
      word.textContent = text;
      return;
    }

    renderLetters(text);
  };

  const setActiveStory = (nextIndex) => {
    activeIndex = nextIndex % words.length;
    const next = getPhraseTranslation(currentLang, words[activeIndex]);

    if (reduced) {
      word.textContent = next;
    } else {
      // Animate current letters out, then render new letters in.
      const oldLetters = Array.from(word.querySelectorAll('.rw-letter'));
      oldLetters.forEach((letter, i) => {
        letter.style.transitionDelay = `${i * 22}ms`;
        letter.classList.add('rw-out');
      });
      const exitDuration = Math.min(180, 90 + oldLetters.length * 12);
      window.setTimeout(() => renderLetters(next), exitDuration);
    }

    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
    });
  };

  window.setInterval(() => {
    setActiveStory(activeIndex + 1);
  }, 3200);
}

function bindHeroProofNavigation() {
  document.querySelectorAll('.hero-proof-row article[data-nav-target]').forEach((card) => {
    const navigate = () => {
      const target = card.getAttribute('data-nav-target');
      if (!target) {
        return;
      }

      const [path, hash] = target.split('#');
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const isSamePage = (!path || path === currentPath) && hash;

      if (isSamePage) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      window.location.href = target;
    };

    card.addEventListener('click', navigate);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigate();
      }
    });
  });
}

function initPremiumScrollReveals() {
  const revealTargets = Array.from(document.querySelectorAll([
    '.visual-card',
    '.process-strip article',
    '.dashboard-preview-grid article',
    '.assurance-metrics article',
    '.dense-card-grid article',
    '.compact-card',
    '.info-card',
    // The existing .scroll-reveal-card.is-revealed:hover rule in style.css
    // enough — no extra CSS or JS plumbing needed.
    '.destination-card',
    '.highlight-card',
    '.premium-card',
    '.hero-story-card',
    '.support-card',
    '.feature-card',
    '.content-hero',
    '.contact-card',
    '.eligibility-block'
  ].join(',')));

  if (!revealTargets.length) {
    return;
  }

  revealTargets.forEach((target, index) => {
    target.classList.add('scroll-reveal-card');
    target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 90}ms`);
  });

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((target) => target.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -10% 0px'
  });

  revealTargets.forEach((target) => observer.observe(target));
}

function initializePremiumTiltEffects() {
  document.querySelectorAll('.premium-tilt').forEach((target) => target.classList.remove('is-tilting'));
}

window.NIDHI_initializePremiumTiltEffects = initializePremiumTiltEffects;

// A3 — Magnetic buttons. Translates buttons up to ±8px toward the cursor with
// a soft easing. Skips when keyboard-focused (a moving focus target is jarring
// for keyboard nav). Skips on touch / reduced-motion entirely.
function initMagneticButtons() {
  document.querySelectorAll('.btn, .apply-btn, .cta-btn, button[data-magnetic], a[data-magnetic]').forEach((el) => {
    el.style.removeProperty('--magnet-x');
    el.style.removeProperty('--magnet-y');
  });
}

// D3 — Confetti emitter exposed as window.nidhiConfetti(x?, y?). Any form
// success handler in vanilla pages can call it. Reduced-motion safe: becomes
// a no-op when the user prefers reduced motion.
function installConfettiEmitter() {
  if (window.nidhiConfetti) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    window.nidhiConfetti = function () { /* no-op for reduced motion */ };
    return;
  }
  window.nidhiConfetti = function (x, y) {
    const cx = typeof x === 'number' ? x : window.innerWidth / 2;
    const cy = typeof y === 'number' ? y : window.innerHeight / 3;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }
    const COLORS = ['#C99A2E', '#E0B552', '#FBE7A4', '#005B4F', '#061E42'];
    const particles = Array.from({ length: 80 }, () => ({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 1) * 14,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      size: 6 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
    }));
    const max = 1200;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      if (elapsed >= max) { canvas.remove(); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.vy += 0.4;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life = elapsed / max;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
}

// C1 — CSS-only 3D wireframe globe injected at the top of the destination
// planner section on the home page. Pure CSS animation, no WebGL — runs
// cheaply alongside the TubesIntro hero. No-op if the destination section
// isn't on the current page.
function initGlobe3D() {
  const section = document.querySelector('.destination-planner-section .destination-shell');
  if (!section) return;
  if (section.querySelector('.globe-3d')) return;

  const wrap = document.createElement('div');
  wrap.className = 'globe-3d-wrap';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="globe-3d">' +
      '<span class="globe-3d__halo"></span>' +
      '<span class="globe-3d__orbit globe-3d__orbit--one"></span>' +
      '<span class="globe-3d__orbit globe-3d__orbit--two"></span>' +
      '<span class="globe-3d__spark globe-3d__spark--one"></span>' +
      '<span class="globe-3d__spark globe-3d__spark--two"></span>' +
      '<div class="globe-3d__inner">' +
        '<div class="globe-3d__surface"></div>' +
        '<div class="globe-3d__axis"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lat-0"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lat-1"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lat-2"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lat-3"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lat-4"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lng-1"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lng-2"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lng-3"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lng-4"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lng-5"></div>' +
        '<div class="globe-3d__ring globe-3d__ring--lng-6"></div>' +
        '<div class="globe-3d__dot globe-3d__dot--1"></div>' +
        '<div class="globe-3d__dot globe-3d__dot--2"></div>' +
        '<div class="globe-3d__dot globe-3d__dot--3"></div>' +
        '<div class="globe-3d__dot globe-3d__dot--4"></div>' +
        '<div class="globe-3d__dot globe-3d__dot--5"></div>' +
      '</div>' +
      '<span class="globe-3d__shadow"></span>' +
    '</div>';
  // Insert after .destination-intro so it sits between the intro copy and the
  // summary panel / filter toolbar. Flow layout positions it naturally.
  const intro = section.querySelector('.destination-intro');
  if (intro && intro.nextSibling) {
    section.insertBefore(wrap, intro.nextSibling);
  } else {
    section.appendChild(wrap);
  }
}

// C2 — 3D gold coin injected next to the EMI heading on the vanilla planner
// page (eligibility.html → #advanced-emi-planner). Pure CSS 3D, idles with a
// slow Y rotation; speeds up on hover. No-op if the planner isn't on this
// page or the coin is already there.
function initCoin3DBadge() {
  const planner = document.getElementById('advanced-emi-planner');
  if (!planner) return;
  if (planner.querySelector('.coin-3d')) return;

  // Best heuristic: drop the coin next to the eyebrow / heading inside the
  // planner-heading block. If markup ever changes, this is a no-op.
  const heading = planner.querySelector('.planner-heading');
  if (!heading) return;

  const coin = document.createElement('span');
  coin.className = 'coin-3d';
  coin.setAttribute('aria-hidden', 'true');
  coin.innerHTML =
    '<span class="coin-3d__inner">' +
    '<span class="coin-3d__face">P</span>' +
    '<span class="coin-3d__face coin-3d__face--back">N</span>' +
    '</span>';
  // Float the coin to the right of the heading copy via inline flex wrap.
  heading.style.display = 'flex';
  heading.style.alignItems = 'flex-start';
  heading.style.gap = '1rem';
  heading.style.flexWrap = 'wrap';
  heading.appendChild(coin);
}

// D1 — Custom desktop cursor: a small gold dot that snaps to the cursor plus
// a larger gold ring that eases toward it (RAF lerp). Disabled on touch /
// reduced-motion. Hidden over form fields / iframes / contenteditable so the
// native caret remains. The native cursor stays visible underneath; the
// custom overlay just adds visual weight.
function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.getElementById('nidhi-cursor-dot')) return;

  const dot = document.createElement('div');
  dot.id = 'nidhi-cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  const ring = document.createElement('div');
  ring.id = 'nidhi-cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let rafId = 0;

  const TEXT_INPUT_RE = /^(INPUT|TEXTAREA|SELECT)$/;
  const hideOver = (target) => {
    if (!target) return false;
    if (TEXT_INPUT_RE.test(target.tagName)) return true;
    if (target.isContentEditable) return true;
    if (target.tagName === 'IFRAME') return true;
    return false;
  };

  const onMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    const over = hideOver(e.target);
    dot.classList.toggle('is-hidden', over);
    ring.classList.toggle('is-hidden', over);
    ring.classList.toggle('is-active', !!hoverable);
  };

  const tick = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener('mousemove', onMove);
  rafId = requestAnimationFrame(tick);
}

// D2 — Click ripple. One delegated listener on body appends a span at the
// click coordinates with a quick radial expand + fade, then removes it.
// Skipped on reduced motion.
function initClickRipple() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.addEventListener('click', (event) => {
    // Skip clicks inside form fields, the cursor itself, or with no real target.
    const target = event.target;
    if (!target) return;
    if (target.closest('input, textarea, select, #nidhi-cursor-dot, #nidhi-cursor-ring')) return;

    const ripple = document.createElement('span');
    ripple.className = 'nidhi-ripple';
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
}

// B1 + B2 — Atmosphere layer (3 floating gradient orbs) and section dividers
// (thin SVG curves between adjacent <section> siblings inside <main>). Both
// are injected purely by JS so no HTML files need editing. Scoped to
// marketing-tier pages: body.home-page or body.login-page (admin / user-
// dashboard / out-of-scope pages don't get them).
function initAtmosphereLayer() {
  const body = document.body;
  if (!body.classList.contains('home-page') && !body.classList.contains('login-page')) return;
  if (body.classList.contains('admin-page') || body.classList.contains('user-dashboard-page')) return;

  // ---- B1: orb layer ----
  if (!document.querySelector('.atmosphere-layer')) {
    const layer = document.createElement('div');
    layer.className = 'atmosphere-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML =
      '<span class="atmosphere-orb atmosphere-orb--navy"></span>' +
      '<span class="atmosphere-orb atmosphere-orb--green"></span>' +
      '<span class="atmosphere-orb atmosphere-orb--gold"></span>';
    body.insertBefore(layer, body.firstChild);
  }

  // ---- B2: section dividers ----
  // Inject thin SVG curves between adjacent <section> siblings. Skip the
  // tubes-intro section (it owns its own backdrop) and skip sections that
  // already have a top decoration.
  const main = document.querySelector('main');
  if (!main) return;
  if (document.body.classList.contains('services-page')) return;

  const sections = Array.from(main.children).filter((el) => el.tagName === 'SECTION');
  if (sections.length < 2) return;

  const SVG = '<svg class="section-divider__svg" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M0,30 Q360,60 720,30 T1440,30 L1440,0 L0,0 Z" fill="currentColor" />' +
    '</svg>';

  for (let i = 1; i < sections.length; i++) {
    const prev = sections[i - 1];
    const curr = sections[i];
    if (prev.id === 'tubes-intro') continue; // tubes intro flows into hero on its own
    if (curr.dataset.noDivider === 'true') continue;
    if (curr.previousElementSibling && curr.previousElementSibling.classList.contains('section-divider')) continue;

    const divider = document.createElement('div');
    divider.className = 'section-divider';
    divider.setAttribute('aria-hidden', 'true');
    divider.innerHTML = SVG;
    curr.parentNode.insertBefore(divider, curr);
  }
}

// A1 — Lenis smooth scroll. Loads the Lenis bundle from jsDelivr (one ~7KB
// gzip script), then initialises smooth wheel/touch scroll with a single RAF
// loop. Skipped on prefers-reduced-motion so native scrolling is preserved.
//
// Lenis does not preventDefault on the wheel — it amends scrollTop smoothly,
// so existing scroll listeners (GSAP hero parallax, scroll-progress bar) keep
// firing on each tick exactly as before. No other code paths change.
function initLenisSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.__nidhiLenisStarted) return;
  window.__nidhiLenisStarted = true;

  const startLenis = () => {
    if (typeof window.Lenis !== 'function') return;
    const lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  };

  // Already loaded? init directly.
  if (typeof window.Lenis === 'function') {
    startLenis();
    return;
  }

  // Otherwise dynamically inject the CDN bundle (UMD build exposes window.Lenis).
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
  script.async = true;
  script.onload = startLenis;
  script.onerror = () => { /* CDN unavailable: silently keep native scroll. */ };
  document.head.appendChild(script);
}

// A5 — Animated count-up for metric stack digits. Targets strong elements
// inside .hero-metric-stack / .assurance-metrics whose text contains a digit
// run >= 2 characters (so we skip tiny values like "1" where animation is
// imperceptible). Parses prefix + number + suffix, animates 0 → target on
// viewport entry, then renders the original text shape. No DOM/text edits
// upstream — we read existing innerText and restore the final string.
function initCountUp() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll('.hero-metric-stack strong, .assurance-metrics strong');
  const matcher = /^([^0-9]*?)(\d{2,})([^0-9]*)$/; // require >=2 digits to be worth animating

  const ease = (t) => 1 - Math.pow(1 - t, 3); // cubic-out

  const animate = (el, prefix, target, suffix) => {
    const duration = 1100;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const value = Math.round(target * ease(t));
      el.textContent = `${prefix}${value}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const match = el.textContent.trim().match(matcher);
      if (!match) {
        observer.unobserve(el);
        return;
      }
      const [, prefix, digits, suffix] = match;
      animate(el, prefix, parseInt(digits, 10), suffix);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  targets.forEach((el) => observer.observe(el));
}

// A6 — Scroll progress bar. Fixed 2px ivory→gold gradient at top of viewport.
// scaleX driven by scrollY / (scrollHeight - innerHeight). rAF-throttled.
function initScrollProgress() {
  let bar = document.getElementById('nidhi-scroll-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'nidhi-scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
  }

  let rafId = 0;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max <= 0 ? 0 : Math.min(100, (window.scrollY / max) * 100);
    bar.style.transform = `scaleX(${pct / 100})`;
    rafId = 0;
  };
  const onScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

function initHeroWatermarkAnimation() {
  const hero = document.querySelector('.home-hero');
  const stage = hero?.querySelector('.hero-watermark__stage');
  const letterN = hero?.querySelector('.hero-watermark__letter--n');
  const letterP = hero?.querySelector('.hero-watermark__letter--p');
  const revealText = hero?.querySelector('.hero-watermark__text');
  const lotusSvg = hero?.querySelector('.hero-watermark__lotus-svg');
  const particles = hero?.querySelectorAll('.hero-watermark__particle');

  if (!hero || !stage || !letterN || !letterP || !revealText || !lotusSvg) {
    return;
  }

  gsap.set(stage, {autoAlpha: 1});
  gsap.set([letterN, letterP, revealText, lotusSvg, particles], {autoAlpha: 0});
  gsap.set(letterN, {x: '-130%', filter: 'blur(20px)', scale: 1.02});
  gsap.set(letterP, {x: '130%', filter: 'blur(24px)', scale: 1.02});
  gsap.set(revealText, {y: 32, scale: 0.96});
  gsap.set(lotusSvg, {scale: 0.92});
  gsap.set(particles, {y: -20, scale: 0.7});

  const intro = gsap.timeline({defaults: {duration: 1.05, ease: 'power3.out'}});

  intro
    .to(letterN, {x: '0%', autoAlpha: 1, filter: 'blur(0px)'}, 0.12)
    .to(letterP, {x: '0%', autoAlpha: 1, filter: 'blur(0px)'}, 0.28)
    .to(lotusSvg, {autoAlpha: 1, scale: 1, duration: 1.2}, 0.18)
    .to(particles, {autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8}, 0.6)
    .to(revealText, {autoAlpha: 1, y: 0, scale: 1, duration: 1.1}, 1.14)
    .to(stage, {opacity: 0.14, duration: 1.6, delay: 0.6}, 0.9);

  gsap.to(letterN, {filter: 'blur(0px)', duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2});
  gsap.to(letterP, {filter: 'blur(0px)', duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.2});

  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const py = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
    gsap.to(stage, {x: px, y: py, duration: 0.8, ease: 'power3.out'});
  });

  hero.addEventListener('mouseleave', () => {
    gsap.to(stage, {x: 0, y: 0, duration: 1.6, ease: 'power3.out'});
  });
}

function initBrandLaunchAnimation() {
  const storageKey = 'nidhi-brand-launch-seen';
  let hasSeenLaunch = false;

  try {
    hasSeenLaunch = window.sessionStorage.getItem(storageKey) === 'true';
    if (!hasSeenLaunch) {
      window.sessionStorage.setItem(storageKey, 'true');
    }
  } catch (error) {
    // If session storage is unavailable, keep the page usable and show the launch once for this load.
  }

  if (hasSeenLaunch) {
    return;
  }

  if (!document.body.classList.contains('home-page') || document.body.classList.contains('content-page')) {
    return;
  }

  const launch = document.createElement('div');
  launch.className = 'brand-launch';
  launch.setAttribute('aria-hidden', 'true');
  launch.innerHTML = `
    <div class="brand-launch__mark">
      <span class="brand-launch__half brand-launch__half--left"></span>
      <span class="brand-launch__half brand-launch__half--right"></span>
      <span class="brand-launch__complete"></span>
    </div>
  `;

  document.body.appendChild(launch);
  window.setTimeout(() => launch.remove(), 1000);
}

function formatAdminDate(value) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getAdminPageId() {
  return document.body.dataset.adminPage || '';
}

function ensureAdminAuth() {
  if (!isAdminPage() || getAdminPageId() === 'login') {
    return true;
  }
  if (!getAdminToken()) {
    window.location.href = 'login.html#employee';
    return false;
  }
  return true;
}

function renderTableState(tbody, message, colspan = 7) {
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="${colspan}">${message}</td></tr>`;
  }
}

function getReferenceIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return cleanEnquiryValue(params.get('id') || params.get('referenceId') || params.get('chatId'));
}

async function loadAdminCollections() {
  const [enquiryResponse, chatResponse] = await Promise.all([
    adminApiRequest('/api/admin/enquiries'),
    adminApiRequest('/api/admin/chats')
  ]);
  return {
    enquiries: enquiryResponse.enquiries || [],
    chats: chatResponse.chats || []
  };
}

function enquiryRow(enquiry) {
  const referenceId = enquiry.referenceId || enquiry.reference || enquiry.id || '';
  return `
    <tr>
      <td>${escapeHtml(referenceId || '-')}</td>
      <td>${escapeHtml(enquiry.name || '-')}</td>
      <td>${escapeHtml(enquiry.phone || '-')}</td>
      <td>${escapeHtml(enquiry.service || '-')}</td>
      <td>${escapeHtml(enquiry.sourceForm || '-')}</td>
      <td><span class="status-pill">${escapeHtml(enquiry.status || 'new')}</span></td>
      <td>${formatAdminDate(enquiry.createdAt)}</td>
      <td><a class="table-action" href="admin-enquiry-detail.html?id=${encodeURIComponent(referenceId)}">View</a></td>
    </tr>
  `;
}

function chatRow(chat) {
  return `
    <tr>
      <td>${escapeHtml(chat.chatId || '-')}</td>
      <td>${escapeHtml(chat.service || '-')}</td>
      <td>${escapeHtml(chat.name || 'Customer')}</td>
      <td><span class="status-pill">${escapeHtml(chat.status || 'open')}</span></td>
      <td>${escapeHtml(chat.lastMessage || chat.initialMessage || '-')}</td>
      <td>${formatAdminDate(chat.createdAt)}</td>
      <td><a class="table-action" href="admin-chat-detail.html?chatId=${encodeURIComponent(chat.chatId || '')}">Open</a></td>
    </tr>
  `;
}

async function bindAdminDashboard() {
  const { enquiries, chats } = await loadAdminCollections();
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = String(value);
    }
  };
  setText('dashboard-total-enquiries', enquiries.length);
  setText('dashboard-new-enquiries', enquiries.filter((item) => (item.status || 'new') === 'new').length);
  setText('dashboard-open-chats', chats.filter((item) => (item.status || 'open') === 'open').length);
  setText('dashboard-closed-chats', chats.filter((item) => item.status === 'closed').length);

  const recentEnquiriesBody = document.getElementById('recent-enquiries-body');
  const recentChatsBody = document.getElementById('recent-chats-body');
  if (recentEnquiriesBody) {
    recentEnquiriesBody.innerHTML = enquiries.slice(-6).reverse().map(enquiryRow).join('') || '<tr><td colspan="8">No enquiries yet.</td></tr>';
  }
  if (recentChatsBody) {
    recentChatsBody.innerHTML = chats.slice(-6).reverse().map(chatRow).join('') || '<tr><td colspan="7">No chats yet.</td></tr>';
  }
}

async function bindAdminEnquiriesPage() {
  const tbody = document.getElementById('admin-enquiries-body');
  renderTableState(tbody, 'Loading enquiries...', 8);
  const response = await adminApiRequest('/api/admin/enquiries');
  const enquiries = response.enquiries || [];
  tbody.innerHTML = enquiries.slice().reverse().map(enquiryRow).join('') || '<tr><td colspan="8">No enquiries yet.</td></tr>';
}

async function bindAdminEnquiryDetailPage() {
  const referenceId = getReferenceIdFromUrl();
  const detail = document.getElementById('admin-enquiry-detail');
  const statusForm = document.getElementById('admin-enquiry-status-form');
  const statusSelect = document.getElementById('admin-enquiry-status');
  const statusMessage = document.getElementById('admin-enquiry-status-message');
  if (!referenceId || !detail) {
    return;
  }
  const response = await adminApiRequest(`/api/admin/enquiries/${encodeURIComponent(referenceId)}`);
  const enquiry = response.enquiry;
  if (!enquiry) {
    detail.innerHTML = '<p>Enquiry not found.</p>';
    return;
  }
  detail.innerHTML = `
    <div><span>Reference ID</span><strong>${escapeHtml(enquiry.referenceId || enquiry.reference || '-')}</strong></div>
    <div><span>Customer name</span><strong>${escapeHtml(enquiry.name || '-')}</strong></div>
    <div><span>Phone</span><strong>${escapeHtml(enquiry.phone || '-')}</strong></div>
    <div><span>Email</span><strong>${escapeHtml(enquiry.email || '-')}</strong></div>
    <div><span>Service</span><strong>${escapeHtml(enquiry.service || '-')}</strong></div>
    <div><span>Message</span><strong>${escapeHtml(enquiry.message || '-')}</strong></div>
    <div><span>Source page</span><strong>${escapeHtml(enquiry.sourcePage || '-')}</strong></div>
    <div><span>Source form</span><strong>${escapeHtml(enquiry.sourceForm || '-')}</strong></div>
    <div><span>Preferred language</span><strong>${escapeHtml(enquiry.preferredLanguage || '-')}</strong></div>
    <div><span>WhatsApp status</span><strong>${escapeHtml(enquiry.whatsappStatus || '-')}</strong></div>
    <div><span>Current status</span><strong>${escapeHtml(enquiry.status || 'new')}</strong></div>
    <div><span>Created time</span><strong>${formatAdminDate(enquiry.createdAt)}</strong></div>
  `;
  if (statusSelect) {
    statusSelect.value = enquiry.status || 'new';
  }
  statusForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatusElement(statusMessage, 'Updating...', 'is-info');
    try {
      await adminApiRequest(`/api/admin/enquiries/${encodeURIComponent(referenceId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: statusSelect?.value || 'new' })
      });
      setStatusElement(statusMessage, 'Status updated.', 'is-success');
    } catch (error) {
      setStatusElement(statusMessage, error.message || getTranslation(currentLang, 'something-went-wrong'), 'is-error');
    }
  });
}

async function bindAdminChatsPage() {
  const tbody = document.getElementById('admin-chats-body');
  renderTableState(tbody, 'Loading chats...', 7);
  const response = await adminApiRequest('/api/admin/chats');
  const chats = response.chats || [];
  tbody.innerHTML = chats.slice().reverse().map(chatRow).join('') || '<tr><td colspan="7">No chats yet.</td></tr>';
}

async function bindAdminChatDetailPage() {
  const chatId = getReferenceIdFromUrl();
  const messages = document.getElementById('admin-chat-messages');
  const meta = document.getElementById('admin-chat-meta');
  const replyForm = document.getElementById('admin-chat-reply-form');
  const replyInput = document.getElementById('admin-chat-reply');
  const closeButton = document.getElementById('admin-close-chat');
  const status = document.getElementById('admin-chat-status');
  if (!chatId || !messages) {
    return;
  }

  const renderMessages = async () => {
    const [chatResponse, messageResponse] = await Promise.all([
      adminApiRequest(`/api/admin/chats/${encodeURIComponent(chatId)}`),
      adminApiRequest(`/api/admin/chats/${encodeURIComponent(chatId)}/messages`)
    ]);
    const chat = chatResponse.chat || {};
    const messageList = messageResponse.messages || [];
    if (meta) {
      meta.innerHTML = `
        <div><span>Chat ID</span><strong>${escapeHtml(chat.chatId || chatId)}</strong></div>
        <div><span>Service</span><strong>${escapeHtml(chat.service || '-')}</strong></div>
        <div><span>Initial message</span><strong>${escapeHtml(chat.initialMessage || '-')}</strong></div>
        <div><span>Status</span><strong>${escapeHtml(chat.status || 'open')}</strong></div>
      `;
    }
    messages.innerHTML = messageList.map((entry) => `
      <p class="admin-chat-message is-${escapeHtml(entry.sender || 'system')}">
        <strong>${escapeHtml(entry.sender || 'system')}</strong>
        <span>${escapeHtml(entry.message || '')}</span>
        <small>${formatAdminDate(entry.createdAt)}</small>
      </p>
    `).join('') || '<p>No messages yet.</p>';
    messages.scrollTop = messages.scrollHeight;
  };

  await renderMessages();
  replyForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = cleanEnquiryValue(replyInput?.value);
    if (!message) {
      return;
    }
    setStatusElement(status, 'Sending...', 'is-info');
    try {
      await adminApiRequest(`/api/admin/chats/${encodeURIComponent(chatId)}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      if (replyInput) {
        replyInput.value = '';
      }
      setStatusElement(status, 'Reply sent.', 'is-success');
      await renderMessages();
    } catch (error) {
      setStatusElement(status, error.message || getTranslation(currentLang, 'something-went-wrong'), 'is-error');
    }
  });

  closeButton?.addEventListener('click', async () => {
    setStatusElement(status, 'Closing chat...', 'is-info');
    try {
      await adminApiRequest(`/api/admin/chats/${encodeURIComponent(chatId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'closed' })
      });
      setStatusElement(status, 'Chat closed.', 'is-success');
      await renderMessages();
    } catch (error) {
      setStatusElement(status, error.message || getTranslation(currentLang, 'something-went-wrong'), 'is-error');
    }
  });
}

function bindAdminPages() {
  if (window.NIDHI_ADMIN_APP_HANDLES_PAGES) {
    return;
  }

  if (!isAdminPage()) {
    return;
  }

  document.querySelectorAll('[data-admin-logout]').forEach((button) => {
    button.addEventListener('click', () => {
      window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      window.sessionStorage.removeItem(ADMIN_PROFILE_KEY);
      window.sessionStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
      window.sessionStorage.removeItem(LEGACY_ADMIN_PROFILE_KEY);
      window.location.href = 'login.html#employee';
    });
  });

  if (!ensureAdminAuth()) {
    return;
  }

  const pageId = getAdminPageId();
  const loader = {
    dashboard: bindAdminDashboard,
    enquiries: bindAdminEnquiriesPage,
    enquiryDetail: bindAdminEnquiryDetailPage,
    chats: bindAdminChatsPage,
    chatDetail: bindAdminChatDetailPage
  }[pageId];

  loader?.().catch((error) => {
    const status = document.getElementById('admin-page-status');
    setStatusElement(status, error.message || getTranslation(currentLang, 'something-went-wrong'), 'is-error');
  });
}

function bindLoginModeSwitch() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) {
    return;
  }

  const modeInput = document.getElementById('login-mode');
  const modeButtons = Array.from(document.querySelectorAll('[data-login-mode-option]'));
  const roleInput = document.getElementById('login-role');
  const roleButtons = Array.from(document.querySelectorAll('[data-login-role-option]'));
  const roleNavButtons = Array.from(document.querySelectorAll('[data-login-role-nav]'));
  const actionInput = document.getElementById('user-auth-action');
  const actionSwitch = document.getElementById('user-auth-switch');
  const actionButtons = Array.from(document.querySelectorAll('#user-auth-switch [data-user-auth-action]'));
  const signupOnlyFields = Array.from(document.querySelectorAll('[data-signup-only]'));
  const userOnlyBlocks = Array.from(document.querySelectorAll('[data-user-only]'));
  const signupRequiredInputs = [
    document.getElementById('signup-name'),
    document.getElementById('signup-phone'),
    document.getElementById('signup-confirm-password')
  ].filter(Boolean);
  const title = document.getElementById('login-form-title');
  const copy = document.getElementById('login-form-copy');
  const note = document.getElementById('login-note');
  const emailInput = document.getElementById('login-email') || document.getElementById('login-identity');
  const passwordInput = document.getElementById('login-password');
  const submitButton = loginForm.querySelector('button[type="submit"]');
  const rememberRow = loginForm.querySelector('.login-form-row');
  const footerText = document.getElementById('user-auth-footer-text');
  const footerAction = document.getElementById('user-auth-footer-action');

  const modeContent = {
    user: {
      title: 'User Login',
      copy: 'For clients with a registered Nidhi Path account.',
      note: 'For account access help, contact our support team.',
      placeholder: 'you@example.com'
    },
    student: {
      title: 'Student Login',
      copy: 'Track your education loan application and official Nidhi Path updates.',
      note: 'Use the email and temporary password shared by Nidhi Path, or create a student account if advised by the team.',
      placeholder: 'student.email@domain.com'
    },
    employee: {
      title: 'Employee Login',
      copy: 'For Admin, Board Members and Employees.',
      note: 'Employee access is created from the admin dashboard. Use your assigned temporary password.',
      placeholder: 'team.email@domain.com'
    },
    client: {
      title: 'Client Login',
      copy: 'For connectors, consultants and reference partners tracking referred applications.',
      note: 'Client/reference partner access is created by Nidhi Path admin.',
      placeholder: 'partner@example.com'
    },
    signup: {
      title: 'Create User Account',
      copy: 'Sign up with your genuine email address. Verify the email before signing in.',
      note: 'After signup, check your email and complete verification before login.',
      placeholder: 'you@example.com'
    },
    admin: {
      title: 'Admin Login',
      copy: 'For authorized Nidhi Path team members only.',
      note: 'Admin access is restricted to authorized team members.',
      placeholder: 'admin@example.com'
    }
  };

  const setAction = (action) => {
    const loginMode = modeInput?.value === 'admin' ? 'admin' : 'user';
    const selectedRole = roleInput?.value || 'student';
    const signupAllowed = loginMode === 'user' && selectedRole === 'student';
    const nextAction = signupAllowed && action === 'signup' ? 'signup' : 'login';
    if (actionInput) {
      actionInput.value = nextAction;
    }
    if (actionSwitch) {
      actionSwitch.hidden = !signupAllowed;
    }
    userOnlyBlocks.forEach((block) => {
      block.hidden = loginMode !== 'user';
    });
    actionButtons.forEach((button) => {
      const isActive = button.dataset.userAuthAction === nextAction;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
    signupOnlyFields.forEach((field) => {
      field.hidden = nextAction !== 'signup';
    });
    signupRequiredInputs.forEach((input) => {
      if (nextAction === 'signup') {
        input.setAttribute('required', '');
      } else {
        input.removeAttribute('required');
      }
    });
    if (rememberRow) {
      rememberRow.hidden = nextAction === 'signup';
    }
    if (passwordInput) {
      passwordInput.autocomplete = nextAction === 'signup' ? 'new-password' : 'current-password';
    }
    if (submitButton) {
      const submitKey = nextAction === 'signup' ? 'create-account' : 'sign-in';
      submitButton.setAttribute('data-i18n-btn', submitKey);
      submitButton.textContent = getTranslation(currentLang, submitKey);
    }
    if (footerText) {
      footerText.textContent = getTranslation(currentLang, nextAction === 'signup' ? 'already-registered-prompt' : 'new-customer-prompt');
    }
    if (footerAction) {
      const footerKey = nextAction === 'signup' ? 'sign-in' : 'create-account';
      footerAction.dataset.nextUserAction = nextAction === 'signup' ? 'login' : 'signup';
      footerAction.textContent = getTranslation(currentLang, footerKey);
    }
  };

  const setMode = (mode, options = {}) => {
    const nextMode = mode === 'admin' ? 'admin' : 'user';
    const selectedRole = roleInput?.value || 'student';
    const signupAllowed = nextMode === 'user' && selectedRole === 'student';
    const nextAction = signupAllowed && actionInput?.value === 'signup' ? 'signup' : 'login';
    const contentKey = nextAction === 'signup' ? 'signup' : (nextMode === 'user' ? selectedRole : nextMode);
    if (modeInput) {
      modeInput.value = nextMode;
    }
    modeButtons.forEach((button) => {
      const isActive = button.dataset.loginModeOption === nextMode;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
    [...roleButtons, ...roleNavButtons].forEach((button) => {
      const buttonRole = button.dataset.loginRoleOption || button.dataset.loginRoleNav;
      const isActive = buttonRole === selectedRole;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
      if (button.tagName === 'A') {
        button.setAttribute('aria-current', isActive ? 'page' : 'false');
      }
    });
    if (title) {
      title.textContent = getPhraseTranslation(currentLang, modeContent[contentKey].title);
    }
    if (copy) {
      copy.textContent = getPhraseTranslation(currentLang, modeContent[contentKey].copy);
    }
    if (note) {
      note.textContent = getPhraseTranslation(currentLang, modeContent[contentKey].note);
    }
    if (emailInput) {
      emailInput.placeholder = modeContent[contentKey].placeholder;
    }
    setAction(nextAction);
    if (!options.preserveStatus) {
      setStatusElement(document.getElementById('login-status'), '', '');
    }
  };

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.loginModeOption));
  });

  function selectLoginRole(role) {
    if (roleInput) {
      roleInput.value = role || 'student';
    }
    if (actionInput && roleInput?.value !== 'student') {
      actionInput.value = 'login';
    }
    setMode('user');
  }

  roleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectLoginRole(button.dataset.loginRoleOption || 'student');
    });
  });

  roleNavButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      selectLoginRole(button.dataset.loginRoleNav || 'student');
      if (button.hash) {
        window.history.replaceState(null, '', button.hash);
      }
    });
  });

  actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (actionInput) {
        actionInput.value = button.dataset.userAuthAction === 'signup' ? 'signup' : 'login';
      }
      setMode(modeInput?.value || document.body.dataset.loginDefault || 'user');
    });
  });

  footerAction?.addEventListener('click', () => {
    if (actionInput) {
      actionInput.value = footerAction.dataset.nextUserAction === 'signup' ? 'signup' : 'login';
    }
    setMode('user');
  });

  window.NIDHI_updateLoginModeText = () => {
    setMode(modeInput?.value || document.body.dataset.loginDefault || 'user', { preserveStatus: true });
  };

  const hashRole = window.location.hash.replace('#', '').toLowerCase();
  if (['student', 'client', 'employee'].includes(hashRole) && roleInput) {
    roleInput.value = hashRole;
  }
  setMode(document.body.dataset.loginDefault || modeInput?.value || 'user');
}

window.addEventListener('DOMContentLoaded', () => {
  console.log("Mobile responsive header fix loaded");

  currentLang = getSavedLanguage() ?? currentLang;
  document.documentElement.removeAttribute('data-time-theme');
  initBrandLaunchAnimation();
  createHeaderCalculatorButton();
  injectFloatingWidgets();
  enhanceFooter();
  loadPublicSiteSettings();
  injectPageVisualSystem();
  injectServiceDetailContent();
  repairServiceCards();
  enhanceEligibilityCtas();
  bindDestinationFilters();
  bindHeroStoryRotator();
  bindHeroProofNavigation();
  initPremiumScrollReveals();
  initializePremiumTiltEffects();
  initMagneticButtons();
  initScrollProgress();
  initCountUp();
  initAtmosphereLayer();
  initGlobe3D();
  initCoin3DBadge();
  installConfettiEmitter();
  initCustomCursor();
  initClickRipple();
  initLenisSmoothScroll();
  initHeroWatermarkAnimation();
  prepareContextualLinks();
  updateAuthenticatedNavigation();
  bindPublicLoginNavigation();

  // Language select
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }

  // Navigation toggle for mobile
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    const header = hamburger.closest('header');
    const nav = header?.querySelector('nav');
    hamburger.setAttribute('aria-expanded', 'false');

    hamburger.addEventListener('click', () => {
      const isOpen = header?.classList.toggle('nav-open');
      document.body.classList.toggle('mobile-nav-open', Boolean(isOpen));
      hamburger.setAttribute('aria-expanded', String(Boolean(isOpen)));
    });

    nav?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        header?.classList.remove('nav-open');
        document.body.classList.remove('mobile-nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // EMI Calculator submit
  const emiForm = document.getElementById('emi-form');
  if (emiForm) {
    emiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const P = parseFloat(document.getElementById('principal').value);
      const R = parseFloat(document.getElementById('rate').value);
      const N = parseFloat(document.getElementById('tenure').value);
      if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R <= 0 || N <= 0) {
        alert(getPhraseTranslation(currentLang, 'Please enter valid positive numbers for all fields.'));
        return;
      }
      const monthlyRate = R / 12 / 100;
      const nMonths = N;
      const emi = (P * monthlyRate * Math.pow(1 + monthlyRate, nMonths)) / (Math.pow(1 + monthlyRate, nMonths) - 1);
      const totalPayment = emi * nMonths;
      const totalInterest = totalPayment - P;
      const emiResult = document.getElementById('emi-result');
      emiResult.dataset.hasResult = 'true';
      emiResult.dataset.result = JSON.stringify({ emi: emi, total: totalPayment, interest: totalInterest });
      updateEMIResultLabels();
    });
  }

  // Apply buttons
  document.querySelectorAll('.apply-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const service = button.dataset.service;
      const applyService = document.getElementById('apply-service');
      const applyHeading = document.getElementById('apply-heading');
      const applyModal = document.getElementById('apply-modal');
      if (!applyService || !applyHeading || !applyModal) {
        return;
      }

      applyService.value = service;
      applyHeading.textContent = getPhraseTranslation(currentLang, service);
      applyModal.classList.add('show');
    });
  });

  // Close modal
  const modalClose = document.getElementById('modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      document.getElementById('apply-modal')?.classList.remove('show');
    });
  }

  // Apply form submit
  const applyForm = document.getElementById('apply-form');
  if (applyForm) {
    applyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = getOrCreateFormStatus(applyForm, 'apply-form-status');
      const serviceType = document.getElementById('apply-service')?.value || 'Education Loan';
      const payload = buildEnquiryPayload({
        name: document.getElementById('apply-name')?.value,
        email: document.getElementById('apply-email')?.value,
        phone: document.getElementById('apply-phone')?.value,
        service: serviceType,
        loanAmount: document.getElementById('apply-amount')?.value,
        tenure: document.getElementById('apply-tenure')?.value,
        message: document.getElementById('apply-message')?.value,
        companyWebsite: document.getElementById('apply-website')?.value
      }, 'apply_now');
      const validation = validateEnquiryPayload(payload, { requireEmail: true });
      if (!validation.valid) {
        setStatusElement(status, validation.message, 'is-error');
        return;
      }
      setFormSubmitting(applyForm, true);
      setStatusElement(status, '', '');
      try {
        const submission = await submitEnquiry(payload);
        setStatusElement(status, getSuccessfulEnquiryMessage(submission.referenceId), 'is-success');
        e.target.reset();
      } catch (error) {
        setStatusElement(status, error.message || getTranslation(currentLang, 'something-went-wrong'), 'is-error');
      } finally {
        setFormSubmitting(applyForm, false);
      }
    });
  }

  // Contact form submit
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isFormSubmitting(contactForm)) {
        return;
      }
      const status = getOrCreateFormStatus(contactForm, 'contact-form-status');
      const payload = buildEnquiryPayload({
        name: document.getElementById('contact-name')?.value,
        phone: document.getElementById('contact-phone')?.value,
        email: document.getElementById('contact-email')?.value,
        city: document.getElementById('contact-city')?.value,
        service: document.getElementById('contact-service')?.value,
        loanAmount: document.getElementById('contact-amount')?.value,
        message: document.getElementById('contact-message')?.value,
        companyWebsite: document.getElementById('contact-website')?.value
      }, getSourceFormFromUrl('contact_page'));
      const validation = validateEnquiryPayload(payload);
      if (!validation.valid) {
        setStatusElement(status, validation.message, 'is-error');
        return;
      }
      setFormSubmitting(contactForm, true);
      setStatusElement(status, '', '');
      try {
        const submission = await submitEnquiry(payload);
        setStatusElement(status, getSuccessfulEnquiryMessage(submission.referenceId), 'is-success');
        e.target.reset();
      } catch (error) {
        console.error('Contact enquiry submit failed', error);
        setStatusElement(status, error.message || getTranslation(currentLang, 'something-went-wrong'), 'is-error');
      } finally {
        setFormSubmitting(contactForm, false);
      }
    });
  }

  // Login form submit
  const loginForm = document.getElementById('login-form');
  const passwordToggle = document.getElementById('password-toggle');
  const loginPassword = document.getElementById('login-password');
  if (passwordToggle && loginPassword) {
    passwordToggle.addEventListener('click', () => {
      loginPassword.type = loginPassword.type === 'password' ? 'text' : 'password';
      updatePasswordToggleText();
    });
  }

  if (loginForm) {
    bindLoginModeSwitch();
    if (getAdminToken() && document.body.dataset.loginDefault === 'admin') {
      window.location.href = 'admin-dashboard.html';
      return;
    }

    const trackedEmailInput = document.getElementById('login-email') || document.getElementById('login-identity');
    const trackedPasswordInput = document.getElementById('login-password');
    const typedLoginValues = {
      identity: trackedEmailInput?.value.trim() || '',
      password: trackedPasswordInput?.value || ''
    };
    trackedEmailInput?.addEventListener('input', () => {
      typedLoginValues.identity = trackedEmailInput.value.trim();
    });
    trackedPasswordInput?.addEventListener('input', () => {
      typedLoginValues.password = trackedPasswordInput.value;
    });
    trackedEmailInput?.addEventListener('change', () => {
      typedLoginValues.identity = trackedEmailInput.value.trim();
    });
    trackedPasswordInput?.addEventListener('change', () => {
      typedLoginValues.password = trackedPasswordInput.value;
    });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('login-email') || document.getElementById('login-identity');
      const passwordInput = document.getElementById('login-password');
      const identity = typedLoginValues.identity || emailInput?.value.trim() || '';
      const password = typedLoginValues.password || passwordInput?.value || '';
      const submittedIdentity = identity;
      const submittedPassword = password;
      if (emailInput && emailInput.value.trim() !== submittedIdentity) {
        emailInput.value = submittedIdentity;
      }
      if (passwordInput && passwordInput.value !== submittedPassword) {
        passwordInput.value = submittedPassword;
      }
      const loginMode = document.getElementById('login-mode')?.value === 'admin' ? 'admin' : 'user';
      const selectedLoginRole = document.getElementById('login-role')?.value || 'student';
      const authAction = document.getElementById('user-auth-action')?.value === 'signup' ? 'signup' : 'login';
      const isSignup = loginMode === 'user' && authAction === 'signup';

      if (!isValidOptionalEmail(identity) || !identity || !password || (isSignup && password.length < 8)) {
        setLoginStatus('login-error', 'is-error');
        return;
      }

      if (isSignup) {
        const name = cleanEnquiryValue(document.getElementById('signup-name')?.value);
        const rawPhone = cleanEnquiryValue(document.getElementById('signup-phone')?.value);
        const phone = normalizeIndianPhone(rawPhone);
        const confirmPassword = document.getElementById('signup-confirm-password')?.value.trim() || '';
        if (!name || !rawPhone) {
          setStatusElement(document.getElementById('login-status'), getTranslation(currentLang, 'required-fields-error'), 'is-error');
          return;
        }
        if (!phone) {
          setStatusElement(document.getElementById('login-status'), getTranslation(currentLang, 'valid-mobile-error'), 'is-error');
          return;
        }
        if (password !== confirmPassword) {
          setLoginStatus('password-mismatch', 'is-error');
          return;
        }
      }

      setFormSubmitting(loginForm, true);
      setStatusElement(document.getElementById('login-status'), getTranslation(currentLang, 'submitting'), 'is-info');
      try {
        if (isSignup) {
          await signupUser({
            name: cleanEnquiryValue(document.getElementById('signup-name')?.value),
            phone: normalizeIndianPhone(document.getElementById('signup-phone')?.value),
            email: identity,
            password,
            preferredLanguage: currentLang,
            sourcePage: getCurrentSourcePage(),
            createdFrom: 'website'
          });
          const actionInput = document.getElementById('user-auth-action');
          if (actionInput) {
            actionInput.value = 'login';
          }
          window.NIDHI_updateLoginModeText?.();
          setLoginStatus('signup-success', 'is-success');
          return;
        }

        const result = loginMode === 'admin'
          ? await loginAdmin(identity, password)
          : await loginUser(identity, password, selectedLoginRole);
        setLoginStatus('login-success', 'is-success');
        window.location.href = redirectForLoginResult(result, loginMode, selectedLoginRole);
      } catch (error) {
        console.error('Login request failed', {
          mode: loginMode,
          status: error.status || '',
          code: error.code || '',
          message: error.message || ''
        });
        if (emailInput && submittedIdentity && emailInput.value !== submittedIdentity) {
          emailInput.value = submittedIdentity;
        }
        if (passwordInput && submittedPassword && passwordInput.value !== submittedPassword) {
          passwordInput.value = submittedPassword;
        }
        const publicLoginError = error.code === 'EMAIL_NOT_VERIFIED'
          ? getTranslation(currentLang, 'email-verification-required')
          : error.message || getTranslation(currentLang, 'something-went-wrong');
        setStatusElement(document.getElementById('login-status'), publicLoginError, 'is-error');
      } finally {
        setFormSubmitting(loginForm, false);
        window.setTimeout(() => {
          if (emailInput && submittedIdentity && emailInput.value !== submittedIdentity) {
            emailInput.value = submittedIdentity;
          }
          if (passwordInput && submittedPassword && passwordInput.value !== submittedPassword) {
            passwordInput.value = submittedPassword;
          }
        }, 0);
      }
    });
  }

  // Initialize language
  setLanguage(currentLang);
  prefillServiceFields(getServiceFromUrl());
  bindFloatingWidgets();
  bindAdvancedEMIPlanner();
  bindAdminPages();
});
