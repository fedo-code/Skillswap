const User = require('../models/user');

exports.findMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user);
    const matches = await User.find({
      _id: { $ne: currentUser._id },
      skillsOffered: { $in: currentUser.skillsWanted },
      skillsWanted: { $in: currentUser.skillsOffered },
    }).select('-password');

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Match fetch failed' });
  }
};
