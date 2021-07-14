function frameCfgUpd(j) {
    let i;
    try {
        cS("fEn", j.Enable);
        cS("fIPv4", j.EnIPv4);
        cS("fIPv6", j.EnIPv6);
        vS("fPort", j.Port);

        if (j.AuthMode == "Srv")
            i = 1;
        siS("fAuth", i);

        if (j.CertId != 255) {
            vS("fCrtId", j.CertId);
            cS("fCrtEn", true);
        }
        if (j.CaId != 255) {
            vS("fCaId", j.CaId);
            cS("fCaEn", true);
        }
        if (j.PkId != 255) {
            vS("fPkId", j.PkId);
            cS("fPkEn", true);
        }
    } catch(e) {
        console.log(e);
    }
}

async function frameCfgGet() {
    let rq = {Cmd:"FrameCfgGet", SessionId:sIdG()};
    rqp(rq, frameCfgUpd);
}

async function frameCfgSet() {
    let rq = {Cmd:"FrameCfgSet",  SessionId:sIdG(),
        Port:vG("fPort"),
        Enable:cG("fEn"),
        EnIPv4:cG("fIPv4"),
        EnIPv6:cG("fIPv6")};

    if (siG("fAuth") == 1)
        rq["AuthMode"] = "Srv";
    else
        rq["AuthMode"] = "Disable";

    if (cG("fCrtEn") == true)
        rq["CertId"] = vG("fCrtId");
    else
        rq["CertId"] = 255;

    if (cG("fCaEn") == true)
        rq["CaId"] = vG("fCaId");
    else
        rq["CaId"] = 255;

    if (cG("fPkEn") == true)
        rq["PkId"] = vG("fPkId");
    else
        rq["PkId"] = 255;

    return await rqp(rq, null);
}

function frameStateUpd(j) {
    try {
        hS("fStSvc", j.SvcState);
        hS("fStMod", j.ModState);
        hS("fStRst", j.Reset);
    } catch(e) {
        console.log(e);
    }
}

async function frameStateGet() {
    let rq = {Cmd:"FrameStateGet", SessionId:sIdG()};
    return await rqp(rq, frameStateUpd);
}

async function frameInit() {
    btnEvAdd("fBtCfg", async() => {
        loadingpopup();
        await frameCfgSet().then((j) => {
            donepopup("Saved");
        }).catch((m) => {
            errpopup(m);
        })
    });
    
    return new Promise(async(res, rej) => {
        await frameStateGet()
        .then(async(j) => {await frameCfgGet()})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}