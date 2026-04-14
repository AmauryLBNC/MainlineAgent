import { SECTION_EVENT, requestSection } from "./section-navigation";

describe("requestSection", () => {
  it("dispatches the section custom event with the requested id", () => {
    const listener = vi.fn();
    window.addEventListener(SECTION_EVENT, listener as EventListener);

    requestSection("quiz");

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail).toBe("quiz");

    window.removeEventListener(SECTION_EVENT, listener as EventListener);
  });
});
