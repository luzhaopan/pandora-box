# Typescript 数据类型

基本数据类型: string、number、boolean、undefined、null、Symbol、bigint
引用数据类型: Array,Tuple,object,function
特殊数据类型:  any,unknow,void,never,enum

1. boolean（布尔类型）
2. number（数字类型）
3. string（字符串类型）
4. array（数组类型）
5. tuple（元组类型）：明确元素数量和元素类型的数组，各元素的类型不必相同
6. enum（枚举类型）：一个对象的所有可能取值的集合
7. any（任意类型）：可以指定任何类型的值
8. null 和 undefined 类型：是所有类型的子类型（除了never）
9. void 类型: 用于标识方法返回值的类型，表示该方法没有返回值
10. never 类型: never是其他类型 （包括null和 undefined）的子类型，可以赋值给任何类型，代表从不会出现的值
11. object 对象类型
12. unknow：它是除any以外的顶级类型。
unknow比any更加严格,它可以被分配任何类型的值，但是只能赋值给unknow或者any类型，赋值给其他类型都会报错
所有unknow和any都属于TS的顶级类型，它们俩有啥区别？unknow更加严格也更加安全,相比之下any宽松得多，使用any会跳过类型检查，这就意味着放弃了TS的类型优势

