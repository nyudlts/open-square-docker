# open-square-docker

This repository works as a testing ground for solr configurations and the data used in them for the opensquare project.  
It brings in the solr schema repository as a submodule as a means to keep separate from the dockerization efforts and our data loading scripts.

```
+---------------------------------------
| open-square-docker
| (dockerization of config + data)
|
| +----------------------
| | discovery-solr-core-confs
| | git submodule
| | (solr configuration)
| +----------------------
|     ^
|     |
| +----------------------
| | deno load script
| +----------------------
|     ^
|     |
| +----------------------
| | dlts-viewer-api
| | (middleware api)
| +----------------------
|     ^
|     |
| +----------------------
| | supadu
| | nyu press
| | (source data)
| +----------------------
|
|
| +----------------------
| | dlst-epub-metadata
| | git submodule
| | (source data might be out of date)
| | no longer used as source of data
| +----------------------
+---------------------------------------
```

## Pre-requisites

- docker desktop with docker compose
- deno (latest) TODO: add this to docker compose and use devcontainers
- git

## Setup

To run this project, you will need to clone the repository and initialize the submodules.

```bash
gh repo clone nyudlts/open-square-docker
# or
# git clone git@github.com:nyudlts/open-square-docker.git

# when cloning or pulling changes
git submodule update --init --recursive
```

Submodules included in this repository:

TODO: dlts-epub-metadata doesn't seem to be the best source of truth
might need to use the dlts-viewer api for a more complete image of the data

- [dlts-epub-metadata](https://github.com/NYULibraries/dlts-epub-metadata) - source data used to ingest into solr.
- [discovery-solr-core-confs](https://github.com/nyudlts/discovery-solr-core-confs) - solr configuration + previously-indexed data

Once the submodules are initialized, you can run the docker image for solr.

```bash
# starts solr with the current schema, and the pre-ingested data in the `data` directory, detached from the cli
docker-compose up -d

# to stop and delete containers
docker-compose down
```

> data persistence done via volume mount, docker-compose was used to simplify volume mounting.

Apache Solr will be available at http://localhost:8983/solr/open-square-metadata

## Test/Add a new core to the Solr configuration

1. add reference to configuration in `docker-compose.yml` to create a new core.
2. modify `docker-entrypoint.d/init.sh` if you need to create a new core.

> note that the `dataDir` where the indexed data will live is configured to use the local `data` directories. Which are also commited to git history. This facilitates deployment since data is pre-loaded, but complicates development since you have to manually delete all data if you are testing new schema shapes or newer content.
> this will start the solr index in a "pre-ingested" mode.

> docker compose down -v
> docker compose up --build -d

## Remove all ingested data in solr

- option 1: boot up solr, delete data from the admin panel (will be back if you don't delete content on the `data` dir)
- option 2: boot up solr, delete data from the CLI (will be back if you don't delete content on the `data` dir)
- option 3: hard delete data in the `data` directory located under the core you are working on, restart solr, reingest data.

> use option 3 for now

## Add documents to Solr

> metadata repository used for ingestion is already present as a submodule in `src/dlts-epub-metadata`

1. Run the ingest script from the root of the project

```bash
# assuming deno installed on your system
deno run --allow-net --allow-read src/scripts/ingest-document/index.ts

# docker run --rm \
#   --network open-square-docker_opensquare_network \
#   -v ./src/scripts/ingest-document:/app \
#   -v ./src/dlts-epub-metadata:/metadata/dlts-epub-metadata \
#   denoland/deno:alpine \
#   run --allow-net --allow-read metadata/ingest-document/ingest.ts
```

TODO: dockerize ingestion script, or devcontainer the deno environment

> You can test different metadata by making changes directly within the repository and/or by changing branches in the submodule
> remember to commit to the superproject if you want to point the submodule to a different commit

## Test Queries to Solr

Apache Solr will be available at http://localhost:8983/solr/open-square-metadata
