import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { ActionButton } from '@/components/ui/ActionButton';
import { DAILY_TASK_LIMIT } from '@/store/taskSchedule';
import { addDays, formatFullDate, todayKey } from '@/utils/date';

import { CALENDAR_THEME, FIRST_DAY_MONDAY, MONTH_FORMAT } from '../calendarConfig';

type TaskFormSheetProps = {
  visible: boolean;
  value: string;
  /** 일반 할 일의 날짜, 반복 할 일의 시작일 */
  date: string;
  isEditing: boolean;
  repeatDaily: boolean;
  repeatEndDate: string;
  error: string | null;
  onChangeValue: (value: string) => void;
  onChangeDate: (date: string) => void;
  onChangeRepeatDaily: (value: boolean) => void;
  onChangeRepeatEndDate: (date: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function TaskFormSheet({
  visible, value, date, isEditing, repeatDaily, repeatEndDate, error,
  onChangeValue, onChangeDate, onChangeRepeatDaily, onChangeRepeatEndDate, onClose, onSave,
}: TaskFormSheetProps) {
  // 수정할 때만 날짜(반복이면 시작일)를 바꿀 수 있습니다. 새로 추가할 때는 달력에서 고른 날짜를 씁니다.
  const [picking, setPicking] = useState<'date' | 'end' | null>(null);
  const togglePicker = (target: 'date' | 'end') => setPicking((current) => (current === target ? null : target));

  const toggleRepeat = (next: boolean) => {
    onChangeRepeatDaily(next);
    if (!next) setPicking(null);
  };
  const dateLabel = repeatDaily ? '시작일' : '날짜';
  const dateText = `${formatFullDate(date)}${date === todayKey() ? ' · 오늘' : ''}`;

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.handle} />
            <View style={styles.sheetTitleRow}><Text style={styles.sheetTitle}>작은 실천 적기</Text><Pressable onPress={onClose}><Text style={styles.close}>닫기</Text></Pressable></View>
            <Text style={styles.sheetSubtitle}>오늘 나를 위해 할 일을 적어주세요.</Text>
            <Text style={styles.fieldLabel}>할 일</Text>
            <TextInput autoFocus maxLength={40} onChangeText={onChangeValue} placeholder="예: 책 10쪽 읽기" placeholderTextColor="#9AA4B2" style={styles.input} value={value} />
            <View style={styles.helperRow}><Text style={styles.helper}>가벼운 실천도 좋아요.</Text><Text style={styles.helper}>{value.length} / 40</Text></View>
            {isEditing ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${dateLabel} ${formatFullDate(date)}, 변경하기`}
                onPress={() => togglePicker('date')}
                style={styles.datePill}>
                <Text style={styles.datePillLabel}>{dateLabel}</Text>
                <Text style={styles.datePillValue}>{dateText}  {picking === 'date' ? '▴' : '▾'}</Text>
              </Pressable>
            ) : (
              <View style={styles.datePill}><Text style={styles.datePillLabel}>{dateLabel}</Text><Text style={styles.datePillValue}>{dateText}</Text></View>
            )}
            {picking === 'date' ? (
              <Calendar
                style={styles.pickerCalendar}
                current={date}
                firstDay={FIRST_DAY_MONDAY}
                monthFormat={MONTH_FORMAT}
                theme={CALENDAR_THEME}
                markedDates={{ [date]: { selected: true } }}
                onDayPress={(day) => { onChangeDate(day.dateString); setPicking(null); }}
              />
            ) : null}
            {isEditing ? null : (
              <>
                <View style={styles.repeatRow}>
                  <View>
                    <Text style={styles.repeatLabel}>↻ 매일 반복</Text>
                    <Text style={styles.repeatHelper}>시작일부터 종료일까지 매일 할 일에 추가돼요.</Text>
                  </View>
                  <Switch
                    accessibilityLabel="매일 반복"
                    value={repeatDaily}
                    onValueChange={toggleRepeat}
                    trackColor={{ false: '#D0D5DB', true: '#0064FF' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </>
            )}
            {repeatDaily ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`종료일 ${formatFullDate(repeatEndDate)}, 변경하기`}
                onPress={() => togglePicker('end')}
                style={styles.datePill}>
                <Text style={styles.datePillLabel}>종료일</Text>
                <Text style={styles.datePillValue}>{formatFullDate(repeatEndDate)}  {picking === 'end' ? '▴' : '▾'}</Text>
              </Pressable>
            ) : null}
            {repeatDaily && picking === 'end' ? (
              <Calendar
                style={styles.pickerCalendar}
                current={repeatEndDate}
                minDate={addDays(date, 1)}
                firstDay={FIRST_DAY_MONDAY}
                monthFormat={MONTH_FORMAT}
                theme={CALENDAR_THEME}
                markedDates={{ [repeatEndDate]: { selected: true } }}
                onDayPress={(day) => { onChangeRepeatEndDate(day.dateString); setPicking(null); }}
              />
            ) : null}
            {isEditing && repeatDaily ? <Text style={styles.editNote}>↻ 기간을 바꾸면 반복 전체에 적용돼요. 새 기간 밖의 완료 기록은 사라져요.</Text> : null}
            {error ? <Text accessibilityRole="alert" style={styles.error}>⚠ {error}</Text> : null}
            <Text style={styles.rules}>하루 최대 {DAILY_TASK_LIMIT}개(매일 반복 포함) · 할 일을 끝내면 식물이 성장해요.</Text>
            <ActionButton label="저장하기" onPress={onSave} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,31,40,0.32)' },
  sheet: { minHeight: 534, maxHeight: '92%', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 32, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#FFFFFF' },
  handle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 2, backgroundColor: '#D0D5DB', marginBottom: 23 },
  sheetTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTitle: { color: '#191F28', fontSize: 24, fontWeight: '700' },
  close: { color: '#6B7684', fontSize: 14 },
  sheetSubtitle: { color: '#6B7684', fontSize: 14, marginTop: 10 },
  fieldLabel: { color: '#191F28', fontSize: 14, fontWeight: '700', marginTop: 34, marginBottom: 10 },
  input: { height: 62, borderWidth: 1.5, borderColor: '#0064FF', backgroundColor: '#F1F3F5', borderRadius: 16, paddingHorizontal: 16, color: '#191F28', fontSize: 16 },
  helperRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  helper: { color: '#6B7684', fontSize: 12 },
  datePill: { height: 54, marginTop: 12, borderRadius: 16, backgroundColor: '#F1F3F5', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  datePillLabel: { color: '#6B7684', fontSize: 13 },
  datePillValue: { color: '#191F28', fontSize: 14, fontWeight: '600' },
  repeatRow: { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  repeatLabel: { color: '#191F28', fontSize: 15, fontWeight: '700' },
  repeatHelper: { color: '#6B7684', fontSize: 12, marginTop: 4 },
  pickerCalendar: { marginTop: 8 },
  editNote: { color: '#6B7684', fontSize: 12, lineHeight: 18, marginTop: 10 },
  error: { color: '#C65049', fontSize: 13, lineHeight: 19, marginTop: 12 },
  rules: { color: '#6B7684', fontSize: 12, lineHeight: 19, marginTop: 20, marginBottom: 20 },
});
