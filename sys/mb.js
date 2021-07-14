function mbCfgUpd(j) {
    let i;
    try {
        cS("mbEn", j.Enable);
        cS("mbIPv4", j.EnIPv4);
        cS("mbIPv6", j.EnIPv6);
        vS("mbPort", j.Port);
    } catch(e) {
        console.log(e);
    }
}
async function mbCfgGet() {
    let rq = {Cmd:"MbCfgGet", SessionId:sIdG()};

    return await rqp(rq, mbCfgUpd);
}


async function mbCfgSet() {
    let rq = {Cmd:"MbCfgSet",  SessionId:sIdG(),
    Port:vG("mbPort"),
    Enable:cG("mbEn"),
    EnIPv4:cG("mbIPv4"),
    EnIPv6:cG("mbIPv6")};

    return await rqp(rq, null);
}

function mbStateUpd(j) {
    try {
        hS("mbStSvc", j.SvcState);
        hS("mbStMod", j.ModState);
        hS("mbStRst", j.Reset);
    } catch(e) {
        console.log(e);
    }
}

async function mbStateGet() {
    let rq = {Cmd:"MbStateGet", SessionId:sIdG()};
    return await rqp(rq, mbStateUpd);
}

async function mbInit() {
    btnEvAdd("mbBtCfg", async() => {
        loadingpopup();
        await mbCfgSet().then((j) => {
            donepopup("Saved");
        }).catch((m) => {
            errpopup(m);
        })
    });
    
    return new Promise(async(res, rej) => {
        await mbStateGet()
        .then(async() => {await mbCfgGet()})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}