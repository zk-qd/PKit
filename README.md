# 示例
![示例](./img/example.jpg)


# 插件说明

## css 兼容性

> .min 兼容 ie8 以上
> 无.min 不兼容 ie11(方便调样式)

## js 兼容性

> 兼容 ie8 以上

## 扩展性

> 样式可自行扩展
> js 可以自行扩展

## 迁移

> 此插件使用原生 js 不依赖任何插件

# API

### 核心方法

| Name              |        Parameter         |    Return     |      Description |
| ----------------- | :----------------------: | :-----------: | ---------------: |
| load([,pageData]) |      {index,count}       |               | 加载数据渲染数据 |
| pageData()        |                          | {index,count} |         获取分页 |
| renderPage(data)  | {datas,index,rows,pages} |               |         渲染分页 |
| pageData(data)    |         {datas}          |               |         渲染表格 |
| pHide()           |                          |               |         隐藏分页 |
| tHide()           |                          |               |         隐藏表格 |
| dead()            |                          |               |         销毁表格 |

### 扩展方法

| Name                   |   Parameter   |             Return             |                                  Description |
| ---------------------- | :-----------: | :----------------------------: | -------------------------------------------: |
| allData(data,pageData) | Object,Object | {datas,index,count,rows,pages} | 如果后台返回的是全部数据，可以使用此方法处理 |

### 生命周期方法

---

# 其他配置以及用法

### 页面多分页表格

> pId: 'page-serial-js1',
> tId: 'table-serial-js1',

### 分页首页尾页 开启为 true

> ellipsis: false,

### 缩放系数

> tZoom: 1.5,
> pZoom: 1.5,

### 隐藏列属性 hidden

```js
{
    field: 'id',
    hidden: true,
    name: 'id',
},
```

### 格式化操作

```js
format: function(value,index,row,datas) {
        if(value == 1) {
            return '男'
        } else if(value == 2) {
            return '女'
        }
    }

```

### 添加序号

```js
// 第一种序号 每页都是从1开始
names: [
    {
        field: 'serialNumber',
        name: '序号',
        format:function(value,index,row,data) {
            return index + 1;
        }
    },
]
// 第二种方式 每页累加
names: [
    {
        field: 'serialNumber',
        name: '序号',
        format:function(value,index,row,data) {
            return this.count * (this.index -1) + 1;
        }
    },
]
```

# 待解决问题



# Version Iterator
### v1.0
1. initial

### v1.1
1. 插件样式调整

### v1.2
1. 调整表格表格的调用方式

### v1.3
1. 修复插件没有调用 load 方法还是会有分页
2. 插件没有固定高度的问题 已优化

### v1.4
1. 新增添加序号
2. 添加文档内容

### v1.5
1. 修复表格高度固定不正常问题(pad也要有内容)
2. 添加表格内容title

