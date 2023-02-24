class CollaborationsHandler {
  constructor(playlistsService, collaborationsService, validator) {
    this._playlistsService = playlistsService;
    this._collaborationsService = collaborationsService;
    this._validator = validator;
  }

  async postCollaborationsHandler(request, h) {
    this._validator.validateCollaborationsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialId);
    await this._collaborationsService.verifyUserId(userId);
    const collaborationId = await this._collaborationsService.addCollaborations(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationsHandler(request, h) {
    this._validator.validateCollaborationsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaborations(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
    return response;
  }
}

module.exports = CollaborationsHandler;
