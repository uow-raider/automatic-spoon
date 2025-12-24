/* NOVA reider - Optimized Core */
const _0x4f22=['log-container','value','token','split','map','trim','filter','channelId','message','interval','limit','randomize','checked','everyoneMention','mentionUsers','status','json','retry_after','POST','application/json','Authorization','DELETE','https://discord.com/api/v9/channels/','/messages','https://discord.com/api/v9/users/@me/guilds/'];
const _0x1a2b=(_0x3c1d)=>_0x4f22[_0x3c1d];

let isRunning = false;
let stopSignal = false;

function addLog(t){const c=document.getElementById(_0x1a2b(0));const e=document.createElement('div');e.textContent=`[${new Date().toLocaleTimeString()}] ${t}`;c.prepend(e)}

async function execute(){
    if(isRunning)return;
    const tks=document.getElementById(_0x1a2b(2)).value[_0x1a2b(3)]('\n')[_0x1a2b(4)](t=>t[_0x1a2b(5)]())[_0x1a2b(6)](t=>t!=="");
    const cid=document.getElementById(_0x1a2b(7)).value;
    if(tks.length===0||!cid)return alert('Missing Data');
    
    isRunning=true;stopSignal=false;addLog(`Started: ${tks.length} tokens`);
    
    await Promise.all(tks.map((tk,i)=>runTokenTask(tk,i+1,cid)));
    isRunning=false;addLog("Finished");
}

async function runTokenTask(tk,id,cid){
    const msg=document.getElementById(_0x1a2b(8)).value;
    const iv=parseFloat(document.getElementById(_0x1a2b(9)).value)*1000;
    const lm=parseInt(document.getElementById(_0x1a2b(10)).value);
    
    for(let i=0;i<lm;i++){
        if(stopSignal)break;
        let fMsg=msg;
        if(document.getElementById(_0x1a2b(11))[_0x1a2b(12)]) fMsg+=` [${Math.random().toString(36).substring(7)}]`;
        
        try{
            const r=await fetch(`${_0x1a2b(22)}${cid}${_0x1a2b(23)}`,{
                method:_0x1a2b(18),
                headers:{[_0x1a2b(20)]:tk,'Content-Type':_0x1a2b(19)},
                body:JSON.stringify({content:fMsg})
            });
            if(r[_0x1a2b(15)]===429){
                const d=await r[_0x1a2b(16)]();
                await new Promise(res=>setTimeout(res,d[_0x1a2b(17)]*1000));
            }
        }catch(e){addLog(`Error T${id}`);}
        await new Promise(res=>setTimeout(res,iv));
    }
}

function stopSpam(){stopSignal=true;addLog("Stopping...");}

async function leaveServer(){
    const tks=document.getElementById(_0x1a2b(2)).value[_0x1a2b(3)]('\n')[_0x1a2b(4)](t=>t[_0x1a2b(5)]())[_0x1a2b(6)](t=>t!=="");
    const sid=document.getElementById('serverId').value;
    if(tks.length===0||!sid)return;
    for(const tk of tks){
        try{await fetch(`${_0x1a2b(24)}${sid}`,{method:_0x1a2b(21),headers:{[_0x1a2b(20)]:tk}});}catch(e){}
    }
    alert('Done');
}
