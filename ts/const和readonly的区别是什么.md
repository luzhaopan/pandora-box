# const和readonly的区别是什么

1. const用于变量，readonly用于属性

2. const在运行时检查，readonly在编译时检查

3. 使用const变量保存的数组，可以使用push，pop等方法。但是如果使用ReadonlyArray<number>声明的数组不能使用push，pop等方法
