"use client";

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Settings, Loader2, CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface TechnicalAuditProps {
  session: any
}

export function TechnicalAudit({ session }: TechnicalAuditProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [audit, setAudit] = useState(null)

  const runAudit = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/technical-audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ url })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setAudit(data.audit)
      } else {
        console.error('Audit failed:', data.error)
      }
    } catch (error) {
      console.error('Audit error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-600">Passed</Badge>
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-600 text-white">Warning</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Technical SEO Audit
          </CardTitle>
          <CardDescription>
            Comprehensive technical SEO analysis including H-tags, internal links, 
            external links, schema markup, and image optimization.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audit-url">Website URL</Label>
            <Input
              id="audit-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={runAudit} 
            disabled={!url || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Audit...
              </>
            ) : (
              'Start Technical Audit'
            )}
          </Button>
        </CardContent>
      </Card>

      {audit && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Overall Technical Score
                <Badge variant={audit.score >= 80 ? 'default' : audit.score >= 60 ? 'secondary' : 'destructive'}>
                  {audit.score}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    audit.score >= 80 ? 'bg-green-600' : 
                    audit.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${audit.score}%` }}
                ></div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <ExternalLink className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{audit.url}</span>
              </div>
            </CardContent>
          </Card>

          {/* Audit Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(audit.checks).map(([key, check]: [string, any]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(check.status)}
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    {getStatusBadge(check.status)}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">{check.message}</p>
                  
                  {check.issues && check.issues.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-red-700">Issues:</p>
                      {check.issues.map((issue: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-red-700">{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {check.suggestions && check.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-700">Suggestions:</p>
                      {check.suggestions.map((suggestion: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-700">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}