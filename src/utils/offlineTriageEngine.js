import { EMERGENCY_SIGNS, SYMPTOM_CATEGORIES } from './offlineMedicalDb.js';

export default class OfflineTriageEngine {
  constructor(language = 'en') {
    this.lang = ['en', 'hi', 'ta'].includes(language) ? language : 'en';
    this.messages = [];
    this.primaryCategory = null;
    this.followUpIndex = 0;
    this.severityScore = 0;
    this.isComplete = false;
    this.isEmergency = false;
    this.initialSymptoms = '';
  }

  t(obj) {
    return obj[this.lang] || obj.en;
  }

  processInput(text) {
    if (!text || !text.trim()) {
      const msg = this.t({
        en: 'Please describe what you are feeling. You can say things like "I have a headache" or "my stomach hurts".',
        hi: 'कृपया बताएं कि आपको क्या तकलीफ है। जैसे "मुझे सिरदर्द है" या "मेरे पेट में दर्द है"।',
        ta: 'நீங்கள் என்ன உணர்கிறீர்கள் என்று சொல்லுங்கள். "எனக்கு தலைவலி" அல்லது "வயிறு வலிக்கிறது" என்று சொல்லலாம்.',
      });
      return this._makeResponse(msg);
    }

    const cleaned = text.trim();
    this.messages.push({ role: 'user', content: cleaned });

    if (this.messages.filter(m => m.role === 'user').length === 1) {
      this.initialSymptoms = cleaned;
      return this._handleInitial(cleaned);
    }

    return this._handleFollowUp(cleaned);
  }

  _handleInitial(text) {
    const lower = text.toLowerCase();

    const emergency = this._detectEmergency(lower);
    if (emergency) {
      this.isEmergency = true;
      this.isComplete = true;
      const action = this.t(emergency.action);
      const msg = this.t({
        en: `[EMERGENCY]\n\n**Emergency detected. Please seek immediate help.**\n\n${action}\n\n**Call emergency services: 112**\n\n[TRIAGE:red]`,
        hi: `[EMERGENCY]\n\n**आपातकाल। तुरंत मदद लें।**\n\n${action}\n\n**आपातकालीन सेवा कॉल करें: 112**\n\n[TRIAGE:red]`,
        ta: `[EMERGENCY]\n\n**அவசரநிலை. உடனடி உதவி பெறுங்கள்.**\n\n${action}\n\n**அவசர சேவையை அழைக்கவும்: 112**\n\n[TRIAGE:red]`,
      });
      return this._makeResponse(msg, true);
    }

    this.primaryCategory = this._findCategory(lower);

    if (!this.primaryCategory) {
      const msg = this.t({
        en: 'I understand you are not feeling well. Can you tell me more about your main symptom?\n\n[OPTION:I have pain]\n[OPTION:I have fever]\n[OPTION:I have a cough or cold]\n[OPTION:My stomach hurts]',
        hi: 'मैं समझता हूं कि आपकी तबीयत ठीक नहीं है। अपने मुख्य लक्षण के बारे में बताएं?\n\n[OPTION:मुझे दर्द है]\n[OPTION:मुझे बुखार है]\n[OPTION:मुझे खांसी या सर्दी है]\n[OPTION:मेरे पेट में दर्द है]',
        ta: 'நீங்கள் நலமில்லை என்பதை புரிந்துகொள்கிறேன். உங்கள் முக்கிய அறிகுறியைப் பற்றி சொல்லுங்கள்?\n\n[OPTION:எனக்கு வலி உள்ளது]\n[OPTION:எனக்கு காய்ச்சல்]\n[OPTION:எனக்கு இருமல் அல்லது சளி]\n[OPTION:எனக்கு வயிற்று வலி]',
      });
      return this._makeResponse(msg);
    }

    return this._askNextFollowUp();
  }

  _handleFollowUp(text) {
    const lower = text.toLowerCase();

    const emergency = this._detectEmergency(lower);
    if (emergency) {
      this.isEmergency = true;
      this.isComplete = true;
      const action = this.t(emergency.action);
      const msg = `[EMERGENCY]\n\n${action}\n\n**Call 112**\n\n[TRIAGE:red]`;
      return this._makeResponse(msg, true);
    }

    if (!this.primaryCategory) {
      this.primaryCategory = this._findCategory(lower);
      if (!this.primaryCategory) {
        this.primaryCategory = SYMPTOM_CATEGORIES[0];
      }
      this.followUpIndex = 0;
      return this._askNextFollowUp();
    }

    const currentFollowUp = this.primaryCategory.followUps[this.followUpIndex];
    if (currentFollowUp) {
      const matched = this._matchOption(lower, currentFollowUp.options);
      this.severityScore += matched ? matched.score : 1;
    }

    this.followUpIndex++;

    if (this.followUpIndex >= this.primaryCategory.followUps.length) {
      return this._generateAssessment();
    }

    return this._askNextFollowUp();
  }

  _askNextFollowUp() {
    const cat = this.primaryCategory;
    const fu = cat.followUps[this.followUpIndex];
    if (!fu) return this._generateAssessment();

    const question = this.t(fu.question);
    const options = fu.options.map(o => `[OPTION:${this.t(o.text)}]`).join('\n');

    const prefix = this.followUpIndex === 0
      ? this.t({
          en: `I understand you may have symptoms related to **${this.t(cat.name)}**. Let me ask a few questions to better understand.\n\n`,
          hi: `मैं समझता हूं कि आपको **${this.t(cat.name)}** से जुड़े लक्षण हो सकते हैं। कुछ सवाल पूछता हूं।\n\n`,
          ta: `**${this.t(cat.name)}** தொடர்பான அறிகுறிகள் இருக்கலாம் என்று புரிகிறது. சில கேள்விகள் கேட்கிறேன்.\n\n`,
        })
      : '';

    return this._makeResponse(`${prefix}${question}\n\n${options}`);
  }

  _generateAssessment() {
    this.isComplete = true;
    const cat = this.primaryCategory;
    let level, guidanceKey;

    if (this.severityScore <= 3) {
      level = 'green';
      guidanceKey = 'low';
    } else if (this.severityScore <= 7) {
      level = 'orange';
      guidanceKey = 'medium';
    } else {
      level = 'red';
      guidanceKey = 'high';
    }

    const guidance = this.t(cat.guidance[guidanceKey]);
    const categoryName = this.t(cat.name);
    const disclaimer = this.t({
      en: '**Note:** This is AI-generated guidance from an offline assessment. It is not a medical diagnosis. Please consult a healthcare professional for proper evaluation.',
      hi: '**नोट:** यह ऑफलाइन AI मार्गदर्शन है, चिकित्सा निदान नहीं। कृपया उचित जांच के लिए डॉक्टर से मिलें।',
      ta: '**குறிப்பு:** இது ஆஃப்லைன் AI வழிகாட்டுதல், மருத்துவ நோய் கண்டறிதல் அல்ல. சரியான மதிப்பீட்டிற்கு மருத்துவரை அணுகுங்கள்.',
    });

    const levelLabel = this.t({
      en: level === 'green' ? 'Low Urgency' : level === 'orange' ? 'Urgent - See a Doctor' : 'Emergency',
      hi: level === 'green' ? 'कम गंभीर' : level === 'orange' ? 'जरूरी - डॉक्टर से मिलें' : 'आपातकाल',
      ta: level === 'green' ? 'குறைந்த அவசரம்' : level === 'orange' ? 'அவசரம் - மருத்துவரை அணுகுங்கள்' : 'அவசரநிலை',
    });

    const msg = `**${this.t({ en: 'Assessment', hi: 'मूल्यांकन', ta: 'மதிப்பீடு' })} - ${categoryName}**\n\n` +
      `**${this.t({ en: 'Urgency', hi: 'गंभीरता', ta: 'அவசரம்' })}: ${levelLabel}**\n\n` +
      `${guidance}\n\n` +
      `${disclaimer}\n\n` +
      `[TRIAGE:${level}]\n[APPROACH:${level === 'green' ? 'both' : 'modern'}]`;

    return this._makeResponse(msg);
  }

  _detectEmergency(text) {
    for (const sign of EMERGENCY_SIGNS) {
      for (const lang of ['en', 'hi', 'ta']) {
        for (const kw of sign.keywords[lang]) {
          if (text.includes(kw.toLowerCase())) {
            return sign;
          }
        }
      }
    }
    return null;
  }

  _findCategory(text) {
    let best = null, bestCount = 0;
    for (const cat of SYMPTOM_CATEGORIES) {
      let count = 0;
      for (const lang of ['en', 'hi', 'ta']) {
        for (const kw of cat.keywords[lang]) {
          if (text.includes(kw.toLowerCase())) count++;
        }
      }
      if (count > bestCount) {
        bestCount = count;
        best = cat;
      }
    }
    return best;
  }

  _matchOption(text, options) {
    let best = null, bestLen = 0;
    for (const opt of options) {
      for (const lang of ['en', 'hi', 'ta']) {
        const optText = (opt.text[lang] || '').toLowerCase();
        if (text.includes(optText) && optText.length > bestLen) {
          best = opt;
          bestLen = optText.length;
        }
      }
    }
    if (!best) {
      for (const opt of options) {
        for (const lang of ['en', 'hi', 'ta']) {
          const words = (opt.text[lang] || '').toLowerCase().split(/\s+/);
          for (const w of words) {
            if (w.length > 3 && text.includes(w)) return opt;
          }
        }
      }
    }
    return best;
  }

  _makeResponse(content, isEmergency = false) {
    this.messages.push({ role: 'assistant', content });
    return {
      content,
      isEmergency: isEmergency || this.isEmergency,
      triageComplete: this.isComplete,
    };
  }

  getResult() {
    if (!this.isComplete || !this.primaryCategory) return null;
    let level;
    if (this.isEmergency) level = 'red';
    else if (this.severityScore <= 3) level = 'green';
    else if (this.severityScore <= 7) level = 'orange';
    else level = 'red';

    return {
      triage_level: level,
      ai_summary: `${this.t(this.primaryCategory.name)}: ${this.initialSymptoms}`,
      recommended_action: this.t(this.primaryCategory.guidance[level === 'green' ? 'low' : level === 'orange' ? 'medium' : 'high']),
      approach: level === 'green' ? 'both' : 'modern',
      _offline: true,
    };
  }
}
