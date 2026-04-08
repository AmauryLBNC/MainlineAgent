"use client";

import { signIn } from "next-auth/react";
import { Github, Globe, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type LoginActionsProps = {
  callbackUrl: string;
  signInWith: string;
  oauthLabel: string;
};

const providerIcons: Record<string, LucideIcon> = {
  github: Github,
  google: Globe,
};

const providers = [
  { id: "google", name: "Google" },
  { id: "github", name: "GitHub" },
];

export function LoginActions({
  callbackUrl,
  signInWith,
  oauthLabel,
}: LoginActionsProps) {
  return (
    <div className="mt-8 grid gap-3">
      {providers.map((provider) => {
        const Icon = providerIcons[provider.id] ?? Globe;

        return (
          <Button
            key={provider.id}
            variant={provider.id === "google" ? "default" : "outline"}
            size="lg"
            className="h-14 justify-between rounded-2xl px-5 text-sm"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl,
              })
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="size-4" />
              {signInWith} {provider.name}
            </span>
            <Badge
              variant={provider.id === "google" ? "secondary" : "outline"}
              className="rounded-full px-2.5"
            >
              {oauthLabel}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
