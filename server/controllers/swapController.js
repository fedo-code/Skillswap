const Swap = require('../models/Swap');

const populateSwap = (q) =>
  q
    .populate('proposer', 'name email')
    .populate('partner', 'name email')
    .populate('resources.addedBy', 'name');

const isParticipant = (swap, userId) =>
  [swap.proposer, swap.partner].some((p) => String(p._id || p) === String(userId));

const safeUrl = (u) => {
  if (!u) return '';
  try {
    const parsed = new URL(u);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
};

exports.createSwap = async (req, res) => {
  try {
    const { partnerId, proposerTeaches, partnerTeaches, scheduledAt, durationMin, meetingLink, note } = req.body;
    if (!partnerId || !proposerTeaches || !partnerTeaches || !scheduledAt) {
      return res.status(400).json({ message: 'Choose both skills and a date and time.' });
    }
    if (String(partnerId) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot swap with yourself.' });
    }
    const when = new Date(scheduledAt);
    if (isNaN(when) || when < new Date()) {
      return res.status(400).json({ message: 'Pick a date and time in the future.' });
    }
    const link = safeUrl(meetingLink);
    if (link === null) return res.status(400).json({ message: 'Meeting link must start with http:// or https://' });

    const swap = await Swap.create({
      proposer: req.user._id,
      partner: partnerId,
      proposerTeaches,
      partnerTeaches,
      scheduledAt: when,
      durationMin: Number(durationMin) || 60,
      meetingLink: link,
      note,
    });
    res.status(201).json(await populateSwap(Swap.findById(swap._id)));
  } catch (err) {
    res.status(500).json({ message: 'Could not create swap' });
  }
};

exports.getMySwaps = async (req, res) => {
  try {
    const swaps = await populateSwap(
      Swap.find({ $or: [{ proposer: req.user._id }, { partner: req.user._id }] }).sort({ scheduledAt: 1 })
    );
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: 'Could not load swaps' });
  }
};

exports.getSwap = async (req, res) => {
  try {
    const swap = await populateSwap(Swap.findById(req.params.id));
    if (!swap || !isParticipant(swap, req.user._id)) return res.status(404).json({ message: 'Swap not found' });
    res.json(swap);
  } catch (err) {
    res.status(404).json({ message: 'Swap not found' });
  }
};

// who may move a swap to which status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const swap = await Swap.findById(req.params.id);
    if (!swap || !isParticipant(swap, req.user._id)) return res.status(404).json({ message: 'Swap not found' });

    const me = String(req.user._id);
    const isPartner = String(swap.partner) === me;
    const allowed = {
      accepted: isPartner && swap.status === 'pending',
      declined: isPartner && swap.status === 'pending',
      cancelled: ['pending', 'accepted'].includes(swap.status),
      completed: swap.status === 'accepted',
    };
    if (!allowed[status]) return res.status(400).json({ message: `You cannot mark this swap as ${status}.` });

    swap.status = status;
    await swap.save();
    res.json(await populateSwap(Swap.findById(swap._id)));
  } catch (err) {
    res.status(500).json({ message: 'Could not update swap' });
  }
};

exports.addResource = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap || !isParticipant(swap, req.user._id)) return res.status(404).json({ message: 'Swap not found' });
    if (['declined', 'cancelled'].includes(swap.status)) {
      return res.status(400).json({ message: 'This swap is closed.' });
    }
    const title = String(req.body.title || '').trim();
    if (!title) return res.status(400).json({ message: 'Add a title.' });
    const url = safeUrl(req.body.url);
    if (url === null) return res.status(400).json({ message: 'Link must start with http:// or https://' });

    swap.resources.push({ title, url, addedBy: req.user._id });
    await swap.save();
    res.status(201).json(await populateSwap(Swap.findById(swap._id)));
  } catch (err) {
    res.status(500).json({ message: 'Could not add resource' });
  }
};
