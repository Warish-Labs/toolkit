import { Card, CardContent } from "@/src/ui/shared/card";
import { SITE_CONFIG } from "@/src/constants/site";
import { Shield, Zap, Sparkles } from "lucide-react";

export const metadata = {
  title: "About Toolkit",
  description: "Learn more about Toolkit — a fast, private, browser-first utility platform by WarishLabs.",
};

export default function AboutPage() {
  return (
    <div className="container-content py-16 space-y-12 max-w-3xl">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">About Toolkit</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Toolkit is a suite of lightweight, browser-first utilities designed for speed, simplicity, and absolute privacy.
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          In modern web workflows, we frequently copy and paste snippets, format JSON, compute percentages, or generate credentials using random third-party online tools. Many of these tools require uploading data to servers, installing heavyweight applications, or coping with disruptive advertising and cookies.
        </p>
        <p>
          We created Toolkit to solve this. It is a collection of essential web tools that run **100% locally** on your device. We use modern Web APIs to execute calculations directly inside your browser. No databases, no external logging, no analytics tracking on your inputs, and absolutely no data transmission.
        </p>
      </div>

      {/* Philosophy Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border/60 bg-muted/20">
          <CardContent className="p-5 space-y-2 text-center">
            <Shield className="h-6 w-6 text-green-500 mx-auto" />
            <h3 className="font-semibold text-foreground text-sm">Privacy First</h3>
            <p className="text-xs text-muted-foreground">Every computation occurs locally on your machine. We never see your data.</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-muted/20">
          <CardContent className="p-5 space-y-2 text-center">
            <Zap className="h-6 w-6 text-yellow-500 mx-auto" />
            <h3 className="font-semibold text-foreground text-sm">Sub-Millisecond</h3>
            <p className="text-xs text-muted-foreground">No round-trip latency to a server. Execution is instant and snappy.</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-muted/20">
          <CardContent className="p-5 space-y-2 text-center">
            <Sparkles className="h-6 w-6 text-primary mx-auto" />
            <h3 className="font-semibold text-foreground text-sm">Zero Noise</h3>
            <p className="text-xs text-muted-foreground">No accounts, no paywalls, and no pop-up advertisements.</p>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-border/60 pt-8 text-center space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Who builds Toolkit?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          Toolkit is built and maintained by{" "}
          <a
            href={SITE_CONFIG.company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            {SITE_CONFIG.company.name}
          </a>
          , a digital product studio building fast, user-centered utility products.
        </p>
      </div>
    </div>
  );
}
