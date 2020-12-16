const samples = [
	`
{
   "data" : {
      "name":"Zoo Animal",
      "children": [
          {
            "name" : "Mammals",
            "children": [
              {
                "name" : "Racoon"
              }, 
              {
                "name" : "Bear"
              }
            ]
          }, 
          {
            "name" : "Bird"
          }, 
          {
            "name" : "Reptile",
            "children": [
              {
                "name" : "Lizzard"
              }, 
              {
                "name" : "Snake",
                "children": [
                  {
                    "name" : "Python"
                  }, 
                  {
                    "name" : "RattleSnake"
                  }
                ]
              }
            ]
          }
        ]
   },
   "style" : {
      "nodeColor": "orange",
      "radius": 50,
      "sizeX" : 800,
      "sizeY" : 500,
      "fontSize" : "13px"
   }
}	
`
];

export { samples };
