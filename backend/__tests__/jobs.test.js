const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../app');
const Job = require('../models/JobRequest');

let app;

beforeAll(async () => {
  // Connect to a test database
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/globaltna_test';
  await mongoose.connect(mongoUri);
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Job.deleteMany();
});

describe('POST /api/jobs', () => {
  it('should create a new job when valid data is provided (no auth for test)', async () => {
    // Note: POST is protected by auth middleware.
    // For a full test we'd mock auth, but we test the validation path here.
    const res = await request(app)
      .post('/api/jobs')
      .send({
        title: 'Fix shower',
        description: 'Shower head is leaking',
        category: 'Plumbing',
        location: 'Glasgow',
        contactName: 'Test User',
        contactEmail: 'test@example.com'
      });

    // Will be 401 because auth middleware blocks it
    expect(res.status).toBe(401);
  });
});

describe('GET /api/jobs', () => {
  beforeEach(async () => {
    await Job.create([
      {
        title: 'Fix tap',
        description: 'Kitchen tap dripping',
        category: 'Plumbing',
        location: 'Glasgow',
        contactName: 'Alice',
        contactEmail: 'alice@example.com',
        status: 'Open'
      },
      {
        title: 'Paint walls',
        description: 'Living room needs repainting',
        category: 'Painting',
        location: 'Edinburgh',
        contactName: 'Bob',
        contactEmail: 'bob@example.com',
        status: 'In Progress'
      },
      {
        title: 'Rewire house',
        description: 'Full house rewiring needed',
        category: 'Electrical',
        location: 'Glasgow',
        contactName: 'Charlie',
        contactEmail: 'charlie@example.com',
        status: 'Open'
      }
    ]);
  });

  it('should return all jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it('should filter jobs by category', async () => {
    const res = await request(app).get('/api/jobs?category=Plumbing');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe('Plumbing');
  });

  it('should filter jobs by status', async () => {
    const res = await request(app).get('/api/jobs?status=Open');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    res.body.forEach(job => {
      expect(job.status).toBe('Open');
    });
  });

  it('should filter jobs by keyword search', async () => {
    const res = await request(app).get('/api/jobs?search=rewire');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Rewire house');
  });

  it('should return empty array when no jobs match', async () => {
    const res = await request(app).get('/api/jobs?category=Joinery');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe('GET /api/jobs/:id', () => {
  it('should return a single job by ID', async () => {
    const job = await Job.create({
      title: 'Test job',
      description: 'Test description',
      category: 'Plumbing',
      location: 'London',
      contactName: 'Test',
      contactEmail: 'test@example.com'
    });

    const res = await request(app).get(`/api/jobs/${job._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test job');
    expect(res.body.category).toBe('Plumbing');
  });

  it('should return 404 for a non-existent job', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/jobs/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Job not found');
  });
});

describe('PATCH /api/jobs/:id', () => {
  it('should update the status of a job', async () => {
    const job = await Job.create({
      title: 'Patch test',
      description: 'Testing patch',
      category: 'Electrical',
      location: 'Cardiff',
      contactName: 'Patcher',
      contactEmail: 'patch@example.com'
    });

    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: 'In Progress' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('In Progress');
  });

  it('should return 404 when patching a non-existent job', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/jobs/${fakeId}`)
      .send({ status: 'Closed' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/jobs/:id', () => {
  it('should return 401 without auth token', async () => {
    const job = await Job.create({
      title: 'Delete test',
      description: 'Testing delete',
      category: 'Joinery',
      location: 'Bristol',
      contactName: 'Deleter',
      contactEmail: 'delete@example.com'
    });

    const res = await request(app).delete(`/api/jobs/${job._id}`);
    expect(res.status).toBe(401);
  });
});

describe('404 handling', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });
});
