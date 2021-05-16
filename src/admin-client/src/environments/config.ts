const base = 'http://192.168.100.8';
const gateway = `${base}:5002`;
const identity = `https://identity-server-ada.azurewebsites.net/`;
const client = `http://192.168.100.8:4200`;
const clientId = 'admin-client';

export const config = {
    bankingBase: `${gateway}/api/banking`,
    realTimeBase: `${gateway}/hub/real-time`,
    identity,
    clientId,
    clientSignInCallback: `${client}/signin-callback`,
    clientLogoutCallback: `${client}/logout-callback`
};
