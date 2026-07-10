import { SITE_CONFIG } from "@/src/constants/site";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Toolkit. Your privacy is paramount — all tools process data locally.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-content py-16 max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          At <strong>{SITE_CONFIG.name}</strong>, accessible from <a href={SITE_CONFIG.url} className="text-primary hover:underline">{SITE_CONFIG.url}</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {SITE_CONFIG.name} and how we use it.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">1. Local Processing (Zero Data Uploads)</h2>
        <p>
          Unlike traditional web utilities, {SITE_CONFIG.name} is built as a client-side utility platform. All operations, conversions, computations, and formatting executed within our tools are processed entirely in your web browser using client-side JavaScript. None of your input data, strings, files, or calculations are sent to or stored on our servers.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">2. Log Files</h2>
        <p>
          {SITE_CONFIG.name} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">3. Cookies and Web Beacons</h2>
        <p>
          Like any other website, {SITE_CONFIG.name} uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-6">4. Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </div>
  );
}
