

function /* 可自行扩展 */ PKit(options) {
    _lifecycle.call(this, options);
    this.beforeCreate();

    // 初始化表格和分页参数
    // 扩展核心业务
    _extensionCore.call(this, options)
    _extensionCorePage.call(this, options);
    _extensionCoreTable.call(this, options);

    // 其他扩展
    this.isUOrN = isUOrN;

    // 隐藏列
    this.PKit_inset_hidden = PKit_inset_hidden;
    // 排序
    this.PKit_inset_sortHtml = PKit_inset_sortHtml;
    this.PKit_inset_sortJs = PKit_inset_sortJs;
    this.PKit_inset_sortActive = PKit_inset_sortActive;
    this.PKit_inset_sortData = PKit_inset_sortData;
    this.PKit_inset_sort = PKit_inset_sort;
    this.PKit_inset_sortPriority = PKit_inset_sortPriority;

    // 初始化完成 构建之前
    this.created();

    // 挂载之前
    this.beforeMount();

    // 分页
    if (options.page) {
        _buildPage.call(this);
        this.openEllipsisMode();
        this.pHtml();
        this.pJs();
        this.pScale();
    }
    // 表格
    if (options.table) {
        _buildTable.call(this);
        this.tAddToDom();
        this.tHead();
        this.tBody();
        this.tScale();
        // 固定高度 必须放到scale后面
        this.fixHeight();
    }




    this.PKit_inset_sortJs();

    // 挂载完成
    this.mounted();

    // 扩展业务
    this.renderPage = _renderPage;
    this.renderTable = _renderTable;
    // 添加 如果是全部数据
    this.allData = outer_allData;

}
function /* 表格核心扩展方法 */ _extensionCoreTable(options) {
    var table = options.table;
    if (!table) return;
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
                format: function(value,index,row) {

                }
            }
        ]
    */

    // 缩放因子
    this.tZoom = table.tZoom ? table.tZoom : 1;

    this.tCheck = function () {

    }
    this.tCheck();


}
function /* 表格结构核心业务 */ _buildTable() {
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

    // 添加到dom中
    this.tAddToDom = function () {
        document.querySelector(this.tContainer).innerHTML = html.join('').trim();
        this.tableDom = document.getElementById(this.tId);
        this.theadDom = this.tableDom.querySelector('.table-thead');
        this.tbodyDom = this.tableDom.querySelector('.table-tbody');
    };


    this.tHead = function () {
        var html = [];
        html.push("<tr class='table-tr-equal table-tr-head'>");
        this.names.forEach(function (item, i) {
            html.push(
                "<td class='table-td-equal table-td-head " + this.PKit_inset_hidden(item) + "'>" +
                item.name +
                this.PKit_inset_sortHtml(item) +
                "</td>"
            )
        }, this);
        html.push("</tr>")
        this.tableDom.querySelector('.table-thead').innerHTML = html.join('').trim();
    };
    this.tBody = function () {
        // 为了固定tbody的高度
        var html = [];
        html.push("<tr class='table-tr-equal table-tr-head table-tr-pad'>");
        html.push("<td class='table-td-equal table-td-body' colspan='100'>pad</td>");
        html.push("</tr>")
        this.tableDom.querySelector('.table-tbody').innerHTML = html.join('').trim();
    }

    // 缩放
    this.tScale = function (zoom) {
        var tZoom = zoom ? zoom : this.tZoom;
        var fontSize = window.getComputedStyle(this.tableDom, null).getPropertyValue('font-size');
        this.tableDom.style.fontSize = parseInt(fontSize) * tZoom + 'px';
    }
}
function /* 表格渲染业务 核心方法 */ _renderTable(data) {
    // 全部渲染开始之前
    this.beforeUpdate(data);
    // 记录传入的数据
    var datas = this.PKit_inset_sortPriority();
    var html = [];
    var value;
    var title;
    datas.forEach(function (item, i) {
        html.push("<tr class='table-tr-equal table-tr-body'>")
        this.names.forEach(function (citem, ci) {
            /* 
            modify: 
            1. 如果对象无此字段或者为undefined 那么显示为 ''
            2. 如果是删除 修改 查看 此类型的 那么只可以 只用用format返回a标签绑定事件， 
            3. 之所以不写 是因为要使得插件轻量化
            */
            // if (item.hasOwnProperty(citem.field)) {
            // 如果值为undefined或者为null
            value = this.isUOrN(item[citem.field]);
            if (citem.format) {
                value = citem.format.call(this, value, i, item, datas);
            }
            title = value.toString().match(/<|>/g) ? '' : value;
            html.push(
                "<td class='table-td-equal table-td-body " + (citem.hidden ? 'table-td-hidden' : '') + "'" +
                "title='" + title + "'>" +
                value +
                "</td>"
            )
            // } else {
            //     console.error('Caught ServerError: Object Field Deficiency!')
            // }
        }, this);
        html.push("</tr>")
    }, this);
    this.padTr = function () {
        if (datas.length > 0) {
            var pad = this.count - datas.length;
            while (pad > 0) {
                pad--;
                html.push("<tr class='table-tr-equal table-tr-body table-tr-pad'>");
                html.push("<td class='table-td-equal table-td-body' colspan='100'>pad</td>");
                html.push("</tr>");
            }
        }
    };
    this.nodata = function () {
        if (datas.length == 0) {
            // 暂无数据
            html.push("<tr class='table-tr-equal table-tr-body'>");
            html.push("<td class='table-td-equal table-td-body table-td-nodata' colspan='100'>暂无数据</td>");
            html.push("</tr>");
        }
    }
    this.tbodyAddToDom = function () {
        this.tbodyDom.innerHTML = html.join('').trim();
    }
    // 表格渲染结束
    this.updated(data);
}
function /* 分页核心扩展方法 */ _extensionCorePage(options) {
    // 业务扩展
    /* 
        1. 多个表格时 ： 需要用户自定义id
        2. 页码数： nums
    */
    var page = options.page;
    if (!page) return;

    this.pId = page.pId ? page.pId : 'page-serial-js';

    // 页码
    this.nums = page.nums ? page.nums : 5;

    // 一页显示多少条数据
    this.count = page.count ? page.count : 5;

    // 默认开始查询第几页  
    this.index = page.index ? page.index : 1;

    this.ellipsis = page.ellipsis;

    // 容器选择器
    this.pContainer = page.pContainer;


    // 缩放因子
    this.pZoom = page.pZoom ? page.pZoom : 1;

    // 跳转页
    this.pSkip = page.pSkip;

    // 校验
    this.pCheck = function () {

    }
    this.pCheck();
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
            "<li class='page-next page-equal'>下一页</li>"
        );
        var skipClass = this.pSkip ? '' : 'page-skip-hidden';
        html.push(
            "<li class='page-skip-equal page-skip-text " + skipClass + "'>跳转</li>"
        );
        html.push(
            "<li class='page-skip-equal page-skip-input " + skipClass + "'>" +
            "<input value='' class='page-skip page-skip-enter'>" +
            "</li>"
        );
        html.push(
            "<li class='page-skip-equal page-skip-text " + skipClass + "'>页</li>"
        );
        html.push(
            "</ul>" +
            "</div>"
        )
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
        // 跳转
        this.skipDom = this.pageDom.querySelector('.page-skip');

        var that = this;
        // 内聚
        var handle = {
            handleEvent(e) {
                var current = e.currentTarget;
                // 获取当前页
                var cindex = Number(that.wrapperDom.dataset.index);
                // 总页数
                var pages = that.wrapperDom.dataset.pages;
                switch (e.type) {
                    case 'click':
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
                        }
                        break;
                    case 'keyup':
                        if (current.classList.contains('page-skip')) {
                            if (e.keyCode != 13) return;
                            var label = Number(current.value);
                            // 排除 字符串的情况
                            if (!label) return;
                            if (label == cindex) return;
                            that.index = label;
                            that.load();
                        };
                        break;
                    case 'input':
                        if (current.classList.contains('page-skip')) {
                            // 不能输入数字和空字符串以外的
                            var label = current.value;
                            if (label === '') return;
                            if (!/^\d+$/.test(label)) {
                                current.value = 1;
                                return;
                            }
                            // 为什么Number不放到上面  因为会将空字符串转成数字0
                            label = Number(label);
                            // 修正数字
                            if (label < 1) current.value = 1;
                            else if (label > pages) current.value = pages;
                        };
                        break;
                }
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
        this.skipDom.addEventListener('keyup', handle, handle.configurate);
        this.skipDom.addEventListener('input', handle, handle.configurate);
    }

    // 缩放
    this.pScale = function (zoom) {
        var pZoom = zoom ? zoom : this.pZoom;
        var fontSize = window.getComputedStyle(this.pageDom, null).getPropertyValue('font-size');
        this.pageDom.style.fontSize = parseInt(fontSize) * pZoom + 'px';
    }
}
function /* 分页渲染业务 分页核心方法 */ _renderPage(data) {
    // 全部渲染开始之前
    this.beforeUpdate(data);

    this.index = data.index;
    this.rows = data.rows;
    this.pages = data.pages;

    this.numLabel = this.pageDom.querySelectorAll('.page-num');
    // ellipsis 省略号
    this.ellipsisLeftDom = this.pageDom.querySelector('.page-ellipsis-left');
    this.ellipsisRightDom = this.pageDom.querySelector('.page-ellipsis-right');
    // 隐藏所有页标
    hideNums.call(this);

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
                shwoNum(item);
            }
            hideLeft.call(this)
            hideRight.call(this);
        }, this);
    } else {
        // 显示所有页标
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
        // 如果开启ellipMode那么上面有bug

        // 求得最小值和最大值
        if (min <= 1) {
            min = 1;
            hideLeft.call(this);
            showRight.call(this);
            // 如果最小值为1 以最小值为准
            Array.prototype.forEach.call(sliceNumLabel.call(this, 'min'), function (item, i) {
                i = min + i;
                item.dataset.index = i;
                item.textContent = i;
                shwoNum(item);
            }, this);
        } else if (max >= this.pages) {
            max = this.pages;
            hideRight.call(this);
            showLeft.call(this);
            // 如果最大值为this.pages 以最大值为准
            Array.prototype.forEach.call(sliceNumLabel.call(this, 'max'), function (item, i) {
                // 解决ellipsis 页码不对的问题
                var increment = 0;
                if (this.ellipsisMode) increment = 2;
                i = max - this.nums + i + 1 + increment;
                item.dataset.index = i;
                item.textContent = i;
                shwoNum(item);
            }, this);
        } else {
            // 不可能同时满足上面两个条件 因为this.pages>this.nums
            showLeft.call(this);
            showRight.call(this);
            Array.prototype.forEach.call(sliceNumLabel.call(this, 'mid'), function (item, i) {
                // 解决ellipsis 页码不对的问题
                var increment = 0;
                if (this.ellipsisMode) increment = 2;
                i = min + i + increment;
                item.dataset.index = i;
                item.textContent = i;
                shwoNum(item);
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

    // 方法内部使用的功能方法
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
    // 显示页标
    function shwoNum(item) {
        item.style.display = 'block';
    }
    // 隐藏所有页标
    function hideNums() {
        this.numLabel.forEach(function (item) { item.style.display = 'none' })
    }
    function sliceNumLabel(type) {
        if (!this.ellipsisMode) return [...this.numLabel];
        else {
            switch (type) {
                case 'min':
                    return [...this.numLabel].slice(0, this.numLabel.length - 2)
                case 'mid':
                    return [...this.numLabel].slice(2, this.numLabel.length - 2)
                case 'max':
                    return [...this.numLabel].slice(2, this.numLabel.length)
            }
        }
    }
    // 全部渲染结束
    this.updated(data)
}
function /* 核心扩展 */ _extensionCore(options) {
    // 重写load方法  数据加载方法
    this.load = function (pageData, insideCallback) {
        if (insideCallback) {
            // 内部调用
            insideCallback.call(this);
        } else {
            // 外部调用
            pageData = pageData || this.pageData();
            options.load.call(this, pageData);
        }

    };
    this.pageData = function (custom = {}) {
        return {
            index: this.index,
            count: this.count,
            ...custom,
        }
    };

    // 记录渲染之前进度 beforeUpdate
    this.beforeProgress = 0;
    this.maxBeforeProgress = 1;
    // 记录渲染进度 updated
    this.progress = 0;
    this.maxProgress = 2;


    // 分页隐藏
    this.pHide = function () {
        this.pageDom.style.display = 'none';
    }
    // 表格隐藏
    this.tHide = function () {
        this.tableDom.style.display = 'none';
    }
    // 插件废弃
    this.dead = function () {
        this.beforeDestory();
        document.querySelector(this.pContainer).removeChild(this.pageDom);
        document.querySelector(this.tContainer).removeChild(this.tableDom);
        this.destoryed();
    }
    // 固定高度 没有数据的情况下
    this.fixHeight = function () {
        var hiddenTrDom = this.tableDom.querySelector('.table-tr-pad');
        var hh = window.getComputedStyle(this.theadDom, null).getPropertyValue('height');
        // tr-hidden 高度
        var htr = window.getComputedStyle(hiddenTrDom, null).getPropertyValue('height');
        // 获取字体大小
        var fontSize = window.getComputedStyle(this.tableDom, null).getPropertyValue('font-size');
        // 固定tbody的高度
        // this.tableDom.style.height = (parseFloat(hh) + parseFloat(htr)  * this.count )/parseFloat(fontSize) + 'em';
        this.tableDom.querySelector('.table-wrapper').style.height = Math.round((parseFloat(hh) + parseFloat(htr) * this.count) / parseFloat(fontSize)) + 'em';
    }
    // 如果开启ellipsis模式
    this.ellipsisMode = false;
    this.openEllipsisMode = function () {
        if (this.ellipsis) {
            this.nums = this.nums + 4;
            this.ellipsisMode = true;
        }
    }

    // 保存排序后的datas  下次数据改变之前清空  放到beforeUpdate
    this.sortDatas = [];
    // 排序类
    this.sortActiveClassName = 'sort-equal-active';
    // 记录排序状态的高亮的元素
    this.sortDom = null;

    this.check = function () {

    }
    this.check();
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
    this.beforeUpdate = function (data) {
        this.beforeProgress++;
        if (this.beforeProgress == this.maxBeforeProgress) {
            // 替换并保存原数据
            if (data) this.datas = data.datas;
            // 如果处于排序状态那么就排序
            if (this.sortDom) this.PKit_inset_sortData();
            return options.beforeUpdate && options.beforeUpdate.call(this);
        }

    }
    this.updated = function () {
        this.progress++;
        if (this.progress >= this.maxProgress) {
            // 不一定是表格 
            if (options.table) {
                // 填充为了保证表格高度固定
                this.padTr();
                // 如果没有数据数据的情况下
                this.nodata();
                this.tbodyAddToDom();
            }
            var re = options.updated && options.updated.call(this);
            // 执行完一波生命周期方法 复原
            this.beforeProgress = 0;
            this.progress = 0;
            this.maxBeforeProgress = 1;
            this.maxProgress = 2;
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

/* 
    外部使用的扩展
*/

function /* 数据处理方面的扩展 */ outer_allData(data, request) {
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

/* 
    内部使用的扩展
*/

function /* 隐藏扩展 */ PKit_inset_hidden(item) {
    if (item.hidden) return 'table-td-hidden';
    else return '';
}
function /* 排序扩展 */ PKit_inset_sortHtml(item) {

    // 为了防止类名冲突 并规定类名
    var upClassName = item.field + '_sort_up';
    var downClassName = item.field + '_sort_down';
    if (item.sort) {
        return "<span class='sort-equal'><i class='iconfont icon-paixu-shang sort-up " + upClassName + "' data-sort='up' data-field='" + item.field + "'></i>" +
            "<i class='iconfont icon-paixu-xia sort-down " + downClassName + "' data-sort='down' data-field='" + item.field + "'></i></span>"
    } else return '';
}
function /* 排序绑定事件 */ PKit_inset_sortJs() {
    this.names.forEach(function (item) {
        var upDom, downDom, upClassName, downClassName, activeClass = this.sortActiveClassName;
        if (item.sort) {
            upClassName = item.field + '_sort_up';
            downClassName = item.field + '_sort_down';
            upDom = this.tableDom.querySelector('.' + upClassName);
            downDom = this.tableDom.querySelector('.' + downClassName);
            upDom.addEventListener('click', handle.bind(this));
            downDom.addEventListener('click', handle.bind(this));
        }
        function handle(e) {
            var current = e.currentTarget;
            // 高亮
            if (current.classList.contains(activeClass)) {
                // 取消高亮 取消排序
                this.PKit_inset_sortActive(1);
            } else {
                this.sortDom = current;
                // 取消之前的排序 并进行之后的数据渲染
                this.PKit_inset_sortActive(2);
            }
        }
    }, this);
}
function /* 取消排序 渲染数据以及改变高亮*/ PKit_inset_sortActive(type) {
    /* 
        两种类型： 1. 取消排序  2. 取消排序后继续排序
    */
    // 获取高亮效果的元素
    var last = this.tableDom.querySelector('.' + this.sortActiveClassName);
    // 取消高亮
    last && last.classList.remove(this.sortActiveClassName);
    if (type == 1) {
        this.sortDatas.length = 0;
        this.sortDom = null;
    } else if (type == 2) {
        // 添加高亮效果的元素
        var current = this.sortDom;
        current.classList.add(this.sortActiveClassName);
    }
    this.load(null, function () {
        this.maxBeforeProgress = 1;
        this.maxProgress = 1;
        this.renderTable({ datas: this.datas });
    });

}
function /* 排序 仅仅改变排序数据 */ PKit_inset_sortData() {
    // 当前排序的元素
    var current = this.sortDom;
    var field = current.dataset.field;
    var item;
    var datas = [];
    // 克隆数组 不然指向同一个对象 会相互影响
    this.datas.forEach(function (item) {
        datas.push(item);
    }, this);
    // 不需要返回值 因为sort会改变原数组
    for (var i = 0, length = this.names.length; i < length; i++) {
        if (this.names[i].field == field) {
            item = this.names[i];
            break;
        }
    }
    if (current.dataset.sort == 'up') {
        if (item.up) {
            item.up(datas, item);
        } else {
            this.PKit_inset_sort(datas, item, 'up')
        }
    } else if (current.dataset.sort == 'down') {
        if (item.down) {
            item.down(datas, item);
        } else {
            this.PKit_inset_sort(datas, item, 'down')
        }
    }
    this.sortDatas = datas;
}
function /* 排序方法 */ PKit_inset_sort(datas, item, type) {
    var field = item.field;
    switch (item.sort) {
        case 'digit':
            digit.call(this);
        case 'chinese':
            chinese.call(this);
        default:
            digit.call(this);
    }

    function digit() {
        if (type == 'up') {
            datas.sort(function (a, b) {
                // 升序 从小到大
                return this.isUOrN(a[field]) - this.isUOrN(b[field])
            })
        } else if (type == 'down') {
            // 降序 从大到小
            datas.sort(function (a, b) {
                return this.isUOrN(b[field]) - this.isUOrN(a[field])
            })
        }
    }
    function chinese() {
        if (type == 'up') {
            datas.sort(function (a, b) {
                // 升序 从小到大
                return this.isUOrN(a[field]).localeCompare(this.isUOrN(b[field]));
            })
        } else if (type == 'down') {
            // 降序 从大到小
            datas.sort(function (a, b) {
                return this.isUOrN(b[field]).localeCompare(this.isUOrN(a[field]));
            })
        }
    }

}
function /* 排序数据优先原则 */ PKit_inset_sortPriority() {

    if (this.sortDom && this.sortDatas.length) return this.sortDatas;
    else return this.datas;
}
function /* 转换undefined以及null */ isUOrN(val) {
    if (val == undefined) return '';
    else return val;
}








