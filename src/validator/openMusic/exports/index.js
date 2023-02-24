const InvariantError = require('../../../exceptions/InvariantError');
const ExportPlaylistPlayloadSchema = require('./schema');

const ExportValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportPlaylistPlayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

};

module.exports = ExportValidator;
