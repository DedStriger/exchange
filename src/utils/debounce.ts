export function debounce(func: (...args: any) => void, timeout = 600) {
  let timer: number | undefined;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      //@ts-expect-error
      func.apply(this, args);
    }, timeout);
  };
}
