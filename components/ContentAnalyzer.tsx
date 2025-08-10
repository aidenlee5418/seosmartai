"use client";

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Label } from './ui/label'
import { AlertTriangle, CheckCircle, FileText, Lightbulb, Loader2 } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface ContentAnalyzerProps {
  session: any
}

export function ContentAnalyzer({ session }: ContentAnalyzerProps) {
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const analyzeContent = async (type: 'url' | 'text') => {
    setLoading(true)
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/analyze-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          url: type === 'url' ? url : null,
          content: type === 'text' ? content : null,
          type
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setAnalysis(data.analysis)
      } else {
        console.error('Analysis failed:', data.error)
      }
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content SEO Analysis
          </CardTitle>
          <CardDescription>
            Analyze your content for SEO optimization opportunities. Check H-tags, meta descriptions, 
            keyword usage, and get AI-powered suggestions for improvement.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Analyze URL</TabsTrigger>
              <TabsTrigger value="text">Analyze Text</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => analyzeContent('url')} 
                disabled={!url || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze URL'
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content Text</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your content here for analysis..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={() => analyzeContent('text')} 
                disabled={!content || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Content'
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                SEO Score
                <Badge variant={getScoreBadge(analysis.score)}>
                  {analysis.score}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      analysis.score >= 80 ? 'bg-green-600' : 
                      analysis.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${analysis.score}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600">
                  {analysis.score >= 80 ? 'Excellent SEO optimization!' :
                   analysis.score >= 60 ? 'Good, but room for improvement.' :
                   'Needs significant SEO improvements.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Issues Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Issues Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.issues.length > 0 ? (
                  analysis.issues.map((issue: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{issue}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    No critical issues found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}