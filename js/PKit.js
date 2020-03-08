

function /* 可自行扩展 */ PKit(options) {
    _lifecycle.call(this, options);
    this.beforeCreate();

    // 初始化表格和分页参数
    // 扩展核心业务
    _extensionCore.call(this, options)
    this.check();
    _extensionCorePage.call(this, options);
    this.pCheck();
    _extensionCoreTable.call(this, options);
    this.tCheck();

    // 初始化完成
    this.created();

    // 构建之前
    this.beforeMount();

    // 分页
    _buildPage.call(this);
    this.pHtml();
    this.pJs();
    this.pScale();

    // 表格
    _buildTable.call(this);
    this.tAddToDom();
    this.tHead();
    this.tScale();

    // 构建完成
    this.mounted();

    // 扩展业务
    this.renderPage = _renderPage;
    this.renderTable = _renderTable;

    // 添加 如果是全部数据
    this.allData = _allData;



}

function /* 表格核心扩展方法 */ _extensionCoreTable(options) {
    var table = options.table;

    // 选择器
    this.tContainer = table.tContainer;

    // 表格id 
    this.tId = table.tId ? table.tId : 'table-serial-js';

    // 字段列表
    this.names = table.names;
    /* 
        [
            {
                field: 'id',
                hidden: true,
                name:'ID'
                
            },
            {
                field: 'name'
                name: '姓名',
                formatter: function(value,index,row) {

                }
            }
        ]
    */

    // 缩放因子
    this.tZoom = table.tZoom ? table.tZoom : 1;

    this.tCheck = function () {

    }


}
function /* 构建表格核心业务 */ _buildTable() {
    var html = [];
    html.push("<div id='" + this.tId + "' class='table-serial-css'>")
    html.push("<table class='table-wrapper'>");
    html.push("<caption class='table-caption'></caption>");
    html.push("<thead class='table-thead'>");
    html.push("</thead>");
    html.push("<tbody class='table-tbody'></tbody>");
    html.push("<tfoot class='table-tfoot'></tfoot>");
    html.push("</table>");
    html.push("</div>")


    // 第一行 选择 或者 序号 后期开发
    this.tExtraFrist = function () {
        if (this.serialNumber) {

        } else if (this.choosable) {

        }
    };

    this.tHead = function () {
        var html = [];
        html.push("<tr class='table-tr-equal table-tr-head'>");
        this.names.forEach(function (item, i) {
            html.push(
                "<td class='table-td-equal table-td-head " + (item.hidden ? 'table-td-hidden' : '') + "'>" +
                item.name +
                "</td>"
            )
        }, this);
        html.push("</tr>")
        this.tableDom.querySelector('.table-thead').innerHTML = html.join('').trim();
    };


    // 添加到dom中
    this.tAddToDom = function () {
        document.querySelector(this.tContainer).innerHTML = html.join('').trim();
        this.tableDom = document.getElementById(this.tId);
    };

    // 缩放
    this.tScale = function (zoom) {
        var tZoom = zoom ? zoom : this.tZoom;
        var fontSize = window.getComputedStyle(this.tableDom, null).getPropertyValue('font-size');
        this.tableDom.style.fontSize = parseInt(fontSize) * tZoom + 'px';
    }
}

function /* 表格渲染业务 核心方法 */ _renderTable(data) {
    var datas = data.datas;
    var html = [];
    var value, tbodyDom = this.tableDom.querySelector('.table-tbody');

    datas.forEach(function (item, i) {
        html.push("<tr class='table-tr-equal table-tr-body'>")
        this.names.forEach(function (citem, ci) {
            if (item.hasOwnProperty(citem.field)) {
                value = item[citem.field];
                if (citem.formatter) {
                    value = citem.formatter(value, i, item, datas);
                }
                html.push(
                    "<td class='table-td-equal table-td-body " + (citem.hidden ? 'table-td-hidden' : '') + "'>" +
                    value +
                    "</td>"
                )
            } else {
                console.error('Caught ServerError: Object Field Deficiency!')
            }
        });
        html.push("</tr>")
    }, this);
    tbodyDom.innerHTML = html.join('').trim();
    // 表格渲染结束
    this.updated();
}

function /* 分页结构业务 分页核心方法 */ _buildPage() {

    // 添加结构
    this.pHtml = function () {
        var html = [];
        var show = 'none';
        html.push(
            "<div class='page-serial-css' id='" + this.pId + "'>" +
            "<ul class='page-wrapper' data-index='1' data-rows='35' data-pages='7'>" +
            "<li class='page-prev page-equal page-disabled'>上一页</li>"
        );

        if (this.ellipsis) {
            // 首页
            html.push(
                "<li style='display: " + show + ";' class='page-first page-equal' data-index='1'>1</li>"
            )
            html.push(
                "<li style='display: " + show + ";' class='page-ellipsis-left page-equal'>" + this.ellipsis + "</li>"
            );
        }
        for (var i = 1; i <= this.nums; i++) {
            var activeClass = ' page-active';
            if (i !== 1) activeClass = '';
            html.push(
                "<li class='page-num page-equal" + activeClass + "' data-index='" + i + "'>" + i + "</li>"
            );
        };
        if (this.ellipsis) {
            html.push(
                "<li style='display: " + show + ";' class='page-ellipsis-right page-equal'>" + this.ellipsis + "</li>"
            );
            // 尾页
            html.push(
                "<li style='display: " + show + ";' class='page-last page-equal' data-index='7'>7</li>"
            )
        }

        html.push(
            "<li class='page-next page-equal'>下一页</li>" +
            "</ul>" +
            "</div>"
        );
        document.querySelector(this.pContainer).innerHTML = html.join('').trim();
    }

    // 绑定事件
    this.pJs = function () {
        this.pageDom = document.getElementById(this.pId);
        // 首页
        this.firstDom = this.pageDom.querySelector('.page-first');
        // 尾页
        this.lastDom = this.pageDom.querySelector('.page-last');
        // 上一页
        this.prevDom = this.pageDom.querySelector('.page-prev');
        // 下一页
        this.nextDom = this.pageDom.querySelector('.page-next');
        // 页标
        this.numLabel = this.pageDom.querySelectorAll('.page-num');
        // 包裹
        this.wrapperDom = this.pageDom.querySelector('.page-wrapper');

        var that = this;
        // 内聚
        var handle = {
            handleEvent(e) {
                var current = e.currentTarget;
                // 获取当前页
                var cindex = Number(that.wrapperDom.dataset.index);
                // 总页数
                var pages = that.wrapperDom.dataset.pages;
                if (current.classList.contains('page-prev')) {
                    if (cindex == 1) return;
                    that.index = cindex - 1;
                    that.load();
                } else if (current.classList.contains('page-next')) {
                    if (cindex == pages) return;
                    that.index = cindex + 1;
                    that.load();
                } else if (current.classList.contains('page-num')) {
                    // 获取页标数字
                    var label = Number(current.dataset.index);
                    if (label == cindex) return;
                    that.index = label;
                    that.load();
                } else if (current.classList.contains('page-first')) {
                    var label = Number(current.dataset.index);
                    if (label == cindex) return;
                    that.index = label;
                    that.load();
                } else if (current.classList.contains('page-last')) {
                    var label = Number(current.dataset.index);
                    if (label == cindex) return;
                    that.index = label;
                    that.load();
                };
            },
            configurate: {
                once: false,
                capture: false,
                passive: false,
            }
        };
        this.firstDom && this.firstDom.addEventListener('click', handle, handle.configurate);
        this.lastDom && this.lastDom.addEventListener('click', handle, handle.configurate);
        this.prevDom.addEventListener('click', handle, handle.configurate);
        this.nextDom.addEventListener('click', handle, handle.configurate);
        Array.prototype.forEach.call(this.numLabel, function (item) {
            item.addEventListener('click', handle, handle.configurate);
        }, this);
    }

    // 缩放
    this.pScale = function (zoom) {
        var pZoom = zoom ? zoom : this.pZoom;
        var fontSize = window.getComputedStyle(this.pageDom, null).getPropertyValue('font-size');
        this.pageDom.style.fontSize = parseInt(fontSize) * pZoom + 'px';
    }
}

function /* 分页核心扩展方法 */ _extensionCorePage(options) {
    // 业务扩展
    /* 
        1. 多个表格时 ： 需要用户自定义id
        2. 页码数： nums
    */
    var page = options.page;

    this.pId = page.pId ? page.pId : 'page-serial-js';

    // 页码
    this.nums = page.nums ? page.nums : 5;

    // 一页显示多少条数据
    this.count = page.count ? page.count : 5;

    // 默认开始查询第几页  
    this.index = page.index ? page.index : 1;

    this.ellipsis = page.ellipsis !== undefined ? page.ellipsis : '...';

    // 容器选择器
    this.pContainer = page.pContainer;



    // 缩放因子
    this.pZoom = page.pZoom ? page.pZoom : 1;

    // 校验
    this.pCheck = function () {

    }
}

function /* 分页渲染业务 分页核心方法 */ _renderPage(data) {

    this.index = data.index;
    this.rows = data.rows;
    this.pages = data.pages;

    this.numLabel = this.pageDom.querySelectorAll('.page-num');
    // ellipsis 省略号
    this.ellipsisLeftDom = this.pageDom.querySelector('.page-ellipsis-left');
    this.ellipsisRightDom = this.pageDom.querySelector('.page-ellipsis-right');
    // 中间数 this.nums的中间
    var mid,
        // 视口的最大页标和最小页标
        max,
        min;
    if (this.nums >= this.pages) {
        Array.prototype.forEach.call(this.numLabel, function (item, i) {
            i = i + 1;
            if (i <= this.pages) {
                item.dataset.index = i;
                item.textContent = i;
            } else {
                item.style.display = 'none';
            }
            hideLeft.call(this)
            hideRight.call(this);
        }, this);

    } else {
        if (this.nums % 2 == 0) {
            // 偶数
            mid = this.nums / 2;
            min = this.index - mid + 1;
            max = this.index + mid;
        } else {
            // 奇数
            mid = Math.ceil(this.nums / 2);
            min = this.index - mid + 1;
            max = this.index + mid - 1;
        }
        // 求得最小值和最大值
        if (min <= 1) {
            min = 1;
            hideLeft.call(this);
            showRight.call(this);
            // 如果最小值为1 以最小值为准
            Array.prototype.forEach.call(this.numLabel, function (item, i) {
                i = min + i;
                item.dataset.index = i;
                item.textContent = i;
            }, this);
        } else if (max >= this.pages) {
            max = this.pages;
            hideRight.call(this);
            showLeft.call(this);
            // 如果最大值为this.pages 以最大值为准
            Array.prototype.forEach.call(this.numLabel, function (item, i) {
                i = max - this.nums + i + 1;
                item.dataset.index = i;
                item.textContent = i;
            }, this);
        } else {
            // 不可能同时满足上面两个条件 因为this.pages>this.nums
            showLeft.call(this);
            showRight.call(this);
            Array.prototype.forEach.call(this.numLabel, function (item, i) {
                i = min + i;
                item.dataset.index = i;
                item.textContent = i;
            }, this);
        }
    }
    // wrap赋值
    this.wrapperDom.dataset.index = this.index;
    this.wrapperDom.dataset.nums = this.rows;
    this.wrapperDom.dataset.count = this.count;
    this.wrapperDom.dataset.pages = this.pages;
    // disabled
    this.prevDom.classList.remove('page-disabled');
    this.nextDom.classList.remove('page-disabled');
    if (this.index == 1) {
        this.prevDom.classList.add('page-disabled');
    }
    if (this.index == this.pages) {
        this.nextDom.classList.add('page-disabled');
    }
    // active
    Array.prototype.forEach.call(this.numLabel, function (item) {
        var cindex = item.dataset.index;
        if (cindex == this.index) item.classList.add('page-active');
        else item.classList.remove('page-active');
    }, this);

    function hideLeft() {
        this.ellipsisLeftDom && (this.ellipsisLeftDom.style.display = 'none');
        this.firstDom && (this.firstDom.style.display = 'none');
    }
    function showLeft() {
        this.ellipsisLeftDom && (this.ellipsisLeftDom.style.display = 'block');
        if (this.firstDom) {
            this.firstDom.style.display = 'block';
            // 设置值
            this.firstDom.dataset.index = 1;
            this.firstDom.textContent = 1;
        }
    }
    function hideRight() {
        this.ellipsisRightDom && (this.ellipsisRightDom.style.display = 'none');
        this.lastDom && (this.lastDom.style.display = 'none');
    }
    function showRight() {
        this.ellipsisRightDom && (this.ellipsisRightDom.style.display = 'block');
        if (this.lastDom) {
            this.lastDom.style.display = 'block';
            this.lastDom.dataset.index = this.pages;
            this.lastDom.textContent = this.pages;
        }
    }
    // 分页渲染结束
    this.updated()
}


function /* 核心扩展 */ _extensionCore(options) {
    // 重写load方法  数据加载方法
    this.load = function (pageData) {
        // 数据更新之前
        this.beforeUpdate();
        pageData = pageData || this.pageData();
        options.load.call(this,pageData);
    };
    this.pageData = function () {
        return {
            index: this.index,
            count: this.count,
        }
    };
    // 记录渲染进度
    this.progress = 0;

    // 分页隐藏
    this.pHide = function() {
        this.pageDom.style.display = 'none';
    }
    // 表格隐藏
    this.tHide = function() {
        this.tableDom.style.display = 'none';
    }
    // 插件废弃
    this.dead = function() {
        this.beforeDestory();
        document.querySelector(this.pContainer).removeChild(this.pageDom);
        document.querySelector(this.tContainer).removeChild(this.tableDom);
        this.destoryed();
    }
    this.check = function () {

    }
}
function /* 生命周期 */ _lifecycle(options) {
    // 重写方法
    this.beforeCreate = function () {
        return options.beforeCreate && options.beforeCreate.call(this);
    }
    this.created = function () {
        return options.created && options.created.call(this);
    }
    this.beforeMount = function () {
        return options.beforeMount && options.beforeMount.call(this);
    }
    this.mounted = function () {
        return options.mounted && options.mounted.call(this);
    }
    this.beforeUpdate = function () {
        return options.beforeUpdate && options.beforeUpdate.call(this);
    }
    this.updated = function () {
        this.progress++;
        if (this.progress >= 2) {
            var re = options.updated && options.updated.call(this);
            this.progress = 0;
            return re;
        }
    }
    this.beforeDestory = function () {
        return options.beforeDestory && options.beforeDestory.call(this);
    }
    this.destoryed = function () {
        return options.destoryed && options.destoryed.call(this);
    }
}



function /* 数据处理方面的扩展 */ _allData(data, request) {
    // 传进来的
    var index = request.index,
        count = request.count,
        // 计算的出的
        rows = data.length,
        pages = Math.ceil(rows / count);
    // 返回数据
    return {
        datas: data.slice((index - 1) * count, index * count >= rows ? rows : index * count),
        index: index,
        count: count,
        rows: rows,
        pages: pages,
    }
}







