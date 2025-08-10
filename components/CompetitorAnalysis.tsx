"use client";

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Search, Loader2, TrendingUp, TrendingDown, Lightbulb, Target } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface CompetitorAnalysisProps {
  session: any
}

export function CompetitorAnalysis({ session }: CompetitorAnalysisProps) {
  const [domain, setDomain] = useState('')
  const [competitors, setCompetitors] = useState([''])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const addCompetitor = () => {
    setCompetitors([...competitors, ''])
  }

  const updateCompetitor = (index: number, value: string) => {
    const updated = [...competitors]
    updated[index] = value
    setCompetitors(updated)
  }

  const removeCompetitor = (index: number) => {
    if (competitors.length > 1) {
      const updated = competitors.filter((_, i) => i !== index)
      setCompetitors(updated)
    }
  }

  const analyzeCompetitors = async () => {
    setLoading(true)
    
    try {
      const validCompetitors = competitors.filter(comp => comp.trim())
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/competitor-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          domain, 
          competitors: validCompetitors 
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Competitor Analysis
          </CardTitle>
          <CardDescription>
            Analyze your competitors' SEO strategies, identify content gaps, 
            and discover opportunities to outrank them.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Your Domain</Label>
            <Input
              id="domain"
              type="url"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Competitor Domains</Label>
            {competitors.map((competitor, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="competitor.com"
                  value={competitor}
                  onChange={(e) => updateCompetitor(index, e.target.value)}
                />
                {competitors.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeCompetitor(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            
            <Button variant="outline" onClick={addCompetitor} className="w-full">
              Add Competitor
            </Button>
          </div>
          
          <Button 
            onClick={analyzeCompetitors} 
            disabled={!domain || competitors.every(c => !c.trim()) || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Competitors...
              </>
            ) : (
              'Analyze Competitors'
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Competitor Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.competitors.map((competitor: any, index: number) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    {competitor.domain}
                    <Badge variant={competitor.score >= 80 ? 'default' : competitor.score >= 60 ? 'secondary' : 'destructive'}>
                      {competitor.score}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        competitor.score >= 80 ? 'bg-green-600' : 
                        competitor.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${competitor.score}%` }}
                    ></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-green-700 mb-1">Strengths:</p>
                      {competitor.strengths.map((strength: string, i: number) => (
                        <div key={i} className="flex items-start gap-1 text-xs">
                          <TrendingUp className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-orange-700 mb-1">Content Gaps:</p>
                      {competitor.contentGaps.map((gap: string, i: number) => (
                        <div key={i} className="flex items-start gap-1 text-xs">
                          <TrendingDown className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="text-orange-700">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-800 font-medium">
                          {recommendation}
                        </p>
                      </div>
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