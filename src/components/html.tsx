import { e } from '@kitajs/html';

/*
 * This is a simple layout component that wraps the entire application.
 * It's used to import global styles and scripts, and to set the title of the page.
 * You can include scripts on a page level when is needed.
 * You can change this whatever you want.
 * head: JSX.Element - any additional head elements to include in the layout
 * title: string - the title of the page
 * isHtmxRequest: boolean - whether the request is an htmx request, if it is
 * the layout will not include the html, head, or body tags
 */
export function Layout(
  props: Html.PropsWithChildren<{
    head?: JSX.Element;
    title?: string;
    isHtmxRequest?: boolean;
  }>,
) {
  if (props.isHtmxRequest) {
    return <>{props.children}</>;
  }

  return (
    <>
      {'<!doctype html>'}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link href="/public/dist/main.css" rel="stylesheet" />
          <script src="/public/dist/main.js" />
          <title>{e`${props.title}`}</title>
          {props.head as 'safe'}
        </head>
        <body>{props.children}</body>
      </html>
    </>
  );
}
