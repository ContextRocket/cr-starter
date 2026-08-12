export const dynamic = "force-static";

/**
 * Root redirect — send all requests to the locale-prefixed route.
 * In static export, this generates a static redirect page.
 */
export default function Page() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] p-8"
      data-testid="dashboard-guest-prompt"
    >
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground mb-6">
          The dashboard is not available in the static demo.
        </p>
      </div>
    </div>
  );
}
