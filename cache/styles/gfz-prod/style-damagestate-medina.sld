<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld"
    xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0">
    <sld:NamedLayer>
        <sld:Name>style-damagestate-medina</sld:Name>
        <sld:UserStyle>
            <sld:Name>style-damagestate-medina</sld:Name>
            <sld:FeatureTypeStyle>
                <sld:Name>name</sld:Name>
                <sld:Rule>
                    <sld:Name>Sin datos</sld:Name>
                    <ogc:Filter>
                        <ogc:PropertyIsLessThanOrEqualTo>
                            <ogc:Literal>3</ogc:Literal>
                            <ogc:PropertyName>w_damage</ogc:PropertyName>
                        </ogc:PropertyIsLessThanOrEqualTo>
                    </ogc:Filter>
                    <sld:PolygonSymbolizer>
                        <sld:Fill>
                            <sld:CssParameter name="fill">#d78b8b</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                            <sld:CssParameter name="stroke">#a86d6d</sld:CssParameter>
                            <sld:CssParameter name="stroke-linejoin">bevel</sld:CssParameter>
                        </sld:Stroke>
                    </sld:PolygonSymbolizer>
                </sld:Rule>

                <sld:Rule>
                    <sld:Name>Daño leve</sld:Name>

                    <ogc:Filter>
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
                    <sld:Name>Daño moderado</sld:Name>

                    <ogc:Filter>
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
                    <sld:Name>Daño fuerte</sld:Name>

                    <ogc:Filter>
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
                    <sld:Name>Daño severo</sld:Name>

                    <ogc:Filter>
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