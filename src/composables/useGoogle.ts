import type { CalendarDividend } from '@/types/tr/events/stock-details';
import { useScriptTag } from '@vueuse/core';
import { ref } from 'vue';

interface Calendar {
  id: string;
  summary: string;
  description: string;
}

// TODO:
// 2.1) If present get all events in that calendar for the current month
// 3) Delete all present dividend events
// 4) Add all new dividend events
export function useGoogle () {
  const loading = ref(false);
  let tokenClient: { callback: (req: unknown) => Promise<void> };

  useScriptTag(
    'https://accounts.google.com/gsi/client',
    () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
        scope:
          'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        callback: '', // defined later
      });
    },
  );

  useScriptTag(
    'https://apis.google.com/js/api.js',
    () => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
          ],
        });
      });
    },
  );

  function addToCalendar (year: number, month: number, dividends: CalendarDividend[]) {
    if (loading.value) {
      return;
    }

    tokenClient.callback = async () => {
      loading.value = true;

      // Check if user already has a "Dividenden" calendar, if not create it.
      const calendarListRequest = gapi.client.calendar.calendarList.list();
      calendarListRequest.execute(async function (val: { items: Calendar[] }) {
        let dividendCalendar = val.items.find((calendar) =>
          calendar.summary === 'Dividenden',
        );

        if (!dividendCalendar) {
          const calendarListRequest = gapi.client.calendar.calendars.insert({
            summary: 'Dividenden',
            description: 'Dividendenkalender von Div Trak',
            'timeZone': 'Europe/Berlin',
          });

          calendarListRequest.execute(function (val: Calendar) {
            dividendCalendar = val;
          });
        }

        // Get the events of the dividend calendar of the current month.
        month = month + 1;
        const timeMin = (new Date(`${year}-${String(month).padStart(2, '0')}-01`));
        timeMin.setHours(6);
        const timeMax = (new Date(`${year}-${String(month).padStart(2, '0')}-31`));
        timeMax.setHours(23);

        const request = {
          'calendarId': dividendCalendar?.id,
          'timeMin': timeMin.toISOString(),
          'timeMax': timeMax.toISOString(),
          'showDeleted': false,
        };

        // Delete all events present for that month
        const response = await gapi.client.calendar.events.list(request);
        const presentEvents = JSON.parse(response.body).items;

        if (presentEvents && presentEvents.length > 0) {
          const toDelete = presentEvents.map(event => {
            const request = {
              'calendarId': dividendCalendar?.id,
              'eventId': event.id,
            };

            return gapi.client.calendar.events.delete(request);
          });

          await Promise.all(toDelete);
        }

        // Add all new events
        const toAdd = dividends.map((dividend) => {
          const startDate = new Date(dividend.paymentDateTimestamp);
          const endDate = new Date(dividend.paymentDateTimestamp);
          startDate.setHours(10);
          endDate.setHours(11);

          const event = {
            'summary':
              `${dividend.instrumentName} | ${dividend.paymentFormatted}`,
            'description': `${dividend.paymentFormatted}${
              dividend.isEstimation ? ' | Is Estimation' : ''
            }${dividend.hasForecast ? ' | Has Forecast Orders' : ''}`,
            'start': {
              'dateTime': startDate.toISOString(),
              'timeZone': 'Europe/Berlin',
            },
            'end': {
              'dateTime': endDate.toISOString(),
              'timeZone': 'Europe/Berlin',
            },
          };

          return gapi.client.calendar.events.insert({
            'calendarId': dividendCalendar?.id,
            'resource': event,
          });
        });

        await Promise.all(toAdd);
      });

      loading.value = false;
    };

    if (gapi.client.getToken() == null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  return {
    addToCalendar,
  };
}
