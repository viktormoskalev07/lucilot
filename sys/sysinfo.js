function sysStatUpd(j) {
    try {
        if (j.SYS) {
            var s = j.SYS;
            hS("sysUp", s.Uptime);
            hS("sysMf", s.MemFree);
            hS("sysMm", s.MemFreeMin);
            hS("sysMe", s.MemAllocErr);
            hS("sysXf", s.MemXFree)
            hS("sysXm", s.MemXFreeMin);
            hS("sysXe", s.MemXAllocErr);
            hS("sysCt", s.MemCardTotal);
            hS("sysCf", s.MemCardFree);
        }
        if (j.BUF) {
            var b = j.BUF;
            hS("tB", b.Avail);
            hS("uB", b.Used);
            hS("mB", b.Max);
            hS("eB", b.Err);
            hS("iB", b.Illegal);
        }
        if (j.BUFPOOL) {
            var b = j.BUFPOOL;
            hS("tP", b.Avail);
            hS("uP", b.Used);
            hS("mP", b.Max);
            hS("eP", b.Err);
            hS("iP", b.Illegal);
        }
        if (j.TIMER) {
            var t = j.TIMER;
            hS("tT", t.Avail);
            hS("uT", t.Used);
            hS("mT", t.Max);
            hS("eT", t.Err);
            hS("iT", t.Illegal);
        }
        if (j.TCPMSG) {
            var t = j.TCPMSG;
            hS("tTM", t.Avail);
            hS("uTM", t.Used);
            hS("mTM", t.Max);
            hS("eTM", t.Err);
            hS("iTM", t.Illegal);
        }
        if (j.TCPSEG) {
            var t = j.TCPSEG;
            hS("tTS", t.Avail);
            hS("uTS", t.Used);
            hS("mTS", t.Max);
            hS("eTS", t.Err);
            hS("iTS", t.Illegal);
        }
        if (j.TCPPCB) {
            var t = j.TCPPCB;
            hS("tTP", t.Avail);
            hS("uTP", t.Used);
            hS("mTP", t.Max);
            hS("eTP", t.Err);
            hS("iTP", t.Illegal);
        }
        if (j.TCPLSTN) {
            var t = j.TCPLSTN;
            hS("tTPL", t.Avail);
            hS("uTPL", t.Used);
            hS("mTPL", t.Max);
            hS("eTPL", t.Err);
            hS("iTPL", t.Illegal);
        }
        if (j.ALTCPPCB) {
            var t = j.ALTCPPCB;
            hS("tATP", t.Avail);
            hS("uATP", t.Used);
            hS("mATP", t.Max);
            hS("eATP", t.Err);
            hS("iATP", t.Illegal);
        }
        if (j.UDPPCB) {
            var t = j.ALTCPPCB;
            hS("tUP", t.Avail);
            hS("uUP", t.Used);
            hS("mUP", t.Max);
            hS("eUP", t.Err);
            hS("iUP", t.Illegal);
        }
        if (j.NETCONN) {
            var n = j.NETCONN;
            hS("tN", n.Avail);
            hS("uN", n.Used);
            hS("mN", n.Max);
            hS("eN", n.Err);
            hS("iN", n.Illegal);
        }
        if (j.NETBUF) {
            var n = j.NETBUF;
            hS("tNB", n.Avail);
            hS("uNB", n.Used);
            hS("mNB", n.Max);
            hS("eNB", n.Err);
            hS("iNB", n.Illegal);
        }
        if (j.FRAGBUF) {
            var f = j.FRAGBUF;
            hS("tF", f.Avail);
            hS("uF", f.Used);
            hS("mF", f.Max);
            hS("eF", f.Err);
            hS("iF", f.Illegal);
        }

        if (j.IGMP) {
            var i = j.IGMP;
            hS("tI", i.Avail);
            hS("uI", i.Used);
            hS("mI", i.Max);
            hS("eI", i.Err);
            hS("iI", i.Illegal);
        }
        if (j.REASDATA) {
            var r = j.REASDATA;
            hS("tR", r.Avail);
            hS("uR", r.Used);
            hS("mR", r.Max);
            hS("eR", r.Err);
            hS("iR", r.Illegal);
        }
    } catch (e) {
        console.log(e);
    }
}


async function sysStatGet(t) {
    let rq = { Cmd:'SysStatisticGet',
            SessionId:sIdG(),
            Types:t};
    return await rqp(rq, sysStatUpd);
}


async function sysStatGetAll() {  
    return new Promise(async(res, rej) => {
        await sysStatGet(["SYS"])
        .then(async(j) => {await sysStatGet(["BUF", "BUFPOOL", "TIMER", "TCPMSG", "TCPSEG", "TCPLSTN"])})
        .then(async(j) => {await sysStatGet(["TCPPCB", "REASDATA", "NETCONN", "NETBUF", "IGMP", "FRAGBUF"])})
        .then(async(j) => {await sysStatGet(["ALTCPPCB", "UDPPCB"])})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}

function sysIdUpd(j) {
    try {
        hS("sysSnr", j.Snr);
        hS("sysHwr", j.HwRev);
        hS("sysFwr", j.FwRev);

        if (j.Slots.length) {
            
            hS("sysCl0", j.Slots[0].ClassName);
            hS("sysTy0", j.Slots[0].TypeName);
            hS("sysRv0", j.Slots[0].HwSubRev);
        }
        if (j.Slots.length > 1) {
            hS("sysCl1", j.Slots[1].ClassName);
            hS("sysTy1", j.Slots[1].TypeName);
            hS("sysRv1", j.Slots[1].HwSubRev);
        } else {
            hS("sysCl1", "NONE");
        }
    } catch (e) {
        console.log(e);
    }
}


function sysSvcStateUpd(j)
{
    try {
        if (j.NET) {
            hS("netSvc", j.NET.SvcState);
            hS("netMod", j.NET.ModState);
            hS("netRst", j.NET.Reset);
        }
        if (j.CMD) {
            hS("cmdSvc", j.CMD.SvcState);
            hS("cmdMod", j.CMD.ModState);
            hS("cmdRst", j.CMD.Reset);
        }
        if (j.FILE) {
            hS("fileSvc", j.FILE.SvcState);
            hS("fileMod", j.FILE.ModState);
            hS("fileRst", j.FILE.Reset);
        }
        if (j.SLOG) {
            hS("slogSvc", j.SLOG.SvcState);
            hS("slogMod", j.SLOG.ModState);
            hS("slogRst", j.SLOG.Reset);
        }
        if (j.JSON) {
            hS("jsonSvc", j.JSON.SvcState);
            hS("jsonMod", j.JSON.ModState);
            hS("jsonRst", j.JSON.Reset);
        }
        if (j.FRM) {
            hS("frmSvc", j.FRM.SvcState);
            hS("frmMod", j.FRM.ModState);
            hS("frmRst", j.FRM.Reset);
        }
        if (j.CLK) {
            hS("clkSvc", j.CLK.SvcState);
            hS("clkMod", j.CLK.ModState);
            hS("clkRst", j.CLK.Reset);
        }
        if (j.FTP) {
            hS("ftpSvc", j.FTP.SvcState);
            hS("ftpMod", j.FTP.ModState);
            hS("ftpRst", j.FTP.Reset);
        }
        if (j.MQTT){
            hS("mqttSvc", j.MQTT.SvcState);
            hS("mqttMod", j.MQTT.ModState);
            hS("mqttRst", j.MQTT.Reset);
        }
        if (j.LOG) {
            hS("logSvc", j.LOG.SvcState);
            hS("logMod", j.LOG.ModState);
            hS("logRst", j.LOG.Reset);
        }
        if (j.HTTP) {
            hS("httpSvc", j.HTTP.SvcState);
            hS("httpMod", j.HTTP.ModState);
            hS("httpRst", j.HTTP.Reset);
        }
        if (j.MBUS) {
            hS("mbSvc", j.MBUS.SvcState);
            hS("mbMod", j.MBUS.ModState);
            hS("mbRst", j.MBUS.Reset);
        }
    } catch (e) {
        console.log(e);
    }
}

async function sysSvcStateGet(sn)
{
    let rq = {Cmd:"SysSvcStateGet", SessionId:sIdG(), "SvcNames":sn};
    return await rqp(rq, sysSvcStateUpd);
}

async function sysSvcStateGetAll() {
    return new Promise(async(res, rej) => {
        await sysSvcStateGet(["NET", "CLK", "CMD", "FILE", "LOG", "SLOG"])
        .then(async(j) => {await sysSvcStateGet(["JSON", "FRM", "FTP", "HTTP", "MQTT", "MBUS"])})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}

async function sysInfoInit() {
    return new Promise(async(res, rej) => {
        await sysStatGetAll()
        .then(async() => {await sysIdGet(1)})
        .then(async() => {await sysSvcStateGetAll()})
        .then(() => {
            res();
        }).catch((m) => {
            rej(m);
        });
    });
}