import { Subject } from '../models/SubjectModel.js';

// 🔹 Add Subject
export const addSubject = async (req, res) => {
  try {
    const { subject, topic } = req.body;

    if (!subject) {
      return res.status(400).json({ error: "Subject title is required" });
    }

    const newSubject = await Subject.create({ subject, topic: topic || [] });
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get All Subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();

    // Optional: sort topics inside each subject by index_number
    const sortedSubjects = subjects.map(sub => {
      const sortedTopics = sub.topic.sort((a, b) => a.index_number - b.index_number);
      return { ...sub.toObject(), topic: sortedTopics };
    });

    res.json(sortedSubjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Remove Subject
export const removeSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Update Subject
export const updateSubject = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Subject not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Add Topic to Subject
// export const addTopic = async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id);
//     if (!subject) return res.status(404).json({ error: "Subject not found" });

//     // Calculate next index number
//     const newIndex = subject.topic.length + 1;

//     subject.topic.push({ ...req.body, index_number: newIndex });
//     await subject.save();

//     res.json(subject);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }

  export const addTopic = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    // Use index_number from req.body (not auto)
    const { name, description, code, index_number } = req.body;

    if (
      !name ||
      typeof index_number !== "number" || isNaN(index_number) ||
      !description ||
      !code
    ) {
      return res.status(400).json({ error: "All fields are required and index_number must be a number" });
    }

    subject.topic.push({ name, description, code, index_number });
    await subject.save();

    // Optional: sort topics by index_number before sending response
    subject.topic.sort((a, b) => a.index_number - b.index_number);

    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 Update Topic in Subject
export const UpdateTopicc = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const topic = subject.topic.id(req.params.topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    // Optional: Check if index_number is provided and is a valid number
    if (
      req.body.hasOwnProperty("index_number") &&
      (typeof req.body.index_number !== "number" || isNaN(req.body.index_number))
    ) {
      return res.status(400).json({ error: "index_number must be a number" });
    }

    // Optional: Prevent duplicate index_number within same subject
    if (
      req.body.hasOwnProperty("index_number") &&
      subject.topic.some(
        (t) => t._id.toString() !== req.params.topicId && t.index_number === req.body.index_number
      )
    ) {
      return res.status(400).json({ error: "index_number already exists" });
    }

    topic.set(req.body);
    await subject.save();

    // Optional: sort topics by index_number before sending back
    subject.topic.sort((a, b) => a.index_number - b.index_number);

    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 Remove Topic from Subject
// 🔹 Remove Topic from Subject
export const removeTopic = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const topicExists = subject.topic.some(
      (t) => t._id.toString() === req.params.topicId
    );
    if (!topicExists) return res.status(404).json({ error: "Topic not found" });

    // Remove topic
    subject.topic = subject.topic.filter(
      (t) => t._id.toString() !== req.params.topicId
    );

    await subject.save();
    res.json({ message: "Topic deleted successfully", subject });
  } catch (err) {
    console.error("Error deleting topic:", err);
    res.status(500).json({ error: err.message });
  }
};
