import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { getErrorMessage } from '@/services/apiClient';

/** 서버 데이터를 처음 불러오는 동안 보여주는 표시 */
export function LoadingIndicator({ label = '불러오는 중이에요' }: { label?: string }) {
  return (
    <View style={styles.loading} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color="#6B7684" />
      <Text style={styles.loadingText}>{label}</Text>
    </View>
  );
}

type ErrorNoticeProps = {
  error: unknown;
  /** 있으면 '다시 시도' 버튼을 보여줍니다. */
  onRetry?: () => void;
  /** 있으면 '닫기' 버튼을 보여줍니다. */
  onDismiss?: () => void;
};

/** 서버 요청 실패 안내. 아이콘(⚠)과 문구로 상태를 함께 전달합니다. */
export function ErrorNotice({ error, onRetry, onDismiss }: ErrorNoticeProps) {
  return (
    <View style={styles.notice} accessibilityRole="alert">
      <Text style={styles.message}>⚠ {getErrorMessage(error)}</Text>
      <View style={styles.actions}>
        {onRetry ? (
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onRetry}>
            <Text style={styles.action}>다시 시도</Text>
          </Pressable>
        ) : null}
        {onDismiss ? (
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onDismiss}>
            <Text style={styles.action}>닫기</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: 48, alignItems: 'center', gap: 10 },
  loadingText: { color: '#6B7684', fontSize: 13 },
  notice: { marginHorizontal: 24, marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: '#F1F3F5', gap: 8 },
  message: { color: '#C65049', fontSize: 13, lineHeight: 19 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16 },
  action: { color: '#191F28', fontSize: 13, fontWeight: '600' },
});
