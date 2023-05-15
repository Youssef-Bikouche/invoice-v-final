export const checkINPUTS = (username, password, setinputCOLOR) => {
  if (username.length <= 0 && password.length <= 0) {
    setinputCOLOR(true);
    setTimeout(() => {
      setinputCOLOR(false);
    }, 2000);
    return false;
  } else if (username.length <= 0 || password.length <= 0) {
    setinputCOLOR(true);
    setTimeout(() => {
      setinputCOLOR(false);
    }, 2000);
    return false;
  } else {
    setinputCOLOR(false);
    return true;
  }
};
