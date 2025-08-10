"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Link, Search, Image, Zap, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

interface TechnicalSEOToolsProps {
  session: any;
}

export function TechnicalSEOTools({ session }: TechnicalSEOToolsProps) {
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const runAnalysis = async (type, endpoint) => {
    if (!url.trim()) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    if (!session?.access_token) {
      toast.error('Please sign in to run analysis');
      return;
    }

    setLoading(true);
    setActiveAnalysis({ type, data: null });

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/${endpoint}`, {
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
      setActiveAnalysis({ type, data });
      toast.success(`${type} analysis completed!`);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(`Failed to run ${type} analysis. Please try again.`);
      setActiveAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical SEO Analysis</CardTitle>
          <CardDescription>Comprehensive technical SEO audit tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <input
              type="url"
              placeholder="Enter URL to analyze..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => runAnalysis('Link Audit', 'audit-links')}
              disabled={loading}
              className="h-20 flex-col"
              variant={activeAnalysis?.type === 'Link Audit' ? 'default' : 'outline'}
            >
              <Link className="h-6 w-6 mb-2" />
              Link Audit
              {loading && activeAnalysis?.type === 'Link Audit' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              onClick={() => runAnalysis('Schema Validation', 'validate-schema')}
              disabled={loading}
              className="h-20 flex-col"
              variant={activeAnalysis?.type === 'Schema Validation' ? 'default' : 'outline'}
            >
              <Search className="h-6 w-6 mb-2" />
              Schema Validation
              {loading && activeAnalysis?.type === 'Schema Validation' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mt-1"></div>
              )}
            </Button>

            <Button
              disabled
              className="h-20 flex-col"
              variant="outline"
            >
              <Image className="h-6 w-6 mb-2" />
              Image Optimization
              <Badge variant="secondary" className="mt-1 text-xs">Coming Soon</Badge>
            </Button>

            <Button
              disabled
              className="h-20 flex-col"
              variant="outline"
            >
              <Zap className="h-6 w-6 mb-2" />
              Page Speed
              <Badge variant="secondary" className="mt-1 text-xs">Coming Soon</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeAnalysis?.data && (
        <div className="space-y-6">
          {activeAnalysis.type === 'Link Audit' && (
            <LinkAuditResults data={activeAnalysis.data} />
          )}
          {activeAnalysis.type === 'Schema Validation' && (
            <SchemaValidationResults data={activeAnalysis.data} />
          )}
        </div>
      )}
    </div>
  );
}

function LinkAuditResults({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Link Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Links:</span>
              <Badge variant="secondary">{data.totalLinks}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Internal Links:</span>
              <Badge variant="secondary">{data.internalCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>External Links:</span>
              <Badge variant="secondary">{data.externalCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Broken Links:</span>
              <Badge variant={data.brokenCount > 0 ? "destructive" : "secondary"}>
                {data.brokenCount}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link Details</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <Tabs defaultValue="internal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="internal">Internal</TabsTrigger>
              <TabsTrigger value="external">External</TabsTrigger>
              <TabsTrigger value="broken">Broken</TabsTrigger>
            </TabsList>
            
            <TabsContent value="internal" className="mt-4">
              <div className="space-y-2">
                {data.links.internal.length > 0 ? (
                  data.links.internal.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{link.text || 'No anchor text'}</p>
                        <p className="text-xs text-gray-500 truncate">{link.url}</p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No internal links found</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="external" className="mt-4">
              <div className="space-y-2">
                {data.links.external.length > 0 ? (
                  data.links.external.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{link.text || 'No anchor text'}</p>
                        <p className="text-xs text-gray-500 truncate">{link.url}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-blue-500 ml-2" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No external links found</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="broken" className="mt-4">
              <div className="space-y-2">
                {data.links.broken.length > 0 ? (
                  data.links.broken.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded border-red-200 bg-red-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{link.text || 'No anchor text'}</p>
                        <p className="text-xs text-red-600 truncate">{link.url}</p>
                        <p className="text-xs text-red-500">{link.reason}</p>
                      </div>
                      <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-green-600 py-4">No broken links found</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function SchemaValidationResults({ data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Schema Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>JSON-LD Schemas:</span>
              <Badge variant="secondary">{data.jsonLdCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Microdata Elements:</span>
              <Badge variant="secondary">{data.microdataCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Validation Errors:</span>
              <Badge variant={data.hasErrors ? "destructive" : "secondary"}>
                {data.hasErrors ? 'Yes' : 'None'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Schema Score:</span>
              <Badge variant={data.score > 80 ? "secondary" : data.score > 50 ? "outline" : "destructive"}>
                {data.score}/100
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schema Details</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {data.schemas.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No structured data found</p>
            ) : (
              data.schemas.map((schema, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{schema.type}</span>
                    <Badge variant={schema.valid ? "secondary" : "destructive"}>
                      {schema.valid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                  {schema.error && (
                    <p className="text-sm text-red-600">{schema.error}</p>
                  )}
                  {schema.data && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-600 cursor-pointer">View Details</summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(schema.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}