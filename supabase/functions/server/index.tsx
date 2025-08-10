import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.0';
import { cors } from 'npm:hono@3.12.6/cors';
import { Hono } from 'npm:hono@3.12.6';
import { logger } from 'npm:hono@3.12.6/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Authentication middleware
const authenticateUser = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Authentication error:', error);
      return c.json({ code: 401, message: 'Invalid JWT' }, 401);
    }
    
    c.set('user', user);
    await next();
  } catch (error) {
    console.error('Token verification error:', error);
    return c.json({ code: 401, message: 'Invalid JWT' }, 401);
  }
};

// Health check endpoint
app.get('/make-server-fb0be124/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User signup endpoint
app.post('/make-server-fb0be124/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Automatically confirm the user's email since an email server hasn't been configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: 'User created successfully', user: data.user });
  } catch (error) {
    console.error('Signup endpoint error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Feedback submission endpoint (no authentication required)
app.post('/make-server-fb0be124/send-feedback', async (c) => {
  try {
    const { name, email, feedbackType, message, timestamp, userAgent } = await c.req.json();
    
    if (!name || !email || !message) {
      return c.json({ error: 'Name, email and message are required' }, 400);
    }

    // Store feedback in KV store
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const feedbackData = {
      id: feedbackId,
      name,
      email,
      feedbackType: feedbackType || 'general',
      message,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || 'Unknown',
      status: 'new'
    };

    // Store individual feedback
    await kv.set(feedbackId, feedbackData);
    
    // Add to feedback list for easy retrieval
    const feedbackListKey = 'feedback_list';
    const currentList = await kv.get(feedbackListKey) || [];
    currentList.unshift(feedbackId);
    await kv.set(feedbackListKey, currentList.slice(0, 1000)); // Keep last 1000 feedback items

    // Send email notification (mock for now - in production would use email service)
    console.log('New feedback received:', {
      from: `${name} <${email}>`,
      type: feedbackType,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      timestamp
    });

    return c.json({ message: 'Feedback sent successfully', id: feedbackId });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return c.json({ error: 'Failed to send feedback' }, 500);
  }
});

// Analysis history endpoint
app.get('/make-server-fb0be124/analysis-history', authenticateUser, async (c) => {
  try {
    const user = c.get('user');
    const historyKey = `analysis_history:${user.id}`;
    
    const history = await kv.get(historyKey) || [];
    return c.json(history);
  } catch (error) {
    console.error('Analysis history error:', error);
    return c.json({ error: 'Failed to load analysis history' }, 500);
  }
});

// Content analysis endpoint
app.post('/make-server-fb0be124/analyze-content', authenticateUser, async (c) => {
  try {
    const user = c.get('user');
    const { url } = await c.req.json();
    
    if (!url) {
      return c.json({ error: 'URL is required' }, 400);
    }

    // Mock analysis results for demo purposes
    const analysisResults = {
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      wordCount: Math.floor(Math.random() * 1000) + 500,
      readingTime: Math.floor(Math.random() * 5) + 2,
      title: 'Sample Page Title',
      metaDescription: 'This is a sample meta description for demonstration purposes.',
      headings: [
        { tag: 'H1', text: 'Main Heading', isGood: true },
        { tag: 'H2', text: 'Subheading 1', isGood: true },
        { tag: 'H2', text: 'Subheading 2', isGood: false },
        { tag: 'H3', text: 'Sub-subheading', isGood: true }
      ]
    };

    // Store analysis in history
    const historyKey = `analysis_history:${user.id}`;
    const currentHistory = await kv.get(historyKey) || [];
    const newAnalysis = {
      type: 'content_analysis',
      url,
      results: analysisResults,
      created_at: new Date().toISOString()
    };
    
    currentHistory.unshift(newAnalysis);
    await kv.set(historyKey, currentHistory.slice(0, 50)); // Keep last 50 analyses

    return c.json(analysisResults);
  } catch (error) {
    console.error('Content analysis error:', error);
    return c.json({ error: 'Analysis failed' }, 500);
  }
});

// Technical analysis endpoint
app.post('/make-server-fb0be124/technical-analysis', authenticateUser, async (c) => {
  try {
    const { url, type } = await c.req.json();
    
    if (!url) {
      return c.json({ error: 'URL is required' }, 400);
    }

    // Mock technical analysis results
    const results = {
      performance: {
        score: Math.floor(Math.random() * 40) + 60,
        loadTime: (Math.random() * 3 + 1).toFixed(1)
      },
      mobile: {
        score: Math.floor(Math.random() * 30) + 70,
        responsive: true
      },
      security: {
        score: Math.floor(Math.random() * 20) + 80,
        ssl: true
      },
      issues: {
        total: Math.floor(Math.random() * 10),
        critical: Math.floor(Math.random() * 3)
      }
    };

    return c.json(results);
  } catch (error) {
    console.error('Technical analysis error:', error);
    return c.json({ error: 'Technical analysis failed' }, 500);
  }
});

// Content generation endpoint
app.post('/make-server-fb0be124/generate-content', authenticateUser, async (c) => {
  try {
    const { type, productName, targetKeywords, contentType, contentLength, tone } = await c.req.json();
    
    // Mock content generation
    let content = '';
    
    switch (type) {
      case 'product':
        content = `# ${productName || 'Amazing Product'}\n\nThis is a ${tone || 'professional'} product description for ${productName || 'an amazing product'}. Target keywords: ${targetKeywords || 'product, quality, value'}\n\n## Key Features\n- High quality materials\n- Excellent value for money\n- Perfect for your needs\n\n## Why Choose This Product?\nWith our ${productName || 'product'}, you get the best combination of quality and value. Whether you're looking for ${targetKeywords?.split(',')[0] || 'excellence'}, this product delivers.\n\n## Specifications\n- Material: Premium quality\n- Warranty: 1 year\n- Shipping: Free worldwide\n\nOrder now and experience the difference!`;
        break;
      case 'blog':
        content = `# ${productName || 'How to Optimize Your SEO Strategy'}\n\nIn this comprehensive guide, we'll explore the best practices for ${targetKeywords || 'SEO optimization'}.\n\n## Introduction\nSearching for ways to improve your website's visibility? You've come to the right place.\n\n## Key Strategies\n1. Keyword research and optimization\n2. Content quality improvement\n3. Technical SEO enhancements\n4. Link building strategies\n\n## Conclusion\nImplementing these strategies will help you achieve better search rankings and increased organic traffic.`;
        break;
      default:
        content = `Generated content for ${type}. This is a sample output based on your requirements.`;
    }

    return c.json({ content });
  } catch (error) {
    console.error('Content generation error:', error);
    return c.json({ error: 'Content generation failed' }, 500);
  }
});

// Link audit endpoint
app.post('/make-server-fb0be124/audit-links', authenticateUser, async (c) => {
  try {
    const { url } = await c.req.json();
    
    // Mock link audit results
    const results = {
      totalLinks: Math.floor(Math.random() * 50) + 20,
      internalCount: Math.floor(Math.random() * 30) + 15,
      externalCount: Math.floor(Math.random() * 20) + 5,
      brokenCount: Math.floor(Math.random() * 5),
      links: {
        internal: [
          { text: 'About Us', url: '/about' },
          { text: 'Contact', url: '/contact' },
          { text: 'Services', url: '/services' }
        ],
        external: [
          { text: 'Google', url: 'https://google.com' },
          { text: 'Wikipedia', url: 'https://wikipedia.org' }
        ],
        broken: []
      }
    };

    return c.json(results);
  } catch (error) {
    console.error('Link audit error:', error);
    return c.json({ error: 'Link audit failed' }, 500);
  }
});

// Schema validation endpoint
app.post('/make-server-fb0be124/validate-schema', authenticateUser, async (c) => {
  try {
    const { url } = await c.req.json();
    
    // Mock schema validation results
    const results = {
      jsonLdCount: Math.floor(Math.random() * 5) + 1,
      microdataCount: Math.floor(Math.random() * 3),
      hasErrors: Math.random() > 0.7,
      score: Math.floor(Math.random() * 30) + 70,
      schemas: [
        {
          type: 'Organization',
          valid: true,
          data: { name: 'Example Company', url: 'https://example.com' }
        }
      ]
    };

    return c.json(results);
  } catch (error) {
    console.error('Schema validation error:', error);
    return c.json({ error: 'Schema validation failed' }, 500);
  }
});

// Competitor analysis endpoint
app.post('/make-server-fb0be124/competitor-analysis', authenticateUser, async (c) => {
  try {
    const { type, keyword, competitorUrl, yourUrl } = await c.req.json();
    
    // Mock competitor analysis results
    const results = {
      competitionLevel: 'High',
      competitionScore: Math.floor(Math.random() * 30) + 70,
      avgContentLength: Math.floor(Math.random() * 1000) + 1500,
      competitorCount: Math.floor(Math.random() * 10) + 8,
      contentGaps: Math.floor(Math.random() * 20) + 15
    };

    return c.json(results);
  } catch (error) {
    console.error('Competitor analysis error:', error);
    return c.json({ error: 'Competitor analysis failed' }, 500);
  }
});

// E-E-A-T analysis endpoint
app.post('/make-server-fb0be124/eeat-analysis', authenticateUser, async (c) => {
  try {
    const { url } = await c.req.json();
    
    // Mock E-E-A-T analysis results
    const results = {
      overallScore: Math.floor(Math.random() * 40) + 60,
      experience: Math.floor(Math.random() * 30) + 70,
      expertise: Math.floor(Math.random() * 35) + 65,
      authoritativeness: Math.floor(Math.random() * 25) + 75,
      trustworthiness: Math.floor(Math.random() * 20) + 80
    };

    return c.json(results);
  } catch (error) {
    console.error('E-E-A-T analysis error:', error);
    return c.json({ error: 'E-E-A-T analysis failed' }, 500);
  }
});

// Maintenance analysis endpoint
app.post('/make-server-fb0be124/maintenance-analysis', authenticateUser, async (c) => {
  try {
    const { url, type } = await c.req.json();
    
    // Mock maintenance analysis results
    const results = {
      healthScore: Math.floor(Math.random() * 40) + 60,
      outdatedCount: Math.floor(Math.random() * 10) + 2,
      opportunityCount: Math.floor(Math.random() * 15) + 5,
      avgContentAge: Math.floor(Math.random() * 200) + 30
    };

    return c.json(results);
  } catch (error) {
    console.error('Maintenance analysis error:', error);
    return c.json({ error: 'Maintenance analysis failed' }, 500);
  }
});

// Advanced analysis endpoint
app.post('/make-server-fb0be124/advanced-analysis', authenticateUser, async (c) => {
  try {
    const { type, url, keyword, competitors } = await c.req.json();
    
    // Mock advanced analysis results
    const results = {
      contentDifficulty: Math.floor(Math.random() * 40) + 40,
      intentMatch: Math.floor(Math.random() * 30) + 70,
      zeroClickRisk: Math.floor(Math.random() * 50) + 25,
      conversionPotential: Math.floor(Math.random() * 4) + 6
    };

    return c.json(results);
  } catch (error) {
    console.error('Advanced analysis error:', error);
    return c.json({ error: 'Advanced analysis failed' }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

serve(app.fetch);