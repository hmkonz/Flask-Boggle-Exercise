from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle





class FlaskTests(TestCase):
    """unit tests for Boggle Exercise"""

    def setUp(self):
        """Things to do before every test"""
        # assign 'client' to the test_client method that makes us a testing client (a version of our server that we have access to within our code)
        self.client = app.test_client()
        # Make Flask errors be real errors, not HTML pages with error info
        app.config['TESTING']=True  

    def test_homepage(self):
        """check to make sure everything starts up correctly with the displays we are expecting"""
        with self.client:
            response = self.client.get('/')
            # resp.data is our entire index.html file with a type of bytes so need to convert bytes to strings
            html = response.get_data(as_text=True)
            self.assertIn('Score: <b id="score">0</b>', html)
            self.assertIn("<h1> Let's Play Boggle!!</h1>", html)
            self.assertIn('board',session)
            # checks to see if highscore doesn't have a value at the beginning of the game
            self.assertIsNone(session.get("highscore"))
            # checks to see if number_of_plays doesn't have a value at the beginning of the game
            self.assertIsNone(session.get("number_of_plays"))


    def test_valid_word(self):
       """Test if a word is valid compared to a given board that has been put in the session"""
      
       with self.client as client:
           with client.session_transaction() as change_session:
            # set 'board' equal to the following to see if test works
               change_session['board'] = [["R", "O", "K", "R", "T"],
                                ["C", "C", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"]]
        # Now those changes will be in Flask's session
       response = self.client.get('/check-word?word=rock')
        # {'result':response} was converted to json (a string) when returned from "/check-word" route so need to convert response.result to json so can compare to the expected string outcome 'ok'
       self.assertEqual(response.json['result'], 'ok') 

    def test_not_a_word(self):
        """Test if a word submitted is not in the English dictionary""" 

        with self.client as client:
            with client.session_transaction() as change_session:     
         # set 'board' equal to the following to see if test works    
                change_session['board'] = [["R", "O", "K", "R", "T"],
                                ["C", "C", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"]]
        # Now those changes will be in Flask's session
        response = self.client.get('/check-word?word=catt')
        # {'result':response} was converted to json (a string) when returned from "/check-word" route so need to convert response.result to json so can compare to the expected string outcome 'not-word'
        self.assertEqual(response.json['result'], 'not-word') 

    def test_not_on_board(self):
        """Test if a word is not on the board""" 

        with self.client as client:
            with client.session_transaction() as change_session:     
                # set 'board' equal to the following to see if test works    
                change_session['board'] = [["R", "O", "K", "R", "T"],
                                ["C", "C", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"]]
        # Now those changes will be in Flask's session
        response = self.client.get('/check-word?word=silly')
        # {'result':response} was converted to json (a string) when returned from "/check-word" route so need to convert response.result to json so can compare to the expected string outcome ''not-on-board'
        self.assertEqual(response.json['result'], 'not-on-board') 

 

          

