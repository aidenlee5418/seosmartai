"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { MessageCircle, Send, Heart, Lightbulb, Bug, Star } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

interface FeedbackFormProps {
  className?: string;
}

export function FeedbackForm({ className = "" }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'general', label: 'General Feedback', icon: MessageCircle, color: 'blue' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'purple' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'red' },
    { id: 'praise', label: 'Love It!', icon: Heart, color: 'green' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/send-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      toast.success('Thank you for your feedback! 🙏');
      setFormData({
        name: '',
        email: '',
        feedbackType: 'general',
        message: ''
      });
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`py-20 px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            We're in Beta!
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Help Us Build Something Amazing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            SmartSEO AI is completely free during our beta phase. Your feedback helps us make it even better!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Types */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-black mb-6">What would you like to share?</h3>
            <div className="space-y-3">
              {feedbackTypes.map((type) => {
                const colorClasses = {
                  blue: 'bg-blue-50 border-blue-200 text-blue-700',
                  purple: 'bg-purple-50 border-purple-200 text-purple-700',
                  red: 'bg-red-50 border-red-200 text-red-700',
                  green: 'bg-green-50 border-green-200 text-green-700'
                };

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, feedbackType: type.id }))}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                      formData.feedbackType === type.id 
                        ? colorClasses[type.color]
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        formData.feedbackType === type.id 
                          ? `bg-${type.color}-100` 
                          : 'bg-gray-100'
                      }`}>
                        <type.icon className={`h-5 w-5 ${
                          formData.feedbackType === type.id 
                            ? `text-${type.color}-600` 
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Beta Benefits */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
              <h4 className="font-medium text-black mb-4 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Beta Benefits
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 100% free access to all features</li>
                <li>• Unlimited SEO analyses</li>
                <li>• Direct line to our development team</li>
                <li>• Shape the future of the product</li>
                <li>• Early access to new features</li>
              </ul>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Send Us Your Feedback
                </CardTitle>
                <CardDescription>
                  Every piece of feedback helps us improve. We read every message personally!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 resize-none"
                      placeholder="Tell us what you think, what features you'd like to see, or any issues you've encountered..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg rounded-xl font-medium"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Have a quick question? Reach out directly to our founder!
          </p>
          <a 
            href="mailto:loo5418@gmail.com" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            loo5418@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}