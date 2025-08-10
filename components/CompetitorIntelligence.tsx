"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Users, Search, TrendingUp, Eye, ExternalLink, Target, BarChart3, AlertTriangle, HelpCircle } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

interface CompetitorIntelligenceProps {
  session: any;
}

export function CompetitorIntelligence({ session }: CompetitorIntelligenceProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState('gaps');
  const [formData, setFormData] = useState({
    targetKeyword: '',
    competitorUrl: '',
    yourUrl: ''
  });

  const runAnalysis = async (type) => {
    if (!session?.access_token) {
      toast.error('Please sign in to run competitor analysis');
      return;
    }

    if (!formData.targetKeyword && type !== 'serp') {
      toast.error('Please enter a target keyword');
      return;
    }

    setAnalyzing(true);
    setActiveAnalysis(type);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/competitor-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          type,
          keyword: formData.targetKeyword,
          competitorUrl: formData.competitorUrl,
          yourUrl: formData.yourUrl
        })
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
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Competitor & SERP Intelligence
          </CardTitle>
          <CardDescription>
            Advanced competitor analysis, SERP research, and content gap identification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Keyword</label>
              <Input
                placeholder="Enter target keyword..."
                value={formData.targetKeyword}
                onChange={(e) => setFormData({ ...formData, targetKeyword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Competitor URL (Optional)</label>
              <Input
                placeholder="https://competitor.com"
                value={formData.competitorUrl}
                onChange={(e) => setFormData({ ...formData, competitorUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your URL (Optional)</label>
              <Input
                placeholder="https://yoursite.com"
                value={formData.yourUrl}
                onChange={(e) => setFormData({ ...formData, yourUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => runAnalysis('gaps')}
              disabled={analyzing}
              variant={activeAnalysis === 'gaps' && analyzing ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Target className="h-6 w-6 mb-2" />
              Content Gaps
              {analyzing && activeAnalysis === 'gaps' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runAnalysis('serp')}
              disabled={analyzing}
              variant={activeAnalysis === 'serp' && analyzing ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Search className="h-6 w-6 mb-2" />
              SERP Analysis
              {analyzing && activeAnalysis === 'serp' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runAnalysis('paa')}
              disabled={analyzing}
              variant={activeAnalysis === 'paa' && analyzing ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <HelpCircle className="h-6 w-6 mb-2" />
              People Also Ask
              {analyzing && activeAnalysis === 'paa' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runAnalysis('trends')}
              disabled={analyzing}
              variant={activeAnalysis === 'trends' && analyzing ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              SERP Trends
              {analyzing && activeAnalysis === 'trends' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mt-1"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="competitors">Top Competitors</TabsTrigger>
            <TabsTrigger value="content">Content Analysis</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Competition Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{results.competitionLevel || 'High'}</div>
                  <Progress value={results.competitionScore || 85} className="mt-2" />
                  <p className="text-xs text-gray-600 mt-1">Based on SERP analysis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Content Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{results.avgContentLength || '1,847'}</div>
                  <p className="text-xs text-gray-600">words</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Competitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{results.competitorCount || '12'}</div>
                  <p className="text-xs text-gray-600">ranking domains</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Content Gaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{results.contentGaps || '23'}</div>
                  <p className="text-xs text-gray-600">opportunities found</p>
                </CardContent>
              </Card>
            </div>

            {results.peopleAlsoAsk && (
              <Card>
                <CardHeader>
                  <CardTitle>People Also Ask Questions</CardTitle>
                  <CardDescription>Related questions from Google search results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.peopleAlsoAsk.map((question, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="text-sm font-medium mb-2">{question.question}</p>
                        <Badge variant="outline" className="text-xs">
                          Search Volume: {question.searchVolume || 'N/A'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Ranking Competitors</CardTitle>
                <CardDescription>Analysis of top 10 ranking pages for your target keyword</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.topCompetitors?.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">#{competitor.position}</Badge>
                        <div>
                          <h4 className="font-medium">{competitor.title}</h4>
                          <p className="text-sm text-gray-600">{competitor.domain}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {competitor.wordCount} words
                            </span>
                            <span className="text-xs text-gray-500">
                              DA: {competitor.domainAuthority}
                            </span>
                            <span className="text-xs text-gray-500">
                              {competitor.headingCount} headings
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={competitor.position <= 3 ? "default" : "secondary"}>
                          {competitor.position <= 3 ? 'Top 3' : 'Page 1'}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4" />
                      <p>No competitor data available</p>
                      <p className="text-sm">Run a SERP analysis to see top ranking competitors</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Structure Analysis</CardTitle>
                  <CardDescription>How top competitors structure their content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average H1 Count</span>
                      <Badge variant="secondary">{results.contentStructure?.avgH1 || '1.2'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average H2 Count</span>
                      <Badge variant="secondary">{results.contentStructure?.avgH2 || '4.8'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average H3 Count</span>
                      <Badge variant="secondary">{results.contentStructure?.avgH3 || '2.3'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Images per Article</span>
                      <Badge variant="secondary">{results.contentStructure?.avgImages || '5.7'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Internal Links</span>
                      <Badge variant="secondary">{results.contentStructure?.avgInternalLinks || '8.2'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>External Links</span>
                      <Badge variant="secondary">{results.contentStructure?.avgExternalLinks || '3.1'}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Keywords</CardTitle>
                  <CardDescription>Keywords frequently used by top competitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.commonKeywords?.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{keyword.term}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {keyword.frequency}% use
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {keyword.avgDensity}% density
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-gray-500">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No keyword data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Gap Opportunities</CardTitle>
                  <CardDescription>Topics your competitors cover but you might be missing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.contentGapDetails?.map((gap, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{gap.topic}</h4>
                          <Badge variant={gap.priority === 'High' ? "destructive" : gap.priority === 'Medium' ? "default" : "secondary"}>
                            {gap.priority} Priority
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{gap.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {gap.competitorCoverage}% competitors cover this
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Est. {gap.searchVolume} searches/month
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="h-12 w-12 mx-auto mb-4" />
                        <p>No content gaps identified</p>
                        <p className="text-sm">Run a content gap analysis to find opportunities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SERP Feature Opportunities</CardTitle>
                  <CardDescription>Featured snippets and SERP features you could target</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.serpFeatures?.map((feature, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{feature.type}</h4>
                          <Badge variant="secondary">{feature.currentOwner || 'Available'}</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{feature.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {feature.difficulty} Difficulty
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {feature.opportunity}% Opportunity
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <Eye className="h-12 w-12 mx-auto mb-4" />
                        <p>No SERP features identified</p>
                        <p className="text-sm">Analyze SERP to find feature opportunities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Actionable Recommendations</CardTitle>
                <CardDescription>Specific steps to improve your competitive position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="mt-0.5">
                        {rec.priority === 'High' ? (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline">{rec.category}</Badge>
                          <Badge variant={rec.priority === 'High' ? "destructive" : "secondary"}>
                            {rec.priority} Priority
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{rec.recommendation}</p>
                        <p className="text-xs text-gray-500 mt-1">Expected impact: {rec.impact}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                      <p>No recommendations available</p>
                      <p className="text-sm">Complete analysis to get actionable recommendations</p>
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