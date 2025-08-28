const User = require('../models/user');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
     console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

exports.updateSkills = async (req, res) => {
  try {
    const { skillsOffered, skillsWanted } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { skillsOffered, skillsWanted },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};
