import { Image } from 'expo-image';
import { Link, type Href } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export type MainTab = 'home' | 'tasks' | 'collection' | 'profile';

const TAB_CONFIG: Record<MainTab, { label: string; href: Href; icons: [number, number, number, number] }> = {
  home: {
    label: '홈', href: '/',
    icons: [require('@/assets/images/nav/home-active.svg'), require('@/assets/images/nav/home-tasks.svg'), require('@/assets/images/nav/home-book.svg'), require('@/assets/images/nav/home-profile.svg')],
  },
  tasks: {
    label: '할 일', href: '/tasks',
    icons: [require('@/assets/images/nav/tasks-home.svg'), require('@/assets/images/nav/tasks-active.svg'), require('@/assets/images/nav/tasks-book.svg'), require('@/assets/images/nav/tasks-profile.svg')],
  },
  collection: {
    label: '도감', href: '/collection',
    icons: [require('@/assets/images/nav/library-home.svg'), require('@/assets/images/nav/library-tasks.svg'), require('@/assets/images/nav/library-active.svg'), require('@/assets/images/nav/library-profile.svg')],
  },
  profile: {
    label: '마이페이지', href: '/profile',
    icons: [require('@/assets/images/nav/profile-home.svg'), require('@/assets/images/nav/profile-tasks.svg'), require('@/assets/images/nav/profile-book.svg'), require('@/assets/images/nav/profile-active.svg')],
  },
};

const TABS: MainTab[] = ['home', 'tasks', 'collection', 'profile'];

export function BottomNavigation({ activeTab, bottomInset }: { activeTab: MainTab; bottomInset: number }) {
  return (
    <View style={[styles.tabBar, { height: 56 + bottomInset, paddingBottom: bottomInset }]}>
      {TABS.map((tab, index) => {
        const selected = tab === activeTab;
        return (
          <Link key={tab} href={TAB_CONFIG[tab].href} asChild>
            <Pressable accessibilityRole="tab" accessibilityState={{ selected }} style={styles.tab}>
              <Image contentFit="contain" source={TAB_CONFIG[activeTab].icons[index]} style={styles.icon} />
              <Text style={[styles.label, selected && styles.labelSelected]}>{TAB_CONFIG[tab].label}</Text>
            </Pressable>
          </Link>
        );
      })}
      {Platform.OS === 'web' ? <View style={styles.homeIndicator} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E8EB' },
  tab: { flex: 1, alignItems: 'center', paddingTop: 15, gap: 6 },
  icon: { width: 21, height: 21 },
  label: { color: '#6B7684', fontSize: 11, fontWeight: '500', lineHeight: 17 },
  labelSelected: { color: '#0064FF', fontWeight: '700' },
  homeIndicator: { position: 'absolute', left: '50%', bottom: 8, width: 136, height: 5, marginLeft: -68, borderRadius: 3, backgroundColor: '#191F28' },
});
