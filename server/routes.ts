import express from "express";
import { productRepository, blogRepository, affiliateRepository } from "../src/repositories/db.repository";
import { db } from "../src/lib/db";
import { user } from "../src/lib/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

// Middleware to check admin role
async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  
  try {
    // Verify session token with Better Auth
    const sessionResult = await db.query.session.findFirst({
      where: (session, { eq }) => eq(session.token, token),
      with: { user: true }
    });

    if (!sessionResult || new Date(sessionResult.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const userResult = await db.select().from(user).where(eq(user.id, sessionResult.userId)).limit(1);
    
    if (!userResult[0] || userResult[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = userResult[0];
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// Products routes
router.get('/products', requireAdmin, async (req, res) => {
  try {
    const products = await productRepository.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/products', requireAdmin, async (req, res) => {
  try {
    const product = await productRepository.create({
      ...req.body,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:id', requireAdmin, async (req, res) => {
  try {
    const product = await productRepository.update(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', requireAdmin, async (req, res) => {
  try {
    await productRepository.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Blog routes
router.get('/blog', requireAdmin, async (req, res) => {
  try {
    const posts = await blogRepository.getAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

router.post('/blog', requireAdmin, async (req, res) => {
  try {
    const post = await blogRepository.create({
      ...req.body,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

router.put('/blog/:id', requireAdmin, async (req, res) => {
  try {
    const post = await blogRepository.update(req.params.id, req.body);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

router.delete('/blog/:id', requireAdmin, async (req, res) => {
  try {
    await blogRepository.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Analytics routes
router.get('/analytics/clicks', requireAdmin, async (req, res) => {
  try {
    const clicks = await affiliateRepository.getAll();
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clicks' });
  }
});

router.get('/analytics/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await affiliateRepository.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Public route for tracking clicks
router.post('/affiliate/track', async (req, res) => {
  try {
    const click = await affiliateRepository.trackClick({
      ...req.body,
      id: crypto.randomUUID(),
      clickedAt: new Date(),
    });
    res.status(201).json(click);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track click' });
  }
});

export default router;
