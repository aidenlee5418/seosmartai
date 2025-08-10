import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Smartphone, AlertTriangle, CheckCircle } from 'lucide-react';
import { getPerformanceBadge } from '../../utils/technical-helpers';

export function MobileAnalysis({ results }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Mobile-Friendliness Analysis
            </CardTitle>
            <CardDescription>Evaluation of mobile user experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Mobile-Friendly Score</span>
                <Badge variant={getPerformanceBadge(results.mobile?.score || 0)}>
                  {results.mobile?.score || 0}/100
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Responsive Design</span>
                <Badge variant={results.mobile?.responsive ? "secondary" : "destructive"}>
                  {results.mobile?.responsive ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Viewport Meta Tag</span>
                <Badge variant={results.mobile?.viewport ? "secondary" : "destructive"}>
                  {results.mobile?.viewport ? 'Present' : 'Missing'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Touch Elements</span>
                <Badge variant={results.mobile?.touchElements ? "secondary" : "outline"}>
                  {results.mobile?.touchElements ? 'Appropriate' : 'Needs Review'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Issues</CardTitle>
            <CardDescription>Specific mobile usability problems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.mobile?.issues?.map((issue, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{issue.title}</h4>
                    <p className="text-xs text-gray-600">{issue.description}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {issue.severity} severity
                    </Badge>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No mobile issues found</p>
                  <p className="text-sm">Your site is mobile-friendly!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}