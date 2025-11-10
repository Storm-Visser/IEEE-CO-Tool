import { appKey, appName } from './constants.js';

const t = window.TrelloPowerUp.iframe({
  appKey: appKey,
  appName: appName,
  appAuthor: 'IEEE'
});

// Get the secret from URL hash
const secret = window.location.hash.replace('#secret=', '');

t.render(() => {
  window.addEventListener('message', async (event) => {
    const token = event.data && event.data.token;

    if (token) {
      // Save token to member storage
      await t.set('member', 'private', 'trelloToken', token);

      // Notify opener if possible
      if (window.opener && window.opener.t) {
        await window.opener.t.set('member', 'private', 'trelloToken', token);
      }

      alert('Authorization successful!');
      window.close();
    }
  }, false);
});
