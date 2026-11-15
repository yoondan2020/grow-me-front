import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { GrowTask } from '@/store/GrowMeContext';

import { DAYS } from '../constants';

export function WeekCalendar({ tasks, selectedDate, onSelectDate }: { tasks: GrowTask[]; selectedDate: string; onSelectDate: (date: string) => void }) {
  return (
    <>
      <View style={styles.monthRow}>
        <Text style={styles.month}>2026년 11월</Text>
        <View style={styles.monthActions}><Text style={styles.chevron}>‹</Text><Text style={styles.chevron}>›</Text></View>
      </View>
      <View style={styles.calendar}>
        {DAYS.map((item) => {
          const date = `2026-11-${item.day.padStart(2, '0')}`;
          const selected = date === selectedDate;
          const hasRecord = tasks.some((task) => task.date === date && task.completed);
          return (
            <Pressable key={date} accessibilityRole="button" onPress={() => onSelectDate(date)} style={styles.day}>
              <Text style={styles.weekday}>{item.weekday}</Text>
              <View style={[styles.dayNumberWrap, selected && styles.daySelected]}>
                <Text style={[styles.dayNumber, selected && styles.dayNumberSelected]}>{item.day}</Text>
              </View>
              {hasRecord ? <View style={styles.dot} /> : <View style={styles.dotSpace} />}
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  monthRow: { marginTop: 20, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  month: { color: '#191F28', fontSize: 18, fontWeight: '700' },
  monthActions: { flexDirection: 'row', gap: 22 },
  chevron: { color: '#6B7684', fontSize: 24 },
  calendar: { marginHorizontal: 24, marginTop: 17, flexDirection: 'row', justifyContent: 'space-between' },
  day: { width: 42, alignItems: 'center', gap: 7 },
  weekday: { color: '#6B7684', fontSize: 12, lineHeight: 18 },
  dayNumberWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: '#0064FF' },
  dayNumber: { color: '#191F28', fontSize: 16 },
  dayNumberSelected: { color: '#FFFFFF', fontWeight: '700' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#8FC2FF' },
  dotSpace: { height: 4 },
});
