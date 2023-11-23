import { useNeonSearchStore } from '@/stores/neon-search';
import type { ReturnValueNeonSearch } from '@/types/tr/neon-search';
import { extractJsonAndEventId } from '@/utils/ws-events';
import { ref } from 'vue';

const socket = ref(new WebSocket('wss://api.traderepublic.com/'));

socket.value.onopen = () => {
  socket.value?.send('connect 29 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 119.0.0","clientId":"app.traderepublic.com","clientVersion":"1.27.5"}');
};

socket.value.onerror = (error) => {
  console.log(error);
};

export function useTRSocket () {
  const neonSearch = useNeonSearchStore();

  function sendMessage (message: string) {
    socket.value?.send(message);
  }

  socket.value.onmessage = (event) => {
    // TODO: add more generic values for event data
    // 2) "type":"instrument"
    // 3) "type":"stockDetailDividends"
    const eventData = extractJsonAndEventId<ReturnValueNeonSearch>(event.data);

    if (!eventData) {
      return;
    }

    // 1) Neon Search Results
    if ('results' in eventData.jsonObject) {
      neonSearch.handleSearchEvent(eventData.jsonObject.results, eventData.eventId);
    }

    // 2) Details of instrument
    // 3) Dividend details of stock

    sendMessage(`unsub ${eventData?.eventId}`);
  };

  return {
    sendMessage,
    close: socket.value.close,
  };
}
