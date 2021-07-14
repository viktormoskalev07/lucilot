function jsonCfgUpd(j) {
    let i;
    try {
        cS("jEn", j.Enable);
        cS("jIPv4", j.EnIPv4);
        cS("jIPv6", j.EnIPv6);
        vS("jPort", j.Port);

        i = 0;
        if (j.AuthMode == "Srv")
            i = 1;
        siS("jAuth", i);

        if (j.CertId != 255) {
            vS("jCrtId", j.CertId);
            cS("jCrtEn", true);
        }
        if (j.CaId != 255) {
            vS("jCaId", j.CaId);
            cS("jCaEn", true);
        }
        if (j.PkId != 255) {
            vS("jPkId", j.PkId);
            cS("jPkEn", true);
        }
    } catch(e) {
        console.log(e);
    }
}

async function jsonCfgGet() {
    let rq = {Cmd:"JsonCfgGet", SessionId:sIdG()};
    return await rqp(rq, jsonCfgUpd);
}

async function jsonCfgSet() {
    let rq = {Cmd:"JsonCfgSet",  SessionId:sIdG(),
        Port:vG("jPort"),
        Enable:cG("jEn"),
        EnIPv4:cG("jIPv4"),
        EnIPv6:cG("jIPv6")};

    if (siG("jAuth") == 1)
        rq["AuthMode"] = "Srv";
    else
        rq["AuthMode"] = "Disable";

    if (cG("jCrtEn") == true)
        rq["CertId"] = vG("jCrtId");
    else
        rq["CertId"] = 255;

    if (cG("jCaEn") == true)
        rq["CaId"] = vG("jCaId");
    else
        rq["CaId"] = 255;

    if (cG("jPkEn") == true)
        rq["PkId"] = vG("jPkId");
    else
        rq["PkId"] = 255;

    return await rqp(rq, null);
}

function jsonStateUpd(j) {
    try {
        hS("jStSvc", j.SvcState);
        hS("jStMod", j.ModState);
        hS("jStRst", j.Reset);
    } catch(e) {
        console.log(e);
    }
}

async function jsonStateGet() {
    let rq = {Cmd:"JsonStateGet", SessionId:sIdG()};
    return await rqp(rq, jsonStateUpd);
}

async function jsonInit() {
    btnEvAdd("jBtCfg", async() => {
        loadingpopup();
        await jsonCfgSet().then((j) => {
            donepopup("Saved");
        }).catch((m) => {
            errpopup(m);
        })
    });
    
    return new Promise(async(res, rej) => {
        await jsonStateGet()
        .then(async(j) => {await jsonCfgGet()})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}