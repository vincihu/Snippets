## 配置 (QuanX)

```properties
[MITM]
wapsc.189.cn

[rewrite_local]
# 190及以后版本
^https:\/\/wapsc.189.cn\/lls-user-center\/user\/doUserLogin url script-request-body sc189.headers.js


[task_local]
1 0 * * * sc189.js
```
