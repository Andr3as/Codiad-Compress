/*
* Copyright (c) Codiad & Andr3as, distributed
* as-is and without warranty under the MIT License.
* See [root]/license.md for more information. This information must remain intact.
*/

(function(global, $){

    var codiad  = global.codiad,
        scripts = document.getElementsByTagName('script'),
        path    = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    $(function() {    
        codiad.Compress.init();
    });

    codiad.Compress = {
        
        path    : curpath,
        file    : "",
        settings: false,
        
        init: function() {
            var _this = this;
            $.getScript(this.path+"UglifyJS/uglifyjs.js");
            $.getScript(this.path+"cssmin.js");
            amplify.subscribe("context-menu.onShow", function(obj){
                var ext = _this.getExtension(obj.path);
                if (ext == "css" || ext == "js") {
                    $('#context-menu').append('<hr class="file-only compress">');
                    $('#context-menu').append('<a class="file-only compress" onclick="codiad.Compress.compress($(\'#context-menu\').attr(\'data-path\'));"><span class="icon-feather"></span>Compress</a>');
                }
            });
            amplify.subscribe("context-menu.onHide", function(){
                $('.compress').remove();
            });
            amplify.subscribe('active.onOpen', function(path){
                var manager = codiad.editor.getActive().commands;
                manager.addCommand({
                    name: 'Compress',
                    bindKey: {win: 'Ctrl-Alt-C', mac: 'Command-Alt-C'},
                    exec: function(e){
                        codiad.Compress.compress(path);
                    }
                });
            });
        },

        //////////////////////////////////////////////////////////
        //
        //  Compress code
        //
        //  Parameters:
        //
        //  path - {String} - File path
        //
        //////////////////////////////////////////////////////////
        compress: function(path) {
            var _this = this;
            this.file = path;
            var ext = this.getExtension(path);
            if (ext != "css" && ext != "js") {
                return false;
            }
            $.get(this.path+"controller.php?action=getContent&path="+path, function(code){
                //Minify code
                if (ext == "css") {
                    code = _this.minify(code);
                } else if (ext == "js") {
                    code = _this.uglify(code);
                }
                $.post(_this.path+"controller.php?action=compress"+ext.toUpperCase()+"&path="+path, {"code": code}, function(data){
                    data = JSON.parse(data);
                    if (data.status == "error") {
                        codiad.message.error(data.message);
                    } else {
                        codiad.message.success(data.message);
                        codiad.filemanager.rescan($('#project-root').attr('data-path'));
                    }
                });
            });
        },

        //////////////////////////////////////////////////////////
        //
        //  Use CSSmin to compress the file
        //
        //////////////////////////////////////////////////////////
        minify: function(code) {
            return YAHOO.compressor.cssmin(code);
        },

        //////////////////////////////////////////////////////////
        //
        //  Use UglifyJS to compress file
        //
        //////////////////////////////////////////////////////////
        uglify: function(code) {
            return UglifyJS.minify(code);
        },

        //////////////////////////////////////////////////////////
        //
        //  Get extension of the given file
        //
        //  Parameters:
        //
        //  path - {String} - File path
        //
        //////////////////////////////////////////////////////////
        getExtension: function(path) {
            return path.substring(path.lastIndexOf(".")+1);
        }
    };

})(this, jQuery);
