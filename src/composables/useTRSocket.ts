import { ref } from 'vue';

const socket = ref(new WebSocket(
  'wss://api.traderepublic.com/',
));

socket.value.onopen = () => {
  socket.value?.send('connect 29 {"locale":"de","platformId":"webtrading","platformVersion":"chrome - 119.0.0","clientId":"app.traderepublic.com","clientVersion":"1.27.5"}');
};

socket.value.onerror = (error) => {
  console.log(error);
};

export function useTRSocket () {
  return {
    sendMessage (message: string) {
      socket.value?.send(message);
    },
    onMessage: socket.value.onmessage,
    close: socket.value.close
  };
}
