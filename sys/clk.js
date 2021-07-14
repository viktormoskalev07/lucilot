function clkCfgUpd(j){
    try {
        vS("clkDate", j.Date);
        vS("clkTime", j.Time);
        cS("clkDst", j.Dst);
        siS("clkTz", tzIdxGet(j.Zone));
        vS("clkSrv", j.Server);
        vS("clkSyncInt", j.Interval);
        cS("clkSntpEn", j.Enable);
        cS("clkSntpSyncEn", j.Sync);
    } catch(e) {
        console.log(e);
    }
}

async function clkCfgGet() {
    let rq = {Cmd:"ClkCfgGet", SessionId:sIdG()};
    return rqp(rq, clkCfgUpd);
}

async function clkCfgSet() {
    let rq = {Cmd:"ClkCfgSet", SessionId:sIdG(),
        Server:vG("clkSrv"),
        Zone:tzIdGet(siG("clkTz")),
        Interval:parseInt(vG("clkSyncInt", 10)),
        Enable:cG("clkSntpEn"),
        Sync:cG("clkSntpSyncEn")};
    return rqp(rq, null);
}

async function clkTimeSet() {
    let q, rq = {Cmd:"ClkCfgSet", SessionId:sIdG()};
    
    try {
        rq["Date"] = eGetById("clkDate").value;
        rq["Time"] = eGetById("clkTime").value;
    } catch (e) {
        console.log(mExcept(rq, e));
        q = 1;
    }

    if (!q) {
        return await rqp(rq, null);
    }
}

function clkStateUpd(j) {
    try {
        hS("clkStSvc", j.SvcState);
        hS("clkStMod", j.ModState);
        hS("clkStRst", j.Reset);
        hS("clkStSync", j.Sync);
        hS("clkStValid", j.Valid);
    } catch (e) {
        console.log(e);
    }
}

async function clkStateGet() {
    let rq = {Cmd:"ClkStateGet", SessionId:sIdG()};
    return rqp(rq, clkStateUpd);
}

async function clkInit() {
    btnEvAdd("clkBtCfg", async() => {
        loadingpopup();
        await clkCfgSet().then((j) => {
            donepopup("Saved");
        }).catch((m) => {
            errpopup(m);
     
        })
    });

    btnEvAdd("clkBtSet", async() => {
        loadingpopup();
        await clkTimeSet().then((j) => {
            donepopup("Saved");
        }).catch((m) => {
            errpopup(m);
        })
    });

    return new Promise(async(res, rej) => {
        await clkStateGet()
        .then(async(j) => {await clkCfgGet()})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}