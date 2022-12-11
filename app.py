from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify

app=Flask(__name__)
app.config["SECRET_KEY"] = "abc123"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS']=False



boggle_game = Boggle()



@app.route('/')
def board():
    """Make game board, add to Session and render it in the DOM"""
    board=boggle_game.make_board()
    session['board']=board
    # get the high score from the session so it can be displayed in the DOM. If no high score is stored, display the high score as zero
    highscore = session.get("highscore", 0)
    number_of_plays = session.get("number_of_plays", 0)
    # pass the calculated values of 'board', 'highscore' and 'number_of_plays' into the template index.html
    return render_template("index.html", board=board, highscore=highscore,                    number_of_plays=number_of_plays)

@app.route("/check-word")
def check_if_a_valid_word():
    """Take the word from the parameters of our axios GET request (in the JS handleClick function) and check it against the board we have saved in session"""
    word = request.args["word"]
    # word = request.get_json().get('params')['word']
    board = session["board"]
    # 'reponse' will be one of three strings: "ok", "not-on-board" or "not-a-word"
    response = boggle_game.check_valid_word(board, word)
    # AJAX requests use JSON, which is why we need to take this {'result': response} dictionary and use jsonify to turn it into JSON.
    return jsonify({'result':response})
  
@app.route('/end_game', methods =['POST']) 
def end_game():
    """get the axios post (score) from the endgame function in JS and update highscore in session"""
    score = request.json['score']
    #get current high score and number of plays from session, if there is none saved in session, set variable to zero.
    highscore = session.get("highscore", 0)
    number_of_plays = session.get("number_of_plays", 0)
     #update high score if necesssary and number of plays in session
    session['highscore'] = max(score, highscore) 
    session['number_of_plays'] = number_of_plays + 1
    
    # need to return something/anything here so don't get a 500 error
    return 'game over'
   










