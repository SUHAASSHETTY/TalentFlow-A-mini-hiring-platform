// mirage/routes/assessmentRoutes.js
import { Response } from "miragejs";
import { db } from "../../extendedDB/jobstore";

function randomLatency() {
  return 200 + Math.floor(Math.random() * 1000); // 200-1200ms
}

function maybeFailure(chance = 0.08) { // 8% default
  return Math.random() < chance;
}

export default function assessmentRoutes(server) {
  server.get('/assessments/:jobId', async (schema, request) => {
    const jobId = Number(request.params.jobId);
    try {
      const assessment = await db.assessments.where('jobId').equals(jobId).first();
      if (!assessment) {
        return new Response(404, {}, { error: 'Not found' });
      }
      return assessment;
    } catch (err) {
      console.error(err);
      return new Response(500, {}, { error: 'DB error' });
    }
  });

  server.put('/assessments/:jobId', async (schema, request) => {
    await new Promise(r => setTimeout(r, randomLatency()));
    if (maybeFailure(0.08)) {
      return new Response(500, {}, { error: 'Failed to save (simulated)' });
    }

    const jobId = Number(request.params.jobId);
    const payload = JSON.parse(request.requestBody);

    try {
      // If exists update, else add
      const existing = await db.assessments.where('jobId').equals(jobId).first();
      const now = new Date().toISOString();
      if (existing) {
        await db.assessments.update(existing.id, { ...payload, updatedAt: now });
        const updated = await db.assessments.get(existing.id);
        return updated;
      } else {
        const id = await db.assessments.add({ ...payload, jobId, updatedAt: now });
        const created = await db.assessments.get(id);
        return created;
      }
    } catch (err) {
      console.error(err);
      return new Response(500, {}, { error: 'DB error' });
    }
  });

  server.post('/assessments/:jobId/submit', async (schema, request) => {
    // submissions may fail occasionally
    await new Promise(r => setTimeout(r, randomLatency()));
    if (maybeFailure(0.05)) {
      return new Response(500, {}, { error: 'Submit failed (simulated)' });
    }

    const jobId = Number(request.params.jobId);
    const payload = JSON.parse(request.requestBody); // { candidateId, responses: {...} }

    try {
      const id = await db.assessmentResponses.add({
        jobId,
        candidateId: payload.candidateId || null,
        responses: payload.responses || {},
        submittedAt: new Date().toISOString()
      });
      const stored = await db.assessmentResponses.get(id);
      return stored;
    } catch (err) {
      console.error(err);
      return new Response(500, {}, { error: 'DB error' });
    }
  });
}
