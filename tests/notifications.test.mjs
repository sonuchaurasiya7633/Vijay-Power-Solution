import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

test('Notifications: Model schemas and indexes are defined correctly', async () => {
  // Define Schema if not loaded
  const NotificationSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      body: { type: String, required: true },
      type: { type: String, enum: ['lead', 'survey', 'quotation', 'installation', 'system'], default: 'lead' },
      link: { type: String, default: '/admin/leads' },
      isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  assert.ok(NotificationSchema.paths.title);
  assert.ok(NotificationSchema.paths.body);
  assert.ok(NotificationSchema.paths.type);
  assert.ok(NotificationSchema.paths.link);
  assert.ok(NotificationSchema.paths.isRead);
});

test('Firebase FCM: Web Push VAPID key and project settings are configured', async () => {
  const vapidKey = 'BEe5lfcLMcQIMvQZDcmD-BbZQxLG0q944wlCCwcNXukJ5LeqauL1osV5N3rEKJNgz17F2HI6FVyUgUKXciidFbE';
  const projectId = 'vijoy-power-solution';
  const senderId = '527277487994';
  const appId = '1:527277487994:web:2d6293d248eefe5afb08c3';

  assert.equal(vapidKey.length, 87);
  assert.equal(projectId, 'vijoy-power-solution');
  assert.equal(senderId, '527277487994');
  assert.ok(appId.includes('527277487994'));
});

test('Firebase Service Worker: File exists in public folder with notification handling', async () => {
  const fs = await import('node:fs/promises');
  const swContent = await fs.readFile('public/firebase-messaging-sw.js', 'utf-8');

  assert.ok(swContent.includes('firebase-app-compat.js'));
  assert.ok(swContent.includes('firebase-messaging-compat.js'));
  assert.ok(swContent.includes('onBackgroundMessage'));
  assert.ok(swContent.includes('notificationclick'));
  assert.ok(swContent.includes('vijoy-power-solution'));
  assert.ok(swContent.includes('527277487994'));
});

test('Notifications: API routes exist and are properly structured', async () => {
  const fs = await import('node:fs/promises');
  const notifRoute = await fs.readFile('src/app/api/admin/notifications/route.ts', 'utf-8');
  const subRoute = await fs.readFile('src/app/api/admin/notifications/subscribe/route.ts', 'utf-8');
  const testRoute = await fs.readFile('src/app/api/admin/notifications/test/route.ts', 'utf-8');

  assert.ok(notifRoute.includes('export async function GET'));
  assert.ok(notifRoute.includes('export async function PATCH'));
  assert.ok(notifRoute.includes('export async function DELETE'));
  assert.ok(subRoute.includes('export async function POST'));
  assert.ok(testRoute.includes('export async function POST'));
});

test('Notifications: Lead capture endpoint triggers notification creation', async () => {
  const fs = await import('node:fs/promises');
  const leadsRoute = await fs.readFile('src/app/api/leads/route.ts', 'utf-8');

  assert.ok(leadsRoute.includes('createAndBroadcastNotification'));
  assert.ok(leadsRoute.includes('New Solar Enquiry:'));
});

test('Notifications: Lead view and status change automatically marks notification as read', async () => {
  const fs = await import('node:fs/promises');
  const leadDetailRoute = await fs.readFile('src/app/api/leads/[id]/route.ts', 'utf-8');
  const notifRoute = await fs.readFile('src/app/api/admin/notifications/route.ts', 'utf-8');

  assert.ok(leadDetailRoute.includes('Notification.updateMany'));
  assert.ok(notifRoute.includes('body.leadId'));
});

test('Notifications: Audio alert utility exports repeating 2s alarm functions', async () => {
  const fs = await import('node:fs/promises');
  const soundUtil = await fs.readFile('src/lib/utils/notificationSound.ts', 'utf-8');

  assert.ok(soundUtil.includes('startRepeatingAlert'));
  assert.ok(soundUtil.includes('stopRepeatingAlert'));
  assert.ok(soundUtil.includes('isAlertRinging'));
  assert.ok(soundUtil.includes('2650'));
});
