from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify, flash
from flask_debugtoolbar import DebugToolbarExtension



app=Flask(__name__)
app.config["SECRET_KEY"] = "abc123"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS']=False

debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def board():
    board=boggle_game.make_board()
    session['board']=board
    return render_template("index.html", board=board)

@app.route("/check-word", methods=['POST'])
def check_if_a_valid_word():
    word = request.args['word']
    board = session["board"]
    result = boggle_game.check_valid_word(board, word)
    print("The result of checking if the word is valid: ", result)

    return jsonify(word= word, result=result)
   
    









