import React, { useEffect } from 'react';
import resetCSS from './resetCss';
import { ArticleFrame } from './styled';
import debounce from 'lodash.debounce';
import ReactDOM from 'react-dom';

export interface Props {
  // Article Content
  body?: string;
  // Function executed when the article rendering begins
  onArticleRenderBegin?(): void;
  // Function executed when the article rendering finishes
  onArticleRenderDone?(): void;
}

const IFRAME_CONTAINER_ID = 'help-iframe-container';

export const ArticleBody = (props: Props) => {
  /**
   * Set article height
   */
  const resizeIframe = (onArticleRenderDone?: () => void) => {
    const iframeContainer: HTMLElement | null = document.getElementById(
      IFRAME_CONTAINER_ID,
    );

    if (iframeContainer) {
      const currentIframe: HTMLIFrameElement | null = iframeContainer.getElementsByTagName(
        'iframe',
      )[0];

      if (!currentIframe) {
        return;
      }

      if (currentIframe !== null && currentIframe.contentWindow !== null) {
        if (currentIframe.contentWindow.document.body) {
          //
          const iframeContent: Element | null =
            currentIframe.contentWindow.document.body.firstElementChild;
          /* if the iframe has content, set the height of the iframe body
           and of the iframe itself */
          if (iframeContent) {
            const contentHeight: number = iframeContent.scrollHeight;
            currentIframe.style.height = contentHeight + 10 + 'px';
            currentIframe.contentWindow.document.body.style.height =
              contentHeight + 'px';

            if (onArticleRenderDone) {
              onArticleRenderDone();
            }
          }
        }
      }
    }
  };

  /**
   * When the article content changes, update the content of the iframe and
   * resize the iframe based on the new content
   */
  useEffect(() => {
    /**
     * Set iframe content
     */
    const setIframeContent = (
      body: string = '',
      onArticleRenderBegin?: () => void,
    ) => {
      ReactDOM.render(
        <div></div>,
        document.getElementById(IFRAME_CONTAINER_ID),
        () => {
          ReactDOM.render(
            <ArticleFrame
              id="help-iframe"
              name="help-iframe"
              onLoad={() => {
                resizeIframe(props.onArticleRenderDone);
              }}
              sandbox="allow-same-origin allow-popups"
            />,
            document.getElementById(IFRAME_CONTAINER_ID),
            () => {
              const iframeContainer: HTMLElement | null = document.getElementById(
                IFRAME_CONTAINER_ID,
              );

              if (iframeContainer) {
                const newIframe: Window = frames['help-iframe'];

                if (newIframe !== null) {
                  const iframeDocument = newIframe.document;
                  iframeDocument.open();
                  iframeDocument.write(`<div>${body}</div>`);
                  iframeDocument.close();

                  const head =
                    iframeDocument.head ||
                    iframeDocument.getElementsByTagName('head')[0];
                  const style = iframeDocument.createElement('style');
                  style.innerText = resetCSS;
                  head.appendChild(style);

                  resizeIframe();

                  if (onArticleRenderBegin) {
                    onArticleRenderBegin();
                  }
                }
              }
            },
          );
        },
      );
    };

    setIframeContent(props.body, props.onArticleRenderBegin);
  }, [props.body, props.onArticleRenderBegin, props.onArticleRenderDone]);

  useEffect(() => {
    /**
     * Resize the iframe when the browser window resizes
     */
    const onWindowResize = debounce(() => resizeIframe(), 500);
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [props.onArticleRenderDone]);

  return props.body ? <div id={IFRAME_CONTAINER_ID} /> : null;
};

export default ArticleBody;
