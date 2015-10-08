<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <title>股市向前冲</title>
    <meta name="viewport"
          content="width=device-width,initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no,minimal-ui,target-densitydpi=device-dpi"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta content="telephone=no" name="format-detection"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="full-screen" content="true"/>
    <meta name="screen-orientation" content="portrait"/>
    <meta name="x5-fullscreen" content="true"/>
    <meta name="360-fullscreen" content="true"/>
    <base href="../"/>
    <!--[if IE]><script type="text/javascript">
        // Fix for IE ignoring relative base tags.
        (function () {
            var baseTag = document.getElementsByTagName('base')[0];
            baseTag.href = baseTag.href;
        })();
    </script><![endif]-->
    <style>
        html,body{
            width:100%;
            height:100%;
        }
        body {
            font-family:'microsoft yahei,Arial,sans-serif';
            text-align: center;
            background: #000000;
            padding: 0;
            border: 0;
            margin: 0;
            height: 100%;
        }

        html {
            -ms-touch-action: none; /* Direct all pointer events to JavaScript code. */
            overflow: hidden;
        }

        div, canvas {
            display: block;
            position: absolute;
            margin: 0 auto;
            padding: 0;
            border: 0;
        }
    </style>
</head>
<body>
<div style="position:relative;" id="gameDiv"></div>
<script src="lanucher/bride.js"></script>
<script>var document_class = "Main";</script>
<!--这部分内容在编译时会被替换，要修改文档类，请到工程目录下的egretProperties.json内编辑。-->
<!--This part will be replaced during compiling, and to modify the document class, please go to the project directory and edit in the file of egretProperties. Jsonr-->


<script src="bin-debug/lib/egret_file_list.js"></script>
<script src="launcher/egret_require.js"></script>
<script src="launcher/egret_loader.js"></script>
<script src="bin-debug/src/game_file_list.js"></script>


<script>
    var support = [].map && document.createElement("canvas").getContext;
    if (support) {
        egret_h5.preloadScript(egret_file_list, "libs/");
        egret_h5.preloadScript(game_file_list, "bin-debug/src/");
        egret_h5.startLoading();
    }
    else {
        alert("Egret dose not support your current browser")
    }
</script>
<?php
// 判断是否为微信浏览器
if (strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false)
{
    include('../caizoushi/weixin/weixin.php');
}
?>
<script type="text/javascript" src="launcher/share.js"></script>

</body>
</html>
