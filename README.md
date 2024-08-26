# Our Story

Made by Andy and Arya with love <3

Haiiii Andy, I'll love you forever and ever :3 <3 MWAH MWAH.

## How to run alembic migrations
### Set up

1. Add the db/.env file from our google [doc](https://docs.google.com/document/d/10_2NFPEd3dLNVpfieamAXaiejnnolwVJ7kio30jfKKY/edit).

2. Install dependencies (only need to do once)

This step creates a python virtual environment and installs the required dependencies.

- Mac (for Windows, you need to run these in Bash)
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
- Login to fly: `fly login`
   
4. Set up proxy to forward the server port to your local system

The database is not public so we need to set up proxy.
```
fly proxy <your_local_port>:5432 -a our-story-db
```
`<your_local_port>` is the local port you're going to forward the db connection to. For example, `fly proxy 5431:5432 -a our-story-db` will forward the database to your local port 5431.

5. Source your .env and your venv (if you haven't done that already)

The environment variables are only available within your current shell. If you open another shell, you need to source your .env again.

- Mac (for Windows, use Bash)
```
source .env
source .venv/bin/activate
```

- Windows
```
.\.venv\Scripts\Activate
```

### Alembic migration
Alembic can work with multiple branches. Think of branches as different migration streams. A migration stream consists of different series of migrations. For example, we have a migration flow for data related to `user` table and a different migration flow for data related to `document` table. See more details [here](https://alembic.sqlalchemy.org/en/latest/branches.html#working-with-multiple-bases).


### Create a new migration branch
Example: To add a new migration branch for `some_table`

1. In alembic.ini, add the path to the directory where the revision files of this branch will be stored to [version_locations](https://github.com/AndyLiang1/our_story/blob/master/db/alembic.ini#L42) (paths are separated by `:`).

Example: Adding a directory for some_table migration
```
version_locations = %(here)s/some_table:%(here)s/document:%(here)s/user:alembic/versions
```
%(here)s prefers to the directory where alembic.ini is stored at (i.e db). 

There are 4 directories defined here:
- db/some_table
- db/document
- db/user 
- db/alembic/versions (this is the default directory)

2. Create the branch
```
alembic revision -m "create some_table branch" --head=base --branch-label=some_table --version-path=your_path
```
Note: `--version-path` must be specified and exist in `version_locations`.

### Create a new revision file for a branch
To create a revision file that doesn't depend on any of the previous revisions.
```
alembic revision -m "add a table" --head=<branch_name>
```

If your revision depends on another revision
```
alembic revision -m "add some columns" --head=customer_speed_limits@head --depends-on=<rev_id>
```
- `<rev_id>:` rev ID of the file this revision depends on.

These revision files follow a naming convention defined in [file_template](https://github.com/AndyLiang1/our_story/blob/master/db/alembic.ini#L12) in alembic.ini. Currently, the format is `<year><month><day><hour><minute>_<rev_id>_<slug>.py` (the datetime is in PST timezone). This provides a sorted list of revision files so that it's easier for us to track.

### See current head of alembic migration (latest migration)
```
alembic current -v
```
Example output:
```
(.venv) aryaphan@Aryas-MacBook-Pro-3 db % alembic current -v
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
Current revision(s) for postgresql://postgres:***@localhost:5432/our_story_db:
Rev: 4480872671b5 (head)
Parent: <base>
Branch names: document
Path: /Users/aryaphan/Desktop/Projects/our_story/db/document/202408241826_4480872671b5_create_document_branch.py

    create document branch
    
    Revision ID: 4480872671b5
    Revises: 
    Create Date: 2024-08-24 18:26:37.922776

Rev: b284603b74e0 (head)
Parent: 94376ab216fa
Also depends on: 94376ab216fa
Branch names: user
Path: /Users/aryaphan/Desktop/Projects/our_story/db/user/202408252133_b284603b74e0_add_email_unique_index.py

    add email unique index
    
    Revision ID: b284603b74e0
    Revises: 94376ab216fa
    Create Date: 2024-08-25 21:33:56.828563
```
### Upgrade migrations
To upgrade all migration at once
```
alembic upgrade heads
```

To upgrade migrations to the head of a specifc branch
```
alembic upgrade <branch_name>@head
```
e.g: `alembic upgrade user@head` updates the user branch to its latest revision.

To upgrade to 2 more revisions from the current revision
```
alembic upgrade +2
```

### Downgrade migrations
To undo a migration
```
alembic downgrade <rev_id>
```

To downgrade 2 steps from the current revision
```
alembic downgrade -2
```

### Other commands
See [Alembic documentation](https://alembic.sqlalchemy.org/en/latest/front.html).