import * as React from 'react';
import { Button, Text, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const useProxy = true;

const redirectUri = AuthSession.makeRedirectUri({
  useProxy,
});

export default function App() {
  const discovery = AuthSession.useAutoDiscovery('https://identity-server-ada.azurewebsites.net/');
  
  // Create and load an auth request
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'mobile-client',
      redirectUri,
      scopes: ['openid', 'profile', 'mobile'],
    },
    discovery
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login!" disabled={!request} onPress={() => promptAsync({ useProxy })} />
      {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
