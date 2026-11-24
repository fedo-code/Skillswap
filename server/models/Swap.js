const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, trim: true, default: '' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const swapSchema = new mongoose.Schema(
  {
    proposer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    proposerTeaches: { type: String, required: true, trim: true }, // skill the proposer teaches
    partnerTeaches: { type: String, required: true, trim: true }, // skill the partner teaches
    scheduledAt: { type: Date, required: true },
    durationMin: { type: Number, default: 60, min: 15, max: 480 },
    meetingLink: { type: String, trim: true, default: '' },
    note: { type: String, trim: true, default: '', maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled', 'completed'],
      default: 'pending',
    },
    resources: [resourceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Swap || mongoose.model('Swap', swapSchema);
