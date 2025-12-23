export const sleep = async (time: number) => {
  return new Promise((res, _rej) => {
    setTimeout(() => {
      res(true);
    }, time);
  });
};
