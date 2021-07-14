function accListUpd(j, id) {
    var o;
    
    try {
        for(var i = 0; i < j.Accounts.length; i++) {
            o = document.createElement("option");
            o.value = j.Accounts[i].Id;
            o.text = j.Accounts[i].Name;
            eGetById("accList").add(o, null);
        }
    } catch(e) {
        console.log(e);
    }
}



function accGetUpd(j) {
    try {
        hS("accN", j.Name);
        if (j.Access & accEn)
            cS("accREn", true);
        if (j.Access & accFtpRw)
            cS("accRFtp", true);
        if (j.Access & accIo)
            cS("accRIo", true);
        if (j.Access & accIoCfg)
            cS("accRIoCfg", true);
        if (j.Access & accAdmin)
            cS("accRAdmin", true);
    } catch (e) {
        console.log(e);
    }
}

async function accGet() {
    var e = eGetById("accList");
    var rq = {Cmd:"AccGet", SessionId:sIdG()};
    rq["Name"] = e.options[e.selectedIndex].text;

    try {
        hS("accN", "");
        vS("accP", "");
        vS("accCP", "");
        cS("accREn", false);
        cS("accRFtp", false);
        cS("accRIo", false);
        cS("accRIoCfg", false);
        cS("accRAdmin", false);
    } catch (e) {
        console.log(e);
    }
    return await rqp(rq, accGetUpd);
}

async function accSet() {
    var e = eGetById("accList")
    var acc;
    var rq = {Cmd:"AccSet", SessionId:sIdG()};
    rq["Name"] = e.options[e.selectedIndex].text;

    if (cG("accREn"))
        acc |= accEn;
    if (cG("accRFtp"))
        acc |= accFtpRw;
    if (cG("accRIo"))
        acc |= accIo;
    if (cG("accRIoCfg"))
        acc |= accIoCfg;
    if (cG("accRAdmin"))
        acc |= accAdmin;
    rq["Access"] = acc;

    if (vG("accP").length)
        rq["Pass"] = vG("accP");

    if ((e.selectedIndex === 0) && (vG("accCP").length))
        rq["CopyPass"] = vG("accCP");

    return await rqp(rq, null);
}

async function accListGet(){
    let rq = {Cmd:"AccListGet", SessionId:sIdG()};

    return new Promise(async(res,rej) => {
        try {
            l = eGetById("accList").options.length - 1;
            for (i = l; i >= 0; i--) {
                eGetById("accList").remove(i);
            }
        } catch(e) {
            console.log(e);
        }

        await rqp(rq, accListUpd).then((j) => {
            eGetById("accList").selectedIndex = 0;
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}

async function accCreate() {
    return new Promise(async(res,rej) => {
        let rq = {Cmd:"AccCreate", SessionId:sIdG()};
        rq["Name"] = vG("accCN");

        await rqp(rq, null).then(async (j) => {
            await accListGet().then((j) => {
                res();
            }).catch((m) => {
                rej(m);
            })
        }).catch((m) => {
            rej(m);
        })
    });
}

async function accDel() {
    var e = eGetById("accList")
    return new Promise(async(res,rej) => {
        let rq = {Cmd:"AccDelete", SessionId:sIdG()};
        try{
            rq["Name"] = e.options[e.selectedIndex].text;
        } catch(m){console.log(m)}
        await rqp(rq, null).then(async(j) => {
            await accListGet().then((j) => {
                res();
            }).catch((m) => {
                rej(m);
            })
        }).catch((m) => {
           
            rej(mExcept(rq, m));
        })
    });
}


async function accInit() {
    return new Promise(async(res, rej) => {
        btnEvAdd("accBtDel", async() => {
            loadingpopup();
            await accDel().then(() => {
                donepopup("Deleted");
            }).catch((m) => {
                errpopup(m);
            })
        });

        btnEvAdd("accBtCreate", async() => {
            loadingpopup();
            await accCreate().then(() => {
                donepopup("Created");
            }).catch((m) => {
                errpopup(m);
            })
        });

        btnEvAdd("accBtUpd", async() => {
            loadingpopup();
            await accSet().then((j) => {
                donepopup("Updated");
            }).catch((m) => {
                errpopup(m);
            })
        });

        eGetById("accList").addEventListener("change", async() => {
            await accGet().then((j) => {
            }).catch((m) => {
                errpopup(m);
            })
        });

        await accListGet()
        .then(async() => {
            await accGet().then((j) => {
                res();
            }).catch((m) => {
                rej(m);
            })
        }).catch((m) => {
            rej(m);
        })
    });
}