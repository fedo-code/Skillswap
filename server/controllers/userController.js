const User = require('../models/user');

// trim, drop empties, de-duplicate (case-insensitive)
const cleanSkills = (list) => {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list
    .map((s) => String(s).trim())
    .filter((s) => {
      const key = s.toLowerCase();
      if (!s || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

exports.updateSkills = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'You can only edit your own skills' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        skillsOffered: cleanSkills(req.body.skillsOffered),
        skillsWanted: cleanSkills(req.body.skillsWanted),
      },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};
