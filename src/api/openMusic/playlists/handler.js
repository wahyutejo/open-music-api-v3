class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    await this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylists({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistsOwner(id, credentialId);
    await this._service.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistsHandler(request, h) {
    await this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.verifySongId(songId);
    await this._service.postSongToPlaylist(playlistId, songId);
    await this._service.addActivities(playlistId, songId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke Playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._service.getPlaylistById(playlistId);
    const song = await this._service.getSongsFromPlaylist(playlistId);
    const playlistSongs = playlist.map((p) => ({
      id: p.id,
      name: p.name,
      username: p.username,
      songs: song,

    }));

    const response = h.response({
      status: 'success',
      data: {
        playlist: Object.assign({}, ...playlistSongs),
      },

    });
    return response;
  }

  async deleteSongFromPlaylistsHandler(request, h) {
    await this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongFromPlaylist(songId);
    await this._service.deleteActivities(playlistId, songId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari Playlist',
    });
    return response;
  }

  async getPlaylistSongActivitiesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const getActivities = await this._service.getPlaylistSongActivities(playlistId, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlistId: getActivities[0].playlist_id,
        activities: getActivities.map((a) => ({
          username: a.username,
          title: a.title,
          action: a.action,
          time: a.time,
        })),

      },

    });
    return response;
  }
}

module.exports = PlaylistsHandler;
