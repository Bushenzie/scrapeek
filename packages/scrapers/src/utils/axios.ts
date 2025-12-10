import axios from "axios";

const userAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; moto g fast) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Whale/2.9.115.7 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; LM-Q730) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36",
];

export const axiosClient = axios.create({});

axiosClient.interceptors.request.use((config) => {
  const randomNum = Math.floor(Math.random() * userAgents.length);
  config.headers["User-Agent"] = userAgents[randomNum];
  return config;
});
