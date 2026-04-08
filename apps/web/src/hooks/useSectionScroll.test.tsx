import { renderHook, act } from "@testing-library/react";
import { SECTION_EVENT, type SectionId } from "@/lib/section-navigation";
import { useSectionScroll } from "./useSectionScroll";

const SECTION_IDS = [
  "momo",
  "buffett",
  "company",
  "quiz",
  "agentgame",
] as const satisfies readonly SectionId[];

function installAnimationFrameStub() {
  let nextHandle = 0;

  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    nextHandle += 1;
    callback(performance.now());
    return nextHandle;
  });
  vi.stubGlobal("cancelAnimationFrame", () => undefined);
}

async function settleTransition(duration = 300) {
  await act(async () => {
    vi.advanceTimersByTime(duration);
    await Promise.resolve();
  });
}

describe("useSectionScroll", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installAnimationFrameStub();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("moves to a target section and unlocks after the transition", async () => {
    const { result } = renderHook(() =>
      useSectionScroll({
        sectionIds: SECTION_IDS,
        quizIndex: 3,
        transitionDurationMs: 300,
        rotateIntervalMs: 10_000,
      })
    );

    act(() => {
      result.current.startTransition("down", 1);
    });

    expect(result.current.locked).toBe(true);
    expect(result.current.incoming).toBe(1);

    await settleTransition();

    expect(result.current.active).toBe(1);
    expect(result.current.incoming).toBeNull();
    expect(result.current.locked).toBe(false);
  });

  it("auto-rotates after the idle delay", async () => {
    const { result } = renderHook(() =>
      useSectionScroll({
        sectionIds: SECTION_IDS,
        quizIndex: 3,
        transitionDurationMs: 300,
        rotateIntervalMs: 1_000,
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(1_100);
      await Promise.resolve();
      vi.advanceTimersByTime(300);
    });

    expect(result.current.active).toBe(1);
  });

  it("pauses during quiz interaction and resumes to the next panel on exit", async () => {
    const { result } = renderHook(() =>
      useSectionScroll({
        sectionIds: SECTION_IDS,
        quizIndex: 3,
        transitionDurationMs: 300,
        rotateIntervalMs: 10_000,
      })
    );

    act(() => {
      result.current.startTransition("down", 3);
    });
    await settleTransition();

    act(() => {
      result.current.handleQuizInteract();
    });

    expect(result.current.rotationPaused).toBe(true);

    act(() => {
      result.current.handleQuizExit();
    });
    await settleTransition();

    expect(result.current.rotationPaused).toBe(false);
    expect(result.current.active).toBe(4);
  });

  it("listens to section change events from the navigation layer", async () => {
    const { result } = renderHook(() =>
      useSectionScroll({
        sectionIds: SECTION_IDS,
        quizIndex: 3,
        transitionDurationMs: 300,
        rotateIntervalMs: 10_000,
      })
    );

    act(() => {
      window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail: "company" }));
    });
    await settleTransition();

    expect(result.current.active).toBe(2);
  });
});
