ED-7503 New insertion behaviour comes into place, making it consistent no matter how supported nodes are inserted (more detailed info in the ticket). 
These changes only covers Horizontal rule and Media Single nodes, only when they are inserted at the beginning or at the end of an specific node. 

Examples:
* Insert a horizontal rule when the cursor is at the begining of a paragraph, it will insert the node above the paragraph. Same with media single. 
* Insert a horizontal rule when the cursor is at the end of a paragraph, it will insert the node bellow the paragraph. Same with media single.

All of these cases should behave consistently regardless if the node was inserted usng the toolbar, with the `/divider` command, or the `---`/`***` shortcut (for the horizontal rule case).
