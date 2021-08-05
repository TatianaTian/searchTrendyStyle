const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: require("../config/keys").IBMApiKey
  }),
  serviceUrl: require("../config/keys").IBMServiceUrl
});

// using Promises provides the ability to use async / await
async function callIBM(text) {
  // syntax
  try {
    const syntaxAnalyzeParams = {
      'features': {
        'syntax': {
          'sentences': true,
          'tokens': {
            'lemma': true,
            'part_of_speech': true
          }
        }
      },
      'text': text,
    };
  
    const syntaxResults = await naturalLanguageUnderstanding.analyze(syntaxAnalyzeParams);
    const results = syntaxResults.result.syntax.tokens
    var dict_syn = {};
    results.forEach(word=>{
      if (word.part_of_speech in dict_syn){
        dict_syn[word.part_of_speech] += 1
      } else {
        dict_syn[word.part_of_speech] = 1
      }
    })
  
    //console.log(dict_syn)
  
    //keywords
    
    const keywordsAnalyzeParams = {
      'text': text,
      'features': {
        'keywords': {
          'sentiment': true,
          'emotion': true,
          'limit': 3
        }
      }
    };
  
    dict_keywords = []
    const keywordsResults = await naturalLanguageUnderstanding.analyze(keywordsAnalyzeParams)
    const keywords_results = keywordsResults.result.keywords
    keywords_results.forEach(keyword=>{
      const emotion = Object.keys(keyword.emotion).reduce((a, b) => keyword.emotion[a] > keyword.emotion[b] ? a : b);
      dict_keywords.push({text:keyword.text, sentiment:keyword.sentiment, emotion})
    })
    //console.log(dict_keywords)
  
  
  
  
    
    //entities
    const entitiesAnalyzeParams = {
      'text': text,
      'features': {
        'entities': {
          'sentiment': true,
          'limit': 1
        }
      }
    };
  
    dict_entities = []
    const entitiesResults = await naturalLanguageUnderstanding.analyze(entitiesAnalyzeParams)
    const entities_results = entitiesResults.result.entities
    entities_results.forEach(entity=>{
      dict_entities.push({type:entity.type, text:entity.text, sentiment:entity.sentiment})
    })
    //console.log(dict_entities)
  
    return [dict_syn, dict_keywords, dict_entities]
  } catch (error) {
    return [ { NOUN: 0,
      PUNCT: 0,
      SYM: 0,
      PROPN: 0,
      NUM: 0,
      VERB: 0,
      DET: 0,
      PART: 0,
      ADP: 0,
      ADJ: 0,
      AUX: 0,
      ADV: 0,
      PRON: 0,
      CCONJ: 0,
      SCONJ: 0 },
    [  ],
    [  ] ]

  }
}

exports.callIBM = callIBM;
