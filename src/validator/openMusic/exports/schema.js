const Joi = require('joi');

const ExportPlaylistPlayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportPlaylistPlayloadSchema;
