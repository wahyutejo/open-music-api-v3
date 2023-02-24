const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollaborationsHandler(request, h),
    options: {
      auth: 'openMusicApp_jwt',

    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handler.deleteCollaborationsHandler(request, h),
    options: {
      auth: 'openMusicApp_jwt',
    },
  },
];

module.exports = routes;
