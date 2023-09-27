#!/bin/bash

# send ShakeMap style to GeoServer

set -e

cd "$(dirname "$0")"

URL="__GEOSERVER_URL__"
GS_USER="admin"
GS_PASSWORD="__GEOSERVER_PASSWORD__"

function upload () {
    local STYLE_NAME=$1
    local SLD_FILE=$2
    # remove style if it exists already
    curl -v -u "${GS_USER}:${GS_PASSWORD}" \
        -XDELETE -H "Content-type: text/xml" \
        "${URL}/rest/styles/${STYLE_NAME}" || true

    # create style
    curl --fail -v -u "${GS_USER}:${GS_PASSWORD}" \
        -XPOST -H "Content-type: text/xml" \
        -d "<style><name>${STYLE_NAME}</name><filename>${SLD_FILE}</filename></style>" \
        "${URL}/rest/styles"

    # modify the style to use this SLD
    curl --fail -v -u "${GS_USER}:${GS_PASSWORD}" \
        -XPUT -H "Content-type: application/vnd.ogc.sld+xml" \
        -d "@${SLD_FILE}" \
        "${URL}/rest/styles/${STYLE_NAME}"
}

upload 'shakemap-pga' 'shakemap-pga.sld'
upload 'style-damagestate-sara' 'style_damagestate_sara.sld'
upload 'style-damagestate-suppasri' 'style_damagestate_suppasri.sld'
upload 'style-damagestate-medina' 'style_damagestate_medina.sld'
upload 'style-transitions' 'style_transitions.sld'
upload 'style-loss' 'style_loss.sld'
upload 'style-cum-loss' 'style_cum_loss.sld'

upload 'style-cum-loss-chile-plasma' 'style_cum_loss_chile_plasma.sld'
upload 'style-cum-loss-peru-plasma' 'style_cum_loss_peru_plasma.sld'
upload 'style-damagestate-medina-plasma' 'style_damagestate_medina_plasma.sld'
upload 'style-damagestate-sara-plasma' 'style_damagestate_sara_plasma.sld'
upload 'style-damagestate-suppasri-plasma' 'style_damagestate_suppasri_plasma.sld'
