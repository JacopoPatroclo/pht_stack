import htmx from 'htmx.org';

window.htmx = htmx;

declare global {
  interface Window {
    htmx: typeof htmx;
  }
}

// This code here is to support the reload of the server
// when the server is down and it comes back up
// This will not be included in the production build
if (process.env.HOT_RELOAD) {
  // Hot reload the server
  let isServerDown = false;
  function pingServer() {
    fetch('/alive')
      .then((response) => {
        if (isServerDown && response.status === 200) {
          return window.location.reload();
        }
        setTimeout(pingServer, 2000);
      })
      .catch(() => {
        isServerDown = true;
        setTimeout(pingServer, 100);
      });
  }
  pingServer();
}
