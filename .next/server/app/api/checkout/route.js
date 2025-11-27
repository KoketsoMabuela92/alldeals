"use strict";(()=>{var e={};e.id=1607,e.ids=[1607],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6113:e=>{e.exports=require("crypto")},8087:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>_,originalPathname:()=>v,patchFetch:()=>A,requestAsyncStorage:()=>f,routeModule:()=>y,serverHooks:()=>x,staticGenerationAsyncStorage:()=>g,staticGenerationBailout:()=>P});var a={};r.r(a),r.d(a,{POST:()=>h});var s=r(10884),o=r(16132),n=r(21040),i=r(95798),c=r(24596),l=r(6113),p=r.n(l);let u=process.env.PAYFAST_MERCHANT_ID||"10000100",d=process.env.PAYFAST_MERCHANT_KEY||"46f0cd694581a",m=process.env.PAYFAST_PASSPHRASE||"";async function h(e){try{let t=await e.json(),r=(0,c.headers)().get("origin")||"http://localhost:3000";if(!t.items||!Array.isArray(t.items)||0===t.items.length)return i.Z.json({error:"Your cart is empty"},{status:400});for(let e of t.items)if(!e.name||!e.price||!e.quantity)return i.Z.json({error:"Invalid item data"},{status:400});let a=t.items.reduce((e,t)=>e+t.price*t.quantity,0),s=a<500?99:0,o=`ORD-${Date.now()}`,n={merchant_id:u,merchant_key:d,return_url:`${r}/checkout/success`,cancel_url:`${r}/cart`,notify_url:`${r}/api/payfast/notify`,name_first:t.customerInfo?.firstName||"Customer",name_last:t.customerInfo?.lastName||"User",email_address:t.customerInfo?.email||"test@example.com",m_payment_id:o,amount:(a+s).toFixed(2),item_name:"AllDeals Order",item_description:`Order with ${t.items.length} items`};s>0&&(n.custom_str1=`Shipping: R${s.toFixed(2)}`),console.log("PayFast payment data:",n);try{n.signature=((e,t="")=>{let r=Object.keys(e).sort(),a="";for(let t of r)""!==e[t]&&null!==e[t]&&void 0!==e[t]&&(a+=`${t}=${encodeURIComponent(e[t].toString().trim()).replace(/%20/g,"+")}&`);a=a.slice(0,-1),t&&""!==t.trim()&&(a+=`&passphrase=${encodeURIComponent(t.trim()).replace(/%20/g,"+")}`),console.log("PayFast signature string:",a);let s=p().createHash("md5").update(a).digest("hex");return console.log("Generated signature:",s),s})(n,m);let e=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Redirecting to PayFast...</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <h2>Redirecting to PayFast...</h2>
          <div class="spinner"></div>
          <p>Please wait while we redirect you to complete your payment.</p>
          <form id="payfast_form" action="https://www.payfast.co.za/eng/process" method="post">
            ${Object.entries(n).map(([e,t])=>`<input type="hidden" name="${e}" value="${t}" />`).join("")}
          </form>
          <script>
            document.getElementById('payfast_form').submit();
          </script>
        </body>
        </html>
      `;return new Response(e,{headers:{"Content-Type":"text/html"}})}catch(e){return console.error("PayFast error:",e),i.Z.json({error:e.message||"PayFast checkout creation failed"},{status:500})}}catch(e){return console.error("Server error:",e),i.Z.json({error:"Internal server error"},{status:500})}}let y=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/checkout/route",pathname:"/api/checkout",filename:"route",bundlePath:"app/api/checkout/route"},resolvedPagePath:"/Users/koketsomabuela/alldeals/app/api/checkout/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:f,staticGenerationAsyncStorage:g,serverHooks:x,headerHooks:_,staticGenerationBailout:P}=y,v="/api/checkout/route";function A(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:g})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[3271,8107,4596],()=>r(8087));module.exports=a})();