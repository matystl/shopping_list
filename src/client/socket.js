import io from 'socket.io-client';

export const socket = () => {
  console.log("Do o have socket.js inicialization");
  return io.connect();
}();
