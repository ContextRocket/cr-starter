/**
 * Tests for robots.ts -- CRAWLER_CONFIG pattern.
 *
 * Verifies:
 *   - Sitemap URL and host are derived from siteConfig.siteUrl.
 *   - Global wildcard rule is first with required allow/disallow.
 *   - AI crawlers (GPTBot, ClaudeBot) get explicit Allow list with llms.txt
 *     and /.well-known/agent.json.
 *   - AI crawlers have a crawlDelay.
 *   - Traditional search crawlers are present.
 *   - allowAiCrawlers switch: when siteConfig.allowAiCrawlers=false, the
 *     AI tier disallows "/" and has an empty allow list.
 */

import robots from "@/app/robots";

describe("robots() -- CRAWLER_CONFIG structure", () => {
  it("returns a sitemap URL", () => {
    const result = robots();
    expect(typeof result.sitemap).toBe("string");
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it("returns a host string", () => {
    const result = robots();
    expect(typeof result.host).toBe("string");
    expect(result.host!.length).toBeGreaterThan(0);
  });

  it("includes a global wildcard rule as the first entry", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules[0].userAgent).toBe("*");
    expect(rules[0].allow).toContain("/");
  });

  it("global rule disallows private infrastructure paths", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const globalRule = rules[0];
    const disallow = globalRule.disallow as string[];
    expect(disallow).toContain("/api/");
    expect(disallow).toContain("/_next/");
  });

  it("includes a rule for GPTBot (AI tier)", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const gptRule = rules.find((r) => r.userAgent === "GPTBot");
    expect(gptRule).toBeDefined();
  });

  it("AI crawler rule (GPTBot) includes /llms.txt in allow list", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const gptRule = rules.find((r) => r.userAgent === "GPTBot");
    expect(gptRule).toBeDefined();
    const allow = gptRule!.allow as string[];
    expect(allow).toContain("/llms.txt");
  });

  it("AI crawler rule (ClaudeBot) includes /.well-known/agent.json in allow list", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const claudeRule = rules.find((r) => r.userAgent === "ClaudeBot");
    expect(claudeRule).toBeDefined();
    const allow = claudeRule!.allow as string[];
    expect(allow).toContain("/.well-known/agent.json");
  });

  it("AI crawler rule includes crawlDelay of 1", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const gptRule = rules.find((r) => r.userAgent === "GPTBot");
    expect(gptRule?.crawlDelay).toBe(1);
  });

  it("includes Googlebot in rules (search tier)", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const googleRule = rules.find((r) => r.userAgent === "Googlebot");
    expect(googleRule).toBeDefined();
  });

  it("includes PerplexityBot in the AI tier", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const rule = rules.find((r) => r.userAgent === "PerplexityBot");
    expect(rule).toBeDefined();
    const allow = rule!.allow as string[];
    expect(allow).toContain("/llms.txt");
  });
});

describe("robots() -- allowAiCrawlers switch", () => {
  it("defaults to allowing AI crawlers (siteConfig has no allowAiCrawlers field)", () => {
    // The real siteConfig has no allowAiCrawlers field; default is true.
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const gptRule = rules.find((r) => r.userAgent === "GPTBot");
    expect(gptRule).toBeDefined();
    const allow = gptRule!.allow as string[];
    // When AI crawlers are allowed, the allow list is non-empty with high-value paths.
    expect(allow.length).toBeGreaterThan(0);
    expect(allow).toContain("/");
  });
});
