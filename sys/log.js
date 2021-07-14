function logCfgUpd(j) {
    try {
        vS("logInt", j.Interval);
        vS("logCap", j.LimitCap);
        vS("logSep", j.Sep);
        cS("logEn", j.Enable);
    } catch (e) {
        console.log(e);
    }
}

async function logCfgGet() {
    let rq = {Cmd:"LogCfgGet", SessionId:sIdG()};
    return await rqp(rq, logCfgUpd);
}

async function logCfgSet() {
    let rq = {Cmd:"LogCfgSet", SessionId:sIdG(),
    "Interval":vG("logInt"),
    "LimitCap":vG("logCap"),
    "Sep":vG("logSep"),
    "Enable":cG("logEn")};

    return await rqp(rq, null);
}


function logStateUpd(j) {
    try {
        hS("logStSvc", j.SvcState);
        hS("logStMod", j.ModState);
        hS("logStRst", j.Reset);
    } catch(e) {
        console.log(e);
    }
}

async function logStateGet() {
    let rq = {Cmd:"LogStateGet", SessionId:sIdG()};
    return await rqp(rq, logStateUpd);
}

// LOG - VALUE

function logValueCfgSetArray(id) {
    var t = [];
    for (var i = 0; i < id.length; i++) {
        var o = {};
        o["Nr"] = id[i];
        o["Enable"] = cG("logE" + id[i]);
        o["Name"] = vG("logN" + id[i]);
        o["ValueId"] = vIdGetIdByIdx(siG("logV" + id[i]));
        o["Format"] = fmtGetIdByIdx(siG("logF" + id[i]));
        t.push(o);
    }
    return t;
}

async function logValueCfgSetAll() {
    let rq = {Cmd:"LogValueCfgSet", SessionId:sIdG()};
    
    return new Promise(async(res,rej) => {
        rq["Values"] = logValueCfgSetArray([0,1,2,3]);
        await rqp(rq, null)
        .then(async(j) => {
            rq["Values"] = logValueCfgSetArray([4,5,6,7]);
            await rqp(rq, null)})
        .then(async(j) => {
            rq["Values"] = logValueCfgSetArray([8,9,10,11]);
            await rqp(rq, null)})
        .then(async(j) => {
            rq["Values"] = logValueCfgSetArray([12,13,14,15]);
            await rqp(rq, null)})
        .then((j) => {
            res();})
        .catch((m) => {
            rej(m);
        })
    });
}

function logValueCfgUpd(j) {
    try {
        for (var i = 0; i < j.Values.length; i++) {
            var v = j.Values[i];
            cS("logE" + v.Nr, v.Enable);
            vS("logN" + v.Nr, v.Name);
            siS("logV" + v.Nr, vIdGetIdxById(v.ValueId));
            siS("logF" + v.Nr, fmtGetIdxById(v.Format));
        }
    } catch(e) {
        console.log(e);
    }
}

async function logValueCfgGet(v) {
    let rq = {Cmd:"LogValueCfgGet", SessionId:sIdG(), Values:v};
    return await rqp(rq, logValueCfgUpd);
}

function logValueAdd(id) {
    var html;
    html =	'<div class="box-topic">' + 
               ' <h3 class="value-title" >Value ' + id + '</h3>' +
                '<div class="b-t">' +
                    '<p><label for="logE' + id + '">Enable</label><input id="logE' + id + '" type="checkbox"></p>' +
                '</div>' +
                '<div class="b-t">' + 
                    '<p><label for="logN' + id + '">Name</label><input id="logN' + id + '" type="text"></p>' +
                '</div>' +
                '<div class="b-t">' + 
                    '<p><label for="logV' + id + '">Value Id</label><select id="logV' + id + '"> ' + vIdStrGet() + '</select></p>' +
                '</div>' +
                '<div class="b-t">' +
                    '<p><label for="logF' + id + '">Format</label><select id="logF' + id + '">' + fmtStrGet() + '</select></p>' +
                '</div>' +
            '</div>';
    return html;
}

async function logInit() {
    return new Promise(async(res, rej) => {
        try {
            for (id = 0; id < 16; id++) {
                document.getElementById("log-ent").innerHTML += logValueAdd(id);
            }
        
            btnEvAdd("logBtCfg", async() => {
                loadingpopup();
                await logCfgSet().then((j) => {
                    donepopup("Saved");
                }).catch((m) => {
                    errpopup(m);
                })
            });
        
            btnEvAdd("logBtVal", async() => {
                loadingpopup();
                await logValueCfgSetAll().then(() => {
                    donepopup("Saved");
                }).catch((m) => {
                    errpopup(m);
                })
            });
        } catch (e) {
            console.log(e);
            res();
        }

        await logCfgGet()
        .then( async(j) => {await logStateGet()})
        .then( async(j) => {await logValueCfgGet([0,1,2,3,4])})
        .then( async(j) => {await logValueCfgGet([5,6,7,8,9])})
        .then( async(j) => {await logValueCfgGet([10,11,12,13,14])})
        .then( async(j) => {await logValueCfgGet([15])})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}