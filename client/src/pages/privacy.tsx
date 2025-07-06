import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="font-heading text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: June 27, 2025</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Important Notice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Veo</strong> and <strong>Flow</strong> are trademarks and copyrights of Google Inc. 
                This application is an independent prompt builder tool and is not affiliated with, endorsed by, 
                or sponsored by Google Inc.
              </p>
              <p>
                For Google's official privacy policy, please visit{" "}
                <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Google's Privacy Policy
                </a>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Account Information</h4>
              <p>
                When you access our application through Cloudflare Access, we collect basic profile information including 
                your email address, name, and profile picture as provided by your organization's authentication provider.
              </p>
              
              <h4 className="font-semibold">Content Information</h4>
              <p>
                We store the prompts you create and save using our service. This includes prompt text, 
                element selections, and metadata about when prompts were created or modified.
              </p>
              
              <h4 className="font-semibold">Usage Information</h4>
              <p>
                We may collect information about how you use our service, including features accessed, 
                time spent, and general usage patterns for service improvement purposes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide and maintain our prompt building service</li>
                <li>Save and retrieve your created prompts</li>
                <li>Improve our service and user experience</li>
                <li>Communicate with you about service updates or issues</li>
                <li>Ensure security and prevent abuse</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties. 
                We may share information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist in operating our service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We implement appropriate security measures to protect your information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We retain your information for as long as your account is active or as needed to provide services. 
                You may request deletion of your account and associated data by contacting us.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We use essential cookies to maintain your session and provide core functionality. 
                We do not use tracking cookies for advertising or analytics purposes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Export your saved prompts</li>
                <li>Object to processing of your information</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may update this privacy policy from time to time. We will notify users of significant changes 
                by posting the new policy on this page with an updated revision date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our support channels.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}