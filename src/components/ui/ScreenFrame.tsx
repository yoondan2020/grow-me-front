import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavigation, type MainTab } from '@/components/navigation/BottomNavigation';

export function ScreenFrame({ children, activeTab, showTabs = true }: { children: ReactNode; activeTab?: MainTab; showTabs?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.page}>
        {Platform.OS === 'web' ? <View style={styles.webStatusBar}><Text style={styles.statusTime}>9:41</Text><Image contentFit="contain" source={require('@/assets/images/growme/status-icons.svg')} style={styles.statusIcons} /></View> : null}
        <View style={styles.body}>{children}</View>
        {showTabs && activeTab ? <BottomNavigation activeTab={activeTab} bottomInset={Platform.OS === 'web' ? 34 : insets.bottom} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { flex: 1, width: '100%', maxWidth: 390, alignSelf: 'center' },
  webStatusBar: { height: 48, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  statusTime: { position: 'absolute', left: 25, top: 13, color: '#191F28', fontSize: 14, fontWeight: '700', lineHeight: 21 },
  statusIcons: { position: 'absolute', right: 24, top: 17, width: 65, height: 16 },
  body: { flex: 1 },
});
