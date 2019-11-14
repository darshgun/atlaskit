import React, { useEffect, useRef, useState } from 'react';
import resetCSS from './resetCss';
import * as srcDoc from 'srcdoc-polyfill';
import { ArticleFrame } from './styled';
import debounce from 'lodash.debounce';

export interface Props {
  // Article Content
  body?: string;
  // Function executed when the article rendering begins
  onArticleRenderBegin?(): void;
  // Function executed when the article rendering finishes
  onArticleRenderDone?(): void;
}

export const ArticleBody = (props: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [articleHeight, setArticleHeight] = useState('auto');

  /**
   * Set article height
   */
  const resizeIframe = (
    iframeRef: React.RefObject<HTMLIFrameElement>,
    onArticleRenderDone?: () => void,
  ) => {
    const currentIframe: HTMLIFrameElement | null = iframeRef.current;

    if (!currentIframe) {
      return;
    }

    if (currentIframe !== null && currentIframe.contentWindow !== null) {
      const iframeContent: Element | null =
        currentIframe.contentWindow.document.body.firstElementChild;
      // if the iframe has content, set the height of the iframe body
      // and of the iframe itself
      if (iframeContent) {
        const contentHeight: number = iframeContent.scrollHeight;
        currentIframe.style.height = contentHeight + 'px';
        setArticleHeight(`${contentHeight}px`);

        if (onArticleRenderDone) {
          onArticleRenderDone();
        }
      }
    }

    return 0;
  };

  /**
   * When the article changes, update the content of the iframe and
   * resize the iframe based on the new content
   */
  useEffect(() => {
    /**
     * Set iframe content
     * NOTE: I need to inject the content this way because I need to use srcDoc polyfill for IE11 and
     * old versions of Edge
     */
    const setIframeContent = (
      iframeRef: React.RefObject<HTMLIFrameElement>,
      body: string = '',
      onArticleRenderBegin?: () => void,
    ) => {
      const currentIframe: HTMLIFrameElement | null = iframeRef.current;

      if (!currentIframe) {
        return;
      }

      if (currentIframe !== null && currentIframe.contentWindow !== null) {
        if (currentIframe.contentWindow.document.body) {
          srcDoc.set(
            currentIframe,
            `<style>${resetCSS}</style><div style="overflow-x: hidden;">${body}</div>`,
          );

          if (onArticleRenderBegin) {
            onArticleRenderBegin();
          }
        }
      }
    };

    setIframeContent(iframeRef, props.body, props.onArticleRenderBegin);
    resizeIframe(iframeRef);
  }, [props.body]);

  /**
   * When the window is resized, resize the iframe
   */
  useEffect(() => {
    /**
     * Set article height with debounce
     */
    const onWindowResize = debounce(() => resizeIframe(iframeRef), 500);

    window.addEventListener('resize', onWindowResize);

    /**
     * Add onload event to iframe. The iframe will be resized only after
     * the content is loaded
     */
    const currentIframe: HTMLIFrameElement | null = iframeRef.current;

    if (currentIframe !== null && currentIframe.contentWindow !== null) {
      if (currentIframe.contentWindow.document.body) {
        currentIframe.onload = () => {
          resizeIframe(iframeRef, props.onArticleRenderDone);
        };
      }
    }

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
    // We only want this effect to run once - on initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return props.body ? (
    <ArticleFrame
      style={{ height: articleHeight }}
      ref={iframeRef}
      sandbox="allow-same-origin"
    />
  ) : null;
};

export default ArticleBody;
