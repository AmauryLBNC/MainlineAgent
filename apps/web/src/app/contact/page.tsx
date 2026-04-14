"use client";

import { useState } from "react";
import { RiMailLine } from "@remixicon/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageShell from "@/components/Base/PageShell";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { copy } = useI18n();

  return (
    <PageShell align="center" density={22}>
      <div className="w-full py-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
              <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
                {copy.contact.eyebrow}
              </Badge>
              <CardTitle className="app-title text-4xl sm:text-5xl">
                {copy.contact.title}
              </CardTitle>
              <p className="app-copy text-sm leading-7 sm:text-base">
                {copy.contact.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
              <Alert className="rounded-2xl border-border/70 bg-background/70">
                <RiMailLine className="size-4" />
                <AlertTitle>{copy.contact.email}</AlertTitle>
                <AlertDescription>
                  Direct channel for investor onboarding and support.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="app-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
                {copy.contact.submitButton}
              </Badge>
            </CardHeader>
            <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">
                      {copy.contact.placeholders.fullName}
                    </Label>
                    <Input id="contact-name" required placeholder={copy.contact.placeholders.fullName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">
                      {copy.contact.placeholders.email}
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      placeholder={copy.contact.placeholders.email}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">
                    {copy.contact.placeholders.subject}
                  </Label>
                  <Input
                    id="contact-subject"
                    required
                    placeholder={copy.contact.placeholders.subject}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">
                    {copy.contact.placeholders.message}
                  </Label>
                  <Textarea
                    id="contact-message"
                    required
                    rows={6}
                    placeholder={copy.contact.placeholders.message}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" className="rounded-full px-5">
                    {copy.contact.submitButton}
                  </Button>
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    {copy.contact.email}
                  </Badge>
                </div>

                {sent ? (
                  <Alert className="rounded-2xl border-emerald-500/30 bg-emerald-50">
                    <AlertTitle>{copy.contact.submitButton}</AlertTitle>
                    <AlertDescription>
                      {copy.contact.successMessage}
                    </AlertDescription>
                  </Alert>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
