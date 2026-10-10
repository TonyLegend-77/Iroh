/**
 * Shelf station — stock research coverage board (Bitget-only).
 * No wallet leaderboards.
 */
export function SmartWalletShelf(_props: {
  nansen?: string;
  research?: string;
}) {
  return (
    <section className="shelf-panel" aria-label="Research coverage shelf">
      <header>
        <p className="eyebrow">Shelf · Bitget Reality</p>
        <h2>Research coverage</h2>
      </header>
      <p>
        Wallet and trader rankings from the old on-chain build are gone. This
        station will surface catalog-wide signal coverage for Reality stocks —
        what is verified, stale, or still unchecked — without inventing
        leaderboards.
      </p>
      <p>
        Open the <strong>Counter</strong> to search any instrument in the live
        catalog, or ask the <strong>Host</strong> about a stock with Qwen.
      </p>
    </section>
  );
}
