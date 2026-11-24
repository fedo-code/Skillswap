const User = require('../models/user');

const norm = (s) => String(s).trim().toLowerCase();

// Skills in `a` that also appear in `b` (case-insensitive), shown with `a`'s spelling
const overlap = (a = [], b = []) => {
  const set = new Set(b.map(norm));
  return a.filter((s) => set.has(norm(s)));
};

exports.findMatches = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    if (!me) return res.status(404).json({ message: 'User not found' });

    const others = await User.find({ _id: { $ne: me._id } }).select('-password');

    const matches = others
      .map((u) => {
        // skills they teach that I want, and skills I teach that they want
        const theyTeach = overlap(u.skillsOffered, me.skillsWanted);
        const youTeach = overlap(me.skillsOffered, u.skillsWanted);
        return { ...u.toObject(), theyTeach, youTeach };
      })
      .filter((u) => u.theyTeach.length > 0 && u.youTeach.length > 0)
      .sort(
        (a, b) =>
          b.theyTeach.length + b.youTeach.length -
          (a.theyTeach.length + a.youTeach.length)
      );

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Match fetch failed' });
  }
};
