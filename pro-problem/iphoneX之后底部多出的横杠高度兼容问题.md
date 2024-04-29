# iphoneX之后底部多出的横杠高度兼容问题

![](./img/2024-04-29-13-15-34.png)

多出的下部分高度这是底部距离时需要加上类似如下代码

```sh
margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
```
