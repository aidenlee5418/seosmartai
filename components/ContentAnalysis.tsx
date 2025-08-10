"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FileText, Target, TrendingUp, AlertTriangle, CheckCircle, Eye, Clock } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

interface ContentAnalysisProps {
  session: any;
}

export function ContentAnalysis({ session }: ContentAnalysisProps) {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    if (!session?.access_token) {
      toast.error('Please sign in to analyze content');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/analyze-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Analysis failed:', errorText);
        throw new Error(`Analysis failed: ${errorText}`);
      }

      const data = await response.json();
      setResults(data);
      generateSuggestions(data);
      toast.success('Content analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze content. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateSuggestions = (data) => {
    const suggestions = [];

    // Title suggestions
    if (!data.title) {
      suggestions.push({
        type: 'error',
        category: 'Title',
        message: 'Missing title tag - add a descriptive title for better SEO'
      });
    } else if (data.title.length < 30) {
      suggestions.push({
        type: 'warning',
        category: 'Title',
        message: 'Title is too short - aim for 30-60 characters'
      });
    } else if (data.title.length > 60) {
      suggestions.push({
        type: 'warning',
        category: 'Title',
        message: 'Title is too long - may be truncated in search results'
      });
    }

    // Meta description suggestions
    if (!data.metaDescription) {
      suggestions.push({
        type: 'error',
        category: 'Meta Description',
        message: 'Missing meta description - add one to improve click-through rates'
      });
    } else if (data.metaDescription.length < 120) {
      suggestions.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description is too short - aim for 120-160 characters'
      });
    } else if (data.metaDescription.length > 160) {
      suggestions.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description is too long - may be truncated'
      });
    }

    // Heading suggestions
    const h1Count = data.headings?.filter(h => h.tag === 'H1').length || 0;
    if (h1Count === 0) {
      suggestions.push({
        type: 'error',
        category: 'Headings',
        message: 'Missing H1 tag - add a primary heading for better structure'
      });
    } else if (h1Count > 1) {
      suggestions.push({
        type: 'warning',
        category: 'Headings',
        message: 'Multiple H1 tags found - use only one H1 per page'
      });
    }

    // Content suggestions
    if (data.wordCount < 300) {
      suggestions.push({
        type: 'warning',
        category: 'Content',
        message: 'Content is quite short - consider adding more valuable information'
      });
    }

    setSuggestions(suggestions);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content SEO Analysis</CardTitle>
          <CardDescription>Comprehensive analysis of your content for SEO optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <input
              type="url"
              placeholder="Enter URL to analyze..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleAnalyze} disabled={analyzing} className="min-w-[120px]">
              {analyzing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* SEO Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                SEO Score Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{results.score}</div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                  <Progress value={results.score} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{results.wordCount}</div>
                  <div className="text-sm text-gray-600">Word Count</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{results.readingTime}</div>
                  <div className="text-sm text-gray-600">Reading Time (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{results.headings?.length || 0}</div>
                  <div className="text-sm text-gray-600">Headings Found</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="headings">Headings</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Title Tag Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Title:</span>
                          <Badge variant={results.title ? "secondary" : "destructive"}>
                            {results.title ? "Present" : "Missing"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {results.title || "No title found"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Length:</span>
                        <span className="text-sm font-medium">{results.title?.length || 0} characters</span>
                      </div>
                      <Progress 
                        value={Math.min((results.title?.length || 0) / 60 * 100, 100)} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500">Optimal: 30-60 characters</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Meta Description Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Meta Description:</span>
                          <Badge variant={results.metaDescription ? "secondary" : "destructive"}>
                            {results.metaDescription ? "Present" : "Missing"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {results.metaDescription || "No meta description found"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Length:</span>
                        <span className="text-sm font-medium">{results.metaDescription?.length || 0} characters</span>
                      </div>
                      <Progress 
                        value={Math.min((results.metaDescription?.length || 0) / 160 * 100, 100)} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500">Optimal: 120-160 characters</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="headings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Heading Structure Analysis</CardTitle>
                  <CardDescription>Review your page's heading hierarchy for SEO optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.headings?.length > 0 ? (
                      results.headings.map((heading, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline">{heading.tag}</Badge>
                              <Badge variant={heading.isGood ? "secondary" : "destructive"}>
                                {heading.isGood ? "Good Length" : "Needs Review"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{heading.text}</p>
                            <p className="text-xs text-gray-500">{heading.text.length} characters</p>
                          </div>
                          {heading.isGood ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                        <p>No headings found on this page</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Improvement Suggestions</CardTitle>
                  <CardDescription>Actionable recommendations to improve your SEO score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="mt-0.5">
                            {suggestion.type === 'error' ? (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline">{suggestion.category}</Badge>
                              <Badge variant={suggestion.type === 'error' ? "destructive" : "secondary"}>
                                {suggestion.type === 'error' ? 'Critical' : 'Improvement'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{suggestion.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p>Great! No critical issues found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Best Practices</CardTitle>
                  <CardDescription>General recommendations for better SEO performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Content Optimization</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Use target keywords naturally in content</li>
                        <li>• Include related keywords and synonyms</li>
                        <li>• Write for users, not just search engines</li>
                        <li>• Maintain good content freshness</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Technical Elements</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Optimize images with alt tags</li>
                        <li>• Use descriptive URLs</li>
                        <li>• Implement proper schema markup</li>
                        <li>• Ensure mobile responsiveness</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">User Experience</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Improve page loading speed</li>
                        <li>• Create clear navigation structure</li>
                        <li>• Use proper internal linking</li>
                        <li>• Optimize for Core Web Vitals</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Content Strategy</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Research competitor content</li>
                        <li>• Create comprehensive topic coverage</li>
                        <li>• Update and refresh old content</li>
                        <li>• Build topical authority</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}