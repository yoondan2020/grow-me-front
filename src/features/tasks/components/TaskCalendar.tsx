import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Calendar, CalendarProvider, WeekCalendar } from 'react-native-calendars';

import type { DateStatus } from '@/store/taskSchedule';
import { addDays, parseDateKey } from '@/utils/date';

import { CALENDAR_THEME, DOT_DONE, DOT_PENDING, FIRST_DAY_MONDAY, MONTH_FORMAT } from '../calendarConfig';

type TaskCalendarProps = {
  /** 할 일이 있는 날짜별 상태: 완료가 있으면 파란 점, 하나도 완료하지 않았으면 회색 점 */
  dateStatuses: Record<string, DateStatus>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  children: ReactNode;
};

/**
 * 기본은 월요일 시작 주간 달력이고, '월간 보기'를 누르면 월간 달력으로 펼쳐집니다.
 * ExpandableCalendar는 react-native-web에서 항상 스크린 리더 모드로 바뀌어 접힘이 동작하지 않으므로
 * WeekCalendar와 Calendar를 직접 전환합니다.
 */
export function TaskCalendar({ dateStatuses, selectedDate, onSelectDate, children }: TaskCalendarProps) {
  const [expanded, setExpanded] = useState(false);
  // WeekCalendar는 기본적으로 창 전체 폭을 쓰므로 화면 프레임(최대 390px)의 실제 폭을 재서 넘깁니다.
  // 폭을 재기 전(웹 서버 렌더링 포함)에는 달력을 그리지 않아 hydration 불일치를 피합니다.
  const [width, setWidth] = useState(0);

  const markedDates = useMemo(() => {
    const marks: Record<string, { marked?: boolean; dotColor?: string; selected?: boolean }> = {};
    for (const [date, status] of Object.entries(dateStatuses)) {
      marks[date] = { marked: true, dotColor: status === 'done' ? DOT_DONE : DOT_PENDING };
    }
    marks[selectedDate] = { ...marks[selectedDate], selected: true };
    return marks;
  }, [dateStatuses, selectedDate]);

  const handleLayout = (event: LayoutChangeEvent) => setWidth(Math.round(event.nativeEvent.layout.width));
  // CalendarProvider는 date prop을 effect에서 반영합니다. 같은 렌더에서 접으면 WeekCalendar가 이전 날짜의 주로
  // 마운트되므로, Provider가 새 날짜를 반영한 뒤(자식 effect가 먼저 실행됨) 접습니다.
  const collapseAfterSync = useRef(false);
  useEffect(() => {
    if (collapseAfterSync.current) {
      collapseAfterSync.current = false;
      setExpanded(false);
    }
  }, [selectedDate]);
  const selectFromMonth = (dateKey: string) => {
    if (dateKey === selectedDate) {
      setExpanded(false);
      return;
    }
    collapseAfterSync.current = true;
    onSelectDate(dateKey);
  };
  const selected = parseDateKey(selectedDate);

  return (
    <CalendarProvider date={selectedDate} onDateChanged={onSelectDate} style={styles.provider}>
      <View onLayout={handleLayout} style={styles.calendarArea}>
        {width > 0 && expanded ? (
          <Calendar
            current={selectedDate}
            firstDay={FIRST_DAY_MONDAY}
            monthFormat={MONTH_FORMAT}
            markedDates={markedDates}
            theme={CALENDAR_THEME}
            enableSwipeMonths
            onDayPress={(day) => selectFromMonth(day.dateString)}
          />
        ) : null}
        {width > 0 && !expanded ? (
          <>
            <View style={styles.weekHeader}>
              <Text style={styles.monthTitle}>{`${selected.getFullYear()}년 ${selected.getMonth() + 1}월`}</Text>
              <View style={styles.weekArrows}>
                <Pressable accessibilityRole="button" accessibilityLabel="이전 주" hitSlop={8} onPress={() => onSelectDate(addDays(selectedDate, -7))}>
                  <Text style={styles.chevron}>‹</Text>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="다음 주" hitSlop={8} onPress={() => onSelectDate(addDays(selectedDate, 7))}>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              </View>
            </View>
            <WeekCalendar calendarWidth={width} firstDay={FIRST_DAY_MONDAY} markedDates={markedDates} theme={CALENDAR_THEME} allowShadow={false} />
          </>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={expanded ? '주간 달력으로 접기' : '월간 달력으로 펼치기'}
          onPress={() => setExpanded((value) => !value)}
          style={styles.toggle}>
          <Text style={styles.toggleText}>{expanded ? '주간 보기  ▴' : '월간 보기  ▾'}</Text>
        </Pressable>
      </View>
      {children}
    </CalendarProvider>
  );
}

const styles = StyleSheet.create({
  provider: { flex: 1 },
  calendarArea: { marginTop: 12 },
  weekHeader: { marginHorizontal: 24, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthTitle: { color: '#191F28', fontSize: 18, fontWeight: '700' },
  weekArrows: { flexDirection: 'row', gap: 22 },
  chevron: { color: '#6B7684', fontSize: 24 },
  toggle: { alignSelf: 'center', marginTop: 4, paddingHorizontal: 12, paddingVertical: 6 },
  toggleText: { color: '#6B7684', fontSize: 13, fontWeight: '600' },
});
