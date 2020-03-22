//https:\/\/api\.termius\.com\/api\/v3\/bulk\/account\/ url script-response-body Termius.js
//api.termius.com
let obj=JSON.parse($response.body)
obj.account["pro_mode"] = true;
obj.account["plan_type"] = "Premium";
obj.account["user_type"] = "Premium";
obj.account["current_period"]["until"] = "2021-01-01T00:00:00";
$done({body:JSON.stringify(obj)})
//bynubyta
