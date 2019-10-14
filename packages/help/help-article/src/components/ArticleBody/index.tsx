import React, { useEffect, useRef, useState } from 'react';
import * as srcDoc from 'srcdoc-polyfill';
import { ArticleFrame } from './styled';
import debounce from 'lodash.debounce';

import { RESET_CSS } from './const';

export interface Props {
  // Article Content
  body?: string;
}

export const ArticleBody = (props: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [articleHeight, setArticleHeight] = useState('auto');

  /**
   * Set article height
   */
  const resizeIframe = () => {
    if (!iframeRef.current) {
      return;
    }

    const currentIframe: HTMLIFrameElement = iframeRef.current;

    if (currentIframe !== null && currentIframe.contentWindow !== null) {
      const iframeContent =
        currentIframe.contentWindow.document.body.firstElementChild;
      if (iframeContent) {
        var contentHeight = iframeContent.scrollHeight;
        currentIframe.style.height = contentHeight + 'px';
        setArticleHeight(`${contentHeight}px`);
        console.log(contentHeight);
      }
    }

    return 0;
  };

  /**
   * Set iframe content
   * NOTE: I need to inject the content this way because I need to use srcDoc polyfill for IE11 and
   * old versions of Edge
   */
  const setIframeContent = () => {
    if (!iframeRef.current) {
      return;
    }

    const currentIframe: HTMLIFrameElement = iframeRef.current;

    if (currentIframe !== null && currentIframe.contentWindow !== null) {
      if (currentIframe.contentWindow.document.body) {
        srcDoc.set(
          currentIframe,
          `<style>${RESET_CSS}</style><div class="content-platform-support">${
            props.body
          }</div>`,
        );
      }
    }
  };

  /**
   * Set article height with debounce
   */
  const onWindowResize = debounce(resizeIframe, 500);

  /**
   * When the article changes, update the content of the iframe and
   * resize the iframe based on the new content
   */
  useEffect(
    () => {
      setIframeContent();
      resizeIframe();
    },
    [props.body],
  );

  /**
   * When the window is resized, resize the iframe
   */
  useEffect(() => {
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return props.body ? (
    <ArticleFrame
      style={{ height: articleHeight }}
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
    />
  ) : null;
};

export default ArticleBody;
