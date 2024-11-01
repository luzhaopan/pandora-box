# mongodb 数据库

## 一 、下载
下载绿色免安装版本（也可以官方版本）

# 安装

![](./img/2024-10-14-16-04-59.png)

## 二、解压（免安装版本安装方法）
1. 将安装的压缩文件解压
2. 文件目录如下所示
![](./img/2024-11-01-15-30-54.png)

3.对应的bin目录文件结构如下

![](./img/2024-10-14-15-49-22.png)

## 三、创建数据目录
1. mkdir -p /db
2. 在对应的目录下创建data文件夹（不包含中文路径）
![](./img/2024-10-14-15-50-06.png)


# 四、启动服务端

下载数据库压缩包，解压文件夹后，进入bin目录，打开命令启动窗口，输入以下命令启动mongodb服务：
```bash
.\mongod.exe 第三步所创建的文件目录路径
```
如下图所示：
![](./img/2024-10-14-15-55-08.png)


# 五、启动客户端

重新打开另一个命令启动窗口，在命令行输入以下命令启动mongodb客户端：
```bash
.\mongo.exe
```
如下图所示：
![](./img/2024-10-14-16-01-37.png)

通过命令行进行相关操作
![](./img/2024-10-14-16-15-54.png)

# 六、可视化工具
![](./img/2024-10-14-16-33-16.png)
![](./img/2024-10-14-16-46-08.png)

# 七、node 连接数据库（本项目基于express）

![](./img/2024-10-14-17-56-16.png)

![](./img/2024-10-14-17-56-33.png)

![](./img/2024-10-14-17-56-48.png)

![](./img/2024-10-14-17-57-05.png)