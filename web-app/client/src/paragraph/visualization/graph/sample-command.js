const samples = [
	`{
   "nodes":[
      {
         "id":1,
         "label":"node one",
         "shape":"box",
         "color":"#97C2FC"
      },
      {
         "id":2,
         "label":"node two",
         "shape":"circle",
         "color":"#FFFF00"
      },
      {
         "id":3,
         "label":"node three",
         "shape":"diamond",
         "color":"#FB7E81"
      },
      {
         "id":4,
         "label":"node four",
         "shape":"dot",
         "size":10,
         "color":"#7BE141"
      },
      {
         "id":5,
         "label":"node five",
         "shape":"ellipse",
         "color":"#6E6EFD"
      },
      {
         "id":6,
         "label":"node six",
         "shape":"star",
         "color":"#C2FABC"
      },
      {
         "id":7,
         "label":"node seven",
         "shape":"triangle",
         "color":"#FFA807"
      },
      {
         "id":8,
         "label":"node eight",
         "shape":"triangleDown",
         "color":"#6E6EFD"
      }
   ],
   "edges":[
      {
         "from":1,
         "to":8,
         "color":{
            "color":"red"
         }
      },
      {
         "from":1,
         "to":3,
         "color":"rgb(20,24,200)"
      },
      {
         "from":1,
         "to":2,
         "color":{
            "color":"rgba(30,30,30,0.2)",
            "highlight":"blue"
         }
      },
      {
         "from":2,
         "to":4,
         "color":{
            "inherit":"to"
         }
      },
      {
         "from":2,
         "to":5,
         "color":{
            "inherit":"from"
         }
      },
      {
         "from":5,
         "to":6,
         "color":{
            "inherit":"both"
         }
      },
      {
         "from":6,
         "to":7,
         "color":{
            "color":"#ff0000",
            "opacity":0.3
         }
      },
      {
         "from":6,
         "to":8,
         "color":{
            "opacity":0.3
         }
      }
   ]
}
`,
	`
{
   "nodes":[
      {
         "id":1,
         "label":"Node 1"
      },
      {
         "id":2,
         "label":"Node 2"
      },
      {
         "id":3,
         "label":"Node 3: Left-Aligned",
         "font":{
            "face":"Monospace",
            "align":"left"
         }
      },
      {
         "id":4,
         "label":"Node 4"
      },
      {
         "id":5,
         "label":"Node 5 Left-Aligned box",
         "shape":"box",
         "font":{
            "face":"Monospace",
            "align":"left"
         }
      }
   ],
   "edges":[
      {
         "from":1,
         "to":2,
         "label":"middle",
         "font":{
            "align":"middle"
         }
      },
      {
         "from":1,
         "to":3,
         "label":"top",
         "font":{
            "align":"top"
         }
      },
      {
         "from":2,
         "to":4,
         "label":"horizontal",
         "font":{
            "align":"horizontal"
         }
      },
      {
         "from":2,
         "to":5,
         "label":"bottom",
         "font":{
            "align":"bottom"
         }
      }
   ]
}
`
];

export { samples };