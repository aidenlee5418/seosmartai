import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Zap, Clock } from 'lucide-react';
import { getPerformanceBadge } from '../../utils/technical-helpers';

export function PerformanceAnalysis({ results }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Page Speed Analysis
            </CardTitle>
            <CardDescription>Detailed performance metrics and optimization opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall Performance</span>
                <Badge variant={getPerformanceBadge(results.performance?.score || 0)}>
                  {results.performance?.score || 0}/100
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">First Contentful Paint</span>
                <Badge variant={getPerformanceBadge(results.performance?.fcp?.score || 0)}>
                  {results.performance?.fcp?.value || '0'}s
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Speed Index</span>
                <Badge variant={getPerformanceBadge(results.performance?.si?.score || 0)}>
                  {results.performance?.si?.value || '0'}s
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Blocking Time</span>
                <Badge variant={getPerformanceBadge(results.performance?.tbt?.score || 0)}>
                  {results.performance?.tbt?.value || '0'}ms
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Opportunities</CardTitle>
            <CardDescription>Specific improvements to boost your page speed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.performance?.opportunities?.map((opportunity, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{opportunity.title}</span>
                    <Badge variant={opportunity.impact === 'High' ? "destructive" : opportunity.impact === 'Medium' ? "default" : "secondary"}>
                      {opportunity.savings || '0'}s savings
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{opportunity.description}</p>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>No performance opportunities identified</p>
                  <p className="text-sm">Your page performance looks good!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Analysis</CardTitle>
          <CardDescription>Breakdown of page resources affecting performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">JavaScript</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Size</span>
                  <Badge variant="outline">{results.resources?.javascript?.size || '0'} KB</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Files</span>
                  <Badge variant="outline">{results.resources?.javascript?.files || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Blocking Scripts</span>
                  <Badge variant={results.resources?.javascript?.blocking > 0 ? "destructive" : "secondary"}>
                    {results.resources?.javascript?.blocking || 0}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">CSS</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Size</span>
                  <Badge variant="outline">{results.resources?.css?.size || '0'} KB</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Files</span>
                  <Badge variant="outline">{results.resources?.css?.files || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unused CSS</span>
                  <Badge variant={results.resources?.css?.unused > 30 ? "destructive" : "secondary"}>
                    {results.resources?.css?.unused || 0}%
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Images</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Size</span>
                  <Badge variant="outline">{results.resources?.images?.size || '0'} KB</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Count</span>
                  <Badge variant="outline">{results.resources?.images?.count || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unoptimized</span>
                  <Badge variant={results.resources?.images?.unoptimized > 0 ? "destructive" : "secondary"}>
                    {results.resources?.images?.unoptimized || 0}
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