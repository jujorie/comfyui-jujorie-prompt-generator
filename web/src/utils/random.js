export function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function pickMultiple(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(", ");
}

export function pickOrDefault(value, array) {
  return value || pick(array);
}
