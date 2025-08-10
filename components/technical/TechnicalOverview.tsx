import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { getPerformanceColor, getPerformanceBadge } from '../../utils/technical-helpers';

export function TechnicalOverview({ results }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getPerformanceColor(results.performance?.score || 0)}`}>
              {results.performance?.score || 0}
            </div>
            <Progress value={results.performance?.score || 0} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              {results.performance?.loadTime || 0}s load time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mobile Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getPerformanceColor(results.mobile?.score || 0)}`}>
              {results.mobile?.score || 0}
            </div>
            <Progress value={results.mobile?.score || 0} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              {results.mobile?.responsive ? 'Responsive' : 'Not Responsive'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getPerformanceColor(results.security?.score || 0)}`}>
              {results.security?.score || 0}
            </div>
            <Progress value={results.security?.score || 0} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              {results.security?.ssl ? 'SSL Active' : 'No SSL'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {results.issues?.total || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {results.issues?.critical || 0} critical issues
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technical Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Core Web Vitals</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Largest Contentful Paint</span>
                  <Badge variant={getPerformanceBadge(results.coreWebVitals?.lcp?.score || 0)}>
                    {results.coreWebVitals?.lcp?.value || '0'}s
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">First Input Delay</span>
                  <Badge variant={getPerformanceBadge(results.coreWebVitals?.fid?.score || 0)}>
                    {results.coreWebVitals?.fid?.value || '0'}ms
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cumulative Layout Shift</span>
                  <Badge variant={getPerformanceBadge(results.coreWebVitals?.cls?.score || 0)}>
                    {results.coreWebVitals?.cls?.value || '0'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Technical Issues</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Broken Images</span>
                  <Badge variant={results.technicalIssues?.brokenImages > 0 ? "destructive" : "secondary"}>
                    {results.technicalIssues?.brokenImages || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Missing Alt Tags</span>
                  <Badge variant={results.technicalIssues?.missingAltTags > 0 ? "destructive" : "secondary"}>
                    {results.technicalIssues?.missingAltTags || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Duplicate Content</span>
                  <Badge variant={results.technicalIssues?.duplicateContent > 0 ? "destructive" : "secondary"}>
                    {results.technicalIssues?.duplicateContent || 0}%
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