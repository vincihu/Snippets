## 配置 (QuanX)

```properties
[MITM]
hostname = wapside.189.cn

[rewrite_local]
# 190及以后版本
^https:\/\/wapside.189.cn:9001\/api\/exchange\/consume url script-request-body 10000_exchange.headers.js


[task_local]
0 10 * * * 10000_exchange.js
```
