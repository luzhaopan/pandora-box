# position + top/left 的效果

下⾯让我们来看⼀个动画效果，在该动画中包含了⼏个堆叠在⼀起的球并让它们沿相同路径移动。最简单的⽅式就是实时调整它们的left 和 top 属性，使⽤ css 动画实现。

```js
<style>
    html,
    body {
        width: 100%;
        height: 100%;
    }
    
    .ball-running {
        animation: run-around 4s infinite;
        width: 100px;
        height: 100px;
        background-color: red;
        position: absolute;
    }
    
    @keyframes run-around {
        0%: {
            top: 0;
            left: 0;
        }
        25% {
            top: 0;
            left: 200px;
        }
        50% {
            top: 200px;
            left: 200px;
        }
        75% {
            top: 200px;
            left: 0;
        }
    }
    
</style>
<body>
    <div class="ball-running"></div>
 
</body>
```

在运⾏的时候，即使是在电脑浏览器上也会隐约觉得动画的运⾏并不流畅，动画有些停顿的感觉，更不要提在移动端达到 60fps 的流畅效果了。这是因为top和left的改变会触发浏览器的 reflow 和 repaint ，整个动画过程都在不断触发浏览器的重新渲染，这个过程是很影响性能的。


# transform 的效果

为了解决这个问题，我们使⽤ transform 中的 translate() 来替换 top 和 left ，重写⼀下这个动画效果。

```html
<style>
    html,
    body {
        width: 100%;
        height: 100%;
    }
    
    .ball-running {
        animation: run-around2 4s infinite;
        width: 100px;
        height: 100px;
        background-color: red;
        position: absolute;
    }
    
 
    @keyframes run-around2 {
        0%: {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(200px, 0);
        }
        50% {
            transform: translate(200px, 200px);
        }
        75% {
            transform: translate(0, 200px);
        }
    }
</style>
 
<body>
    <div class="ball-running"></div>
</body>
```

这时候发现整个动画效果流畅了很多，在动画移动的过程中也没有发⽣repaint和reflow。

那么，为什么 transform 没有触发 repaint 呢？原因就是，transform 动画由GPU控制，支持硬件加速。并不需要软件⽅⾯的渲染。

看完以上两个例子，那么我们就要入正题了。

# 硬件加速⼯作原理

浏览器接收到页⾯⽂档后，会将⽂档中的标记语⾔解析为DOM树，DOM树和CSS结合后形成浏览器构建页⾯的渲染树，渲染树中包含了⼤量的渲染元素，每⼀个渲染元素会被分到⼀个图层中，每个图层⼜会被加载到GPU形成渲染纹理，⽽图层在GPU中 transform 是不会触发 repaint 的，这⼀点⾮常类似3D绘图功能，最终这些使⽤transform的图层都会使⽤独⽴的合成器进程进⾏处理。

在我们的⽰例中，CSS transform 创建了⼀个新的复合图层，可以被GPU直接⽤来执⾏ transform 操作。在chrome开发者⼯具中开启“show layer borders”选项后，每个复合图层就会显⽰⼀条黄⾊的边界。⽰例中的球就处于⼀个独⽴的复合图层，移动时的变化也是独⽴
的。

此时，你也许会问：浏览器什么时候会创建⼀个独⽴的复合图层呢？事实上⼀般是在以下⼏种情况下：

（1）3D 或者 CSS transform

（2）video或canvas标签

（3）CSS filters

（4）元素覆盖时，⽐如使⽤了 z-index 属性

等⼀下，上⾯的⽰例使⽤的是 2D transition ⽽不是 3D 的 transforms 啊？这个说法没错，所以在timeline中我们可以看到：动画开始和结束的时候发⽣了两次 repaint 操作。

3D 和 2D transform 的区别就在于，浏览器在页⾯渲染前为3D动画创建独⽴的复合图层，⽽在运⾏期间为2D动画创建。

动画开始时，⽣成新的复合图层并加载为GPU的纹理⽤于初始化 repaint，然后由GPU的复合器操纵整个动画的执⾏，最后当动画结束时，再次执⾏ repaint 操作删除复合图层。

# 使⽤ GPU 渲染元素

1. 能触发GPU渲染的属性
并不是所有的CSS属性都能触发GPU的硬件加速，实际上只有少数属性可以，⽐如下⾯的这些：

（1）transform

（2）opacity

（3）filter

2. 强制使⽤GPU渲染

为了避免 2D transform 动画在开始和结束时发⽣的 repaint 操作，我们可以硬编码⼀些样式来解决这个问题：

```sh
.exam1{
    transform: translateZ(0);
}
.exam2{
    transform: rotateZ(360deg);
}
```

3. 使⽤GPU渲染的注意事项

使⽤硬件加速并不是⼗全⼗美的事情，⽐如：

（1）内存。如果GPU加载了⼤量的纹理，那么很容易就会发⽣内存问题，这⼀点在移动端浏览器上尤为明显，所以，⼀定要牢记不要让页⾯的每个元素都使⽤硬件加速。

（2）使⽤GPU渲染会影响字体的抗锯齿效果。这是因为GPU和CPU具有不同的渲染机制，即使最终硬件加速停⽌了，⽂本还是会在动画期间显⽰得很模糊。

4. will-change
浏览器还提出了⼀个 will-change 属性，该属性允许开发者告知浏览器哪⼀个属性即将发⽣变化，从⽽为浏览器对该属性进⾏优化提供时间。下⾯是⼀个使⽤ will-change 的⽰例
```sh
.exam3{
will-change: transform;
}
```
缺点在于其兼容性不⼤好。

# 总结：

可以使用GPU加速的CSS3属性

CSS transform

CSS opacity

CSS filter

1. transform 会使⽤ GPU 硬件加速，性能更好；position + top/left 会触发⼤量的重绘和回流，性能影响较⼤。
2. 硬件加速的⼯作原理是创建⼀个新的复合图层，然后使⽤合成线程进⾏渲染。
3. 3D 动画与 2D 动画的区别；2D动画会在动画开始和动画结束时触发2次重新渲染。
4. 使⽤GPU可以优化动画效果，但是不要滥⽤，会有内存问题。
5. 理解强制触发硬件加速的 transform 技巧，使⽤对GPU友好的CSS属性。

既然transform这个属性那么强大，我们就可以用他来优化我们平时的操作。例如：拖拽，在mouseover阶段就用transform，在mousedown阶段在再用position绝对定位，这样是就可以减少repaint和reflow的操作、还有就是动画。。。等等。