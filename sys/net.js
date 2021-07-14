function netCfgUpd(j) {
    try {
        vS("netIp", j.IpV4Addr);
        vS("netGw", j.IpV4Gw);
        vS("netSn", j.IpV4Sn);
        vS("netDns", j.IpV4Dns);
        vS("netHost", j.Host);
        vS("netDhTmo", j.DhcpTmo);
        cS("netEnDhcp", j.Dhcp);
        cS("netEnDns", j.Dns);
        cS("netEnMDNS", j.Mdns);
        cS("netEnNB", j.NetBios);
        cS("netEnIPv6", j.IpV6);

        cS("netEn10hdx", j.En10hdx);
        cS("netEn10fdx", j.En10fdx);
        cS("netEn100hdx", j.En100hdx);
        cS("netEn100fdx", j.En100fdx);
    } catch(e) {
        console.log(e);
    }
}

async function netCfgGet() {
    let rq = {Cmd:"NetCfgGet", SessionId:sIdG()};
    return await rqp(rq, netCfgUpd);
}

async function netCfgSet() {
    let q, rq = {Cmd:"NetCfgSet",
        SessionId:sIdG(),
        IpV4Addr:vG("netIp"),
        IpV4Gw:vG("netGw"),
        IpV4Sn:vG("netSn"),
        IpV4Dns:vG("netDns"),
        Host:vG("netHost"),
        DhcpTmo:vG("netDhTmo"),
        Dhcp:cG("netEnDhcp"),
        Dns:cG("netEnDns"),
        Mdns:cG("netEnMDNS"),
        NetBios:cG("netEnNB"),
        IpV6:cG("netEnIPv6"),
        En10hdx:cG("netEn10hdx"),
        En10fdx:cG("netEn10fdx"),
        En100hdx:cG("netEn100hdx"),
        En100fdx:cG("netEn100fdx")};

    return new Promise(async(res, rej) => {
        if (!valC("netIp") || !valC("netGw") || !valC("netSn") || !valC("netDns"))
            rej(mExcept(rq, "Invalid"));

        await r(rq).then((j) => {
            if (j.Status == "OK")
                res();
            else
                rej(mStat(rq, j));
        }).catch((m) => {
            rej(mExcept(rq, m));
        })
    });
}

function netStateUpd(j) {
    var t = "";
    try {
        hS("netMac", j.Mac);
        hS("netSvc", j.SvcState);
        hS("netMod", j.ModState);
        hS("netRst", j.Reset);
        hS("netLink", j.ActLink);
        hS("netIp4St", j.IpV4Addr);
        for(var i = 0; i < j.IpV6Addr.length; i++) {
            if (i)
                t += "\n";
            t += j.IpV6Addr[i];   
        }
        hS("netIp6St", t);
    } catch (e) {
        console.log(e);
    }
}

async function netStateGet() {
    let rq = {Cmd:"NetStateGet", SessionId:sIdG()};
    return await rqp(rq, netStateUpd);  
}


function netTxStatUpd(j) {
    try {
        hS("nSTxFrmOk", j.TX.FrmOk);
        hS("nSTxBcOk", j.TX.BcOk);
        hS("nSTxMcOk", j.TX.McOk);
        hS("nSTxUErr", j.TX.UndErr);
        hS("nSTxCErr", j.TX.ColErr);
        hS("nSTxOErr", j.TX.OthErr);
    } catch (e) {
        console.log(e);
    }
}


async function netTxStatGet() {
    let rq = {Cmd:"NetStatisticGet", Types:["TX"], SessionId:sIdG()};
    return await rqp(rq, netTxStatUpd);
}


function netRxStatUpd(j) {
    try {
        hS("nSRxFrmOk", j.RX.FrmOk);
        hS("nSRxBcOk", j.RX.BcOk);
        hS("nSRxMcOk", j.RX.McOk);
        hS("nSRxBcOk", j.RX.BcOk);
        hS("nSRxOvfErr", j.RX.OvfErr);
        hS("nSRxJErr", j.RX.JabErr);
        hS("nSRxSErr", j.RX.SmbErr);
        hS("nSRxFcsErr", j.RX.FcsErr);
        hS("nSRxFldErr", j.RX.FldErr);
        hS("nSRxCErr", j.RX.CrcErr);
        hS("nSRxOthErr", j.RX.OthErr);
    } catch(e) {
        console.log(e);
    }
}

async function netRxStatGet() {
    let rq = {Cmd:"NetStatisticGet", Types:["RX"], SessionId:sIdG()};
    return await rqp(rq, netRxStatUpd);
}

async function netInit() {
    btnEvAdd("netBtCfg", async () => {
        loadingpopup();
        await netCfgSet().then(() => {
            donepopup("Saved");
        }).catch((m) => {
            errpopup(m);
        })
     });

    return new Promise(async(res, rej) => {
        await netCfgGet()
        .then(async(j) => {await netStateGet()})
        .then(async(j) => {await netTxStatGet()})
        .then(async(j) => {await netRxStatGet()})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });   
}