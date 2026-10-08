import {
  ArrowRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Building2,
  CalendarCheck,
  Coins,
  Flame,
  Handshake,
  HeartPulse,
  Info,
  Mail,
  Milk,
  ScrollText,
  Sparkles,
  Sprout,
  Tractor,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { BannerVideo, SplitHeading, StepsProgress, VelocityMarquee } from "@/components/gsap";
import { CountUp, Floating, MotionRoot, Parallax, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { contact, getDictionary, hasLocale, plans } from "./dictionaries";

/** Renders text with **bold** segments. */
function Rich({ text, strong = "text-forest" }: { text: string; strong?: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={`font-bold ${strong}`}>
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.06c-.24.68-1.42 1.3-1.96 1.35-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.1-1.47-1.1-2.8 0-1.33.7-1.99.95-2.26.24-.27.53-.34.71-.34l.51.01c.16 0 .38-.06.6.46.23.54.77 1.87.84 2 .07.14.11.3.02.47-.09.18-.13.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.43.11.58-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.88.27.13.45.2.52.31.07.11.07.64-.17 1.32Z" />
    </svg>
  );
}

/** Small rounded label with an icon, shown above each section heading. */
function Eyebrow({ icon: Icon, children, dark = false }: { icon: LucideIcon; children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ${
        dark ? "bg-white/10 text-gold ring-white/15" : "bg-white text-leaf ring-sand"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {children}
    </span>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  lead,
  ta,
  dark = false,
  center = false,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  lead?: string;
  ta: boolean;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Reveal y={20}>
        <Eyebrow icon={icon} dark={dark}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <SplitHeading
        className={`mt-4 font-display font-bold tracking-tight ${dark ? "text-white" : "text-forest"} ${
          ta ? "text-3xl leading-snug sm:text-4xl" : "text-4xl leading-[1.08] sm:text-5xl"
        }`}
      >
        {title}
      </SplitHeading>
      {lead && (
        <Reveal y={20} delay={0.15}>
          <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-cream/75" : "text-ink/70"}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

const benefitIcons: LucideIcon[] = [BadgeIndianRupee, CalendarCheck, Sprout, HeartPulse, Flame, TrendingUp];
const advantageIcons: LucideIcon[] = [CalendarCheck, Coins, BadgeIndianRupee, Sprout, HeartPulse, Flame];
const stepIcons: LucideIcon[] = [Building2, Handshake, Tractor, Milk];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const ta = lang === "ta";

  const navLinks = [
    { href: "#about", label: dict.nav.about },
    { href: "#benefits", label: dict.nav.benefits },
    { href: "#plans", label: dict.nav.plans },
    { href: "#how", label: dict.nav.how },
    { href: "#terms", label: dict.nav.terms },
  ];

  return (
    <MotionRoot>
      <Navbar lang={lang} dict={dict} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-forest text-cream">
          <BannerVideo
            src="/videos/farm-story.mp4"
            poster="/videos/farm-story-poster.jpg"
            label={dict.photos.banner.video}
            start="top top"
          />
          {/* Light shade behind the text only, so the footage stays clear */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent md:via-black/15"
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:py-20">
            <Stagger onMount gap={0.12}>
              <StaggerItem as="p" className={`[text-shadow:0_2px_12px_rgb(0_0_0/0.55)] font-bold text-gold ${ta ? "text-sm" : "text-xs uppercase tracking-[0.18em]"}`}>
                {dict.hero.eyebrow}
              </StaggerItem>
              <StaggerItem
                as="h1"
                className={`[text-shadow:0_2px_12px_rgb(0_0_0/0.55)] mt-4 font-display font-bold text-white ${
                  ta ? "text-3xl leading-snug sm:text-4xl lg:text-5xl lg:leading-tight" : "text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
                }`}
              >
                {dict.hero.title}
              </StaggerItem>
              <StaggerItem as="p" className="[text-shadow:0_2px_12px_rgb(0_0_0/0.55)] mt-5 max-w-xl text-lg leading-relaxed text-white">
                {dict.hero.subtitle}
              </StaggerItem>

              <StaggerItem className="mt-8 flex flex-wrap gap-3">
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-forest-deep shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#ecc272]"
                >
                  <WhatsAppIcon />
                  {dict.hero.primary}
                </a>
                <a
                  href="#plans"
                  className="inline-flex items-center rounded-full border border-cream/40 px-6 py-3 font-semibold text-cream transition-colors hover:bg-white/10"
                >
                  {dict.hero.secondary}
                </a>
              </StaggerItem>

              <StaggerItem as="ul" className="[text-shadow:0_2px_12px_rgb(0_0_0/0.55)] mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white">
                {dict.hero.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {h}
                  </li>
                ))}
              </StaggerItem>
            </Stagger>

            <Reveal delay={0.3} y={60} className="relative mx-auto w-full max-w-md pb-10 md:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40 ring-4 ring-white/10">
                <Parallax className="absolute inset-0" offset={40}>
                  <Image
                    src="/images/photos/cow-and-calf.webp"
                    alt={dict.photos.hero}
                    fill
                    priority
                    sizes="(min-width: 768px) 560px, 100vw"
                    className="kenburns object-cover"
                  />
                </Parallax>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep/40 via-transparent to-transparent" />
              </div>

              {/* calf portrait inset */}
              <Floating className="absolute -bottom-2 -right-2 w-36 overflow-hidden rounded-2xl border-4 border-cream shadow-2xl sm:-right-6 sm:w-44">
                <div className="relative aspect-[4/3]">
                  <Image src="/images/photos/calf-portrait.webp" alt="" fill sizes="180px" className="object-cover" />
                </div>
                <p className="bg-cream px-2 py-1.5 text-center text-xs font-bold text-forest">{dict.photos.calfBadge}</p>
              </Floating>

              {/* years badge */}
              <Floating
                delay={1.5}
                distance={10}
                duration={5}
                className="absolute -left-3 bottom-16 rounded-2xl bg-gold px-4 py-3 text-forest-deep shadow-xl sm:-left-6"
              >
                <p className="font-display text-2xl font-bold leading-none">{dict.photos.badgeTitle}</p>
                <p className="mt-1 text-xs font-semibold">{dict.photos.badgeBody}</p>
              </Floating>

              <Floating delay={0.8} duration={7} className="absolute -left-4 -top-6 w-20 sm:-left-6 sm:w-24">
                <Image
                  src="/images/hoofund-emblem.webp"
                  alt=""
                  width={600}
                  height={604}
                  aria-hidden
                  className="w-full rounded-full bg-cream p-1 shadow-xl"
                />
              </Floating>
            </Reveal>
          </div>
        </section>

        {/* Scrolling highlights */}
        <div className="overflow-hidden border-y border-forest-deep/20 bg-gold py-3 text-forest-deep">
          <VelocityMarquee>
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center">
                {dict.hero.marquee.map((m) => (
                  <li key={m} className="flex items-center gap-6 whitespace-nowrap pr-6 font-bold">
                    <span>{m}</span>
                    <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4 fill-forest">
                      <path d="M10 1c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11Z" />
                    </svg>
                  </li>
                ))}
              </ul>
            ))}
          </VelocityMarquee>
        </div>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader icon={Sparkles} eyebrow={dict.sections.about} title={dict.who.title} ta={ta} />
              <Reveal y={20} delay={0.1}>
                <p className="mt-5 text-lg leading-relaxed text-ink/75">{dict.who.body}</p>
                <div className="mt-8 rounded-3xl border border-sand bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest text-gold">
                      <Users className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="font-display text-xl font-bold text-forest">{dict.what.title}</h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-ink/75">{dict.what.body}</p>
                </div>
              </Reveal>
            </div>

            {/* photo bento */}
            <Reveal y={50} className="grid grid-cols-5 grid-rows-[auto_auto] gap-4">
              <div className="relative col-span-3 row-span-2 min-h-[22rem] overflow-hidden rounded-[2rem] shadow-xl">
                <Image
                  src="/images/photos/cow-grazing.webp"
                  alt={dict.photos.gallery[0].alt}
                  fill
                  sizes="(min-width: 1024px) 340px, 60vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
                <p className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/85 px-4 py-3 text-sm font-semibold text-forest backdrop-blur">
                  {dict.photos.gallery[0].caption}
                </p>
              </div>
              <div className="col-span-2 flex items-center justify-center rounded-[2rem] bg-white p-3 shadow-xl ring-1 ring-sand">
                <Image
                  src="/images/hoofund-logo.webp"
                  alt="Hoofund — Invest in a healthy tomorrow"
                  width={800}
                  height={800}
                  sizes="220px"
                  className="h-auto w-full"
                />
              </div>
              <div className="relative col-span-2 min-h-[10rem] overflow-hidden rounded-[2rem] shadow-xl">
                <Image
                  src="/images/photos/calf-walking.webp"
                  alt={dict.photos.gallery[2].alt}
                  fill
                  sizes="220px"
                  className="object-cover transition duration-700 hover:scale-105"
                />
              </div>
            </Reveal>
          </div>

          {/* stats strip */}
          <Stagger
            gap={0.1}
            className="mt-16 grid grid-cols-2 overflow-hidden rounded-[2rem] bg-forest text-cream shadow-xl lg:grid-cols-4"
          >
            {dict.stats.map((s, i) => (
              <StaggerItem
                key={s.label}
                className={`p-6 sm:p-8 ${i % 2 === 1 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t border-white/10 lg:border-t-0" : ""} ${
                  i === 2 ? "lg:border-l" : ""
                }`}
              >
                <p className="font-display text-3xl font-bold text-gold sm:text-4xl lg:text-5xl">{s.value}</p>
                <p className="mt-2 text-sm leading-snug text-cream/80">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Benefits */}
        <section id="benefits" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader
              icon={Sprout}
              eyebrow={dict.sections.benefits}
              title={dict.benefits.title}
              lead={dict.sections.benefitsLead}
              ta={ta}
              center
            />
            <Stagger gap={0.08} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dict.benefits.items.map((item, i) => {
                const Icon = benefitIcons[i];
                return (
                  <StaggerItem
                    lift
                    key={item}
                    className="group rounded-3xl border border-sand bg-cream/60 p-7 transition-colors hover:border-gold hover:bg-white hover:shadow-xl"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-gold transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <p className="mt-5 text-[1.05rem] leading-relaxed text-ink/80">
                      <Rich text={item} />
                    </p>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* Plans */}
        <section id="plans" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeader
            icon={BadgeIndianRupee}
            eyebrow={dict.sections.plans}
            title={dict.plans.title}
            lead={dict.sections.plansLead}
            ta={ta}
            center
          />

          <Stagger gap={0.1} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {plans.map((p) => {
              const featured = p.id === 5;
              return (
                <StaggerItem
                  as="article"
                  lift
                  key={p.id}
                  className={`relative flex flex-col rounded-[1.75rem] p-6 transition-shadow ${
                    featured
                      ? "bg-gradient-to-b from-forest to-forest-deep text-cream shadow-2xl shadow-forest/30 ring-2 ring-gold lg:-my-3 lg:py-9"
                      : "bg-white shadow-sm ring-1 ring-sand hover:shadow-xl"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold px-3 py-1 text-xs font-bold text-forest-deep shadow">
                      {dict.sections.featured}
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-display text-lg font-bold ${featured ? "text-white" : "text-forest"}`}>
                      {dict.plans.plan} {p.id}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        featured ? "bg-white/15 text-gold" : "bg-cream text-leaf"
                      }`}
                    >
                      {p.cows} {p.cows === 1 ? dict.plans.cow : dict.plans.cowsUnit}
                    </span>
                  </div>

                  <p className={`mt-6 text-xs font-medium ${featured ? "text-cream/70" : "text-ink/55"}`}>{dict.plans.total}</p>
                  <p className={`mt-1 font-display text-[1.7rem] font-bold leading-none ${featured ? "text-gold" : "text-forest"}`}>
                    <CountUp value={p.total} />
                  </p>

                  <dl className={`mt-6 space-y-3 border-t pt-5 text-sm ${featured ? "border-white/15" : "border-sand"}`}>
                    <div>
                      <dt className={featured ? "text-cream/70" : "text-ink/55"}>{dict.plans.investment}</dt>
                      <dd className="font-semibold">{p.investment}</dd>
                    </div>
                    <div>
                      <dt className={featured ? "text-cream/70" : "text-ink/55"}>
                        {dict.plans.monthly} <span className="whitespace-nowrap">({dict.plans.monthlyNote})</span>
                      </dt>
                      <dd className="font-semibold">{p.monthly}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-6">
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                      featured
                        ? "bg-gold text-forest-deep hover:bg-[#ecc272]"
                        : "bg-cream text-forest hover:bg-forest hover:text-cream"
                    }`}
                  >
                    {dict.nav.join}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
          <Reveal y={20}>
            <p className="mx-auto mt-10 flex max-w-4xl gap-3 rounded-2xl bg-white/70 p-5 text-sm leading-relaxed text-ink/70 ring-1 ring-sand">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden />
              {dict.plans.note}
            </p>
          </Reveal>
        </section>

        {/* Farmland banner */}
        <section className="relative h-[26rem] overflow-hidden md:h-[32rem]">
          <Parallax className="absolute inset-0" offset={90}>
            <Image
              src="/images/photos/farmland-plough.webp"
              alt={dict.photos.banner.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/30 to-forest-deep/10" />
          <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col items-start justify-end px-4 pb-12 sm:px-6 md:pb-16">
            <p className={`font-bold text-gold ${ta ? "text-sm" : "text-xs uppercase tracking-[0.18em]"}`}>Hoofund</p>
            <SplitHeading className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
              {dict.photos.banner.title}
            </SplitHeading>
            <a
              href="#plans"
              className="mt-6 inline-flex items-center rounded-full bg-gold px-6 py-3 font-bold text-forest-deep shadow-lg transition hover:bg-[#ecc272]"
            >
              {dict.hero.secondary}
            </a>
          </Reveal>
        </section>

        {/* How it works */}
        <section id="how" className="relative overflow-hidden bg-forest-deep py-20 text-cream md:py-28">
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-leaf/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[24rem] w-[24rem] rounded-full bg-gold/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader icon={Handshake} eyebrow={dict.sections.how} title={dict.how.title} ta={ta} dark />
            <div className="mt-14">
              <StepsProgress>
                <Stagger as="ol" gap={0.2} className="grid gap-4 md:grid-cols-4">
                  {dict.how.steps.map((s, i) => {
                    const Icon = stepIcons[i];
                    const hub = i === 1;
                    return (
                      <StaggerItem
                        as="li"
                        lift
                        key={s.title}
                        className={`relative rounded-3xl p-6 ring-1 backdrop-blur ${
                          hub ? "bg-gold text-forest-deep ring-gold" : "bg-white/5 ring-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                              hub ? "bg-forest-deep text-gold" : "bg-white/10 text-gold"
                            }`}
                          >
                            <Icon className="h-6 w-6" aria-hidden />
                          </span>
                          <span className={`font-display text-4xl font-bold ${hub ? "text-forest-deep/25" : "text-white/15"}`}>
                            0{i + 1}
                          </span>
                        </div>
                        <h3 className={`mt-6 text-lg font-bold ${hub ? "text-forest-deep" : "text-white"}`}>{s.title}</h3>
                        <p className={`mt-2 text-sm leading-relaxed ${hub ? "text-forest-deep/80" : "text-cream/70"}`}>{s.body}</p>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </StepsProgress>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeader icon={Coins} eyebrow={dict.sections.advantages} title={dict.advantages.title} ta={ta} />

          <Stagger gap={0.15} className="mt-12 grid gap-5 md:grid-cols-3">
            {dict.photos.earnings.map((e) => (
              <StaggerItem
                as="article"
                lift
                key={e.src}
                className="group relative min-h-[22rem] overflow-hidden rounded-[2rem] shadow-lg"
              >
                <Image
                  src={`/images/photos/${e.src}.webp`}
                  alt={e.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-110"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-block rounded-full bg-gold px-3 py-1 text-sm font-bold text-forest-deep">{e.title}</span>
                  <p className="mt-3 leading-relaxed text-white">{e.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Stagger gap={0.08} className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dict.advantages.items.map((item, i) => {
              const Icon = advantageIcons[i];
              return (
                <StaggerItem
                  lift
                  key={item}
                  className="flex gap-4 rounded-3xl bg-white p-6 leading-relaxed text-ink/80 shadow-sm ring-1 ring-sand transition-shadow hover:shadow-lg"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-leaf">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="text-[0.95rem]">
                    <Rich text={item} />
                  </p>
                </StaggerItem>
              );
            })}
          </Stagger>

          <Reveal y={20} className="mt-5 flex gap-4 rounded-3xl bg-gradient-to-r from-gold/30 to-gold/10 p-6 leading-relaxed ring-1 ring-gold/40">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-forest-deep">
              <BadgeIndianRupee className="h-5 w-5" aria-hidden />
            </span>
            <p>
              <Rich text={dict.advantages.tax} />
            </p>
          </Reveal>
        </section>

        {/* Terms */}
        <section id="terms" className="bg-white py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeader
                icon={ScrollText}
                eyebrow={dict.sections.terms}
                title={dict.terms.title}
                lead={dict.sections.termsLead}
                ta={ta}
              />
              <Reveal y={30} delay={0.1} className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lg lg:block">
                <Image src="/images/photos/cows-pond.webp" alt="" fill sizes="440px" className="object-cover" />
              </Reveal>
              <Reveal y={20} delay={0.15}>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center gap-3 rounded-2xl bg-cream p-4 font-semibold text-forest ring-1 ring-sand transition hover:ring-gold"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white">
                    <WhatsAppIcon />
                  </span>
                  <span className="text-sm leading-snug">{dict.sections.termsHelp}</span>
                  <ArrowUpRight className="ml-auto h-5 w-5 shrink-0" aria-hidden />
                </a>
              </Reveal>
            </div>

            <Stagger as="ol" gap={0.04} className="divide-y divide-sand rounded-[2rem] bg-cream/50 px-6 ring-1 ring-sand sm:px-8">
              {dict.terms.items.map((t, i) => (
                <StaggerItem as="li" key={i} className="flex gap-5 py-5 text-[0.95rem] leading-relaxed text-ink/80">
                  <span className="w-7 shrink-0 pt-0.5 font-display text-sm font-bold text-earth">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{t}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Call to action */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-forest text-cream shadow-2xl">
            <Image
              src="/images/photos/calf-walking.webp"
              alt=""
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="kenburns object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-forest-deep/90 via-forest-deep/55 to-transparent" />
            <div className="relative max-w-2xl p-8 sm:p-14">
              <Eyebrow icon={Sparkles} dark>
                {dict.contact.eyebrow}
              </Eyebrow>
              <SplitHeading
                className={`mt-5 font-display font-bold text-white ${ta ? "text-3xl leading-snug sm:text-4xl" : "text-4xl leading-tight sm:text-5xl"}`}
              >
                {dict.contact.title}
              </SplitHeading>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-forest-deep shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ecc272]"
                >
                  <WhatsAppIcon />
                  {contact.whatsapp}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20"
                >
                  <Mail className="h-5 w-5" aria-hidden />
                  {dict.contact.email}
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-forest-deep text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/images/hoofund-emblem.webp" alt="" width={600} height={604} className="h-12 w-12 rounded-full bg-cream p-0.5" />
              <span className="font-display text-2xl font-bold text-white">
                Hoo<span className="text-gold">fund</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">{dict.footer.tagline}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gold">{dict.footer.links}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-cream/75 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gold">{dict.footer.contact}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cream/75 hover:text-white"
                >
                  <WhatsAppIcon className="h-4 w-4 text-gold" />
                  {contact.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 break-all text-cream/75 hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-cream/55 sm:px-6 md:flex-row md:justify-between">
            <p>{dict.contact.disclaimer}</p>
            <p className="shrink-0">
              © Hoofund. {dict.footer.rights} · {dict.photos.credit}
            </p>
          </div>
        </div>
      </footer>

      <a
        href={contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.hero.primary}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl shadow-black/25 transition hover:scale-110"
      >
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-40" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </a>
    </MotionRoot>
  );
}
