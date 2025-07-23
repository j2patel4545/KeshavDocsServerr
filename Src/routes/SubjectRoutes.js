import express from 'express';
import {
  addSubject,
  removeSubject,
  updateSubject,
  addTopic,
  UpdateTopicc,
  removeTopic,
  getAllSubjects // ⬅️ Add this
} from '../controllers/SubjectController.js';

const router = express.Router();

router.post('/subject', addSubject);
router.get('/subjects', getAllSubjects); // ✅ GET All Subjects
router.delete('/subject/:id', removeSubject);
router.put('/subject/:id', updateSubject);
router.post('/subject/:id/topic', addTopic);
router.put('/subject/:subjectId/topic/:topicId', UpdateTopicc);
router.delete('/subject/:subjectId/topic/:topicId', removeTopic);

export default router;
