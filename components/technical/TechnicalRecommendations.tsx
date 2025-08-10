import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertTriangle, TrendingDown, CheckCircle, Wrench } from 'lucide-react';
import { getPriorityIcon } from '../../utils/technical-helpers';

export function TechnicalRecommendations({ results }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical SEO Recommendations</CardTitle>
          <CardDescription>Prioritized list of technical improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.recommendations?.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="mt-0.5">
                  {rec.priority === 'Critical' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : rec.priority === 'High' ? (
                    <TrendingDown className="h-5 w-5 text-orange-500" />
                  ) : (
                    <Wrench className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">{getPriorityIcon(rec.priority)}</span>
                    <Badge variant="outline">{rec.category}</Badge>
                    <Badge variant={rec.priority === 'Critical' ? "destructive" : rec.priority === 'High' ? "default" : "secondary"}>
                      {rec.priority} Priority
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-700">{rec.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Impact: {rec.impact}</span>
                    <span>Effort: {rec.effort}</span>
                    {rec.timeToFix && <span>Time: {rec.timeToFix}</span>}
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No critical technical issues found</p>
                <p className="text-sm">Your technical SEO looks great!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results.quickFixes && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Fixes</CardTitle>
            <CardDescription>Simple improvements you can implement right away</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.quickFixes.map((fix, index) => (
                <div key={index} className="p-3 border rounded-lg bg-green-50">
                  <h4 className="font-medium text-sm mb-1">{fix.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{fix.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {fix.timeToImplement} to implement
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}