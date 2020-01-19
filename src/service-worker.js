if (workbox) {
    // adjust log level for displaying workbox logs
    workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

    workbox.routing.registerNavigationRoute('/index.html')

    // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
    workbox.routing.registerRoute(
      /^https:\/\/fonts\.googleapis\.com/,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
      })
    );

    // Cache the Material Design icon stylesheet.
    workbox.routing.registerRoute(
      /^https:\/\/cdn\.jsdelivr\.net/ ,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'material-design-icon-stylesheet',
      })
    );

    // apply precaching. In the built version, the precacheManifest will
    // be imported using importScripts (as is workbox itself) and we can 
    // precache this. This is all we need for precaching
    workbox.precaching.precacheAndRoute(self.__precacheManifest);
}
