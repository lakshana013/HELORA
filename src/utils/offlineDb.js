import Dexie from 'dexie';

const db = new Dexie('HealoraOffline');

db.version(1).stores({
  users: 'id, email, phone, role',
  patients: 'id, user_id',
  doctors: 'id, user_id',
  symptomSessions: 'id, patient_id, timestamp, syncStatus',
  sessionMessages: 'id, session_id, timestamp',
  healthHistory: 'id, patient_id, date, syncStatus',
  healthCamps: 'id, doctor_id, date, status, syncStatus',
  campRegistrations: 'id, camp_id, patient_id, syncStatus',
  doctorNotes: 'id, doctor_id, patient_id, syncStatus',
  referrals: 'id, patient_id, syncStatus',
  medicines: 'id, name, category',
  ayurvedaHerbs: 'id, name',
  healthFacilities: 'id, name, type',
  syncQueue: '++localId, entity, entityId, action, status, createdAt',
  emergencyContacts: 'id, patient_id',
  cacheMeta: 'key',
});

export default db;

export async function cacheServerData(table, data) {
  if (!data || !Array.isArray(data) || !db[table]) return;
  try {
    await db[table].bulkPut(data);
    await db.cacheMeta.put({ key: table, cachedAt: new Date().toISOString() });
  } catch (e) {
    console.warn(`Failed to cache ${table}:`, e);
  }
}

export async function getCachedData(table) {
  try {
    return await db[table].toArray();
  } catch {
    return [];
  }
}

export async function getCacheTimestamp(table) {
  try {
    const meta = await db.cacheMeta.get(table);
    return meta?.cachedAt || null;
  } catch {
    return null;
  }
}

export async function clearAllData() {
  await Promise.all(db.tables.map(t => t.clear()));
}
