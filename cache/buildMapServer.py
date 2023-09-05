import json
import os



dataRootDir = "quakeml:quakeledger/"
dirs = os.listdir(dataRootDir)
dirPaths = [os.path.join(dataRootDir, dir) for dir in dirs]



damageStyling = f"""
    CLASS
    END
"""


for path in dirPaths:
    eqId = path[-9:]
    weightedDamageFiedlName = "weighed_damage"

    # update eq-damage
    eqDmgFile = os.path.join(path, "eqDamageRef.json")
    fh = open(eqDmgFile)
    eqDmgData = json.read(fh)

    for feature in eqDmgData["features"]:
        # calc weighted damage
        # discard all other data
        pass

    eqDmgTargetFile = os.path.join(path, "eqDamageRefUpdated.json")
    fh = open(eqDmgTargetFile, "w")
    json.dump(eqDmgData, fh)

    # update ts-damage
    tsDmgFile = os.path.join(path, "tsDamageRef.json")
    fh = open(tsDmgFile)
    tsDmgData = json.read(fh)

    for feature in tsDmgData["features"]:
        pass

    tsDmgTargetFile = os.path.join(path, "tsDamageRefUpdated.json")
    fh = open(tsDmgTargetFile, "w")
    json.dump(tsDmgData, fh)


    eqDmgLayerTemplate = f"""
        MAP
            IMAGETYPE      PNG
            EXTENT         -12.44 -77.47 -11.76 -76.63
            SIZE           400 300
            SHAPEPATH      "./"     
            IMAGECOLOR     255 255 255

            LAYER 

                NAME            "eq_damage_{eqId}"
                TYPE            POLYGON
                STATUS          ON
                CONNECTIONTYPE  OGR
                CONNECTION      "eqDamageRefUpdated.json"
                DATA            "eqDamageRefUpdated"

                CLASSITEM "{weightedDamageFiedlName}"
                {styling}

            END
        END
    """
    fh = open(os.path.join(path, "eq_damage.map"), "w")
    fh.write(eqDmgLayerTemplate)


    tsDmgLayerTemplate = f"""
        MAP
            IMAGETYPE      PNG
            EXTENT         -12.44 -77.47 -11.76 -76.63
            SIZE           400 300
            SHAPEPATH      "./"     
            IMAGECOLOR     255 255 255
        
            LAYER 

                NAME            "ts_damage_{eqId}"
                TYPE            POLYGON
                STATUS          ON
                CONNECTIONTYPE  OGR
                CONNECTION      "tsDamageRefUpdated.json"
                DATA            "tsDamageRefUpdated"

                CLASSITEM "{weightedDamageFiedlName}"
                {styling}

            END
        END
    """
    fh = open(os.path.join(path, "ts_damage.map"), "w")
    fh.write(tsDmgLayerTemplate)

