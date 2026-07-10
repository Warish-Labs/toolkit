import { SITE_CONFIG } from "@/src/constants/site";

export const metadata = {
  title: "Disclaimer",
  description: "Disclaimer for Toolkit. Read our terms regarding the accuracy of tools and calculations.",
};

export default function DisclaimerPage() {
  return (
    <div className="container-content py-16 max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Disclaimer</h1>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          All information and utilities on this website — <a href={SITE_CONFIG.url} className="text-primary hover:underline">{SITE_CONFIG.url}</a> — are published in good faith and for general information purpose only. <strong>{SITE_CONFIG.name}</strong> does not make any warranties about the completeness, reliability, and accuracy of this information or calculations.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">1. Calculation Accuracy</h2>
        <p>
          Any action you take upon the information you find on this website ({SITE_CONFIG.name}), is strictly at your own risk. {SITE_CONFIG.name} and {SITE_CONFIG.company.name} will not be liable for any losses and/or damages in connection with the use of our website. The calculations (such as age, BMI, and percentage calculations) are estimations based on standard formulas and calendar arithmetic and should not be used as official references.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">2. External Links</h2>
        <p>
          From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites.
        </p>
      </div>
    </div>
  );
}
