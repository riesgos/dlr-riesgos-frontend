<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" 
version="1.1.0" xmlns:se="http://www.opengis.net/se" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:ogc="http://www.opengis.net/ogc">
  <NamedLayer>
    <se:Name/>
    <UserStyle>
      <se:Name>style-cum-loss-peru-plasma</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Sin datos</se:Name>
          <se:Description>
            <se:Title>Sin datos</se:Title>
            <se:Abstract>No data</se:Abstract>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>buildings</ogc:PropertyName>
              <ogc:Literal>0</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:CssParameter name="fill">#e0e0e0</se:CssParameter>
            </se:Fill>
            <se:Stroke>
              <se:CssParameter name="stroke">#6f6f6f</se:CssParameter>
              <se:CssParameter name="stroke-width">1</se:CssParameter>
              <se:CssParameter name="stroke-linejoin">bevel</se:CssParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>&lt; 50.000 USD</se:Name>
          <se:Description>
            <se:Title>&lt; 50.000 USD</se:Title>
            <se:Abstract>Light damage</se:Abstract>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>buildings</ogc:PropertyName>
                <ogc:Literal>0</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThan>
                <ogc:PropertyName>cum_loss</ogc:PropertyName>
                <ogc:Literal>50000</ogc:Literal>
              </ogc:PropertyIsLessThan>
            </ogc:And>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:CssParameter name="fill">#eceac5</se:CssParameter>
            </se:Fill>
            <se:Stroke>
              <se:CssParameter name="stroke">#93916e</se:CssParameter>
              <se:CssParameter name="stroke-width">1</se:CssParameter>
              <se:CssParameter name="stroke-linejoin">bevel</se:CssParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>&lt; 100.000 USD</se:Name>
          <se:Description>
            <se:Title>&lt; 100.000 USD</se:Title>
            <se:Abstract>Moderate damage</se:Abstract>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:And>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:Literal>50000</ogc:Literal>
                <ogc:PropertyName>cum_loss</ogc:PropertyName>
              </ogc:PropertyIsLessThanOrEqualTo>
              <ogc:PropertyIsLessThan>
                <ogc:PropertyName>cum_loss</ogc:PropertyName>
                <ogc:Literal>100000</ogc:Literal>
              </ogc:PropertyIsLessThan>
            </ogc:And>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:CssParameter name="fill">#dab39b</se:CssParameter>
            </se:Fill>
            <se:Stroke>
              <se:CssParameter name="stroke">#a28574</se:CssParameter>
              <se:CssParameter name="stroke-width">1</se:CssParameter>
              <se:CssParameter name="stroke-linejoin">bevel</se:CssParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>&lt; 1.000.000 USD</se:Name>
          <se:Description>
            <se:Title>&lt; 1.000.000 USD</se:Title>
            <se:Abstract>Heavy damage</se:Abstract>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:And>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:Literal>100000</ogc:Literal>
                <ogc:PropertyName>cum_loss</ogc:PropertyName>
              </ogc:PropertyIsLessThanOrEqualTo>
              <ogc:PropertyIsLessThan>
                <ogc:PropertyName>cum_loss</ogc:PropertyName>
                <ogc:Literal>1000000</ogc:Literal>
              </ogc:PropertyIsLessThan>
            </ogc:And>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:CssParameter name="fill">#c38b88</se:CssParameter>
            </se:Fill>
            <se:Stroke>
              <se:CssParameter name="stroke">#8f383b</se:CssParameter>
              <se:CssParameter name="stroke-width">1</se:CssParameter>
              <se:CssParameter name="stroke-linejoin">bevel</se:CssParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>> 1.000.000 USD</se:Name>
          <se:Description>
            <se:Title>> 1.000.000 USD</se:Title>
            <se:Abstract>Severe damage</se:Abstract>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsLessThanOrEqualTo>
              <ogc:Literal>1000000</ogc:Literal>
              <ogc:PropertyName>cum_loss</ogc:PropertyName>
            </ogc:PropertyIsLessThanOrEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:CssParameter name="fill">#a37d89</se:CssParameter>
            </se:Fill>
            <se:Stroke>
              <se:CssParameter name="stroke">#69245f</se:CssParameter>
              <se:CssParameter name="stroke-width">1</se:CssParameter>
              <se:CssParameter name="stroke-linejoin">bevel</se:CssParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
