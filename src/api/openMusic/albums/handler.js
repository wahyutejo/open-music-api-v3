class AlbumsHandler {
  constructor(service, validator, storageService) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const { name = 'unnamed', year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getDetailAlbum(id);
    const albumsWithSongs = { ...album, songs };

    const response = h.response({
      status: 'success',
      data: {
        album: albumsWithSongs,
      },
    });

    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const { name, year } = request.payload;
    const { id } = request.params;

    await this._service.editAlbumById(id, { name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    });

    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });

    return response;
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;

    this._validator.validateAlbumCoverHeaders(cover.hapi.headers);

    const { id } = request.params;
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/cover/${filename}`;

    await this._service.addCoverAlbum(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',

    });
    response.code(201);
    return response;
  }

  async postAlbumsLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.verifyAlbum(albumId);
    await this._service.addAlbumLikes(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Menyukai album',

    });
    response.code(201);

    return response;
  }

  async getAlbumsLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const albumLikes = await this._service.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: albumLikes.likes,
      },

    });
    response.code(200);

    if (albumLikes.isCache)response.header('X-Data-Source', 'cache');

    return response;
  }
}

module.exports = AlbumsHandler;
