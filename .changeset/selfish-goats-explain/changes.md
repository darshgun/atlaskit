ED-7494: split plain text by linebreaks into paragraphs on paste, convert text bullet into lists

When pasting plain text with "paragraphs" separated by line breaks, we now paste those as
multiple, real, paragraphs instead.

When pasting plain text that contains Markdown-looking numbered or unordered lists, or lines
that start with Unicode bullets, we now convert those to an actual list.

This fixes pasting from Google Keep, or something like Notepad.
