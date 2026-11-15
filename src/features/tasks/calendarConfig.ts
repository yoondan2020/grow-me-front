import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales.ko = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

/** 주의 시작은 월요일 */
export const FIRST_DAY_MONDAY = 1;
export const MONTH_FORMAT = 'yyyy년 M월';

/** 달력 점: 완료한 할 일이 있는 날 / 할 일은 있지만 완료하지 않은 날 */
export const DOT_DONE = '#8FC2FF';
export const DOT_PENDING = '#C5CBD3';

export const CALENDAR_THEME = {
  calendarBackground: '#FFFFFF',
  monthTextColor: '#191F28',
  textMonthFontSize: 18,
  textMonthFontWeight: '700' as const,
  arrowColor: '#6B7684',
  textSectionTitleColor: '#6B7684',
  textDayHeaderFontSize: 12,
  dayTextColor: '#191F28',
  textDayFontSize: 16,
  textDisabledColor: '#C5CBD3',
  todayTextColor: '#0064FF',
  selectedDayBackgroundColor: '#0064FF',
  selectedDayTextColor: '#FFFFFF',
  dotColor: DOT_DONE,
  selectedDotColor: '#FFFFFF',
};
