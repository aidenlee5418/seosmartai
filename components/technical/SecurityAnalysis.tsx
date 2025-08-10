import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Shield } from 'lucide-react';
import { getPerformanceBadge } from '../../utils/technical-helpers';

export function SecurityAnalysis({ results }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Analysis
            </CardTitle>
            <CardDescription>Comprehensive security and privacy evaluation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">SSL Certificate</span>
                <Badge variant={results.security?.ssl?.valid ? "secondary" : "destructive"}>
                  {results.security?.ssl?.valid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">HTTPS Redirect</span>
                <Badge variant={results.security?.httpsRedirect ? "secondary" : "destructive"}>
                  {results.security?.httpsRedirect ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Security Headers</span>
                <Badge variant={getPerformanceBadge(results.security?.headers?.score || 0)}>
                  {results.security?.headers?.present || 0}/10
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mixed Content</span>
                <Badge variant={results.security?.mixedContent ? "destructive" : "secondary"}>
                  {results.security?.mixedContent ? 'Found' : 'None'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Compliance</CardTitle>
            <CardDescription>Privacy policy and compliance checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Privacy Policy</span>
              <Badge variant={results.privacy?.privacyPolicy ? "secondary" : "destructive"}>
                {results.privacy?.privacyPolicy ? 'Present' : 'Missing'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cookie Notice</span>
              <Badge variant={results.privacy?.cookieNotice ? "secondary" : "outline"}>
                {results.privacy?.cookieNotice ? 'Present' : 'Missing'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">GDPR Compliance</span>
              <Badge variant={results.privacy?.gdprCompliant ? "secondary" : "outline"}>
                {results.privacy?.gdprCompliant ? 'Likely' : 'Unknown'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Terms of Service</span>
              <Badge variant={results.privacy?.termsOfService ? "secondary" : "outline"}>
                {results.privacy?.termsOfService ? 'Present' : 'Missing'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sitemap & Robots Analysis</CardTitle>
          <CardDescription>Technical SEO file analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Sitemap.xml</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sitemap Present</span>
                  <Badge variant={results.sitemap?.exists ? "secondary" : "destructive"}>
                    {results.sitemap?.exists ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">URL Count</span>
                  <Badge variant="outline">{results.sitemap?.urlCount || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Valid Format</span>
                  <Badge variant={results.sitemap?.valid ? "secondary" : "destructive"}>
                    {results.sitemap?.valid ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Modified</span>
                  <Badge variant="outline">
                    {results.sitemap?.lastModified || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Robots.txt</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Robots.txt Present</span>
                  <Badge variant={results.robots?.exists ? "secondary" : "destructive"}>
                    {results.robots?.exists ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sitemap Referenced</span>
                  <Badge variant={results.robots?.sitemapReferenced ? "secondary" : "outline"}>
                    {results.robots?.sitemapReferenced ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Issues Found</span>
                  <Badge variant={results.robots?.issues > 0 ? "destructive" : "secondary"}>
                    {results.robots?.issues || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}