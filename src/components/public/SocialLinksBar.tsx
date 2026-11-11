import { DEFAULT_SOCIAL_LINKS, resolveSocialLinks, type SocialLinksConfig } from "@/lib/constants/social";

interface SocialLinksBarProps {
  links?: Partial<SocialLinksConfig> | null;
  variant?: "dark" | "light" | "compact";
  showLabels?: boolean;
}

export function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function SocialLinksBar({
  links = DEFAULT_SOCIAL_LINKS,
  variant = "dark",
  showLabels = false,
}: SocialLinksBarProps) {
  const resolved = resolveSocialLinks(links);

  const items = [
    {
      name: "YouTube",
      href: resolved.youtube,
      Icon: YouTubeIcon,
      darkHover: "hover:bg-solar-green hover:border-solar-green hover:text-white",
      lightStyle: "text-navy-800 bg-slate-bg border-slate-border hover:bg-navy-800 hover:border-navy-800 hover:text-white",
    },
    {
      name: "Instagram",
      href: resolved.instagram,
      Icon: InstagramIcon,
      darkHover: "hover:bg-solar-green hover:border-solar-green hover:text-white",
      lightStyle: "text-navy-800 bg-slate-bg border-slate-border hover:bg-navy-800 hover:border-navy-800 hover:text-white",
    },
    {
      name: "Facebook",
      href: resolved.facebook,
      Icon: FacebookIcon,
      darkHover: "hover:bg-solar-green hover:border-solar-green hover:text-white",
      lightStyle: "text-navy-800 bg-slate-bg border-slate-border hover:bg-navy-800 hover:border-navy-800 hover:text-white",
    },
  ].filter((item) => Boolean(item.href));

  if (items.length === 0) return null;

  if (variant === "compact") {
    return (
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
        {items.map(({ name, href, Icon, lightStyle }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow VIJOY POWER SOLUTION on ${name}`}
            className={`h-9 flex items-center justify-center gap-1.5 rounded-lg border transition-colors ${lightStyle}`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{name}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {items.map(({ name, href, Icon, darkHover, lightStyle }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow VIJOY POWER SOLUTION on ${name}`}
          title={name}
          className={
            variant === "dark"
              ? `inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-800 border border-navy-700 text-slate-200 text-xs font-semibold transition-all ${darkHover}`
              : `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${lightStyle}`
          }
        >
          <Icon className="w-4 h-4 shrink-0" />
          {showLabels && <span>{name}</span>}
        </a>
      ))}
    </div>
  );
}
