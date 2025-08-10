"use client";

import { capture } from '../utils/posthog';
import React, { useEffect, useState } from 'react';
import { getHistory } from '../services/api';
import { analysisToMarkdown } from '../utils/export_markdown';
import { downloadFile } from '../utils/export';
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Clock, FileText, Settings, Search, ExternalLink, Eye } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface AnalysisHistoryProps {
  session: any
}

export function AnalysisHistory({ session }: AnalysisHistoryProps) {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/analyses`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      const data = await response.json()
      if (response.ok) {
        setAnalyses(data.analyses)
      }
    } catch (error) {
      console.error('Failed to fetch analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAnalysisIcon = (analysis: any) => {
    if (analysis.checks) return <Settings className="h-5 w-5 text-blue-600" />
    if (analysis.competitors) return <Search className="h-5 w-5 text-purple-600" />
    return <FileText className="h-5 w-5 text-green-600" />
  }

  const getAnalysisType = (analysis: any) => {
    if (analysis.checks) return 'Technical Audit'
    if (analysis.competitors) return 'Competitor Analysis'
    return 'Content Analysis'
  }

  const getAnalysisTypeColor = (analysis: any) => {
    if (analysis.checks) return 'bg-blue-100 text-blue-800'
    if (analysis.competitors) return 'bg-purple-100 text-purple-800'
    return 'bg-green-100 text-green-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading analysis history...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Analysis History
          </CardTitle>
          <CardDescription>
            Review all your previous SEO analyses and track your optimization progress over time.
          </CardDescription>
        </CardHeader>
      </Card>

      {analyses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
            <p className="text-gray-500 mb-4">
              Start by running your first SEO analysis using the Content Analysis or Technical Audit tabs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis: any) => (
            <Card key={analysis.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getAnalysisIcon(analysis)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getAnalysisTypeColor(analysis)}>
                          {getAnalysisType(analysis)}
                        </Badge>
                        {analysis.score && (
                          <Badge variant={analysis.score >= 80 ? 'default' : analysis.score >= 60 ? 'secondary' : 'destructive'}>
                            {analysis.score}/100
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-1">
                        {analysis.url || analysis.domain || 'Content Analysis'}
                      </h3>
                      
                      <p className="text-sm text-gray-500 mb-2">
                        {formatDate(analysis.timestamp)}
                      </p>
                      
                      {analysis.issues && analysis.issues.length > 0 && (
                        <p className="text-sm text-orange-600">
                          {analysis.issues.length} issue{analysis.issues.length !== 1 ? 's' : ''} found
                        </p>
                      )}
                      
                      {analysis.competitors && (
                        <p className="text-sm text-gray-600">
                          Analyzed {analysis.competitors.length} competitor{analysis.competitors.length !== 1 ? 's' : ''}
                        </p>
                      )}
                      
                      {analysis.checks && (
                        <p className="text-sm text-gray-600">
                          Technical audit completed - {Object.keys(analysis.checks).length} checks performed
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {analysis.url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={analysis.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

