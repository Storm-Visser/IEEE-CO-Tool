import PQueue from "p-queue";
import axios from "axios";

// Limit: 10 requests per second → 100 per 10 seconds
export const trelloQueue = new PQueue({
  interval: 1000,
  intervalCap: 8,
});

// Wrapper for Trello API calls
export function queueTrelloRequest(config) {
  return trelloQueue.add(() => axios(config));
}