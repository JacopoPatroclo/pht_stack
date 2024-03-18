import htmx from 'htmx.org';

window.htmx = htmx;

declare global {
  interface Window {
    htmx: typeof htmx;
  }
}

// Handle 422 Unprocessable Entity errors as non-errors
// This is useful for server-side validation errors
htmx.on('htmx:beforeSwap', (event) => {
  if ((event as CustomEvent).detail.xhr.status === 422) {
    (event as CustomEvent).detail.isError = false;
    (event as CustomEvent).detail.shouldSwap = true;
  }
});
