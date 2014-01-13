###FARR
`FARR`是一个很强悍的软件启动程序.有挺多的插件.不过都是很久以前的了...这两年发展貌似有点阻碍了.不过有一款插件`fscript`.可以支持使用一些脚本语言如:`javascript` `ruby` `python` 这样的话就可以做很多有意思的东西了.

有一个`delicious`的示例.根据这个示例,搞了如下的几个小工具.

###Pinboard

`Pinboard`类似于`delicious`.不过没有美味那么折腾.这个就是完全基于`delicious`来修改的.就是把`delicious`的`API`修改成了`Pinboard`的.

有如下的`alias`

* ps 从缓存中查找收藏的网页
* psu 更新缓存把查询
* pt 从缓存中查找tag标签
* ptu 更新tag的缓存,并查找


###v2ex
[V2EX](http://www.v2ex.com)是一个挺有意思的社区.所以制作了这个.可以查看v2ex上面最新的帖子,且支持一定程度的搜索.
* vn 查看v2ex上面最新的帖子.支持在这些帖子中搜索.
* 未完待续

###github

用来显示[github](http://github.com)上面加星的`repo`.支持搜索.利用了和`Pinboard`一样的方法,默认搜索的时候从本地的缓存里面.这样可以提高搜索的效率.

* gitstar 列出所有加星的repo
* git +star 可以更新本地端缓存