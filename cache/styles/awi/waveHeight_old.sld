<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" 
xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>mwh</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="ramp" >
              <sld:ColorMapEntry quantity="0.031623" label=">=0.03 m" opacity="0" color="#253494"/>
              <sld:ColorMapEntry quantity="0.1" label=">= 0.10 m"		color="#2c97b8"/>
              <sld:ColorMapEntry quantity="0.16504757" label=">= 0.16 m" color="#2c7fb8"/>
              <sld:ColorMapEntry quantity="0.27240699" label=">= 0.27 m" color="#41b6c4"/>
              <sld:ColorMapEntry quantity="0.44960111" label=">= 0.45 m" color="#a1dab4"/>
              <sld:ColorMapEntry quantity="0.7420557" label=">= 0.74 m" color="#e1ffaf"/>
              <sld:ColorMapEntry quantity="1.22474487" label=">= 1.22 m" color="#e7fd70"/>
              <sld:ColorMapEntry quantity="2.02141161" label=">= 2.00 m" color="#fffa42"/>
              <sld:ColorMapEntry quantity="3.33629067" label=">= 3.33 m" color="#ffd657"/>
              <sld:ColorMapEntry quantity="5.50646657" label=">= 5.50 m" color="#ff9139"/>
              <sld:ColorMapEntry quantity="9.08828909" label=">= 9.00 m" color="#ff5b00"/>
              <sld:ColorMapEntry quantity="15." label=">= 15.00 m" color="#ff0000"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>