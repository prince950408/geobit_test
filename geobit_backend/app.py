from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask_migrate import Migrate
from models import db, Message
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

@app.route('/msg_list', methods=['GET'])
def get_messages():
    messages = Message.query.order_by(Message.time).all()
    message_list = [{"id": message.id, "user_id": message.user_id, "message": message.message, "time": message.time} for message in messages]
    return jsonify(message_list)

@socketio.on('send_msg')
def handle_send_message(data):
    print(data)
    new_message = Message(user_id=data['user_id'], message=data['msg'], time=data['time'])
    db.session.add(new_message)
    db.session.commit()
    emit('receive_msg', {'id': new_message.id, 'user_id': new_message.user_id, 'message': new_message.message}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, port=8000)
