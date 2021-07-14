
function diagUpd(j) {
    try {
        vS("dI", vG("dI") + j.Data);
        hS("dF", j.Name);
    } catch(e) {
        console.log(e);
    }
}

async function diagLoad() {
    let rq = {Cmd:"DiagDataGet", SessionId:sIdG(), Mode:1};
    let c = true, s = false, tm;

    hS("dF", "");
    vS("dI", "");

    return new Promise(async function(res, rej) {
        while(c) {
            await rqp(rq, diagUpd).then((j) => {
                rq["Mode"] = 0;
                if (j.Status != "OK") {
                    c = false;
                } else if (j.Data == "") {
                    c = false;
                    s = true;
                }
            }).catch((m) => {
                tm = m;
                c = false;
            })
        }
        if (s == true)
            res();
        else
            rej(tm);
    });
}


async function diagInit() {
    return new Promise(async(res, rej) => {
        await diagLoad()
        .then(() => {
            res();
        }).catch((m) => {
            rej(m);
        })
    });
}    