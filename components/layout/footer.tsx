import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Separator } from '@/components/ui/separator';
import { footerNav } from '@/config/nav';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-border/40 bg-background/40 mt-24 border-t">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-semibold">
              <span className="bg-primary/20 ring-primary/30 grid h-8 w-8 place-items-center rounded-lg ring-1">
                <span className="bg-primary h-3 w-3 rounded-sm" />
              </span>
              {siteConfig.name}
            </div>
            <p className="text-muted-foreground mt-3 max-w-sm text-sm text-pretty">
              {siteConfig.description}
            </p>
          </div>

          <FooterColumn title="Discover" items={footerNav.discover} />
          <FooterColumn title="Company" items={footerNav.company} />
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col items-start justify-between gap-4 text-xs md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            {footerNav.legal.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <div>
      <p className="text-foreground text-xs font-semibold tracking-widest uppercase">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
