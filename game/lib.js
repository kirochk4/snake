export const floor = Math.floor;

export function log(...a) {
  console.log(...a);
}

export async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
