function ageMinutes(dateLike) {
  if (!dateLike) return null;
  const d = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
  if (!(d instanceof Date) || isNaN(d)) return null;
  return Math.floor((Date.now() - d.getTime()) / 60000);
}

module.exports = { ageMinutes };