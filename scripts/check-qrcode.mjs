import assert from 'node:assert/strict';
import {
  buildQrPayload,
  buildVCard,
  buildWifi,
  escapeVCard,
  normalizeWebUrl,
} from '../src/js/tools/qrcode-data.js';

assert.equal(normalizeWebUrl('example.com'), 'https://example.com/');
assert.equal(normalizeWebUrl('http://example.com/path'), 'http://example.com/path');
assert.equal(normalizeWebUrl('example.com:8080/path'), 'https://example.com:8080/path');
assert.equal(normalizeWebUrl('localhost:3000'), 'https://localhost:3000/');
assert.throws(() => normalizeWebUrl('javascript:alert(1)'), /HTTP or HTTPS/);
assert.throws(() => normalizeWebUrl('mailto:test@example.com'), /HTTP or HTTPS/);

assert.equal(escapeVCard('One, Two; Three\nFour'), 'One\\, Two\\; Three\\nFour');

const contact = buildVCard({
  name: 'Ahmed, Wahballah',
  phone: '+20 100 000 0000',
  email: 'hello@example.com',
  website: 'example.com',
  note: 'Learning; building',
});
assert.match(contact, /^BEGIN:VCARD\r\nVERSION:3\.0\r\n/);
assert.match(contact, /FN:Ahmed\\, Wahballah/);
assert.match(contact, /N:;Ahmed\\, Wahballah;;;/);
assert.match(contact, /TEL;TYPE=CELL:\+20 100 000 0000/);
assert.match(contact, /EMAIL;TYPE=INTERNET:hello@example\.com/);
assert.match(contact, /URL:https:\/\/example\.com\//);
assert.doesNotMatch(contact, /ADR;TYPE=WORK/);
assert.match(contact, /NOTE:Learning\\; building/);
assert.match(contact, /\r\nEND:VCARD$/);

const contactWithAddress = buildVCard({ name: 'Test Person', address: 'Cairo, Egypt' });
assert.match(contactWithAddress, /ADR;TYPE=WORK:;;Cairo\\, Egypt;;;;/);
assert.doesNotMatch(contactWithAddress, /ADR;TYPE=WORK:\\;/);

assert.equal(
  buildWifi({ ssid: 'Cafe;Guest', security: 'WPA', password: 'pass:word', hidden: true }),
  'WIFI:T:WPA;S:Cafe\\;Guest;P:pass\\:word;H:true;;',
);
assert.equal(
  buildWifi({ ssid: 'Open Network', security: 'nopass', password: '', hidden: false }),
  'WIFI:T:nopass;S:Open Network;P:;H:false;;',
);

assert.equal(buildQrPayload('url', { url: 'example.com' }), 'https://example.com/');
assert.equal(buildQrPayload('text', { text: 'Hello QR' }), 'Hello QR');
assert.equal(buildQrPayload('audio', { audioUrl: 'example.com/audio.mp3' }), 'https://example.com/audio.mp3');
assert.match(buildQrPayload('contact', { name: 'Test Person' }), /FN:Test Person/);
assert.match(
  buildQrPayload('wifi', { ssid: 'Lab', security: 'nopass', hidden: false }),
  /^WIFI:/,
);

console.log('Advanced QR payload tests passed.');
