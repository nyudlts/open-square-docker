# open-square-docker

To run this project, you will need to clone the repository and initialize the submodules.

```bash
$ gh repo clone nyudlts/open-square-docker
$ git submodule init
$ git submodule update
```

Once the submodules are initialized, you can run the docker image.

```bash
$ docker-compose up -d
```

Apache Solr will be available at http://localhost:8983/solr/open-square-docker
