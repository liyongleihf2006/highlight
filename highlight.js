/**
 * Created by LiYonglei on 2016/11/30.
 * option:
 *      container:要高亮的容器
 *      searchText = regexp/substr:要高亮的文本。
 *          regexp一个 RegExp 对象或者其字面量。该正则所匹配的内容会被第二个参数的返回值替换掉。
 *          substr 一个要被 newSubStr 替换的字符串。其被视为一整个字符串，而不是一个正则表达式。仅仅是第一个匹配会被替换.
 *      formatter = newSubStr/function (match,p1,p2, ...,offset,string):要格式化的返回的样式，
 *          newSubStr用于替换掉第一个参数在原字符串中的匹配部分的 字符串。该字符串中可以内插一些特殊的变量名。
 *          function一个用来创建新子字符串的函数，该函数的返回值将替换掉第一个参数匹配到的结果。
 *              match匹配的子串
 *              p1,p2,...假如searchText的第一个参数是一个RegExp 对象，则代表第n个括号匹配的字符串。（对应于上述的$1，$2等。）
 *              offset匹配到的子字符串在原字符串中的偏移量。（比如，如果原字符串是“abcd”，匹配到的子字符串时“bc”，那么这个参数将是1）
 *              string被匹配的原字符串
 *     i.e.上述的参数regexp/substr和newSubStr/function (match,p1,p2, ...,offset,string),
 *     其实就是String.prototype.replace()的两个参数 url:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
 */
function highlight(option){
    var container = option.container;
    var searchText = option.searchText;
    var formatter = option.formatter;
    clearHighlight(container);
    highlighting(container);
    function clearHighlight(ele){
        if(ele.classList.contains("highlight")){
            var newEle = document.createTextNode(ele.textContent);
            ele.parentNode.replaceChild(newEle,ele);
        }else{
            Array.prototype.forEach.call(ele.children,function(element){
                clearHighlight(element);
            })
        }
    }
    function highlighting(node){
        if(node.nodeType==1){
            Array.prototype.forEach.call(node.childNodes,function(node){
                highlighting(node);
            })
        };
        if(node.nodeType==3){
            if(searchText instanceof RegExp){
                var reg = searchText;
            }else if(typeof searchText === "string"){
                var reg = new RegExp(searchText,"gim");
            }else{
                throw new Error("sorry,your Matching format is error,you should users string or regexp");
            }
            if(reg.test(node.textContent)){
                var content=node.textContent.replace(reg,function(){
                    return formatter.apply(null,arguments);
                });
                var newNode = document.createElement("span");
                newNode.classList.add("highlight");
                newNode.innerHTML=content;
                node.parentNode.replaceChild(newNode,node);
            }
        }
    }
}