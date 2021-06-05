import string
import boto3
import spacy
import numpy as np
from scipy import spatial
from sent2vec.vectorizer import Vectorizer
from boto3 import client

s3 = boto3.client(
  's3',
    'us-west-1',
    aws_access_key_id = '..'
    aws_secret_access_key = ''
)
s3.download_file('pre-trained-word2vec', 'lexvec.vectors', 'lexvec.vectors')
nlp = spacy.load("en_core_web_trf")
nlp.vocab["not"].is_stop = False
vectorizer = Vectorizer()
#pretrained_vectors_path = './core/lexvec.vectors'
#model = gensim.models.KeyedVectors.load_word2vec_format(pretrained_vectors_path)

def loadGloveModel(File):
    print("Loading Glove Model")
    f = open(File,encoding="utf8")
    gloveModel = {}
    for line in f:
        splitLines = line.split()
        word = splitLines[0]
        wordEmbedding = np.array([float(value) for value in splitLines[1:]])
        gloveModel[word] = wordEmbedding
    print(len(gloveModel)," words loaded!")
    return gloveModel
    
model = loadGloveModel('lexvec.vectors')

# Define a function to normalize text:
def text_processing(text):
  # lowercase text
  text = text.lower()
  doc = nlp(text)
  # remove punctuation
  doc = [token for token in doc if token.text not in string.punctuation]
  # remove stop words 
  doc = [token for token in doc if not token.is_stop]
  # get lemma 
  doc = [token.lemma_ for token in doc]

  return doc

def sent_to_vecs(sent_tokens):
  vectors = []
  for element in sent_tokens:
      temp = []
      for w in element:
          temp.append(model[w])
      vectors.extend([np.mean(temp, axis=0)])
  return vectors

def check_relevant(question, answer):
  question_tokens = text_processing(question)
  answer_tokens = text_processing(answer)

  vectors = sent_to_vecs([question_tokens,answer_tokens])
  dist = spatial.distance.cosine(vectors[0], vectors[1])

  if dist < 0.65:
    return 1
  return 0

# for sent in sentences:
#   tokens_sent.append(text_processing(sent))

# tokens_sent = []
# relevant_sents = []
# irrelevant_sents = []

# sentences = ["Do you feel the organization's policies and benefits are employee-friendly?",
#              "I feel the policy of the company is quite good, brings good conditions for employees!",
#             "The company does not have a policy to support employees away from home. Should facilitate working from home or remotely",
#             "Overtime payment is quite low, I'm not satisfied about this",
#             "Hi, how are you",
#             "Just fine, but the company should have more outside activities",
#             "They are so nice to me!",
#             "I have to work early tomorrow",
#             "Everything seems boring, I did not learn anything",
#             "I don't know",
#             "The policies and benefits are good!"
# ]
#vectorizer.word2vec(tokens_sent, pretrained_vectors_path= pretrained_vectors_path)
#vectors = vectorizer.vectors
# for i,sent in enumerate(sentences[1:]):
#   #print('Q: In the last year, do you feel you have grown in terms of your knowledge and capabilities?')
#   print(sentences[i+1])
#   if spatial.distance.cosine(vectors[0], vectors[i+1]) < 0.65:
#     relevant_sents.append(sentences[i+1])
#   else:
#     irrelevant_sents.append(sentences[i+1])
#   print('Distance score:', spatial.distance.cosine(vectors[0], vectors[i+1]))# calculate_similarity(cleaned_sentences[0], cleaned_sentences[i+1]))
#   print('---------------')

# print('\nSummary\n')
# print('Relevant answers:\n')
# for sent in relevant_sents:
#   print('\t-',sent)

# print('\nIrrelevant answers:\n')
# for sent in irrelevant_sents:
#   print('\t-',sent)


