

dmstr
- lineas de transmision: nicht mehr da?
- in der tat nicht mehr erreichbar
Hugo's layer einfügen
- is an arcgis-rest-feature layer
- Valid request:
    - https://sigrid.cenepred.gob.pe/arcgis/rest/services/Elementos_Expuestos/MapServer/2070200/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry={%22xmin%22:-8570731.107560243,%22ymin%22:-1408887.3053523675,%22xmax%22:-8531595.349078232,%22ymax%22:-1369751.5468703571,%22spatialReference%22:{%22wkid%22:3857}}&geometryType=esriGeometryEnvelope&inSR=3857&outFields=*&outSR=3857
    - https://sigrid.cenepred.gob.pe/arcgis/rest/services/Elementos_Expuestos/MapServer/2070200/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-77.03419256955385%2C%22ymin%22%3A-11.943285670131445%2C%22xmax%22%3A-76.73561042781488%2C%22ymax%22%3A-11.644703528392474%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&inSR=4326&outFields=*&outSR=4326
    - but: while CORS: *, it does require authentication.
    - I don't have access to authentication, though: https://sigrid.cenepred.gob.pe/arcgis/tokens/generateToken <-- requires a SIGRID-password, apprently.
    - Also, the source URL is going to change.



### Feedback Harald
- dmg post tsunami
    - popups sind oben und unten abgeschnitten
    - bewege den kartenauschnitt damit popup zentraler liegt

### Feedback camilo

- total replacement cost after ts: consistent?
- @Hugo: will time to recuperation be in there?
- @Torsten: Frontendnummer Hochziehen?
- @Ebeth: reactivate expert mode on our own machine only?
-@Michael: write Camilo once newly cached version is deployed
