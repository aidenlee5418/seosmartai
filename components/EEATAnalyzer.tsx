"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Shield, User, Award, CheckCircle, AlertTriangle, Star, ExternalLink, BookOpen, Users, TrendingUp } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

interface EEATAnalyzerProps {
  session: any;
}

export function EEATAnalyzer({ session }: EEATAnalyzerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [url, setUrl] = useState('');

  const runEEATAnalysis = async () => {
    if (!session?.access_token) {
      toast.error('Please sign in to run E-E-A-T analysis');
      return;
    }

    if (!url.trim()) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/eeat-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${errorText}`);
      }

      const data = await response.json();
      setResults(data);
      toast.success('E-E-A-T analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to run E-E-A-T analysis. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'secondary';
    if (score >= 60) return 'outline';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            E-E-A-T Signal Analysis
          </CardTitle>
          <CardDescription>
            Analyze Experience, Expertise, Authoritativeness, and Trustworthiness signals for better Google rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter URL to analyze..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={runEEATAnalysis} disabled={analyzing} className="min-w-[120px]">
              {analyzing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Analyze E-E-A-T
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* E-E-A-T Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle>E-E-A-T Score Overview</CardTitle>
              <CardDescription>Comprehensive analysis of trust and authority signals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(results.overallScore)}`}>
                    {results.overallScore}/100
                  </div>
                  <div className="text-sm text-gray-600">Overall E-E-A-T</div>
                  <Progress value={results.overallScore} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(results.experience)}`}>
                    {results.experience}/100
                  </div>
                  <div className="text-sm text-gray-600">Experience</div>
                  <Progress value={results.experience} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(results.expertise)}`}>
                    {results.expertise}/100
                  </div>
                  <div className="text-sm text-gray-600">Expertise</div>
                  <Progress value={results.expertise} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(results.authoritativeness)}`}>
                    {results.authoritativeness}/100
                  </div>
                  <div className="text-sm text-gray-600">Authority</div>
                  <Progress value={results.authoritativeness} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(results.trustworthiness)}`}>
                    {results.trustworthiness}/100
                  </div>
                  <div className="text-sm text-gray-600">Trust</div>
                  <Progress value={results.trustworthiness} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authorship">Authorship</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="trust-signals">Trust Signals</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Experience Signals</CardTitle>
                    <CardDescription>Evidence of first-hand experience with the topic</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Personal Experience Indicators</span>
                      <Badge variant={getScoreBadge(results.experienceSignals?.personal || 0)}>
                        {results.experienceSignals?.personal || 0}/100
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Use of First-Person Language</span>
                      <Badge variant={results.experienceSignals?.firstPerson ? "secondary" : "destructive"}>
                        {results.experienceSignals?.firstPerson ? 'Present' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Case Studies & Examples</span>
                      <Badge variant={getScoreBadge(results.experienceSignals?.caseStudies || 0)}>
                        {results.experienceSignals?.caseStudies || 0} found
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User-Generated Content</span>
                      <Badge variant={results.experienceSignals?.userContent ? "secondary" : "outline"}>
                        {results.experienceSignals?.userContent ? 'Present' : 'Limited'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expertise Indicators</CardTitle>
                    <CardDescription>Demonstration of subject matter expertise</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technical Depth</span>
                      <Badge variant={getScoreBadge(results.expertiseSignals?.technicalDepth || 0)}>
                        {results.expertiseSignals?.technicalDepth || 0}/100
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Industry Terminology</span>
                      <Badge variant={getScoreBadge(results.expertiseSignals?.terminology || 0)}>
                        {results.expertiseSignals?.terminology || 0}% usage
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Citation of Studies</span>
                      <Badge variant={getScoreBadge(results.expertiseSignals?.citations || 0)}>
                        {results.expertiseSignals?.citations || 0} citations
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content Comprehensiveness</span>
                      <Badge variant={getScoreBadge(results.expertiseSignals?.comprehensiveness || 0)}>
                        {results.expertiseSignals?.comprehensiveness || 0}/100
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Authority Metrics</CardTitle>
                    <CardDescription>External recognition and domain authority</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Domain Authority</span>
                      <Badge variant={getScoreBadge(results.authoritySignals?.domainAuthority || 0)}>
                        {results.authoritySignals?.domainAuthority || 0}/100
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backlink Quality</span>
                      <Badge variant={getScoreBadge(results.authoritySignals?.backlinkQuality || 0)}>
                        {results.authoritySignals?.backlinkQuality || 0}/100
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Media Mentions</span>
                      <Badge variant={getScoreBadge(results.authoritySignals?.mediaMentions || 0)}>
                        {results.authoritySignals?.mediaMentions || 0} found
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Industry Recognition</span>
                      <Badge variant={results.authoritySignals?.recognition ? "secondary" : "outline"}>
                        {results.authoritySignals?.recognition ? 'Present' : 'Limited'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trust Indicators</CardTitle>
                    <CardDescription>Signals that build user and search engine trust</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <Badge variant={results.trustSignals?.ssl ? "secondary" : "destructive"}>
                        {results.trustSignals?.ssl ? 'Secure' : 'Insecure'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Privacy Policy</span>
                      <Badge variant={results.trustSignals?.privacyPolicy ? "secondary" : "destructive"}>
                        {results.trustSignals?.privacyPolicy ? 'Present' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Contact Information</span>
                      <Badge variant={results.trustSignals?.contactInfo ? "secondary" : "outline"}>
                        {results.trustSignals?.contactInfo ? 'Complete' : 'Incomplete'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Reviews</span>
                      <Badge variant={getScoreBadge(results.trustSignals?.reviews || 0)}>
                        {results.trustSignals?.reviews || 0} reviews
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="authorship" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Author Information Analysis</CardTitle>
                  <CardDescription>Evaluation of author credentials and visibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Author Identification</h4>
                      <div className="space-y-3">
                        {results.authorInfo?.authors?.map((author, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{author.name || 'Unknown Author'}</span>
                              <Badge variant={author.verified ? "secondary" : "outline"}>
                                {author.verified ? 'Verified' : 'Unverified'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Bio: {author.bio || 'Not available'}</p>
                              <p>Credentials: {author.credentials || 'Not specified'}</p>
                              <p>Social Presence: {author.socialLinks || 0} platforms</p>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8 text-gray-500">
                            <User className="h-12 w-12 mx-auto mb-4" />
                            <p>No author information found</p>
                            <p className="text-sm">Consider adding author bylines and bio sections</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Author Credibility Signals</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Author Bio Present</span>
                          <Badge variant={results.authorInfo?.hasBio ? "secondary" : "destructive"}>
                            {results.authorInfo?.hasBio ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Professional Credentials</span>
                          <Badge variant={results.authorInfo?.hasCredentials ? "secondary" : "outline"}>
                            {results.authorInfo?.hasCredentials ? 'Listed' : 'Missing'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Social Media Links</span>
                          <Badge variant={getScoreBadge(results.authorInfo?.socialPresence || 0)}>
                            {results.authorInfo?.socialPresence || 0} platforms
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Previous Publications</span>
                          <Badge variant={getScoreBadge(results.authorInfo?.publications || 0)}>
                            {results.authorInfo?.publications || 0} found
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Expert Recognition</span>
                          <Badge variant={results.authorInfo?.expertRecognition ? "secondary" : "outline"}>
                            {results.authorInfo?.expertRecognition ? 'Present' : 'Limited'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credentials" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Credentials & Qualifications</CardTitle>
                  <CardDescription>Analysis of educational background and professional qualifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Educational Background</h4>
                        <div className="space-y-2">
                          {results.credentials?.education?.map((edu, index) => (
                            <div key={index} className="p-2 border rounded">
                              <div className="font-medium text-sm">{edu.degree}</div>
                              <div className="text-xs text-gray-600">{edu.institution}</div>
                            </div>
                          )) || (
                            <p className="text-sm text-gray-500">No educational credentials found</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Professional Certifications</h4>
                        <div className="space-y-2">
                          {results.credentials?.certifications?.map((cert, index) => (
                            <div key={index} className="p-2 border rounded">
                              <div className="font-medium text-sm">{cert.name}</div>
                              <div className="text-xs text-gray-600">{cert.issuer}</div>
                            </div>
                          )) || (
                            <p className="text-sm text-gray-500">No certifications found</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Professional Experience</h4>
                      <div className="space-y-2">
                        {results.credentials?.experience?.map((exp, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{exp.position}</span>
                              <Badge variant="outline">{exp.duration}</Badge>
                            </div>
                            <div className="text-sm text-gray-600">{exp.company}</div>
                            <div className="text-xs text-gray-500 mt-1">{exp.description}</div>
                          </div>
                        )) || (
                          <p className="text-sm text-gray-500">No professional experience information found</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trust-signals" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Trust Signals</CardTitle>
                    <CardDescription>Security and technical credibility indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={results.technicalTrust?.ssl?.valid ? "secondary" : "destructive"}>
                          {results.technicalTrust?.ssl?.valid ? 'Valid' : 'Invalid'}
                        </Badge>
                        {results.technicalTrust?.ssl?.issuer && (
                          <span className="text-xs text-gray-500">{results.technicalTrust?.ssl?.issuer}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Security Headers</span>
                      <Badge variant={getScoreBadge(results.technicalTrust?.securityHeaders || 0)}>
                        {results.technicalTrust?.securityHeaders || 0}/10 present
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Privacy Policy</span>
                      <Badge variant={results.technicalTrust?.privacyPolicy ? "secondary" : "destructive"}>
                        {results.technicalTrust?.privacyPolicy ? 'Present' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Terms of Service</span>
                      <Badge variant={results.technicalTrust?.termsOfService ? "secondary" : "outline"}>
                        {results.technicalTrust?.termsOfService ? 'Present' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">DMCA Policy</span>
                      <Badge variant={results.technicalTrust?.dmcaPolicy ? "secondary" : "outline"}>
                        {results.technicalTrust?.dmcaPolicy ? 'Present' : 'Missing'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Social Trust Signals</CardTitle>
                    <CardDescription>User engagement and social validation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Reviews</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{results.socialTrust?.reviews?.count || 0}</Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm ml-1">{results.socialTrust?.reviews?.rating || 0}/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Social Media Presence</span>
                      <Badge variant={getScoreBadge(results.socialTrust?.socialMediaScore || 0)}>
                        {results.socialTrust?.socialMediaScore || 0}/100
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Community Engagement</span>
                      <Badge variant={getScoreBadge(results.socialTrust?.engagement || 0)}>
                        {results.socialTrust?.engagement || 0}/100
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">External Citations</span>
                      <Badge variant="secondary">{results.socialTrust?.citations || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Press Mentions</span>
                      <Badge variant="secondary">{results.socialTrust?.pressMentions || 0}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Credible Source Suggestions</CardTitle>
                  <CardDescription>Recommended authoritative sources to cite and link to</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.credibleSources?.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{source.name}</h4>
                          <p className="text-xs text-gray-600">{source.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              DA: {source.domainAuthority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {source.category}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-4" />
                        <p>No credible source suggestions available</p>
                        <p className="text-sm">Run analysis to get authoritative source recommendations</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>E-E-A-T Improvement Recommendations</CardTitle>
                  <CardDescription>Actionable steps to improve your E-E-A-T signals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.recommendations?.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="mt-0.5">
                          {rec.priority === 'High' ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : rec.priority === 'Medium' ? (
                            <TrendingUp className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline">{rec.category}</Badge>
                            <Badge variant={rec.priority === 'High' ? "destructive" : rec.priority === 'Medium' ? "default" : "secondary"}>
                              {rec.priority} Priority
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                          <p className="text-sm text-gray-700">{rec.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Impact: {rec.impact}</p>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <Shield className="h-12 w-12 mx-auto mb-4" />
                        <p>No recommendations available</p>
                        <p className="text-sm">Complete E-E-A-T analysis to get improvement suggestions</p>
                      </div>
                    )}
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