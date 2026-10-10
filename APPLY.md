# Frontend fix: restore 3D Bitget Thesis Desk on Vercel

## Problem
https://irohteashop.vercel.app shows a **flat Tailwind dashboard** because
`src/app/page.tsx` was replaced with InstrumentSearch / EvidencePanel.

Reference https://iroh-tea-shop.up.railway.app uses **TeaRoomShell** (3D room + stations).

Backend Bitget APIs stay. Frontend must re-enter the room.

## Apply on https://github.com/TonyLegend-77/Iroh

```bash
git clone https://github.com/TonyLegend-77/Iroh.git
cd Iroh
```

### 1. Restore entry (critical)

Copy:
- `page.tsx` → `src/app/page.tsx`
- `layout.tsx` → `src/app/layout.tsx`

### 2. Host session

Copy:
- `session.ts` → `src/chat/session.ts` (create `src/chat/` if missing)

### 3. TeaRoomShell props

TonyLegend still has `nansen: NansenAvailability` required.
Use our `TeaRoomShell.tsx` **or** change the signature to:

```tsx
export default function TeaRoomShell({
  user,
}: {
  user: PublicUser | null;
}) {
```

Remove nansen state polling. Keep `research="bitget"` on IrohChat.

### 4. Host chat

Copy `IrohChat.tsx` → `src/ui/IrohChat.tsx` (stock copy + researchSymbol + send to API).

### 5. Shelf + teasers + theses

- `SmartWalletShelf.tsx` → coverage messaging (no wallets)
- `stationTeasers.tsx` → stock language
- `deck.ts` → stock theses (AAPL, TSLA, …)

### 6. Research route (if not already on backend deploy)

- `research-route.ts` → `src/app/api/bitget/research/route.ts`
- Ensure import path matches your MCP client location

### 7. Optional: keep flat dashboard at /lab

Move old page components to `src/app/lab/page.tsx` if you still want the Tailwind desk.

### 8. Deploy

```bash
# Vercel env: QWEN_API_KEY, QWEN_BASE_URL, QWEN_MODEL, DATABASE_URL
git add -A && git commit -m "Restore 3D Thesis Desk; Bitget stock frontend"
git push
```

### Accept

Visitor sees waiting room / 3D shop (like reference), not slate-50 search grid.
Counter = stock theses + search. Host = Qwen + Bitget. No Nansen title.
