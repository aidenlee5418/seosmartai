"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { RefreshCw, Calendar, AlertTriangle, TrendingUp, Archive, Zap, Clock, FileText, ExternalLink } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

interface MaintenanceToolsProps {
  session: any;
}

export function MaintenanceTools({ session }: MaintenanceToolsProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [siteUrl, setSiteUrl] = useState('');

  const runMaintenanceAnalysis = async (type) => {
    if (!session?.access_token) {
      toast.error('Please sign in to run maintenance analysis');
      return;
    }

    if (!siteUrl.trim()) {
      toast.error('Please enter a website URL to analyze');
      return;
    }

    setAnalyzing(true);
    setActiveAnalysis(type);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/maintenance-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ url: siteUrl, type })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${errorText}`);
      }

      const data = await response.json();
      setResults(data);
      toast.success(`${type} analysis completed!`);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(`Failed to run ${type} analysis. Please try again.`);
    } finally {
      setAnalyzing(false);
      setActiveAnalysis(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Content Maintenance & Refresh Tools
          </CardTitle>
          <CardDescription>
            Automated content maintenance, freshness analysis, and optimization recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Input
              placeholder="Enter website URL to analyze..."
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => runMaintenanceAnalysis('outdated')}
              disabled={analyzing}
              variant={activeAnalysis === 'outdated' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Calendar className="h-6 w-6 mb-2" />
              Outdated Content
              {analyzing && activeAnalysis === 'outdated' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runMaintenanceAnalysis('refresh')}
              disabled={analyzing}
              variant={activeAnalysis === 'refresh' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <RefreshCw className="h-6 w-6 mb-2" />
              Refresh Opportunities
              {analyzing && activeAnalysis === 'refresh' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runMaintenanceAnalysis('redirects')}
              disabled={analyzing}
              variant={activeAnalysis === 'redirects' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <ExternalLink className="h-6 w-6 mb-2" />
              Redirect Analysis
              {analyzing && activeAnalysis === 'redirects' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runMaintenanceAnalysis('consolidation')}
              disabled={analyzing}
              variant={activeAnalysis === 'consolidation' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Archive className="h-6 w-6 mb-2" />
              Content Consolidation
              {analyzing && activeAnalysis === 'consolidation' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="outdated">Outdated Content</TabsTrigger>
            <TabsTrigger value="opportunities">Refresh Ideas</TabsTrigger>
            <TabsTrigger value="recommendations">Action Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Content Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{results.healthScore || 0}/100</div>
                  <Progress value={results.healthScore || 0} className="mt-2" />
                  <p className="text-xs text-gray-600 mt-1">Overall content freshness</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Outdated Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{results.outdatedCount || 0}</div>
                  <p className="text-xs text-gray-600">pages need updating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Refresh Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{results.opportunityCount || 0}</div>
                  <p className="text-xs text-gray-600">improvement opportunities</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Content Age</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{results.avgContentAge || 0}</div>
                  <p className="text-xs text-gray-600">days since last update</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Content Maintenance Summary</CardTitle>
                <CardDescription>Overview of your content maintenance needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Priority Actions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Critical Updates Needed</span>
                        <Badge variant={results.priorities?.critical > 0 ? "destructive" : "secondary"}>
                          {results.priorities?.critical || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">High Priority Refreshes</span>
                        <Badge variant={results.priorities?.high > 0 ? "default" : "secondary"}>
                          {results.priorities?.high || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Medium Priority Updates</span>
                        <Badge variant="outline">{results.priorities?.medium || 0}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Content Performance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Declining Traffic Pages</span>
                        <Badge variant="destructive">{results.performance?.declining || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Stable Performers</span>
                        <Badge variant="secondary">{results.performance?.stable || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Growing Pages</span>
                        <Badge variant="secondary">{results.performance?.growing || 0}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outdated" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Outdated Content Analysis</CardTitle>
                <CardDescription>Pages that need immediate attention due to age or declining performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.outdatedPages?.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{page.title}</h4>
                          <p className="text-sm text-gray-600">{page.url}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              Last updated: {page.lastUpdated}
                            </span>
                            <span className="text-xs text-gray-500">
                              Traffic: {page.trafficTrend}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={page.priority === 'Critical' ? "destructive" : page.priority === 'High' ? "default" : "secondary"}>
                          {page.priority}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={page.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4" />
                      <p>No severely outdated content found</p>
                      <p className="text-sm">Your content appears to be well-maintained</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Refresh Opportunities</CardTitle>
                <CardDescription>Specific suggestions to improve and refresh your existing content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.refreshOpportunities?.map((opportunity, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <Badge variant={opportunity.impact === 'High' ? "destructive" : opportunity.impact === 'Medium' ? "default" : "secondary"}>
                          {opportunity.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-xs">
                          {opportunity.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Estimated effort: {opportunity.effort}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ROI: {opportunity.roi}
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                      <p>No refresh opportunities identified</p>
                      <p className="text-sm">Run analysis to find content improvement opportunities</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Maintenance Action Plan</CardTitle>
                <CardDescription>Prioritized recommendations for maintaining and improving your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.actionPlan?.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="mt-0.5">
                        {action.priority === 'Critical' ? (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        ) : action.priority === 'High' ? (
                          <Zap className="h-5 w-5 text-orange-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline">{action.category}</Badge>
                          <Badge variant={action.priority === 'Critical' ? "destructive" : action.priority === 'High' ? "default" : "secondary"}>
                            {action.priority} Priority
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                        <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Timeline: {action.timeline}</span>
                          <span>Resources: {action.resources}</span>
                          <span>Expected impact: {action.expectedImpact}</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <RefreshCw className="h-12 w-12 mx-auto mb-4" />
                      <p>No maintenance recommendations available</p>
                      <p className="text-sm">Complete content analysis to get personalized action plan</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}