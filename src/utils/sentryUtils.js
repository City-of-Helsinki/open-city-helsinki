// sentryUtils.js
import {
  Sentry,
  SentrySeverity,
  SentryLog
} from 'react-native-sentry';
// Function to configure Sentry. Call this when your app mounts
export const configure = (dsn: string, options = { logLevel: SentryLog.Verbose}) => {
  Sentry.config(dsn, options).install();
};
// Function to set extra context.
// Use this to include the Redux store in errors sent to Sentry
export const setExtraContext = () => {
  Sentry.setExtraContext({
    store: store.getState(),
  });
};
// Function to set tags context.
// Use this to set the environment programmatically
export const setTagsContext = (ctx: any) => {
  Sentry.setTagsContext({
    environment: ctx.environment,
  });
};
// Function to set user context.
// Use this to send up info about the current logged in user
export const setUserContext = (ctx: any) => {
  Sentry.setUserContext(ctx);
};
// Function to report handled errors to Sentry
// I use this if I want to report some API failure
export const captureMessage = (msg: string) => {
  Sentry.captureMessage(msg, {
    level: SentrySeverity.Error,
  });
};
