const samples = [
	`
# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading
`,
	`
## Emphasis
**This is bold text**
__This is bold text__
*This is italic text*
_This is italic text_
~~Strikethrough~~
`,
	`
\`\`\` js
var foo = function (bar) {
return bar++;
};

console.log(foo(5));
\`\`\`
`,
	`
## Links
[link text](http://dev.nodeca.com)
[link with title](http://nodeca.github.io/pica/demo/ "title text!")
`
];

export { samples };
