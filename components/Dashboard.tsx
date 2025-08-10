"use client";


import React, { useEffect, useState } from 'react';
import OnboardingModal from './OnboardingModal';
import Topbar from './common/Topbar';
import { getHistory, runAnalysis } from '../services/api';
import { useCredits } from '../context/CreditContext';
import { downloadFile, jsonToCsv } from '../utils/export';

import React from 'react';
import Topbar from './common/Topbar';
import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Search, Link, FileText, Zap, BarChart3, TrendingUp, Users, LogOut, CheckCircle, AlertTriangle, Clock, Brain, Target, Shield, RefreshCw, Lightbulb, X, ArrowRight } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { toast } from "sonner@2.0.3";
import { ContentAnalysis } from './ContentAnalysis';
import { TechnicalSEOTools } from './TechnicalSEOTools';
import { ContentGenerator } from './ContentGenerator';
import { CompetitorIntelligence } from './CompetitorIntelligence';
import { EEATAnalyzer } from './EEATAnalyzer';
import { TechnicalAutomation } from './TechnicalAutomation';
import { MaintenanceTools } from './MaintenanceTools';
import { BonusFeatures } from './BonusFeatures';

interface DashboardProps {
  user: any;
  session: any;
  onSignOut: () => void;
  showOnboarding: boolean;
  onOnboardingComplete: () => void;
}

export function Dashboard({ user, session, onSignOut, showOnboarding, onOnboardingComplete }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analysisHistory, setAnalysisHistory] = useState([]);

  useEffect(() => {
    if (session) {
      loadAnalysisHistory();
    }
  }, [session]);

  const loadAnalysisHistory = async () => {
    try {
      if (!session?.access_token) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/analysis-history`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisHistory(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading analysis history:', error);
    }
  };

  const startFirstAudit = () => {
    onOnboardingComplete();
    setActiveTab('content');
  };

  const handleSignOutClick = async () => {
    try {
      await supabase.auth.signOut();
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Onboarding Modal */}
      <Dialog open={showOnboarding} onOpenChange={onOnboardingComplete}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOnboardingComplete}
                className="absolute top-4 right-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogTitle className="text-2xl font-bold text-black">
              Welcome to SmartSEO AI Pro! 🎉
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Your 7-day free trial has started. Let's run your first analysis and see what we can optimize.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-medium text-blue-900 mb-2">What you get during your trial:</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Unlimited SEO audits and analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  AI-powered content generation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Competitor intelligence reports
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Technical SEO automation
                </li>
              </ul>
            </div>
            <Button 
              onClick={startFirstAudit}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3"
            >
              Start My First Audit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-black">SmartSEO AI</h1>
                <Badge variant="secondary" className="ml-3 bg-blue-50 text-blue-700 border-blue-200">
                  Pro Trial
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                Welcome, {user.email?.split('@')[0]}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOutClick} className="text-gray-600 hover:text-black">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-9 min-w-[900px] bg-gray-50">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-white">Dashboard</TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-white">Content Audit</TabsTrigger>
              <TabsTrigger value="generation" className="data-[state=active]:bg-white">AI Generation</TabsTrigger>
              <TabsTrigger value="technical" className="data-[state=active]:bg-white">Technical SEO</TabsTrigger>
              <TabsTrigger value="competitor" className="data-[state=active]:bg-white">Competitor Intel</TabsTrigger>
              <TabsTrigger value="eeat" className="data-[state=active]:bg-white">E-E-A-T Signals</TabsTrigger>
              <TabsTrigger value="automation" className="data-[state=active]:bg-white">Automation</TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-white">Maintenance</TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-white">Advanced Tools</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Hero Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-3">Your SEO Command Center</h2>
                    <p className="text-blue-100 mb-6 text-lg">
                      Ready to dominate search results? Let's make your competitors nervous.
                    </p>
                    <Button 
                      variant="secondary" 
                      onClick={() => setActiveTab('generation')}
                      className="bg-white text-blue-600 hover:bg-gray-100 font-medium"
                    >
                      Generate AI Content
                      <Brain className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center">
                      <Zap className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Total Analyses"
                value={analysisHistory.length}
                icon={<BarChart3 className="h-5 w-5" />}
                change="+2 this week"
                trend="positive"
              />
              <StatsCard 
                title="Pages Analyzed"
                value="2,847"
                icon={<FileText className="h-5 w-5" />}
                change="+180 this week"
                trend="positive"
              />
              <StatsCard 
                title="Issues Found"
                value="143"
                icon={<AlertTriangle className="h-5 w-5" />}
                change="-23 from last week"
                trend="positive"
              />
              <StatsCard 
                title="Avg. SEO Score"
                value="87%"
                icon={<TrendingUp className="h-5 w-5" />}
                change="+5% improvement"
                trend="positive"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI-Powered Tools */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-600" />
                    AI-Powered SEO Tools
                  </CardTitle>
                  <CardDescription>Automate your SEO workflow with intelligent analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ToolCard 
                    icon={<Brain className="h-5 w-5" />}
                    title="AI Content Generation"
                    description="Generate SEO-optimized content that actually converts"
                    status="active"
                    onClick={() => setActiveTab('generation')}
                  />
                  <ToolCard 
                    icon={<FileText className="h-5 w-5" />}
                    title="Content Structure Analysis"
                    description="Perfect your H-tags, alt text, and schema markup"
                    status="active"
                    onClick={() => setActiveTab('content')}
                  />
                  <ToolCard 
                    icon={<Users className="h-5 w-5" />}
                    title="Competitor Intelligence"
                    description="Spy on competitors and steal their best strategies"
                    status="active"
                    onClick={() => setActiveTab('competitor')}
                  />
                </CardContent>
              </Card>

              {/* Technical & Automation */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-purple-600" />
                    Technical & Automation
                  </CardTitle>
                  <CardDescription>Advanced tools for technical SEO mastery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ToolCard 
                    icon={<Shield className="h-5 w-5" />}
                    title="E-E-A-T Signal Analysis"
                    description="Build trust and authority signals Google loves"
                    status="active"
                    onClick={() => setActiveTab('eeat')}
                  />
                  <ToolCard 
                    icon={<Zap className="h-5 w-5" />}
                    title="Technical Automation"
                    description="Fix speed, mobile, and security issues automatically"
                    status="active"
                    onClick={() => setActiveTab('automation')}
                  />
                  <ToolCard 
                    icon={<RefreshCw className="h-5 w-5" />}
                    title="Content Maintenance"
                    description="Keep content fresh and rankings stable"
                    status="active"
                    onClick={() => setActiveTab('maintenance')}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle>Recent Analysis</CardTitle>
                <CardDescription>Your latest SEO wins and improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisHistory.length > 0 ? (
                  analysisHistory.map((analysis, index) => (
                    <AnalysisHistoryItem key={index} analysis={analysis} />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No analyses yet</h3>
                    <p className="text-sm mb-4">Start your first analysis to see results here</p>
                    <Button onClick={() => setActiveTab('content')} className="bg-blue-600 hover:bg-blue-700">
                      Run First Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <ContentAnalysis session={session} />
          </TabsContent>

          <TabsContent value="generation">
            <ContentGenerator session={session} />
          </TabsContent>

          <TabsContent value="technical">
            <TechnicalSEOTools session={session} />
          </TabsContent>

          <TabsContent value="competitor">
            <CompetitorIntelligence session={session} />
          </TabsContent>

          <TabsContent value="eeat">
            <EEATAnalyzer session={session} />
          </TabsContent>

          <TabsContent value="automation">
            <TechnicalAutomation session={session} />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceTools session={session} />
          </TabsContent>

          <TabsContent value="advanced">
            <BonusFeatures session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, change, trend = "neutral" }) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className="text-gray-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-black">{value}</div>
        <p className={`text-xs ${trend === 'positive' ? 'text-green-600' : 'text-gray-500'}`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

function ToolCard({ icon, title, description, status, onClick }) {
  const statusColors = {
    active: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div 
      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all group"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <div className="text-blue-600">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-black">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <Badge className={statusColors[status]} variant="outline">
        {status === 'active' ? 'Ready' : status === 'pending' ? 'Coming Soon' : 'Error'}
      </Badge>
    </div>
  );
}

function AnalysisHistoryItem({ analysis }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'content_analysis':
        return <FileText className="h-4 w-4" />;
      case 'link_audit':
        return <Link className="h-4 w-4" />;
      case 'schema_validation':
        return <Search className="h-4 w-4" />;
      case 'content_generation':
        return <Brain className="h-4 w-4" />;
      case 'competitor_analysis':
        return <Users className="h-4 w-4" />;
      case 'eeat_analysis':
        return <Shield className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'content_analysis':
        return 'Content Analysis';
      case 'link_audit':
        return 'Link Audit';
      case 'schema_validation':
        return 'Schema Validation';
      case 'content_generation':
        return 'Content Generation';
      case 'competitor_analysis':
        return 'Competitor Analysis';
      case 'eeat_analysis':
        return 'E-E-A-T Analysis';
      default:
        return 'Analysis';
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <div className="text-blue-600">
            {getTypeIcon(analysis.type)}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-black">{getTypeLabel(analysis.type)}</p>
          <p className="text-xs text-gray-500">
            {analysis.url ? new URL(analysis.url).hostname : 'Analysis'} • {timeAgo(analysis.created_at)}
          </p>
        </div>
      </div>
      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
        {analysis.results?.score ? `${analysis.results.score}/100` : 'Completed'}
      </Badge>
    </div>
  );
}


export function DashboardExtras() {
  const [recent, setRecent] = useState<any[]>([]);
  const { tryConsume } = useCredits();

  useEffect(() => {
    getHistory(5).then(setRecent).catch(()=>{});
  }, []);

  const handleAnalyze = async () => {
    const ok = await tryConsume(1);
    if (!ok) { alert('Not enough credits.'); window.location.href='/pricing'; return; }
    await runAnalysis({ url: 'https://example.com', type: 'technical' });
    alert('Demo analysis queued');
  };

  const handleExport = () => {
    const csv = jsonToCsv(recent.map(r => ({ id:r.id, summary:r.summary, created_at:r.created_at })));
    downloadFile('recent_analyses.csv', csv, 'text/csv');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <button className="px-3 py-1.5 rounded bg-black text-white" onClick={handleAnalyze}>Run Demo Analysis</button>
        <button className="px-3 py-1.5 rounded border" onClick={handleExport}>Export Recent CSV</button>
      </div>
      <ul className="text-sm list-disc pl-5">
        {recent.map(r => <li key={r.id}>{r.summary ?? 'No summary'} — {new Date(r.created_at).toLocaleString()}</li>)}
      </ul>
    </div>
  );
}
