"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Brain, FileText, HelpCircle, ShoppingBag, BookOpen, Copy, Download, RefreshCw } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

interface ContentGeneratorProps {
  session: any;
}

export function ContentGenerator({ session }: ContentGeneratorProps) {
  const [activeGenerator, setActiveGenerator] = useState('product');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: '',
    targetKeywords: '',
    contentType: 'product',
    contentLength: 'medium',
    tone: 'professional',
    existingContent: '',
    targetUrl: ''
  });

  const handleGenerate = async (type) => {
    if (!session?.access_token) {
      toast.error('Please sign in to generate content');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          type,
          ...formData
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Generation failed: ${errorText}`);
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard!');
  };

  const downloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `generated-content-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Content downloaded!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Content Generation & Enhancement
          </CardTitle>
          <CardDescription>
            Automatically generate SEO-optimized content for products, blogs, and marketing materials
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeGenerator} onValueChange={setActiveGenerator} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="product">Product Pages</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="summary">TL;DR & FAQ</TabsTrigger>
          <TabsTrigger value="enhancement">Content Enhancement</TabsTrigger>
        </TabsList>

        <TabsContent value="product" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Product Detail Generator
                </CardTitle>
                <CardDescription>Create compelling product descriptions with SEO optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <Input
                    placeholder="Enter product name..."
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Product Category</label>
                  <Select onValueChange={(value) => setFormData({ ...formData, productCategory: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing & Fashion</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      <SelectItem value="books">Books & Media</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Keywords</label>
                  <Input
                    placeholder="keyword1, keyword2, keyword3..."
                    value={formData.targetKeywords}
                    onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Content Length</label>
                    <Select onValueChange={(value) => setFormData({ ...formData, contentLength: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Medium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (150-300 words)</SelectItem>
                        <SelectItem value="medium">Medium (300-600 words)</SelectItem>
                        <SelectItem value="long">Long (600-1000 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <Select onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Professional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={() => handleGenerate('product')} 
                  disabled={generating || !formData.productName}
                  className="w-full"
                >
                  {generating ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Product Description...
                    </div>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Product Page
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <GeneratedContentDisplay 
              content={generatedContent}
              onCopy={copyToClipboard}
              onDownload={downloadContent}
              title="Generated Product Description"
            />
          </div>
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Blog Post Generator
                </CardTitle>
                <CardDescription>Create SEO-optimized blog posts with keyword integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Blog Topic/Title</label>
                  <Input
                    placeholder="Enter blog post topic..."
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Keywords</label>
                  <Input
                    placeholder="primary keyword, secondary keyword, long-tail keyword..."
                    value={formData.targetKeywords}
                    onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <Select onValueChange={(value) => setFormData({ ...formData, contentType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="How-to Guide" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="howto">How-to Guide</SelectItem>
                      <SelectItem value="listicle">Listicle</SelectItem>
                      <SelectItem value="review">Product Review</SelectItem>
                      <SelectItem value="comparison">Comparison</SelectItem>
                      <SelectItem value="news">News/Update</SelectItem>
                      <SelectItem value="opinion">Opinion/Editorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Article Length</label>
                  <Select onValueChange={(value) => setFormData({ ...formData, contentLength: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Long-form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                      <SelectItem value="long">Long-form (1200-2000 words)</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive (2000+ words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => handleGenerate('blog')} 
                  disabled={generating || !formData.productName}
                  className="w-full"
                >
                  {generating ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Blog Post...
                    </div>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Generate Blog Post
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <GeneratedContentDisplay 
              content={generatedContent}
              onCopy={copyToClipboard}
              onDownload={downloadContent}
              title="Generated Blog Post"
            />
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  TL;DR & FAQ Generator
                </CardTitle>
                <CardDescription>Generate summaries and People Also Ask style questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Source Content URL</label>
                  <Input
                    placeholder="https://example.com/article"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Or Paste Content</label>
                  <Textarea
                    placeholder="Paste your existing content here..."
                    value={formData.existingContent}
                    onChange={(e) => setFormData({ ...formData, existingContent: e.target.value })}
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Generation Type</label>
                  <Select onValueChange={(value) => setFormData({ ...formData, contentType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="TL;DR Summary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tldr">TL;DR Summary</SelectItem>
                      <SelectItem value="faq">FAQ Section</SelectItem>
                      <SelectItem value="paa">People Also Ask</SelectItem>
                      <SelectItem value="keypoints">Key Points</SelectItem>
                      <SelectItem value="all">All Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => handleGenerate('summary')} 
                  disabled={generating || (!formData.targetUrl && !formData.existingContent)}
                  className="w-full"
                >
                  {generating ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Summary...
                    </div>
                  ) : (
                    <>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Generate Summary & FAQ
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <GeneratedContentDisplay 
              content={generatedContent}
              onCopy={copyToClipboard}
              onDownload={downloadContent}
              title="Generated Summary & FAQ"
            />
          </div>
        </TabsContent>

        <TabsContent value="enhancement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Content Enhancement
                </CardTitle>
                <CardDescription>Improve existing content with SEO optimization and keyword integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content to Enhance</label>
                  <Textarea
                    placeholder="Paste your existing content here for enhancement..."
                    value={formData.existingContent}
                    onChange={(e) => setFormData({ ...formData, existingContent: e.target.value })}
                    rows={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Keywords to Add</label>
                  <Input
                    placeholder="keyword1, keyword2, keyword3..."
                    value={formData.targetKeywords}
                    onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Enhancement Type</label>
                  <Select onValueChange={(value) => setFormData({ ...formData, contentType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="SEO Optimization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seo">SEO Optimization</SelectItem>
                      <SelectItem value="readability">Improve Readability</SelectItem>
                      <SelectItem value="expansion">Content Expansion</SelectItem>
                      <SelectItem value="restructure">Restructure & Organize</SelectItem>
                      <SelectItem value="cta">Add Call-to-Actions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => handleGenerate('enhancement')} 
                  disabled={generating || !formData.existingContent}
                  className="w-full"
                >
                  {generating ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Enhancing Content...
                    </div>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Enhance Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <GeneratedContentDisplay 
              content={generatedContent}
              onCopy={copyToClipboard}
              onDownload={downloadContent}
              title="Enhanced Content"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GeneratedContentDisplay({ content, onCopy, onDownload, title }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {content && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {content ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">{content}</pre>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Words: {content.split(' ').length}</span>
              <span>Characters: {content.length}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>Generated content will appear here</p>
            <p className="text-sm">Fill out the form and click generate to create optimized content</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}