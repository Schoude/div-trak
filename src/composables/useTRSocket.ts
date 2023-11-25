import { useInstrumentsStore } from '@/stores/instruments';
import { useNeonSearchStore } from '@/stores/neon-search';
import { useTickerStore } from '@/stores/ticker';
import {
  isInstrumentEvent,
  isNeonSearchEvent,
  isStockDetailsEvent,
  isTickerEvent,
  type EventType,
} from '@/types/tr/events';
import { extractJsonAndEventId } from '@/utils/ws-events';
import { ref } from 'vue';

const socket = ref(new WebSocket('wss://api.traderepublic.com/'));

socket.value.onopen = () => {
  socket.value?.send(
    'connect 29 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 119.0.0","clientId":"app.traderepublic.com","clientVersion":"1.27.5"}',
  );
};

socket.value.onerror = (error) => {
  console.log(error);
};

const runningEventId = ref(10);

export function useTRSocket () {
  const neonSearch = useNeonSearchStore();
  const instruments = useInstrumentsStore();
  const ticker = useTickerStore();

  function sendMessage (
    message: string,
    { updateEventId }: { updateEventId: boolean } = { updateEventId: true },
  ) {
    if (updateEventId) {
      runningEventId.value = runningEventId.value + 1;
    }

    if (socket.value.readyState === socket.value.OPEN) {
      socket.value?.send(message);

      return;
    }

    const interval = setInterval(() => {
      sendMessage(message, { updateEventId: false });
      clearInterval(interval);
    }, 500);
  }

  socket.value.onmessage = (event) => {
    const eventData = extractJsonAndEventId<EventType>(event.data);

    if (!eventData) {
      return;
    }

    // 1) Neon Search Results
    if (isNeonSearchEvent(eventData)) {
      neonSearch.handleSearchEvent(
        eventData.jsonObject.results,
        eventData.eventId,
      );
    }

    // 2) Details of instrument | "type":"instrument"
    if (isInstrumentEvent(eventData)) {
      instruments.upsertInstrument(eventData.jsonObject.isin, {
        instrument: eventData.jsonObject,
        tickerEventId: eventData.eventId + 2,
      });
    }

    // 3) Details of a stock | "type":"stockDetails"
    if (isStockDetailsEvent(eventData)) {
      instruments.upsertInstrument(eventData.jsonObject.isin, {
        stockDetails: eventData.jsonObject,
      });
    }

    // 4) Ticker of an instrument | "type":"ticker"
    if (isTickerEvent(eventData)) {
      ticker.setTicker(eventData.eventId, eventData.jsonObject);
      // TODO: don't unsub for ticker on /instruments/:isin page -> unsub onBeforeUnmount
    }

    sendMessage(`unsub ${eventData?.eventId}`, { updateEventId: false });
  };

  return {
    runningEventId,
    sendMessage,
    close: socket.value.close,
  };
}
