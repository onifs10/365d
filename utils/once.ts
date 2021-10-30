const runOnce = (func: (...any: any) => void) => {
  let executed = false;
  return (...args: any) => {
    if (!executed) {
      executed = true;
      func(...args);
    }
  };
};

export default runOnce;
