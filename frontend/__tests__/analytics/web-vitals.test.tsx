import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { analytics } from "@/config/site.config";
import { WebVitals } from "@/components/shared/analytics/web-vitals";

// Capture the callback Next would invoke when a metric is measured, so the
// test can drive it directly with a fake metric.
let reportCallback: ((metric: unknown) => void) | null = null;

vi.mock("next/web-vitals", () => ({
  useReportWebVitals: (cb: (metric: unknown) => void) => {
    reportCallback = cb;
  },
}));

const FAKE_METRIC = {
  name: "LCP",
  value: 1234.5,
  id: "v1-abc",
  rating: "good",
  navigationType: "navigate",
  delta: 1234.5,
};

describe("WebVitals", () => {
  const originalEndpoint = analytics.webVitalsEndpoint;
  let sendBeacon: ReturnType<typeof vi.fn>;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    reportCallback = null;
    sendBeacon = vi.fn(() => true);
    Object.defineProperty(navigator, "sendBeacon", {
      value: sendBeacon,
      configurable: true,
      writable: true,
    });
    fetchMock = vi.fn(() => Promise.resolve(new Response()));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    analytics.webVitalsEndpoint = originalEndpoint;
    vi.unstubAllGlobals();
  });

  it("renders nothing", () => {
    analytics.webVitalsEndpoint = "";
    const { container } = render(<WebVitals />);

    expect(container.innerHTML).toBe("");
  });

  it("does not send any beacon when the endpoint is unconfigured", () => {
    analytics.webVitalsEndpoint = "";
    render(<WebVitals />);

    reportCallback?.(FAKE_METRIC);

    expect(sendBeacon).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the metric payload via sendBeacon when configured", () => {
    analytics.webVitalsEndpoint = "https://rum.example.com/collect";
    render(<WebVitals />);

    reportCallback?.(FAKE_METRIC);

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [url, blob] = sendBeacon.mock.calls[0];
    expect(url).toBe("https://rum.example.com/collect");
    expect(blob).toBeInstanceOf(Blob);
    expect((blob as Blob).type).toBe("application/json");
    // fetch is only a fallback; sendBeacon present means it is not used.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("falls back to fetch(keepalive) when sendBeacon is unavailable", () => {
    analytics.webVitalsEndpoint = "https://rum.example.com/collect";
    Object.defineProperty(navigator, "sendBeacon", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    render(<WebVitals />);

    reportCallback?.(FAKE_METRIC);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://rum.example.com/collect");
    expect(init).toMatchObject({ method: "POST", keepalive: true });
    expect(JSON.parse(init.body as string)).toMatchObject({
      name: "LCP",
      value: 1234.5,
      id: "v1-abc",
      rating: "good",
      navigationType: "navigate",
    });
  });
});
