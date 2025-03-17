type VibrateCallback = () => Promise<void>;

export const checkVibrate = async (
  callback: VibrateCallback
): Promise<void> => {
  if (typeof navigator.vibrate === 'function') {
    await callback(); // Execute the provided Haptics functio
  }

  return;
};
