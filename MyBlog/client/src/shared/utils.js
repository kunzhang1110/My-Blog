export const capitalize = (string) => {
  if (string == null || string.length === 0) return "";
  return string[0].toUpperCase() + string.substring(1);
};
