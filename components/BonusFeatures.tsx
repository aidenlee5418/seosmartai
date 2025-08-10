"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Lightbulb, Target, BarChart3, Zap, Search, TrendingUp, Users, Eye, Layers, Briefcase } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

interface BonusFeaturesProps {
  session: any;
}

export function BonusFeatures({ session }: BonusFeaturesProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    url: '',
    keyword: '',
    competitors: ''
  });

  const runAdvancedAnalysis = async (type) => {
    if (!session?.access_token) {
      toast.error('Please sign in to run advanced analysis');
      return;
    }

    if (!formData.url.trim()) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    setAnalyzing(true);
    setActiveAnalysis(type);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/advanced-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          type,
          url: formData.url,
          keyword: formData.keyword,
          competitors: formData.competitors
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
      setActiveAnalysis(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Advanced SEO Analytics & Bonus Features
          </CardTitle>
          <CardDescription>
            Professional-grade SEO analysis including content clustering, intent prediction, and zero-click optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Target URL</label>
              <Input
                placeholder="Enter URL to analyze..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Keyword (Optional)</label>
              <Input
                placeholder="Enter primary keyword..."
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Competitors (Optional)</label>
              <Input
                placeholder="competitor1.com, competitor2.com..."
                value={formData.competitors}
                onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => runAdvancedAnalysis('clustering')}
              disabled={analyzing}
              variant={activeAnalysis === 'clustering' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Layers className="h-6 w-6 mb-2" />
              Content Clustering
              {analyzing && activeAnalysis === 'clustering' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runAdvancedAnalysis('intent')}
              disabled={analyzing}
              variant={activeAnalysis === 'intent' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Target className="h-6 w-6 mb-2" />
              Search Intent
              {analyzing && activeAnalysis === 'intent' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runAdvancedAnalysis('zeroclick')}
              disabled={analyzing}
              variant={activeAnalysis === 'zeroclick' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Eye className="h-6 w-6 mb-2" />
              Zero-Click Analysis
              {analyzing && activeAnalysis === 'zeroclick' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runAdvancedAnalysis('conversion')}
              disabled={analyzing}
              variant={activeAnalysis === 'conversion' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Briefcase className="h-6 w-6 mb-2" />
              Conversion Analysis
              {analyzing && activeAnalysis === 'conversion' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clustering">Content Clusters</TabsTrigger>
            <TabsTrigger value="intent">Search Intent</TabsTrigger>
            <TabsTrigger value="zeroclick">Zero-Click</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Content Difficulty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{results.contentDifficulty || 0}/100</div>
                  <Progress value={results.contentDifficulty || 0} className="mt-2" />
                  <p className="text-xs text-gray-600 mt-1">Based on competitor analysis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Search Intent Match</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{results.intentMatch || 0}%</div>
                  <Progress value={results.intentMatch || 0} className="mt-2" />
                  <p className="text-xs text-gray-600 mt-1">Content-intent alignment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Zero-Click Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{results.zeroClickRisk || 0}%</div>
                  <Progress value={results.zeroClickRisk || 0} className="mt-2" />
                  <p className="text-xs text-gray-600 mt-1">Likelihood of zero-click results</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Potential</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{results.conversionPotential || 0}/10</div>
                  <p className="text-xs text-gray-600">CTA effectiveness score</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics Summary</CardTitle>
                <CardDescription>Comprehensive analysis of your content's advanced SEO metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Content Performance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Topic Authority</span>
                        <Badge variant="secondary">{results.topicAuthority || 0}/100</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content Gaps</span>
                        <Badge variant={results.contentGaps > 5 ? "destructive" : "secondary"}>
                          {results.contentGaps || 0} identified
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Semantic Coverage</span>
                        <Badge variant="outline">{results.semanticCoverage || 0}%</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Competition Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Keyword Competition</span>
                        <Badge variant={results.keywordCompetition === 'High' ? "destructive" : results.keywordCompetition === 'Medium' ? "default" : "secondary"}>
                          {results.keywordCompetition || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content Uniqueness</span>
                        <Badge variant="secondary">{results.contentUniqueness || 0}%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ranking Opportunity</span>
                        <Badge variant={results.rankingOpportunity === 'High' ? "secondary" : "outline"}>
                          {results.rankingOpportunity || 'Medium'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clustering" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Clustering Analysis</CardTitle>
                <CardDescription>Identify related content that can be grouped together for better SEO performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.contentClusters?.map((cluster, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{cluster.topic}</h4>
                        <Badge variant="secondary">{cluster.pages.length} pages</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{cluster.description}</p>
                      <div className="space-y-2">
                        {cluster.pages?.map((page, pageIndex) => (
                          <div key={pageIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium">{page.title}</p>
                              <p className="text-xs text-gray-500">{page.url}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {page.relevanceScore}/100
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <Badge variant="outline" className="mr-2">
                          Authority Score: {cluster.authorityScore}
                        </Badge>
                        <Badge variant="outline">
                          Consolidation Potential: {cluster.consolidationPotential}
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Layers className="h-12 w-12 mx-auto mb-4" />
                      <p>No content clusters identified</p>
                      <p className="text-sm">Analyze your site to find clustering opportunities</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Intent Analysis</CardTitle>
                <CardDescription>Understanding the search intent behind your content and keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Detected Search Intent</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Primary Intent</span>
                        <Badge variant="secondary">{results.searchIntent?.primary || 'Unknown'}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Secondary Intent</span>
                        <Badge variant="outline">{results.searchIntent?.secondary || 'None'}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Intent Confidence</span>
                        <Badge variant="secondary">{results.searchIntent?.confidence || 0}%</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Content-Intent Alignment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Informational Match</span>
                        <Badge variant="secondary">{results.intentAlignment?.informational || 0}/100</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Commercial Match</span>
                        <Badge variant="secondary">{results.intentAlignment?.commercial || 0}/100</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Navigational Match</span>
                        <Badge variant="secondary">{results.intentAlignment?.navigational || 0}/100</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {results.intentRecommendations && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Intent Optimization Recommendations</h4>
                    <div className="space-y-2">
                      {results.intentRecommendations.map((rec, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h5 className="font-medium text-sm">{rec.title}</h5>
                          <p className="text-xs text-gray-600">{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zeroclick" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Zero-Click Search Analysis</CardTitle>
                <CardDescription>Optimize for featured snippets and reduce zero-click search impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.zeroClickData?.snippetPotential || 0}%</div>
                      <p className="text-sm text-gray-600">Featured Snippet Potential</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{results.zeroClickData?.paaOpportunities || 0}</div>
                      <p className="text-sm text-gray-600">PAA Opportunities</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{results.zeroClickData?.voiceSearchScore || 0}/100</div>
                      <p className="text-sm text-gray-600">Voice Search Readiness</p>
                    </div>
                  </div>

                  {results.snippetOpportunities && (
                    <div>
                      <h4 className="font-medium mb-3">Featured Snippet Opportunities</h4>
                      <div className="space-y-3">
                        {results.snippetOpportunities.map((opportunity, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-sm">{opportunity.type} Snippet</h5>
                              <Badge variant={opportunity.difficulty === 'Easy' ? "secondary" : opportunity.difficulty === 'Medium' ? "default" : "destructive"}>
                                {opportunity.difficulty}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{opportunity.query}</p>
                            <p className="text-xs text-gray-700">{opportunity.optimization}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Optimization Analysis</CardTitle>
                <CardDescription>Analyze and optimize your CTAs and conversion elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{results.conversionData?.ctaCount || 0}</div>
                      <p className="text-sm text-gray-600">CTAs Found</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.conversionData?.ctaScore || 0}/100</div>
                      <p className="text-sm text-gray-600">CTA Quality Score</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{results.conversionData?.trustSignals || 0}</div>
                      <p className="text-sm text-gray-600">Trust Signals</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{results.conversionData?.urgencyScore || 0}/10</div>
                      <p className="text-sm text-gray-600">Urgency Score</p>
                    </div>
                  </div>

                  {results.ctaAnalysis && (
                    <div>
                      <h4 className="font-medium mb-3">CTA Performance Analysis</h4>
                      <div className="space-y-3">
                        {results.ctaAnalysis.map((cta, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-sm">"{cta.text}"</h5>
                              <Badge variant={cta.effectiveness === 'High' ? "secondary" : cta.effectiveness === 'Medium' ? "default" : "destructive"}>
                                {cta.effectiveness}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-600">
                              <span>Position: {cta.position}</span>
                              <span>Type: {cta.type}</span>
                              <span>Visibility: {cta.visibility}</span>
                            </div>
                            {cta.suggestions && (
                              <p className="text-xs text-gray-700 mt-2">💡 {cta.suggestions}</p>
                            )}
                          </div>
                        ))}
                      </div>
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