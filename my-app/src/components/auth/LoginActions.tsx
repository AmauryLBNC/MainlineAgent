"use client";

import { signIn } from "next-auth/react";
import { Github, Globe, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type LoginActionsProps = {
  callbackUrl: string;
};

const providerIcons: Record<string, LucideIcon> = {
  github: Github,
  google: Globe,
};

const providers = [
  { id: "google", name: "Google" },
  { id: "github", name: "GitHub" },
];

export function LoginActions({ callbackUrl }: LoginActionsProps) {
  return (
    <div className="mt-8 flex flex-col gap-3">
      {providers.map((provider) => {
        const Icon = providerIcons[provider.id] ?? Globe;

        return (
          <Button
            key={provider.id}
            variant="signin"
            size="lg"
            className="justify-between rounded-2xl px-5"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl,
              })
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="size-4" />
              Sign in with {provider.name}
            </span>
            <span className="text-xs uppercase tracking-[0.3em] text-primary-foreground/70">
              OAuth
            </span>
          </Button>
        );
      })}
    </div>
  );
}
