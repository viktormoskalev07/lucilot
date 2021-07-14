
async function secMemUpload(id) {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        var file = e.target.files[0];

        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            var r = new RegExp("[\n]");
            var str = content.replace(/(?:\r\n|\r|\n)/g, ':');
            console.log(str);
        }
    }
    
    input.click();
}

async function secMemDelete(id) {
    let rq = {Cmd:"SecMemSet", SessionId:sIdG(),
        Complete:true, Length:0, Data:""};
        return await rqp(rq, null);
}

function secMemDlgSet(id, j) {
    try {
        if (j.Cert != null)
            hS("sMem" + id, j.Cert.SubjectDn);
        else if (j.Pk != null)
            hS("sMem" + id, "Secure Private Key");
        else
            hS("sMem" +id, "None");
    } catch(e) {
        console.log(e);
    }
}

async function secMemGet(id) {
    let rq = {Cmd:"SecMemGet", SessionId:sIdG(), Id:id};
    return await rqp(rq, null);
}

function secAdd(id) {
    var html;

    html = '<div class="box-topic">' +
        '<h3 class="topic-title">Secure Memory Id ' + id + '</h3>' +
        '<p id="sMem' + id + '">None</p>' + 
        '<button class="button button-save" id="sMemBtUp' + id + '">Upload' +
        '<button class="button button-save" id="sMemBtDel' + id + '">Delete';

    return html;
}


async function secInit() {
    return new Promise(async(res, rej) => {
        try {
            for (var id = 0; id < 8; id++) {
                eGetById("secMemId").innerHTML += secAdd(id);
            }
        } catch(e) {
            console.log(e);
            res();
        }

        for (var id = 0; id < 8; id++) {
            (function(id) {
                btnEvAdd("sMemBtUp" + id, async () => {
                    await secMemUpload(id).then(() => {
                    }).catch((m) => {
                        errpopup(m);
                    })
                });
                
                btnEvAdd("sMemBtDel" + id, async () => {
                    await secMemDelete(id).then(() => {
                    }).catch((m) => {
                        errpopup(m);
                    })
                });
            }(id));
        }

        for (var id = 0; id < 8; id++) {
            await secMemGet(id).then((j) => {
                secMemDlgSet(id, j);
            }).catch((m) => {
                id = 8;
                rej(m);
            })
        }
        
        res();
    });
}