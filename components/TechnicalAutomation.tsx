"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Zap, Smartphone, Shield, Copy, Globe, AlertTriangle, CheckCircle, Clock, TrendingDown, Server, Image } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";
import { TechnicalOverview } from './technical/TechnicalOverview';
import { PerformanceAnalysis } from './technical/PerformanceAnalysis';
import { MobileAnalysis } from './technical/MobileAnalysis';
import { SecurityAnalysis } from './technical/SecurityAnalysis';
import { TechnicalRecommendations } from './technical/TechnicalRecommendations';

interface TechnicalAutomationProps {
  session: any;
}

export function TechnicalAutomation({ session }: TechnicalAutomationProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [url, setUrl] = useState('');

  const runTechnicalAnalysis = async (type) => {
    if (!session?.access_token) {
      toast.error('Please sign in to run technical analysis');
      return;
    }

    if (!url.trim()) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    setAnalyzing(true);
    setActiveAnalysis(type);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/technical-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ url, type })
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
            <Zap className="h-5 w-5 mr-2" />
            Technical SEO Automation
          </CardTitle>
          <CardDescription>
            Comprehensive technical analysis including page speed, mobile-friendliness, and security checks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Input
              placeholder="Enter URL to analyze..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => runTechnicalAnalysis('pagespeed')}
              disabled={analyzing}
              variant={activeAnalysis === 'pagespeed' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Zap className="h-6 w-6 mb-2" />
              Page Speed
              {analyzing && activeAnalysis === 'pagespeed' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runTechnicalAnalysis('mobile')}
              disabled={analyzing}
              variant={activeAnalysis === 'mobile' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Smartphone className="h-6 w-6 mb-2" />
              Mobile-Friendly
              {analyzing && activeAnalysis === 'mobile' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runTechnicalAnalysis('security')}
              disabled={analyzing}
              variant={activeAnalysis === 'security' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Shield className="h-6 w-6 mb-2" />
              Security Check
              {analyzing && activeAnalysis === 'security' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runTechnicalAnalysis('duplicate')}
              disabled={analyzing}
              variant={activeAnalysis === 'duplicate' ? 'default' : 'outline'}
              className="h-20 flex-col"
            >
              <Copy className="h-6 w-6 mb-2" />
              Duplicate Content
              {analyzing && activeAnalysis === 'duplicate' && (
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
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="recommendations">Fix Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TechnicalOverview results={results} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceAnalysis results={results} />
          </TabsContent>

          <TabsContent value="mobile">
            <MobileAnalysis results={results} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityAnalysis results={results} />
          </TabsContent>

          <TabsContent value="recommendations">
            <TechnicalRecommendations results={results} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}