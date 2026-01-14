export const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isMacTouch = /MacIntel/.test(ua) && navigator.maxTouchPoints > 1;
  return isIOS || isMacTouch;
};
