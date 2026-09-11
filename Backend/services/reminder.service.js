import cron from 'node-cron';
import { MedicationReminderModel as MedicationReminder } from '../models/MedicationReminderModel.js';
import { getIO } from '../socket.js';

// Stub: logs only. Swap for nodemailer when SMTP creds exist.
export const sendEmailStub = async (userId, subject, text) => {
  console.log(`[email-stub] to user:${userId} | ${subject} | ${text}`);
};

// Fires once per reminder per day when its HH:MM arrives.
// ponytail: in-process cron; split to a worker if this ever runs multi-instance (double-fire)
export const startReminders = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const dayStart = new Date(now);
      dayStart.setHours(0, 0, 0, 0);
      const due = await MedicationReminder.find({
        isActive: true, reminderTime: hhmm,
        $or: [{ lastFiredAt: null }, { lastFiredAt: { $lt: dayStart } }],
      }).lean();
      for (const r of due) {
        const text = `Time for ${r.medicineName}${r.dosage ? ` (${r.dosage})` : ""}`;
        try {
          getIO().to(`user:${String(r.userId)}`).emit("reminder:due", { ...r, text });
        } catch { /* socket not initialized in tests; email stub still runs */ }
        await sendEmailStub(String(r.userId), 'Medication reminder', text);
        await MedicationReminder.updateOne({ _id: r._id }, { lastFiredAt: now });
      }
    } catch (err) {
      console.error('[reminders]', err.message);
    }
  });
};
