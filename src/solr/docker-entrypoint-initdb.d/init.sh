#!/bin/bash
set -e

# v0 core
/opt/docker-solr/scripts/precreate-core open-square-metadata /conf/open-square-metadata
# v1 core
/opt/docker-solr/scripts/precreate-core open-square-metadata-v1 /conf/open-square-metadata-v1

echo "started v0 and v1 cores"
