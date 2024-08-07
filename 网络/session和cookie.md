# session和cookie的区别

## 一、概念理解

首先呢，要了解session和cookie的区别先要了解以下几个概念：
1. 无状态的HTTP协议：

协议，是指计算机通信网络中两台计算机之间进行通信所必须共同遵守的规定或规则，超文本传输协议(HTTP)是一种通信协议，它允许将超文本标记语言(HTML)文档从Web服务器传送到客户端的浏览器。
HTTP协议是无状态的协议。一旦数据交换完毕，客户端与服务器端的连接就会关闭，再次交换数据需要建立新的连接。这就意味着服务器无法从连接上跟踪会话。

2. 会话（Session）跟踪：
   
会话，指用户登录网站后的一系列动作，比如浏览商品添加到购物车并购买。会话（Session）跟踪是Web程序中常用的技术，用来跟踪用户的整个会话。常用的会话跟踪技术是Cookie与Session。
Cookie通过在客户端记录信息确定用户身份，Session通过在服务器端记录信息确定用户身份。

## 二、cookie

由于HTTP是一种无状态的协议，服务器单从网络连接上无从知道客户身份。用户A购买了一件商品放入购物车内，当再次购买商品时服务器已经无法判断该购买行为是属于用户A的会话还是用户B的会话了。怎么办呢？

就给客户端们颁发一个通行证吧，每人一个，无论谁访问都必须携带自己通行证。这样服务器就能从通行证上确认客户身份了。这就是Cookie 的工作原理。

Cookie实际上是一小段的文本信息。客户端请求服务器，如果服务器需要记录该用户状态，就使用response向客户端浏览器颁发一个Cookie。客户端会把Cookie保存起来。

当浏览器再请求该网站时，浏览器把请求的网址连同该Cookie一同提交给服务器。服务器检查该Cookie，以此来辨认用户状态。服务器还可以根据需要修改Cookie的内容。

1. 会话Cookie和持久Cookie
    
若不设置过期时间，则表示这个cookie的生命期为浏览器会话期间，关闭浏览器窗口，cookie就消失。这种生命期为浏览器会话期的cookie被称为会话cookie。会话cookie一般不存储在硬盘上而是保存在内存里，当然这种行为并不是规范规定的。

若设置了过期时间，浏览器就会把cookie保存到硬盘上，关闭后再次打开浏览器，这些cookie仍然有效直到超过设定的过期时间。存储在硬盘上的cookie可以在浏览器的不同进程间共享。这种称为持久Cookie。 

2. Cookie具有不可跨域性

就是说，浏览器访问百度不会带上谷歌的cookie;

### cookite作用

1. 记录用户信息：Cookies可以记录用户的登录状态、用户名、密码等信息，使得用户下次访问网站时无需重新输入这些信息。
2. 个性化设置：Cookies用户的偏好设置，如语言、主题等，使得用户下次访问网站时能够自动应用这些设置。
3. 购物车功能：Cookies可以记录用户在购物网站中选择的商品和数量，使得用户下次访问网站时能够继续购物而不需要重新选择商品。
4. 统计分析：Cookies可以记录用户的浏览行为和点击行为等数据，帮助网站分析用户行为并提供更好的服务。
   
Cookies包括以下内容：
1. 名称：每个Cookie都有一个名称，用于标识不同的Cookie。
2. 值：每个Cookie都有一个值，用于存储具体的数据内容。
3. 过期时间：每个Cookie都有一个过期时间，在该时间之后该Cookie将被删除。如果没有设置过期时间，则该Cookie将在浏览器关闭时被删除。
4. 域名和路径：每个Cookie都有一个域名和路径属性，用于指定哪些页面可以访问该Cookie。如果没有指定域名和路径，则默认为当前页面所在域名和路径。
5. 安全标志：每个Cookie都有一个安全标志，用于指定该Cookie是否只能通过安全连接（如HTTPS）传输。

Cookies存储在客户端（即用户的浏览器）中，通常以文本文件的形式保存在用户的计算机上。当用户访问网站时，浏览器会将相应的Cookies发送给服务器，服务器可以读取这些Cookies并根据其中的信息提供相应的服务。

## 三、Session
  Session是另一种记录客户状态的机制，不同的是Cookie保存在客户端浏览器中，而Session保存在服务器上。
  客户端浏览器访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上，这就是Session。客户端浏览器再次访问时只需要从该Session中查找该客户的状态就可以了。
  每个用户访问服务器都会建立一个session，那服务器是怎么标识用户的唯一身份呢？事实上，用户与服务器建立连接的同时，服务器会自动为其分配一个SessionId。
  1. 两个问题：
   
1）什么东西可以让你每次请求都把SessionId自动带到服务器呢？显然就是cookie了，如果你想为用户建立一次会话，可以在用户授权成功时给他一个唯一的cookie。
当一个用户提交了表单时，浏览器会将用户的SessionId自动附加在HTTP头信息中，（这是浏览器的自动功能，用户不会察觉到），当服务器处理完这个表单后，将结果返回给SessionId所对应的用户。
试想，如果没有 SessionId，当有两个用户同时进行注册时，服务器怎样才能知道到底是哪个用户提交了哪个表单呢。

2）储存需要的信息。服务器通过SessionId作为key，读写到对应的value，这就达到了保持会话信息的目的。

  1. session的创建：

当程序需要为某个客户端的请求创建一个session时，服务器首先检查这个客户端的请求里是否已包含了sessionId，如果已包含则说明以前已经为此客户端创建过session，服务器就按照sessionId把这个session检索出来使用（检索不到，会新建一个），如果客户端请求不包含sessionId，则为此客户端创建一个session并且生成一个与此session相关联的sessionId，sessionId的值是一个既不会重复，又不容易被找到规律以仿造的字符串，这个sessionId将被在本次响应中返回给客户端保存。

  2. 禁用cookie：
   
如果客户端禁用了cookie，通常有两种方法实现session而不依赖cookie。

1）URL重写，就是把sessionId直接附加在URL路径的后面。

2）表单隐藏字段。就是服务器会自动修改表单，添加一个隐藏字段，以便在表单提交时能够把session id传递回服务器。比如： 
```sh
<form name="testform" action="/xxx"> 
<input type="hidden" name="jsessionid" value="ByOK3vjFD75aPnrF7C2HmdnV6QZcEbzWoWiBYEnLerjQ99zWpBng!-145788764"> 
<input type="text"> 
</form> 
```
  1. Session共享：

对于多网站(同一父域不同子域)单服务器，我们需要解决的就是来自不同网站之间SessionId的共享。由于域名不同(aaa.test.com和bbb.test.com)，而SessionId又分别储存在各自的cookie中，因此服务器会认为对于两个子站的访问,是来自不同的会话。解决的方法是通过修改cookies的域名为父域名达到cookie共享的目的,从而实现SessionId的共享。带来的弊端就是，子站间的cookie信息也同时被共享了。 

## 四、总结

1. cookie数据存放在客户的浏览器上，session数据放在服务器上。
2. cookie不是很安全，别人可以分析存放在本地的cookie并进行cookie欺骗，考虑到安全应当使用session。
3. session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能，考虑到减轻服务器性能方面，应当使用cookie。
4. 单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。
5. 可以考虑将登陆信息等重要信息存放为session，其他信息如果需要保留，可以放在cookie中。


## 五、应用场景
 
登录网站，今输入用户名密码登录了，第二天再打开很多情况下就直接打开了。这个时候用到的一个机制就是cookie。

session一个场景是购物车，添加了商品之后客户端处可以知道添加了哪些商品，而服务器端如何判别呢，所以也需要存储一些信息就用到了session

## 六、token

token适用于项目级的前后端分离（前后端代码运行在不同的服务器下）

请求登录时，token和sessionId原理相同，是对key和key对应的用户信息进行加密后的加密字符，登录成功后，会在响应主体中将{token：'字符串'}返回给客户端。客户端通过cookie、sessionStorage、localStorage都可以进行存储。再次请求时不会默认携带，需要在请求拦截器位置给请求头中添加认证字段Authorization携带token信息，服务器端就可以通过token信息查找用户登录状态。

## 三. Tokens的优势

1. 无状态、服务器可扩展

在客户端存储的Tokens是无状态的，并且能够被扩展。基于这种无状态和不存储Session信息，负载负载均衡器能够将用户信息从一个服务传到其他服务器上。

2. 安全性

请求中发送token而不再是发送cookie能够防止CSRF(跨站请求伪造)。即使在客户端使用cookie存储token，cookie也仅仅是一个存储机制而不是用于认证。不将信息存储在Session中，让我们少了对session操作。 

token是有时效的，一段时间之后用户需要重新验证。我们也不一定需要等到token自动失效，token有撤回的操作，通过token revocataion可以使一个特定的token或是一组有相同认证的token无效。

3. 可扩展

Tokens能够创建与其它程序共享权限的程序。使用tokens时，可以提供可选的权限给第三方应用程序。当用户想让另一个应用程序访问它们的数据，我们可以通过建立自己的API，得出特殊权限的tokens。

4. 多平台跨域

我们提前先来谈论一下CORS(跨域资源共享)，对应用程序和服务进行扩展的时候，需要介入各种各种的设备和应用程序。

Having our API just serve data, we can also make the design choice to serve assets from a CDN. This eliminates the issues that CORS brings up after we set a quick header configuration for our application.

只要用户有一个通过了验证的token，数据和资源就能够在任何域上被请求到。

Access-Control-Allow-Origin: *   
