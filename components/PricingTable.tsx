import React from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, BarChart3, PenTool, FileText, Users, Link, Search, Zap, Phone, Star } from 'lucide-react';

interface PricingTableProps {
  onGetStarted?: () => void;
  className?: string;
}

export function PricingTable({ onGetStarted, className = "" }: PricingTableProps) {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "month",
      description: "For bloggers and freelancers",
      popular: false,
      features: [
        { text: "Up to 30 analyses per month", icon: BarChart3 },
        { text: "10 AI content generations", icon: PenTool },
        { text: "Basic SEO report", icon: FileText },
        { text: "Email support", icon: null },
        { text: "7-day free trial", icon: null }
      ],
      cta: "Get Started",
      ctaVariant: "outline" as const
    },
    {
      name: "Pro",
      price: "$29",
      period: "month",
      description: "For small marketing teams",
      popular: true,
      features: [
        { text: "Up to 100 analyses per month", icon: BarChart3 },
        { text: "30 AI content generations", icon: PenTool },
        { text: "Competitor analysis", icon: Users },
        { text: "Link audit", icon: Link },
        { text: "Priority support", icon: null },
        { text: "Advanced reports", icon: null }
      ],
      cta: "Upgrade to Pro",
      ctaVariant: "default" as const
    },
    {
      name: "Agency",
      price: "$79",
      period: "month",
      description: "For agencies and heavy users",
      popular: false,
      features: [
        { text: "Up to 500 analyses per month", icon: BarChart3 },
        { text: "Unlimited AI content generations", icon: PenTool },
        { text: "Full SERP monitoring", icon: Search },
        { text: "API access", icon: Zap },
        { text: "White-label reports", icon: null },
        { text: "Dedicated support", icon: Phone }
      ],
      cta: "Contact Sales",
      ctaVariant: "outline" as const
    }
  ];

  return (
    <section className={`py-20 px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the perfect plan to supercharge your SEO workflow. No hidden fees, no surprises.
          </p>
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">All plans include 7-day free trial</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              onGetStarted={onGetStarted}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Need a custom plan? We're here to help.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50"
          >
            <Phone className="mr-2 h-4 w-4" />
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  plan: {
    name: string;
    price: string;
    period: string;
    description: string;
    popular: boolean;
    features: Array<{ text: string; icon?: any }>;
    cta: string;
    ctaVariant: "default" | "outline";
  };
  onGetStarted?: () => void;
}

function PricingCard({ plan, onGetStarted }: PricingCardProps) {
  return (
    <Card 
      className={`relative p-8 border-2 transition-all duration-300 hover:shadow-xl ${
        plan.popular 
          ? 'border-blue-600 shadow-lg scale-105 bg-gradient-to-b from-blue-50/50 to-white' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 text-white px-6 py-2 text-sm font-medium rounded-full shadow-md">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl font-bold text-black mb-2">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-gray-600 mb-6">
          {plan.description}
        </CardDescription>
        
        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-bold text-black">{plan.price}</span>
            <span className="text-gray-600 ml-2">/{plan.period}</span>
          </div>
          {plan.name === "Starter" && (
            <p className="text-sm text-gray-500 mt-2">Then $9/month after trial</p>
          )}
          {plan.name === "Agency" && (
            <p className="text-sm text-gray-500 mt-2">Custom pricing available</p>
          )}
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          variant={plan.ctaVariant}
          className={`w-full py-3 rounded-xl font-medium transition-all ${
            plan.popular
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : plan.ctaVariant === 'outline'
              ? 'border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600'
              : ''
          }`}
          onClick={onGetStarted}
        >
          {plan.cta}
        </Button>
      </CardHeader>

      <CardContent>
        {/* Features List */}
        <ul className="space-y-4">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {feature.icon ? (
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <feature.icon className="h-3 w-3 text-blue-600" />
                  </div>
                ) : (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </div>
              <span className="text-gray-700 leading-relaxed">{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* Value Props */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Check className="h-4 w-4 text-green-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PricingTable;