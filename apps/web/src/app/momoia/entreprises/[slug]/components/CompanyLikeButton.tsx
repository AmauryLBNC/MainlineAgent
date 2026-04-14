"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CompanyLikeButtonProps = {
  slug: string;
  initialLiked: boolean;
  initialLikesCount: number;
  addLabel: string;
  removeLabel: string;
  likesLabel: string;
  loginLabel: string;
};

export function CompanyLikeButton({
  slug,
  initialLiked,
  initialLikesCount,
  addLabel,
  removeLabel,
  likesLabel,
  loginLabel,
}: CompanyLikeButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    if (status !== "authenticated") {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(pathname ?? "/momoia")}`
      );
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/companies/${slug}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as {
        liked: boolean;
        likesCount: number;
      };

      setLiked(payload.liked);
      setLikesCount(payload.likesCount);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant={liked ? "secondary" : "default"}
        className="rounded-full px-5"
        onClick={handleLike}
        disabled={isSubmitting}
      >
        {status === "authenticated" ? (liked ? removeLabel : addLabel) : loginLabel}
      </Button>
      <Badge variant="outline" className="rounded-full px-3 py-1">
        {likesLabel}: {likesCount}
      </Badge>
    </div>
  );
}
