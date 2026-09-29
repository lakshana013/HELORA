import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'healora.db');

let db = null;

function saveDb() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  }
}

export async function initializeDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE, phone TEXT UNIQUE, password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('patient', 'doctor')), name TEXT NOT NULL,
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK(preferred_language IN ('en', 'hi', 'ta')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE, age INTEGER, gender TEXT,
    emergency_contact TEXT, location_lat REAL, location_lng REAL, medical_history TEXT,
    allergies TEXT, current_medicines TEXT, pregnancy_status TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE, specialization TEXT,
    hospital_clinic TEXT, medical_registration_id TEXT, verified INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS symptom_sessions (
    id TEXT PRIMARY KEY, patient_id TEXT NOT NULL, timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    language TEXT NOT NULL DEFAULT 'en', symptoms_text TEXT, voice_transcript TEXT,
    triage_level TEXT CHECK(triage_level IN ('green', 'orange', 'red', NULL)),
    ai_summary TEXT, recommended_action TEXT, recommended_facility TEXT,
    doctor_review_status TEXT NOT NULL DEFAULT 'pending' CHECK(doctor_review_status IN ('pending', 'reviewed', 'referred')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed')),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS session_messages (
    id TEXT PRIMARY KEY, session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL, message_type TEXT NOT NULL DEFAULT 'text' CHECK(message_type IN ('text', 'voice', 'options')),
    options_json TEXT, timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES symptom_sessions(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS health_history (
    id TEXT PRIMARY KEY, patient_id TEXT NOT NULL, session_id TEXT,
    date TEXT NOT NULL DEFAULT (date('now')), main_symptoms TEXT, triage_level TEXT,
    facility_name TEXT, doctor_name TEXT, notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS medicines (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, name_hi TEXT, name_ta TEXT,
    common_use TEXT, common_use_hi TEXT, common_use_ta TEXT,
    precautions TEXT, precautions_hi TEXT, precautions_ta TEXT, category TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ayurveda_herbs (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, name_hi TEXT, name_ta TEXT,
    traditional_use TEXT, traditional_use_hi TEXT, traditional_use_ta TEXT,
    explanation TEXT, explanation_hi TEXT, explanation_ta TEXT,
    safety_info TEXT, safety_info_hi TEXT, safety_info_ta TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS health_facilities (
    id TEXT PRIMARY KEY, name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('hospital', 'phc', 'chc', 'clinic', 'ayush', 'emergency')),
    lat REAL NOT NULL, lng REAL NOT NULL, address TEXT, phone TEXT,
    emergency_available INTEGER NOT NULL DEFAULT 0, opening_hours TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS health_camps (
    id TEXT PRIMARY KEY, doctor_id TEXT NOT NULL, name TEXT NOT NULL,
    village_area TEXT, date TEXT NOT NULL, time TEXT, location_address TEXT,
    lat REAL, lng REAL, services TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK(status IN ('planned', 'ongoing', 'completed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS camp_registrations (
    id TEXT PRIMARY KEY, camp_id TEXT NOT NULL, patient_id TEXT NOT NULL,
    registered_at TEXT NOT NULL DEFAULT (datetime('now')),
    consultation_status TEXT NOT NULL DEFAULT 'registered' CHECK(consultation_status IN ('registered', 'waiting', 'in_progress', 'completed')),
    doctor_notes TEXT, referral_needed INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (camp_id) REFERENCES health_camps(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS doctor_notes (
    id TEXT PRIMARY KEY, doctor_id TEXT NOT NULL, patient_id TEXT NOT NULL,
    session_id TEXT, camp_id TEXT, notes TEXT, observations TEXT, referral TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY, from_doctor_id TEXT NOT NULL, patient_id TEXT NOT NULL,
    session_id TEXT, to_facility TEXT, to_specialization TEXT, reason TEXT,
    urgency TEXT, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'completed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS emergency_contacts (
    id TEXT PRIMARY KEY, patient_id TEXT NOT NULL, name TEXT NOT NULL,
    phone TEXT NOT NULL, relationship TEXT
  )`);

  seedData();
  saveDb();
}

function seedData() {
  const res = db.exec("SELECT COUNT(*) AS cnt FROM users");
  if (res.length > 0 && res[0].values[0][0] > 0) return;

  const patientUserId = uuidv4();
  const doctorUserId = uuidv4();
  const patientId = uuidv4();
  const doctorId = uuidv4();
  const patientHash = bcrypt.hashSync('patient123', 10);
  const doctorHash = bcrypt.hashSync('doctor123', 10);

  db.run(`INSERT INTO users (id, email, phone, password_hash, role, name, preferred_language) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [patientUserId, 'patient@healora.com', '9876543210', patientHash, 'patient', 'Lakshmi Devi', 'en']);
  db.run(`INSERT INTO users (id, email, phone, password_hash, role, name, preferred_language) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [doctorUserId, 'doctor@healora.com', '9876543211', doctorHash, 'doctor', 'Dr. Rajesh Kumar', 'en']);
  db.run(`INSERT INTO patients (id, user_id, age, gender, emergency_contact, location_lat, location_lng, medical_history, allergies, current_medicines, pregnancy_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [patientId, patientUserId, 35, 'female', '9876543299', 13.0827, 80.2707, 'No major illnesses', 'None known', 'None', 'no']);
  db.run(`INSERT INTO doctors (id, user_id, specialization, hospital_clinic, medical_registration_id, verified) VALUES (?, ?, ?, ?, ?, ?)`,
    [doctorId, doctorUserId, 'General Medicine', 'Chennai Government Hospital', 'TN-MED-2024-1234', 1]);

  const medicines = [
    ['Paracetamol','पैरासिटामोल','பாரசிட்டமால்','Fever and mild pain relief','बुखार और हल्के दर्द से राहत','காய்ச்சல் மற்றும் லேசான வலி நிவாரணம்','Do not exceed 4g per day. Avoid with liver disease.','प्रतिदिन 4 ग्राम से अधिक न लें।','நாளொன்றுக்கு 4 கிராமுக்கு மேல் எடுக்க வேண்டாம்.','Pain Relief'],
    ['Ibuprofen','इबुप्रोफेन','இபுப்ரோஃபன்','Pain, inflammation, and fever','दर्द, सूजन और बुखार','வலி, வீக்கம் மற்றும் காய்ச்சல்','Take with food. Avoid if you have stomach ulcers.','खाने के साथ लें।','உணவுடன் எடுக்கவும்.','Pain Relief'],
    ['Aspirin','एस्पिरिन','ஆஸ்பிரின்','Pain relief, blood thinning, heart protection','दर्द से राहत, खून पतला करना','வலி நிவாரணம், இரத்தம் மெலிதல்','Not for children under 16.','16 साल से कम उम्र के बच्चों को न दें।','16 வயதுக்குட்பட்ட குழந்தைகளுக்கு கொடுக்க வேண்டாம்.','Pain Relief'],
    ['Amoxicillin','एमोक्सिसिलिन','அமாக்ஸிசிலின்','Bacterial infections','बैक्टीरिया संक्रमण','பாக்டீரியா தொற்றுகள்','Complete full course.','पूरा कोर्स करें।','முழு கோர்சையும் முடிக்கவும்.','Antibiotic'],
    ['Cetirizine','सिट्रिज़ीन','செட்டிரிசின்','Allergies, runny nose, sneezing','एलर्जी, बहती नाक, छींक','ஒவ்வாமை, மூக்கு ஒழுகுதல், தும்மல்','May cause drowsiness.','नींद आ सकती है।','தூக்கம் வரலாம்.','Antihistamine'],
    ['Omeprazole','ओमेप्राज़ोल','ஓமெப்ராசோல்','Acidity, heartburn, stomach ulcers','एसिडिटी, सीने में जलन','அமிலத்தன்மை, நெஞ்செரிச்சல்','Take before meals.','खाने से पहले लें।','உணவுக்கு முன் எடுக்கவும்.','Antacid'],
    ['Metformin','मेटफॉर्मिन','மெட்ஃபார்மின்','Type 2 diabetes blood sugar control','टाइप 2 डायबिटीज','வகை 2 நீரிழிவு கட்டுப்பாடு','Take with meals. Monitor blood sugar.','खाने के साथ लें।','உணவுடன் எடுக்கவும்.','Diabetes'],
    ['Amlodipine','एम्लोडिपिन','அம்லோடிபின்','High blood pressure','उच्च रक्तचाप','உயர் இரத்த அழுத்தம்','Take regularly. Do not stop suddenly.','रोज़ एक ही समय पर लें।','தினமும் ஒரே நேரத்தில் எடுக்கவும்.','Blood Pressure'],
    ['ORS','ओआरएस','ORS','Dehydration from diarrhea, vomiting','दस्त, उल्टी से पानी की कमी','வயிற்றுப்போக்கால் நீர்ச்சத்து இழப்பு','Mix one sachet in 1 litre clean water.','एक पैकेट को 1 लीटर पानी में मिलाएं।','ஒரு பொட்டலத்தை 1 லிட்டர் நீரில் கலக்கவும்.','Rehydration'],
    ['Naproxen','नेप्रोक्सन','நாப்ராக்சன்','Joint pain, muscle pain','जोड़ों का दर्द, मांसपेशियों का दर्द','மூட்டு வலி, தசை வலி','Take with food.','खाने के साथ लें।','உணவுடன் எடுக்கவும்.','Pain Relief'],
  ];
  for (const m of medicines) {
    db.run(`INSERT INTO medicines (id,name,name_hi,name_ta,common_use,common_use_hi,common_use_ta,precautions,precautions_hi,precautions_ta,category) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), ...m]);
  }

  const herbs = [
    ['Ashwagandha','अश्वगंधा','அஸ்வகந்தா','Stress relief, strength building','तनाव से राहत, ताकत बढ़ाना','மன அழுத்த நிவாரணம்','Adaptogenic herb for stress management','तनाव प्रबंधन के लिए एडाप्टोजेनिक जड़ी-बूटी','மன அழுத்தத்தை சமாளிக்க உதவும் மூலிகை','Avoid during pregnancy.','गर्भावस्था में न लें।','கர்ப்ப காலத்தில் தவிர்க்கவும்.'],
    ['Turmeric','हल्दी','மஞ்சள்','Anti-inflammatory, immunity','सूजन कम करना, प्रतिरक्षा','அழற்சி எதிர்ப்பு, நோய் எதிர்ப்பு','Contains curcumin with anti-inflammatory properties','करक्यूमिन होता है जो सूजन कम करता है','குர்குமின் உள்ளடக்கியது','Safe in food amounts.','खाने की मात्रा में सुरक्षित।','உணவு அளவில் பாதுகாப்பானது.'],
    ['Brahmi','ब्राह्मी','பிரம்மி','Memory, concentration','स्मरणशक्ति, एकाग्रता','நினைவாற்றல், கவனம்','Brain tonic for cognitive function','मस्तिष्क टॉनिक','அறிவாற்றல் மூளை டானிக்','Generally safe.','आमतौर पर सुरक्षित।','பொதுவாக பாதுகாப்பானது.'],
    ['Triphala','त्रिफला','திரிபலா','Digestion, detoxification','पाचन, विषहरण','செரிமானம், நச்சு நீக்கம்','Three fruit combination for digestive health','तीन फलों का मिश्रण','மூன்று பழங்களின் கலவை','Avoid during pregnancy.','गर्भावस्था में न लें।','கர்ப்ப காலத்தில் தவிர்க்கவும்.'],
    ['Amla','आंवला','நெல்லிக்காய்','Immunity, vitamin C','प्रतिरक्षा, विटामिन सी','நோய் எதிர்ப்பு, வைட்டமின் சி','Richest natural vitamin C source','विटामिन सी का सबसे समृद्ध स्रोत','வைட்டமின் சி இன் மிகச்சிறந்த மூலம்','Safe for most people.','अधिकांश लोगों के लिए सुरक्षित।','பெரும்பாலான மக்களுக்கு பாதுகாப்பானது.'],
    ['Ginger','अदरक','இஞ்சி','Nausea, digestion, cold','मतली, पाचन, सर्दी','குமட்டல், செரிமானம், சளி','Warming spice for digestion','गर्म मसाला जो पाचन में सहायता करता है','செரிமானத்திற்கு உதவும் மசாலா','Safe in normal amounts.','सामान्य मात्रा में सुरक्षित।','சாதாரண அளவில் பாதுகாப்பானது.'],
    ['Fenugreek','मेथी','வெந்தயம்','Blood sugar control, lactation','ब्लड शुगर नियंत्रण','இரத்த சர்க்கரை கட்டுப்பாடு','May help regulate blood sugar','ब्लड शुगर नियंत्रण में सहायक','இரத்த சர்க்கரையை ஒழுங்குபடுத்த உதவலாம்','May lower blood sugar.','ब्लड शुगर कम कर सकती है।','இரத்த சர்க்கரையை குறைக்கலாம்.'],
    ['Bhringaraj','भृंगराज','கரிசலாங்கண்ணி','Hair health, liver support','बालों का स्वास्थ्य, लिवर सहायता','முடி ஆரோக்கியம், கல்லீரல் ஆதரவு','King of hair in Ayurveda','आयुर्वेद में बालों का राजा','ஆயுர்வேதத்தில் முடியின் அரசன்','Generally safe.','आमतौर पर सुरक्षित।','பொதுவாக பாதுகாப்பானது.'],
    ['Cumin','जीरा','சீரகம்','Digestion, bloating','पाचन, पेट फूलना','செரிமானம், வீக்கம்','Aids digestion, jeera water remedy','जीरा पानी पाचन में सहायक','சீரக தண்ணீர் செரிமானத்திற்கு உதவுகிறது','Very safe as spice.','मसाले के रूप में सुरक्षित।','மசாலாவாக பாதுகாப்பானது.'],
    ['Boswellia','शल्लकी','போஸ்வெல்லியா','Joint pain, arthritis','जोड़ों का दर्द, गठिया','மூட்டு வலி, மூட்டுவாதம்','Anti-inflammatory resin herb','सूजन-रोधी राल जड़ी-बूटी','அழற்சி எதிர்ப்பு பிசின் மூலிகை','Generally safe.','आमतौर पर सुरक्षित।','பொதுவாக பாதுகாப்பானது.'],
  ];
  for (const h of herbs) {
    db.run(`INSERT INTO ayurveda_herbs (id,name,name_hi,name_ta,traditional_use,traditional_use_hi,traditional_use_ta,explanation,explanation_hi,explanation_ta,safety_info,safety_info_hi,safety_info_ta) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), ...h]);
  }

  const facilities = [
    ['Chennai Government General Hospital','hospital',13.079,80.275,'Park Town, Chennai','044-25305000',1,'24/7'],
    ['Royapuram PHC','phc',13.105,80.294,'Royapuram, Chennai','044-25951234',0,'Mon-Sat 8AM-4PM'],
    ['Tiruvottiyur CHC','chc',13.16,80.30,'Tiruvottiyur, Chennai','044-25731456',1,'Mon-Sat 8AM-8PM'],
    ['Siddha Clinic Mylapore','ayush',13.034,80.269,'Mylapore, Chennai','044-24640987',0,'Mon-Sat 9AM-5PM'],
    ['Apollo Clinic Adyar','clinic',13.006,80.257,'Adyar, Chennai','044-24410025',0,'Mon-Sun 8AM-10PM'],
    ['Tambaram Government Hospital','hospital',12.925,80.10,'Tambaram, Chennai','044-22261123',1,'24/7'],
    ['Avadi AYUSH Centre','ayush',13.107,80.097,'Avadi, Chennai','044-26551789',0,'Mon-Fri 9AM-4PM'],
    ['Poonamallee PHC','phc',13.047,80.099,'Poonamallee, Chennai','044-26271100',0,'Mon-Sat 8AM-4PM'],
    ['SRMC Emergency Centre','emergency',12.99,80.227,'Porur, Chennai','044-24768027',1,'24/7'],
  ];
  for (const f of facilities) {
    db.run(`INSERT INTO health_facilities (id,name,type,lat,lng,address,phone,emergency_available,opening_hours) VALUES (?,?,?,?,?,?,?,?,?)`,
      [uuidv4(), ...f]);
  }

  console.log('Database seeded successfully.');
}

function getDb() {
  return db;
}

const dbProxy = {
  prepare(sql) {
    return {
      run(...params) {
        db.run(sql, params);
        saveDb();
      },
      get(...params) {
        const stmt = db.prepare(sql);
        if (params.length) stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const results = [];
        const stmt = db.prepare(sql);
        if (params.length) stmt.bind(params);
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },
    };
  },
  exec(sql) {
    db.run(sql);
    saveDb();
  },
};

export default dbProxy;
