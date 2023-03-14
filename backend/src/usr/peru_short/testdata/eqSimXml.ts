export const eqSimXmlTestData = `<ns1:shakemap_grid 
    xmlns:ns1="http://earthquake.usgs.gov/eqcenter/shakemap" 
    xmlns="http://earthquake.usgs.gov/eqcenter/shakemap" 
    xsi:schemaLocation="http://earthquake.usgs.gov http://earthquake.usgs.gov/eqcenter/shakemap/xml/schemas/shakemap.xsd"
    event_id="quakeml:quakeledger/peru_70000011"
    shakemap_id="quakeml:quakeledger/peru_70000011" code_version="shakyground 0.1" shakemap_version="1"
    process_timestamp="2022-11-11T09:09:41.989705Z" shakemap_originator="GFZ" map_status="RELEASED" shakemap_event_type="observed">
<ns1:event event_id="quakeml:quakeledger/peru_70000011"
    magnitude="9.0" depth="8.0"
    lat="-12.1908" lon="-77.9318" strike="329.0" rake="90.0" dip="20.0"
    event_timestamp="1746-10-28T00:00:00.000000Z" event_network="nan" event_description=""/>
<ns1:grid_specification 
    lon_min="-84.1666666667" lat_min="-18.383333333299998" lon_max="-71.6083333333" lat_max="-4.88333333333"
    nominal_lon_spacing="0.008333" nominal_lat_spacing="0.008333" nlon="1508" nlat="1621" regular_grid="1"/>
<ns1:event_specific_uncertainty name="pga" value="0.0" numsta=""/>
<ns1:event_specific_uncertainty name="pgv" value="0.0" numsta=""/>
<ns1:event_specific_uncertainty name="mi" value="0.0" numsta=""/>
<ns1:event_specific_uncertainty name="psa03" value="0.0" numsta=""/>
<ns1:event_specific_uncertainty name="psa10" value="0.0" numsta=""/>
<ns1:event_specific_uncertainty name="psa30" value="0.0" numsta=""/>
<ns1:grid_field index="1" name="LON" units="dd"/>
<ns1:grid_field index="2" name="LAT" units="dd"/>
<ns1:grid_field index="3" name="PGA" units="g"/>
<ns1:grid_field index="4" name="STDPGA" units="g"/>
<ns1:grid_field index="5" name="SA(0.3)" units="g"/>
<ns1:grid_field index="6" name="STDSA(0.3)" units="g"/>
<ns1:grid_field index="7" name="SA(1.0)" units="g"/>
<ns1:grid_field index="8" name="STDSA(1.0)" units="g"/>
<ns1:grid_data>-84.15833333329999 -4.88333333333 0.010866416 0.8052771 0.00825663 0.8454548 0.032887086 0.7543947
-84.15 -4.88333333333 0.010890583 0.8052771 0.008289215 0.8454548 0.032933135 0.7543947
-84.1416666667 -4.88333333333 0.010914789 0.8052771 0.008321901 0.8454548 0.03297922 0.7543947
-84.1333333333 -4.88333333333 0.010939032 0.8052771 0.008354686 0.8454548 0.033025347 0.7543947
-84.125 -4.88333333333 0.010963313 0.8052771 0.008387572 0.8454548 0.03307151 0.7543947
-84.1166666667 -4.88333333333 0.010987634 0.8052771 0.008420559 0.8454548 0.03311771 0.7543947
-84.1083333333 -4.88333333333 0.011011992 0.8052771 0.008453645 0.8454548 0.033163954 0.7543947
-84.1 -4.88333333333 0.011036388 0.8052771 0.008486832 0.8454548 0.03321023 0.7543947
-84.09166666670001 -4.88333333333 0.011060823 0.8052771 0.00852012 0.8454548 0.033256546 0.7543947
-84.0833333333 -4.88333333333 0.011085294 0.8052771 0.008553508 0.8454548 0.0333029 0.7543947
-84.075 -4.88333333333 0.011109805 0.8052771 0.008586997 0.8454548 0.03334929 0.7543947
-84.0666666667 -4.88333333333 0.011134353 0.8052771 0.008620586 0.8454548 0.033395723 0.7543947
-84.0583333333 -4.88333333333 0.0111589385 0.8052771 0.008654277 0.8454548 0.033442188 0.7543947
-84.05 -4.88333333333 0.011183562 0.8052771 0.008688069 0.8454548 0.03348869 0.7543947
-84.0416666667 -4.88333333333 0.011208222 0.8052771 0.008721962 0.8454548 0.03353523 0.7543947
-84.03333333329999 -4.88333333333 0.011232921 0.8052771 0.008755955 0.8454548 0.033581804 0.7543947
-84.025 -4.88333333333 0.011257657 0.8052771 0.008790049 0.8454548 0.03362842 0.7543947
-84.0166666667 -4.88333333333 0.011282431 0.8052771 0.008824245 0.8454548 0.033675067 0.7543947
-84.0083333333 -4.88333333333 0.011307241 0.8052771 0.008858542 0.8454548 0.033721752 0.7543947
-84.0 -4.88333333333 0.011332089 0.8052771 0.008892939 0.8454548 0.033768475 0.7543947
-83.9916666667 -4.88333333333 0.011356975 0.8052771 0.008927438 0.8454548 0.03381523 0.7543947
-83.9833333333 -4.88333333333 0.011381897 0.8052771 0.00896204 0.8454548 0.033862025 0.7543947
-83.975 -4.88333333333 0.011406857 0.8052771 0.008996741 0.8454548 0.03390885 0.7543947
-83.96666666670001 -4.88333333333 0.011431853 0.8052771 0.009031544 0.8454548 0.033955712 0.7543947
-83.9583333333 -4.88333333333 0.011456886 0.8052771 0.0090664495 0.8454548 0.03400261 0.7543947
-83.95 -4.88333333333 0.011481957 0.8052771 0.009101456 0.8454548 0.034049544 0.7543947
-83.9416666667 -4.88333333333 0.011507063 0.8052771 0.009136563 0.8454548 0.03409651 0.7543947
-83.9333333333 -4.88333333333 0.011532207 0.8052771 0.009171773 0.8454548 0.03414351 0.7543947
-83.925 -4.88333333333 0.011557387 0.8052771 0.009207083 0.8454548 0.034190547 0.7543947
-83.9166666667 -4.88333333333 0.011582604 0.8052771 0.0092424955 0.8454548 0.034237616 0.7543947
-83.90833333329999 -4.88333333333 0.0116078565 0.8052771 0.00927801 0.8454548 0.034284722 0.7543947
-83.9 -4.88333333333 0.011633146 0.8052771 0.009313625 0.8454548 0.03433186 0.7543947
-83.8916666667 -4.88333333333 0.011658471 0.8052771 0.009349342 0.8454548 0.034379028 0.7543947
-83.8833333333 -4.88333333333 0.011683833 0.8052771 0.009385161 0.8454548 0.03442623 0.7543947
-83.875 -4.88333333333 0.011709231 0.8052771 0.009421081 0.8454548 0.034473468 0.7543947
-83.8666666667 -4.88333333333 0.011734664 0.8052771 0.009457104 0.8454548 0.034520738 0.7543947
-83.8583333333 -4.88333333333 0.011760134 0.8052771 0.009493227 0.8454548 0.034568038 0.7543947
-83.85 -4.88333333333 0.011785639 0.8052771 0.009529453 0.8454548 0.034615375 0.7543947
-83.84166666670001 -4.88333333333 0.01181118 0.8052771 0.00956578 0.8454548 0.03466274 0.7543947
-83.8333333333 -4.88333333333 0.011836757 0.8052771 0.009602209 0.8454548 0.03471014 0.7543947
-83.825 -4.88333333333 0.011862369 0.8052771 0.00963874 0.8454548 0.03475757 0.7543947
-83.8166666667 -4.88333333333 0.011888016 0.8052771 0.009675371 0.8454548 0.03480503 0.7543947
-83.8083333333 -4.88333333333 0.011913699 0.8052771 0.009712106 0.8454548 0.034852523 0.7543947
-83.8 -4.88333333333 0.011939417 0.8052771 0.00974894 0.8454548 0.034900047 0.7543947
-83.7916666667 -4.88333333333 0.01196517 0.8052771 0.009785878 0.8454548 0.0349476 0.7543947
-83.78333333329999 -4.88333333333 0.011990958 0.8052771 0.009822916 0.8454548 0.034995187 0.7543947
-83.775 -4.88333333333 0.012016781 0.8052771 0.009860056 0.8454548 0.0350428 0.7543947
-83.7666666667 -4.88333333333 0.012042639 0.8052771 0.009897299 0.8454548 0.035090446 0.7543947
-83.7583333333 -4.88333333333 0.012068531 0.8052771 0.009934642 0.8454548 0.035138123 0.7543947
-83.75 -4.88333333333 0.012094458 0.8052771 0.009972087 0.8454548 0.03518583 0.7543947
-83.7416666667 -4.88333333333 0.012120419 0.8052771 0.010009633 0.8454548 0.03523356 0.7543947
-83.7333333333 -4.88333333333 0.012146414 0.8052771 0.010047281 0.8454548 0.035281327 0.7543947
-83.725 -4.88333333333 0.012172444 0.8052771 0.01008503 0.8454548 0.03532912 0.7543947
-83.71666666670001 -4.88333333333 0.012198508 0.8052771 0.01012288 0.8454548 0.03537694 0.7543947
-83.7083333333 -4.88333333333 0.012224606 0.8052771 0.010160833 0.8454548 0.03542479 0.7543947
-83.7 -4.88333333333 0.012250737 0.8052771 0.010198886 0.8454548 0.03547267 0.7543947
-83.6916666667 -4.88333333333 0.012276903 0.8052771 0.01023704 0.8454548 0.035520572 0.7543947
-83.6833333333 -4.88333333333 0.012303102 0.8052771 0.010275295 0.8454548 0.03556851 0.7543947
-83.675 -4.88333333333 0.012329335 0.8052771 0.0103136515 0.8454548 0.03561647 0.7543947
-83.6666666667 -4.88333333333 0.0123556005 0.8052771 0.01035211 0.8454548 0.035664458 0.7543947
-83.65833333329999 -4.88333333333 0.0123819 0.8052771 0.010390668 0.8454548 0.035712473 0.7543947
-83.65 -4.88333333333 0.012408232 0.8052771 0.010429327 0.8454548 0.035760514 0.7543947
-83.6416666667 -4.88333333333 0.012434598 0.8052771 0.010468088 0.8454548 0.035808586 0.7543947
-83.6333333333 -4.88333333333 0.012460996 0.8052771 0.010506948 0.8454548 0.03585668 0.7543947
-83.625 -4.88333333333 0.012487427 0.8052771 0.01054591 0.8454548 0.035904802 0.7543947
-83.6166666667 -4.88333333333 0.012513891 0.8052771 0.010584973 0.8454548 0.035952948 0.7543947
-83.6083333333 -4.88333333333 0.012540387 0.8052771 0.010624136 0.8454548 0.03600112 0.7543947
-83.6 -4.88333333333 0.012566916 0.8052771 0.0106633995 0.8454548 0.036049318 0.7543947
-83.59166666670001 -4.88333333333 0.012593476 0.8052771 0.010702763 0.8454548 0.036097538 0.7543947
-83.5833333333 -4.88333333333 0.012620069 0.8052771 0.010742227 0.8454548 0.036145788 0.7543947
-83.575 -4.88333333333 0.012646694 0.8052771 0.010781791 0.8454548 0.036194056 0.7543947
-83.5666666667 -4.88333333333 0.012673351 0.8052771 0.010821455 0.8454548 0.036242355 0.7543947
-83.5583333333 -4.88333333333 0.012700039 0.8052771 0.010861219 0.8454548 0.03629067 0.7543947
-83.55 -4.88333333333 0.012726759 0.8052771 0.010901082 0.8454548 0.036339015 0.7543947
-83.5416666667 -4.88333333333 0.01275351 0.8052771 0.010941046 0.8454548 0.03638738 0.7543947
-83.53333333329999 -4.88333333333 0.012780292 0.8052771 0.01098111 0.8454548 0.03643577 0.7543947
-83.525 -4.88333333333 0.012807106 0.8052771 0.011021272 0.8454548 0.036484182 0.7543947
-83.5166666667 -4.88333333333 0.01283395 0.8052771 0.011061534 0.8454548 0.036532618 0.7543947
-83.5083333333 -4.88333333333 0.012860825 0.8052771 0.011101896 0.8454548 0.036581073 0.7543947
-83.5 -4.88333333333 0.012887731 0.8052771 0.011142356 0.8454548 0.03662955 0.7543947
-83.4916666667 -4.88333333333 0.012914667 0.8052771 0.011182915 0.8454548 0.03667805 0.7543947
-83.4833333333 -4.88333333333 0.012941633 0.8052771 0.011223574 0.8454548 0.03672657 0.7543947
-83.475 -4.88333333333 0.0129686305 0.8052771 0.011264331 0.8454548 0.036775112 0.7543947
-83.46666666670001 -4.88333333333 0.0129956575 0.8052771 0.011305186 0.8454548 0.036823675 0.7543947
-83.4583333333 -4.88333333333 0.013022714 0.8052771 0.01134614 0.8454548 0.03687226 0.7543947
-83.45 -4.88333333333 0.0130498 0.8052771 0.011387193 0.8454548 0.036920864 0.7543947
-83.4416666667 -4.88333333333 0.013076916 0.8052771 0.011428343 0.8454548 0.036969487 0.7543947
-83.4333333333 -4.88333333333 0.013104062 0.8052771 0.011469591 0.8454548 0.037018128 0.7543947
-83.425 -4.88333333333 0.013131236 0.8052771 0.0115109375 0.8454548 0.03706679 0.7543947
-83.4166666667 -4.88333333333 0.013158439 0.8052771 0.011552381 0.8454548 0.03711547 0.7543947
-83.40833333329999 -4.88333333333 0.0131856715 0.8052771 0.011593922 0.8454548 0.03716417 0.7543947
-83.4 -4.88333333333 0.013212932 0.8052771 0.011635561 0.8454548 0.037212886 0.7543947
-83.3916666667 -4.88333333333 0.013240222 0.8052771 0.011677296 0.8454548 0.037261624 0.7543947
-83.3833333333 -4.88333333333 0.013267539 0.8052771 0.011719129 0.8454548 0.037310377 0.7543947
-83.375 -4.88333333333 0.013294886 0.8052771 0.011761058 0.8454548 0.037359145 0.7543947
-83.3666666667 -4.88333333333 0.01332226 0.8052771 0.011803084 0.8454548 0.03740793 0.7543947
-83.3583333333 -4.88333333333 0.013349662 0.8052771 0.011845206 0.8454548 0.037456736 0.7543947
-83.35 -4.88333333333 0.013377091 0.8052771 0.011887424 0.8454548 0.037505556 0.7543947
-83.34166666670001 -4.88333333333 0.013404548 0.8052771 0.011929738 0.8454548 0.037554394 0.7543947
-83.3333333333 -4.88333333333 0.013432032 0.8052771 0.011972148 0.8454548 0.037603244 0.7543947
-83.325 -4.88333333333 0.013459544 0.8052771 0.0120146535 0.8454548 0.037652113 0.7543947
-83.3166666667 -4.88333333333 0.013487082 0.8052771 0.012057254 0.8454548 0.037700996 0.7543947
-83.3083333333 -4.88333333333 0.013514647 0.8052771 0.012099951 0.8454548 0.03774989 0.7543947
-83.3 -4.88333333333 0.013542239 0.8052771 0.012142741 0.8454548 0.037798803 0.7543947
-83.2916666667 -4.88333333333 0.013569856 0.8052771 0.012185627 0.8454548 0.037847728 0.7543947
-83.28333333329999 -4.88333333333 0.0135975 0.8052771 0.012228606 0.8454548 0.037896667 0.7543947
-83.275 -4.88333333333 0.01362517 0.8052771 0.01227168 0.8454548 0.03794562 0.7543947
-83.2666666667 -4.88333333333 0.013652866 0.8052771 0.012314848 0.8454548 0.037994586 0.7543947
-83.2583333333 -4.88333333333 0.013680587 0.8052771 0.0123581095 0.8454548 0.038043562 0.7543947
-71.6416666667 -18.383333333299998 0.009512233 0.8052771 0.006510148 0.8454548 0.03024851 0.7543947
-71.6333333333 -18.383333333299998 0.009492428 0.8052771 0.0064857975 0.8454548 0.030209012 0.7543947
-71.625 -18.383333333299998 0.009472652 0.8052771 0.006461519 0.8454548 0.030169545 0.7543947
-71.6166666667 -18.383333333299998 0.0094529055 0.8052771 0.0064373114 0.8454548 0.030130109 0.7543947
-71.6083333333 -18.383333333299998 0.009433188 0.8052771 0.006413175 0.8454548 0.030090703 0.7543947
</ns1:grid_data>
</ns1:shakemap_grid>
`;