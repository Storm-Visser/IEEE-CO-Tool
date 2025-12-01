import Queue from 'promise-queue';
import axios from 'axios';

// 1 concurrent request at a time, unlimited queue (increase for parralel queues)
const queue = new Queue(1, Infinity);

// Optional delay between requests (ms)
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Wrapper for Trello requests
export async function queueTrelloRequest(config) {
  return queue.add(async () => {
    const result = await axios(config);
    // Add a small delay to avoid bursts (120ms ~ 8 requests/sec)
    await delay(120);
    return result;
  });
}