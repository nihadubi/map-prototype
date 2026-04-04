import { Link } from 'react-router-dom';
import { useAuth } from '../app/providers/useAuth';

const featureItems = [
  {
    title: 'Map-First Discovery',
    description: 'See the city as a live surface of places and events, not a messy list of disconnected posts.',
    icon: 'travel_explore',
  },
  {
    title: 'Event + Place Pins',
    description: 'Distinct pin types make it obvious what is happening now and what is worth saving for later.',
    icon: 'place_item',
  },
  {
    title: 'Community Curation',
    description: 'Add discoveries directly from the map and help shape a sharper city layer for Baku and Azerbaijan.',
    icon: 'group',
  },
];

const steps = [
  {
    title: 'Enter the live map',
    description: 'Start in a fullscreen city view built for orientation, contrast, and fast discovery.',
  },
  {
    title: 'Read the city quickly',
    description: 'Search, scan markers, and inspect event or place details without leaving the main canvas.',
  },
  {
    title: 'Publish from the map',
    description: 'Click a location, open the slide-in panel, and create a new pin without breaking the flow.',
  },
];

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-[#070b11] text-slate-100">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(202,152,255,0.18),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(0,244,254,0.14),transparent_24%),linear-gradient(180deg,#070b11_0%,#090d14_45%,#0a0e14_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="pointer-events-none absolute inset-x-0 top-[-8rem] h-[24rem] bg-[radial-gradient(circle,rgba(202,152,255,0.26),transparent_52%)] blur-3xl" />

        <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl sm:px-6">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <span className="material-symbols-outlined text-[1.9rem] text-[#ca98ff]" aria-hidden="true">layers</span>
              <div>
                <div className="font-[Manrope] text-xl font-extrabold tracking-[-0.04em] text-slate-50">UndrPin</div>
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-slate-500">Map-First City Discovery</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-3 md:flex">
              <a href="#features" className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 no-underline transition hover:bg-white/5 hover:text-white">Features</a>
              <a href="#how-it-works" className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 no-underline transition hover:bg-white/5 hover:text-white">How It Works</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to={isAuthenticated ? '/app' : '/auth'}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ca98ff] to-[#b283ff] px-4 py-2.5 text-sm font-bold text-[#1b1023] no-underline shadow-[0_16px_36px_rgba(202,152,255,0.28)] transition hover:translate-y-[-1px]"
              >
                <span>{isAuthenticated ? 'Open Map' : 'Get Access'}</span>
              </Link>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-16 py-14 lg:grid-cols-[minmax(0,1.04fr)_minmax(22rem,0.96fr)] lg:py-24">
            <section className="max-w-3xl">
              <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-violet-300">
                Premium city discovery for Baku
              </div>

              <h1 className="mt-6 max-w-4xl font-[Manrope] text-5xl font-extrabold leading-[0.9] tracking-[-0.065em] text-white sm:text-6xl lg:text-[5.2rem]">
                Find the city through what is actually happening and worth visiting.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                UndrPin turns Baku into a live, curated city layer. Explore underrated places, discover events faster, and publish your own finds directly from the map instead of bouncing through generic feeds.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-gradient-to-r from-[#ca98ff] via-[#b283ff] to-[#00f4fe] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#090b11] no-underline shadow-[0_24px_54px_rgba(202,152,255,0.28)] transition hover:translate-y-[-1px]"
                >
                  Enter the Map
                </Link>
                <Link
                  to={isAuthenticated ? '/app?openCreate=1' : '/auth'}
                  className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-bold text-slate-200 no-underline backdrop-blur-xl transition hover:bg-white/[0.08]"
                >
                  {isAuthenticated ? 'Create Your Pin' : 'Sign In to Create'}
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span>Map-first UX</span>
                <span className="text-slate-700" aria-hidden="true">•</span>
                <span>Live event + place pins</span>
                <span className="text-slate-700" aria-hidden="true">•</span>
                <span>Community-curated Baku layer</span>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-slate-500">Region</div>
                  <div className="mt-2 text-sm font-semibold text-slate-100">Baku + Azerbaijan</div>
                </div>
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-slate-500">Core Feel</div>
                  <div className="mt-2 text-sm font-semibold text-slate-100">Dark, map-first, direct</div>
                </div>
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-slate-500">Creation</div>
                  <div className="mt-2 text-sm font-semibold text-slate-100">In-map pin publishing</div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="absolute inset-x-[10%] top-[8%] h-32 rounded-full bg-[radial-gradient(circle,rgba(202,152,255,0.28),transparent_62%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,21,0.92),rgba(8,12,19,0.86))] p-5 shadow-[0_34px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
                <div className="rounded-[1.6rem] border border-white/10 bg-[#0a0e14] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-cyan-300">Live City Layer</div>
                      <div className="mt-1 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-white">Built for clarity at first glance</div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">UndrPin</div>
                  </div>

                  <div className="relative overflow-hidden rounded-[1.6rem] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(202,152,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,244,254,0.14),transparent_26%),linear-gradient(180deg,#0b111d_0%,#09101a_100%)] p-5">
                    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />
                    <div className="relative grid gap-4">
                      <div className="flex items-center justify-between rounded-full border border-white/8 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                        <div className="flex items-center gap-3 text-slate-300">
                          <span className="material-symbols-outlined text-[#ca98ff]" aria-hidden="true">search</span>
                          <span className="text-sm">Search places, events, or categories</span>
                        </div>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-400">Baku</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
                        <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-3">
                          <div className="grid gap-2">
                            <div className="rounded-[1rem] bg-violet-500/10 px-3 py-2 text-xs font-bold text-violet-200">Discover</div>
                            <div className="rounded-[1rem] bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300">Events</div>
                            <div className="rounded-[1rem] bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300">Saved</div>
                          </div>
                        </div>

                        <div className="relative min-h-[22rem] rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(11,16,27,0.88),rgba(8,12,19,0.94))] p-4">
                          <div className="absolute left-[18%] top-[24%] flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/25 bg-[linear-gradient(180deg,rgba(8,11,18,0.98),rgba(4,7,12,0.96))] text-xs font-black text-cyan-50 shadow-[0_0_24px_rgba(0,244,254,0.25)]">
                            E
                          </div>
                          <div className="absolute right-[24%] top-[36%] flex h-10 w-10 items-center justify-center rounded-full border border-violet-200/25 bg-[linear-gradient(180deg,rgba(8,11,18,0.98),rgba(4,7,12,0.96))] text-xs font-black text-violet-50 shadow-[0_0_24px_rgba(202,152,255,0.25)]">
                            P
                          </div>
                          <div className="absolute left-[42%] bottom-[26%] flex h-10 w-10 items-center justify-center rounded-full border border-violet-200/25 bg-[linear-gradient(180deg,rgba(8,11,18,0.98),rgba(4,7,12,0.96))] text-xs font-black text-violet-50 shadow-[0_0_24px_rgba(202,152,255,0.28)]">
                            P
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 rounded-[1.35rem] border border-white/10 bg-[rgba(8,12,19,0.78)] p-4 backdrop-blur-xl">
                            <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-cyan-300">Selected Pin</div>
                            <div className="mt-2 font-[Manrope] text-xl font-extrabold tracking-[-0.04em] text-white">Late-night live set</div>
                            <p className="mt-2 text-sm leading-6 text-slate-400">The product stays centered on one thing: discover, inspect, and contribute without leaving the map.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>

      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="mb-12 max-w-2xl">
          <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.24em] text-slate-500">Core Features</div>
          <h2 className="mt-3 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-white">A tighter city product with a clearer point of view.</h2>
          <p className="mt-4 text-base leading-8 text-slate-400">
            Everything is designed to reduce noise, speed up discovery, and keep contribution close to the live map itself.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featureItems.map((item) => (
            <article key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(2,6,23,0.24)] backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-white/[0.05] text-[#ca98ff]">
                <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
              </div>
              <div className="mt-5 text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-slate-500">Feature</div>
              <h3 className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-7xl px-6 py-4 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,21,0.9),rgba(8,12,19,0.88))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.24em] text-slate-500">How It Works</div>
            <h2 className="mt-3 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-white">A clean loop from finding to publishing.</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              The flow is intentionally short: open the city, understand the map, and add something new without breaking context.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#ca98ff] to-[#00f4fe] text-sm font-black text-[#0a0e14]">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(202,152,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,244,254,0.1),transparent_24%),linear-gradient(180deg,rgba(10,14,21,0.92),rgba(8,12,19,0.9))] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-10">
          <div className="mx-auto max-w-3xl">
            <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.24em] text-slate-500">Start Exploring</div>
            <h2 className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
              Open the city, read it faster, and add something worth keeping.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-400">
              UndrPin is built for people who want a sharper way to discover Baku: less noise, better signals, and a map that stays at the center of the product.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/app"
                className="inline-flex items-center justify-center rounded-[1.15rem] bg-gradient-to-r from-[#ca98ff] to-[#b283ff] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#100916] no-underline shadow-[0_18px_40px_rgba(202,152,255,0.26)] transition hover:translate-y-[-1px]"
              >
                Open the Map
              </Link>
              <Link
                to={isAuthenticated ? '/app?openCreate=1' : '/auth'}
                className="inline-flex items-center justify-center rounded-[1.15rem] border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-bold text-slate-200 no-underline backdrop-blur-xl transition hover:bg-white/[0.08]"
              >
                {isAuthenticated ? 'Create Your First Pin' : 'Sign In'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
