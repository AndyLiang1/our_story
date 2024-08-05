YOYO := $(shell command -v yoyo 2> /dev/null)

## Show help
.PHONY: help
help:
	@awk 'BEGIN {FS = ":"; printf "\n Usage:\n"} \
		/^##/ { split($$0, a, "##"); latest = a[2]; next } \
		/^[a-zA-Z_-]+:/ { printf "  %-20s %s\n", $$1, latest; latest=""; next; } \
		' $(MAKEFILE_LIST)
## Initialize the required dependencies
.PHONY: init
init:
	python3 -m venv .venv; source .venv/bin/activate; pip install -r requirements.txt;

## List all migrations, and their status if applied to DB ( filter out passwords)
.PHONY: list
list:
	source .venv/bin/activate; source .env; find ./yoyo_migrations/* -type d ! -path "*passwords*" -exec yoyo list --database $$DB_CONNECTION_STRING {} \;

## Apply all the migrations using yoyo-migrations
.PHONY: migrations
migrations:
	source .venv/bin/activate; source .env; ./migrations.sh; deactivate

## Show database URL for yoyo
.PHONY: url
url:
	source .env; echo $$DB_CONNECTION_STRING