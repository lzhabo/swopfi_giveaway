export const prettifyNums = (x: number) => {
  const parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
