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

export function pickCloseupShot(shots) {
  const closeupShots = shots.filter(shot =>
    shot.includes("close-up") ||
    shot.includes("facial") ||
    shot.includes("portrait") ||
    shot.includes("beauty") ||
    shot.includes("detail") ||
    shot.includes("bust") ||
    shot.includes("intimate")
  );
  return closeupShots.length > 0 ? pick(closeupShots) : pick(shots);
}

export function filterByKeywords(array, keywords) {
  if (!array || array.length === 0 || !keywords || keywords.length === 0) {
    return array;
  }
  return array.filter(item =>
    keywords.some(keyword =>
      item.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}

export function pickOrEmpty(array) {
  return array && array.length > 0 ? pick(array) : "";
}

