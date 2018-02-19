import { calendarComponentName } from './calendar.component';

const calendarConfig = {
  name: 'calendar',
  url: '/calendar',
  component: calendarComponentName,
  data: {
    authRequired: false,
  },
};

export default [calendarConfig];