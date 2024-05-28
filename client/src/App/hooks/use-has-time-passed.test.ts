import { act, renderHook } from '@testing-library/react';

import { useHasTimePassed } from './use-has-time-passed';

const shortDelay = 50;

describe('useHasTimePassed', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns false when no time has passed', () => {
    const { result } = renderHook(useHasTimePassed);
    expect(result.current).toBe(false);
  });

  it('returns true once the default duration has elapsed', () => {
    const { result } = renderHook(useHasTimePassed);
    expect(result.current).toBe(false);

    act(() => jest.runAllTimers());
    expect(result.current).toBe(true);
  });

  it('returns true once a custom duration has elapsed', () => {
    const { result } = renderHook(() => useHasTimePassed(5000));
    expect(result.current).toBe(false);

    act(() => jest.runAllTimers());
    expect(result.current).toBe(true);
  });

  it('does not return true if unmounted before the duration has elapsed', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { result, unmount } = renderHook(useHasTimePassed);
    act(() => jest.advanceTimersByTime(shortDelay));

    expect(result.current).toBe(false);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);

    unmount();
    act(() => jest.runAllTimers());

    expect(result.current).toBe(false);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  
    // fake timers need to be restored after spying
    // spying on timers appears to wipe out faked implementations
    clearTimeoutSpy.mockRestore();
  });

  it.each([
    { hasElapsed: false, beforeOrAfter: 'before' },
    { hasElapsed: true, beforeOrAfter: 'after' },
  ])('does not restart the timer if rerendered $beforeOrAfter ' +
  'the duration has elapsed (hasElapsed=$hasElapsed)', ({ hasElapsed }) => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const { rerender, result } = renderHook(useHasTimePassed);
    act(() => hasElapsed ?
      jest.runAllTimers() :
      jest.advanceTimersByTime(shortDelay));

    expect(result.current).toBe(hasElapsed);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);

    rerender();
    act(() => hasElapsed ?
      jest.runAllTimers() :
      jest.advanceTimersByTime(shortDelay));

    expect(result.current).toBe(hasElapsed);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);

    // fake timers need to be restored after spying
    // spying on timers appears to wipe out faked implementations
    clearTimeoutSpy.mockRestore();
    setTimeoutSpy.mockRestore();
  });
});
