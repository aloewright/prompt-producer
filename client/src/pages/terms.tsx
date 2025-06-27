import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="font-heading text-3xl font-bold mb-2">Terms of Service</h1>
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
                For Google's official terms of service regarding Veo and other Google products, 
                please visit <a href="https://policies.google.com/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google's Terms of Service</a>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                By accessing and using this Veo Prompt Builder application, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our service provides a web-based tool for creating and managing AI video prompts. The service includes prompt generation, 
                saving, and management features to assist users in creating effective prompts for AI video generation tools.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Users agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the service in compliance with all applicable laws and regulations</li>
                <li>Not use the service for any unlawful or prohibited activities</li>
                <li>Respect intellectual property rights of third parties</li>
                <li>Not attempt to interfere with or disrupt the service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Users retain ownership of the prompts and content they create using our service. However, users are responsible 
                for ensuring their content does not infringe on the rights of others.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free operation 
                of the service and disclaim all warranties, express or implied.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Modifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of significant changes, 
                and continued use of the service constitutes acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you have any questions about these Terms of Service, please contact us through our support channels.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}