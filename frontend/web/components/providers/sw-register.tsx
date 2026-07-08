'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    var registration: ServiceWorkerRegistration | null = null;

    function register() {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(function (reg) {
          registration = reg;

          reg.addEventListener('updatefound', function () {
            var newWorker = reg.installing;
            if (!newWorker) return;
            var worker = newWorker;

            worker.addEventListener('statechange', function () {
              if (
                worker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                window.dispatchEvent(new CustomEvent('sw-update-available'));
              }
            });
          });
        })
        .catch(function (err) {
          console.warn('[SW] Registration failed:', err);
        });
    }

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
    }

    var refreshing = false;
    function onControllerChange() {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return function () {
      window.removeEventListener('load', register);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return null;
}
