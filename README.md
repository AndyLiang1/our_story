# Our Story

Made by Andy and Arya with love <3

Haiiii Andy, I'll love you forever and ever :3 <3 MWAH MWAH.

## How to run yoyo migrations
1. Add the db/.env file from our google [doc](https://docs.google.com/document/d/10_2NFPEd3dLNVpfieamAXaiejnnolwVJ7kio30jfKKY/edit).

2. Install dependencies (only need to do once)

This step creates a python virtual environment and installs the required dependencies.

- Mac
```
cd db
python3 -m venv .venv 
source .venv/bin/activate
pip3 install -r requirements.txt
```

- Window Powershell
```
cd db
python -m venv .venv 
.\.venv\Scripts\Activate
pip3 install -r requirements.txt
```
3. Install flyctl: https://fly.io/docs/flyctl/install/
   
4. Set up proxy to forward the server port to your local system

The database is not public so we need to set up proxy.
```
fly proxy 5432 -a our-story-db
```
5. Before running any `yoyo` commands, source your .env and your venv (if you haven't done that already)

The environment variables are only available within your current shell. If you open another shell, you need to source your .env again.

- Mac
```
source .env
source .venv/bin/activate
```

- Windows
```
.\.venv\Scripts\Activate
```

5. Commands
- To list the migration status
```
find ./yoyo_migrations/* -type d ! -path "*passwords*" -exec yoyo list --database $DB_CONNECTION_STRING {} \; 
```

- To run migrations
```
./migrations.sh
```
Since you don't have `make` installed, you can comment out the `make` commands in `./migrations.sh`.
