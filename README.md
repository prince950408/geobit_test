# geobit_test

## Installation
Before you begin, ensure you have met the following requirements:

Python 3.11 and Node.js 22 installed

## Setup
Clone the repository:

```
git clone https://github.com/prince950408/geobit_test.git
```

Frontend
```
cd geobit_frontend
npm install
```

Backend
```
cd geobit_backend
python -m venv venv
ource venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

## Configuration
Create .env files for both frontend and backend:

Frontend
```
REACT_APP_SERVER_URL=http://localhost:5000/
```

Backend
```
DATABASE_URI=postgresql://username:password@localhost/db_name
```

## Database Setup
Initialize the database and run migrations:

Backend
```
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```
## Usage

Start the React and Flask server:

Frontend
```
npm start
```
Open your web browser and navigate to http://localhost:3000 to view the application.

Backend
```
flask run
```
Will run in http://localhost:5000
