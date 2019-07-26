import { TestBed } from '@angular/core/testing';
import { SldParserService } from './sld-parser.service';
import { XhrFactory, HttpClient, HttpXhrBackend, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


class MyXhrFactory extends XhrFactory {
    build(): XMLHttpRequest {
        return new XMLHttpRequest();
    }
}
let httpClient = new HttpClient(new HttpXhrBackend(new MyXhrFactory()));



describe('SldParserService', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientModule,
            HttpClientTestingModule
        ], 
        providers: [
            SldParserService
        ]
    }));

    it('should be created', () => {
        const parser: SldParserService = TestBed.get(SldParserService);
        expect(parser).toBeTruthy();
    });


    it('should properly read an actual file', (done) => {

        const httpMock = TestBed.get(HttpTestingController);

        const parser: SldParserService = TestBed.get(SldParserService);
        
        parser.readStyleForLayer("QuakeledgerStyle.sld", "selected_rows").subscribe((result) => {
            console.log(result);
            expect( typeof result ).toBe("function");
            done();
        });

        const request = httpMock.expectOne("QuakeledgerStyle.sld");
        request.flush(`<?xml version="1.0" encoding="UTF-8"?>
        <StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se">
          <NamedLayer>
            <se:Name>selected_rows</se:Name>
            <UserStyle>
              <se:Name>selected_rows</se:Name>
              <se:FeatureTypeStyle>
                <Rule>
                  <Name>MAGNITUDE FROM: 0 TO: 2 RADIUS: 2 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>2</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 0 TO: 2 RADIUS: 2 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>2</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 0 TO: 2 RADIUS: 2 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>2</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 0 TO: 2 RADIUS: 2 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>2</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 0 TO: 2 RADIUS: 2 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>2</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 0 TO: 2 RADIUS: 2 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>2</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 0 TO: 2 RADIUS: 2 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>2</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 2 TO: 3 RADIUS: 4 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>4</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 2 TO: 3 RADIUS: 4 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>4</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 2 TO: 3 RADIUS: 4 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>4</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 2 TO: 3 RADIUS: 4 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>4</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 2 TO: 3 RADIUS: 4 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>4</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 2 TO: 3 RADIUS: 4 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>4</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 2 TO: 3 RADIUS: 4 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>2</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>4</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 3 TO: 4 RADIUS: 8 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>8</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 3 TO: 4 RADIUS: 8 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>8</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 3 TO: 4 RADIUS: 8 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>8</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 3 TO: 4 RADIUS: 8 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>8</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 3 TO: 4 RADIUS: 8 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>8</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 3 TO: 4 RADIUS: 8 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>8</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 3 TO: 4 RADIUS: 8 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>3</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>8</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4 TO: 4.5 RADIUS: 12 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>12</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4 TO: 4.5 RADIUS: 12 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>12</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4 TO: 4.5 RADIUS: 12 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>12</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4 TO: 4.5 RADIUS: 12 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>12</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4 TO: 4.5 RADIUS: 12 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>12</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4 TO: 4.5 RADIUS: 12 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>12</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4 TO: 4.5 RADIUS: 12 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>12</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4.5 TO: 5 RADIUS: 15 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>15</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4.5 TO: 5 RADIUS: 15 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>15</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4.5 TO: 5 RADIUS: 15 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>15</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4.5 TO: 5 RADIUS: 15 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>15</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4.5 TO: 5 RADIUS: 15 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>15</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4.5 TO: 5 RADIUS: 15 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>15</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 4.5 TO: 5 RADIUS: 15 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>4.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>15</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5 TO: 5.5 RADIUS: 18 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>18</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5 TO: 5.5 RADIUS: 18 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>18</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5 TO: 5.5 RADIUS: 18 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>18</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5 TO: 5.5 RADIUS: 18 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>18</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5 TO: 5.5 RADIUS: 18 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>18</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5 TO: 5.5 RADIUS: 18 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>18</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5 TO: 5.5 RADIUS: 18 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>18</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5.5 TO: 6 RADIUS: 22 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>22</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5.5 TO: 6 RADIUS: 22 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>22</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5.5 TO: 6 RADIUS: 22 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>22</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5.5 TO: 6 RADIUS: 22 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>22</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5.5 TO: 6 RADIUS: 22 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>22</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5.5 TO: 6 RADIUS: 22 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>22</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 5.5 TO: 6 RADIUS: 22 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>5.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>22</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6 TO: 6.5 RADIUS: 26 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>26</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6 TO: 6.5 RADIUS: 26 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>26</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6 TO: 6.5 RADIUS: 26 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>26</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6 TO: 6.5 RADIUS: 26 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>26</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6 TO: 6.5 RADIUS: 26 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>26</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6 TO: 6.5 RADIUS: 26 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>26</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6 TO: 6.5 RADIUS: 26 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>26</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6.5 TO: 7 RADIUS: 30 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>30</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6.5 TO: 7 RADIUS: 30 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>30</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6.5 TO: 7 RADIUS: 30 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>30</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6.5 TO: 7 RADIUS: 30 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>30</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6.5 TO: 7 RADIUS: 30 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>30</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6.5 TO: 7 RADIUS: 30 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>30</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 6.5 TO: 7 RADIUS: 30 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>6.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>30</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7 TO: 7.5 RADIUS: 35 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>35</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7 TO: 7.5 RADIUS: 35 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>35</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7 TO: 7.5 RADIUS: 35 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>35</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7 TO: 7.5 RADIUS: 35 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>35</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7 TO: 7.5 RADIUS: 35 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>35</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7 TO: 7.5 RADIUS: 35 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>35</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7 TO: 7.5 RADIUS: 35 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>35</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7.5 TO: 8 RADIUS: 40 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>40</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7.5 TO: 8 RADIUS: 40 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>40</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7.5 TO: 8 RADIUS: 40 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>40</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7.5 TO: 8 RADIUS: 40 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>40</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7.5 TO: 8 RADIUS: 40 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>40</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7.5 TO: 8 RADIUS: 40 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>40</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 7.5 TO: 8 RADIUS: 40 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>7.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>40</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8 TO: 8.5 RADIUS: 45 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>45</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8 TO: 8.5 RADIUS: 45 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>45</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8 TO: 8.5 RADIUS: 45 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>45</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8 TO: 8.5 RADIUS: 45 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>45</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8 TO: 8.5 RADIUS: 45 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>45</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8 TO: 8.5 RADIUS: 45 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>45</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8 TO: 8.5 RADIUS: 45 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>45</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8.5 TO: 9 RADIUS: 51 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>51</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8.5 TO: 9 RADIUS: 51 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>51</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8.5 TO: 9 RADIUS: 51 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>51</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8.5 TO: 9 RADIUS: 51 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>51</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8.5 TO: 9 RADIUS: 51 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>51</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8.5 TO: 9 RADIUS: 51 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>51</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 8.5 TO: 9 RADIUS: 51 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>8.5</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThan>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsLessThan>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>51</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 9 TO: X RADIUS: 60 ; DEPTH FROM: 0 TO: 20 COLOR: #ff0000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>0</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff0000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>60</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 9 TO: X RADIUS: 60 ; DEPTH FROM: 20 TO: 50 COLOR: #ff7f00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>20</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ff7f00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>60</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 9 TO: X RADIUS: 60 ; DEPTH FROM: 50 TO: 100 COLOR: #ffff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>50</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#ffff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>60</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 9 TO: X RADIUS: 60 ; DEPTH FROM: 100 TO: 250 COLOR: #00ff00</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>100</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#00ff00</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>60</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 9 TO: X RADIUS: 60 ; DEPTH FROM: 250 TO: 500 COLOR: #0000ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>250</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#0000ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>60</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 9 TO: X RADIUS: 60 ; DEPTH FROM: 500 TO: 800 COLOR: #7f00ff</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>500</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsLessThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsLessThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#7f00ff</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>60</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
                <Rule>
                  <Name>MAGNITUDE FROM: 9 TO: X RADIUS: 60 ; DEPTH FROM: 800 TO: X COLOR: #000000</Name>
                  <Filter xmlns="http://www.opengis.net/ogc">
                    <And>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>magnitude.mag.value</PropertyName>
                        <Literal>9</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                      <PropertyIsGreaterThanOrEqualTo>
                        <PropertyName>origin.depth.value</PropertyName>
                        <Literal>800</Literal>
                      </PropertyIsGreaterThanOrEqualTo>
                    </And>
                  </Filter>
                  <PointSymbolizer>
                    <Graphic>
                      <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                          <CssParameter name="fill">#000000</CssParameter>
                        </Fill>
                      </Mark>
                      <Size>60</Size>
                    </Graphic>
                  </PointSymbolizer>
                </Rule>
              </se:FeatureTypeStyle>
            </UserStyle>
          </NamedLayer>
        </StyledLayerDescriptor>
        
        `);

        httpMock.verify();

    }, 9000);
});
