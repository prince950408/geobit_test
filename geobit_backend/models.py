from flask_sqlalchemy  import SQLAlchemy

db = SQLAlchemy()

class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    time = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"<Message(id={self.id}, user_id='{self.user_id}', message='{self.message}', time={self.time})>"
