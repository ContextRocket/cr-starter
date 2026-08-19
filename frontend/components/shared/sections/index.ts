/**
 * Reusable section components for the cr-starter.
 *
 * Each component accepts data as props. Fork owners provide their own
 * content arrays and the component handles layout and styling. All
 * styles use siteConfig.theme tokens.
 */

export { HeroSection, type HeroProps } from "./hero";
export { FeatureGrid, type FeatureGridProps } from "./feature-grid";
export { TestimonialGrid, type TestimonialGridProps } from "./testimonial-grid";
export {
  TestimonialsSection,
  type TestimonialsSectionProps,
} from "./testimonials-section";
export { StatsBar, type StatsBarProps } from "./stats-bar";
export { CtaSection, type CtaSectionProps } from "./cta-section";
export {
  CtaSubscribeSection,
  type CtaSubscribeSectionProps,
} from "./cta-subscribe-section";
export { FaqSection, type FaqSectionProps } from "./faq-section";
export {
  FeaturedArticles,
  type FeaturedArticlesProps,
} from "./featured-articles";
export {
  IntegrationsSection,
  type IntegrationsSectionProps,
  type IntegrationsLogo,
} from "./integrations-section";
export { LogoCloud, type LogoCloudProps } from "./logo-cloud";
export { FooterSection, type FooterSectionProps } from "./footer-section";
export { Navbar, type NavbarProps, type NavLink } from "./navbar";
export { InsightCard, type InsightCardProps } from "./insight-card";
export { SectionWrapper, type SectionWrapperProps } from "./section-wrapper";
export { ScrollReveal, type ScrollRevealProps } from "./scroll-reveal";
export { SectionHeader, type SectionHeaderProps } from './section-header';
export {
  PricingSection,
  type PricingSectionProps,
  type PricingTier,
} from "./pricing-section";
export {
  TeamSection,
  type TeamSectionProps,
  type TeamMember,
} from "./team-section";
export {
  HeroInsights,
  type HeroInsightsProps,
  type HeroInsightsGridProps,
  type HeroInsightsOverlayProps,
  type HeroInsightsContent,
  type HeroInsightItem,
  type HeroInsightCard,
} from "./hero-insights";
export {
  AttributionSection,
  type AttributionSectionProps,
} from "./attribution-section";
export {
  StatusPage,
  type StatusPageProps,
  type StatusTone,
} from "./status-page";
export {
  NotificationBar,
  NotificationBarStack,
  type NotificationBarProps,
  type NotificationBarStackProps,
  type NotificationItem,
  type NotificationTone,
} from "./notification-bar";

// Badge widgets
export {
  BadgeWidget,
  ContextRocketBadge,
} from "../ui/badge-widget";
