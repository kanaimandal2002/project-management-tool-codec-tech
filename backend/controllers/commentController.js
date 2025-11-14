import Comment from '../models/Comment.js';

export const createComment = async (req, res) => {
  try {
    const { content, task } = req.body;

    const comment = new Comment({
      content,
      task,
      author: req.user.userId,
    });

    await comment.save();
    await comment.populate('author');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('author')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
