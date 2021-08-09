function mqttCfgUpd(j) {
    let i;

    try {
        vS("mqSrv", j.Server);
        vS("mqPort", j.Port);
        cS("mqEn", j.Enable);
        cS("mqIPv4", j.EnIPv4);
        cS("mqIPv6", j.EnIPv6);
        cS("mqDns", j.EnDns);
        //cS("mqPer", j.);
        vS("mqUser", j.User);
        vS("mqPass", j.Pass);
        vS("mqCId", j.ClientId);
        vS("mqKpAlv", j.KeepAlive);

        i = 0;
        if (j.AuthMode == "Srv")
            i = 1;
        if (j.AuthMode == "SrvCli")
            i = 2;
        siS("mqAuth", i);

        if (j.CertId != 255) {
            vS("mqCrtId", j.CertId);
            cS("mqCrtEn", true);
        }
        if (j.CaId != 255) {
            vS("mqCaId", j.CaId);
            cS("mqCaEn", true);
        }
        if (j.PkId != 255) {
            vS("mqPkId", j.PkId);
            cS("mqPkEn", true);
        }
        //cS("mqChkSrvDt", j.);
    } catch(e) {
        console.log(e);
    }
}

async function mqttCfgGet() {
    let rq = {Cmd:"MqttCfgGet", SessionId:sIdG()};
    return await rqp(rq, mqttCfgUpd);
}

async function mqttCfgSet() {
    let rq = {Cmd:"MqttCfgSet", SessionId:sIdG(),
        Server:vG("mqSrv"),
        Port:vG("mqPort"),
        Enable:cG("mqEn"),
        EnIPv4:cG("mqIPv4"),
        EnIPv6:cG("mqIPv6"),
        EnDns:cG("mqDns"),
        User:vG("mqUser"),
        Pass:vG("mqPass"),
        ClientId:vG("mqCId"),
        KeepAlive:vG("mqKpAlv")};

    let a = siG("mqAuth");
    if (a == 1)
        rq["AuthMode"] = "Srv";
    else if (a == 2)
        rq["AuthMode"] = "SrvCli";
    else
        rq["AutMode"] = "Disable"

    if (cG("mqCrtEn") == true) {
        rq["CertId"] = vG("mqCrtId");
    } else {
        rq["CertId"] == 255;
    }

    if (cG("mqCaEn") == true) {
        rq["CaId"] = vG("mqCaId");
    } else {
        rq["CaId"] = 255;
    }

    if (cG("mqPkEn") == true) {
        rq["PkId"] = vG("mqPkId");
    } else {
        rq["PkId"] = 255;
    }

    return await rqp(rq, null);
}

function mqttStateUpd(j) {
    try {
        hS("mqStSvc", j.SvcState);
        hS("mqStMod", j.ModState);
        hS("mqStRst", j.Reset);
    } catch(e) {
        console.log(e);
    }
}

async function mqttStateGet() {
    let rq = {Cmd:"MqttStateGet", SessionId:sIdG()};
    return await rqp(rq, mqttStateUpd);
}

// MQTT - TOPIC
function mqttTopicCfgSetArray(id) {
    var t = [];
    for (var i = 0; i < id.length; i++) {
        var o = {};
        o["Nr"] = id[i];
        o["Type"] = siG("mqT" + id[i]);
        o["Name"] = vG("mqN" + id[i]);
        o["PubInterval"] = vG("mqP" + id[i]);
        o["ValueId"] = vIdGetIdByIdx(siG("mqV" + id[i]));
        o["Qos"] = vG("mqQ" + id[i]);
        o["Format"] = fmtGetIdByIdx(siG("mqF" + id[i]));
        t.push(o);
    }
    return t;
}

async function mqttTopicCfgSetAll() {
    let rq = {Cmd:"MqttTopicCfgSet", SessionId:sIdG()};
    
    return new Promise(async(res,rej) => {
        rq["Topics"] = mqttTopicCfgSetArray([0,1,2,3]);
        await rqp(rq, null)
        .then(async(j) => {
            rq["Topics"] = mqttTopicCfgSetArray([4,5,6,7]);    
            await rqp(rq, null)})
        .then(async(j) => {
            rq["Topics"] = mqttTopicCfgSetArray([8,9,10,11]);
            await rqp(rq, null)})
        .then(async(j) => {
            rq["Topics"] = mqttTopicCfgSetArray([12,13,14,15]);
            await rqp(rq, null)})
        .then((j) => {
            res();})
        .catch((m) => {
            rej(m);
        })
    }); 
}

function mqttTopicCfgUpd(j) {
    try {
        for (var i = 0; i < j.Topics.length; i++) {
            var t = j.Topics[i];            
            siS("mqT" + t.Nr, t.Type);
            vS("mqN" + t.Nr, t.Name);
            vS("mqP" + t.Nr, t.PubInterval);
            siS("mqV" + t.Nr, vIdGetIdxById(t.ValueId));
            vS("mqQ" + t.Nr, t.Qos);
            siS("mqF" + t.Nr, fmtGetIdxById(t.Format));
        }
    } catch(e) {
        console.log(e);
    }
}

async function mqttTopicCfgGet(t) {
    let rq = {Cmd:"MqttTopicCfgGet", SessionId:sIdG(), Topics:t};
    return await rqp(rq, mqttTopicCfgUpd);
}

function mqttTopicAdd(id) {
    var html;

    html =	'<div class="box-topic">' +
                '<h3 class="value-title">Topic ' + id + '</h3>'+
            
                '<div class="b-t">' +
                    '<p><label for="mqT' + id + '">Type</label><select id="mqT' + id + '"><option>Disable</option><option>Publish</option><option>Subscribe</option></select></p>' +
                '</div>' +
                '<div class="b-t">' +
                    '<p><label for="mqN' + id + '">Name</label><input id="mqN' + id + '"type="text"></p>' +
                '</div>' +
                '<div class="b-t">' +
                    '<p><label for="mqP' + id + '">PubInt</label><input id="mqP' + id + '" type="number" min=0 step=1 max=10000></p>' +
                '</div>' +
                '<div class="b-t">' +
                    '<p><label for="mqV' + id + '">Value Id</label><select id="mqV' + id + '"> ' + vIdStrGet() + '</select></p>' +
                '</div>' +
                '<div class="b-t">' +
                    '<p><label for="mqQ' + id + '">QOS</label><input id="mqQ' + id + '" type="number" maxlength="3" size="10" min=0 step=1 max=3></p>' +
                '</div>' +
                '<div class="b-t">' +
                    '<p><label for="mqF' + id + '">Format</label><select id="mqF' + id + '"> ' + fmtStrGet() + '</select></p>' +
                '</div>' +
                '<div class="b-t">' +
                    '<p><label for="mqR' + id + '">Retain</label><input id="mqR' + id + '"type="checkbox"></p>' +
                '</div>' +
            '</div>';
    return html;
}

function mqttInit() {
    return new Promise(async(res, rej) => {
        try {
            for (id = 0; id < 16; id++) {
                document.getElementById("mqtt-top").innerHTML += mqttTopicAdd(id);
            }
            btnEvAdd("mqttBtCfg", async() => {
                loadingpopup();
                await mqttCfgSet().then((j) => {
                    donepopup("Saved");
                }).catch((m) => {
                    errpopup(m);
                })
            }); 
            btnEvAdd("mqttBtTopCfg", async() => {
                loadingpopup();
                await mqttTopicCfgSetAll().then(() => {
                    donepopup("Saved");
                }).catch((m) => {
                    errpopup(m);
                })
            });
        } catch (e) {
            console.log(e);
            res();
        }
    
        await mqttCfgGet()
        .then(async(j) => {await mqttStateGet()})
        .then(async(j) => {await mqttTopicCfgGet([0,1,2,3])})
        .then(async(j) => {await mqttTopicCfgGet([4,5,6,7])})
        .then(async(j) => {await mqttTopicCfgGet([8,9,10,11])})
        .then(async(j) => {await mqttTopicCfgGet([12,13,14,15])})
        .then((j) => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}