import React, { useEffect, useState } from 'react';
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

const iframeContainerId = 'help-iframe-container';

export const ArticleBody = (props: Props) => {
  /**
   * Set article height
   */
  const resizeIframe = (onArticleRenderDone?: () => void) => {
    const iframeContainer: HTMLElement | null = document.getElementById(
      iframeContainerId,
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
          const iframeContent: Element | null =
            currentIframe.contentWindow.document.body.firstElementChild;
          // if the iframe has content, set the height of the iframe body
          // and of the iframe itself
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
   * When the article changes, update the content of the iframe and
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
        document.getElementById(iframeContainerId),
        () => {
          ReactDOM.render(
            <ArticleFrame
              onLoad={() => {
                resizeIframe(props.onArticleRenderDone);
              }}
              sandbox="allow-same-origin allow-popups"
            />,
            document.getElementById('help-iframe-container'),
            () => {
              const iframeContainer: HTMLElement | null = document.getElementById(
                iframeContainerId,
              );

              if (iframeContainer) {
                const newIframe: HTMLIFrameElement | null = iframeContainer.getElementsByTagName(
                  'iframe',
                )[0];

                if (newIframe !== null && newIframe.contentDocument !== null) {
                  const iframeDocument = newIframe.contentDocument;
                  const head = iframeDocument.getElementsByTagName('head')[0];
                  iframeDocument.body.innerHTML = body;
                  const style = iframeDocument.createElement('style');
                  style.innerText = resetCSS;
                  head.appendChild(style);

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

  /**
   * When the window is resized, resize the iframe
   */
  useEffect(() => {
    /**
     * Set article height with debounce
     */
    const onWindowResize = debounce(() => resizeIframe(), 500);
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [props.onArticleRenderDone]);

  return props.body ? <div id="help-iframe-container" /> : null;
};

export default ArticleBody;
