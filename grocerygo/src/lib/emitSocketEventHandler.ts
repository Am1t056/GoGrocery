import axios from 'axios';

const emitSocketEventHandler = async (
  event: string,
  data: any,
  socketId?: string
) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notify`, {
      socketId,
      event,
      data,
    });
  } catch (error) {
    console.log('Failed to emit from emitSocketEventHandler', error);
  }
};

export default emitSocketEventHandler;
