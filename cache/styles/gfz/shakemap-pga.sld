<?xml version="1.0" encoding="UTF-8"?>
<!-- Created by SLD Editor 0.7.7 -->
<!-- Copied from https://github.com/riesgos/riesgos-frontend/issues/22#issuecomment-523379744 -->
<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" 
xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" 
xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0">
  <sld:NamedLayer>
    <sld:Name/>
    <sld:UserStyle>
      <sld:Name>shakemap-pga</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Name>name</sld:Name>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ColorMap>
              <sld:ColorMapEntry color="#FFFFFF" opacity="0" quantity="0" label=""/>
              <sld:ColorMapEntry color="#FFFFFF" opacity="0" quantity="0.0005" label=""/>
              <sld:ColorMapEntry color="#BFCCFF" opacity="0.5" quantity="0.0015" label=""/>
              <sld:ColorMapEntry color="#A0E6FF" opacity="0.5" quantity="0.0035" label=""/>
              <sld:ColorMapEntry color="#80FFFF" opacity="0.5" quantity="0.0075" label=""/>
              <sld:ColorMapEntry color="#7AFF93" opacity="0.5" quantity="0.0150" label=""/>
              <sld:ColorMapEntry color="#FFFF00" opacity="0.5" quantity="0.0350" label=""/>
              <sld:ColorMapEntry color="#FFC800" opacity="0.5" quantity="0.0750" label=""/>
              <sld:ColorMapEntry color="#FF9100" opacity="0.5" quantity="0.1500" label=""/>
              <sld:ColorMapEntry color="#FF0000" opacity="0.5" quantity="0.3500" label=""/>
              <sld:ColorMapEntry color="#C80000" opacity="0.5" quantity="0.7500" label=""/>
              <sld:ColorMapEntry color="#800000" opacity="0.5" quantity="1.5000" label=""/>
            </sld:ColorMap>
            <sld:ContrastEnhancement>
              <sld:GammaValue>1.0</sld:GammaValue>
            </sld:ContrastEnhancement>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </sld:NamedLayer>
</sld:StyledLayerDescriptor>
