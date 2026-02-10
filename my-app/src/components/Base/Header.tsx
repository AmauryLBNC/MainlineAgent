import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full">
      <div className="md:hidden px-4 pt-6">
        <div className="group relative overflow-hidden   bg-enterprise-card/90  shadow-lg backdrop-blur">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-enterprise-overlay" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-enterprise-cta text-enterprise-cta text-base font-bold shadow-md">
                MA
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-enterprise-strong">MainAgent</p>
                <p className="text-xs text-enterprise-soft">AI learning suite</p>
              </div>
            </div>
            <Button asChild size="sm" variant="login" className="bg-enterprise-card/60 text-enterprise-strong">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block px-6 pt-8">
          <div className="group relative overflow-hidden  bg-enterprise-card/90 shadow-xl backdrop-blur">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-enterprise-overlay" />
            <div className="relative flex items-center justify-between gap-6 px-6 py-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-enterprise-cta text-enterprise-cta text-base font-bold shadow-md">
                  MA
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-enterprise-strong">MainAgent</p>
                  <p className="text-xs text-enterprise-soft">AI learning suite</p>
                </div>
              </div>

              <nav className="flex items-center justify-center gap-2 text-sm font-semibold text-enterprise-soft">
                <Button asChild size="sm" variant="ghost" className="text-enterprise-soft hover:text-enterprise-strong hover:bg-white/10">
                  <Link href="/login">Home</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="text-enterprise-soft hover:text-enterprise-strong hover:bg-white/10">
                  <Link href="/login">MainGame</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="text-enterprise-soft hover:text-enterprise-strong hover:bg-white/10">
                  <Link href="/login">MainLessons</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="text-enterprise-soft hover:text-enterprise-strong hover:bg-white/10">
                  <Link href="/login">MainRating</Link>
                </Button>
              </nav>

              <div className="flex flex-1 items-center justify-end gap-3">
                <Button asChild size="sm" variant="login" className="bg-enterprise-card/60 text-enterprise-strong hover:bg-enterprise-card">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" variant="signin">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
    </header>
  );
}
