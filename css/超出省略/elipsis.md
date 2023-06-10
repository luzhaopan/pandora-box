# 文字溢出显示省略号
   
```sh
// 单行省略号
<style>
.block {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>

// 多行省略号
<style>
.block {
    width: 200px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
```