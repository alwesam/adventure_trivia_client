var adventure = {
  name: "Find Holy Grail",
  challenges: [
        {
          loc: "Rome, Italy",
          questions: [
                      {"question" : "What is the capital of Spain?", 
                       "correctAnswer": "Madrid", 
                       "answers" :
                        ["Madrid", 
                         "London", 
                         "Istanbul"]
                      }, 

                      {"question" : "What is the capital of Austria?", 
                       "correctAnswer" : "Vienna",
                       "answers" :
                        ["Madrid", 
                        "Vienna", 
                        "Berlin"]
                      }, 

                      {"question" : "What is the capital of Poland?", 
                       "correctAnswer" : "Warsaw",
                       "answers"  :
                        ["Madrid", 
                        "Vienna", 
                        "Warsaw"]
                      } 
          ],
          clue: {"content" : "closest metropolis to the pyramids", "answer" : "cairo"},
          statusComplete: false
        }, 
        {
          loc: "Giza Necropolis, Giza, Egypt",
          questions: [
                      {"question" : "What is the capital of Egypt?", 
                       "correctAnswer" : "Cairo",
                       "answers" :
                        ["Cairo", 
                         "Amman", 
                         "Istanbul"]
                      }, 

                      {"question" : "What is the capital of Iraq?", 
                       "correctAnswer" : "Baghdad",
                       "answers" :
                        ["Baghdad", 
                        "Damascus", 
                        "Beirut"]
                      }, 

                      {"question" : "What is the capital of Libya?", 
                       "correctAnswer" : "Tripoli",
                       "answers"  :
                        ["Cairo", 
                        "Tripoli", 
                        "Khartoum"]
                      } 
          ],
          clue: {"content" : "Indian Jones was there", "answer" : "petra"},
          statusComplete: false
        }, 
        {
          loc: "Petra, Kingdom of Jordan",
          questions: [
                      {"question" : "What is the capital of Iran?", 
                       "correctAnswer" : "Tehran",
                       "answers" :
                        ["Delhi", 
                         "Tehran", 
                         "Istanbul"]
                      }, 

                      {"question" : "What is the capital of Qatar?", 
                       "correctAnswer" : "Doha",
                       "answers" :
                        ["Kuwait", 
                        "Jerusalem", 
                        "Doha"]
                      }, 

                      {"question" : "What is the capital of Oman?", 
                       "correctAnswer" : "Muscat",
                       "answers"  :
                        ["Muscat", 
                        "Dubai", 
                        "Manama"]
                      } 
          ],
          clue: {"content" : "What is one plus one", "answer" : "two"},
          statusComplete: false
        } 
  ],
  finalChallenge: "Game"
}; 
