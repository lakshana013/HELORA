export const EMERGENCY_SIGNS = [
  {
    id: 'chest_pain_breathing',
    keywords: {
      en: ['chest pain', 'heart attack', 'heart pain', 'chest tightness'],
      hi: ['सीने में दर्द', 'छाती में दर्द', 'दिल का दौरा', 'सीना दबाव'],
      ta: ['நெஞ்சு வலி', 'மாரடைப்பு', 'நெஞ்சு இறுக்கம்'],
    },
    action: { en: 'Call emergency services (112) immediately. Do not move. Chew an aspirin if available.', hi: 'तुरंत आपातकालीन सेवा (112) को कॉल करें। हिलें नहीं। अगर उपलब्ध हो तो एस्पिरिन चबाएं।', ta: 'உடனடியாக அவசர சேவையை (112) அழைக்கவும். அசையாதீர்கள்.' },
  },
  {
    id: 'breathing_difficulty',
    keywords: {
      en: ['cant breathe', "can't breathe", 'breathing difficulty', 'suffocating', 'choking', 'gasping'],
      hi: ['सांस नहीं आ रही', 'सांस लेने में तकलीफ', 'दम घुट', 'सांस फूल'],
      ta: ['மூச்சு விடமுடியவில்லை', 'மூச்சுத்திணறல்', 'மூச்சு திணறல்'],
    },
    action: { en: 'Sit upright. Loosen tight clothing. Call 112 immediately.', hi: 'सीधे बैठें। तंग कपड़े ढीले करें। तुरंत 112 पर कॉल करें।', ta: 'நேராக உட்காருங்கள். இறுக்கமான ஆடைகளை தளர்த்துங்கள். 112 அழைக்கவும்.' },
  },
  {
    id: 'severe_bleeding',
    keywords: {
      en: ['severe bleeding', 'heavy bleeding', 'blood wont stop', 'bleeding badly', 'lots of blood'],
      hi: ['बहुत खून', 'खून बंद नहीं हो रहा', 'भारी रक्तस्राव'],
      ta: ['அதிக இரத்தப்போக்கு', 'ரத்தம் நிற்கவில்லை', 'பலத்த ரத்தப்போக்கு'],
    },
    action: { en: 'Apply firm pressure with a clean cloth. Elevate the wound above heart level. Call 112.', hi: 'साफ कपड़े से दबाव डालें। घाव को दिल से ऊपर उठाएं। 112 कॉल करें।', ta: 'சுத்தமான துணியால் அழுத்தம் கொடுங்கள். காயத்தை இதயத்திற்கு மேல் உயர்த்துங்கள். 112 அழைக்கவும்.' },
  },
  {
    id: 'unconscious',
    keywords: {
      en: ['unconscious', 'fainted', 'not waking', 'passed out', 'collapsed', 'unresponsive'],
      hi: ['बेहोश', 'होश नहीं', 'गिर गया', 'नहीं उठ रहा'],
      ta: ['மயக்கம்', 'சுயநினைவு இல்லை', 'மயங்கி விழுந்தார்', 'எழவில்லை'],
    },
    action: { en: 'Check breathing. Place on their side (recovery position). Call 112 immediately.', hi: 'सांस जांचें। करवट लिटाएं। तुरंत 112 कॉल करें।', ta: 'சுவாசத்தை சோதிக்கவும். பக்கவாட்டில் படுக்கவையுங்கள். 112 அழைக்கவும்.' },
  },
  {
    id: 'seizure',
    keywords: {
      en: ['seizure', 'fits', 'convulsion', 'shaking uncontrollably', 'epilepsy attack'],
      hi: ['दौरा', 'मिर्गी', 'ऐंठन', 'कांप रहा'],
      ta: ['வலிப்பு', 'பிடிப்பு', 'கட்டுப்பாடின்றி நடுக்கம்'],
    },
    action: { en: 'Clear the area of hard objects. Do NOT put anything in the mouth. Time the seizure. Call 112 if it lasts more than 5 minutes.', hi: 'आसपास से कठोर चीज़ें हटाएं। मुंह में कुछ न डालें। 5 मिनट से ज्यादा हो तो 112 कॉल करें।', ta: 'கடினமான பொருட்களை அகற்றுங்கள். வாயில் எதையும் போடாதீர்கள். 5 நிமிடத்திற்கு மேல் நீடித்தால் 112 அழைக்கவும்.' },
  },
  {
    id: 'snake_bite',
    keywords: {
      en: ['snake bite', 'snake', 'bitten by snake', 'serpent'],
      hi: ['सांप ने काटा', 'सांप का काटना', 'नाग ने काटा'],
      ta: ['பாம்பு கடி', 'பாம்பு கடித்தது'],
    },
    action: { en: 'Keep still and calm. Do NOT suck the wound or apply a tourniquet. Remove jewelry near the bite. Get to a hospital immediately.', hi: 'शांत और स्थिर रहें। घाव न चूसें। काटने की जगह से गहने हटाएं। तुरंत अस्पताल जाएं।', ta: 'அமைதியாக இருங்கள். காயத்தை உறிஞ்சாதீர்கள். அருகில் உள்ள நகைகளை அகற்றுங்கள். உடனடியாக மருத்துவமனைக்கு செல்லுங்கள்.' },
  },
  {
    id: 'poisoning',
    keywords: {
      en: ['poison', 'poisoning', 'drank poison', 'ate poison', 'swallowed chemical', 'overdose'],
      hi: ['जहर', 'ज़हर खा लिया', 'विषाक्तता', 'रसायन पी लिया'],
      ta: ['விஷம்', 'நஞ்சு', 'விஷம் குடித்தது', 'ரசாயனம் விழுங்கியது'],
    },
    action: { en: 'Call 112 or poison control. Do NOT induce vomiting unless directed. Save the container/substance for doctors.', hi: '112 कॉल करें। उल्टी न कराएं जब तक डॉक्टर न कहे। दवाई/पदार्थ संभाल कर रखें।', ta: '112 அழைக்கவும். வாந்தி எடுக்க முயற்சிக்காதீர்கள். பொருளை மருத்துவருக்காக வைத்திருங்கள்.' },
  },
  {
    id: 'stroke',
    keywords: {
      en: ['stroke', 'face drooping', 'cant speak', 'arm weak', 'paralysis', 'one side numb'],
      hi: ['लकवा', 'मुंह टेढ़ा', 'बोल नहीं पा रहा', 'एक तरफ सुन्न'],
      ta: ['பக்கவாதம்', 'முகம் கோணுதல்', 'பேச இயலவில்லை', 'ஒரு பக்கம் மரத்துப்போதல்'],
    },
    action: { en: 'Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 112. Note the time symptoms started.', hi: 'FAST याद रखें: चेहरा टेढ़ा, बाज़ू कमज़ोर, बोलने में दिक्कत, समय पर 112 कॉल करें।', ta: 'FAST நினைவில் வையுங்கள்: முகம் கோணல், கை பலவீனம், பேச்சு கஷ்டம், 112 அழைக்க நேரம்.' },
  },
  {
    id: 'severe_burn',
    keywords: {
      en: ['severe burn', 'burned badly', 'scalded', 'fire burn', 'chemical burn', 'large burn'],
      hi: ['बुरी तरह जल गया', 'जलना', 'आग से जला', 'रासायनिक जला'],
      ta: ['தீக்காயம்', 'கடுமையாக எரிந்தது', 'ரசாயன தீக்காயம்'],
    },
    action: { en: 'Cool the burn under running water for 20 minutes. Do NOT apply ice, butter, or toothpaste. Cover loosely. Call 112 for large burns.', hi: '20 मिनट बहते पानी में ठंडा करें। बर्फ, मक्खन या टूथपेस्ट न लगाएं। ढीले से ढकें। बड़े जलने पर 112 कॉल करें।', ta: '20 நிமிடம் ஓடும் நீரில் குளிர்விக்கவும். பனிக்கட்டி, வெண்ணெய் போடாதீர்கள். தளர்வாக மூடுங்கள்.' },
  },
  {
    id: 'pregnancy_emergency',
    keywords: {
      en: ['pregnant bleeding', 'labour', 'water broke', 'baby not moving', 'pregnancy pain', 'miscarriage'],
      hi: ['गर्भावस्था में खून', 'प्रसव पीड़ा', 'पानी की थैली फटी', 'बच्चा हिल नहीं रहा', 'गर्भपात'],
      ta: ['கர்ப்பம் ரத்தப்போக்கு', 'பிரசவ வலி', 'தண்ணீர் உடைந்தது', 'குழந்தை அசையவில்லை'],
    },
    action: { en: 'Go to the nearest hospital immediately. Lie on your left side. Do not eat or drink. Call 112 for transport.', hi: 'तुरंत नज़दीकी अस्पताल जाएं। बाईं करवट लेटें। कुछ खाएं-पिएं नहीं। 112 कॉल करें।', ta: 'உடனடியாக அருகில் உள்ள மருத்துவமனைக்கு செல்லுங்கள். இடது பக்கமாக படுங்கள்.' },
  },
  {
    id: 'severe_allergy',
    keywords: {
      en: ['allergic reaction', 'anaphylaxis', 'throat swelling', 'face swelling', 'cant swallow', 'hives all over'],
      hi: ['एलर्जी', 'गला सूज', 'चेहरा सूज', 'निगल नहीं पा रहा', 'पूरे शरीर पर दाने'],
      ta: ['ஒவ்வாமை', 'தொண்டை வீக்கம்', 'முகம் வீக்கம்', 'விழுங்க முடியவில்லை'],
    },
    action: { en: 'Call 112 immediately. Use epinephrine auto-injector if available. Lie flat with legs raised (unless breathing is difficult).', hi: 'तुरंत 112 कॉल करें। अगर एपिनेफ्रिन ऑटो-इंजेक्टर हो तो उपयोग करें। पैर ऊपर करके लेटें।', ta: '112 அழைக்கவும். எபிநெஃப்ரின் இருந்தால் பயன்படுத்துங்கள். கால்களை உயர்த்தி படுங்கள்.' },
  },
  {
    id: 'head_injury',
    keywords: {
      en: ['head injury', 'head hit', 'fell on head', 'head bleeding', 'concussion'],
      hi: ['सिर पर चोट', 'सिर में चोट', 'सिर से खून'],
      ta: ['தலையில் அடிபட்டது', 'தலை காயம்', 'தலையில் ரத்தம்'],
    },
    action: { en: 'Keep the person still. Watch for vomiting, confusion, or drowsiness. If unconscious, call 112 immediately.', hi: 'व्यक्ति को स्थिर रखें। उल्टी, भ्रम या नींद पर ध्यान दें। बेहोश होने पर तुरंत 112 कॉल करें।', ta: 'நபரை அசையாமல் வையுங்கள். வாந்தி, குழப்பம் கவனியுங்கள். மயக்கமானால் 112 அழைக்கவும்.' },
  },
  {
    id: 'suicidal',
    keywords: {
      en: ['suicide', 'kill myself', 'want to die', 'self harm', 'end my life'],
      hi: ['आत्महत्या', 'मरना चाहता', 'खुद को नुकसान', 'जीवन खत्म'],
      ta: ['தற்கொலை', 'சாக விரும்புகிறேன்', 'உயிரை மாய்த்துக்கொள்ள'],
    },
    action: { en: 'You are not alone. Call the helpline: iCall 9152987821 or Vandrevala Foundation 1860-2662-345. Talk to someone you trust.', hi: 'आप अकेले नहीं हैं। हेल्पलाइन: iCall 9152987821 या वंद्रेवाला फाउंडेशन 1860-2662-345 कॉल करें।', ta: 'நீங்கள் தனியாக இல்லை. உதவி எண்: iCall 9152987821 அல்லது வந்திரேவாலா 1860-2662-345 அழைக்கவும்.' },
  },
];

export const SYMPTOM_CATEGORIES = [
  {
    id: 'fever',
    name: { en: 'Fever', hi: 'बुखार', ta: 'காய்ச்சல்' },
    keywords: {
      en: ['fever', 'temperature', 'hot body', 'chills', 'shivering', 'feeling hot'],
      hi: ['बुखार', 'तापमान', 'गर्म', 'कंपकंपी', 'ठंड लगना', 'बदन गर्म'],
      ta: ['காய்ச்சல்', 'வெப்பம்', 'உடல் சூடு', 'நடுக்கம்', 'குளிர்'],
    },
    followUps: [
      {
        question: { en: 'How long have you had the fever?', hi: 'बुखार कब से है?', ta: 'காய்ச்சல் எவ்வளவு நாளாக உள்ளது?' },
        options: [
          { text: { en: 'Since today', hi: 'आज से', ta: 'இன்றிலிருந்து' }, score: 1 },
          { text: { en: '1-3 days', hi: '1-3 दिन', ta: '1-3 நாட்கள்' }, score: 2 },
          { text: { en: 'More than 3 days', hi: '3 दिन से ज्यादा', ta: '3 நாட்களுக்கு மேல்' }, score: 3 },
          { text: { en: 'More than a week', hi: 'एक हफ्ते से ज्यादा', ta: 'ஒரு வாரத்திற்கு மேல்' }, score: 4 },
        ],
      },
      {
        question: { en: 'Do you have any of these with the fever?', hi: 'बुखार के साथ इनमें से कुछ है?', ta: 'காய்ச்சலுடன் இவற்றில் ஏதேனும் உள்ளதா?' },
        options: [
          { text: { en: 'Body ache only', hi: 'सिर्फ बदन दर्द', ta: 'உடல் வலி மட்டும்' }, score: 1 },
          { text: { en: 'Headache and body ache', hi: 'सिरदर्द और बदन दर्द', ta: 'தலைவலி மற்றும் உடல் வலி' }, score: 2 },
          { text: { en: 'Rash or skin spots', hi: 'दाने या चकत्ते', ta: 'தோல் தடிப்பு அல்லது புள்ளிகள்' }, score: 3 },
          { text: { en: 'Vomiting or diarrhea', hi: 'उल्टी या दस्त', ta: 'வாந்தி அல்லது வயிற்றுப்போக்கு' }, score: 3 },
        ],
      },
      {
        question: { en: 'Can you eat and drink normally?', hi: 'क्या आप सामान्य रूप से खा-पी पा रहे हैं?', ta: 'சாதாரணமாக சாப்பிடவும் குடிக்கவும் முடிகிறதா?' },
        options: [
          { text: { en: 'Yes, eating and drinking fine', hi: 'हां, सब ठीक है', ta: 'ஆம், நன்றாக சாப்பிடுகிறேன்' }, score: 0 },
          { text: { en: 'Less appetite but drinking water', hi: 'भूख कम है पर पानी पी रहा हूं', ta: 'பசி குறைவு ஆனால் தண்ணீர் குடிக்கிறேன்' }, score: 1 },
          { text: { en: 'Cannot eat or drink', hi: 'खा-पी नहीं पा रहा', ta: 'சாப்பிடவோ குடிக்கவோ முடியவில்லை' }, score: 4 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Rest well and drink plenty of fluids. Take paracetamol for fever if needed. Monitor your temperature. If fever continues beyond 3 days, visit a doctor.', hi: 'अच्छी तरह आराम करें और खूब पानी पिएं। ज़रूरत पड़ने पर पैरासिटामोल लें। 3 दिन से ज़्यादा बुखार रहे तो डॉक्टर से मिलें।', ta: 'நன்றாக ஓய்வெடுங்கள், நிறைய திரவங்கள் குடியுங்கள். தேவையெனில் பாரசிட்டமால் எடுங்கள். 3 நாட்களுக்கு மேல் நீடித்தால் மருத்துவரை அணுகுங்கள்.' },
      medium: { en: 'Visit a healthcare center within 24 hours. Keep taking fluids. ORS can help if you have diarrhea. Monitor for warning signs like rash or confusion.', hi: '24 घंटे के भीतर स्वास्थ्य केंद्र जाएं। पानी पीते रहें। दस्त हो तो ORS लें। दाने या भ्रम जैसे संकेतों पर ध्यान दें।', ta: '24 மணி நேரத்திற்குள் சுகாதார நிலையத்திற்கு செல்லுங்கள். ORS குடியுங்கள். தடிப்பு அல்லது குழப்பம் ஏற்பட்டால் கவனியுங்கள்.' },
      high: { en: 'Go to a hospital as soon as possible. Fever with inability to eat/drink or with rash needs medical attention. Carry any medications you are taking.', hi: 'जल्द से जल्द अस्पताल जाएं। खा-पी न पाना या दाने होना चिंता का विषय है। अपनी दवाइयां साथ ले जाएं।', ta: 'விரைவில் மருத்துவமனைக்கு செல்லுங்கள். சாப்பிட முடியாமை அல்லது தடிப்புடன் காய்ச்சல் மருத்துவ கவனிப்பு தேவை.' },
    },
  },
  {
    id: 'headache',
    name: { en: 'Headache / Pain', hi: 'सिरदर्द / दर्द', ta: 'தலைவலி / வலி' },
    keywords: {
      en: ['headache', 'head pain', 'head hurts', 'migraine', 'body pain', 'pain', 'hurts', 'ache'],
      hi: ['सिरदर्द', 'सिर दर्द', 'दर्द', 'माइग्रेन', 'बदन दर्द', 'तकलीफ'],
      ta: ['தலைவலி', 'தலை வலி', 'வலி', 'ஒற்றைத் தலைவலி', 'உடல் வலி'],
    },
    followUps: [
      {
        question: { en: 'Where is the pain?', hi: 'दर्द कहां है?', ta: 'வலி எங்கே உள்ளது?' },
        options: [
          { text: { en: 'Head', hi: 'सिर', ta: 'தலை' }, score: 1 },
          { text: { en: 'Chest', hi: 'छाती', ta: 'நெஞ்சு' }, score: 4 },
          { text: { en: 'Stomach', hi: 'पेट', ta: 'வயிறு' }, score: 2 },
          { text: { en: 'Joints or body', hi: 'जोड़ या शरीर', ta: 'மூட்டுகள் அல்லது உடல்' }, score: 1 },
        ],
      },
      {
        question: { en: 'How bad is the pain? (1 = mild, 10 = worst)', hi: 'दर्द कितना तेज़ है? (1 = हल्का, 10 = सबसे तेज़)', ta: 'வலி எவ்வளவு கடுமையானது? (1 = லேசானது, 10 = மிகவும் கடுமையானது)' },
        options: [
          { text: { en: 'Mild (1-3)', hi: 'हल्का (1-3)', ta: 'லேசானது (1-3)' }, score: 1 },
          { text: { en: 'Moderate (4-6)', hi: 'मध्यम (4-6)', ta: 'மிதமானது (4-6)' }, score: 2 },
          { text: { en: 'Severe (7-9)', hi: 'तेज़ (7-9)', ta: 'கடுமையானது (7-9)' }, score: 3 },
          { text: { en: 'Worst ever (10)', hi: 'सबसे तेज़ (10)', ta: 'மிகவும் கடுமையானது (10)' }, score: 5 },
        ],
      },
      {
        question: { en: 'How long have you had this pain?', hi: 'यह दर्द कब से है?', ta: 'இந்த வலி எவ்வளவு நாளாக உள்ளது?' },
        options: [
          { text: { en: 'Just started', hi: 'अभी शुरू हुआ', ta: 'இப்போதுதான் ஆரம்பித்தது' }, score: 1 },
          { text: { en: '1-2 days', hi: '1-2 दिन', ta: '1-2 நாட்கள்' }, score: 1 },
          { text: { en: 'Several days', hi: 'कई दिन', ta: 'பல நாட்கள்' }, score: 2 },
          { text: { en: 'Keeps coming back', hi: 'बार-बार आता है', ta: 'மீண்டும் மீண்டும் வருகிறது' }, score: 2 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Rest in a quiet, dark room. Stay hydrated. Take paracetamol if needed. Avoid screen time. If pain is mild and manageable, it should improve with rest.', hi: 'शांत, अंधेरे कमरे में आराम करें। पानी पिएं। ज़रूरत पड़ने पर पैरासिटामोल लें। स्क्रीन से दूर रहें।', ta: 'அமைதியான, இருண்ட அறையில் ஓய்வெடுங்கள். நீர் குடியுங்கள். தேவையெனில் பாரசிட்டமால் எடுங்கள்.' },
      medium: { en: 'Visit a doctor within 1-2 days. Note when the pain started and what makes it worse. Avoid self-medication beyond basic painkillers.', hi: '1-2 दिन में डॉक्टर से मिलें। दर्द कब शुरू हुआ और क्या बढ़ाता है नोट करें। बेसिक दर्द निवारक के अलावा खुद दवा न लें।', ta: '1-2 நாட்களில் மருத்துவரை அணுகுங்கள். வலி எப்போது ஆரம்பித்தது என்று குறிப்பிடுங்கள்.' },
      high: { en: 'Seek medical attention today. Severe or sudden headache, especially with vision changes, confusion, or neck stiffness, needs urgent evaluation.', hi: 'आज ही चिकित्सा सहायता लें। तेज़ या अचानक सिरदर्द, खासकर दृष्टि बदलाव या गर्दन अकड़न के साथ, तत्काल जांच ज़रूरी है।', ta: 'இன்றே மருத்துவ உதவி பெறுங்கள். கடுமையான தலைவலி, பார்வை மாற்றம் அல்லது கழுத்து விறைப்புடன் இருந்தால் அவசர மதிப்பீடு தேவை.' },
    },
  },
  {
    id: 'stomach',
    name: { en: 'Stomach / Digestive', hi: 'पेट / पाचन', ta: 'வயிறு / செரிமானம்' },
    keywords: {
      en: ['stomach', 'stomach pain', 'belly', 'abdomen', 'nausea', 'vomiting', 'diarrhea', 'loose motion', 'acidity', 'gas', 'bloating', 'indigestion'],
      hi: ['पेट', 'पेट दर्द', 'उल्टी', 'दस्त', 'जी मिचला', 'एसिडिटी', 'गैस', 'अपच', 'पेट फूलना'],
      ta: ['வயிறு', 'வயிற்று வலி', 'வாந்தி', 'வயிற்றுப்போக்கு', 'குமட்டல்', 'அமிலத்தன்மை', 'வாயு', 'அஜீரணம்'],
    },
    followUps: [
      {
        question: { en: 'What are you experiencing?', hi: 'आपको क्या हो रहा है?', ta: 'உங்களுக்கு என்ன ஏற்படுகிறது?' },
        options: [
          { text: { en: 'Stomach pain', hi: 'पेट दर्द', ta: 'வயிற்று வலி' }, score: 2 },
          { text: { en: 'Vomiting', hi: 'उल्टी', ta: 'வாந்தி' }, score: 2 },
          { text: { en: 'Diarrhea/Loose motions', hi: 'दस्त', ta: 'வயிற்றுப்போக்கு' }, score: 2 },
          { text: { en: 'Gas/Acidity/Bloating', hi: 'गैस/एसिडिटी', ta: 'வாயு/அமிலத்தன்மை' }, score: 1 },
        ],
      },
      {
        question: { en: 'How long has this been going on?', hi: 'यह कब से हो रहा है?', ta: 'இது எவ்வளவு நாளாக நடக்கிறது?' },
        options: [
          { text: { en: 'A few hours', hi: 'कुछ घंटे', ta: 'சில மணி நேரம்' }, score: 1 },
          { text: { en: '1-2 days', hi: '1-2 दिन', ta: '1-2 நாட்கள்' }, score: 2 },
          { text: { en: 'More than 3 days', hi: '3 दिन से ज्यादा', ta: '3 நாட்களுக்கு மேல்' }, score: 3 },
        ],
      },
      {
        question: { en: 'Are you able to keep water down?', hi: 'क्या आप पानी रख पा रहे हैं?', ta: 'தண்ணீர் குடிக்க முடிகிறதா?' },
        options: [
          { text: { en: 'Yes, drinking fine', hi: 'हां, पानी पी पा रहा हूं', ta: 'ஆம், நன்றாக குடிக்கிறேன்' }, score: 0 },
          { text: { en: 'Some difficulty', hi: 'थोड़ी दिक्कत', ta: 'சிறிது கஷ்டம்' }, score: 2 },
          { text: { en: 'Cannot keep anything down', hi: 'कुछ भी अंदर नहीं रह रहा', ta: 'எதையும் வைத்திருக்க முடியவில்லை' }, score: 4 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Drink ORS or clean water frequently. Eat light food like rice, bananas, toast. Avoid spicy, oily food. Rest. If symptoms persist beyond 2 days, see a doctor.', hi: 'बार-बार ORS या साफ पानी पिएं। हल्का खाना खाएं - चावल, केला। मसालेदार खाना न खाएं। आराम करें।', ta: 'ORS அல்லது சுத்தமான நீர் அடிக்கடி குடியுங்கள். சாதம், வாழைப்பழம் போன்ற இலகு உணவு சாப்பிடுங்கள்.' },
      medium: { en: 'Visit a doctor today. Drink ORS to prevent dehydration. If you see blood in vomit or stool, go to a hospital.', hi: 'आज ही डॉक्टर से मिलें। ORS पिएं। उल्टी या मल में खून दिखे तो अस्पताल जाएं।', ta: 'இன்றே மருத்துவரை அணுகுங்கள். ORS குடியுங்கள். வாந்தி அல்லது மலத்தில் ரத்தம் இருந்தால் மருத்துவமனைக்கு செல்லுங்கள்.' },
      high: { en: 'Go to a hospital now. Inability to keep water down risks severe dehydration. This is especially dangerous for children, elderly, and pregnant women.', hi: 'अभी अस्पताल जाएं। पानी न रख पाना गंभीर निर्जलीकरण का खतरा है। बच्चों, बुजुर्गों और गर्भवती महिलाओं के लिए विशेष रूप से खतरनाक।', ta: 'இப்போதே மருத்துவமனைக்கு செல்லுங்கள். நீர் குடிக்க முடியாமை கடுமையான நீர்ச்சத்து இழப்பு ஆபத்தை ஏற்படுத்தும்.' },
    },
  },
  {
    id: 'cough',
    name: { en: 'Cough / Cold / Respiratory', hi: 'खांसी / सर्दी / श्वसन', ta: 'இருமல் / சளி / சுவாசம்' },
    keywords: {
      en: ['cough', 'cold', 'sore throat', 'runny nose', 'blocked nose', 'congestion', 'phlegm', 'mucus', 'sneezing', 'flu'],
      hi: ['खांसी', 'सर्दी', 'गला दर्द', 'नाक बहना', 'नाक बंद', 'बलगम', 'छींक', 'जुकाम'],
      ta: ['இருமல்', 'சளி', 'தொண்டை வலி', 'மூக்கு ஒழுகுதல்', 'மூக்கடைப்பு', 'சளி', 'தும்மல்'],
    },
    followUps: [
      {
        question: { en: 'What type of cough do you have?', hi: 'खांसी कैसी है?', ta: 'எந்த வகையான இருமல்?' },
        options: [
          { text: { en: 'Dry cough', hi: 'सूखी खांसी', ta: 'வறட்டு இருமல்' }, score: 1 },
          { text: { en: 'Cough with phlegm', hi: 'बलगम वाली खांसी', ta: 'சளியுடன் இருமல்' }, score: 2 },
          { text: { en: 'Cough with blood', hi: 'खून वाली खांसी', ta: 'ரத்தத்துடன் இருமல்' }, score: 5 },
          { text: { en: 'Cold/runny nose only', hi: 'सिर्फ सर्दी/नाक बहना', ta: 'சளி/மூக்கு ஒழுகுதல் மட்டும்' }, score: 1 },
        ],
      },
      {
        question: { en: 'How long have you had these symptoms?', hi: 'ये लक्षण कब से हैं?', ta: 'இந்த அறிகுறிகள் எவ்வளவு நாளாக உள்ளன?' },
        options: [
          { text: { en: '1-3 days', hi: '1-3 दिन', ta: '1-3 நாட்கள்' }, score: 1 },
          { text: { en: '4-7 days', hi: '4-7 दिन', ta: '4-7 நாட்கள்' }, score: 2 },
          { text: { en: 'More than 2 weeks', hi: '2 हफ्ते से ज्यादा', ta: '2 வாரங்களுக்கு மேல்' }, score: 3 },
        ],
      },
      {
        question: { en: 'Do you have difficulty breathing?', hi: 'क्या सांस लेने में तकलीफ है?', ta: 'மூச்சு விடுவதில் கஷ்டம் உள்ளதா?' },
        options: [
          { text: { en: 'No breathing problems', hi: 'सांस ठीक है', ta: 'மூச்சு சரியாக உள்ளது' }, score: 0 },
          { text: { en: 'Slight difficulty', hi: 'थोड़ी तकलीफ', ta: 'சிறிது கஷ்டம்' }, score: 2 },
          { text: { en: 'Yes, hard to breathe', hi: 'हां, सांस लेना मुश्किल', ta: 'ஆம், மூச்சுவிட கஷ்டம்' }, score: 5 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Rest and drink warm fluids (ginger tea, warm water with honey). Steam inhalation can help congestion. Gargle with warm salt water for sore throat.', hi: 'आराम करें और गर्म पेय पिएं (अदरक चाय, शहद पानी)। भाप लें। गले में दर्द के लिए गर्म नमक पानी से गरारे करें।', ta: 'ஓய்வெடுங்கள், சூடான பானங்கள் குடியுங்கள் (இஞ்சி தேநீர், தேன் நீர்). ஆவி பிடியுங்கள். தொண்டை வலிக்கு உப்பு நீர் கொப்பளியுங்கள்.' },
      medium: { en: 'See a doctor within 1-2 days. Cough lasting more than 2 weeks needs investigation. Take prescribed cough medicine only.', hi: '1-2 दिन में डॉक्टर से मिलें। 2 हफ्ते से ज्यादा खांसी की जांच ज़रूरी। सिर्फ डॉक्टर की दवा लें।', ta: '1-2 நாட்களில் மருத்துவரை அணுகுங்கள். 2 வாரங்களுக்கு மேல் இருமல் ஆராய்ச்சி தேவை.' },
      high: { en: 'Seek medical care urgently. Blood in cough or breathing difficulty needs immediate evaluation. Go to a hospital.', hi: 'तत्काल चिकित्सा सहायता लें। खांसी में खून या सांस की तकलीफ को तुरंत जांच चाहिए। अस्पताल जाएं।', ta: 'அவசரமாக மருத்துவ உதவி பெறுங்கள். இருமலில் ரத்தம் அல்லது மூச்சுத் திணறலுக்கு உடனடி மதிப்பீடு தேவை.' },
    },
  },
  {
    id: 'skin',
    name: { en: 'Skin Problems', hi: 'त्वचा समस्या', ta: 'தோல் பிரச்சனைகள்' },
    keywords: {
      en: ['skin', 'rash', 'itching', 'itchy', 'swelling', 'wound', 'boil', 'pimple', 'allergy skin', 'red spots', 'bumps'],
      hi: ['त्वचा', 'दाने', 'खुजली', 'सूजन', 'घाव', 'फोड़ा', 'फुंसी', 'लाल दाने', 'चकत्ते'],
      ta: ['தோல்', 'தடிப்பு', 'அரிப்பு', 'வீக்கம்', 'காயம்', 'கொப்புளம்', 'சிவப்பு புள்ளிகள்'],
    },
    followUps: [
      {
        question: { en: 'What does it look like?', hi: 'कैसा दिखता है?', ta: 'எப்படி தெரிகிறது?' },
        options: [
          { text: { en: 'Red patches or rash', hi: 'लाल धब्बे या दाने', ta: 'சிவப்பு திட்டுகள் அல்லது தடிப்பு' }, score: 1 },
          { text: { en: 'Itchy bumps', hi: 'खुजली वाले दाने', ta: 'அரிப்புடன் கொப்புளங்கள்' }, score: 1 },
          { text: { en: 'Open wound or sore', hi: 'खुला घाव', ta: 'திறந்த காயம்' }, score: 2 },
          { text: { en: 'Swelling with pain', hi: 'दर्द के साथ सूजन', ta: 'வலியுடன் வீக்கம்' }, score: 3 },
        ],
      },
      {
        question: { en: 'Is it spreading?', hi: 'क्या यह फैल रहा है?', ta: 'இது பரவுகிறதா?' },
        options: [
          { text: { en: 'No, staying in one place', hi: 'नहीं, एक जगह है', ta: 'இல்லை, ஒரே இடத்தில்' }, score: 0 },
          { text: { en: 'Slowly spreading', hi: 'धीरे-धीरे फैल रहा', ta: 'மெதுவாக பரவுகிறது' }, score: 2 },
          { text: { en: 'Spreading fast', hi: 'तेज़ी से फैल रहा', ta: 'வேகமாக பரவுகிறது' }, score: 3 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Keep the area clean and dry. Avoid scratching. Apply calamine lotion for itching. If it does not improve in a few days, see a doctor.', hi: 'जगह को साफ और सूखा रखें। खुजाएं नहीं। खुजली के लिए कैलामाइन लोशन लगाएं। कुछ दिनों में सुधार न हो तो डॉक्टर से मिलें।', ta: 'பகுதியை சுத்தமாகவும் உலர்ந்ததாகவும் வையுங்கள். சொறியாதீர்கள். அரிப்புக்கு காலமைன் லோஷன் பயன்படுத்துங்கள்.' },
      medium: { en: 'See a doctor within 1-2 days. Do not apply random creams. Keep the area clean. Watch for spreading, fever, or pus.', hi: '1-2 दिन में डॉक्टर से मिलें। कोई भी क्रीम न लगाएं। साफ रखें। फैलने, बुखार या मवाद पर ध्यान दें।', ta: '1-2 நாட்களில் மருத்துவரை அணுகுங்கள். எந்த க்ரீமும் போடாதீர்கள்.' },
      high: { en: 'Go to a doctor today. Rapidly spreading rash, swelling with fever, or infected wounds need prompt treatment.', hi: 'आज ही डॉक्टर के पास जाएं। तेज़ी से फैलने वाले दाने, बुखार के साथ सूजन या संक्रमित घाव का तुरंत इलाज ज़रूरी।', ta: 'இன்றே மருத்துவரிடம் செல்லுங்கள். வேகமாக பரவும் தடிப்பு, காய்ச்சலுடன் வீக்கம் உடனடி சிகிச்சை தேவை.' },
    },
  },
  {
    id: 'weakness',
    name: { en: 'Weakness / Fatigue', hi: 'कमज़ोरी / थकान', ta: 'பலவீனம் / சோர்வு' },
    keywords: {
      en: ['tired', 'weak', 'fatigue', 'no energy', 'exhausted', 'dizzy', 'dizziness', 'giddy', 'lightheaded'],
      hi: ['थकान', 'कमज़ोरी', 'ऊर्जा नहीं', 'थका हुआ', 'चक्कर', 'सिर घूमना'],
      ta: ['சோர்வு', 'பலவீனம்', 'ஆற்றல் இல்லை', 'தலைச்சுற்றல்', 'மயக்கம்'],
    },
    followUps: [
      {
        question: { en: 'How long have you been feeling this way?', hi: 'कब से ऐसा महसूस हो रहा है?', ta: 'எவ்வளவு நாளாக இப்படி உணர்கிறீர்கள்?' },
        options: [
          { text: { en: 'Today', hi: 'आज', ta: 'இன்று' }, score: 1 },
          { text: { en: 'A few days', hi: 'कुछ दिन', ta: 'சில நாட்கள்' }, score: 2 },
          { text: { en: 'More than a week', hi: 'एक हफ्ते से ज्यादा', ta: 'ஒரு வாரத்திற்கு மேல்' }, score: 3 },
        ],
      },
      {
        question: { en: 'Are you eating and drinking enough?', hi: 'क्या आप पर्याप्त खा-पी रहे हैं?', ta: 'போதுமான அளவு சாப்பிடுகிறீர்களா?' },
        options: [
          { text: { en: 'Yes, normal diet', hi: 'हां, सामान्य खाना', ta: 'ஆம், சாதாரண உணவு' }, score: 0 },
          { text: { en: 'Less than usual', hi: 'सामान्य से कम', ta: 'வழக்கத்தை விட குறைவு' }, score: 2 },
          { text: { en: 'Very little or nothing', hi: 'बहुत कम या कुछ नहीं', ta: 'மிகக் குறைவு அல்லது எதுவும் இல்லை' }, score: 3 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Eat nutritious food (dal, rice, vegetables, fruits). Stay hydrated. Get 7-8 hours of sleep. Rest when needed. Consider ORS if dehydrated.', hi: 'पौष्टिक खाना खाएं (दाल, चावल, सब्ज़ी, फल)। पानी पिएं। 7-8 घंटे सोएं। ज़रूरत पड़ने पर आराम करें।', ta: 'சத்தான உணவு சாப்பிடுங்கள் (பருப்பு, அரிசி, காய்கறிகள், பழங்கள்). நீர் குடியுங்கள். 7-8 மணி நேரம் தூங்குங்கள்.' },
      medium: { en: 'See a doctor within a few days. Persistent fatigue may need blood tests (anaemia, thyroid, sugar). Keep a note of your symptoms.', hi: 'कुछ दिनों में डॉक्टर से मिलें। लगातार थकान में खून जांच (एनीमिया, थाइरॉइड, शुगर) ज़रूरी हो सकती है।', ta: 'சில நாட்களில் மருத்துவரை அணுகுங்கள். தொடர்ந்த சோர்வுக்கு இரத்த பரிசோதனை தேவைப்படலாம்.' },
      high: { en: 'Visit a healthcare facility today. Sudden severe weakness, especially with dizziness, fainting, or chest pain, needs urgent evaluation.', hi: 'आज ही स्वास्थ्य केंद्र जाएं। अचानक गंभीर कमज़ोरी, खासकर चक्कर या सीने में दर्द के साथ, तत्काल जांच ज़रूरी।', ta: 'இன்றே சுகாதார நிலையத்திற்கு செல்லுங்கள். திடீர் கடுமையான பலவீனம் அவசர மதிப்பீடு தேவை.' },
    },
  },
  {
    id: 'pregnancy',
    name: { en: 'Pregnancy Concerns', hi: 'गर्भावस्था', ta: 'கர்ப்பம்' },
    keywords: {
      en: ['pregnant', 'pregnancy', 'baby', 'morning sickness', 'prenatal', 'expecting'],
      hi: ['गर्भवती', 'गर्भावस्था', 'प्रेगनेंसी', 'बच्चा', 'मॉर्निंग सिकनेस'],
      ta: ['கர்ப்பம்', 'கர்ப்பிணி', 'குழந்தை', 'காலை நோய்'],
    },
    followUps: [
      {
        question: { en: 'How many weeks/months pregnant?', hi: 'कितने हफ्ते/महीने की गर्भावस्था?', ta: 'எத்தனை வாரம்/மாதம் கர்ப்பம்?' },
        options: [
          { text: { en: 'First 3 months', hi: 'पहले 3 महीने', ta: 'முதல் 3 மாதங்கள்' }, score: 1 },
          { text: { en: '4-6 months', hi: '4-6 महीने', ta: '4-6 மாதங்கள்' }, score: 1 },
          { text: { en: '7-9 months', hi: '7-9 महीने', ta: '7-9 மாதங்கள்' }, score: 2 },
          { text: { en: 'Not sure', hi: 'पता नहीं', ta: 'தெரியவில்லை' }, score: 1 },
        ],
      },
      {
        question: { en: 'What is your concern?', hi: 'आपकी चिंता क्या है?', ta: 'உங்கள் கவலை என்ன?' },
        options: [
          { text: { en: 'Nausea/Morning sickness', hi: 'जी मिचलाना', ta: 'குமட்டல்/காலை நோய்' }, score: 1 },
          { text: { en: 'Swelling in hands/feet', hi: 'हाथ/पैर में सूजन', ta: 'கை/கால் வீக்கம்' }, score: 2 },
          { text: { en: 'Bleeding', hi: 'खून आना', ta: 'இரத்தப்போக்கு' }, score: 5 },
          { text: { en: 'Reduced baby movement', hi: 'बच्चा कम हिल रहा', ta: 'குழந்தை அசைவு குறைவு' }, score: 4 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Normal pregnancy symptoms. Eat small frequent meals for nausea. Stay hydrated. Take prescribed prenatal vitamins. Attend regular checkups.', hi: 'सामान्य गर्भावस्था लक्षण। जी मिचलाने के लिए बार-बार थोड़ा खाएं। पानी पिएं। प्रीनेटल विटामिन लें।', ta: 'சாதாரண கர்ப்பகால அறிகுறிகள். குமட்டலுக்கு சிறிய அடிக்கடி உணவு சாப்பிடுங்கள். நீர் குடியுங்கள்.' },
      medium: { en: 'See your doctor soon. Swelling needs blood pressure monitoring. Keep track of baby movements. Do not take any new medicines without asking your doctor.', hi: 'जल्दी डॉक्टर से मिलें। सूजन में ब्लड प्रेशर जांच ज़रूरी। बच्चे की हलचल पर ध्यान दें। बिना पूछे कोई नई दवा न लें।', ta: 'விரைவில் மருத்துவரை அணுகுங்கள். வீக்கத்திற்கு இரத்த அழுத்த கண்காணிப்பு தேவை.' },
      high: { en: 'Go to a hospital immediately. Bleeding during pregnancy or reduced baby movement is an emergency. Do not delay.', hi: 'तुरंत अस्पताल जाएं। गर्भावस्था में खून आना या बच्चे की कम हलचल आपातकाल है। देरी न करें।', ta: 'உடனடியாக மருத்துவமனைக்கு செல்லுங்கள். கர்ப்பகால இரத்தப்போக்கு அவசரநிலை.' },
    },
  },
  {
    id: 'eye',
    name: { en: 'Eye Problems', hi: 'आंखों की समस्या', ta: 'கண் பிரச்சனைகள்' },
    keywords: {
      en: ['eye', 'eyes', 'vision', 'blurry', 'eye pain', 'red eye', 'watery eyes', 'cant see', 'itchy eyes'],
      hi: ['आंख', 'नज़र', 'धुंधला', 'आंख दर्द', 'आंख लाल', 'आंख से पानी', 'दिखाई नहीं देता'],
      ta: ['கண்', 'பார்வை', 'மங்கலான', 'கண் வலி', 'சிவப்பு கண்', 'கண்ணீர்', 'தெரியவில்லை'],
    },
    followUps: [
      {
        question: { en: 'What is the problem?', hi: 'क्या समस्या है?', ta: 'என்ன பிரச்சனை?' },
        options: [
          { text: { en: 'Redness or irritation', hi: 'लालिमा या जलन', ta: 'சிவப்பு அல்லது எரிச்சல்' }, score: 1 },
          { text: { en: 'Pain in the eye', hi: 'आंख में दर्द', ta: 'கண்ணில் வலி' }, score: 2 },
          { text: { en: 'Blurry or reduced vision', hi: 'धुंधला या कम दिखना', ta: 'மங்கலான அல்லது குறைந்த பார்வை' }, score: 3 },
          { text: { en: 'Something in the eye', hi: 'आंख में कुछ गया', ta: 'கண்ணில் ஏதோ உள்ளது' }, score: 2 },
        ],
      },
      {
        question: { en: 'Did it start suddenly?', hi: 'क्या यह अचानक शुरू हुआ?', ta: 'இது திடீரென ஆரம்பித்ததா?' },
        options: [
          { text: { en: 'Yes, suddenly', hi: 'हां, अचानक', ta: 'ஆம், திடீரென' }, score: 2 },
          { text: { en: 'Gradually over days', hi: 'धीरे-धीरे कई दिनों में', ta: 'நாட்களில் படிப்படியாக' }, score: 1 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Wash eyes with clean water. Do not rub your eyes. Use clean cloth to wipe. Avoid screens. If it does not improve in 1-2 days, see a doctor.', hi: 'आंखों को साफ पानी से धोएं। आंखें न मलें। साफ कपड़े से पोंछें। स्क्रीन से दूर रहें।', ta: 'சுத்தமான நீரில் கண்களை கழுவுங்கள். கண்களை தேய்க்காதீர்கள்.' },
      medium: { en: 'See an eye doctor within 1-2 days. Do not put anything in the eye without medical advice.', hi: '1-2 दिन में आंखों के डॉक्टर से मिलें। डॉक्टर की सलाह बिना आंख में कुछ न डालें।', ta: '1-2 நாட்களில் கண் மருத்துவரை அணுகுங்கள்.' },
      high: { en: 'See a doctor today. Sudden vision changes, severe eye pain, or injury needs urgent care. Do not delay.', hi: 'आज ही डॉक्टर से मिलें। अचानक नज़र बदलना, तेज़ दर्द या चोट को तत्काल देखभाल चाहिए।', ta: 'இன்றே மருத்துவரிடம் செல்லுங்கள். திடீர் பார்வை மாற்றம் அவசர கவனிப்பு தேவை.' },
    },
  },
  {
    id: 'urinary',
    name: { en: 'Urinary Problems', hi: 'पेशाब की समस्या', ta: 'சிறுநீர் பிரச்சனைகள்' },
    keywords: {
      en: ['urine', 'urinary', 'burning urine', 'frequent urination', 'blood in urine', 'painful urination', 'uti', 'kidney pain'],
      hi: ['पेशाब', 'पेशाब में जलन', 'बार-बार पेशाब', 'पेशाब में खून', 'गुर्दा दर्द'],
      ta: ['சிறுநீர்', 'சிறுநீர் எரிச்சல்', 'அடிக்கடி சிறுநீர்', 'சிறுநீரில் ரத்தம்', 'சிறுநீரக வலி'],
    },
    followUps: [
      {
        question: { en: 'What is the main problem?', hi: 'मुख्य समस्या क्या है?', ta: 'முக்கிய பிரச்சனை என்ன?' },
        options: [
          { text: { en: 'Burning or pain', hi: 'जलन या दर्द', ta: 'எரிச்சல் அல்லது வலி' }, score: 2 },
          { text: { en: 'Going too often', hi: 'बार-बार जाना', ta: 'அடிக்கடி போவது' }, score: 1 },
          { text: { en: 'Blood in urine', hi: 'पेशाब में खून', ta: 'சிறுநீரில் ரத்தம்' }, score: 4 },
          { text: { en: 'Unable to urinate', hi: 'पेशाब नहीं आ रहा', ta: 'சிறுநீர் கழிக்க முடியவில்லை' }, score: 4 },
        ],
      },
      {
        question: { en: 'Do you also have fever?', hi: 'क्या बुखार भी है?', ta: 'காய்ச்சலும் உள்ளதா?' },
        options: [
          { text: { en: 'No fever', hi: 'बुखार नहीं', ta: 'காய்ச்சல் இல்லை' }, score: 0 },
          { text: { en: 'Yes, with fever', hi: 'हां, बुखार भी है', ta: 'ஆம், காய்ச்சலுடன்' }, score: 3 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Drink plenty of water (8-10 glasses per day). Avoid holding urine. Maintain hygiene. If symptoms persist beyond 2 days, see a doctor.', hi: 'खूब पानी पिएं (दिन में 8-10 गिलास)। पेशाब रोकें नहीं। साफ-सफाई रखें। 2 दिन में ठीक न हो तो डॉक्टर से मिलें।', ta: 'நிறைய தண்ணீர் குடியுங்கள் (நாளுக்கு 8-10 கிளாஸ்). சிறுநீரை அடக்காதீர்கள்.' },
      medium: { en: 'See a doctor within 1-2 days. You may need a urine test. Drink water and avoid spicy food.', hi: '1-2 दिन में डॉक्टर से मिलें। यूरिन टेस्ट ज़रूरी हो सकती है। पानी पिएं और मसालेदार खाना न खाएं।', ta: '1-2 நாட்களில் மருத்துவரை அணுகுங்கள். சிறுநீர் பரிசோதனை தேவைப்படலாம்.' },
      high: { en: 'Visit a doctor today. Blood in urine, inability to urinate, or urinary symptoms with high fever need urgent evaluation.', hi: 'आज ही डॉक्टर से मिलें। पेशाब में खून, पेशाब न आना, या तेज़ बुखार के साथ लक्षण तत्काल जांच ज़रूरी।', ta: 'இன்றே மருத்துவரிடம் செல்லுங்கள். சிறுநீரில் ரத்தம் அவசர மதிப்பீடு தேவை.' },
    },
  },
  {
    id: 'joint',
    name: { en: 'Joint / Muscle Pain', hi: 'जोड़ / मांसपेशी दर्द', ta: 'மூட்டு / தசை வலி' },
    keywords: {
      en: ['joint', 'knee', 'back pain', 'shoulder', 'muscle', 'stiff', 'sprain', 'arthritis', 'swollen joint'],
      hi: ['जोड़', 'घुटना', 'कमर दर्द', 'कंधा', 'मांसपेशी', 'अकड़न', 'मोच', 'गठिया'],
      ta: ['மூட்டு', 'முழங்கால்', 'முதுகு வலி', 'தோள்', 'தசை', 'விறைப்பு', 'சுளுக்கு'],
    },
    followUps: [
      {
        question: { en: 'Was there an injury?', hi: 'क्या कोई चोट लगी थी?', ta: 'ஏதேனும் காயம் ஏற்பட்டதா?' },
        options: [
          { text: { en: 'Yes, recent injury', hi: 'हां, हाल ही में चोट', ta: 'ஆம், சமீபத்திய காயம்' }, score: 2 },
          { text: { en: 'No injury, started on its own', hi: 'कोई चोट नहीं, अपने आप शुरू हुआ', ta: 'காயம் இல்லை, தானாக ஆரம்பித்தது' }, score: 1 },
        ],
      },
      {
        question: { en: 'Is the area swollen or red?', hi: 'क्या जगह सूजी या लाल है?', ta: 'அந்த இடம் வீங்கியுள்ளதா அல்லது சிவப்பாக உள்ளதா?' },
        options: [
          { text: { en: 'No swelling', hi: 'सूजन नहीं', ta: 'வீக்கம் இல்லை' }, score: 0 },
          { text: { en: 'Mild swelling', hi: 'हल्की सूजन', ta: 'லேசான வீக்கம்' }, score: 1 },
          { text: { en: 'Significant swelling with redness', hi: 'काफी सूजन और लालिमा', ta: 'குறிப்பிடத்தக்க வீக்கம் மற்றும் சிவப்பு' }, score: 3 },
        ],
      },
    ],
    guidance: {
      low: { en: 'Rest the affected area. Apply ice for 15-20 minutes if swollen. Take paracetamol for pain. Gentle movement is fine but avoid heavy activity.', hi: 'प्रभावित जगह को आराम दें। सूजन हो तो 15-20 मिनट बर्फ लगाएं। दर्द के लिए पैरासिटामोल लें।', ta: 'பாதிக்கப்பட்ட பகுதிக்கு ஓய்வு கொடுங்கள். வீக்கம் இருந்தால் 15-20 நிமிடம் ஐஸ் போடுங்கள்.' },
      medium: { en: 'See a doctor within a few days. If pain prevents normal activities, or if you had a fall/injury, get checked. Do not ignore persistent pain.', hi: 'कुछ दिनों में डॉक्टर से मिलें। अगर दर्द सामान्य काम करने से रोकता है तो जांच कराएं।', ta: 'சில நாட்களில் மருத்துவரை அணுகுங்கள். வலி இயல்பு செயல்களை தடுத்தால் பரிசோதிக்கவும்.' },
      high: { en: 'See a doctor today. Severe joint swelling with redness and fever could indicate infection and needs urgent attention.', hi: 'आज ही डॉक्टर से मिलें। तेज़ सूजन, लालिमा और बुखार के साथ जोड़ दर्द संक्रमण का संकेत हो सकता है।', ta: 'இன்றே மருத்துவரிடம் செல்லுங்கள். கடுமையான வீக்கம் மற்றும் காய்ச்சலுடன் மூட்டு வலி அவசர கவனிப்பு தேவை.' },
    },
  },
];

export const LOCAL_MEDICINES = [
  { id: 'med_1', name: 'Paracetamol', name_hi: 'पैरासिटामोल', name_ta: 'பாரசிட்டமால்', common_use: 'Fever and mild pain relief', common_use_hi: 'बुखार और हल्के दर्द से राहत', common_use_ta: 'காய்ச்சல் மற்றும் லேசான வலி நிவாரணம்', precautions: 'Do not exceed 4g per day. Avoid with liver disease.', precautions_hi: 'प्रतिदिन 4 ग्राम से अधिक न लें।', precautions_ta: 'நாளொன்றுக்கு 4 கிராமுக்கு மேல் எடுக்க வேண்டாம்.', category: 'Pain Relief' },
  { id: 'med_2', name: 'ORS', name_hi: 'ओआरएस', name_ta: 'ORS', common_use: 'Dehydration from diarrhea, vomiting', common_use_hi: 'दस्त, उल्टी से पानी की कमी', common_use_ta: 'வயிற்றுப்போக்கால் நீர்ச்சத்து இழப்பு', precautions: 'Mix one sachet in 1 litre clean water.', precautions_hi: 'एक पैकेट को 1 लीटर पानी में मिलाएं।', precautions_ta: 'ஒரு பொட்டலத்தை 1 லிட்டர் நீரில் கலக்கவும்.', category: 'Rehydration' },
  { id: 'med_3', name: 'Cetirizine', name_hi: 'सिट्रिज़ीन', name_ta: 'செட்டிரிசின்', common_use: 'Allergies, runny nose, sneezing', common_use_hi: 'एलर्जी, बहती नाक, छींक', common_use_ta: 'ஒவ்வாமை, மூக்கு ஒழுகுதல், தும்மல்', precautions: 'May cause drowsiness.', precautions_hi: 'नींद आ सकती है।', precautions_ta: 'தூக்கம் வரலாம்.', category: 'Antihistamine' },
  { id: 'med_4', name: 'Omeprazole', name_hi: 'ओमेप्राज़ोल', name_ta: 'ஓமெப்ராசோல்', common_use: 'Acidity, heartburn, stomach ulcers', common_use_hi: 'एसिडिटी, सीने में जलन', common_use_ta: 'அமிலத்தன்மை, நெஞ்செரிச்சல்', precautions: 'Take before meals.', precautions_hi: 'खाने से पहले लें।', precautions_ta: 'உணவுக்கு முன் எடுக்கவும்.', category: 'Antacid' },
];

export const LOCAL_HERBS = [
  { id: 'herb_1', name: 'Turmeric', name_hi: 'हल्दी', name_ta: 'மஞ்சள்', traditional_use: 'Anti-inflammatory, immunity', traditional_use_hi: 'सूजन कम करना, प्रतिरक्षा', traditional_use_ta: 'அழற்சி எதிர்ப்பு, நோய் எதிர்ப்பு', explanation: 'Contains curcumin with anti-inflammatory properties', explanation_hi: 'करक्यूमिन होता है जो सूजन कम करता है', explanation_ta: 'குர்குமின் உள்ளடக்கியது', safety_info: 'Safe in food amounts.', safety_info_hi: 'खाने की मात्रा में सुरक्षित।', safety_info_ta: 'உணவு அளவில் பாதுகாப்பானது.' },
  { id: 'herb_2', name: 'Ginger', name_hi: 'अदरक', name_ta: 'இஞ்சி', traditional_use: 'Nausea, digestion, cold', traditional_use_hi: 'मतली, पाचन, सर्दी', traditional_use_ta: 'குமட்டல், செரிமானம், சளி', explanation: 'Warming spice for digestion', explanation_hi: 'गर्म मसाला जो पाचन में सहायता करता है', explanation_ta: 'செரிமானத்திற்கு உதவும் மசாலா', safety_info: 'Safe in normal amounts.', safety_info_hi: 'सामान्य मात्रा में सुरक्षित।', safety_info_ta: 'சாதாரண அளவில் பாதுகாப்பானது.' },
  { id: 'herb_3', name: 'Amla', name_hi: 'आंवला', name_ta: 'நெல்லிக்காய்', traditional_use: 'Immunity, vitamin C', traditional_use_hi: 'प्रतिरक्षा, विटामिन सी', traditional_use_ta: 'நோய் எதிர்ப்பு, வைட்டமின் சி', explanation: 'Richest natural vitamin C source', explanation_hi: 'विटामिन सी का सबसे समृद्ध स्रोत', explanation_ta: 'வைட்டமின் சி இன் மிகச்சிறந்த மூலம்', safety_info: 'Safe for most people.', safety_info_hi: 'अधिकांश लोगों के लिए सुरक्षित।', safety_info_ta: 'பெரும்பாலான மக்களுக்கு பாதுகாப்பானது.' },
  { id: 'herb_4', name: 'Tulsi', name_hi: 'तुलसी', name_ta: 'துளசி', traditional_use: 'Cold, cough, immunity', traditional_use_hi: 'सर्दी, खांसी, प्रतिरक्षा', traditional_use_ta: 'சளி, இருமல், நோய் எதிர்ப்பு', explanation: 'Sacred basil used in Ayurveda for respiratory health', explanation_hi: 'श्वसन स्वास्थ्य के लिए आयुर्वेद में उपयोग', explanation_ta: 'சுவாச ஆரோக்கியத்திற்கு ஆயுர்வேதத்தில் பயன்படுத்தப்படும்', safety_info: 'Generally safe as tea.', safety_info_hi: 'चाय के रूप में सुरक्षित।', safety_info_ta: 'தேநீராக பாதுகாப்பானது.' },
];

export const LOCAL_FACILITIES = [
  { id: 'fac_1', name: 'Chennai Government General Hospital', type: 'hospital', lat: 13.079, lng: 80.275, address: 'Park Town, Chennai', phone: '044-25305000', emergency_available: 1, opening_hours: '24/7' },
  { id: 'fac_2', name: 'Royapuram PHC', type: 'phc', lat: 13.105, lng: 80.294, address: 'Royapuram, Chennai', phone: '044-25951234', emergency_available: 0, opening_hours: 'Mon-Sat 8AM-4PM' },
  { id: 'fac_3', name: 'Tiruvottiyur CHC', type: 'chc', lat: 13.16, lng: 80.30, address: 'Tiruvottiyur, Chennai', phone: '044-25731456', emergency_available: 1, opening_hours: 'Mon-Sat 8AM-8PM' },
  { id: 'fac_4', name: 'Siddha Clinic Mylapore', type: 'ayush', lat: 13.034, lng: 80.269, address: 'Mylapore, Chennai', phone: '044-24640987', emergency_available: 0, opening_hours: 'Mon-Sat 9AM-5PM' },
  { id: 'fac_5', name: 'SRMC Emergency Centre', type: 'emergency', lat: 12.99, lng: 80.227, address: 'Porur, Chennai', phone: '044-24768027', emergency_available: 1, opening_hours: '24/7' },
];

export const LOCATION_DATA = {
  states: [
    {
      name: { en: 'Tamil Nadu', hi: 'तमिलनाडु', ta: 'தமிழ்நாடு' },
      districts: [
        { name: { en: 'Chennai', hi: 'चेन्नई', ta: 'சென்னை' }, villages: ['Thiruvalluvar Nagar', 'Kannapuram', 'Perumbakkam Colony', 'Semmancheri Village'] },
        { name: { en: 'Kancheepuram', hi: 'कांचीपुरम', ta: 'காஞ்சிபுரம்' }, villages: ['Uthiramerur', 'Walajabad', 'Sriperumbudur'] },
        { name: { en: 'Tiruvallur', hi: 'तिरुवल्लूर', ta: 'திருவள்ளூர்' }, villages: ['Ponneri', 'Gummidipoondi', 'Tiruttani'] },
      ],
    },
    {
      name: { en: 'Kerala', hi: 'केरल', ta: 'கேரளா' },
      districts: [
        { name: { en: 'Thiruvananthapuram', hi: 'तिरुवनंतपुरम', ta: 'திருவனந்தபுரம்' }, villages: ['Neyyattinkara', 'Nedumangad'] },
        { name: { en: 'Ernakulam', hi: 'एर्नाकुलम', ta: 'எர்ணாகுளம்' }, villages: ['Aluva', 'Perumbavoor', 'Muvattupuzha'] },
      ],
    },
    {
      name: { en: 'Karnataka', hi: 'कर्नाटक', ta: 'கர்நாடகா' },
      districts: [
        { name: { en: 'Bangalore Rural', hi: 'बैंगलोर ग्रामीण', ta: 'பெங்களூர் கிராமம்' }, villages: ['Devanahalli', 'Doddaballapur', 'Nelamangala'] },
      ],
    },
  ],
};
