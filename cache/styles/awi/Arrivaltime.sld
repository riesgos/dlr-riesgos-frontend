<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" 
xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" 
version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:ogc="http://www.opengis.net/ogc" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name/>
    <UserStyle>
      <se:Name>arrivalTimes</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Lines of equal arrival / Líneas de igual llegada</se:Name>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">round</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">2 7</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:TextSymbolizer>
           
            <se:Label>

        		<ogc:Function name="Round"> 
                  <ogc:Div>
                    
        			<ogc:PropertyName>first_arri</ogc:PropertyName>
                       
        			<ogc:Literal>60</ogc:Literal>
                    

    				</ogc:Div>
                  </ogc:Function>
                  <ogc:Literal>min</ogc:Literal>
     
            </se:Label>
            <se:Font>
              <se:SvgParameter name="font-family">Sahadeva</se:SvgParameter>
              <se:SvgParameter name="font-size">14</se:SvgParameter>
            </se:Font>
            <se:LabelPlacement>
              <se:LinePlacement>
                    <se:PerpendicularOffset>7</se:PerpendicularOffset>
              </se:LinePlacement>
            </se:LabelPlacement>
            <se:Fill>
              <se:SvgParameter name="fill">#000000</se:SvgParameter>
            </se:Fill>
          </se:TextSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
