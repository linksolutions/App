from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asbuicfbeygd875dswwudb'
socketio = SocketIO( app )


#This denotes the starting point of the app (ie. index/pages)
@app.route( '/' )
def index():
	return render_template ( 'ChatAppPage.html' )

@socketio.on ( 'event' )
def handle_my_custom_event( json ):
	print('received something:' + str(json) )
	socketio.emit ('my response', json )


if __name__ == '__main__':
	socketio.run ( app, debug = True )
