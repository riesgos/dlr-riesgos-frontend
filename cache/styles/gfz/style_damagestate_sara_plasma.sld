<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:se="http://www.opengis.net/se" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <se:Name/>
    <UserStyle>
      <se:Name>style-damagestate-sara-plasma</se:Name>
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
          <se:Name>Daño leve</se:Name>
          <se:Description>
            <se:Title>Daño leve</se:Title>
            <se:Abstract>Light damage</se:Abstract>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>buildings</ogc:PropertyName>
                <ogc:Literal>0</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThan>
                <ogc:PropertyName>w_damage</ogc:PropertyName>
                <ogc:Literal>1</ogc:Literal>
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
          <se:Name>Daño moderado</se:Name>
          <se:Description>
            <se:Title>Daño moderado</se:Title>
            <se:Abstract>Moderate damage</se:Abstract>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:And>
              <ogc:And>
                <ogc:PropertyIsGreaterThan>
                  <ogc:PropertyName>buildings</ogc:PropertyName>
                  <ogc:Literal>0</ogc:Literal>
                </ogc:PropertyIsGreaterThan>
                <ogc:PropertyIsLessThanOrEqualTo>
                  <ogc:Literal>1</ogc:Literal>
                  <ogc:PropertyName>w_damage</ogc:PropertyName>
                </ogc:PropertyIsLessThanOrEqualTo>
              </ogc:And>
              <ogc:PropertyIsLessThan>
                <ogc:PropertyName>w_damage</ogc:PropertyName>
                <ogc:Literal>2</ogc:Literal>
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
          <se:Name>Daño fuerte</se:Name>
          <se:Description>
            <se:Title>Daño fuerte</se:Title>
            <se:Abstract>Heavy damage</se:Abstract>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:And>
              <ogc:And>
                <ogc:PropertyIsGreaterThan>
                  <ogc:PropertyName>buildings</ogc:PropertyName>
                  <ogc:Literal>0</ogc:Literal>
                </ogc:PropertyIsGreaterThan>
                <ogc:PropertyIsLessThanOrEqualTo>
                  <ogc:Literal>2</ogc:Literal>
                  <ogc:PropertyName>w_damage</ogc:PropertyName>
                </ogc:PropertyIsLessThanOrEqualTo>
              </ogc:And>
              <ogc:PropertyIsLessThan>
                <ogc:PropertyName>w_damage</ogc:PropertyName>
                <ogc:Literal>3</ogc:Literal>
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
          <se:Name>Daño severo</se:Name>
          <se:Description>
            <se:Title>Daño severo</se:Title>
            <se:Abstract>Severe damage</se:Abstract>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>buildings</ogc:PropertyName>
                <ogc:Literal>0</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:Literal>3</ogc:Literal>
                <ogc:PropertyName>w_damage</ogc:PropertyName>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
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
