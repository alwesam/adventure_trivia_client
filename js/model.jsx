var adventure = {
  name: "Find Holy Grail",
  description: "Find the Holy Grail but choose wisely",
  //answers can be mulitple choice, checkboxes, or true and false
  //suggest move answers to ansContent and only applies to multiple choice
  //(radio) or (checkbox), doesn't apply to true and false questions, answer
  //contents will be empty 
  challenges: [
        {
          loc: "Rome, Italy",
          questions: [
                      {"content" : "What is the capital of Spain?", 
                       "correctAnswer": "Madrid", 
                       "answers" :
                        ["Madrid", 
                         "London", 
                         "Istanbul"]
                      }, 

                      {"content" : "What is the capital of Austria?", 
                       "correctAnswer" : "Vienna",
                       "answers" :
                        ["Madrid", 
                        "Vienna", 
                        "Berlin"]
                      }, 

                      {"content" : "What is the capital of Poland?", 
                       "correctAnswer" : "Warsaw",
                       "answers"  :
                        ["Madrid", 
                        "Vienna", 
                        "Warsaw"]
                      } 
          ],
          clue: {"content" : "closest metropolis to the pyramids", "hint": "What the capital of Egypt", "answer" : "cairo"}
        }, 
        {
          loc: "Giza Necropolis, Giza, Egypt",
          questions: [
                      {"content" : "What is the capital of Egypt?", 
                       "correctAnswer" : "Cairo",
                       "answers" :
                        ["Cairo", 
                         "Amman", 
                         "Istanbul"]
                      }, 

                      {"content" : "What is the capital of Iraq?", 
                       "correctAnswer" : "Baghdad",
                       "answers" :
                        ["Baghdad", 
                        "Damascus", 
                        "Beirut"]
                      }, 

                      {"content" : "What is the capital of Libya?", 
                       "correctAnswer" : "Tripoli",
                       "answers"  :
                        ["Cairo", 
                        "Tripoli", 
                        "Khartoum"]
                      } 
          ],
          clue: {"content" : "Indian Jones was there", "hint" : "It was the capital of Naabatean Kingdom", "answer" : "petra"}
        }, 
        {
          loc: "Petra, Kingdom of Jordan",
          questions: [
                      {"content" : "What is the capital of Iran?", 
                       "correctAnswer" : "Tehran",
                       "answers" :
                        ["Delhi", 
                         "Tehran", 
                         "Istanbul"]
                      }, 

                      {"content" : "What is the capital of Qatar?", 
                       "correctAnswer" : "Doha",
                       "answers" :
                        ["Kuwait", 
                        "Jerusalem", 
                        "Doha"]
                      }, 

                      {"content" : "What is the capital of Oman?", 
                       "correctAnswer" : "Muscat",
                       "answers"  :
                        ["Muscat", 
                        "Dubai", 
                        "Manama"]
                      } 
          ],
          clue: {"content" : "What is one plus one", "hint" : "do you even read?", "answer" : "two"}
        } 
  ],
  finalChallenge: true
}; 
