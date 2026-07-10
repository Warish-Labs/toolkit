import { SITE_CONFIG } from "@/src/constants/site";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Toolkit. Free, open, and private utility service terms.",
};

export default function TermsPage() {
  return (
    <div className="container-content py-16 max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          Welcome to <strong>{SITE_CONFIG.name}</strong>. By accessing this website, we assume you accept these terms and conditions. Do not continue to use {SITE_CONFIG.name} if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">1. License</h2>
        <p>
          Unless otherwise stated, {SITE_CONFIG.company.name} and/or its licensors own the intellectual property rights for all material on {SITE_CONFIG.name}. All intellectual property rights are reserved. You may access this from {SITE_CONFIG.name} for your own personal or commercial use subjected to restrictions set in these terms and conditions.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">2. Acceptable Use</h2>
        <p>
          You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of {SITE_CONFIG.name}, or in any way which is unlawful, illegal, fraudulent or harmful.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">3. No Warranties</h2>
        <p>
          This website is provided &ldquo;as is,&rdquo; with all faults, and {SITE_CONFIG.name} expresses no representations or warranties, of any kind related to this website or the materials contained on this website.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">4. Limitation of Liability</h2>
        <p>
          In no event shall {SITE_CONFIG.company.name}, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website.
        </p>
      </div>
    </div>
  );
}
