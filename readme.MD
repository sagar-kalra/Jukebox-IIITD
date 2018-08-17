# JUKE-THE RYTHM
Responsive Webapp built in hackathon at IIIT Delhi.

## Development Workflow

### Setup your development environment

#### Prerequisites

```
python 3.5+
node 10.x.x+
npm 5.x+
pipenv
```

1. Fork and clone this repo.

```
$ git clone https://github.com/sagar-kalra/Jukebox-IIITD.git
```

2. Change working directory into the repo, activate your virtual environment and install the backend dependencies.

```
$ cd Jukebox-IIITD
$ pipenv shell
(env) $ pipenv install
```

3. Change the working directory into the frontend react app and install the frontend dependencies.

```
(env) $ cd frontend
(env) $ npm install
```

4. Start the django development server

```
(env) $ cd ..
(env) $ python manage.py migrate
(env) $ python manage.py runserver
```

5. Run the frontend app in another shell

```
(env) $ cd frontend
(env) $ npm run watch
```

6. Open http://localhost:8000/ in your browser.

7. Add a new remote to your fork if you want to contribute

```
git remote add myfork https://github.com/<username>/website2.git
```
