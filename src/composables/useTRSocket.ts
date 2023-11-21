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

    console.log(eventData);

    // 1) Neon Search Results
    if ('results' in eventData.jsonObject) {
      if (eventData.jsonObject.results.length > 0 && 'etfDescription' in eventData.jsonObject.results[0]) {
        console.log('EFT Resuls');
        console.log(eventData.jsonObject.results);
      } else {
        console.log('Stock results');
        console.log(eventData.jsonObject.results);
      }
    }

    // 2) Details of instrument
    // 3) Dividend details of stock

    sendMessage(`unsub ${eventData?.eventId}`);
  };

  return {
    sendMessage,
    close: socket.value.close
  };
}
