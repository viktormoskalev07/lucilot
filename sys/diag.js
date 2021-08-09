 
function diagUpd(j) {
    try {
        hS("dI", hG("dI") + j.Data);
        hS("dF", j.Name);
    } catch(e) {
        console.log(e);
    }
}

async function diagLoad() {
    let rq = {Cmd:"DiagDataGet", SessionId:sIdG(), Mode:1};
    let c = true, s = false, tm;

    hS("dF", "");
    hS("dI", "");

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

   
(function (){
  const int =  setInterval(() => { 
      const b = document.querySelector('.diagnostic__resize__button');
      const cl = document.querySelector('.diagnostic__close');
          if(b){
              clearInterval(int); 
          const c = document.querySelector('.diagnostic__container');
          b.addEventListener('click', function(){
              c.classList.toggle('diagnostic-open');
              document.body.classList.toggle('noscrol');
          })
          cl.addEventListener('click', function(){
              c.classList.remove('diagnostic-open');
              document.body.classList.remove('noscrol');
          })     
          }  
  }, 200); 
})()
 