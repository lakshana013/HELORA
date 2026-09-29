import { getSystemPrompt } from './systemPrompt.js';

const EMERGENCY_KEYWORDS = {
  en: ['chest pain', 'can\'t breathe', 'difficulty breathing', 'unconscious', 'severe bleeding', 'heart attack', 'stroke', 'seizure', 'paralysis', 'not breathing', 'choking', 'severe allergic', 'anaphylaxis', 'poisoning', 'suicide', 'overdose'],
  hi: ['सीने में दर्द', 'सांस नहीं', 'बेहोश', 'खून बह रहा', 'दिल का दौरा', 'लकवा', 'दौरा', 'जहर', 'सांस लेने में तकलीफ'],
  ta: ['நெஞ்சு வலி', 'மூச்சு விடமுடியவில்லை', 'சுயநினைவு இல்லை', 'இரத்தப்போக்கு', 'மாரடைப்பு', 'பக்கவாதம்', 'வலிப்பு']
};

const FOLLOW_UP_RESPONSES = {
  en: {
    fever: { text: "I understand you have fever. Let me ask a few questions to help you.\n\nHow high is your fever?", options: "[OPTION:Mild - slightly warm|Moderate - quite warm|High - very hot|I don't know]" },
    pain: { text: "I understand you're in pain. I want to help you.\n\nWhere exactly do you feel the pain?", options: "[OPTION:Head|Stomach/Belly|Chest|Back|Arms or Legs|Other]" },
    stomach: { text: "I understand your stomach is bothering you.\n\nWhen did the stomach problem start?", options: "[OPTION:Today|2-3 days ago|More than a week|I don't know]" },
    cough: { text: "I understand you have a cough.\n\nIs it a dry cough or do you cough up mucus?", options: "[OPTION:Dry cough|Cough with mucus|Cough with blood|I'm not sure]" },
    skin: { text: "I understand you have a skin problem.\n\nWhat does it look like?", options: "[OPTION:Rash or redness|Itching|Swelling|Wound or sore|Other]" },
    default: { text: "Thank you for telling me. I want to understand better so I can help you.\n\nHow long have you been feeling this way?", options: "[OPTION:Just today|2-3 days|About a week|More than a week|I don't remember]" },
  },
  hi: {
    fever: { text: "मैं समझता हूँ कि आपको बुखार है। मैं कुछ सवाल पूछता हूँ।\n\nबुखार कितना है?", options: "[OPTION:हल्का - थोड़ा गर्म|मध्यम - काफी गर्म|तेज़ - बहुत गर्म|मुझे नहीं पता]" },
    pain: { text: "मैं समझता हूँ कि आपको दर्द है।\n\nदर्द कहाँ हो रहा है?", options: "[OPTION:सिर|पेट|सीना|पीठ|हाथ या पैर|कहीं और]" },
    stomach: { text: "मैं समझता हूँ कि पेट में तकलीफ है।\n\nपेट की तकलीफ कब से है?", options: "[OPTION:आज से|2-3 दिन से|एक हफ्ते से ज़्यादा|याद नहीं]" },
    default: { text: "बताने के लिए धन्यवाद। मैं बेहतर समझना चाहता हूँ।\n\nयह तकलीफ कब से है?", options: "[OPTION:आज से|2-3 दिन से|करीब एक हफ्ता|एक हफ्ते से ज़्यादा|याद नहीं]" },
  },
  ta: {
    fever: { text: "உங்களுக்கு காய்ச்சல் இருப்பது புரிகிறது. சில கேள்விகள் கேட்கிறேன்.\n\nகாய்ச்சல் எவ்வளவு இருக்கிறது?", options: "[OPTION:லேசான - கொஞ்சம் சூடு|நடுத்தரமான - நல்ல சூடு|அதிகமான - மிகவும் சூடு|தெரியாது]" },
    pain: { text: "உங்களுக்கு வலி இருப்பது புரிகிறது.\n\nவலி எங்கே இருக்கிறது?", options: "[OPTION:தலை|வயிறு|நெஞ்சு|முதுகு|கை அல்லது கால்|வேறு இடம்]" },
    default: { text: "சொன்னதற்கு நன்றி. நான் நன்றாக புரிந்துகொள்ள விரும்புகிறேன்.\n\nஇது எப்போதிலிருந்து இருக்கிறது?", options: "[OPTION:இன்று|2-3 நாட்கள்|ஒரு வாரம்|ஒரு வாரத்திற்கு மேல்|நினைவில்லை]" },
  }
};

const SEVERITY_RESPONSES = {
  en: {
    mild: "Based on what you've told me, your symptoms seem mild right now.\n\n[TRIAGE:green]\n\nHere's what I suggest:\n- Rest well and drink plenty of fluids\n- Watch if symptoms get worse\n- If you don't feel better in 2-3 days, please see a doctor\n\n[APPROACH:both]\n\nWould you like me to find a healthcare facility near you?",
    moderate: "Based on what you've told me, I think you should see a healthcare professional soon.\n\n[TRIAGE:orange]\n\nPlease try to visit a doctor within the next day or two. Don't ignore these symptoms.\n\n[APPROACH:modern]\n\nWould you like me to find a doctor or healthcare facility near you?",
    severe: "Based on what you've told me, your symptoms need urgent attention.\n\n[TRIAGE:red]\n\nPlease seek medical care as soon as possible. Don't wait.\n\n[APPROACH:emergency]\n\nWould you like me to find the nearest hospital with emergency services?",
  },
  hi: {
    mild: "आपने जो बताया उसके आधार पर, आपके लक्षण अभी हल्के लग रहे हैं।\n\n[TRIAGE:green]\n\nमेरा सुझाव है:\n- अच्छी तरह आराम करें और खूब पानी पिएं\n- अगर 2-3 दिन में बेहतर न हो, तो डॉक्टर को दिखाएं\n\n[APPROACH:both]\n\nक्या आप चाहते हैं कि मैं पास में स्वास्थ्य सेवा खोजूं?",
    moderate: "आपने जो बताया उसके आधार पर, जल्द डॉक्टर को दिखाना चाहिए।\n\n[TRIAGE:orange]\n\nकृपया 1-2 दिन में डॉक्टर से मिलें।\n\n[APPROACH:modern]\n\nक्या मैं पास में डॉक्टर खोजूं?",
    severe: "आपने जो बताया उसके आधार पर, तुरंत चिकित्सा सहायता ज़रूरी है।\n\n[TRIAGE:red]\n\nकृपया जल्द से जल्द अस्पताल जाएं।\n\n[APPROACH:emergency]",
  },
  ta: {
    mild: "நீங்கள் சொன்னதன் அடிப்படையில், உங்கள் அறிகுறிகள் தற்போது லேசாக தெரிகின்றன.\n\n[TRIAGE:green]\n\nஎனது ஆலோசனை:\n- நன்றாக ஓய்வெடுங்கள், நிறைய தண்ணீர் குடிக்கவும்\n- 2-3 நாட்களில் சரியாகவில்லை என்றால் மருத்துவரை பாருங்கள்\n\n[APPROACH:both]\n\nஅருகிலுள்ள சுகாதார வசதியை கண்டறிய விரும்புகிறீர்களா?",
    moderate: "நீங்கள் சொன்னதன் அடிப்படையில், விரைவில் மருத்துவரை பார்க்க வேண்டும்.\n\n[TRIAGE:orange]\n\n1-2 நாட்களுக்குள் மருத்துவரை சந்தியுங்கள்.\n\n[APPROACH:modern]",
    severe: "நீங்கள் சொன்னதன் அடிப்படையில், உடனடி மருத்துவ உதவி தேவை.\n\n[TRIAGE:red]\n\nஉடனடியாக மருத்துவமனைக்கு செல்லுங்கள்.\n\n[APPROACH:emergency]",
  }
};

function detectCategory(text) {
  const lower = text.toLowerCase();
  if (/fever|bukhar|बुखार|காய்ச்சல்|temperature|hot/.test(lower)) return 'fever';
  if (/pain|dard|दर्द|வலி|hurts|ache|aching/.test(lower)) return 'pain';
  if (/stomach|pet|पेट|வயிறு|belly|abdomen|vomit|diarr|ulti|उल्टी/.test(lower)) return 'stomach';
  if (/cough|khansi|खांसी|இருமல்|cold|sneez/.test(lower)) return 'cough';
  if (/skin|rash|itch|खुजली|அரிப்பு|swelling/.test(lower)) return 'skin';
  return 'default';
}

function detectEmergency(text, lang) {
  const lower = text.toLowerCase();
  const keywords = [...(EMERGENCY_KEYWORDS[lang] || []), ...EMERGENCY_KEYWORDS.en];
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

function detectSeverityFromHistory(messages) {
  const allText = messages.map(m => m.content).join(' ').toLowerCase();
  if (/severe|very bad|worst|can't move|blood|बहुत तेज़|மிகவும் மோசம|unbearable|getting worse/.test(allText)) return 'severe';
  if (/moderate|quite|somewhat|medium|not too bad|थोड़ा|நடுத்தரமான/.test(allText)) return 'moderate';
  return 'mild';
}

async function callLLM(messages, systemPrompt) {
  const apiKey = process.env.LLM_API_KEY;
  const apiUrl = process.env.LLM_API_URL || 'https://api.anthropic.com/v1/messages';
  const model = process.env.LLM_MODEL || 'claude-sonnet-5';

  if (apiKey && apiKey !== 'your-api-key-here') {
    try {
      const formattedMessages = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          system: systemPrompt,
          messages: formattedMessages,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) throw new Error(`LLM API error: ${response.status}`);

      const data = await response.json();
      return data.content?.[0]?.text || data.content;
    } catch (err) {
      console.error('LLM API call failed, using mock:', err.message);
    }
  }

  return null;
}

export async function startTriageSession(patientData, symptoms, language) {
  const systemPrompt = getSystemPrompt(language, patientData);
  const userMessage = { role: 'user', content: symptoms };

  const llmResponse = await callLLM([userMessage], systemPrompt);
  if (llmResponse) return { content: llmResponse, isEmergency: llmResponse.includes('[EMERGENCY]') };

  if (detectEmergency(symptoms, language)) {
    const emergencyMsgs = {
      en: "[EMERGENCY]\n\nYour symptoms sound very serious. Please go to the nearest hospital or call emergency services (112) right now.\n\nDo not wait. Get help immediately.",
      hi: "[EMERGENCY]\n\nआपके लक्षण बहुत गंभीर लग रहे हैं। कृपया अभी निकटतम अस्पताल जाएं या आपातकालीन सेवा (112) पर कॉल करें।\n\nइंतज़ार न करें। तुरंत मदद लें।",
      ta: "[EMERGENCY]\n\nஉங்கள் அறிகுறிகள் மிகவும் தீவிரமாக தெரிகின்றன. இப்போதே அருகிலுள்ள மருத்துவமனைக்கு செல்லுங்கள் அல்லது அவசர சேவையை (112) அழைக்கவும்.\n\nகாத்திருக்காதீர்கள். உடனடியாக உதவி பெறுங்கள்."
    };
    return { content: emergencyMsgs[language] || emergencyMsgs.en, isEmergency: true };
  }

  const category = detectCategory(symptoms);
  const langResponses = FOLLOW_UP_RESPONSES[language] || FOLLOW_UP_RESPONSES.en;
  const resp = langResponses[category] || langResponses.default;

  return { content: `${resp.text}\n\n${resp.options}`, isEmergency: false };
}

export async function continueTriageSession(sessionMessages, newMessage, patientData, language) {
  const systemPrompt = getSystemPrompt(language, patientData);
  const allMessages = [
    ...sessionMessages.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: newMessage },
  ];

  const llmResponse = await callLLM(allMessages, systemPrompt);
  if (llmResponse) return { content: llmResponse, isEmergency: llmResponse.includes('[EMERGENCY]') };

  if (detectEmergency(newMessage, language)) {
    const emergencyMsgs = {
      en: "[EMERGENCY]\n\nThis sounds very serious. Please seek emergency medical care immediately. Call 112 or go to the nearest hospital.",
      hi: "[EMERGENCY]\n\nयह बहुत गंभीर लगता है। कृपया तुरंत आपातकालीन चिकित्सा सहायता लें। 112 पर कॉल करें।",
      ta: "[EMERGENCY]\n\nஇது மிகவும் தீவிரமாக தெரிகிறது. உடனடியாக அவசர மருத்துவ உதவி பெறுங்கள். 112 அழைக்கவும்."
    };
    return { content: emergencyMsgs[language] || emergencyMsgs.en, isEmergency: true };
  }

  const messageCount = sessionMessages.filter(m => m.role === 'user').length;

  if (messageCount >= 3) {
    const severity = detectSeverityFromHistory([...sessionMessages, { role: 'user', content: newMessage }]);
    const langSeverity = SEVERITY_RESPONSES[language] || SEVERITY_RESPONSES.en;
    return { content: langSeverity[severity], isEmergency: false, triageComplete: true };
  }

  const secondaryQuestions = {
    en: [
      { text: "Are you also experiencing any of these?", options: "[OPTION:Fever|Nausea or vomiting|Tiredness|Loss of appetite|None of these]" },
      { text: "How bad would you say the problem is right now?", options: "[OPTION:Mild - I can manage|Moderate - it's bothering me|Severe - it's very bad|Getting worse]" },
      { text: "Have you tried anything for this at home?", options: "[OPTION:Yes, home remedies|Yes, took medicine|No, nothing yet|I'm not sure what to do]" },
    ],
    hi: [
      { text: "क्या आपको इनमें से कुछ और भी हो रहा है?", options: "[OPTION:बुखार|मतली या उल्टी|थकान|भूख न लगना|इनमें से कुछ नहीं]" },
      { text: "अभी तकलीफ कितनी है?", options: "[OPTION:हल्की - संभाल सकता हूँ|मध्यम - तकलीफ हो रही है|तेज़ - बहुत बुरी|बढ़ रही है]" },
      { text: "क्या आपने घर पर कुछ कोशिश की?", options: "[OPTION:हाँ, घरेलू उपाय|हाँ, दवाई ली|नहीं, कुछ नहीं|समझ नहीं आ रहा]" },
    ],
    ta: [
      { text: "இவற்றில் ஏதேனும் இருக்கிறதா?", options: "[OPTION:காய்ச்சல்|குமட்டல் அல்லது வாந்தி|சோர்வு|பசியின்மை|இவை எதுவும் இல்லை]" },
      { text: "இப்போது பிரச்சனை எவ்வளவு மோசமாக இருக்கிறது?", options: "[OPTION:லேசான - சமாளிக்க முடியும்|நடுத்தரமான - தொந்தரவாக இருக்கிறது|கடுமையான - மிகவும் மோசம்|மோசமாகி வருகிறது]" },
      { text: "இதற்கு வீட்டில் ஏதாவது முயற்சித்தீர்களா?", options: "[OPTION:ஆம், வீட்டு வைத்தியம்|ஆம், மருந்து எடுத்தேன்|இல்லை|என்ன செய்வது என்று தெரியவில்லை]" },
    ]
  };

  const langQuestions = secondaryQuestions[language] || secondaryQuestions.en;
  const qIndex = Math.min(messageCount, langQuestions.length - 1);
  const q = langQuestions[qIndex];

  return { content: `${q.text}\n\n${q.options}`, isEmergency: false };
}

export async function generateTriageSummary(sessionMessages, patientData) {
  const allText = sessionMessages.map(m => m.content).join(' ');
  const severity = detectSeverityFromHistory(sessionMessages);
  const isEmergency = detectEmergency(allText, 'en');

  let triageLevel = 'green';
  if (isEmergency) triageLevel = 'red';
  else if (severity === 'severe') triageLevel = 'red';
  else if (severity === 'moderate') triageLevel = 'orange';

  const userMessages = sessionMessages.filter(m => m.role === 'user').map(m => m.content).join('. ');

  return {
    triage_level: triageLevel,
    ai_summary: `Patient reported: ${userMessages.substring(0, 200)}. Assessment: ${severity} severity.`,
    recommended_action: triageLevel === 'red' ? 'Seek emergency medical care immediately' :
      triageLevel === 'orange' ? 'Visit a healthcare professional within 24-48 hours' :
      'Monitor symptoms. Visit doctor if symptoms persist or worsen.',
    approach: isEmergency ? 'emergency' : (severity === 'mild' ? 'both' : 'modern'),
  };
}
