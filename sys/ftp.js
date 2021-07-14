function ftpCfgUpd(j) {
    let i;
    try {
        cS("ftpEn", j.Enable);
        cS("ftpIPv4", j.EnIPv4);
        cS("ftpIPv6", j.EnIPv6);
        vS("ftpPort", j.Port);

        i = 0;
        if (j.Mode == "Explicit")
            i = 1;
        if (j.Mode == "Implicit")
            i = 2;
        siS("ftpMode", i);

        i = 0;
        if (j.AuthMode == "Srv")
            i = 1;
        siS("ftpAuth", i);

        if (j.CertId != 255) {
            vS("ftpCrtId", j.CertId);
            cS("ftpCrtEn", true);
        }
        if (j.CaId != 255) {
            vS("ftpCaId", j.CaId);
            cS("ftpCaEn", true);
        }
        if (j.PkId != 255) {
            vS("ftpPkId", j.PkId);
            cS("ftpPkEn", true);
        }
    } catch(e) {
        console.log(e);
    }
}

async function ftpCfgGet() {
    let rq = {Cmd:"FtpCfgGet", SessionId:sIdG()};
    return await rqp(rq, ftpCfgUpd);
}

async function ftpCfgSet() {
    let rq = {Cmd:"FtpCfgSet",  SessionId:sIdG(),
        Port:vG("ftpPort"),
        Enable:cG("ftpEn"),
        EnIPv4:cG("ftpIPv4"),
        EnIPv6:cG("ftpIPv6")};

    if (siG("ftpMode") == 1)
        rq["Mode"] = "Explicit";
    else if (siG("ftpMode") == 2)
        rq["Mode"] = "Implicit";
    else
        rq["Mode"] = "Standard";

    if (siG("ftpAuth") == 1)
        rq["AuthMode"] = "Srv";
    else
        rq["AuthMode"] = "Disable";

    if (cG("ftpCrtEn") == true)
        rq["CertId"] = vG("ftpCrtId");
    else
        rq["CertId"] = 255;

    if (cG("ftpCaEn") == true)
        rq["CaId"] = vG("ftpCaId");
    else
        rq["CaId"] = 255;

    if (cG("ftpPkEn") == true)
        rq["PkId"] = vG("ftpPkId");
    else
        rq["PkId"] = 255;

    return await rqp(rq, null);
}

function ftpStateUpd(j) {
    try {
        hS("ftpStSvc", j.SvcState);
        hS("ftpStMod", j.ModState);
        hS("ftpStRst", j.Reset);
    } catch(e) {
        console.log(e);
    }
}

async function ftpStateGet() {
    let rq = {Cmd:"FtpStateGet", SessionId:sIdG()};
    return await rqp(rq, ftpStateUpd);
}

async function ftpInit() {
    btnEvAdd("ftpBtCfg", async() => {
        loadingpopup();
        await ftpCfgSet().then((j) => {
            donepopup("Saved");
        }).catch((m) => {
            errpopup(m);
        })
    });
    
    return new Promise(async(res, rej) => {
        await ftpStateGet()
        .then(async(j) => {await ftpCfgGet()})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}