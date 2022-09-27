import { getUserInfo } from '@/axios';

// src/app.ts
export async function getInitialState() {
  const data = await getUserInfo();
  return data || {};
}
