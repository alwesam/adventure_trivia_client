var adventure = {
  name: "Find Holy Grail",
  description: "Find the Holy Grail but choose wisely",
  //answers can be mulitple choice, checkboxes, or true and false
  //suggest move answers to ansContent and only applies to multiple choice
  //(radio) or (checkbox), doesn't apply to true and false questions, answer
  //contents will be empty 
  challenges: [
        {
          address: "Rome, Italy",
          questions: [
                      {"content" : "What is the capital of Spain?", 
                       "answer": "Madrid", 
                       "answers" :
                        [{content: "Madrid"}, 
                         {content: "London"}, 
                         {content: "Istanbul"}]
                      }, 

                      {"content" : "What is the capital of Austria?", 
                       "answer" : "Vienna",
                       "answers" :
                        [{content: "Madrid"}, 
                         {content: "Vienna"}, 
                         {content: "Berlin"}]
                      }, 

                      {"content" : "What is the capital of Poland?", 
                       "answer" : "Warsaw",
                       "answers"  :
                        [{content: "Madrid"}, 
                         {content: "Vienna"}, 
                         {content: "Warsaw"}]
                      } 
          ],
          riddle: {"content" : "closest metropolis to the pyramids", "hint": "What the capital of Egypt", "answer" : "cairo"}
        }, 
        {
          address: "Giza Necropolis, Giza, Egypt",
          questions: [
                      {"content" : "What is the capital of Egypt?", 
                       "answer" : "Cairo",
                       "answers" :
                        ["Cairo", 
                         "Amman", 
                         "Istanbul"]
                      }, 

                      {"content" : "What is the capital of Iraq?", 
                       "answer" : "Baghdad",
                       "answers" :
                        ["Baghdad", 
                        "Damascus", 
                        "Beirut"]
                      }, 

                      {"content" : "What is the capital of Libya?", 
                       "answer" : "Tripoli",
                       "answers"  :
                        ["Cairo", 
                        "Tripoli", 
                        "Khartoum"]
                      } 
          ],
          clue: {"content" : "Indian Jones was there", "hint" : "It was the capital of Naabatean Kingdom", "answer" : "petra"}
        }, 
        {
          address: "Petra, Kingdom of Jordan",
          questions: [
                      {"content" : "What is the capital of Iran?", 
                       "answer" : "Tehran",
                       "answers" :
                        ["Delhi", 
                         "Tehran", 
                         "Istanbul"]
                      }, 

                      {"content" : "What is the capital of Qatar?", 
                       "answer" : "Doha",
                       "answers" :
                        ["Kuwait", 
                        "Jerusalem", 
                        "Doha"]
                      }, 

                      {"content" : "What is the capital of Oman?", 
                       "answer" : "Muscat",
                       "answers"  :
                        ["Muscat", 
                        "Dubai", 
                        "Manama"]
                      } 
          ],
          riddle: {"content" : "What is one plus one", "hint" : "do you even read?", "solution" : "two"}
        } 
  ],
  include_final: true
}; 
