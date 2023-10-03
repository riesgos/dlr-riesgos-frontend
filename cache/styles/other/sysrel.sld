<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld"
    xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0">
    <sld:NamedLayer>
        <sld:Name>sysrel</sld:Name>
        <sld:UserStyle>
            <sld:Name>sysrel</sld:Name>
            <sld:FeatureTypeStyle>
                <sld:Name>name</sld:Name>

                <sld:Rule>
                    <sld:Name>p &#x2264; 0.25</sld:Name>
                    <ogc:Filter>
                        <ogc:PropertyIsLessThanOrEqual>
                            <ogc:PropertyName>Prob_Disru</ogc:PropertyName>
                            <ogc:Literal>0.25</ogc:Literal>
                        </ogc:PropertyIsLessThanOrEqual>
                    </ogc:Filter>
                    <sld:PolygonSymbolizer>
                        <sld:Fill>
                            <sld:CssParameter name="fill">#eceac5</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                            <sld:CssParameter name="stroke">#93916e</sld:CssParameter>
                            <sld:CssParameter name="stroke-linejoin">bevel</sld:CssParameter>
                        </sld:Stroke>
                    </sld:PolygonSymbolizer>
                </sld:Rule>

                <sld:Rule>
                    <sld:Name>p &#x2264; 0.50</sld:Name>
                    <ogc:Filter>
                        <ogc:PropertyIsLessThan>
                            <ogc:Literal>0.25</ogc:Literal>
                            <ogc:PropertyName>Prob_Disru</ogc:PropertyName>
                        </ogc:PropertyIsLessThan>
                        <ogc:PropertyIsLessThanOrEqual>
                            <ogc:PropertyName>Prob_Disru</ogc:PropertyName>
                            <ogc:Literal>0.5</ogc:Literal>
                        </ogc:PropertyIsLessThanOrEqual>
                    </ogc:Filter>
                    <sld:PolygonSymbolizer>
                        <sld:Fill>
                            <sld:CssParameter name="fill">#dab39b</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                            <sld:CssParameter name="stroke">#a28574</sld:CssParameter>
                            <sld:CssParameter name="stroke-linejoin">bevel</sld:CssParameter>
                        </sld:Stroke>
                    </sld:PolygonSymbolizer>
                </sld:Rule>

                <sld:Rule>
                    <sld:Name>p &#x2264; 0.75</sld:Name>
                    <ogc:Filter>
                        <ogc:PropertyIsLessThan>
                            <ogc:Literal>0.5</ogc:Literal>
                            <ogc:PropertyName>Prob_Disru</ogc:PropertyName>
                        </ogc:PropertyIsLessThan>
                        <ogc:PropertyIsLessThanOrEqual>
                            <ogc:PropertyName>Prob_Disru</ogc:PropertyName>
                            <ogc:Literal>0.75</ogc:Literal>
                        </ogc:PropertyIsLessThanOrEqual>
                    </ogc:Filter>
                    <sld:PolygonSymbolizer>
                        <sld:Fill>
                            <sld:CssParameter name="fill">#c38b88</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                            <sld:CssParameter name="stroke">#8f383b</sld:CssParameter>
                            <sld:CssParameter name="stroke-linejoin">bevel</sld:CssParameter>
                        </sld:Stroke>
                    </sld:PolygonSymbolizer>
                </sld:Rule>

                <sld:Rule>
                    <sld:Name>p &#x2264; 1.00</sld:Name>
                    <ogc:Filter>
                        <ogc:PropertyIsLessThan>
                            <ogc:Literal>0.75</ogc:Literal>
                            <ogc:PropertyName>Prob_Disru</ogc:PropertyName>
                        </ogc:PropertyIsLessThan>
                        <ogc:PropertyIsLessThanOrEqual>
                            <ogc:PropertyName>Prob_Disru</ogc:PropertyName>
                            <ogc:Literal>1.0</ogc:Literal>
                        </ogc:PropertyIsLessThanOrEqual>
                    </ogc:Filter>
                    <sld:PolygonSymbolizer>
                        <sld:Fill>
                            <sld:CssParameter name="fill">#a37d89</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                            <sld:CssParameter name="stroke">#69245f</sld:CssParameter>
                            <sld:CssParameter name="stroke-linejoin">bevel</sld:CssParameter>
                        </sld:Stroke>
                    </sld:PolygonSymbolizer>
                </sld:Rule>

            </sld:FeatureTypeStyle>
        </sld:UserStyle>
    </sld:NamedLayer>
</sld:StyledLayerDescriptor>