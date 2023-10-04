import path from 'path';
import dedent from 'dedent';
import loopback from 'loopback';
import moment from 'moment';

// Utility function for encoding sensitive data
export function encodeSensitiveData(data) {
  if (!data) {
    return null;
  }
  return Buffer.from(data).toString('base64');
}

export const renderSignUpEmail = loopback.template(
  path.join(__dirname, '..', '..', 'server', 'views', 'emails', 'user-request-sign-up.ejs')
);

export const renderSignInEmail = loopback.template(
  path.join(__dirname, '..', '..', 'server', 'views', 'emails', 'user-request-sign-in.ejs')
);

export const renderEmailChangeEmail = loopback.template(
  path.join(__dirname, '..', '..', 'server', 'views', 'emails', 'user-request-update-email.ejs')
);

export function getWaitPeriod(ttl) {
  const fiveMinutesAgo = moment().subtract(5, 'minutes');
  const lastEmailSentAt = moment(new Date(ttl || null));
  const isWaitPeriodOver = ttl ? lastEmailSentAt.isBefore(fiveMinutesAgo) : true;

  if (!isWaitPeriodOver) {
    const minutesLeft = 5 - (moment().minutes() - lastEmailSentAt.minutes());
    return minutesLeft;
  }

  return 0;
}

export function getWaitMessage(ttl) {
  const minutesLeft = getWaitPeriod(ttl);
  if (minutesLeft <= 0) {
    return null;
  }

  const timeToWait = minutesLeft
    ? `${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`
    : 'a few seconds';

  return dedent`
    Please wait ${timeToWait} to resend an authentication link.
  `;
}

// Usage example:
const email = 'example@email.com'; // Replace with your email
const encodedEmail = encodeSensitiveData(email);
console.log(encodedEmail); // Encoded email can be sent in requests or stored securely
