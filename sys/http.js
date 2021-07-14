// HTTP
function httpCfgUpd(j) {
    let i = 0;

    try {
        cS("httpEn", j.Enable);
        cS("httpIPv4", j.EnIPv4);
        cS("httpIPv6", j.EnIPv6);
        vS("httpPort", j.Port);

        if (j.AuthMode == "Srv")
            i = 1;	
        siS("httpAuth", i);

        if (j.CertId != 255) {
            vS("httpCrtId", j.CertId);
            cS("httpCrtEn", true);
        }
        if (j.CaId != 255) {
            vS("httpCaId", j.CaId);
            cS("httpCaEn", true);
        }
        if (j.PkId != 255) {
            vS("httpPkId", j.PkId);
            cS("httpPkEn", true);
        }
    } catch(e) {
        console.log(e);
    }
}

async function httpCfgGet() {
    let rq = {Cmd:"HttpCfgGet", SessionId:sIdG()};
    return await rqp(rq, httpCfgUpd);
}

async function httpCfgSet() {
    let rq = {Cmd:"HttpCfgSet",  SessionId:sIdG(),
        Port:vG("httpPort"),
        Enable:cG("httpEn"),
        EnIPv4:cG("httpIPv4"),
        EnIPv6:cG("httpIPv6")};

    if (siG("httpAuth") == 1)
        rq["AuthMode"] = "Srv";
    else
        rq["AuthMode"] = "Disable";

    if (cG("httpCrtEn") == true)
        rq["CertId"] = vG("httpCrtId");
    else
        rq["CertId"] = 255;

    if (cG("httpCaEn") == true)
        rq["CaId"] = vG("httpCaId");
    else
        rq["CaId"] = 255;

    if (cG("httpPkEn") == true)
        rq["PkId"] = vG("httpPkId");
    else
        rq["PkId"] = 255;

    return await rqp(rq, null);
}

function httpStateUpd(j) {
    try {
        hS("httpStSvc", j.SvcState);
        hS("httpStMod", j.ModState);
        hS("httpStRst", j.Reset);
    } catch(e) {
        console.log(e);
    }
}

async function httpStateGet() {
    let rq = {Cmd:"HttpStateGet", SessionId:sIdG()};
    return await rqp(rq, httpStateUpd);
}

async function httpInit() {
    btnEvAdd("httpBtCfg", async() => {
        loadingpopup();
        await httpCfgSet().then((j) => {
            donepopup("Saved");
        }).catch((m) => {
            errpopup(m);
        })
    });
    
    return new Promise(async(res, rej) => {
        await httpStateGet()
        .then(async(j) => {await httpCfgGet()})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}