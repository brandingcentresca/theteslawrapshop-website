import {
  SprayCan,
  Sticker,
  ShieldCheck,
  BadgeCheck,
  Search,
  Lock,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  SprayCan,
  Sticker,
  ShieldCheck,
  BadgeCheck,
  Search,
  Lock,
};

export function Icon({
  name,
  className,
  size = 24,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Cmp = map[name] ?? BadgeCheck;
  return <Cmp className={className} size={size} />;
}
